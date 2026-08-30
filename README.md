# MyWhisperServer

ローカル PC 上で動作する **Whisper 音声 → テキスト変換サーバ** ＋ **リアルタイム監視ダッシュボード**。

- **Whisper サーバ**（FastAPI + faster-whisper）：`http://<PCのIP>:9000/asr` に音声ファイルを送ると文字起こし結果を返します
- **Dashboard**（FastAPI + WebSocket）：`http://<PCのIP>:9001` でハードウェア監視・変換履歴・サービス操作・AI 校正設定・多言語 UI を提供します

> Windows / Linux（Ubuntu）の両方に対応しています。
> 本 README は OS ごとに手順を分けて記載しています。

---

## 目次

1. [機能概要](#機能概要)
2. [共通の前提条件](#共通の前提条件)
3. [Windows 版のセットアップ](#windows-版のセットアップ)
4. [Linux（Ubuntu）版のセットアップ](#linuxubuntu-版のセットアップ)
5. [使い方（共通）](#使い方共通)
6. [API リファレンス](#api-リファレンス)
7. [設定（Dashboard 画面）](#設定dashboard-画面)
8. [トラブルシューティング](#トラブルシューティング)
9. [ファイル構成](#ファイル構成)

---

## 機能概要

| 機能 | 説明 |
|---|---|
| 音声文字起こし | faster-whisper（CTranslate2）による高精度 ASR、VAD ノイズ除去内蔵 |
| 言語 | 自動検出 / 日本語 / 中文 / 英語 などから指定可能 |
| 出力形式 | txt（プレーンテキスト） / srt（字幕） |
| リアルタイム監視 | CPU / メモリ / ディスク / GPU 利用率・VRAM・温度 を 2 秒間隔で表示 |
| 変換履歴 | 音声時間 / 変換時間 / AI 校正時間 / 処理時間 を表示。時間単位を**秒 ⇔ 分秒**で右上のトグルから切替。変換速度は `1/N`（少数点1桁） |
| サービス制御 | Dashboard から Whisper の起動 / 停止 / 再起動 / モデル切り替え |
| 状態表示 | 起動中 / 変換中 / 実行中 / 停止中 をリアルタイムに表示 |
| 変換進捗バー | 変換中は音声の進行に合わせて ％ 付きプログレスバー、AI 校正中は校正バーを**2段**で表示 |
| AI 校正 | 変換後に LLM で誤字修正・段落校正。**LLM モデル管理**で Deepseek / Ollama など OpenAI 互換エンドポイントを複数登録し、有効化したプロファイルを自動で使用。設定画面の「LLM 接続テスト」で接続確認し、成功すると自動で有効化 |
| Whisper 高速化 | モード切替（速度優先 / バランス / 精度優先 / カスタム）＋詳細パラメータ設定 |
| 履歴の削除 | 変換履歴を個別削除、または一括クリア |
| 履歴の再校正 | 保存済みの変換結果に校正ボタンで再度 AI 校正を実行して上書き保存 |
| 多言語 UI | 日本語 / 中文 / English を切り替えて保存 |
| 自動起動 | Windows：スタートアップフォルダ / Linux：`~/.config/autostart` または systemd |
| 変換中アニメーション | 変換中は CPU / GPU カードが心拍アニメーションで点滅 |
| グラフの拡大・縮小 | 波形の横スケール（表示時間幅）をボタンで拡大・縮小。カードは常に画面幅いっぱいに表示 |
| GPU 温度グラフ | リアルタイム推移に **GPU 温度**（赤色）の折れ線を追加 |
| 変換フェーズ色分け | トレンドチャートに **変換（琥珀）/ AI 校正（マゼンタ）** の帯を表示し、フェーズを色で区別 |
| リアルタイムロギング | 2 秒毎の CPU / GPU / メモリ / 変換フェーズを **JSONL** で記録。開始 / 停止ボタン＋ログ履歴セクションで一覧・閲覧・ダウンロード・削除 |
| 音読み（TTS 切替） | 変換履歴の詳細結果を読み上げ。エンジンは **Edge TTS / Kokoro（高速ローカル）/ VibeVoice（リアルタイム）** を設定画面で切替。再クリックで**一時停止 / 再開**、読上げ中の文を**下線表示**、本文**ダブルクリック**で指定位置から再生 |
| 文字数表示 | 変換履歴一覧・詳細ヘッダーに**変換文と AI 校正文の文字数**を表示 |
| 原文 / 校正タブ | 詳細結果で**変換文**と **AI 校正文**をタブ切替で表示 |

---

## 共通の前提条件

- **Python 3.10 以上**
- **ffmpeg**（音声デコードに必要。Windows では PATH に追加）
- **NVIDIA GPU**（推奨。GTX 1660 Ti 6GB で動作検証済み）
  - GPU が無くても **CPU モード**（`WHISPER_COMPUTE_TYPE=int8`）で動作可能（速度は低下）
- ブラウザ（Chrome / Edge 推奨）

---

# Windows 版のセットアップ

## 1. Python のインストール

1. https://www.python.org/downloads/ から **Python 3.10 以降** をインストール
2. インストーラーで「**Add python.exe to PATH**」にチェックを入れる
3. 動作確認：コマンドプロンプトで `python --version`

## 2. ffmpeg のインストール

1. https://www.gyan.dev/ffmpeg/builds/ から **release essentials** をダウンロード
2. 解凍して `C:\ffmpeg\bin` を環境変数 PATH に追加
3. 動作確認：`ffmpeg -version`

## 3. NVIDIA ドライバ + CUDA

- NVIDIA 公式ドライバをインストール（GeForce Experience 推奨）
- 動作確認：`nvidia-smi`（以下のように表示されれば OK）

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI ... Driver Version: 5xx.xx  CUDA Version: 12.x                    |
+-----------------------------------------------------------------------------+
```

## 4. 依存パッケージのインストール

コマンドプロンプトでプロジェクトフォルダへ移動して実行：

```bat
cd C:\Users\<ユーザー名>\whisper_server
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

> `torch` の GPU 版が自動でインストールされない場合は、以下を実行：
> ```bat
> python -m pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121
> ```

## 5. 初回起動（モデルの自動ダウンロード）

```bat
start_whisper.bat
```

初回は `medium` モデル（約 1.5GB）をダウンロードします。
`Loading Whisper model...` → `Model loaded successfully.` と表示されれば成功です。

## 6. Dashboard を起動

```bat
start_dashboard.bat
```

Dashboard は **Whisper を自動起動**します（起動していない場合のみ）。

## 7. ブラウザで開く

```
http://127.0.0.1:9001
```

LAN 内の他の端末からは `http://<このPCのIP>:9001`（例：`http://192.168.0.88:9001`）

## 8. 自動起動の設定

- Dashboard の「設定 → 开机自启 / 起動時自動実行」を ON にする
- スタートアップフォルダに `MyWhisperServer.lnk` が作成され、Windows ログイン時に自動起動します

## Windows の起動・停止スクリプト一覧

| ファイル | 説明 |
|---|---|
| `start_whisper.bat` | Whisper のみ起動 |
| `start_dashboard.bat` | Dashboard のみ起動 |
| `start_all.bat` | **推奨**。Dashboard を起動（Whisper は自動起動） |
| `stop_all.bat` | 9000 / 9001 / 9100（OCR）ポートのプロセスを停止 |

---

# Linux（Ubuntu）版のセットアップ

## 1. システム依存のインストール

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip ffmpeg build-essential
```

## 2. NVIDIA ドライバ + CUDA（GPU モード）

```bash
# ドライバ確認（表示されればインストール済み）
nvidia-smi

# 未インストールの場合（例。バージョンは環境に合わせて）
sudo apt install -y nvidia-driver-550
sudo reboot
```

- CUDA ツールキットが必要な場合は https://developer.nvidia.com/cuda-downloads を参照
- cuDNN は faster-whisper の CTranslate2 が必要とする場合があります

> **CPU のみの環境**でも動作します（`install_ubuntu.sh --cpu` を使用）。

## 3. 一括インストール（推奨）

プロジェクトを Ubuntu にコピーしたら：

```bash
cd whisper_server
chmod +x install_ubuntu.sh
bash install_ubuntu.sh            # GPU 自動検出
# または
bash install_ubuntu.sh --cpu      # CPU モード
```

このスクリプトは以下を自動で行います。

1. システム依存（python3 / ffmpeg 等）のインストール
2. NVIDIA GPU の検出
3. Python 仮想環境 `venv` の作成
4. PyTorch（GPU 版 or CPU 版）と `requirements.txt` のインストール
5. スクリプトへの実行権限付与

## 4. 手動インストール（スクリプトを使わない場合）

```bash
cd whisper_server
python3 -m venv venv
source venv/bin/activate

# GPU モード
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121
# CPU モード
# pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu

pip install -r requirements.txt
```

## 5. 起動

```bash
cd whisper_server
bash start_all.sh        # Dashboard 起動（Whisper も自動起動）
```

- **GPU モード**：そのまま起動（`WHISPER_COMPUTE_TYPE=float16`）
- **CPU モード**：環境変数を設定して起動
  ```bash
  export WHISPER_COMPUTE_TYPE=int8
  bash start_all.sh
  ```

ブラウザで `http://<このPCのIP>:9001` を開きます。

## 6. ファイアウォール（LAN 利用時）

```bash
sudo ufw allow 9000/tcp
sudo ufw allow 9001/tcp
sudo ufw enable   # 必要に応じて
```

## 7. 自動起動の設定

### 方法A：Dashboard 画面から（デスクトップ環境）

Dashboard「設定 → 开机自启 / 起動時自動実行」を ON にする
→ `~/.config/autostart/MyWhisperServer.desktop` が作成され、デスクトップログイン時に自動起動します。

### 方法B：systemd サービス（ヘッドレスサーバ向け / 推奨）

`mywhisperserver.service` を編集してパスとユーザーを修正します：

```ini
WorkingDirectory=/home/USER/whisper_server
ExecStart=/bin/bash /home/USER/whisper_server/start_all.sh
User=USER
```

インストールして有効化：

```bash
sudo cp mywhisperserver.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable mywhisperserver
sudo systemctl start mywhisperserver

# 状態確認
systemctl status mywhisperserver

# ログ確認
journalctl -u mywhisperserver -f
```

## Linux の起動・停止スクリプト一覧

| ファイル | 説明 |
|---|---|
| `start_whisper.sh` | Whisper のみ起動 |
| `start_dashboard.sh` | Dashboard のみ起動 |
| `start_all.sh` | **推奨**。Dashboard を起動（Whisper は自動起動） |
| `stop_all.sh` | 9000 / 9001 / 9100（OCR）ポートのプロセスを停止 |
| `install_ubuntu.sh` | 初回セットアップを一括実行 |
| `mywhisperserver.service` | systemd 用ユニットファイル |

---

# 使い方（共通）

## 音声を文字起こしする

### 方法1：ブラウザ / curl から

```bash
curl -X POST http://127.0.0.1:9000/asr \
  -F "audio_file=@/path/to/audio.mp3" \
  -F "language=auto" \
  -F "output=txt"
```

レスポンス（txt）：
```
今日は音声認識のテストです。問題なく動作しています。
```

### パラメータ

| パラメータ | 値 | 説明 |
|---|---|---|
| `audio_file` | ファイル | mp3 / wav / m4a など（ffmpeg でデコード） |
| `language` | auto / ja / zh / en など | 言語指定（auto で自動検出） |
| `task` | transcribe / translate | 文字起こし or 英語翻訳 |
| `output` | txt / srt | 出力形式 |

### 注意事項

- 長い音声（数十分）は GPU でも数分～数十分かかります
- 対応形式は ffmpeg が扱えるもの全般（WAV / MP3 / M4A / FLAC / OGG 等）

## Dashboard の使い方

1. **ダッシュボード**：CPU・メモリ・GPU（利用 / VRAM / **温度**）のリアルタイム監視、**変換 / AI 校正フェーズの色帯**付きトレンドチャート、Whisper 制御（起動 / 停止 / 再起動 / モデル切り替え）、**リアルタイムロギングの開始 / 停止**、変換中の進捗バー（変換履歴は「変換履歴」画面で確認）
2. **変換履歴**：一覧（上部）＋ 変換内容（下部）。行の「表示」で内容表示、「コピー」でコピー、「校正」で保存済み結果に再度 AI 校正を実行、「音読み」で読み上げ、「ゴミ箱」で個別削除、ヘッダー右上の「全削除」で一括クリア。詳細は**変換文 / AI 校正文をタブ切替**でき、**両方の文字数**を確認可能。**本文のダブルクリック**でその文から読み上げ開始（再生中の読み上げは一時停止 / 再開）
3. **ログ履歴**：リアルタイムロギングで記録した JSONL を一覧・閲覧・ダウンロード・削除。各行は有効な JSON で **AI がそのまま解析可能**
4. **リアルタイムログ**：Whisper / Dashboard のログをリアルタイム表示
5. **設定**：既定言語・出力形式・更新間隔・GPU 温度しきい値・**Whisper 高速化**・**AI 校正（Deepseek）**・UI 言語・自動起動

---

# API リファレンス

## Whisper サーバ（ポート 9000）

| メソッド | パス | 説明 |
|---|---|---|
| POST | `/asr` | 音声ファイルをアップロードして文字起こし |
| POST | `/tts` | テキスト読み上げ（**LAN から認証なしで利用可**）。`POST {"text":"こんにちは","lang":"ja"}` → 既定は**音声バイトを直接返す**（`curl -o out.wav` で保存可）。`?format=json` で `{audio_base64,mime,duration,boundaries}` を返す。エンジン・音声はダッシュボード設定（`tts_engine` / `tts_kokoro_voice` / `tts_preload`）に従い、内部でダッシュボード `/api/v1/tts` にプロキシ |
| POST | `/correct` | 与えられたテキストを AI 校正して返す（`{"text":"..."}` → `{"result":"...","llm_model":"...","correct_elapsed":12.3}`） |
| POST | `/chat` | **チャット（LAN から認証なしで利用可）**。`POST {"message":"こんにちは","session_id":"..."}` → `{"reply":"...","session_id":"..."}`。LLM はダッシュボードのアクティブプロファイルに従い、内部で `/api/v1/chat` にプロキシ。会話履歴は `session_id` 単位で保持（省略時は新規） |
| POST | `/chat/stream` | **チャット（SSE ストリーミング・LAN から認証なしで利用可）**。`POST {"message":"..."}` → 文単位のテキスト＋音声イベントを透過中継（`text` / `audio_start` / `audio_chunk` / `audio_end` / `audio_skip` / `done` / `error`）。リアルタイム音声出力は受信側で base64 デコードして再生 |
| GET | `/health` | ヘルスチェック（`{"status":"ok","model":"medium"}`） |

## Dashboard（ポート 9001）

| メソッド | パス | 説明 |
|---|---|---|
| GET | `/` | Dashboard 画面 |
| GET | `/api/v1/health` | Dashboard ヘルスチェック |
| GET | `/api/v1/system` | システム監視スナップショット（CPU / メモリ / GPU / ディスク） |
| GET | `/api/v1/whisper/status` | Whisper 状態（実行中 / 管理下 / PID / モデル） |
| POST | `/api/v1/whisper/start` | Whisper 起動 |
| POST | `/api/v1/whisper/stop` | Whisper 停止 |
| POST | `/api/v1/whisper/restart` | Whisper 再起動 |
| POST | `/api/v1/whisper/model` | モデル切り替え `{"model":"small"}`（自動で再起動。**読込完了まで待機**し、失敗時は旧モデルへ自動復元） |
| POST | `/api/v1/whisper/status_event` | 変換中ステータス受信（内部用） |
| POST | `/api/v1/whisper/progress` | 変換進捗 0〜100 受信（内部用。`-1` = AI 校正中） |
| POST | `/api/v1/tts` | 音読み用 TTS 合成 `{"text":"...","lang":"ja"}` → `{"audio_base64":"...","mime":"audio/mpeg|audio/wav","duration":3.5,"boundaries":[{"t":0,"d":1.7}],"boundaries_approx":false}`。エンジンは config `tts_engine` で切替（edge / kokoro / vibevoice）。edge=MP3＋実測境界、kokoro=24kHz WAV＋文単位実測境界、vibevoice=24kHz WAV＋比例推定境界。未導入のエンジン指定時は **503** を返し、edge がフォールバック |
| POST | `/api/v1/chat` | **チャット（非ストリーミング）** `{"message":"...","session_id":"..."}` → `{"reply":"...","session_id":"..."}`。session_id 省略時は新規。LLM はアクティブプロファイル（`/api/v1/llm/profiles` の同期先）を使用 |
| POST | `/api/v1/chat/stream` | **チャット（SSE ストリーミング＋文単位リアルタイム音声）**。`{"message":"...","session_id":"...","lang":"ja","voice":"jf_gongitsune"}` → `text` / `audio_start` / `audio_chunk` / `audio_end` / `audio_skip` / `done` / `error` イベント。長文は読点・80 文字で分割し、**base64 を複数チャンクに分割**して送信（SSE 行長上限対策）。音声エンジン・音声はダッシュボード設定（`tts_engine` / `tts_kokoro_voice`）に従う |
| DELETE | `/api/v1/chat/{session_id}` | 指定セッションの会話履歴をクリア |
| POST | `/api/v1/realtime-log/start` | リアルタイムロギング開始（新規 JSONL 作成） |
| POST | `/api/v1/realtime-log/stop` | リアルタイムロギング停止（要約統計を追記） |
| GET | `/api/v1/realtime-log` | ログ一覧（各ファイルの要約 + 現在の記録状態） |
| GET | `/api/v1/realtime-log/{filename}` | 指定 JSONL の内容を返す（`realtime_YYYYMMDD_HHMMSS.jsonl` のみ許可） |
| DELETE | `/api/v1/realtime-log/{filename}` | ログファイル削除（記録中のファイルは不可） |
| POST | `/api/v1/ai/test` | LLM 接続テスト `{"api_key":"...","model":"...","base_url":"..."}` → `{"ok":true,"message":"OK","model":"..."}`（API キー任意＝Ollama 対応） |
| GET | `/api/v1/llm/profiles` | LLM プロファイル一覧（`active` フラグ付き） |
| POST | `/api/v1/llm/profiles` | LLM プロファイル追加 `{"name","base_url","api_key?","model"}` |
| PUT | `/api/v1/llm/profiles/{id}` | LLM プロファイル編集（アクティブ中は config スナップショットも同期） |
| DELETE | `/api/v1/llm/profiles/{id}` | LLM プロファイル削除（アクティブ削除時は AI 校正を OFF にリセット） |
| POST | `/api/v1/llm/profiles/{id}/activate` | LLM プロファイルを有効化（`deepseek_*` config に同期） |
| GET | `/api/v1/records` | 変換履歴一覧（`?limit=&offset=&search=`） |
| POST | `/api/v1/records` | 変換記録の登録（内部用） |
| DELETE | `/api/v1/records/{id}` | 変換記録を個別削除 |
| DELETE | `/api/v1/records` | 変換履歴を一括クリア |
| POST | `/api/v1/records/{id}/correct` | 保存済みの変換結果を再校正して上書き保存（校正時間も記録） |
| GET | `/api/v1/stats` | 統計（今日 / 累計 / 平均時間 / 平均速度 / 最終速度） |
| GET | `/api/v1/logs` | 最新ログ（`?lines=&source=`） |
| GET | `/api/v1/config` | 設定取得 |
| POST | `/api/v1/config` | 設定保存 |
| GET | `/api/v1/autostart` | 自動起動状態 |
| POST | `/api/v1/autostart` | 自動起動 ON/OFF `{"enabled":true}` |
| WS | `/ws` | リアルタイム通知（system_update / whisper_status / log_line / new_record / converting） |

### リアルタイムロギングの保存形式（JSONL / NDJSON）

`dashboard/logs/realtime/realtime_YYYYMMDD_HHMMSS.jsonl` に記録されます。**各行 = 1 つの有効な JSON オブジェクト**なので、Python / AI が `json.loads()` で 1 行ずつそのまま解析できます。

| 行タイプ | 内容 |
|---|---|
| `{"type":"meta","event":"session_start",...}` | 先頭。記録開始時刻・モデル名 |
| `{"type":"sample",...}` | 2 秒毎。CPU / GPU（利用・VRAM・温度・クロック・消費電力）/ メモリ / ディスク / Whisper 稼働 / 変換状態 / フェーズ（idle・transcribe・correct）/ 進捗% |
| `{"type":"event","event":"converting_start"\|"correct_start"\|"correct_end"\|"converting_end",...}` | 変換 / AI 校正の境界イベント |
| `{"type":"meta","event":"session_end",...}` | 末尾。サンプル数・記録時間・平均 CPU / GPU 利用 / GPU 温度 |

---

# 設定（Dashboard 画面）

## AI 校正（LLM モデル管理）

OpenAI 互換の `/chat/completions` を提供する任意の LLM（Deepseek ・ Ollama 等）が利用できます。設定画面の「**LLM モデル管理**」で複数のプロファイル（名前 / Base URL / API キー / モデル）を登録できます。

**Deepseek の場合**
1. [Deepseek API](https://platform.deepseek.com/) から API Key を取得
2. Dashboard「設定 → LLM モデル管理」→ 既定の `Deepseek` プロファイルに API キーを入力
3. モデル：`deepseek-chat`（推奨・最速）/ `deepseek-reasoner` / `deepseek-v4-flash`（実測では低速）
4. 「使用中」に設定して有効化

**Ollama の場合**
1. ローカルで Ollama を起動（例：`ollama serve`）し、モデルを準備（例：`ollama pull qwen2.5:7b`）
2. Dashboard「設定 → LLM モデル管理」→「追加」で `Base URL=http://localhost:11434/v1`、`モデル=qwen2.5:7b`（API キーは不要）を登録
3. 「有効化」→ AI 校正がローカル LLM で動作

**接続テスト**
- プロファイルの値が反映された「AI 校正」カードの「**LLM 接続テスト**」ボタンで接続確認 → 成功すると「AI 校正を有効化」が自動で ON になり即時保存されます
- 有効化中のプロファイルを削除すると AI 校正は OFF にリセットされます

以後、txt 形式の変換後に LLM が誤字・句読点・段落を自動修正します。
変換中は CPU カードに**変換進捗バー**と**AI 校正バー**の2段プログレスバーが表示されます。
修正されたレコードは履歴の「モデル」欄に `AI: 使用中モデル名` と表示され、「AI 校正」欄に校正時間が記録されます。
有効化なし・OFF の場合は通常どおり変換されます。

## モデル切り替え（Whisper）

Dashboard の「Whisper 服务控制」でモデルを選択して「モデル切替」を押すと自動で再起動します。

| モデル | サイズ | 精度 / 速度 | 推奨 VRAM |
|---|---|---|---|
| tiny | 約 75MB | 低 / 最速 | 1GB 未満 |
| base | 約 142MB | 低～中 / 高速 | 1GB |
| small | 約 466MB | 中 / 普通 | 2GB |
| medium | 約 1.5GB | 高 / 低速 | 5GB |
| large-v3-turbo | 約 1.6GB | 高 / 高速 | 5GB |
| large-v3 | 約 3GB | 最高 / 最遅 | 6GB（int8_float16） |

> GTX 1660 Ti 6GB では **small / medium / large-v3-turbo** が安定して動作します。
> **large-v3** は `int8_float16`（約 4GB VRAM）で動作しますが、変換に時間がかかります。`float16` は VRAM 不足で読込に失敗します。
> モデル切替時は**読込完了まで待機**し、読込に失敗した場合は**自動で前のモデルに復元**します。

## Whisper 高速化（モード切替 + 詳細設定）

Dashboard「設定」の「Whisper 高速化」で、速度と精度のバランスを切り替えられます。
**保存後に Whisper サービスを再起動すると反映**されます（再起動は自動で行われません）。

| モード | 計算タイプ | Beam | Temperature | VAD(ms) | 説明 |
|---|---|---|---|---|---|
| 速度優先 | int8_float16 | 1 | 0（貪欲） | 300 | 最速。会話・メモ向け |
| バランス | int8_float16 | 3 | 0（貪欲） | 500 | 既定。速度と精度のバランス |
| 精度優先 | float16 | 5 | 1（完全フォールバック） | 500 | 高精度。書き起こし原稿向け |
| カスタム | 任意 | 1〜8 | 0〜1 | 100〜3000 | 詳細パラメータを手動設定 |

各項目の意味：

- **計算タイプ**：`float16`（GPU 高速） / `int8_float16` / `int8`（省 VRAM・高速）など。
  GTX 1660 Ti では `int8_float16` が速度と精度の良い落とし所です。
- **Beam 幅**：小さいほど速く、1 でビームサーチをやめて貪欲デコードになります（精度はやや低下）。
- **Temperature**：`0` は貪欲デコードで最速。`1` は温度フォールバック（0〜1.0）で精度優先。
- **VAD 無音しきい値**：小さいほど無音部分を細かく区切ります。大きいと変換が速くなる傾向があります。

---

## 音読み TTS（エンジン切替）

読み上げの TTS エンジンは Dashboard「設定」→「読み上げ TTS」で切り替えられます。

> **エンジン切替は即時反映・再起動不要**です。設定を「保存」すると、次の読み上げから新しいエンジンが使われます（Whisper サービスの再起動・状態変更は不要。TTS はダッシュボード側で動作し、エンジン設定はリクエストごとに読み直されます）。Edge → Kokoro → VibeVoice のどれへでも即座に切り替わります。
>
> ⚠️ **注意（VRAM）**: プリロード ON（既定）で常駐させたローカルエンジンは、切り替えても **VRAM に残ったまま**です（Edge はクラウドのため VRAM を使いませんが、切替前に常駐していた Kokoro 等の VRAM は解放されません）。VRAM を解放するには「起動時にローカルTTSをVRAMに読込（常駐）」を **OFF** にしてダッシュボードを再起動してください。

| エンジン | 特徴 | 音声 |
|---|---|---|
| **Edge TTS**（既定） | クラウド・要インターネット。文境界は実測（SentenceBoundary）。MP3 | 言語別の女性ニューラル音声 |
| **Kokoro**（高速ローカル） | ローカル・オフライン。**GPU でウォーム時 0.3 秒程度**、24kHz WAV、文単位の実測境界。VRAM 約 1GB（Whisper と同居可）。モデルは `models/kokoro/` に格納済みで完全オフライン動作 | 日本語ネイティブ 5 声（女声 Alpha / Gongitsune / Nezumi / Tebukuro、男声 Kumo。設定画面＋Whisper サービス制御で選択可）ほか 8 言語 |
| **VibeVoice-Realtime-0.5B** | ローカル・ストリーミング。**日本語は実験的**（公式が「意味不明になる可能性」と注記）。文境界は文字数比例推定（`boundaries_approx=true`） | 実験的マルチリンガル（要 `.pt` 音声の別途取得） |

- **デバイス設定**：`自動（空きVRAMで判断）/ CUDA / CPU`。VibeVoice は**空き VRAM が 3GB 未満**だと CPU で実行（Whisper と同居しにくいため）。デバイスは**初回ロード時に確定**し、以後は維持します（VRAM 残量が揺れても往復ロードしない）。
- ローカルエンジンは**初回使用時にモデルを自動ダウンロード**します（しばらく待ちます。以降は高速）。
- 未導入のエンジンを選んだ場合は **503** が返り、Edge TTS に切り替えるか、以下で導入してください。

### Kokoro をオフラインで使う（モデル格納済み）

Kokoro は `whisper_server\models\kokoro\` に **モデル本体（config.json + kokoro-v1_0.pth）と日本語音声 5 種**を格納済みです。このフォルダがあれば **HF へのネットワークアクセスなしで完全オフライン**動作します（音声も `voices/` からローカルロード）。他の PC へ移す場合はこのフォルダごとコピーしてください。

Dashboard「設定 → **模型管理**」の **Kokoro モデル**セクションでも管理できます（一般立ち上げ時の DL は不要ですが、未配置 PC では**ダウンロードボタン**で `models/kokoro` へ取得、**削除ボタン**でフォルダごと削除できます）。

### 起動時プリロード（常駐・超高速応答）

設定「起動時にローカルTTSをVRAMに読込（常駐）」が **ON**（既定）だと、**ダッシュボード起動時に選択中のローカルエンジンを VRAM に読み込み、以後アンロードしません**。これにより **初回読み上げも即応答**（Kokoro は約 0.3 秒）になります。ログに `[tts] 起動時プリロード完了: kokoro を常駐` と出力されます。VRAM を節約したい場合は OFF にすると、5 分（未使用時）のアイドルで自動解放されます。

### 他 PC・端末から TTS を呼ぶ（LAN）

Whisper サーバ（ポート 9000）に **認証なしの `POST /tts`** を追加しました。スマートフォンや別 PC から直接読み上げが可能です。

```bash
# 音声を直接保存（wav / mp3 はエンジンにより変わる）
curl -X POST http://<PCのIP>:9000/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"こんにちは、お元気ですか。","lang":"ja"}' -o out.wav

# 境界情報付きで JSON を取得
curl -X POST "http://<PCのIP>:9000/tts?format=json" \
  -H "Content-Type: application/json" \
  -d '{"text":"こんにちは。","lang":"ja"}'
```

エンジン・音声はダッシュボードの設定に従います（リアルタイムチャットなどに利用可能）。

---

# PaddleOCR サービス（ポート 9100）

Dashboard から起動・停止できる **OCR サービス**を追加しました（PaddleOCR 3.x・**ポート 9100**）。

| モード | モデル | 入力 → 出力 |
|---|---|---|
| **画像 OCR** | PP-OCRv5 / PP-OCRv6 系（既定） | 画像（PNG/JPG 等）→ テキスト + 認識矩形 |
| **PDF → Markdown** | PP-StructureV3 | PDF（または画像）→ Markdown |

## インストール

```bash
# 1) Paddle GPU 本体（PyPI に無いため公式インデックスから。CUDA 11.8 ビルドは 12.x ドライバでも動作）
python -m pip install paddlepaddle-gpu==3.3.1 -i https://www.paddlepaddle.org.cn/packages/stable/cu118/

# 2) PaddleOCR + PP-StructureV3 用の追加依存
python -m pip install paddleocr==3.7.0 "paddlex[ocr]==3.7.2"
```

> ⚠️ **VRAM 注意**: 6GB GPU（GTX 1660 Ti 等）で Whisper medium + Kokoro + PaddleOCR を同時に動かすと VRAM が不足しがちです。PDF 構造解析（PP-StructureV3）は **使用時のみ遅延ロード** し、GPU が不足した場合は CPU に自動フォールバックします。OCR タブに警告を表示しています。

## Dashboard での操作

1. サイドバー **「OCR」** タブを開く
2. **「サービス開始」** で起動（初回はモデルを自動ダウンロードするため数分かかります）
3. 実行デバイス（GPU/CPU）・言語を選択し、**画像を選択 →「実行」** で文字認識
4. **PDF → Markdown** モードに切り替えると、アップロードした PDF を Markdown 化して表示・ダウンロードできます
5. 「設定」から **起動時自動起動**（ocr_autostart）を有効化できます（既定: オフ）

## モデル保存先

PaddleOCR モデルは **プロジェクト内 `models/paddlex/official_models/`** に保存されます（PaddleX の `PADDLE_PDX_CACHE_HOME` をプロジェクト内に固定。保存先は「設定 → 模型保存位置」に追従）。プロジェクトごと移動すればモデルも追従します。設定画面の **「模型管理」→「PaddleOCR 模型」** から、対応モデル15種の一覧・ダウンロード・削除・進捗確認ができます（Whisper / VibeVoice / Kokoro と同じ DL 機構）。

## API

- `GET http://127.0.0.1:9100/health` — 状態確認
  - `{"status":"ok","device":"gpu","ocr_ready":true,"structure_ready":false}`
- `POST /ocr`（multipart: `file`, `lang`）— 画像 OCR
- `POST /pdf`（multipart: `file`, `lang`）— PDF → Markdown（v1.8.12 以降、図版画像を base64 で `images`（`{"<basename>": "<base64>"}`）に同梱。クライアント側で保存・参照書換え）

```bash
# 画像 OCR（日本語）
curl -X POST http://127.0.0.1:9100/ocr -F "file=@scan.png" -F "lang=japan"

# PDF → Markdown
curl -X POST http://127.0.0.1:9100/pdf -F "file=@doc.pdf" -F "lang=japan"
```

Dashboard（ポート 9001）からも認証付きでプロキシできます：`POST /api/v1/ocr/run`・`POST /api/v1/ocr/pdf`・`POST /api/v1/ocr/start|stop|restart`・`GET /api/v1/ocr/status`。

### リアルタイムチャット・チャットボット API（音声出力付き）

LLM（Deepseek 等・`/api/v1/llm/profiles` のアクティブプロファイル）と会話し、**文単位で読み上げ音声を返す**チャット API を追加しました。チャットボット / スマートスピーカー風のリアルタイム音声応答に利用できます。

**① 非ストリーミング** — `POST /api/v1/chat`（9001）または `POST /chat`（9000・LAN 認証なし）

```bash
curl -X POST http://<PCのIP>:9000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"こんにちは、今日の天気は？"}'
# → {"reply":"...","session_id":"xxxx"}
# session_id を次のリクエストに渡すと会話履歴を引き継ぎます
```

**② SSE ストリーミング＋リアルタイム音声** — `POST /api/v1/chat/stream`（9001）または `POST /chat/stream`（9000・LAN 認証なし）

`{"message":"...","session_id":"...","lang":"ja","voice":"jf_gongitsune"}` を送ると、以下のイベントが順に届きます：

| type | 内容 |
|---|---|
| `text` | ここまでの全文（表示用・蓄積更新） |
| `audio_start` | 読み上げ片の開始（`text` / `mime` / `duration`） |
| `audio_chunk` | base64 音声チャンク（`audio_end` まで連結すると音声が完成） |
| `audio_end` | 読み上げ片の終わり |
| `audio_skip` | 合成失敗（テキストのみ再生） |
| `done` | 完了（`full` / `session_id`） |
| `error` | エラー |

- 長文は読点・80 文字で読み上げ単位に分割し、それぞれ **即座に音声合成**して返すため、最初の文の音声が生成完了まで待たずに再生を開始できます（Kokoro 常駐時は文あたり約 0.1〜0.3 秒）。
- 大きな音声は base64 を **複数チャンクに分割**して送るため、SSE の行長制限（512KB）に達しません。受信側は `audio_chunk` を連結して base64 デコード→ `mime`（audio/wav 等）で再生してください。
- 会話履歴はダッシュボード内のメモリに保持（1 セッション最大 40 メッセージ・30 分未使用で破棄）。`DELETE /api/v1/chat/{session_id}` でクリアできます。

### Kokoro の導入

```bash
python -m pip install "kokoro>=0.9.4" "misaki[ja]>=0.8" soundfile
```

### VibeVoice の導入（別途・実験的）

```bash
git clone https://github.com/microsoft/VibeVoice
cd VibeVoice
python -m pip install -e ".[streamingtts]"   # transformers を 4.51.3 に更新します
bash demo/download_experimental_voices.sh    # 日本語など実験的声（.pt）
```

> ⚠️ `.[streamingtts]` はグローバルの `transformers` を 4.51.3 に更新します。他のパッケージとの競合が心配な場合は仮想環境を分けてください。

> 📋 **実機での動作（GTX 1660 Ti 6GB / Win11 で検証）**
> - モデルは **fp16** でロードします（Turing 世代は bf16 の一部カーネルが未対応で生成時に落ちるため、Ampere 以降のみ bf16）
> - **初回ロードに約 40 秒**かかります（以降は維持）。アイドル 5 分でアンロードされ VRAM を解放
> - **ウォーム時は RTF 約 1.5〜1.8×**（5 秒の音声に 8 秒程度）。実時間よりやや遅いため、低遅延が最優先なら Kokoro / Edge を推奨
> - ロード時 VRAM 約 4〜5GB。Whisper（medium/int8）と同居は可能ですが、VRAM が逼迫し変換速度が落ちる場合があります

### VibeVoice モデル管理（DL / 選択）

VibeVoice には 2 つの TTS モデルがあります。Dashboard「設定」→「**模型管理**」の **VibeVoice モデル**セクションでダウンロードできます（既存の Whisper モデル DL 機構を流用。保存先も同じ `whisper_server/models`）。

| モデル | サイズ | 対応言語 | 合成 |
|---|---|---|---|
| **Realtime 0.5B**（既定） | 1.9GB | 日本語・英語ほか 9 言語（日本語は実験的） | ✅ このモデルで読み上げ |
| **TTS 1.5B** | 5.0GB | 英語・中国語のみ | ❌ 非対応（英語/中国語・CPU のみ・公式利用手順非公開のため） |

- **モデル選択**は「設定 → 読み上げ TTS」と、ダッシュボード「Whisper 服务控制」の **VibeVoice モデル**セレクタ（右寄せ表示・TTS エンジンが VibeVoice の時のみ表示）で切り替えられます。設定値は `tts_vibevoice_model`（`realtime` / `tts`、既定 `realtime`）として保存されます。
- **TTS 1.5B を選択しても合成は常に Realtime 0.5B で実行**されます（英語/中国語・CPU のみ・合成非対応のため）。選択時はログに「VibeVoice-TTS は合成未対応… Realtime-0.5B を使用」と表示され、UI にも注記されます。
- どちらかのモデルをダウンロード済み・あるいは Hugging Face キャッシュに存在する場合は、合成時に **ローカル snapshot を使い再ダウンロードされません**。

### モデルの削除（模型管理）

「**模型管理**」の各モデルリスト（Whisper / VibeVoice / Kokoro）に **削除ボタン** を追加しました。ダウンロード済みモデルをクリック（確認ダイアログ付き）で削除できます。保存先 `whisper_server/models` と既定 HF キャッシュの**両方から削除**されます。

- **現在使用中の Whisper モデル**は削除できません（先に別モデルへ切り替えてください）
- ダウンロード中・未配置のモデルにはボタンが表示されません
- 削除後に再度使用する場合は**ダウンロードボタン**で取得できます（Whisper モデルは `models` へ HF キャッシュ形式で保存）

---

# トラブルシューティング

### Dashboard が「Whisper 已停止 / 停止中」と表示される
- Whisper の `/health` が 2 秒以内に応答しないと表示されます。変換中は本来応答します（スレッド化済み）
- `server.log` を確認してください

### ポートが使用中
```
Windows: stop_all.bat を実行
Linux:   bash stop_all.sh を実行
```

### CUDA / GPU 関連のエラー
- `nvidia-smi` でドライバを確認
- モデルが大きすぎる場合は `small` に切り替え
- GPU が使えない場合：
  ```
  Windows: set WHISPER_COMPUTE_TYPE=int8  && start_whisper.bat
  Linux:   export WHISPER_COMPUTE_TYPE=int8 && bash start_whisper.sh
  ```

### 初回モデルダウンロードが遅い
- 数 GB のモデルはネットワーク状況によります。ダウンロード完了まで待機してください

### 履歴が保存されない
- `dashboard/data/records.db` が書き込み可能か確認してください

### AI 校正が動かない
- 設定で ON + API Key が正しいか確認
- `server.log` に `[AI correct]` のログが出ているか確認

### モデル切替が失敗する / Whisper が停止したまま
- 大規模モデル（large-v3 など）は VRAM 不足で読込に失敗することがあります。切替は**自動で前のモデルに復元**します
- `int8_float16` / `int8` にするか、`large-v3-turbo`・`medium` など小型モデルに切り替えてください
- `server.log` の `Loading Whisper model...` 以降にエラーが出ていないか確認してください

---

# ファイル構成

```
whisper_server/
├── whisper_server.py          # Whisper ASR サーバ（ポート 9000）
├── ocr_server.py              # PaddleOCR サービス（ポート 9100・画像OCR + PDF→Markdown）
├── lan_client.py              # （任意）LAN テストクライアント
├── test.mp3                   # テスト用音声（任意）
├── requirements.txt           # Python 依存パッケージ
│
├── start_whisper.bat          # [Windows] Whisper 起動
├── start_dashboard.bat        # [Windows] Dashboard 起動
├── start_all.bat              # [Windows] 推奨・一括起動
├── stop_all.bat               # [Windows] 一括停止
│
├── start_whisper.sh           # [Linux] Whisper 起動
├── start_dashboard.sh         # [Linux] Dashboard 起動
├── start_all.sh               # [Linux] 推奨・一括起動
├── stop_all.sh                # [Linux] 一括停止
├── install_ubuntu.sh          # [Linux] Ubuntu 一括セットアップ
├── mywhisperserver.service    # [Linux] systemd ユニット
│
└── dashboard/
    ├── app.py                 # Dashboard バックエンド（ポート 9001）
    ├── data/records.db        # SQLite データベース（自動生成）
    ├── logs/                  # Dashboard ログ（自動生成）
    │   └── realtime/          # リアルタイムロギング JSONL（自動生成）
    └── static/
        ├── index.html         # メイン画面
        ├── css/style.css      # スタイル
        └── js/app.js          # フロントエンドロジック
```

---

## ライセンス・注意

- 本ツールはローカル・家庭内 LAN での利用を想定しています
- Dashboard 管理 API に認証はありません。**インターネットに公開しないでください**
- 生成された変換結果・設定はローカルの SQLite にのみ保存されます
