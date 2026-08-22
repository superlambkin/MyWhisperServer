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
| 音読み（Edge TTS） | 変換履歴の詳細結果を **女性音声** で読み上げ。再クリックで**一時停止 / 再開**、読上げ中の文を**下線表示**、本文**ダブルクリック**で指定位置から再生 |
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
| `stop_all.bat` | 9000 / 9001 ポートのプロセスを停止 |

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
| `stop_all.sh` | 9000 / 9001 ポートのプロセスを停止 |
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
| POST | `/correct` | 与えられたテキストを AI 校正して返す（`{"text":"..."}` → `{"result":"...","llm_model":"...","correct_elapsed":12.3}`） |
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
| POST | `/api/v1/tts` | 詳細結果の音読み用 Edge TTS 合成 `{"text":"...","lang":"ja"}` → `{"audio_base64":"...","duration":3.5,"boundaries":[{"t":0,"d":12000000}]}`（文境界付き MP3） |
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
