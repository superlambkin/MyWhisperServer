# MyWhisperServer ソースコードレビュー報告書

- 実施日: 2026-08-22
- 対象: `whisper_server.py` / `dashboard/app.py` / `dashboard/static/js/app.js` / `dashboard/static/index.html` / `dashboard/static/css/style.css`
- レビュー観点: バグ / セキュリティ / パフォーマンス / 堅牢性

## サマリ

| # | 深刻度 | 対象 | 内容 | 対応 |
|---|---|---|---|---|
| 1 | **High** | app.py:790 | LLM プロファイル部分更新で `api_key` が空で上書き（データ消失） | ✅ 修正済み |
| 2 | **Medium** | whisper_server.py:218 | `/asr` の一時ファイルがアップロード失敗時にリーク | ✅ 修正済み |
| 3 | **Medium** | whisper_server.py | `/asr` にアップロードサイズ上限なし（ディスク肥大） | ✅ 修正済み（1GB 上限） |
| 4 | High | app.py 全ルート + 0.0.0.0 | 認証なし・LAN 公開 → 制御系 API を誰でも操作可能 | 要対応（推奨） |
| 5 | High | app.py:1012 / 748 | API キーが平文で `GET /api/v1/config`・`/api/v1/llm/profiles` に返る | 要対応（推奨） |
| 6 | Medium | whisper_server.py:41 | 並行 `/asr` でグローバル `progress_percent` を共有、`WhisperModel` 非スレッドセーフ | 要対応（推奨） |
| 7 | Medium | whisper_server.py:136 | `deepseek_base_url` が攻撃者制御可能 → SSRF / キー流出経路 | 要対応（推奨） |
| 8 | Low | app.py:263 | LIKE 検索の `%` `_` がワイルドカードとして解釈される | 任意 |
| 9 | Low | app.py:1006 | `api_logs` がアルファベット順ソートで時系列を壊す | 任意 |
| 10 | Low | app.py:601 | `auto_start_whisper` タスクの孤立 / `whisper_log_handle` 未クローズ | 任意 |
| 11 | Low | app.py:545 | `system_history` 可変 dict を WS 送信（レース） | 任意 |
| 12 | Medium | index.html:10-13 | Tailwind / Chart.js / フォントを CDN 依存 → オフラインで UI 崩壊 | 任意 |
| 13 | Low | app.js:1397 | records 表の `language` が `escapeHtml` 未適用 | 任意 |

## 良好点（指摘なし）

- **SQL は全箇所 `?` プレースホルダ利用**。f-string で SQL を組み立てている箇所はなし（インジェクション不可）。
- **フロントの `innerHTML` 生成はユーザー入力に全て `escapeHtml()` 適用**（records の filename/summary/model、LLM profile の name/base_url/model、ログ行）。`onclick` には数値 id のみを渡す設計。
- 詳細表示（`showRecordContent`）は `textContent` 利用（XSS 安全）。結果文字列は `encodeURIComponent` → `decodeURIComponent` で安全に受け渡し。
- NVML の `nvmlInit` / `nvmlShutdown` はライフスパンでバランスしている。
- `whisper_server.py` の `/asr` は同期の重い転写を `asyncio.to_thread` に移し、イベントループをブロックしない設計。

---

## 修正済みの指摘

### 1. LLM プロファイル部分更新で api_key 消失（High）— ✅ 修正

`dashboard/app.py` の `api_update_llm_profile()`（旧 790 行目）:

```python
# 修正前
api_key = str(data.get("api_key", ""))   # フィールド未送信でも空で上書き
# 修正後
if "api_key" in data:
    api_key = str(data.get("api_key", "")).strip()  # 明示的な空はキー削除として許可
else:
    api_key = row["api_key"]              # 未送信なら既存キーを維持
```

- **原因**: リクエストに `api_key` フィールドが無い場合も `data.get("api_key","")` が空文字になり、`UPDATE` で保存済みキーが空に上書きされる。
- **実害**: フロント UI は編集フォームに既存キーをプリフィルするため通常は回避されるが、外部クライアントや部分更新 API 呼び出しでキーが失われる。過去に MiniMax キー消失事故の一因となった。
- **修正の意味**: 未送信 = 既存維持、明示的な空文字 = キー削除（従来の「キー削除」用途は維持）。

### 2. /asr 一時ファイルリーク（Medium）— ✅ 修正

`whisper_server.py` の `/asr`:

```python
# 修正前
with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
    shutil.copyfileobj(audio_file.file, tmp)   # 例外時 tmp_path 未定義 → finally でリーク
    tmp_path = tmp.name
# 修正後
tmp_path = None
try:
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        ... コピー（chunk 単位）
        tmp_path = tmp.name
except Exception:
    try:
        os.unlink(tmp.name)   # 失敗時も確実に削除
    except OSError:
        pass
    raise
```

- **原因**: アップロード途中でクライアント切断等が起きると `tmp_path` が未設定のまま例外が上がり、`finally: os.unlink(tmp_path)` が実行されず一時ファイルが残る。
- **修正**: コピー失敗時に `tmp.name` を直接削除してから再送出。

### 3. /asr アップロードサイズ無制限（Medium）— ✅ 修正

`whisper_server.py` の `/asr` に **1GB 上限**を追加。`chunk` 単位で読込み中に合計バイト数を監視し、超過時は `HTTPException(413)` を返す。

- **背景**: サービスは `0.0.0.0` バインドのため LAN 上の任意端末から無制限アップロードが可能で、ディスク / GPU を枯渇させる経路だった。上限はローカル利用の実用範囲（1GB）で設定。

---

## 要対応（推奨）

### 4. 認証なし + 0.0.0.0 バインド（High）

`dashboard/app.py` は `uvicorn.run(..., host="0.0.0.0")` で LAN 公開。全ルートに認証が無く、LAN 上の任意端末が以下を実行可能:

- `POST /api/v1/config` — 任意設定の書き換え
- `POST /api/v1/whisper/start|stop|restart|model` — Whisper の起動停止・モデル切替
- `DELETE /api/v1/records` / `records/{id}` — 履歴の全削除
- `POST /api/v1/llm/profiles*` — LLM プロファイルの CRUD

**推奨**: 共有トークン（`Authorization: Bearer` ヘッダ）を読み取り API 以外のルートに要求する、または基本 `127.0.0.1` バインドにし LAN 公開時のみ明示的に公開する設計にする。

### 5. API キーの平文暴露（High）

`GET /api/v1/config` は `deepseek_api_key`、`GET /api/v1/llm/profiles` は各プロファイルの `api_key` を**平文で返却**する。無認証（指摘 4）と組み合わせると LAN 上の誰でも読める。

**推奨**: レスポンスでは `has_key: bool` + 末尾 4 桁だけ返し、フロントには完全なキーを返さない設計に変更する（編集時に再入力不要とするため「保持」セマンティクスは指摘 1 の修正で担保）。

### 6. 並行 /asr での共有状態（Medium）

`progress_percent` / `progress_lock` がモジュールグローバル。2 つの `/asr` が同時に来ると:
- 進行度がリクエスト A/B で混線する
- 同じ `WhisperModel` インスタンスで同時 `transcribe`（CUDA のスレッドセーフは保証されない）

**推奨**: `asyncio.Semaphore(1)` で転写を直列化するか、進行度をリクエスト毎のローカル変数に分離する。

### 7. deepseek_base_url 経由の SSRF / キー流出（Medium）

`ai_correct_text()` は `f"{base_url}/chat/completions"` へ `Authorization: Bearer {api_key}` を付けて POST する。base_url は無認証で書き換え可能（指摘 4）なため、LAN の攻撃者が「自分の URL」を設定して校正を発火させ、**認証キーを自分のサーバへ送らせる**ことが可能。あわせて社内ホストへの SSRF にもなる。

**推奨**: 指摘 4 の認証を入れた上で、`https://` と既知ホストへの許可リスト検証を追加する。

### 8. LIKE 検索ワイルドカード（Low）

`app.py:263` で `pattern = f"%{search}%"` をパラメータ渡ししているため注入は不可だが、ユーザー入力の `%` / `_` がワイルドカードとして解釈され、意図しないレコードがヒットする。`ESCAPE '\'` でエスケープ推奨。

### 9. api_logs のソート（Low）

`app.py:1006` の `result.sort(key=lambda x: x["line"])` は whisper / dashboard のログ行を**アルファベット順**に混ぜてしまい時系列を壊す。ただし現状のログ行は先頭にパース可能な ISO タイムスタンプが無いため、正しい時系列マージにはログ出力側へのタイムスタンプ付与が必要（要改善、規模あり）。

### 10. シャットダウン時のリソース処理（Low）

`auto_start_whisper` タスクが `asyncio.create_task` で作成されるが保存・キャンセルされない。シャットダウン中に 3s/30s の sleep 中だと破棄されたループ上で走り続ける可能性。また `start_whisper_process` で開いた `whisper_log_handle` がライフスパン終了時に閉じられない。

### 11. system_history の可変 dict 共有（Low）

`monitor_loop` が `system_history` を in-place で trim しながら、同じ参照を `broadcast()` と WS ハンドシェイクへ渡すため、シリアライズ中に長さが変わりチャートが揺れる可能性（軽微）。送信前に `dict(system_history)` のコピー推奨。

---

## フロントエンド補足

### 12. CDN 依存（Medium）

`index.html` は **Tailwind CSS / Chart.js / Google Fonts を CDN** から読込む。この PC がオフライン（または CDN 到達不可）だと:
- Tailwind のユーティリティクラスが効かず **画面レイアウトが崩壊**
- Chart.js が無く **リアルタイム推移グラフが描画不能**
- フォントが代替フォントに置換

ローカル完結サーバとしては、3 ファイルを `static/vendor/` にベンダリング（ローカル配信）するのが望ましい。

### 13. records 表の language 未エスケープ（Low）

`app.js:1397` の `${r.language || 'auto'}` は `escapeHtml` 未適用。language はサーバ側の固定セット（auto/zh/ja/en）由来のため現実的リスクは低いが、DB が改ざんされた場合の XSS 経路になり得る。`escapeHtml` 適用を推奨。

---

## 推奨対応の優先順位

1. **認証の導入**（指摘 4・5・7 を一括解決）— 共有トークン方式が最小
2. **並行 /asr の直列化**（指摘 6）— `asyncio.Semaphore(1)`
3. **CDN のローカル化**（指摘 12）— オフライン運用の耐性
4. 軽微な指摘（8〜13）は随時

> 指摘 4・5・7 は設計判断（LAN 公開の可否・トークン方式）を含むため、本レビューでは修正せず推奨に留めた。
