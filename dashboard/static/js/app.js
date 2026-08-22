/**
 * MyWhisperServer Dashboard Frontend
 * 支持日文 / 中文 / 英文 多语言
 */

// ---------------------------------------------------------------------------
// 国际化 (i18n)
// ---------------------------------------------------------------------------
const I18N = {
    zh: {
        "nav.dashboard": "仪表盘",
        "nav.records": "转换履历",
        "nav.logs": "实时日志",
        "nav.settings": "设置",
        "sidebar.whisper_service": "Whisper 服务",
        "status.checking": "检查中...",
        "status.running": "运行中",
        "status.stopped": "已停止",
        "status.starting": "启动中",
        "status.converting": "转换中",
        "progress.label": "转换进度",
        "progress.correct_stage": "AI 校正",
        "progress.correcting": "AI 校正中...",
        "live.duration": "音声時間",
        "live.convert": "変換時間",
        "live.correct": "AI 校正",
        "live.elapsed": "処理時間",
        "live.file": "文件",
        "live.phase": "阶段",
        "live.phase.transcribe": "转换中",
        "live.phase.correct": "AI 校正中",
        "live.model": "模型",
        "live.speed": "实时倍速",
        "connection.connecting": "连接中",
        "connection.connected": "已连接",
        "connection.disconnected": "未连接",
        "stats.today": "今日转写",
        "stats.total": "总计转写",
        "stats.avg": "平均耗时",
        "stats.model": "模型",
        "stats.times": "次",
        "stats.seconds": "秒",
        "stats.speed": "平均速度",
        "stats.last_speed": "上次速度",
        "stats.speed_unit": "耗时/长度",
        "hardware.cpu_mem": "CPU & 内存监控",
        "hardware.cpu": "CPU",
        "hardware.memory": "内存",
        "hardware.cpu_freq": "CPU 频率",
        "hardware.mem_used": "内存已用",
        "cpu.name": "CPU 名称",
        "cpu.detecting": "检测中...",
        "cpu.cores": "逻辑核心",
        "storage.title": "存储",
        "hardware.gpu": "GPU 监控",
        "gpu.name": "GPU 名称",
        "gpu.detecting": "检测中...",
        "gpu.util": "利用率",
        "gpu.mem": "显存",
        "gpu.temp": "温度",
        "gpu.clock": "时钟",
        "gpu.power": "功耗",
        "gpu.mem_detail_prefix": "显存:",
        "gpu.not_available": "GPU 信息不可用",
        "gpu.not_detected": "未检测到 NVIDIA GPU",
        "realtime.trend": "实时趋势",
        "realtime.shrink": "缩小",
        "realtime.expand": "放大",
        "whisper.control": "Whisper 服务控制",
        "whisper.start": "启动服务",
        "whisper.stop": "停止服务",
        "whisper.restart": "重启服务",
        "whisper.status": "状态",
        "whisper.pid": "进程 ID",
        "whisper.uptime": "启动时间",
        "whisper.managed": "Dashboard 托管",
        "whisper.external": "外部启动",
        "whisper.model": "模型",
        "whisper.switch_model": "切换模型",
        "whisper.switching": "模型切换中，服务重启...",
        "whisper.switch_done": "模型已切换",
        "records.title": "转换履历",
        "records.search": "搜索文件名或结果...",
        "records.refresh": "刷新",
        "records.time": "时间",
        "records.filename": "文件名",
        "records.language": "语言",
        "records.duration": "音声時間",
        "records.convert_time": "変換時間",
        "records.correct_time": "AI 校正",
        "records.elapsed": "処理時間",
        "records.speed": "转换速度",
        "records.time_sec": "秒",
        "records.time_minsec": "分秒",
        "records.model": "模型",
        "records.copy": "复制文本",
        "records.copied": "已复制到剪贴板",
        "records.view_all": "查看全部",
        "records.close": "关闭",
        "records.llm_corrected": "LLM AI 校正",
        "records.summary": "结果摘要",
        "records.action": "操作",
        "records.empty": "暂无记录",
        "records.detail": "完整结果",
        "records.view": "查看",
        "records.delete": "删除",
        "records.delete_confirm": "确定删除这条记录吗？",
        "records.deleted": "记录已删除",
        "records.clear_all": "清空全部",
        "records.clear_confirm": "确定清空全部转换记录吗？此操作不可撤销。",
        "records.cleared": "记录已全部清空",
        "records.correct": "校正",
        "records.correcting": "AI 校正中，请稍候...",
        "records.corrected": "校正完成",
        "logs.title": "实时日志",
        "logs.all": "全部",
        "logs.clear": "清空显示",
        "logs.waiting": "等待日志...",
        "settings.transcription": "转写默认设置",
        "settings.interface": "界面设置",
        "settings.language": "默认语言",
        "settings.language.auto": "自动检测",
        "settings.language.zh": "中文",
        "settings.language.en": "English",
        "settings.language.ja": "日本語",
        "settings.output": "默认输出格式",
        "settings.output.txt": "纯文本 (txt)",
        "settings.output.srt": "字幕 (srt)",
        "settings.refresh": "刷新间隔 (毫秒)",
        "settings.temp": "GPU 温度告警阈值 (°C)",
        "speed.title": "Whisper 高速化",
        "speed.mode": "模式",
        "speed.mode.fast": "速度优先",
        "speed.mode.balanced": "平衡",
        "speed.mode.accurate": "精度优先",
        "speed.mode.custom": "自定义",
        "speed.compute_type": "计算类型",
        "speed.beam_size": "Beam 宽度（越小越快）",
        "speed.temperature": "Temperature（0=贪婪解码，1=完整回退）",
        "speed.vad_ms": "VAD 静音检测阈值（毫秒）",
        "speed.hint": "更改后保存，并重启 Whisper 服务使其生效。",
        "speed.need_restart": "高速化设置已保存，请重启 Whisper 服务使其生效",
        "settings.ui_language": "界面语言",
        "ai.title": "AI 校正（LLM）",
        "ai.enable": "启用 AI 校正",
        "ai.enable_desc": "转写完成后使用 LLM 修正错字、标点和段落",
        "ai.api_key": "API Key（可选）",
        "ai.model": "模型",
        "ai.base_url": "Base URL",
        "ai.active_profile": "当前模型配置",
        "ai.test": "LLM 连接测试",
        "ai.testing": "测试中...",
        "ai.test_ok": "连接成功",
        "ai.test_fail": "连接失败",
        "ai.test_no_base_url": "请先设置 Base URL",
        "ai.test_enabled": "测试成功，AI 校正已启用",
        "llm.title": "LLM 模型管理",
        "llm.add": "追加",
        "llm.empty": "暂无模型配置",
        "llm.active": "使用中",
        "llm.activate": "启用",
        "llm.edit": "编辑",
        "llm.delete": "删除",
        "llm.name": "名称",
        "llm.base_url": "Base URL",
        "llm.model": "模型",
        "llm.api_key": "API Key（可选）",
        "llm.save": "保存",
        "llm.cancel": "取消",
        "llm.delete_confirm": "删除此模型配置？",
        "llm.activate_success": "已启用该模型配置",
        "llm.saved": "模型配置已保存",
        "llm.deleted": "模型配置已删除",
        "llm.need_name_url": "请填写名称和 Base URL",
        "settings.save": "保存设置",
        "settings.saved": "设置已保存",
        "settings.save_failed": "保存失败",
        "settings.hint": "更改后点击保存。Whisper 高速化・模型相关设置需重启 Whisper 服务生效。",
        "autostart.title": "开机自启",
        "autostart.enable": "Windows 启动时自动运行",
        "autostart.desc": "自动启动 Whisper 服务和 Dashboard",
        "autostart.status.checking": "状态: 检查中...",
        "autostart.status.enabled": "状态: 已启用",
        "autostart.status.disabled": "状态: 未启用",
        "autostart.path_hint": "开启后，会在 Windows 启动文件夹中创建快捷方式：",
        "autostart.enabled": "开机自启已开启",
        "autostart.disabled": "开机自启已关闭",
        "toast.starting": "服务启动中",
        "toast.stopping": "服务停止中",
        "toast.restarting": "服务重启中",
        "toast.action_failed": "操作失败",
        "toast.network_error": "网络错误",
    },
    ja: {
        "nav.dashboard": "ダッシュボード",
        "nav.records": "変換履歴",
        "nav.logs": "リアルタイムログ",
        "nav.settings": "設定",
        "sidebar.whisper_service": "Whisper サービス",
        "status.checking": "確認中...",
        "status.running": "実行中",
        "status.stopped": "停止中",
        "status.starting": "起動中",
        "status.converting": "変換中",
        "progress.label": "変換進捗",
        "progress.correct_stage": "AI 校正",
        "progress.correcting": "AI 校正中...",
        "live.duration": "音声時間",
        "live.convert": "変換時間",
        "live.correct": "AI 校正時間",
        "live.elapsed": "処理時間",
        "live.file": "ファイル",
        "live.phase": "段階",
        "live.phase.transcribe": "変換中",
        "live.phase.correct": "AI 校正中",
        "live.model": "モデル",
        "live.speed": "実時倍速",
        "connection.connecting": "接続中",
        "connection.connected": "接続済み",
        "connection.disconnected": "未接続",
        "stats.today": "今日の変換",
        "stats.total": "累計変換",
        "stats.avg": "平均処理時間",
        "stats.model": "モデル",
        "stats.times": "回",
        "stats.seconds": "秒",
        "stats.speed": "平均速度",
        "stats.last_speed": "前回速度",
        "stats.speed_unit": "処理時間/長さ",
        "hardware.cpu_mem": "CPU & メモリモニター",
        "hardware.cpu": "CPU",
        "hardware.memory": "メモリ",
        "hardware.cpu_freq": "CPU 周波数",
        "hardware.mem_used": "使用メモリ",
        "cpu.name": "CPU 名",
        "cpu.detecting": "検出中...",
        "cpu.cores": "論理コア",
        "storage.title": "ストレージ",
        "hardware.gpu": "GPU モニター",
        "gpu.name": "GPU 名",
        "gpu.detecting": "検出中...",
        "gpu.util": "利用率",
        "gpu.mem": "VRAM",
        "gpu.temp": "温度",
        "gpu.clock": "クロック",
        "gpu.power": "消費電力",
        "gpu.mem_detail_prefix": "VRAM:",
        "gpu.not_available": "GPU 情報を取得できません",
        "gpu.not_detected": "NVIDIA GPU が検出されません",
        "realtime.trend": "リアルタイム推移",
        "realtime.shrink": "縮小",
        "realtime.expand": "拡大",
        "whisper.control": "Whisper サービス制御",
        "whisper.start": "サービス開始",
        "whisper.stop": "サービス停止",
        "whisper.restart": "サービス再起動",
        "whisper.status": "状態",
        "whisper.pid": "プロセス ID",
        "whisper.uptime": "起動時間",
        "whisper.managed": "Dashboard 管理",
        "whisper.external": "外部起動",
        "whisper.model": "モデル",
        "whisper.switch_model": "モデル切替",
        "whisper.switching": "モデル切替中、サービス再起動...",
        "whisper.switch_done": "モデルを切り替えました",
        "records.title": "変換履歴",
        "records.search": "ファイル名や結果を検索...",
        "records.refresh": "更新",
        "records.time": "時刻",
        "records.filename": "ファイル名",
        "records.language": "言語",
        "records.duration": "音声時間",
        "records.convert_time": "変換時間",
        "records.correct_time": "AI 校正時間",
        "records.elapsed": "処理時間",
        "records.speed": "変換速度",
        "records.time_sec": "秒",
        "records.time_minsec": "分秒",
        "records.model": "モデル",
        "records.copy": "テキストをコピー",
        "records.copied": "クリップボードにコピーしました",
        "records.view_all": "すべて表示",
        "records.close": "閉じる",
        "records.llm_corrected": "LLM AI 校正",
        "records.summary": "結果要約",
        "records.action": "操作",
        "records.empty": "履歴がありません",
        "records.detail": "詳細結果",
        "records.view": "表示",
        "records.delete": "削除",
        "records.delete_confirm": "この記録を削除しますか？",
        "records.deleted": "記録を削除しました",
        "records.clear_all": "全削除",
        "records.clear_confirm": "すべての変換履歴を削除しますか？この操作は元に戻せません。",
        "records.cleared": "履歴をすべて削除しました",
        "records.correct": "校正",
        "records.correcting": "AI 校正中、お待ちください...",
        "records.corrected": "校正が完了しました",
        "logs.title": "リアルタイムログ",
        "logs.all": "すべて",
        "logs.clear": "表示をクリア",
        "logs.waiting": "ログを待っています...",
        "settings.transcription": "変換の既定設定",
        "settings.interface": "インターフェース設定",
        "settings.language": "既定の言語",
        "settings.language.auto": "自動検出",
        "settings.language.zh": "中文",
        "settings.language.en": "English",
        "settings.language.ja": "日本語",
        "settings.output": "既定の出力形式",
        "settings.output.txt": "テキスト (txt)",
        "settings.output.srt": "字幕 (srt)",
        "settings.refresh": "更新間隔 (ミリ秒)",
        "settings.temp": "GPU 温度警告しきい値 (°C)",
        "speed.title": "Whisper 高速化",
        "speed.mode": "モード",
        "speed.mode.fast": "速度優先",
        "speed.mode.balanced": "バランス",
        "speed.mode.accurate": "精度優先",
        "speed.mode.custom": "カスタム",
        "speed.compute_type": "計算タイプ",
        "speed.beam_size": "Beam 幅（小さいほど高速）",
        "speed.temperature": "Temperature（0=貪欲デコード，1=完全フォールバック）",
        "speed.vad_ms": "VAD 無音検出しきい値（ミリ秒）",
        "speed.hint": "変更後は保存して Whisper サービスを再起動すると反映されます。",
        "speed.need_restart": "高速化設定を保存しました。Whisper サービスを再起動してください",
        "settings.ui_language": "表示言語",
        "ai.title": "AI 校正（LLM）",
        "ai.enable": "AI 校正を有効化",
        "ai.enable_desc": "変換完了後に LLM で誤字・句読点・段落を修正",
        "ai.api_key": "API キー（任意）",
        "ai.model": "モデル",
        "ai.base_url": "Base URL",
        "ai.active_profile": "使用中プロファイル",
        "ai.test": "LLM 接続テスト",
        "ai.testing": "テスト中...",
        "ai.test_ok": "接続成功",
        "ai.test_fail": "接続失敗",
        "ai.test_no_base_url": "先に Base URL を設定してください",
        "ai.test_enabled": "テスト成功。AI 校正を有効化しました",
        "llm.title": "LLM モデル管理",
        "llm.add": "追加",
        "llm.empty": "モデルがありません",
        "llm.active": "使用中",
        "llm.activate": "有効化",
        "llm.edit": "編集",
        "llm.delete": "削除",
        "llm.name": "名前",
        "llm.base_url": "Base URL",
        "llm.model": "モデル",
        "llm.api_key": "API キー（任意）",
        "llm.save": "保存",
        "llm.cancel": "キャンセル",
        "llm.delete_confirm": "この設定を削除しますか？",
        "llm.activate_success": "このモデル設定を有効化しました",
        "llm.saved": "モデル設定を保存しました",
        "llm.deleted": "モデル設定を削除しました",
        "llm.need_name_url": "名前と Base URL を入力してください",
        "settings.save": "設定を保存",
        "settings.saved": "設定を保存しました",
        "settings.save_failed": "保存に失敗しました",
        "settings.hint": "変更後は「保存」を押してください。Whisper 高速化・モデル関連の設定は Whisper サービスの再起動で反映されます。",
        "autostart.title": "起動時自動実行",
        "autostart.enable": "Windows 起動時に自動実行",
        "autostart.desc": "Whisper サービスと Dashboard を自動起動",
        "autostart.status.checking": "状態: 確認中...",
        "autostart.status.enabled": "状態: 有効",
        "autostart.status.disabled": "状態: 無効",
        "autostart.path_hint": "有効にすると、Windows のスタートアップ フォルダーにショートカットを作成します:",
        "autostart.enabled": "起動時自動実行を有効にしました",
        "autostart.disabled": "起動時自動実行を無効にしました",
        "toast.starting": "サービスを開始しています",
        "toast.stopping": "サービスを停止しています",
        "toast.restarting": "サービスを再起動しています",
        "toast.action_failed": "操作に失敗しました",
        "toast.network_error": "ネットワークエラー",
    },
    en: {
        "nav.dashboard": "Dashboard",
        "nav.records": "Transcription History",
        "nav.logs": "Live Logs",
        "nav.settings": "Settings",
        "sidebar.whisper_service": "Whisper Service",
        "status.checking": "Checking...",
        "status.running": "Running",
        "status.stopped": "Stopped",
        "status.starting": "Starting",
        "status.converting": "Converting",
        "progress.label": "Progress",
        "progress.correct_stage": "AI Correct",
        "progress.correcting": "AI correcting...",
        "live.duration": "Audio Time",
        "live.convert": "Convert Time",
        "live.correct": "AI Correct",
        "live.elapsed": "Total Time",
        "live.file": "File",
        "live.phase": "Phase",
        "live.phase.transcribe": "Transcribing",
        "live.phase.correct": "AI Correcting",
        "live.model": "Model",
        "live.speed": "Speed",
        "connection.connecting": "Connecting",
        "connection.connected": "Connected",
        "connection.disconnected": "Disconnected",
        "stats.today": "Today",
        "stats.total": "Total",
        "stats.avg": "Avg Duration",
        "stats.model": "Model",
        "stats.times": "times",
        "stats.seconds": "s",
        "stats.speed": "Avg Speed",
        "stats.last_speed": "Last Speed",
        "stats.speed_unit": "elapsed/duration",
        "hardware.cpu_mem": "CPU & Memory Monitor",
        "hardware.cpu": "CPU",
        "hardware.memory": "Memory",
        "hardware.cpu_freq": "CPU Frequency",
        "hardware.mem_used": "Memory Used",
        "cpu.name": "CPU Name",
        "cpu.detecting": "Detecting...",
        "cpu.cores": "Logical Cores",
        "storage.title": "Storage",
        "hardware.gpu": "GPU Monitor",
        "gpu.name": "GPU Name",
        "gpu.detecting": "Detecting...",
        "gpu.util": "Utilization",
        "gpu.mem": "VRAM",
        "gpu.temp": "Temp",
        "gpu.clock": "Clock",
        "gpu.power": "Power",
        "gpu.mem_detail_prefix": "VRAM:",
        "gpu.not_available": "GPU info unavailable",
        "gpu.not_detected": "No NVIDIA GPU detected",
        "realtime.trend": "Real-time Trend",
        "realtime.shrink": "Shrink",
        "realtime.expand": "Expand",
        "whisper.control": "Whisper Service Control",
        "whisper.start": "Start Service",
        "whisper.stop": "Stop Service",
        "whisper.restart": "Restart Service",
        "whisper.status": "Status",
        "whisper.pid": "Process ID",
        "whisper.uptime": "Start Time",
        "whisper.managed": "Dashboard Managed",
        "whisper.external": "Externally Started",
        "whisper.model": "Model",
        "whisper.switch_model": "Switch Model",
        "whisper.switching": "Switching model, restarting service...",
        "whisper.switch_done": "Model switched",
        "records.title": "Transcription History",
        "records.search": "Search filename or result...",
        "records.refresh": "Refresh",
        "records.time": "Time",
        "records.filename": "Filename",
        "records.language": "Language",
        "records.duration": "Audio Time",
        "records.convert_time": "Convert Time",
        "records.correct_time": "AI Correct",
        "records.elapsed": "Total Time",
        "records.speed": "Speed",
        "records.time_sec": "sec",
        "records.time_minsec": "min:sec",
        "records.model": "Model",
        "records.copy": "Copy Text",
        "records.copied": "Copied to clipboard",
        "records.view_all": "View All",
        "records.close": "Close",
        "records.llm_corrected": "LLM AI corrected",
        "records.summary": "Summary",
        "records.action": "Action",
        "records.empty": "No records",
        "records.detail": "Full Result",
        "records.view": "View",
        "records.delete": "Delete",
        "records.delete_confirm": "Delete this record?",
        "records.deleted": "Record deleted",
        "records.clear_all": "Clear All",
        "records.clear_confirm": "Delete all conversion history? This cannot be undone.",
        "records.cleared": "All history cleared",
        "records.correct": "Correct",
        "records.correcting": "AI correcting, please wait...",
        "records.corrected": "Corrected",
        "logs.title": "Live Logs",
        "logs.all": "All",
        "logs.clear": "Clear Display",
        "logs.waiting": "Waiting for logs...",
        "settings.transcription": "Transcription Defaults",
        "settings.interface": "Interface Settings",
        "settings.language": "Default Language",
        "settings.language.auto": "Auto Detect",
        "settings.language.zh": "中文",
        "settings.language.en": "English",
        "settings.language.ja": "日本語",
        "settings.output": "Default Output Format",
        "settings.output.txt": "Plain Text (txt)",
        "settings.output.srt": "Subtitles (srt)",
        "settings.refresh": "Refresh Interval (ms)",
        "settings.temp": "GPU Temp Alert Threshold (°C)",
        "speed.title": "Whisper Speed",
        "speed.mode": "Mode",
        "speed.mode.fast": "Fast",
        "speed.mode.balanced": "Balanced",
        "speed.mode.accurate": "Accurate",
        "speed.mode.custom": "Custom",
        "speed.compute_type": "Compute Type",
        "speed.beam_size": "Beam size (lower = faster)",
        "speed.temperature": "Temperature (0=greedy, 1=full fallback)",
        "speed.vad_ms": "VAD min silence (ms)",
        "speed.hint": "Save settings, then restart the Whisper service to apply.",
        "speed.need_restart": "Speed settings saved. Restart the Whisper service to apply",
        "settings.ui_language": "Interface Language",
        "ai.title": "AI Correction (LLM)",
        "ai.enable": "Enable AI Correction",
        "ai.enable_desc": "Use LLM to fix typos, punctuation and paragraphs after transcription",
        "ai.api_key": "API Key (optional)",
        "ai.model": "Model",
        "ai.base_url": "Base URL",
        "ai.active_profile": "Active profile",
        "ai.test": "Test LLM",
        "ai.testing": "Testing...",
        "ai.test_ok": "Connected",
        "ai.test_fail": "Connection failed",
        "ai.test_no_base_url": "Set Base URL first",
        "ai.test_enabled": "Test succeeded, AI correction enabled",
        "llm.title": "LLM Model Management",
        "llm.add": "Add",
        "llm.empty": "No profiles",
        "llm.active": "Active",
        "llm.activate": "Activate",
        "llm.edit": "Edit",
        "llm.delete": "Delete",
        "llm.name": "Name",
        "llm.base_url": "Base URL",
        "llm.model": "Model",
        "llm.api_key": "API Key (optional)",
        "llm.save": "Save",
        "llm.cancel": "Cancel",
        "llm.delete_confirm": "Delete this profile?",
        "llm.activate_success": "Profile activated",
        "llm.saved": "Profile saved",
        "llm.deleted": "Profile deleted",
        "llm.need_name_url": "Name and Base URL are required",
        "settings.save": "Save Settings",
        "settings.saved": "Settings saved",
        "settings.save_failed": "Failed to save",
        "settings.hint": "Save after making changes. Speed & model-related settings apply after restarting the Whisper service.",
        "autostart.title": "Auto-start",
        "autostart.enable": "Run automatically when Windows starts",
        "autostart.desc": "Auto-start Whisper service and Dashboard",
        "autostart.status.checking": "Status: Checking...",
        "autostart.status.enabled": "Status: Enabled",
        "autostart.status.disabled": "Status: Disabled",
        "autostart.path_hint": "When enabled, a shortcut will be created in the Windows Startup folder:",
        "autostart.enabled": "Auto-start enabled",
        "autostart.disabled": "Auto-start disabled",
        "toast.starting": "Service starting",
        "toast.stopping": "Service stopping",
        "toast.restarting": "Service restarting",
        "toast.action_failed": "Operation failed",
        "toast.network_error": "Network error",
    }
};

let uiLanguage = localStorage.getItem('ui_language') || 'zh';

function t(key, fallback = '') {
    const dict = I18N[uiLanguage] || I18N['zh'];
    return dict[key] !== undefined ? dict[key] : (fallback || key);
}

function setUiLanguage(lang) {
    if (!I18N[lang]) return;
    uiLanguage = lang;
    localStorage.setItem('ui_language', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    applyI18n();
    updateChartLabels();
    if ($('#setting-ui-language')) {
        $('#setting-ui-language').value = lang;
    }
}

function updateChartLabels() {
    if (!mainChart) return;
    mainChart.data.datasets[0].label = 'CPU %';
    mainChart.data.datasets[1].label = uiLanguage === 'ja' ? 'メモリ %' : uiLanguage === 'zh' ? '内存 %' : 'Memory %';
    mainChart.data.datasets[2].label = uiLanguage === 'ja' ? 'GPU 利用率 %' : uiLanguage === 'zh' ? 'GPU 利用率 %' : 'GPU Util %';
    mainChart.data.datasets[3].label = uiLanguage === 'ja' ? 'GPU VRAM %' : uiLanguage === 'zh' ? 'GPU 显存 %' : 'GPU VRAM %';
    mainChart.update('none');
}

function applyI18n() {
    // data-i18n 文本
    $all('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key, el.textContent);
    });
    // data-i18n-placeholder 占位符
    $all('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key, el.placeholder);
    });
    // 页面标题
    const active = document.querySelector('.nav-link.active');
    if (active) {
        const section = active.dataset.section;
        $('#page-title').textContent = t(`nav.${section}`);
    }
    // 刷新动态区域
    updateConnectionStatus(ws && ws.readyState === WebSocket.OPEN);
    updateWhisperStatus(lastWhisperStatus || { running: false });
    renderRecords(lastRecords || []);
    renderLLMProfiles(llmProfiles || []);
}

// ---------------------------------------------------------------------------
// 全局状态
// ---------------------------------------------------------------------------
let ws = null;
let mainChart = null;
let config = {
    default_language: 'zh',
    default_output: 'txt',
    refresh_interval: 1000,
    gpu_temp_threshold: 80,
    ui_language: 'zh',
    whisper_model: 'medium',
    whisper_mode: 'balanced',
    whisper_compute_type: 'int8_float16',
    whisper_beam_size: '3',
    whisper_temperature: '0',
    whisper_vad_min_silence_ms: '500',
    ai_correct_enabled: 'false',
    deepseek_api_key: '',
    deepseek_model: 'deepseek-chat',
    deepseek_base_url: 'https://api.deepseek.com/v1',
    active_llm_profile: '',
};

// Whisper 高速化模式预设（针对 GTX 1660 Ti 6GB 调优）
const WHISPER_MODES = {
    fast:     { whisper_compute_type: 'int8_float16', whisper_beam_size: '1', whisper_temperature: '0', whisper_vad_min_silence_ms: '300' },
    balanced: { whisper_compute_type: 'int8_float16', whisper_beam_size: '3', whisper_temperature: '0', whisper_vad_min_silence_ms: '500' },
    accurate: { whisper_compute_type: 'float16',      whisper_beam_size: '5', whisper_temperature: '1', whisper_vad_min_silence_ms: '500' },
    custom: null,
};

function applySpeedMode(mode) {
    const preset = WHISPER_MODES[mode];
    if (!preset) return; // 自定义模式不覆盖详细输入
    $('#setting-compute-type').value = preset.whisper_compute_type;
    $('#setting-beam-size').value = preset.whisper_beam_size;
    $('#setting-temperature').value = preset.whisper_temperature;
    $('#setting-vad-ms').value = preset.whisper_vad_min_silence_ms;
}

let lastWhisperStatus = null;
let lastRecords = null;
let llmProfiles = []; // LLM プロファイル一覧
let activeLlmModel = ''; // アクティブな LLM プロファイルのモデル名（AI 校正バー表示用）
let currentConverting = false; // 是否正在转换（驱动状态显示与进度条）
let currentModel = ''; // 実行中 Whisper モデル（リアルタイム監視表示用）
let trendWindow = parseInt(localStorage.getItem('trend_window') || '60', 10); // 趋势图横向显示点数
let timeUnit = localStorage.getItem('records_time_unit') || 'sec'; // 履历时间显示单位: 'sec' | 'minsec'

// 変換リアルタイム監視の状態（whisper_server からの converting/progress イベントで構築）
let conversionTiming = {
    active: false,
    startTs: null,          // リクエスト開始（ms）
    correctStartTs: null,   // AI 校正フェーズ開始（ms）
    correctEndTs: null,     // AI 校正フェーズ終了（ms）
    endTs: null,            // 変換全体の終了（ms）— 前回変換結果の固定表示用
    duration: 0,            // 音声時間（秒）
    durationKnown: false,   // 音声時間が確定したか
    phase: 'transcribe',    // 'transcribe' | 'correct'
    filename: '',
};

const API_BASE = '/api/v1';

// ---------------------------------------------------------------------------
// 認証（接続トークン）
// ---------------------------------------------------------------------------
function getToken() {
    return localStorage.getItem('dashboard_token') || '';
}

function setToken(tok) {
    if (tok) localStorage.setItem('dashboard_token', tok);
    else localStorage.removeItem('dashboard_token');
}

function buildWsUrl() {
    const base = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws';
    const tok = getToken();
    return tok ? `${base}?token=${encodeURIComponent(tok)}` : base;
}

let _tokenPrompting = false;
function promptToken() {
    if (_tokenPrompting) return;
    _tokenPrompting = true;
    const modal = $('#auth-modal');
    if (modal) {
        modal.classList.remove('hidden');
        const input = $('#auth-token-input');
        if (input) input.focus();
    } else {
        // フォールバック：modal が無い場合は native prompt
        const tok = window.prompt('接続トークンを入力してください:');
        _tokenPrompting = false;
        if (tok) {
            setToken(tok.trim());
            location.reload();
        }
    }
}

// 認証ヘッダーを注入した fetch ラッパー（401 ならトークン入力を促す）
async function apiFetch(url, options = {}) {
    const headers = { ...(options.headers || {}), ...authHeaders() };
    const resp = await fetch(url, { ...options, headers });
    if (resp.status === 401) {
        promptToken();
    }
    return resp;
}

function authHeaders() {
    const tok = getToken();
    return tok ? { 'Authorization': 'Bearer ' + tok } : {};
}

// ページロード時：トークンを取得（ループバックは自動、LAN は 401 → 入力モーダル）
async function initAuth() {
    try {
        const resp = await apiFetch(`${API_BASE}/auth/token`);
        if (resp.ok) {
            const data = await resp.json();
            if (data.token && data.token !== getToken()) {
                setToken(data.token);
                if (ws) { try { ws.close(); } catch (e) {} }
                connectWebSocket();
            }
        }
    } catch (e) {
        console.error('auth init failed:', e);
    }
}

// トークン関連 UI（モーダル保存・設定画面の表示/コピー/再生成）
function closeAuthModal() {
    const modal = $('#auth-modal');
    if (modal) modal.classList.add('hidden');
    _tokenPrompting = false;
}

async function loadAuthTokenDisplay() {
    try {
        const resp = await apiFetch(`${API_BASE}/auth/token`);
        if (resp.ok) {
            const data = await resp.json();
            const display = $('#auth-token-display');
            if (display && data.token) display.value = data.token;
        }
    } catch (e) {
        console.error('load auth token failed:', e);
    }
}

async function regenerateAuthToken() {
    try {
        const resp = await apiFetch(`${API_BASE}/auth/token/regenerate`, { method: 'POST' });
        const data = await resp.json();
        if (data.success) {
            setToken(data.token);
            const display = $('#auth-token-display');
            if (display) display.value = data.token;
            if (ws) { try { ws.close(); } catch (e) {} }
            connectWebSocket();
            showToast('接続トークンを再生成しました', 'success');
        } else {
            showToast(data.error || '再生成に失敗しました', 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
}

async function copyAuthToken() {
    const display = $('#auth-token-display');
    if (!display || !display.value) return;
    try {
        await navigator.clipboard.writeText(display.value);
        showToast('トークンをコピーしました', 'success');
    } catch (e) {
        showToast('コピーに失敗しました: ' + e.message, 'error');
    }
}

function setupAuthUI() {
    const saveBtn = $('#btn-auth-token-save');
    if (saveBtn) saveBtn.addEventListener('click', () => {
        const input = $('#auth-token-input');
        const tok = input ? input.value.trim() : '';
        if (tok) {
            setToken(tok);
            closeAuthModal();
            if (ws) { try { ws.close(); } catch (e) {} }
            connectWebSocket();
            loadRecords();
        } else {
            showToast('トークンを入力してください', 'error');
        }
    });
    const closeBtn = $('#btn-auth-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeAuthModal);
    const modal = $('#auth-modal');
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAuthModal();
    });
    const copyBtn = $('#btn-auth-token-copy');
    if (copyBtn) copyBtn.addEventListener('click', copyAuthToken);
    const regenBtn = $('#btn-auth-token-regenerate');
    if (regenBtn) regenBtn.addEventListener('click', regenerateAuthToken);
}

// ---------------------------------------------------------------------------
// 工具函数
// ---------------------------------------------------------------------------
function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return document.querySelectorAll(selector);
}

function formatDateTime(isoString) {
    if (!isoString) return '--';
    const d = new Date(isoString);
    const locale = uiLanguage === 'zh' ? 'zh-CN' : uiLanguage === 'ja' ? 'ja-JP' : 'en-US';
    return d.toLocaleString(locale, {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// 履历的时间显示：timeUnit='sec' → "12.3s" / 'minsec' → "1:23"
function formatTime(seconds, unit = timeUnit) {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return '--';
    if (unit === 'minsec') {
        const total = Math.round(seconds);
        const m = Math.floor(total / 60);
        const s = total % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
    }
    return seconds.toFixed(1) + 's';
}

function setRingProgress(elementId, percent, maxOffset = 283) {
    const ring = $(elementId);
    if (!ring) return;
    const offset = maxOffset - (percent / 100) * maxOffset;
    ring.style.strokeDashoffset = offset;
}

function truncate(str, len = 50) {
    if (!str) return '';
    return str.length > len ? str.substring(0, len) + '...' : str;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ---------------------------------------------------------------------------
// WebSocket
// ---------------------------------------------------------------------------
function connectWebSocket() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        return;
    }

    ws = new WebSocket(buildWsUrl());

    ws.onopen = () => {
        updateConnectionStatus(true);
        console.log('[Dashboard] WebSocket connected');
    };

    ws.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data);
            handleWebSocketMessage(msg);
        } catch (e) {
            console.error('[Dashboard] Failed to parse message:', e);
        }
    };

    ws.onclose = () => {
        updateConnectionStatus(false);
        console.log('[Dashboard] WebSocket disconnected, reconnecting...');
        setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (err) => {
        console.error('[Dashboard] WebSocket error:', err);
    };
}

function handleWebSocketMessage(msg) {
    switch (msg.type) {
        case 'system_update':
            updateSystemDisplay(msg.data, msg.history);
            break;
        case 'whisper_status':
            updateWhisperStatus(msg.data);
            break;
        case 'converting':
            updateConverting(msg.state);
            handleConvertingTiming(msg);
            break;
        case 'progress':
            if (msg.percent !== null && msg.percent !== undefined) {
                setProgress(msg.percent);
            }
            handleProgressTiming(msg);
            break;
        case 'log_line':
            appendLogLine(msg.source, msg.line);
            break;
        case 'new_record':
            handleNewRecord(msg.data);
            break;
        case 'record_deleted':
        case 'records_cleared':
        case 'record_updated':
            loadRecords($('#records-search').value);
            loadStats();
            break;
        case 'pong':
            break;
    }
}

function setProgress(pct) {
    const fill = $('#progress-bar-fill');
    const text = $('#progress-percent');
    if (!fill || !text) return;
    if (pct < 0) {  // -1 哨兵值 = AI 校正开始：第一段 100%，第二段进入不确定动画
        fill.style.width = '100%';
        text.textContent = '100%';
        const stage2 = $('#correct-stage');
        const cfill = $('#correct-bar-fill');
        const ctext = $('#correct-percent');
        const cmodel = $('#correct-stage-model');
        if (stage2) stage2.classList.remove('hidden');
        if (cfill) {
            cfill.classList.add('correct-indeterminate');
            cfill.style.width = '100%';
        }
        if (ctext) ctext.textContent = t('progress.correcting');
        // 使用中の LLM モデル名を表示（active profile の model、なければ config.deepseek_model）
        if (cmodel) {
            const model = (typeof activeLlmModel === 'string' && activeLlmModel)
                || config.deepseek_model || '';
            cmodel.textContent = model ? `(${model})` : '';
        }
        return;
    }
    pct = Math.max(0, Math.min(100, pct));
    fill.style.width = pct + '%';
    text.textContent = Math.round(pct) + '%';
}

let correctStageTimer = null;  // 校正段补足 100% 后延迟隐藏用

function updateConverting(state) {
    // 转换中：CPU / GPU 卡片显示心跳动画（Whisper 制御カードはアニメなし）
    const active = state === 'converting';
    currentConverting = active;
    ['#cpu-card', '#gpu-card'].forEach(sel => {
        const el = $(sel);
        if (!el) return;
        el.classList.toggle('converting-active', active);
    });
    // 实时监控：変換開始時に表示。終了後も前回の変換結果をそのまま残す（初期状態のみ非表示）
    const live = $('#live-monitor');
    if (live && active) live.classList.remove('hidden');
    // タイミング状態：WebSocket 再接続など converting イベント欠落時でも監視を初期化/確定する
    if (active && !conversionTiming.active) {
        conversionTiming.active = true;
        conversionTiming.startTs = Date.now();
        conversionTiming.correctStartTs = null;
        conversionTiming.correctEndTs = null;
        conversionTiming.endTs = null;
        conversionTiming.duration = 0;
        conversionTiming.durationKnown = false;
        conversionTiming.phase = 'transcribe';
    } else if (!active && conversionTiming.active) {
        finalizeConversionTiming();
    }
    // 进度条：转换中显示两段并归零，结束隐藏
    const wrap = $('#progress-bar-wrap');
    if (!wrap) return;
    if (active) {
        if (correctStageTimer) { clearTimeout(correctStageTimer); correctStageTimer = null; }
        wrap.classList.remove('hidden');
        setProgress(0);
        const stage2 = $('#correct-stage');
        if (stage2) stage2.classList.add('hidden');
    } else {
        // 若第二段（AI 校正）正在显示，先补足 100% 再延迟隐藏
        const stage2 = $('#correct-stage');
        if (stage2 && !stage2.classList.contains('hidden')) {
            const cfill = $('#correct-bar-fill');
            const ctext = $('#correct-percent');
            if (cfill) {
                cfill.classList.remove('correct-indeterminate');
                cfill.style.width = '100%';
            }
            if (ctext) ctext.textContent = '100%';
            if (correctStageTimer) clearTimeout(correctStageTimer);
            correctStageTimer = setTimeout(() => {
                wrap.classList.add('hidden');
                const s2 = $('#correct-stage');
                if (s2) s2.classList.add('hidden');
            }, 1200);
        } else {
            wrap.classList.add('hidden');
        }
    }
}

// ---------------------------------------------------------------------------
// 変換リアルタイム監視（音声時間 / 変換時間 / AI校正時間 / 処理時間）
// ---------------------------------------------------------------------------
function handleConvertingTiming(msg) {
    if (msg.state === 'converting') {
        // 変換開始：タイミングをリセット
        conversionTiming.active = true;
        conversionTiming.startTs = msg.start_ts ? msg.start_ts * 1000 : Date.now();
        conversionTiming.correctStartTs = null;
        conversionTiming.correctEndTs = null;
        conversionTiming.endTs = null;
        conversionTiming.duration = 0;
        conversionTiming.durationKnown = false;
        conversionTiming.phase = 'transcribe';
        if (msg.filename) conversionTiming.filename = msg.filename;
        updateConversionMonitor();
    } else {
        // 変換終了：最終値を固定して前回結果を保持
        finalizeConversionTiming();
    }
}

// 変換終了時の最終値を確定する。endTs を記録し、live-monitor に固定値を表示したままにする
function finalizeConversionTiming() {
    conversionTiming.active = false;
    conversionTiming.endTs = Date.now();
    if (conversionTiming.correctStartTs && !conversionTiming.correctEndTs) {
        conversionTiming.correctEndTs = conversionTiming.endTs;
    }
    updateConversionMonitor();
}

function handleProgressTiming(msg) {
    // AI 校正フェーズ開始（percent=-1 が"校正中"シグナル）
    if (msg.phase === 'correct' || msg.percent === -1) {
        if (conversionTiming.active && !conversionTiming.correctStartTs) {
            conversionTiming.correctStartTs = Date.now();
        }
        conversionTiming.phase = 'correct';
    }
    // 音声時間が確定したら記録（変換フェーズ完了時点）
    if (msg.duration !== undefined && msg.duration !== null && msg.duration > 0) {
        conversionTiming.duration = msg.duration;
        conversionTiming.durationKnown = true;
    }
}

function updateConversionMonitor() {
    const tm = conversionTiming;
    const live = $('#live-monitor');
    if (!live) return;
    // 一度も変換していない初期状態のみ非表示。変換終了後は前回の結果をそのまま残す
    if (!tm.active && !tm.endTs && !tm.startTs) {
        live.classList.add('hidden');
        return;
    }
    live.classList.remove('hidden');
    // 変換中は現在時刻、変換終了後は endTs で固定して最終値を表示
    const now = tm.active ? Date.now() : tm.endTs || Date.now();
    if (!tm.startTs) return;
    let convertMs, correctMs;
    if (tm.phase === 'correct' && tm.correctStartTs) {
        // AI 校正中／校正完了：変換時間は変換フェーズ分で固定、AI校正時間が増加（終了後は確定値）
        convertMs = tm.correctStartTs - tm.startTs;
        correctMs = (tm.correctEndTs || now) - tm.correctStartTs;
    } else {
        // 変換中：変換時間が増加、AI校正時間は 0
        convertMs = now - tm.startTs;
        correctMs = 0;
    }
    const elapsedMs = now - tm.startTs; // 処理時間（変換中は増加、終了後は確定値）
    const fmt = (s) => formatTime(Math.max(0, s), 'sec');

    $('#live-duration').textContent = tm.durationKnown ? fmt(tm.duration) : '--s';
    $('#live-convert').textContent = fmt(convertMs / 1000);
    $('#live-correct').textContent = fmt(correctMs / 1000);
    $('#live-elapsed').textContent = fmt(elapsedMs / 1000);
    $('#live-phase').textContent = t(tm.phase === 'correct' ? 'live.phase.correct' : 'live.phase.transcribe');
    if (tm.filename) $('#live-file').textContent = tm.filename;
    if (!currentModel && config.whisper_model) currentModel = config.whisper_model;
    $('#live-model').textContent = currentModel || '--';
    // 実時倍速 = 音声時間 / 処理時間
    const spd = tm.durationKnown && elapsedMs > 0 ? tm.duration / (elapsedMs / 1000) : 0;
    $('#live-speed').textContent = spd > 0 ? spd.toFixed(2) + '×' : '--';
}

function updateConnectionStatus(connected) {
    const status = $('#connection-status');
    if (connected) {
        status.textContent = t('connection.connected');
        status.className = 'text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    } else {
        status.textContent = t('connection.disconnected');
        status.className = 'text-xs px-2 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20';
    }
}

// ---------------------------------------------------------------------------
// 系统监控显示
// ---------------------------------------------------------------------------
function updateSystemDisplay(data, history) {
    // 转换状态（从 system_update 同步，避免 WebSocket 重连后丢失动画状态）
    if (data && typeof data.converting !== 'undefined') {
        updateConverting(data.converting ? 'converting' : 'idle');
    }
    // 转换进度（从 system_update 同步，避免 WebSocket 重连后丢失）
    if (data && typeof data.progress !== 'undefined' && data.progress !== null) {
        setProgress(data.progress);
    }

    // CPU
    $('#cpu-value').textContent = Math.round(data.cpu_percent || 0) + '%';
    setRingProgress('#cpu-ring', data.cpu_percent || 0);
    $('#cpu-freq').textContent = Math.round(data.cpu_freq_mhz || 0) + ' MHz';
    if (data.cpu_name) {
        $('#cpu-name').textContent = data.cpu_name;
    }

    // Memory
    $('#mem-value').textContent = Math.round(data.memory_percent || 0) + '%';
    setRingProgress('#mem-ring', data.memory_percent || 0);
    $('#mem-used').textContent = `${data.memory_used_gb || 0} / ${data.memory_total_gb || 0} GB`;

    // Storage（ストレージ）
    if ($('#disk-percent')) {
        // 3 ボックス行のストレージボックス：使用 / 全容量（GB）表示
        $('#disk-percent').textContent = `${data.disk_used_gb || 0} / ${data.disk_total_gb || 0} GB`;
    }
    // ストレージリング（CPU & メモリカード内）：リング内は使用率%
    if ($('#disk-ring')) {
        setRingProgress('#disk-ring', data.disk_percent || 0);
    }
    if ($('#disk-ring-value')) {
        $('#disk-ring-value').textContent = Math.round(data.disk_percent || 0) + '%';
    }

    // GPU
    const gpu = data.gpu;
    if (gpu && !gpu.error) {
        $('#gpu-name').textContent = gpu.name || 'NVIDIA GPU';
        const util = gpu.utilization || 0;
        const memPercent = Math.round((gpu.memory_used_mb / Math.max(gpu.memory_total_mb, 1)) * 100);

        // 表盘
        $('#gpu-util-value').textContent = util + '%';
        setRingProgress('#gpu-util-ring', util);
        $('#gpu-mem-value').textContent = memPercent + '%';
        setRingProgress('#gpu-mem-ring', memPercent);

        // 温度リング（100% = 100°C）
        const temp = gpu.temperature || 0;
        $('#gpu-temp-ring-value').textContent = temp + '°C';
        setRingProgress('#gpu-temp-ring', temp);

        // 文本卡片（リングとは重複しない補足情報：クロック / VRAM 容量 / 消費電力）
        $('#gpu-util-text').textContent = (gpu.clock_mhz || 0) + ' MHz';
        $('#gpu-mem-text').textContent = `${gpu.memory_used_mb} / ${gpu.memory_total_mb} MB`;
        $('#gpu-temp').textContent = (gpu.power_w || 0) + ' W';

        // オーバーヒート表示：温度リングを赤点滅（ボックスは消費電力表示のため対象外）
        const tempRingWrap = $('#gpu-temp-ring-wrap');
        const gpuCard = $('#gpu-card');
        if (gpu.temperature >= config.gpu_temp_threshold) {
            if (tempRingWrap) tempRingWrap.classList.add('gpu-overheat');
            gpuCard.classList.add('gpu-overheat');
        } else {
            if (tempRingWrap) tempRingWrap.classList.remove('gpu-overheat');
            gpuCard.classList.remove('gpu-overheat');
        }
    } else {
        $('#gpu-name').textContent = gpu && gpu.error ? t('gpu.not_available') : t('gpu.not_detected');
        $('#gpu-util-value').textContent = '0%';
        $('#gpu-mem-value').textContent = '0%';
        setRingProgress('#gpu-util-ring', 0);
        setRingProgress('#gpu-mem-ring', 0);
        $('#gpu-temp-ring-value').textContent = '0°C';
        setRingProgress('#gpu-temp-ring', 0);
        $('#gpu-util-text').textContent = '-- MHz';
        $('#gpu-mem-text').textContent = '-- / -- MB';
        $('#gpu-temp').textContent = '-- W';
    }

    // 图表
    if (history && mainChart) {
        updateChart(history);
    }
}

// ---------------------------------------------------------------------------
// Whisper 状态
// ---------------------------------------------------------------------------
function updateWhisperStatus(data) {
    lastWhisperStatus = data;
    const running = data.running;
    // 状态优先级：转换中 > 运行中 > 启动中（进程存在但健康检查未通过） > 已停止
    const converting = currentConverting;
    const starting = !running && !!data.process;

    const dot = $('#sidebar-status-dot');
    const text = $('#sidebar-status-text');
    const status = $('#whisper-status');
    const pid = $('#whisper-pid');
    const uptime = $('#whisper-uptime');
    const managed = $('#whisper-managed');

    if (converting) {
        dot.className = 'w-2 h-2 rounded-full bg-amber-500 status-pulse';
        text.textContent = t('status.converting');
        text.className = 'text-sm font-medium text-amber-400';
        status.textContent = t('status.converting');
        status.className = 'font-medium text-amber-400';
    } else if (running) {
        dot.className = 'w-2 h-2 rounded-full bg-emerald-500 status-pulse';
        text.textContent = t('status.running');
        text.className = 'text-sm font-medium text-emerald-400';
        status.textContent = t('status.running');
        status.className = 'font-medium text-emerald-400';
    } else if (starting) {
        dot.className = 'w-2 h-2 rounded-full bg-amber-400 status-pulse';
        text.textContent = t('status.starting');
        text.className = 'text-sm font-medium text-amber-400';
        status.textContent = t('status.starting');
        status.className = 'font-medium text-amber-400';
    } else {
        dot.className = 'w-2 h-2 rounded-full bg-rose-500';
        text.textContent = t('status.stopped');
        text.className = 'text-sm font-medium text-rose-400';
        status.textContent = t('status.stopped');
        status.className = 'font-medium text-rose-400';
    }

    const proc = data.process;
    if (data.health && data.health.model) {
        currentModel = data.health.model;
        $('#stat-model').textContent = data.health.model;
        const sel = $('#select-model');
        if (sel && sel.value !== data.health.model) {
            sel.value = data.health.model;
        }
    }
    if (proc) {
        pid.textContent = proc.pid;
        uptime.textContent = formatDateTime(proc.start_time);
        managed.textContent = t('whisper.managed');
        managed.className = 'text-xs mt-1 block text-emerald-400';
    } else {
        pid.textContent = '--';
        uptime.textContent = '--';
        if (running) {
            managed.textContent = t('whisper.external');
            managed.className = 'text-xs mt-1 block text-amber-400';
        } else {
            managed.textContent = '';
            managed.className = 'text-xs mt-1 block';
        }
    }
}

async function controlWhisper(action) {
    try {
        const resp = await apiFetch(`${API_BASE}/whisper/${action}`, { method: 'POST' });
        const data = await resp.json();
        if (data.success) {
            const key = action === 'start' ? 'toast.starting' : action === 'stop' ? 'toast.stopping' : 'toast.restarting';
            showToast(t(key), 'success');
        } else {
            showToast(data.message || t('toast.action_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
}

async function switchModel() {
    const model = $('#select-model').value;
    if (!model) return;
    try {
        showToast(t('whisper.switching'), 'info');
        const resp = await apiFetch(`${API_BASE}/whisper/model`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model })
        });
        const data = await resp.json();
        if (data.success) {
            $('#stat-model').textContent = model;
            showToast(t('whisper.switch_done') + ': ' + model, 'success');
        } else {
            showToast(data.message || t('toast.action_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
}

// ---------------------------------------------------------------------------
// 图表
// ---------------------------------------------------------------------------
function initChart() {
    const ctx = $('#main-chart');
    if (!ctx) return;

    Chart.defaults.color = '#a8a29e';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.1)';

    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(60).fill(''),
            datasets: [
                {
                    label: 'CPU %',
                    data: Array(60).fill(0),
                    borderColor: '#ffb020',
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, 'rgba(255, 176, 32, 0.3)');
                        gradient.addColorStop(1, 'rgba(255, 176, 32, 0)');
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 2,
                },
                {
                    label: 'Memory %',
                    data: Array(60).fill(0),
                    borderColor: '#ff3d81',
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, 'rgba(255, 61, 129, 0.3)');
                        gradient.addColorStop(1, 'rgba(255, 61, 129, 0)');
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 2,
                },
                {
                    label: 'GPU Util %',
                    data: Array(60).fill(0),
                    borderColor: '#22d3ee',
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, 'rgba(34, 211, 238, 0.3)');
                        gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 2,
                },
                {
                    label: 'GPU VRAM %',
                    data: Array(60).fill(0),
                    borderColor: '#c084fc',
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, 'rgba(192, 132, 252, 0.3)');
                        gradient.addColorStop(1, 'rgba(192, 132, 252, 0)');
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 2,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, boxWidth: 8 }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function updateChart(history) {
    if (!mainChart || !history) return;

    // 只显示最近 trendWindow 个数据点（放大→更少点，波形更宽；缩小→更多点）
    const timestamps = history.timestamps || [];
    const n = Math.min(timestamps.length, trendWindow);
    const start = timestamps.length - n;
    mainChart.data.labels = timestamps.slice(start);
    mainChart.data.datasets[0].data = (history.cpu || []).slice(start);
    mainChart.data.datasets[1].data = (history.memory || []).slice(start);
    mainChart.data.datasets[2].data = (history.gpu_util || []).slice(start);
    mainChart.data.datasets[3].data = (history.gpu_mem || []).slice(start);
    mainChart.update('none');
}

// ---------------------------------------------------------------------------
// 导航
// ---------------------------------------------------------------------------
function initNavigation() {
    $all('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            showSection(section);

            $all('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function showSection(name) {
    $all('.section').forEach(s => s.classList.add('hidden'));
    $(`#${name}`).classList.remove('hidden');

    $('#page-title').textContent = t(`nav.${name}`);

    if (name === 'records') {
        loadRecords();
    } else if (name === 'logs') {
        loadLogs();
    } else if (name === 'settings') {
        loadSettings();
        loadAutostartStatus();
    }
}

// ---------------------------------------------------------------------------
// 履历
// ---------------------------------------------------------------------------
async function loadRecords(search = '') {
    try {
        const url = `${API_BASE}/records?limit=50&search=${encodeURIComponent(search)}`;
        const resp = await apiFetch(url);
        const data = await resp.json();
        renderRecords(data.records || []);
    } catch (e) {
        console.error('Failed to load records:', e);
    }
}

function renderRecords(records) {
    lastRecords = records;
    const tbody = $('#records-table-body');
    if (!records || records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" class="py-8 text-center text-slate-500">${t('records.empty')}</td></tr>`;
        return;
    }

    tbody.innerHTML = records.map(r => {
        // 时间分量：処理時間 = elapsed（総合）、変換時間 = elapsed - AI校正（Whisper のみ）
        const total = (r.elapsed_seconds || 0);
        const correct = r.correct_elapsed || 0;
        const convert = Math.max(0, total - correct);
        // 转换速度 = 转换耗时 / 音频长度（越小越快），用"多少分之一"表示（少数点1桁）
        const speed = (r.duration > 0) ? (total / r.duration) : null;
        const speedText = speed !== null && speed > 0 ? `1/${(1 / speed).toFixed(1)}` : '--';
        const speedClass = speed !== null && speed <= 0.5 ? 'text-emerald-400' : speed !== null && speed <= 1 ? 'text-amber-400' : 'text-rose-400';
        const modelTag = r.model ? `<span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs">${escapeHtml(r.model)}</span>` : '--';
        // LLM 校正模型（存在则显示）
        const llmTag = r.llm_model
            ? `<span class="ml-1 px-2 py-0.5 rounded-md bg-fuchsia-500/20 text-fuchsia-300 text-xs" title="${t('records.llm_corrected')}">AI: ${escapeHtml(r.llm_model)}</span>`
            : '';
        // 校正按钮（SRT 含时间轴，不做 AI 校正）
        const correctBtn = r.output_format !== 'srt'
            ? `<button class="text-fuchsia-400 hover:text-fuchsia-300 text-sm ml-2" title="${t('records.correct')}" onclick="correctRecord(${r.id})">${t('records.correct')}</button>`
            : '';
        return `
        <tr>
            <td class="py-3 text-slate-400 font-mono text-xs">${formatDateTime(r.timestamp)}</td>
            <td class="py-3">${escapeHtml(r.filename || '--')}</td>
            <td class="py-3"><span class="px-2 py-0.5 rounded-md bg-slate-800 text-xs">${escapeHtml(r.language || 'auto')}</span></td>
            <td class="py-3">${modelTag}${llmTag}</td>
            <td class="py-3 text-slate-400">${formatTime(r.duration)}</td>
            <td class="py-3 text-slate-400">${formatTime(convert)}</td>
            <td class="py-3 text-fuchsia-400">${r.correct_elapsed ? formatTime(correct) : '--'}</td>
            <td class="py-3 text-amber-300">${formatTime(total)}</td>
            <td class="py-3 font-mono ${speedClass}">${speedText}</td>
            <td class="py-3 text-slate-300">${escapeHtml(truncate(r.summary, 40))}</td>
            <td class="py-3">
                <button class="text-amber-400 hover:text-amber-300 text-sm" onclick="showRecordContent(${r.id}, '${encodeURIComponent(r.result || '')}')">${t('records.view')}</button>
                <button class="text-cyan-400 hover:text-cyan-300 text-sm ml-2" onclick="copyRecordText(${r.id}, '${encodeURIComponent(r.result || '')}')">${t('records.copy')}</button>
                ${correctBtn}
                <button class="text-rose-400 hover:text-rose-300 ml-2 align-middle" title="${t('records.delete')}" onclick="deleteRecord(${r.id})">
                    <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </td>
        </tr>`;
    }).join('');

    $('#records-badge').textContent = records.length;
    $('#records-badge').classList.remove('hidden');
}

// 時間単位切替：'sec'（秒表示） ⇔ 'minsec'（分秒表示）
function setTimeUnit(unit) {
    timeUnit = unit === 'minsec' ? 'minsec' : 'sec';
    localStorage.setItem('records_time_unit', timeUnit);
    const toggle = $('#toggle-time-unit');
    if (toggle) toggle.checked = timeUnit === 'minsec';
    renderRecords(lastRecords || []);
}

function handleNewRecord(record) {
    if (!$('#records').classList.contains('hidden')) {
        loadRecords($('#records-search').value);
    }
    loadStats();
    // 底部履历栏也刷新
    loadRecords($('#records-search').value);
}

// 对已保存的转换结果重新进行 AI 校正并覆盖保存
window.correctRecord = async function(id) {
    showToast(t('records.correcting'), 'info');
    try {
        const resp = await apiFetch(`${API_BASE}/records/${id}/correct`, { method: 'POST' });
        const data = await resp.json();
        if (data.success) {
            showToast(t('records.corrected') + (data.llm_model ? ` (AI: ${data.llm_model})` : ''), 'success');
            loadRecords($('#records-search').value);
        } else {
            showToast(data.error || t('toast.action_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
};

// 删除单条记录
window.deleteRecord = async function(id) {
    if (!confirm(t('records.delete_confirm'))) return;
    try {
        const resp = await apiFetch(`${API_BASE}/records/${id}`, { method: 'DELETE' });
        const data = await resp.json();
        if (data.success) {
            showToast(t('records.deleted'), 'success');
            loadRecords($('#records-search').value);
            loadStats();
        } else {
            showToast(t('toast.action_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
};

// 清空全部记录
window.clearRecords = async function() {
    if (!confirm(t('records.clear_confirm'))) return;
    try {
        const resp = await apiFetch(`${API_BASE}/records`, { method: 'DELETE' });
        const data = await resp.json();
        if (data.success) {
            showToast(t('records.cleared'), 'success');
            loadRecords('');
            loadStats();
        } else {
            showToast(t('toast.action_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
};

window.showRecordDetail = function(id, encodedResult) {
    const result = decodeURIComponent(encodedResult);
    $('#record-detail-content').textContent = result;
    $('#record-detail-modal').classList.remove('hidden');
};

// 履历页面：在列表下方显示转换内容（上下布局）
window.showRecordContent = function(id, encodedResult) {
    const result = decodeURIComponent(encodedResult);
    $('#record-content').textContent = result;
    $('#record-content-meta').textContent = `${t('records.detail')} #${id}`;
    const panel = $('#record-content-panel');
    panel.classList.remove('hidden');
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

// ---------------------------------------------------------------------------
// 实时趋势图：卡片宽度始终跟随屏幕，缩放按钮 → 波形横向时间刻度（显示点数）
// ---------------------------------------------------------------------------
function initTrendResize() {
    // 清除旧的卡宽记忆，卡片始终占满屏幕宽度
    localStorage.removeItem('trend_width');

    // 缩小 / 放大按钮：控制波形横向时间刻度（显示点数）
    // 放大 → 点数更少，波形横向拉伸看得更细；缩小 → 点数更多，显示更长时间段
    const WINDOW_LEVELS = [30, 60, 120, 240, 480];
    function stepWindow(delta) {
        let idx = WINDOW_LEVELS.indexOf(trendWindow);
        if (idx === -1) {
            idx = trendWindow <= WINDOW_LEVELS[0] ? 0 : WINDOW_LEVELS.length - 1;
        }
        idx = Math.max(0, Math.min(WINDOW_LEVELS.length - 1, idx + delta));
        trendWindow = WINDOW_LEVELS[idx];
        localStorage.setItem('trend_window', String(trendWindow));
        if (mainChart) mainChart.update('none');
    }
    $('#btn-trend-shrink').addEventListener('click', () => stepWindow(1));    // 缩小 → 显示更长时间
    $('#btn-trend-expand').addEventListener('click', () => stepWindow(-1));  // 放大 → 放大波形
}

window.copyRecordText = function(id, encodedResult) {
    const result = decodeURIComponent(encodedResult);
    navigator.clipboard.writeText(result).then(() => {
        showToast(t('records.copied'), 'success');
    }).catch(() => {
        // 旧浏览器降级：用临时 textarea
        const ta = document.createElement('textarea');
        ta.value = result;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showToast(t('records.copied'), 'success'); } catch (e) {}
        document.body.removeChild(ta);
    });
};

// ---------------------------------------------------------------------------
// 日志
// ---------------------------------------------------------------------------
function appendLogLine(source, line) {
    const terminal = $('#log-terminal');
    const logSource = $('#log-source').value;

    if (logSource !== 'all' && logSource !== source) return;

    const div = document.createElement('div');
    div.className = 'log-line log-' + source;

    let levelClass = '';
    if (line.includes('ERROR') || line.includes('Error') || line.includes('error')) {
        levelClass = 'log-error';
    } else if (line.includes('WARN') || line.includes('Warning')) {
        levelClass = 'log-warning';
    } else if (line.includes('INFO')) {
        levelClass = 'log-info';
    }

    const locale = uiLanguage === 'zh' ? 'zh-CN' : uiLanguage === 'ja' ? 'ja-JP' : 'en-US';
    const time = new Date().toLocaleTimeString(locale, { hour12: false });
    div.innerHTML = `<span class="text-slate-600">[${time}]</span> <span class="text-cyan-500">[${source}]</span> <span class="${levelClass}">${escapeHtml(line)}</span>`;
    terminal.appendChild(div);

    while (terminal.children.length > 500) {
        terminal.removeChild(terminal.firstChild);
    }

    terminal.scrollTop = terminal.scrollHeight;
}

async function loadLogs() {
    try {
        const resp = await apiFetch(`${API_BASE}/logs?lines=200`);
        const data = await resp.json();
        const terminal = $('#log-terminal');
        terminal.innerHTML = '';
        (data.logs || []).forEach(log => appendLogLine(log.source, log.line));
    } catch (e) {
        console.error('Failed to load logs:', e);
    }
}

// ---------------------------------------------------------------------------
// 统计
// ---------------------------------------------------------------------------
async function loadStats() {
    try {
        const resp = await apiFetch(`${API_BASE}/stats`);
        const data = await resp.json();
        $('#stat-today').textContent = data.today || 0;
        $('#stat-total').textContent = data.total || 0;
        $('#stat-avg').textContent = (data.avg_elapsed_seconds || 0).toFixed(1);
        // 速度用"多少分之一"显示：1/2.1 表示处理 2.1 倍时长花费 1 倍时间
        const avgSpeed = data.avg_speed || 0;
        $('#stat-speed').textContent = avgSpeed > 0 ? `1/${(1 / avgSpeed).toFixed(1)}` : '--';
        const lastSpeed = data.last_speed || 0;
        $('#stat-last-speed').textContent = lastSpeed > 0 ? `1/${(1 / lastSpeed).toFixed(1)}` : '--';
    } catch (e) {
        console.error('Failed to load stats:', e);
    }
}

// ---------------------------------------------------------------------------
// 设置
// ---------------------------------------------------------------------------
async function loadSettings() {
    try {
        const resp = await apiFetch(`${API_BASE}/config`);
        const data = await resp.json();
        config = { ...config, ...data };

        $('#setting-language').value = config.default_language || 'zh';
        $('#setting-output').value = config.default_output || 'txt';
        $('#setting-refresh').value = parseInt(config.refresh_interval) || 1000;
        $('#setting-temp').value = parseInt(config.gpu_temp_threshold) || 80;
        $('#setting-ui-language').value = uiLanguage;
        if (config.whisper_model && $('#select-model')) {
            $('#select-model').value = config.whisper_model;
        }
        // Whisper 高速化设置（設定画面の速度モードとダッシュボードのモード選択を双方向同期）
        const mode = WHISPER_MODES[config.whisper_mode] ? config.whisper_mode : 'custom';
        if ($('#setting-speed-mode')) $('#setting-speed-mode').value = mode;
        if ($('#select-speed-mode')) $('#select-speed-mode').value = mode;
        if ($('#setting-compute-type')) {
            $('#setting-compute-type').value = config.whisper_compute_type || 'int8_float16';
        }
        if ($('#setting-beam-size')) {
            $('#setting-beam-size').value = config.whisper_beam_size || 3;
        }
        if ($('#setting-temperature')) {
            $('#setting-temperature').value = (config.whisper_temperature !== undefined && config.whisper_temperature !== '') ? config.whisper_temperature : 0;
        }
        if ($('#setting-vad-ms')) {
            $('#setting-vad-ms').value = config.whisper_vad_min_silence_ms || 500;
        }
        // AI 校正设置（アクティブプロファイルのスナップショットを表示）
        if ($('#toggle-ai-correct')) {
            $('#toggle-ai-correct').checked = String(config.ai_correct_enabled).toLowerCase() === 'true';
        }
        if ($('#setting-deepseek-base-url')) {
            $('#setting-deepseek-base-url').value = config.deepseek_base_url || '';
        }
        // #5: API キーは平文で返されない。保存済みならプレースホルダーで維持を促す
        if ($('#setting-deepseek-key')) {
            $('#setting-deepseek-key').value = '';
            $('#setting-deepseek-key').placeholder = config.deepseek_has_key
                ? `保存済み ${config.deepseek_key_masked || ''}（未入力なら維持）`
                : '';
        }
        if ($('#setting-deepseek-model')) {
            $('#setting-deepseek-model').value = config.deepseek_model || 'deepseek-chat';
        }
        updateActiveProfileLabel();
        await loadLLMProfiles();
        await loadAuthTokenDisplay();
    } catch (e) {
        console.error('Failed to load settings:', e);
    }
}

// アクティブプロファイル名を AI カード上部に表示
function updateActiveProfileLabel() {
    const el = $('#ai-active-profile');
    if (!el) return;
    const active = llmProfiles.find(p => p.active);
    if (active) {
        el.textContent = `${t('ai.active_profile')}: ${active.name} (${active.model})`;
        el.className = 'text-sm text-amber-300 mb-3';
    } else {
        el.textContent = `${t('ai.active_profile')}: ${t('llm.empty')}`;
        el.className = 'text-sm text-stone-400 mb-3';
    }
}

async function saveSettings() {
    const newUiLanguage = $('#setting-ui-language').value;
    const data = {
        default_language: $('#setting-language').value,
        default_output: $('#setting-output').value,
        refresh_interval: $('#setting-refresh').value,
        gpu_temp_threshold: $('#setting-temp').value,
        ui_language: newUiLanguage,
        ai_correct_enabled: $('#toggle-ai-correct').checked,
        deepseek_model: $('#setting-deepseek-model').value,
        deepseek_base_url: $('#setting-deepseek-base-url').value,
        whisper_mode: $('#setting-speed-mode').value,
        whisper_compute_type: $('#setting-compute-type').value,
        whisper_beam_size: $('#setting-beam-size').value,
        whisper_temperature: $('#setting-temperature').value,
        whisper_vad_min_silence_ms: $('#setting-vad-ms').value,
    };
    // #5: キー欄が空なら送信しない（既存キーを維持）
    const newKey = $('#setting-deepseek-key').value.trim();
    if (newKey) data.deepseek_api_key = newKey;

    try {
        const resp = await apiFetch(`${API_BASE}/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await resp.json();
        if (result.success) {
            const speedChanged =
                String(data.whisper_compute_type) !== String(config.whisper_compute_type) ||
                String(data.whisper_beam_size) !== String(config.whisper_beam_size) ||
                String(data.whisper_temperature) !== String(config.whisper_temperature) ||
                String(data.whisper_vad_min_silence_ms) !== String(config.whisper_vad_min_silence_ms);
            config = { ...config, ...data };
            setUiLanguage(newUiLanguage);
            // アクティブプロファイルが居れば、AI カードで編集したスナップショットを
            // プロファイル行にも同期して不整合を防ぐ
            await syncActiveProfileFromFields();
            if (speedChanged) {
                showToast(t('speed.need_restart'), 'info');
            } else {
                showToast(t('settings.saved'), 'success');
            }
        } else {
            showToast(t('settings.save_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
}

// ---------------------------------------------------------------------------
// AI 校正：LLM 连接测试
// ---------------------------------------------------------------------------
async function testAIConnection() {
    const btn = $('#btn-ai-test');
    const result = $('#ai-test-result');
    if (!btn || !result) return;
    const apiKey = ($('#setting-deepseek-key').value || '').trim();
    const model = $('#setting-deepseek-model').value || 'deepseek-chat';
    const baseUrl = ($('#setting-deepseek-base-url').value || '').trim();
    if (!baseUrl) {
        result.classList.remove('hidden');
        result.className = 'mt-2 text-sm text-amber-400';
        result.textContent = t('ai.test_no_base_url');
        return;
    }
    btn.disabled = true;
    const origHtml = btn.innerHTML;
    btn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg><span>${t('ai.testing')}</span>`;
    result.classList.remove('hidden');
    result.className = 'mt-2 text-sm text-slate-400';
    result.textContent = t('ai.testing');
    try {
        const resp = await apiFetch(`${API_BASE}/ai/test`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_key: apiKey, model: model, base_url: baseUrl })
        });
        const data = await resp.json();
        if (data.ok) {
            result.className = 'mt-2 text-sm text-emerald-400';
            result.textContent = t('ai.test_ok') + ' · ' + model;
            // 测试成功：启用 AI 校正（勾选 + 立即保存配置，无需再点保存）
            $('#toggle-ai-correct').checked = true;
            await saveAICorrectEnabled();
            showToast(t('ai.test_enabled'), 'success');
        } else {
            result.className = 'mt-2 text-sm text-rose-400';
            result.textContent = data.message || t('ai.test_fail');
        }
    } catch (e) {
        result.className = 'mt-2 text-sm text-rose-400';
        result.textContent = t('ai.test_fail') + ': ' + (e.message || '');
    } finally {
        btn.disabled = false;
        btn.innerHTML = origHtml;
    }
}

async function saveAICorrectEnabled() {
    const data = {
        ai_correct_enabled: $('#toggle-ai-correct').checked,
        deepseek_model: $('#setting-deepseek-model').value,
        deepseek_base_url: $('#setting-deepseek-base-url').value,
    };
    // #5: キー欄が空なら送信しない（既存キーを維持）
    const newKey = $('#setting-deepseek-key').value.trim();
    if (newKey) data.deepseek_api_key = newKey;
    try {
        await apiFetch(`${API_BASE}/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        config = { ...config, ...data };
    } catch (e) {
        console.error('Failed to save AI correct settings:', e);
    }
}

// ---------------------------------------------------------------------------
// LLM プロファイル管理
// ---------------------------------------------------------------------------
function renderLLMProfiles(profiles) {
    llmProfiles = profiles || [];
    // アクティブ profile のモデル名を記録（AI 校正プログレスバーで使用）
    const active = llmProfiles.find(p => p.active);
    activeLlmModel = active ? (active.model || '') : '';
    const box = $('#llm-profiles-list');
    if (!box) return;
    if (!llmProfiles.length) {
        box.innerHTML = `<div class="text-stone-500 text-sm py-2">${t('llm.empty')}</div>`;
        return;
    }
    box.innerHTML = llmProfiles.map(p => `
        <div class="flex items-center justify-between p-3 bg-stone-900/50 rounded-xl">
            <div class="min-w-0">
                <div class="font-medium text-sm flex items-center gap-2">
                    ${escapeHtml(p.name)}
                    ${p.active ? `<span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs">${t('llm.active')}</span>` : ''}
                </div>
                <div class="text-xs text-stone-400 truncate">${escapeHtml(p.base_url)} · ${escapeHtml(p.model)}</div>
            </div>
            <div class="flex gap-3 text-xs shrink-0">
                ${p.active ? '' : `<button class="text-amber-400 hover:text-amber-300" onclick="activateLLMProfile(${p.id})">${t('llm.activate')}</button>`}
                <button class="text-cyan-400 hover:text-cyan-300" onclick="editLLMProfile(${p.id})">${t('llm.edit')}</button>
                <button class="text-rose-400 hover:text-rose-300" onclick="deleteLLMProfile(${p.id})">${t('llm.delete')}</button>
            </div>
        </div>`).join('');
}

async function loadLLMProfiles() {
    try {
        const resp = await apiFetch(`${API_BASE}/llm/profiles`);
        const data = await resp.json();
        renderLLMProfiles(data.profiles || []);
        updateActiveProfileLabel();
    } catch (e) {
        console.error('Failed to load LLM profiles:', e);
    }
}

let editingProfileId = null; // null = 新規追加

function openProfileForm(profile) {
    editingProfileId = profile ? profile.id : null;
    $('#llm-f-name').value = profile ? (profile.name || '') : '';
    $('#llm-f-base').value = profile ? (profile.base_url || '') : '';
    // #5: キーは平文で返されない。保存済みならプレースホルダーで維持を促す
    $('#llm-f-key').value = '';
    $('#llm-f-key').placeholder = profile && profile.has_key
        ? `保存済み ${profile.key_masked || ''}（未入力なら維持）`
        : '';
    $('#llm-f-model').value = profile ? (profile.model || '') : '';
    $('#llm-profile-form').classList.remove('hidden');
    $('#llm-f-name').focus();
}

function closeProfileForm() {
    $('#llm-profile-form').classList.add('hidden');
    editingProfileId = null;
}

async function saveProfile() {
    const payload = {
        name: $('#llm-f-name').value.trim(),
        base_url: $('#llm-f-base').value.trim(),
        model: $('#llm-f-model').value.trim(),
    };
    // #5: キー欄が空なら送信しない（既存キーを維持）。空文字での明示クリアは不可
    const newKey = $('#llm-f-key').value.trim();
    if (newKey) payload.api_key = newKey;
    if (!payload.name || !payload.base_url) {
        showToast(t('llm.need_name_url'), 'error');
        return;
    }
    try {
        const url = editingProfileId ? `${API_BASE}/llm/profiles/${editingProfileId}` : `${API_BASE}/llm/profiles`;
        const method = editingProfileId ? 'PUT' : 'POST';
        const resp = await apiFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await resp.json();
        if (data.success) {
            closeProfileForm();
            showToast(t('llm.saved'), 'success');
            await loadLLMProfiles();
            await loadSettings(); // アクティブ編集時はスナップショットも更新
        } else {
            showToast(t('settings.save_failed') + (data.error ? ': ' + data.error : ''), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
}

async function syncActiveProfileFromFields() {
    const active = llmProfiles.find(p => p.active);
    if (!active) return;
    const payload = {
        name: active.name,
        base_url: $('#setting-deepseek-base-url').value.trim(),
        model: $('#setting-deepseek-model').value.trim(),
    };
    // #5: キー欄が空なら api_key を送信しない（既存キーを維持。空文字はバックエンドでキー削除扱いのため）
    const newKey = $('#setting-deepseek-key').value.trim();
    if (newKey) payload.api_key = newKey;
    if (!payload.base_url || !payload.model) return;
    try {
        await apiFetch(`${API_BASE}/llm/profiles/${active.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        await loadLLMProfiles();
    } catch (e) {
        console.error('Failed to sync active profile:', e);
    }
}

window.activateLLMProfile = async function (id) {
    try {
        const resp = await apiFetch(`${API_BASE}/llm/profiles/${id}/activate`, { method: 'POST' });
        const data = await resp.json();
        if (data.success) {
            showToast(t('llm.activate_success'), 'success');
            await loadLLMProfiles();
            await loadSettings();
        } else {
            showToast(t('toast.action_failed') + ': ' + (data.error || ''), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
};

window.editLLMProfile = function (id) {
    const profile = llmProfiles.find(p => p.id === id);
    if (profile) openProfileForm(profile);
};

window.deleteLLMProfile = async function (id) {
    if (!confirm(t('llm.delete_confirm'))) return;
    try {
        const resp = await apiFetch(`${API_BASE}/llm/profiles/${id}`, { method: 'DELETE' });
        const data = await resp.json();
        if (data.success) {
            showToast(t('llm.deleted'), 'success');
            await loadLLMProfiles();
            await loadSettings();
        } else {
            showToast(t('toast.action_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
};

// ---------------------------------------------------------------------------
// 开机自启
// ---------------------------------------------------------------------------
async function loadAutostartStatus() {
    try {
        const resp = await apiFetch(`${API_BASE}/autostart`);
        const data = await resp.json();
        $('#toggle-autostart').checked = data.enabled;
        $('#autostart-status').textContent = t(data.enabled ? 'autostart.status.enabled' : 'autostart.status.disabled');
        $('#autostart-status').className = `text-sm mb-4 ${data.enabled ? 'text-emerald-400' : 'text-slate-400'}`;
    } catch (e) {
        console.error('Failed to load autostart status:', e);
    }
}

async function toggleAutostart(enabled) {
    try {
        const resp = await apiFetch(`${API_BASE}/autostart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled })
        });
        const data = await resp.json();
        if (data.success) {
            showToast(enabled ? t('autostart.enabled') : t('autostart.disabled'), 'success');
            loadAutostartStatus();
        } else {
            showToast(t('toast.action_failed') + ': ' + (data.error || ''), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
}

// ---------------------------------------------------------------------------
// 时钟
// ---------------------------------------------------------------------------
function updateClock() {
    const now = new Date();
    const locale = uiLanguage === 'zh' ? 'zh-CN' : uiLanguage === 'ja' ? 'ja-JP' : 'en-US';
    $('#clock-time').textContent = now.toLocaleTimeString(locale, { hour12: false });
    $('#clock-date').textContent = now.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// ---------------------------------------------------------------------------
// Toast 提示
// ---------------------------------------------------------------------------
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
        success: 'bg-emerald-500',
        error: 'bg-rose-500',
        info: 'bg-amber-500'
    };
    toast.className = `fixed bottom-6 right-6 ${colors[type] || colors.info} text-white px-5 py-3 rounded-xl shadow-lg shadow-black/30 z-50 animate-bounce`;
    toast.style.animation = 'cardFadeIn 0.3s ease-out forwards, fadeOut 0.3s ease-out 2.7s forwards';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ---------------------------------------------------------------------------
// 事件绑定
// ---------------------------------------------------------------------------
function initEventListeners() {
    $('#btn-start-whisper').addEventListener('click', () => controlWhisper('start'));
    $('#btn-stop-whisper').addEventListener('click', () => controlWhisper('stop'));
    $('#btn-restart-whisper').addEventListener('click', () => controlWhisper('restart'));
    $('#btn-switch-model').addEventListener('click', switchModel);

    $('#records-search').addEventListener('input', (e) => {
        loadRecords(e.target.value);
    });

    $('#btn-refresh-records').addEventListener('click', () => {
        loadRecords($('#records-search').value);
    });
    $('#btn-clear-records').addEventListener('click', clearRecords);

    // 時間単位切替（秒 ⇔ 分秒）
    const timeToggle = $('#toggle-time-unit');
    if (timeToggle) {
        timeToggle.checked = timeUnit === 'minsec';
        timeToggle.addEventListener('change', (e) => {
            setTimeUnit(e.target.checked ? 'minsec' : 'sec');
        });
    }

    $('#btn-close-modal').addEventListener('click', () => {
        $('#record-detail-modal').classList.add('hidden');
    });

    $('#btn-copy-modal').addEventListener('click', () => {
        const content = $('#record-detail-content').textContent || '';
        navigator.clipboard.writeText(content).then(() => {
            showToast(t('records.copied'), 'success');
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = content;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); showToast(t('records.copied'), 'success'); } catch (e) {}
            document.body.removeChild(ta);
        });
    });

    // 履历页面内容区：关闭 / 复制
    $('#btn-close-content').addEventListener('click', () => {
        $('#record-content-panel').classList.add('hidden');
    });
    $('#btn-copy-content').addEventListener('click', () => {
        const content = $('#record-content').textContent || '';
        navigator.clipboard.writeText(content).then(() => {
            showToast(t('records.copied'), 'success');
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = content;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); showToast(t('records.copied'), 'success'); } catch (e) {}
            document.body.removeChild(ta);
        });
    });

    $('#record-detail-modal').addEventListener('click', (e) => {
        if (e.target === $('#record-detail-modal')) {
            $('#record-detail-modal').classList.add('hidden');
        }
    });

    $('#btn-clear-logs').addEventListener('click', () => {
        $('#log-terminal').innerHTML = '';
    });

    $('#log-source').addEventListener('change', () => {
        loadLogs();
    });

    $('#btn-save-settings').addEventListener('click', saveSettings);
    $('#btn-ai-test').addEventListener('click', testAIConnection);

    // LLM プロファイル管理
    $('#btn-llm-add').addEventListener('click', () => openProfileForm());
    $('#btn-llm-save').addEventListener('click', saveProfile);
    $('#btn-llm-cancel').addEventListener('click', closeProfileForm);

    // Whisper 高速化：切换模式时自动填充预设 / 修改详细参数时切回「自定义」
    const speedModeSelect = $('#setting-speed-mode');
    if (speedModeSelect) {
        speedModeSelect.addEventListener('change', () => {
            if (WHISPER_MODES[speedModeSelect.value]) {
                applySpeedMode(speedModeSelect.value);
            }
            // ダッシュボード側のモード選択も同期
            const dashMode = $('#select-speed-mode');
            if (dashMode) dashMode.value = speedModeSelect.value;
        });
    }
    // ダッシュボード側モード選択：即時 config 保存＋設定画面と同期
    const dashSpeedMode = $('#select-speed-mode');
    if (dashSpeedMode) {
        dashSpeedMode.addEventListener('change', async () => {
            const v = dashSpeedMode.value;
            if (speedModeSelect) speedModeSelect.value = v;
            config.whisper_mode = v;
            try {
                await apiFetch(`${API_BASE}/config`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ whisper_mode: v }),
                });
                showToast(t('toast.saved'), 'success');
            } catch (e) {
                showToast(t('toast.network_error') + ': ' + e.message, 'error');
            }
        });
    }
    ['#setting-compute-type', '#setting-beam-size', '#setting-temperature', '#setting-vad-ms'].forEach((sel) => {
        const el = $(sel);
        if (el && speedModeSelect) {
            el.addEventListener('change', () => {
                if (speedModeSelect.value !== 'custom') {
                    speedModeSelect.value = 'custom';
                }
                const dashMode = $('#select-speed-mode');
                if (dashMode) dashMode.value = 'custom';
            });
        }
    });

    $('#toggle-autostart').addEventListener('change', (e) => {
        toggleAutostart(e.target.checked);
    });
}

// ---------------------------------------------------------------------------
// 初始化
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.lang = uiLanguage === 'zh' ? 'zh-CN' : uiLanguage;
    initNavigation();
    initChart();
    initEventListeners();
    initTrendResize();
    initAuth();
    setupAuthUI();
    connectWebSocket();
    loadStats();
    loadRecords();
    setInterval(updateClock, 1000);
    updateClock();
    // 変換リアルタイム監視のティック（変換中のみ 4 つの時間を滑らかに増加表示）
    setInterval(updateConversionMonitor, 250);
    applyI18n();
});
