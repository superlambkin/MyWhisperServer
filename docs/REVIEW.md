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
| 4 | High | app.py 全ルート + 0.0.0.0 | 認証なし・LAN 公開 → 制御系 API を誰でも操作可能 | ✅ 修正済み（トークン認証） |
| 5 | High | app.py:1012 / 748 | API キーが平文で `GET /api/v1/config`・`/api/v1/llm/profiles` に返る | ✅ 修正済み（マスク化） |
| 6 | Medium | whisper_server.py:41 | 並行 `/asr` でグローバル `progress_percent` を共有、`WhisperModel` 非スレッドセーフ | ✅ 修正済み（Semaphore(1)） |
| 7 | Medium | whisper_server.py:136 | `deepseek_base_url` が攻撃者制御可能 → SSRF / キー流出経路 | ✅ 修正済み（base_url 検証） |
| 8 | Low | app.py:263 | LIKE 検索の `%` `_` がワイルドカードとして解釈される | ✅ 修正済み（ESCAPE） |
| 9 | Low | app.py:1006 | `api_logs` がアルファベット順ソートで時系列を壊す | ✅ 修正済み（タイムスタンプ基準） |
| 10 | Low | app.py:601 | `auto_start_whisper` タスクの孤立 / `whisper_log_handle` 未クローズ | ✅ 修正済み（lifespan 解放） |
| 11 | Low | app.py:545 | `system_history` 可変 dict を WS 送信（レース） | ✅ 修正済み（スナップショット） |
| 12 | Medium | index.html:10-13 | Tailwind / Chart.js / フォントを CDN 依存 → オフラインで UI 崩壊 | ✅ 修正済み（vendor ローカル化） |
| 13 | Low | app.js:1397 | records 表の `language` が `escapeHtml` 未適用 | ✅ 修正済み |

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

## 修正済みの指摘（4〜13）

### 4. トークン認証（High）— ✅ 修正

書き込み・制御系 API（全 `POST` / `PUT` / `DELETE` + `/ws`）に共有トークンを要求する方式を導入。読み取り（GET）は従来通り閲覧可。

- **トークン解決順**: env `DASHBOARD_TOKEN` > config DB > `secrets.token_urlsafe(24)` 自動生成・保存（遅延初期化、初回アクセスで確定）。
- **`require_auth`**: ループバック（`127.0.0.1` / `::1` / `localhost`）は免除（whisper_server 内部通信とローカル閲覧を維持）。それ以外は `Authorization: Bearer` または `X-Auth-Token` を照合、不一致なら `401`。
- **`/ws`**: `accept()` 前に `?token=` を照合。ループバック以外で不一致なら close。
- **`GET /api/v1/auth/token`**（ループバック自動取得可）と **`POST /api/v1/auth/token/regenerate`** を新設。
- フロント: `apiFetch()` ラッパー（全 20 箇所の `fetch` を置換）でヘッダ注入 + 401 時にトークン入力モーダル表示。設定画面「界面设置」に接続トークン表示・コピー・再生成ボタンを追加。

**検証**: LAN IP（192.168.0.88）から GET=200 / POST 無トークン=401 / 正トークン=200 / 誤トークン=401 / ループバック無トークン=200。WS はループバック接続可・LAN 無トークン拒否（403）・LAN 正トークン接続可。

### 5. API キーのマスク化（High）— ✅ 修正

`GET /api/v1/config` は `deepseek_api_key` を返さず `deepseek_has_key`（bool）+ `deepseek_key_masked`（末尾 4 桁）に置換。`/api/v1/llm/profiles` の各プロファイルも同様に `api_key` → `has_key` + `key_masked`。

- フロントはキー欄をプリフィルせず「保存済み …（未入力なら維持）」のプレースホルダ表示。
- 保存時にキー欄が空なら payload から省略（`saveSettings` / `saveProfile` / `syncActiveProfileFromFields`）。バックエンドはフィールド未送信なら既存キーを維持。

**検証**: `GET /api/v1/config`・`/api/v1/llm/profiles` に平文キー・`api_key` キーが含まれないことを確認。キー保持（PUT で api_key 省略 → 長さ 40 維持）も動作確認。

### 6. 並行 /asr の直列化（Medium）— ✅ 修正

`whisper_server.py` に `asr_semaphore = asyncio.Semaphore(1)` を追加。`/asr` の転写〜校正〜報告ブロックを `acquire` / `finally: release` で直列化（WhisperModel の同時 transcribe と progress 共有を防止）。

### 7. base_url 検証（SSRF 対策）（Medium）— ✅ 修正

`dashboard/app.py` に `validate_base_url()` を新設（scheme が `http://` / `https://` のみ許可、userinfo 拒否）。`POST /api/v1/config` の `deepseek_base_url` と LLM プロファイルの作成・更新に適用し、不正なら `400`。

多層防御として `whisper_server.py` の `ai_correct_text` も scheme が http/https でなければ校正をスキップ。

**検証**: `POST /api/v1/config` に `file:///etc/passwd` → 400、正常 URL → 200。

### 8. LIKE 検索ワイルドカード（Low）— ✅ 修正

`get_records` で検索文字列の `\` `%` `_` をエスケープし、SQL に `LIKE ? ESCAPE '\'` を付与。

**検証**: `%` / `_` を検索しても全件ヒットせず、実際にリテラルを含む 1 件のみヒットすることを DB レベルで確認。

### 9. api_logs の時系列化（Low）— ✅ 修正

各行の先頭 ISO タイムスタンプ（`\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}`）をパースしてソートキーに使用。パース不可の行は安定ソートで挿入順を維持（whisper ログへタイムスタンプ付与は別途）。

### 10. シャットダウン時のリソース解放（Low）— ✅ 修正

`auto_start_whisper` タスクを保存し、`lifespan` 終了時に cancel + await。`whisper_log_handle` が非 None なら close。

### 11. system_history の送信レース（Low）— ✅ 修正

`snapshot_history()`（`{k: list(v)}` のコピー）を新設し、`monitor_loop` の broadcast と WS ハンドシェイクで使用。

### 12. CDN のローカル化（Medium）— ✅ 修正

`dashboard/static/vendor/` にベンダリング:

- `vendor/tailwind.js`（`https://cdn.tailwindcss.com`）
- `vendor/chart.umd.min.js`（Chart.js v4.5.1, jsDelivr）
- `vendor/fonts.css` + `vendor/fonts/font-*.woff2`（Google Fonts: Syne / Manrope / JetBrains Mono 全 15 ファイル、URL をローカル相対パスに書き換え）

`index.html` の CDN 参照を `/static/vendor/...` に置換。**検証**: 3 ファイルとも HTTP 200。

### 13. records 表の language エスケープ（Low）— ✅ 修正

`app.js` の `${r.language || 'auto'}` → `${escapeHtml(r.language || 'auto')}` に置換。

---

## 検証サマリ（E2E, 2026-08-22）

- 認証: LAN 読み取り 200 / 書き込み 401→トークンで 200 / ループバック免除 200 / 誤トークン 401 / WS 拒否・接続
- マスク: config・profiles に平文キー非含有
- base_url: `file://` → 400
- `/asr`: test.mp3 で変換成功（7.4s, モデル medium）
- 検索: `%` / `_` エスケープ正常
- vendor: tailwind.js / chart.umd.min.js / fonts.css 200 配信
- キャッシュ: index.html / app.js とも v30 配信
