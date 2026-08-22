# MyWhisperServer Dashboard — Design Document (frontend-design skill 適用)

本ダッシュボードのデザインは、**frontend-design スキル**（`claude-plugins-official/plugins/frontend-design/skills/frontend-design/SKILL.md`）の方法論に基づいて設計・実装したものである。以下、スキルの各原則と、その実装箇所の対応を記録する。

> スキルは当環境では未インストールのため、Skill ツールでの起動に代えて、その SKILL.md 本文の方法論を読解し、同じ設計プロセスを手動で適用した（過去セッションにて合意済み）。

---

## 1. Design Thinking（設計思想）

スキルはコードを書く前に以下を定義することを要求する。

| スキルの問い | 本ダッシュボードでの回答 |
|---|---|
| **Purpose**（何を解決するか） | ローカル Whisper ASR サーバのリアルタイム監視コンソール。GPU 変換中に CPU/メモリ/ストレージ/GPU の状態を一目で把握し、サービス制御・履歴・設定を一画面で完結させる。利用者は開発者本人（パワーユーザー）。 |
| **Tone**（トーンの極端な選定） | **「SIGNAL」— 温かみのあるダーク・オーディオラボコンソール**。アンバー（琥珀）のシグナル + ホットオレンジのアクセントを、ウォームチャコール地に配置。industrial/utilitarian + retro-futuristic の複合トーン。 |
| **Constraints**（技術制約） | 純 HTML + Tailwind CDN + Chart.js CDN（ビルド不要）。FastAPI 静的配信。リアルタイム WebSocket 更新。多言語（zh/ja/en）。 |
| **Differentiation**（忘れられない一点） | **各カード上部の「アンバー・シグナルライン」と、変換中の CPU/GPU カードの心拍パルス**。画面全体を横切るフィルムグレイン＋グリッドの質感が「音響ラボ」の雰囲気を決定づける。 |

## 2. Frontend Aesthetics Guidelines（適用状況）

### Typography — タイポグラフィ
> 「distinctive display font と refined body font を組み合わせる。Arial / Inter 等の汎用フォントは避ける」

- **表示フォント（display）**: **Syne**（h1–h4、ロゴ）
- **本文フォント（body）**: **Manrope**
- **等幅（mono）**: **JetBrains Mono**（時刻・速度・ログ）

`html { font-family }` を汎用フォントにせず、Google Fonts で 3 ファミリを明示的に組んでいる（`dashboard/static/css/style.css` の `.font-manrope` / `.font-display` / `.font-mono`、`h1,h2,h3,h4 { font-family:'Syne' }`）。

### Color & Theme — 配色・テーマ
> 「CSS 変数で一貫性を。優勢色 + シャープなアクセント。紫グラデ等の使い回しは避ける」

- `:root` に CSS 変数でパレットを一元定義（`--bg:#0a0806` / `--signal:#ffb020` / `--signal-hot:#ff5e1a` / `--ai:#ff3d81` / `--info:#22d3ee` / `--ok:#34d399` / `--danger:#fb7185` / `--muted:#a8a29e`）。
- **優勢色 = ウォームチャコール（#0a0806）**、**アクセント = アンバー→オレンジのグラデ（gradient-bg）**。紫グラデの白背景等の定番 AI 美は不使用。
- ハードウェア種別に色を意味付与：CPU=amber、Memory=magenta、GPU util=emerald/cyan、GPU VRAM=pink、Storage=cyan。

### Motion — モーション
> 「CSS のみのアニメーション。ページロードの高インパクト演出（staggered reveals）を優先。ホバーで驚く」

- **ページロード**: `.stat-card` に 6 子要素の錯時フェードイン（`animation-delay` 0.04s→0.29s）、`.section > *` に `secRise` の nth-child 遅延。
- **状態駆動モーション**: 変換中に CPU/GPU カードを「心拍」（`@keyframes heartbeat`）、GPU 高温を `heatPulse`、AI 校正段を `correct-slide`（マゼンタ/紫の不定形スライド）。
- **ホバー**: カード上昇（`translateY(-2px)`）+ シグナルラインの**掃引（signal-sweep）**。
- `prefers-reduced-motion` で無効化（アクセシビリティ配慮）。

### Spatial Composition — 空間構成
> 「想定外のレイアウト・非対称・オーバーラップ」

- ダッシュボードは viewport 高さに収める構成（`h-full flex flex-col`）で、上段=統計カード・中段=モニタリング（リング）、下段=トレンド + Whisper 制御の並列。設定画面は 2 列グリッド。
- リング（`w-24 h-24`）とボックス（`p-3`）を同一行構造に揃え、カード間の視覚的整合を重視。

### Backgrounds & Visual Details — 背景・質感
> 「単色にせず雰囲気と奥行きを。グレインノイズ・グラデーションメッシュ・幾何パターン」

- `body::before`（z-index:-1）で **ラジアルグロー 3 層 + 42px グリッド + SVG フィルムグレイン（feTurbulence）** を重畳。
- ガラスカード（`glass-card`）は温色パネル + アンバー細線 + 内側ハイライト、カード上辺に**シグナルライン**（`::before`、透明→amber→orange→透明）。
- 選択色（`::selection`）、スクロールバー、フォーカスリングもアンバーで統一。

## 3. 禁止事項の遵守（スキルの NEVER リスト）

- ❌ Inter / Roboto / Arial / system 系の画一フォント → ✅ Syne / Manrope / JetBrains Mono
- ❌ 紫グラデの白背景 → ✅ ウォームダーク + アンバー
- ❌ 使い回しの定番レイアウト → ✅ オーディオラボコンソールとして独自構成

## 4. 実装ファイル一覧

- `dashboard/static/css/style.css` — SIGNAL テーマ全体（変数 / 背景 / カード / モーション）
- `dashboard/static/index.html` — 画面構造（`glass-card` / `stat-card` / モニタリングカード / 設定）
- `dashboard/static/js/app.js` — 多言語（zh/ja/en）、リアルタイム描画、状態アニメーション制御

## 5. BAT 起動スクリプト（Windows）

> 要件「通过 Bat 启动这个 DashBoard」に対する実装。`.bat` ダブルクリック / スタートアップから一発起動できる。

| ファイル | 役割 |
|---|---|
| `start_all.bat` | **推奨**。`start_dashboard.bat` を起動（Dashboard が Whisper を自動起動） |
| `start_dashboard.bat` | Dashboard のみ起動（`python dashboard/app.py`） |
| `start_whisper.bat` | Whisper サーバのみ起動（`python whisper_server.py`） |
| `stop_all.bat` | `netstat` で 9000 / 9001 の PID を特定し `taskkill` で停止 |

## 6. Dashboard 内の自動起動設定（开机自启 / 起動時自動実行）

> 要件「在 Dashboard 内设置电脑启动器自动开启 Dashboard 和服务器」に対する実装。設定画面のトグル 1 つで OS 起動時の自動起動を管理する。

- **バックエンド**: `dashboard/app.py`
  - `GET /api/v1/autostart` → スタートアップパス（`%APPDATA%\...\Startup\MyWhisperServer.lnk`）の存在で有効/無効を返す
  - `POST /api/v1/autostart {enabled}` → Windows は PowerShell + WScript.Shell で `start_all.bat` への `.lnk` をスタートアップフォルダに作成 / 削除。Linux は `~/.config/autostart/MyWhisperServer.desktop` を書込/削除
- **フロントエンド**: `dashboard/static/index.html`（設定画面の「开机自启」カード）+ `dashboard/static/js/app.js`
  - `loadAutostartStatus()` — 設定画面表示時に状態を取得
  - `toggleAutostart()` — トグル操作で `POST /api/v1/autostart` を呼び、スタートアップの .lnk / .desktop を作成/削除
  - i18n: `autostart.*`（zh/ja/en）
- **検証済み**: 2026-08-22 に API 往復テスト（`enabled:false` → `.lnk` 削除確認 → `enabled:true` → `.lnk` 再作成確認）。現在 `enabled:true` で Windows ログイン時に Whisper + Dashboard が自動起動する状態。

---

# システム設計（OB資料）

> 本節はフロントエンドデザインに留まらず、MyWhisperServer 全体の設計・実装詳細を記録する。
> ソースコードレビューの指摘・対応状況は [`docs/REVIEW.md`](../docs/REVIEW.md) を参照。

## 7. システム全体構成（アーキテクチャ）

### 7.1 2 プロセス構成

| プロセス | ポート | 役割 | 主要技術 |
|---|---|---|---|
| `whisper_server.py` | **9000** | ASR（音声→テキスト）・AI 校正 | FastAPI + faster-whisper（CTranslate2, CUDA） |
| `dashboard/app.py` | **9001** | 監視・サービス制御・履歴・設定・UI 配信 | FastAPI + WebSocket + SQLite + NVML |

`start_all.bat` / `start_all.sh` で両者を一括起動する。Dashboard は起動時に Whisper の生存を確認し、停止していれば自動起動する。

### 7.2 通信フロー

```
[音声ファイル] ──POST :9000/asr──▶ whisper_server（転写 → AI 校正）
      │  ▲                             │
      │  │ 状態/進捗の HTTP 報告        │ POST /api/v1/whisper/status_event
      │  │  (converting / progress)     │ POST /api/v1/whisper/progress
      ▼  │                             ▼
  dashboard ◀──SQLite 保存──          （WS ブロードキャスト）
      │  ▲
      │  │ WebSocket /ws（system_update / converting / progress / whisper_status …）
      ▼  │
   ブラウザ（ダッシュボード UI）
```

- **whisper_server → dashboard**: `POST /api/v1/whisper/status_event`（`converting`/`idle`、`start_ts`・`filename`）と `POST /api/v1/whisper/progress`（`percent`・`phase`・`duration`）
- **dashboard → ブラウザ**: `/ws` で `system_update`（2 秒毎）/ `converting` / `progress` / `whisper_status` / `log_line` / `new_record` 等をブロードキャスト
- **whisper_server → dashboard（config 読取）**: AI 校正・速度設定を**毎回** `GET /api/v1/config` で取得（キャッシュしない → 設定変更がサービス再起動不要で即反映）

### 7.3 whisper_server の環境変数

| 変数 | 既定 | 説明 |
|---|---|---|
| `WHISPER_MODEL` | `medium` | Whisper モデルサイズ |
| `WHISPER_COMPUTE_TYPE` | `float16` | CTranslate2 計算型（CPU なら `int8` 等） |
| `WHISPER_BEAM_SIZE` | `5` | ビーム幅 |
| `WHISPER_TEMPERATURE` | `0` | サンプリング温度（`0`=グリーディ） |
| `WHISPER_VAD_MIN_SILENCE_MS` | `500` | VAD 無音判定閾値（ms） |
| `DASHBOARD_URL` | `http://127.0.0.1:9001` | 状態報告・設定取得先 |

モデルは起動時に `WhisperModel(size, device="cuda", compute_type=…)` で一度だけロードする（重い処理は `asyncio.to_thread` に移しイベントループを非ブロック化）。

## 8. データベース設計（`dashboard/data/*.db`）

SQLite（`aiosqlite` 非同期アクセス）。テーブルは 3 つ。

### `records` — 変換履歴

| カラム | 型 | 説明 |
|---|---|---|
| `id` | INTEGER PK | 自動採番 |
| `filename` | TEXT | 元音声ファイル名 |
| `duration` | REAL | 音声時間（秒） |
| `language` | TEXT | 言語（auto/zh/ja/en…） |
| `output_format` | TEXT | `txt` / `srt` |
| `summary` | TEXT | 一覧表示用の要約（先頭文字列） |
| `result` | TEXT | 全文（txt）または SRT 全文 |
| `timestamp` | TEXT | 変換日時（ISO） |
| `elapsed_seconds` | REAL | 処理時間（全体） |
| `model` | TEXT | 使用 Whisper モデル |
| `llm_model` | TEXT | AI 校正に使った LLM モデル（未使用なら NULL） |
| `correct_elapsed` | REAL | AI 校正時間（秒） |

### `config` — キーバリュー設定

`key TEXT PRIMARY KEY` / `value TEXT`。`defaults` dict で全キーと初期値を管理（既定値は §13）。

### `llm_profiles` — OpenAI 互換 LLM 接続プロファイル

| カラム | 型 | 説明 |
|---|---|---|
| `id` | INTEGER PK | 自動採番 |
| `name` | TEXT | 表示名（例: Deepseek / Ollama / MiniMax） |
| `base_url` | TEXT | OpenAI 互換エンドポイント（例: `https://api.deepseek.com/v1`） |
| `api_key` | TEXT | API キー（Ollama 等は空） |
| `model` | TEXT | モデル名 |
| `created_at` | TEXT | 作成日時 |

## 9. LLM プロファイル設計（snapshot 同期トリック）

### 9.1 設計思想

whisper_server は **プロファイルの存在を知らず、常に 3 つのフラットな `deepseek_*` config キー**だけを読む（§7.4）。そこで以下の**不変条件**を置く:

> **`config` テーブルの `deepseek_*` は常に「アクティブプロファイル」のスナップショット。**

- プロファイルを**有効化**した時 → `activate_llm_profile(id)` が `deepseek_api_key/model/base_url` と `active_llm_profile` を**1 トランザクション**で書き換え
- **アクティブ中のプロファイルを編集**した時 → UPDATE 後に再同期
- **アクティブを削除**した時 → `active_llm_profile=''` に加え `deepseek_*` を既定値にリセット（stale URL で校正が走るのを防ぐ）

この方式により whisper_server.py の変更は「API キー必須チェックの撤廃（Ollama 対応）」のみに抑えられている。

### 9.2 データフロー

```
[LLM モデル管理 UI] ──POST activate──▶ dashboard ──(1 tx)──▶ config(deepseek_*)
                                                                    │ GET /api/v1/config
      POST /correct ◀── 校正テキスト ── whisper_server ◀──────────────┘
```

- 接続テスト（`POST /api/v1/ai/test`）は base_url/model/api_key で `/chat/completions` を試行。**成功時は自動で有効化**。
- キーレス動作（Ollama）対応のため、api_key は任意。

### 9.3 前方互換シード

テーブルが空の初回起動時、既存 `deepseek_*` 設定から「Deepseek」プロファイルを 1 行生成し `active_llm_profile` に設定する。

## 10. リアルタイム監視設計

### 10.1 monitor_loop（dashboard 内タスク）

2 秒周期で実行:

1. **スナップショット取得**: `psutil` で CPU 使用率・周波数・メモリ・ディスク、`pynvml` で GPU 利用率・温度・クロック・消費電力・VRAM
2. **Whisper ヘルスプローブ**: `GET :9000/health` で状態確認
3. **ブロードキャスト**: `system_update { data, history }` を全 WS クライアントへ

`history` は CPU/メモリ/GPU 利用率の時系列（上限 `MAX_HISTORY` で trim）。トレンドグラフのデータ源。

### 10.2 フロント描画

`updateSystemDisplay(data, history)` がリング・ボックス・グラフを更新:

- **CPU & メモリカード**: CPU 利用率リング / メモリ利用率リング / ストレージ使用率リング（+ 3 ボックス行: CPU 周波数・メモリ使用量・ストレージ使用/全容量 GB）
- **GPU カード**: 利用率リング / VRAM 利用率リング / 温度リング（100%=100℃）+ 3 ボックス（クロック MHz / VRAM 使用-全体 MB / 消費電力 W）
- **リアルタイム推移**: Chart.js の折れ線（表示点数は縮小/拡大ボタンで 30〜480 点）

GPU 温度が設定閾値を超えるとカードに `heatPulse` 警告アニメーション。

## 11. 変換リアルタイム監視の設計

### 11.1 プロトコル

`/asr` 実行中に whisper_server が Dashboard へ報告するイベント列:

```
converting { state:"converting", start_ts, filename }   ← 開始（タイムスタンプ基盤）
progress   { percent: 0..100, phase:"transcribe" }       ← 転写進行（0.5s 毎）
progress   { percent: 100,   phase:"transcribe", duration } ← 転写完了（音声時間確定）
progress   { percent: -1,    phase:"correct" }           ← AI 校正開始（"校正中…"表示）
converting { state:"idle" }                              ← 全体終了
```

- `percent = -1` を「校正中」シグナルとして使う（100% に張り付くのを防ぐ）
- `start_ts` はエポック秒、`duration` は音声時間（秒）

### 11.2 フロントのタイミングモデル（`conversionTiming`）

| フィールド | 意味 |
|---|---|
| `startTs` | リクエスト開始（ms） |
| `correctStartTs` / `correctEndTs` | AI 校正フェーズの開始/終了 |
| `endTs` | 変換全体の終了（**前回結果の固定表示用**） |
| `duration` / `durationKnown` | 音声時間（確定フラグ付き） |
| `phase` | `transcribe` / `correct` |

表示値:
- **変換時間** = `correctStartTs - startTs`（校正中は固定）or `now - startTs`
- **AI 校正時間** = `now - correctStartTs`（or 校正終了時は `correctEndTs - correctStartTs`）
- **処理時間** = `now - startTs`
- **実時倍速** = 音声時間 / 処理時間

250ms 周期で `updateConversionMonitor()` が値を更新する。

### 11.3 前回結果の保持（2026-08-22 追加）

変換終了時、`finalizeConversionTiming()` が `endTs` を記録し、`#live-monitor` を**非表示にせず前回の値を固定表示**する。`updateConversionMonitor()` は `endTs` を現在時刻の代わりに使って最終値を計算する。一度も変換していない初期状態のみ `hidden` のまま。

### 11.4 WS 再接続耐性

WebSocket 再接続で `converting` / `progress` イベントが欠落しても、2 秒毎の `system_update` に `converting`・`progress` が同梱されるため、`updateSystemDisplay()` が状態と進捗を再同期する。

## 12. 設定キー一覧（`config` テーブル）

| キー | 既定値 | 説明 |
|---|---|---|
| `default_language` | `auto` | 既定の転写言語 |
| `default_output` | `txt` | 既定の出力形式 |
| `refresh_interval` | — | 監視リフレッシュ間隔（ms） |
| `gpu_temp_threshold` | — | GPU 温度警告閾値（℃） |
| `theme` | — | テーマ |
| `ui_language` | `zh` | UI 言語（zh/ja/en） |
| `whisper_model` | — | Whisper モデル（サービス再起動で反映） |
| `ai_correct_enabled` | `false` | AI 校正の有効/無効 |
| `deepseek_api_key` | `''` | **アクティブ LLM プロファイルのスナップショット**（API キー） |
| `deepseek_model` | `deepseek-chat` | 〃（モデル） |
| `deepseek_base_url` | `https://api.deepseek.com/v1` | 〃（Base URL） |
| `active_llm_profile` | `''` | 有効化中のプロファイル id（§9） |
| `whisper_mode` | — | 速度プリセット（fast/balanced/accurate/custom） |
| `whisper_compute_type` / `whisper_beam_size` / `whisper_temperature` / `whisper_vad_min_silence_ms` | — | 高速化詳細パラメータ（再起動で反映） |

> `whisper_mode` が `custom` 以外のとき、詳細パラメータ（compute_type 等）はプリセットで上書きされる。設定画面のモード select はダッシュボード上部のモード select と双方向同期する。

## 13. ソースコードレビューとの対応

2026-08-22 実施のコードレビュー結果は **`docs/REVIEW.md`** に記録済み。

- ✅ 修正済み: LLM プロファイル部分更新での api_key 消失 / `/asr` 一時ファイルリーク / アップロード 1GB 上限
- ✅ 修正済み（推奨 10 件）: トークン認証（書き込み・制御系）/ API キーマスク化 / `/asr` 直列化 / base_url 検証 / LIKE エスケープ / ログ時系列ソート / シャットダウン解放 / history スナップショット / CDN ローカル化 / language エスケープ

本設計（snapshot 同期・リアルタイム監視・タイミングモデル）は上記修正後も現行のまま妥当とする。

## 14. FasterWhisper モデル選択機能（2026-08-22 追加）

参考: [Qiita「faster-whisper で文字起こし」](https://qiita.com/taiki_i/items/3d2d0d0b2dd79059f30e)

### 14.1 モデルカタログ（`MODEL_CATALOG` / `GET /api/v1/whisper/models`）

faster-whisper 1.2.1 が受け付ける全モデル（18 種）を定義し、モデルごとに **VRAM 目安（fp16 / int8）・ダウンロードサイズ・対応言語・説明** を持たせる。`ALLOWED_MODELS` はカタログのキーから導出（選択肢の追加時はカタログ 1 箇所の変更で済む）。

- `GET /api/v1/whisper/models` → `{"models": {...}}`（閲覧用、認証不要）
- `POST /api/v1/whisper/model` → カタログ外モデルは `unsupported model` で拒否。保存 → 停止 → 再起動（env `WHISPER_MODEL` 注入）。

### 14.2 フロントの VRAM 警告（GTX 1660 Ti 6GB 前提）

- `populateModelSelect()`: カタログから `<option>` を動的生成（`data-vram-fp16 / vram-int8 / disk-gb / lang / desc`）。
- `updateModelInfo()`: 選択中モデル + 現在の `whisper_compute_type`（int8 系か fp16 か）で VRAM 目安を算出し、制御カード下に 1 行で表示。
  - `vram > 5.5GB` → 🔴 非推奨（6GB カードに収まらない恐れ）
  - `vram > 4.5GB` → ⚠️ VRAM に注意
  - それ以下 → ✓ 収まる
- `switchModel()`: 危険モデル（`> 5.5GB`）への切替は `confirm()` で再確認（未キャッシュモデルは大容量 DL + VRAM 不足で OOM の恐れ）。

### 14.3 実測メモ

- GTX 1660 Ti 6GB / `medium` + `int8_float16` 稼働時、nvidia-smi で **~4.7GB** 使用（他プロセス含む）。`large-v2/v3` は int8 でも 5.0GB 目安のため⚠️、fp16 では 🔴 判定。
- `large-v3-turbo` / `distil-large-v3` は int8 で 2.5〜2.8GB と 6GB カードに十分収まり、精度と速度のバランスが良い推奨候補。
- 未キャッシュモデルへの切替時は HuggingFace から自動ダウンロード（`~/.cache/huggingface/hub/models--Systran--faster-whisper-*`）。
