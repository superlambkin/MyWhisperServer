# MyWhisperServer ソースコードレビュー報告書

- **日付**: 2026-08-31
- **対象**: `D:\AI-Agent\whisper_server` 一式
  - `dashboard/app.py`（FastAPI バックエンド、約3,617行）
  - `dashboard/static/js/app.js` + `index.html`（フロントエンド、約7,235行 + 1,542行）
  - `whisper_server.py` / `ocr_server.py` / `dashboard/tts_local.py`
  - `start_*.bat` / `start_*.sh` / `stop_all.*` / `install_ubuntu.sh` / `requirements.txt`
- **方法**: 3領域の並列レビュー + 統合。重要な指摘は実装者側で再確認し、注記を付与。

---

## 1. エグゼクティブサマリー

LAN運用前提のWhisper/OCR/TTS統合システムとして、直列化ロック・SSRF対策・GPU/CPUフォールバック・i18nなど堅牢な設計が見られる。一方で、次の3つの横断テーマが最重要課題。

| # | 横断テーマ | 影響 | 対象 |
|---|-----------|------|------|
| A | **0.0.0.0バインド + 認証弱め** | LAN上の任意ホストから無認証アクセス・設定改ざんが可能 | 全サーバー |
| B | **起動スクリプトのパス不整合（実害確認済み）** | `start_dashboard.bat` 等がそのままでは起動失敗 | bat/sh群 |
| C | **トークン露出・XSS（フロントエンド）** | トークン窃取・スクリプト注入のリスク | app.js |

---

## 2. 重要指摘（統合・重要度順）

### 🔴 高優先度

#### A-1. 全サーバーが `0.0.0.0` バインドで無認証公開
- `whisper_server.py:540` / `ocr_server.py:459` / `dashboard/app.py:68`
- Whisper・OCRサーバーは `/asr`, `/ocr`, `/pdf` 等が**完全無認証**。LAN上の任意端末から文字起こし・OCRを実行可能（リソース私用・DoS）。
- Dashboardは `require_auth`（POST/PUT/DELETE + ループバック除外）があるが、**GET系（`/api/v1/config`, `/api/v1/records` 等）は無認証**で、`auth_enabled=off` 時は書き込みも無防備。
- **修正案**: デフォルトを `127.0.0.1` に変更（LAN対応が必要ならトークン認証を全サーバーに実装）。

#### B-1. 起動スクリプトのパス不整合 ⚠️実害確認済み
- `start_dashboard.bat:2` / `start_all.bat:2-3` / `start_whisper.bat:2-3`
- `cd /d C:\Users\superlambkin\whisper_server` はハードコード。実確認の結果、**同パスには `models/` のみ存在し `dashboard\app.py` はない**（実コードは `D:\AI-Agent\whisper_server`）。batはそのままでは起動に失敗する。
- **修正案**:
  ```batch
  cd /d "%~dp0"
  "C:\Users\superlambkin\AppData\Local\Programs\Python\Python310\python.exe" dashboard\app.py
  ```
- Pythonパスのハードコードも同根の問題（`%~dp0` + `py -3.10` 等で緩和）。

#### C-1. WebSocketトークンのクエリパラメータ露出
- `app.js:1354`（`/ws?token=...`）
- URL・プロキシ・サーバーログに残りうる。サーバー側ログ（`GET /ws?token=Maaya1102`）にも実出力されていることを確認。
- **修正案**: サブプロトコル渡し、または初回のみトークン付き接続→以降はセッションクッキー等。

#### C-2. innerHTML使用によるXSSリスク（複数箇所）
- `app.js:2854, 3011, 3199, 3319, 3844` 等
- `escapeHtml()` は存在するが、template literal + innerHTML の混在箇所があり、文字起こし結果・OCR結果・LLM応答など**外部由来テキスト**が流れうる経路は特に要対策。
- **修正案**: 外部由来テキストは `textContent` 使用 or 全箇所で `escapeHtml()` を徹底。

#### A-2. ステータス通知エンドポイントの発信元検証なし
- `app.py:1370-1396`（`/api/v1/whisper/status_event`）、`app.py:1421-1434`（`/api/v1/whisper/llm_status`）
- LAN上の誰でもWhisperステータスを偽装・書き換え可能。
- **修正案**: 共有シークレットヘッダ検証、またはループバックのみ許可。

#### S-1. アップロードファイル名のパストラバーサル検証不足
- `whisper_server.py:277` / `ocr_server.py:265`（`Path(filename).suffix` をそのまま使用）
- **修正案**: `..` `/` `\` 含む filename を400で拒否。suffix は固定ホワイトリスト照合に。

#### S-2. 一時ファイルクリーンアップの不完全さ
- `whisper_server.py:293-298` / `ocr_server.py:278-290`
- 例外時の `os.unlink` が失敗しうる（Windowsのファイルロック）。**修正案**: `finally` + リトライ付き削除。

#### S-3. stop_all のポートベースkill誤爆リスク
- `stop_all.bat:3-13` / `stop_all.sh:8-16`
- netstatのPIDを無条件kill。**修正案**: プロセス名（python.exe）照合を追加。

#### S-4. プロセス停止のgraceful period不足
- `dashboard/app.py:834, 946`（wait 3秒後即kill）
- 処理中リクエストの強制切断→記録欠落の可能性。**修正案**: タイムアウト延長 / 進行中ジョブの完了待ち。

### 🟡 中優先度

| # | ファイル:行 | 要約 | 対応案 |
|---|------------|------|--------|
| M-1 | `app.py:130` | ループバック判定が `127.0.0.1`/`::1` のみ（`127.x.x.x` 全域を漏らす） | `ipaddress.ip_address(h).is_loopback` |
| M-2 | `app.py:189-200` | `validate_base_url` の netloc 空チェック不十分 | hostname 必須化 |
| M-3 | `app.py:203-226` / `app.py:220-223` | DNS解決にタイムアウトなし・DNS rebinding 考慮不足 | `getaddrinfo` タイムアウト+解決結果固定 |
| M-4 | `app.py:1123-1237` | `monitor_loop` の例外握り潰し（printのみ） | ロガー化+連続失敗アラート |
| M-5 | `app.py:3481-3520` | `/api/v1/config` の値検証が一部のみ（range未チェック） | 型+範囲バリデーション拡張 |
| M-6 | `app.js:1668` | WS再接続が無限に3秒間隔 | 指数バックオフ+上限回数 |
| M-7 | `app.js:2517, 2555` / `app.js:2924` | `ocrTimer`/`_pollDownload` の setInterval 重複起動リスク | 開始前に `clearInterval` |
| M-8 | `app.js:1340` | トークンのlocalStorage平文保存 | sessionStorage/ローテート検討 |
| M-9 | `app.js:3714` 付近 | 設定保存エラー時の config 変数ロールバック不完全 | 失敗時に `config` も復元 |
| M-10 | `ocr_server.py:305,360` | 50/100MB上限だがメモリ枯渇ガードなし | psutilで空きメモリチェック |
| M-11 | `tts_local.py:217-241` | `model_path` のサニタイズなし | `Path.resolve()` + `..` チェック |
| M-12 | `whisper_server.py:439,462-470` | base64音声デコードにサイズ上限なし | デコード前長チェック |
| M-13 | `whisper_server.py:249-256` / `ocr_server.py:146-158` | GPU/CPUフォールバック時のエラー情報不足 | 落下理由を明示ログ |
| M-14 | `requirements.txt:15` | `kokoro` が必須記載だが実際はオプション（実行時ImportError） | コメント化+導入ガイド分離 |
| M-15 | `start_*.sh:8-14` | venv/.venv検出順序が install_ubuntu.sh と不整合 | 統一 |

### 🟢 低優先度（抜粋）

- `app.py:98` `MAX_HISTORY=480`、`app.py:2130` `TTS_MAX_CHARS=5000` 等のマジックナンバー → 設定化
- `app.js` 7,235行単一ファイル・グローバル変数乱用・i18n辞書インライン（400行×3言語） → モジュール/JSON分割
- `index.html` のインライン `onclick=` ハンドラ → `addEventListener` 化
- `MODEL_CATALOG`（`app.py:2558-2578`） → 外部JSON化
- `whisper_server.py:114` summaryのマルチバイト考慮要確認
- `install_ubuntu.sh:66` cu121固定、`:76` chmodエラー時続行
- `dashboard/app.py:34-38` スタートアップフォルダパスのOS言語依存

---

## 3. 検証・訂正注記（レビュアー統合者による確認）

| 指摘 | 判定 |
|------|------|
| バックエンド指摘「`require_auth` の早期リターンが認証バイパス」 | **訂正**: `app.py:161-179` を実読。`auth_enabled=off` 時の早期リターンは docstring 明記の**意図した設計**。バグではない。ただし「off + LANアクセス = 無認書き込み可」という設計リスクは A-1 として有効 |
| `start_dashboard.bat` パス不整合 | **実証済み**: `C:\Users\superlambkin\whisper_server` には `models/` のみ。`dashboard\app.py` なし |
| WSトークンのログ出力 | **実証済み**: ダッシュボード起動ログに `GET /ws?token=Maaya1102` が実出力 |
| フロントエンドの行番号（app.js:1354 等） | サブエージェントが行番号確認済みと報告。修正時は該当行を再確認のこと |

---

## 4. 推奨対応ロードマップ

### フェーズ1: 直近の実害・低コスト（〜1日）
1. **bat/shのパスを `%~dp0` 相対化**（B-1）— 確認済み実害
2. **アップロード filename 検証 + tmp削除のfinally化**（S-1, S-2）
3. **stop_all にプロセス名照合追加**（S-3）

### フェーズ2: セキュリティ強化（数日）
4. **バインドアドレス見直し**（A-1）— ローカル専用なら `127.0.0.1`、LAN対応ならトークン認証を whisper/ocr にも
5. **ステータス通知エンドポイントの発信元検証**（A-2）
6. **WSトークン運用改善 + XSS対策（textContent化）**（C-1, C-2）
7. **`/api/v1/config` バリデーション強化 + ループバック判定修正**（M-5, M-1）

### フェーズ3: 堅牢性・保守性（計画的）
8. フロントエンドのタイマー/再接続まわり修正（M-6, M-7）
9. monitor_loop・各種例外のロギング整備（M-4, M-13）
10. requirements/導入ドキュメントの整合（M-14, M-15）
11. 巨大ファイルのモジュール分割（app.js、MODEL_CATALOG、i18n辞書）

---

## 5. 領域別サマリー

### dashboard/app.py（バックエンド）
機能的でFastAPIを適切に使用。ただし外部入力検証の不足（config値・api_key・ファイル名）、例外握り潰し、発信元検証なしエンドポイントが課題。DB接続は都度オープン+WAL未設定で同時アクセス時にロックリスク（`PRAGMA journal_mode=WAL` 推奨）。

### static/js/app.js + index.html（フロントエンド）
i18n・WS管理は堅実。一方、トークンのクエリ露出・localStorage保存、innerHTML混在、タイマー二重起動・無限再接続のリスク。7,235行単一ファイルはモジュール分割を推奨。

### whisper_server.py / ocr_server.py / tts_local.py（サーバー群）
直列化Semaphore・GPU/CPUフォールバックなど良好な設計。ただし無認証0.0.0.0公開・filename検証不足・tmpクリーンアップ不備・メモリガードなし。kokoro依存がrequirements必須記載なのに実行時ImportErrorになる点も要整理。

---

*本報告書は3領域の並列レビュー結果を統合したもの。行番号はレビュー時点（2026-08-31）のもの。*
