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
        "nav.logging": "记录日志",
        "nav.settings": "设置",
        "nav.readme": "Readme",
        "nav.ocr": "OCR",
        "sidebar.whisper_service": "Whisper 服务",
        "sidebar.ocr_service": "OCR 服务",
        "sidebar.tts_service": "TTS 服务",
        "sidebar.llm_service": "LLM 活用",
        "sidebar.llm_processing": "AI 校正中...",
        "sidebar.llm_idle": "待机中",
        "sidebar.start": "开始",
        "sidebar.stop": "停止",
        "status.checking": "检查中...",
        "status.running": "待机中",
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
        "gpu.model_total": "合计",
        "gpu.tts_cpu": "CPU",
        "gpu.tts_cloud": "云",
        "gpu.model_whisper": "Whisper 模型",
        "gpu.model_tts": "TTS 模型",
        "gpu.model_ocr": "OCR 模型",
        "gpu.vram_pct": "占总比",
        "gpu.other": "其他",
        "realtime.trend": "实时趋势",
        "realtime.shrink": "缩小",
        "realtime.expand": "放大",
        "realtime.phase_idle": "待机",
        "realtime.phase_transcribe": "转换中",
        "realtime.phase_correct": "AI 校正中",
        "realtime.log_start": "开始记录",
        "realtime.log_stop": "停止记录",
        "realtime.log_recording": "记录中",
        "realtime.log_recording_tip": "正在记录实时数据...",
        "realtime.auto_start": "自动记录",
        "realtime.auto_tip": "任一服务（Whisper/TTS/OCR/LLM）从待机变为活动时自动开始，全部待机或活动中的服务停止时自动结束",
        "realtime.auto_start_on": "自动记录已开启（服务活动时自动开始）",
        "realtime.auto_start_off": "自动记录已关闭",
        "realtime.sample_period": "采样周期",
        "realtime.wave_span": "波形跨度",
        "realtime.point_unit": "点",
        "logging.title": "记录日志",
        "logging.refresh": "刷新",
        "logging.empty": "暂无记录",
        "logging.select_hint": "选择左侧日志查看内容",
        "logging.download": "下载",
        "logging.copy": "复制",
        "logging.delete": "删除",
        "logging.copied": "已复制",
        "logging.copy_failed": "复制失败",
        "logging.delete_confirm": "删除此日志？",
        "logging.deleted": "已删除",
        "logging.active_badge": "记录中",
        "logging.samples": "样本数",
        "logging.duration": "时长",
        "logging.avg_cpu": "平均CPU",
        "logging.avg_gpu": "平均GPU利用率",
        "logging.avg_temp": "平均温度",
        "logging.lines": "行数",
        "logging.size": "大小",
        "logging.graph": "图",
        "logging.data": "数据",
        "logging.select_tip": "点击可多选并叠加波形",
        "logging.clear_select": "清除选择",
        "logging.select_all": "全选",
        "logging.batch_delete": "批量删除",
        "logging.delete_selected_confirm": "确定删除选中的 {n} 个日志吗？",
        "logging.batch_deleted": "已删除 {n} 个日志",
        "logging.sel_count": "已选 {n} 个",
        "logging.monitors": "监控显示",
        "logging.download_as": "按当前显示格式（JSONL/CSV）下载",
        "whisper.control": "Whisper 服务控制",
        "control.title": "服务控制",
        "control.whisper": "Whisper",
        "control.tts": "TTS",
        "control.ocr": "OCR",
        "tts.engine": "引擎",
        "tts.device": "设备",
        "tts.load": "读入",
        "tts.unload": "释放",
        "tts.reload": "重读",
        "tts.status_loaded": "TTS 模型已读入",
        "tts.status_idle": "未读入",
        "tts.resident": "常驻",
        "tts.edge_cloud": "云端",
        "tts.speaking": "朗读中",
        "tts.paused": "已暂停",
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
        "ocr.control": "OCR 服务控制",
        "ocr.start": "启动服务",
        "ocr.stop": "停止服务",
        "ocr.restart": "重启服务",
        "ocr.status": "状态",
        "ocr.pid": "进程 ID",
        "ocr.uptime": "启动时间",
        "ocr.elapsed_time": "经时时间",
        "ocr.engine": "引擎",
        "ocr.managed": "Dashboard 托管",
        "ocr.external": "外部启动",
        "ocr.device": "执行设备",
        "ocr.device.gpu": "GPU（CUDA）",
        "ocr.device.cpu": "CPU",
        "ocr.lang": "语言",
        "ocr.lang.japan": "日本語",
        "ocr.lang.en": "English",
        "ocr.lang.ch": "中文",
        "ocr.lang.ko": "한국어",
        "ocr.execute": "OCR 执行",
        "ocr.mode_ocr": "图像 OCR",
        "ocr.mode_pdf": "PDF → Markdown",
        "ocr.run": "执行",
        "ocr.result": "结果",
        "ocr.download_md": "下载 Markdown",
        "ocr.vram_warn": "警告：6GB VRAM 同时运行 Whisper + Kokoro + PaddleOCR 时可能 VRAM 不足。PDF 结构解析（PP-StructureV3）仅在用时加载模型。",
        "ocr.settings": "OCR 设置",
        "ocr.autostart": "启动时自动启动 OCR 服务",
        "ocr.autostart_desc": "Dashboard 启动时也自动启动 PaddleOCR 服务（默认: 关闭）",
        "ocr.not_running": "OCR 服务未运行",
        "ocr.no_file": "请选择文件",
        "ocr.running_task": "OCR 处理中...",
        "ocr.done": "处理完成",
        "ocr.copied": "已复制",
        "ocr.copy_failed": "复制失败",
        "ocr.error": "OCR 失败",
        "ocr.format": "输出格式",
        "ocr.format_md": "MD",
        "ocr.format_txt": "TXT",
        "ocr.ai_correct": "AI 校正",
        "ocr.ai_correct_on": "校正",
        "ocr.ai_correct_off": "不校正",
        "ocr.converting": "转换中",
        "ocr.elapsed": "已用时",
        "ocr.pages": "页数",
        "ocr.speed": "转换速度",
        "ocr.time": "转换时间",
        "ocr.page_unit": "页",
        "ocr.corrected": "已 AI 校正",
        "ocr.download": "下载",
        "model.vram_ok": "✓ VRAM 充足",
        "model.vram_warn": "⚠️ VRAM 偏紧",
        "model.vram_danger": "🔴 不推荐（6GB VRAM 可能不足）",
        "model.lang_multi": "多语言",
        "model.lang_en": "英语专用",
        "model.vram_label": "VRAM 参考",
        "model.dl_label": "下载",
        "model.confirm_danger": "该模型可能超出 6GB 显卡 VRAM，仍要切换吗？",
        "model.manage": "模型管理",
        "model.dir": "模型保存位置",
        "model.dir_hint": "模型切换・新下载时的保存位置（空=默认）",
        "model.downloaded": "✓ 已下载",
        "model.not_downloaded": "未下载",
        "model.downloading": "下载中",
        "model.downloading_short": "中...",
        "model.download_failed": "下载失败",
        "model.retry_download": "重新下载",
        "model.use": "使用",
        "model.download": "下载",
        "model.download_start": "开始下载",
        "model.vibevoice_manage": "VibeVoice 模型",
        "model.kokoro_manage": "Kokoro 模型",
        "model.paddleocr_manage": "PaddleOCR 模型",
        "model.cache_dir": "保存位置",
        "model.delete": "删除",
        "model.delete_confirm": "确定删除该模型？模型文件将从磁盘删除。",
        "model.deleted": "已删除",
        "model.voices": "个声音",
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
        "records.copy_failed": "复制失败（未获得剪贴板权限等）",
        "records.view_all": "查看全部",
        "records.close": "关闭",
        "records.llm_corrected": "LLM AI 校正",
        "records.summary": "结果摘要",
        "records.action": "操作",
        "records.empty": "暂无记录",
        "records.detail": "完整结果",
        "records.view": "查看",
        "records.chars": "字数",
        "records.chars_raw": "原文",
        "records.chars_corr": "校正后",
        "records.tab_raw": "转换结果",
        "records.tab_corrected": "AI校正结果",
        "records.read": "朗读",
        "records.reading": "朗读中...",
        "records.pause": "暂停",
        "records.resume": "继续",
        "records.no_tts": "朗读失败（Edge TTS）",
        "records.tts_cold_wait": "正在生成语音。首次使用或长时间闲置后需要加载模型，可能需要数十秒",
        "records.delete": "删除",
        "records.delete_confirm": "确定删除这条记录吗？",
        "records.deleted": "记录已删除",
        "records.batch_delete": "批量删除",
        "records.select_all": "全选",
        "records.batch_delete_confirm": "确定删除选中的 {n} 条记录吗？",
        "records.batch_deleted": "已删除 {n} 条记录",
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
        "llm.provider": "服务商",
        "llm.provider_custom": "自定义",
        "llm.model": "模型",
        "llm.model_custom": "自定义…",
        "llm.model_loading": "读取中...",
        "llm.model_load_failed": "模型列表读取失败（请确认 Ollama 已启动）",
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
        "settings.copy": "复制",
        "settings.token_save": "保存令牌",
        "settings.token_saved": "令牌已保存",
        "settings.token_save_failed": "令牌保存失败",
        "settings.token_required": "请输入令牌",
        "settings.conn_token": "连接令牌（LAN 控制用）",
        "settings.conn_token_desc": "在其他设备的写入/控制请求与 WebSocket 连接中使用此令牌。本机访问无需令牌。",
        "settings.auth_enabled": "连接令牌认证",
        "settings.auth_enabled_desc": "关闭后，其他设备无需令牌即可执行写入・控制操作",
        "settings.auth_enabled_on": "已启用连接令牌认证",
        "settings.auth_enabled_off": "已禁用连接令牌认证",
        "settings.regenerate": "重新生成",
        "settings.hint": "更改后点击保存。Whisper 高速化・模型相关设置需重启 Whisper 服务生效。",
        "settings.tts": "朗读 TTS",
        "settings.tts_engine": "TTS 引擎",
        "settings.tts_engine.edge": "Edge TTS（默认·云端）",
        "settings.tts_engine.kokoro": "Kokoro（高速本地）",
        "settings.tts_engine.vibevoice": "VibeVoice（实时本地）",
        "settings.tts_device": "设备",
        "settings.tts_device.auto": "自动（按剩余显存）",
        "settings.tts_device.cuda": "CUDA (GPU)",
        "settings.tts_device.cpu": "CPU",
        "settings.tts_hint": "本地引擎首次使用会下载模型。未安装的引擎请切换到 Edge TTS。VibeVoice 需单独安装（见 README）。",
        "settings.tts_vibevoice_model": "VibeVoice 模型",
        "settings.tts_vibevoice_model.realtime": "Realtime 0.5B（高速・日语含）",
        "settings.tts_vibevoice_model.tts": "TTS 1.5B（英语/中文・仅CPU・不可合成）",
        "settings.tts_vibevoice_hint": "TTS 1.5B 仅支持英语/中文・仅 CPU・不可合成。选择后仍使用 Realtime（0.5B）朗读。",
        "settings.tts_kokoro_voice": "Kokoro 声音（日语）",
        "settings.tts_kokoro_voice.jf_alpha": "女声 Alpha（标准）",
        "settings.tts_kokoro_voice.jf_gongitsune": "女声 Gongitsune",
        "settings.tts_kokoro_voice.jf_nezumi": "女声 Nezumi",
        "settings.tts_kokoro_voice.jf_tebukuro": "女声 Tebukuro",
        "settings.tts_kokoro_voice.jm_kumo": "男声 Kumo",
        "settings.tts_preload": "启动时将本地TTS读入VRAM（常驻）",
        "settings.tts_preload_desc": "在 Dashboard 启动时加载 Kokoro / VibeVoice，此后不卸载而常驻（首次朗读立即响应。会占用 VRAM）",
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
        "toast.saved": "已保存",
        "auth.title": "需要连接令牌",
        "auth.desc": "写入・控制操作需要连接令牌。请在设置 → 界面设置中查看令牌，或由本机浏览器自动取得。",
        "auth.save": "保存",
    },
    ja: {
        "nav.dashboard": "ダッシュボード",
        "nav.records": "変換履歴",
        "nav.logs": "リアルタイムログ",
        "nav.logging": "ログ履歴",
        "nav.settings": "設定",
        "nav.readme": "Readme",
        "nav.ocr": "OCR",
        "sidebar.whisper_service": "Whisper サービス",
        "sidebar.ocr_service": "OCR サービス",
        "sidebar.tts_service": "TTS サービス",
        "sidebar.llm_service": "LLM 活用",
        "sidebar.llm_processing": "AI 校正中...",
        "sidebar.llm_idle": "待機中",
        "sidebar.start": "開始",
        "sidebar.stop": "停止",
        "status.checking": "確認中...",
        "status.running": "待機中",
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
        "gpu.model_total": "合計",
        "gpu.tts_cpu": "CPU",
        "gpu.tts_cloud": "クラウド",
        "gpu.model_whisper": "Whisper モデル",
        "gpu.model_tts": "TTS モデル",
        "gpu.model_ocr": "OCR モデル",
        "gpu.vram_pct": "全体割合",
        "gpu.other": "その他",
        "realtime.trend": "リアルタイム推移",
        "realtime.shrink": "縮小",
        "realtime.expand": "拡大",
        "realtime.phase_idle": "待機",
        "realtime.phase_transcribe": "変換中",
        "realtime.phase_correct": "AI 校正中",
        "realtime.log_start": "記録開始",
        "realtime.log_stop": "記録停止",
        "realtime.log_recording": "記録中",
        "realtime.log_recording_tip": "リアルタイム計測を記録中...",
        "realtime.auto_start": "自動記録",
        "realtime.auto_tip": "各サービス（Whisper/TTS/OCR/LLM）が待機から稼働に変わった瞬間に自動開始し、全サービスが待機、または今回のセッションで活動中のサービスが停止した時に自動終了します",
        "realtime.auto_start_on": "自動記録を有効化（サービス稼働時に自動開始）",
        "realtime.auto_start_off": "自動記録を無効化しました",
        "realtime.sample_period": "サンプリング周期",
        "realtime.wave_span": "波形間隔",
        "realtime.point_unit": "点",
        "logging.title": "ログ履歴",
        "logging.refresh": "更新",
        "logging.empty": "記録がありません",
        "logging.select_hint": "左のログを選択して内容を表示",
        "logging.download": "ダウンロード",
        "logging.copy": "コピー",
        "logging.delete": "削除",
        "logging.copied": "コピーしました",
        "logging.copy_failed": "コピーに失敗しました",
        "logging.delete_confirm": "このログを削除しますか？",
        "logging.deleted": "削除しました",
        "logging.active_badge": "記録中",
        "logging.samples": "サンプル数",
        "logging.duration": "記録時間",
        "logging.avg_cpu": "平均CPU",
        "logging.avg_gpu": "平均GPU使用率",
        "logging.avg_temp": "平均温度",
        "logging.lines": "行数",
        "logging.size": "サイズ",
        "logging.graph": "グラフ",
        "logging.data": "実データ",
        "logging.select_tip": "クリックで複数選択・波形を重ね合わせ可能",
        "logging.clear_select": "選択解除",
        "logging.select_all": "すべて選択",
        "logging.batch_delete": "選択削除",
        "logging.delete_selected_confirm": "選択した {n} 件のログを削除しますか？",
        "logging.batch_deleted": "{n} 件のログを削除しました",
        "logging.sel_count": "{n} 件選択中",
        "logging.monitors": "モニタ表示",
        "logging.download_as": "表示中の形式（JSONL/CSV）でダウンロード",
        "whisper.control": "Whisper サービス制御",
        "control.title": "サービス制御",
        "control.whisper": "Whisper",
        "control.tts": "TTS",
        "control.ocr": "OCR",
        "tts.engine": "エンジン",
        "tts.device": "デバイス",
        "tts.load": "読込",
        "tts.unload": "解放",
        "tts.reload": "再読込",
        "tts.status_loaded": "TTS モデル読込済み",
        "tts.status_idle": "未読込",
        "tts.resident": "常駐",
        "tts.edge_cloud": "クラウド",
        "tts.speaking": "読み上げ中",
        "tts.paused": "一時停止中",
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
        "ocr.control": "OCR サービス制御",
        "ocr.start": "サービス開始",
        "ocr.stop": "サービス停止",
        "ocr.restart": "再起動",
        "ocr.status": "状態",
        "ocr.pid": "プロセス ID",
        "ocr.uptime": "起動時間",
        "ocr.elapsed_time": "経過時間",
        "ocr.engine": "エンジン",
        "ocr.managed": "Dashboard 管理",
        "ocr.external": "外部起動",
        "ocr.device": "実行デバイス",
        "ocr.device.gpu": "GPU（CUDA）",
        "ocr.device.cpu": "CPU",
        "ocr.lang": "言語",
        "ocr.lang.japan": "日本語",
        "ocr.lang.en": "English",
        "ocr.lang.ch": "中文",
        "ocr.lang.ko": "한국어",
        "ocr.execute": "OCR 実行",
        "ocr.mode_ocr": "画像 OCR",
        "ocr.mode_pdf": "PDF → Markdown",
        "ocr.run": "実行",
        "ocr.result": "結果",
        "ocr.download_md": "Markdown ダウンロード",
        "ocr.vram_warn": "警告: 6GB VRAM では Whisper + Kokoro + PaddleOCR の同時稼働で VRAM が不足する可能性があります。PDF 構造解析（PP-StructureV3）は使用時のみモデルをロードします。",
        "ocr.settings": "OCR 設定",
        "ocr.autostart": "起動時に OCR サービスを自動起動",
        "ocr.autostart_desc": "Dashboard 起動時に PaddleOCR サービスも自動起動（既定: オフ）",
        "ocr.not_running": "OCR サービスが起動していません",
        "ocr.no_file": "ファイルを選択してください",
        "ocr.running_task": "OCR 処理中...",
        "ocr.done": "処理が完了しました",
        "ocr.copied": "コピーしました",
        "ocr.copy_failed": "コピーに失敗しました",
        "ocr.error": "OCR 処理に失敗しました",
        "ocr.format": "出力形式",
        "ocr.format_md": "MD",
        "ocr.format_txt": "TXT",
        "ocr.ai_correct": "AI 校正",
        "ocr.ai_correct_on": "校正する",
        "ocr.ai_correct_off": "校正しない",
        "ocr.converting": "変換中",
        "ocr.elapsed": "経過",
        "ocr.pages": "ページ数",
        "ocr.speed": "変換速度",
        "ocr.time": "変換時間",
        "ocr.page_unit": "枚",
        "ocr.corrected": "AI 校正済み",
        "ocr.download": "ダウンロード",
        "model.vram_ok": "✓ VRAM に収まる",
        "model.vram_warn": "⚠️ VRAM に注意",
        "model.vram_danger": "🔴 非推奨（6GB VRAM に収まらない恐れ）",
        "model.lang_multi": "多言語",
        "model.lang_en": "英語専用",
        "model.vram_label": "VRAM 目安",
        "model.dl_label": "DL",
        "model.confirm_danger": "このモデルは 6GB カードの VRAM に収まらない恐れがあります。それでも切替えますか？",
        "model.manage": "音声モデル管理",
        "model.dir": "モデル保存先",
        "model.dir_hint": "モデル切替・新規ダウンロード時の保存先（空欄=既定）",
        "model.downloaded": "✓ DL済",
        "model.not_downloaded": "未DL",
        "model.downloading": "ダウンロード中",
        "model.downloading_short": "中...",
        "model.download_failed": "ダウンロード失敗",
        "model.retry_download": "再DL",
        "model.use": "使用",
        "model.download": "DL",
        "model.download_start": "ダウンロードを開始しました",
        "model.vibevoice_manage": "VibeVoice モデル",
        "model.kokoro_manage": "Kokoro モデル",
        "model.paddleocr_manage": "PaddleOCR モデル",
        "model.cache_dir": "保存先",
        "model.delete": "削除",
        "model.delete_confirm": "このモデルを削除しますか？モデルファイルがディスクから削除されます。",
        "model.deleted": "削除しました",
        "model.voices": "音声",
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
        "records.copy_failed": "コピーに失敗しました（クリップボード権限がない等）",
        "records.view_all": "すべて表示",
        "records.close": "閉じる",
        "records.llm_corrected": "LLM AI 校正",
        "records.summary": "結果要約",
        "records.action": "操作",
        "records.empty": "履歴がありません",
        "records.detail": "詳細結果",
        "records.view": "表示",
        "records.chars": "文字数",
        "records.chars_raw": "原文",
        "records.chars_corr": "校正後",
        "records.tab_raw": "変換結果",
        "records.tab_corrected": "AI校正結果",
        "records.read": "音読み",
        "records.reading": "読み上げ中...",
        "records.pause": "一時停止",
        "records.resume": "再開",
        "records.no_tts": "読み上げに失敗しました（Edge TTS）",
        "records.tts_cold_wait": "音声を生成しています。初回または長時間放置後はモデルの読込に数十秒かかることがあります",
        "records.delete": "削除",
        "records.delete_confirm": "この記録を削除しますか？",
        "records.deleted": "記録を削除しました",
        "records.batch_delete": "選択削除",
        "records.select_all": "すべて選択",
        "records.batch_delete_confirm": "選択した {n} 件の記録を削除しますか？",
        "records.batch_deleted": "{n} 件の記録を削除しました",
        "records.correct": "校正",
        "records.correcting": "AI 校正中、お待ちください...",
        "records.corrected": "校正が完了しました",
        "logs.title": "リアルタイムログ",
        "logs.all": "すべて",
        "logs.clear": "表示をクリア",
        "logs.waiting": "ログを待っています...",
        "settings.transcription": "変換設定",
        "settings.interface": "インターフェース設定",
        "settings.language": "言語",
        "settings.language.auto": "自動検出",
        "settings.language.zh": "中文",
        "settings.language.en": "English",
        "settings.language.ja": "日本語",
        "settings.output": "出力形式",
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
        "llm.provider": "プロバイダ",
        "llm.provider_custom": "カスタム",
        "llm.model": "モデル",
        "llm.model_custom": "カスタム…",
        "llm.model_loading": "読み込み中...",
        "llm.model_load_failed": "モデル一覧を取得できませんでした（Ollama の起動を確認）",
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
        "settings.copy": "コピー",
        "settings.token_save": "トークンを保存",
        "settings.token_saved": "トークンを保存しました",
        "settings.token_save_failed": "トークンの保存に失敗しました",
        "settings.token_required": "トークンを入力してください",
        "settings.conn_token": "接続トークン（LAN 制御用）",
        "settings.conn_token_desc": "他のデバイスからの書き込み・制御リクエストと WebSocket 接続で使用します。本機からのアクセスはトークン不要です。",
        "settings.auth_enabled": "接続トークン認証",
        "settings.auth_enabled_desc": "オフにすると、他のデバイスはトークンなしで書き込み・制御操作を実行できます",
        "settings.auth_enabled_on": "接続トークン認証を有効化しました",
        "settings.auth_enabled_off": "接続トークン認証を無効化しました",
        "settings.regenerate": "再生成",
        "settings.hint": "変更後は「保存」を押してください。Whisper 高速化・モデル関連の設定は Whisper サービスの再起動で反映されます。",
        "settings.tts": "読み上げ TTS",
        "settings.tts_engine": "TTS エンジン",
        "settings.tts_engine.edge": "Edge TTS（既定・クラウド）",
        "settings.tts_engine.kokoro": "Kokoro（高速ローカル）",
        "settings.tts_engine.vibevoice": "VibeVoice（リアルタイム）",
        "settings.tts_device": "デバイス",
        "settings.tts_device.auto": "自動（空きVRAMで判断）",
        "settings.tts_device.cuda": "CUDA (GPU)",
        "settings.tts_device.cpu": "CPU",
        "settings.tts_hint": "ローカルエンジンは初回使用時にモデルをダウンロードします。未導入のエンジンは Edge TTS へ切り替えてください。VibeVoice は別途インストールが必要です（README 参照）。",
        "settings.tts_vibevoice_model": "VibeVoice モデル",
        "settings.tts_vibevoice_model.realtime": "Realtime 0.5B（高速・日本語含む）",
        "settings.tts_vibevoice_model.tts": "TTS 1.5B（英語/中国語のみ・CPUのみ・合成非対応）",
        "settings.tts_vibevoice_hint": "VibeVoice-TTS（1.5B）は英語・中国語のみ・CPU のみで合成未対応です。選択時は Realtime（0.5B）で読み上げます。",
        "settings.tts_kokoro_voice": "Kokoro 音声（日本語）",
        "settings.tts_kokoro_voice.jf_alpha": "女声 Alpha（標準）",
        "settings.tts_kokoro_voice.jf_gongitsune": "女声 Gongitsune",
        "settings.tts_kokoro_voice.jf_nezumi": "女声 Nezumi",
        "settings.tts_kokoro_voice.jf_tebukuro": "女声 Tebukuro",
        "settings.tts_kokoro_voice.jm_kumo": "男声 Kumo",
        "settings.tts_preload": "起動時にローカルTTSをVRAMに読込（常駐）",
        "settings.tts_preload_desc": "ダッシュボード起動時に Kokoro / VibeVoice を読み込み、以後アンロードせず常駐させます（初回読み上げが即応答。VRAM は消費します）",
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
        "toast.saved": "保存しました",
        "auth.title": "接続トークンが必要です",
        "auth.desc": "書き込み・制御操作には接続トークンが必要です。設定 → インターフェースで確認するか、本機のブラウザで自動取得してください。",
        "auth.save": "保存",
    },
    en: {
        "nav.dashboard": "Dashboard",
        "nav.records": "Transcription History",
        "nav.logs": "Live Logs",
        "nav.logging": "Log History",
        "nav.settings": "Settings",
        "nav.readme": "Readme",
        "nav.ocr": "OCR",
        "sidebar.whisper_service": "Whisper Service",
        "sidebar.ocr_service": "OCR Service",
        "sidebar.tts_service": "TTS Service",
        "sidebar.llm_service": "LLM Activity",
        "sidebar.llm_processing": "AI correcting...",
        "sidebar.llm_idle": "Idle",
        "sidebar.start": "Start",
        "sidebar.stop": "Stop",
        "status.checking": "Checking...",
        "status.running": "Standby",
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
        "gpu.model_total": "Total",
        "gpu.tts_cpu": "CPU",
        "gpu.tts_cloud": "Cloud",
        "gpu.model_whisper": "Whisper Model",
        "gpu.model_tts": "TTS Model",
        "gpu.model_ocr": "OCR Model",
        "gpu.vram_pct": "Share of total",
        "gpu.other": "Other",
        "realtime.trend": "Real-time Trend",
        "realtime.shrink": "Shrink",
        "realtime.expand": "Expand",
        "realtime.phase_idle": "Idle",
        "realtime.phase_transcribe": "Transcribing",
        "realtime.phase_correct": "AI Correcting",
        "realtime.log_start": "Start Logging",
        "realtime.log_stop": "Stop Logging",
        "realtime.log_recording": "Recording",
        "realtime.log_recording_tip": "Recording real-time metrics...",
        "realtime.auto_start": "Auto-record",
        "realtime.auto_tip": "Auto-starts when any service (Whisper/TTS/OCR/LLM) becomes active, and auto-ends when all are idle or an active service stops",
        "realtime.auto_start_on": "Auto-record enabled (starts when a service becomes active)",
        "realtime.auto_start_off": "Auto-record disabled",
        "realtime.sample_period": "Sample Period",
        "realtime.wave_span": "Wave Span",
        "realtime.point_unit": "pt",
        "logging.title": "Log History",
        "logging.refresh": "Refresh",
        "logging.empty": "No logs yet",
        "logging.select_hint": "Select a log on the left",
        "logging.download": "Download",
        "logging.copy": "Copy",
        "logging.delete": "Delete",
        "logging.copied": "Copied",
        "logging.copy_failed": "Copy failed",
        "logging.delete_confirm": "Delete this log?",
        "logging.deleted": "Deleted",
        "logging.active_badge": "Recording",
        "logging.samples": "Samples",
        "logging.duration": "Duration",
        "logging.avg_cpu": "Avg CPU",
        "logging.avg_gpu": "Avg GPU Util",
        "logging.avg_temp": "Avg Temp",
        "logging.lines": "Lines",
        "logging.size": "Size",
        "logging.graph": "Graph",
        "logging.data": "Data",
        "logging.select_tip": "Click to select (multiple) and overlay waveforms",
        "logging.clear_select": "Clear selection",
        "logging.select_all": "Select All",
        "logging.batch_delete": "Delete Selected",
        "logging.delete_selected_confirm": "Delete {n} selected log(s)?",
        "logging.batch_deleted": "Deleted {n} log(s)",
        "logging.sel_count": "{n} selected",
        "logging.monitors": "Monitors",
        "logging.download_as": "Download in current display format (JSONL/CSV)",
        "whisper.control": "Whisper Service Control",
        "control.title": "Service Control",
        "control.whisper": "Whisper",
        "control.tts": "TTS",
        "control.ocr": "OCR",
        "tts.engine": "Engine",
        "tts.device": "Device",
        "tts.load": "Load",
        "tts.unload": "Unload",
        "tts.reload": "Reload",
        "tts.status_loaded": "TTS model loaded",
        "tts.status_idle": "Not loaded",
        "tts.resident": "resident",
        "tts.edge_cloud": "cloud",
        "tts.speaking": "Speaking...",
        "tts.paused": "Paused",
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
        "ocr.control": "OCR Service Control",
        "ocr.start": "Start Service",
        "ocr.stop": "Stop Service",
        "ocr.restart": "Restart",
        "ocr.status": "Status",
        "ocr.pid": "Process ID",
        "ocr.uptime": "Start Time",
        "ocr.elapsed_time": "Elapsed",
        "ocr.engine": "Engine",
        "ocr.managed": "Dashboard managed",
        "ocr.external": "External",
        "ocr.device": "Device",
        "ocr.device.gpu": "GPU (CUDA)",
        "ocr.device.cpu": "CPU",
        "ocr.lang": "Language",
        "ocr.lang.japan": "日本語",
        "ocr.lang.en": "English",
        "ocr.lang.ch": "中文",
        "ocr.lang.ko": "한국어",
        "ocr.execute": "Run OCR",
        "ocr.mode_ocr": "Image OCR",
        "ocr.mode_pdf": "PDF → Markdown",
        "ocr.run": "Run",
        "ocr.result": "Result",
        "ocr.download_md": "Download Markdown",
        "ocr.vram_warn": "Warning: On 6GB VRAM, running Whisper + Kokoro + PaddleOCR together may exhaust VRAM. PDF structure analysis (PP-StructureV3) loads models only on demand.",
        "ocr.settings": "OCR Settings",
        "ocr.autostart": "Auto-start OCR service on launch",
        "ocr.autostart_desc": "Also start the PaddleOCR service when Dashboard launches (default: off)",
        "ocr.not_running": "OCR service is not running",
        "ocr.no_file": "Please select a file",
        "ocr.running_task": "Processing...",
        "ocr.done": "Done",
        "ocr.copied": "Copied",
        "ocr.copy_failed": "Copy failed",
        "ocr.error": "OCR failed",
        "ocr.format": "Output format",
        "ocr.format_md": "MD",
        "ocr.format_txt": "TXT",
        "ocr.ai_correct": "AI correction",
        "ocr.ai_correct_on": "Correct",
        "ocr.ai_correct_off": "No correction",
        "ocr.converting": "Converting",
        "ocr.elapsed": "Elapsed",
        "ocr.pages": "Pages",
        "ocr.speed": "Speed",
        "ocr.time": "Time",
        "ocr.page_unit": "pg",
        "ocr.corrected": "AI corrected",
        "ocr.download": "Download",
        "model.vram_ok": "✓ Fits in VRAM",
        "model.vram_warn": "⚠️ Tight VRAM",
        "model.vram_danger": "🔴 Not recommended (may exceed 6GB VRAM)",
        "model.lang_multi": "Multilingual",
        "model.lang_en": "English only",
        "model.vram_label": "VRAM",
        "model.dl_label": "Download",
        "model.confirm_danger": "This model may not fit in 6GB VRAM. Switch anyway?",
        "model.manage": "Model Management",
        "model.dir": "Model directory",
        "model.dir_hint": "Save location for downloads (blank = default)",
        "model.downloaded": "✓ Downloaded",
        "model.not_downloaded": "Not downloaded",
        "model.downloading": "Downloading",
        "model.downloading_short": "...",
        "model.download_failed": "Download failed",
        "model.retry_download": "Retry",
        "model.use": "Use",
        "model.download": "Download",
        "model.download_start": "Download started",
        "model.vibevoice_manage": "VibeVoice Models",
        "model.kokoro_manage": "Kokoro Model",
        "model.paddleocr_manage": "PaddleOCR Models",
        "model.cache_dir": "Save location",
        "model.delete": "Delete",
        "model.delete_confirm": "Delete this model? Model files will be removed from disk.",
        "model.deleted": "Deleted",
        "model.voices": "voices",
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
        "records.copy_failed": "Copy failed (no clipboard permission, etc.)",
        "records.view_all": "View All",
        "records.close": "Close",
        "records.llm_corrected": "LLM AI corrected",
        "records.summary": "Summary",
        "records.action": "Action",
        "records.empty": "No records",
        "records.detail": "Full Result",
        "records.view": "View",
        "records.chars": "Chars",
        "records.chars_raw": "Raw",
        "records.chars_corr": "Corrected",
        "records.tab_raw": "Original",
        "records.tab_corrected": "AI Corrected",
        "records.read": "Read Aloud",
        "records.reading": "Reading...",
        "records.pause": "Pause",
        "records.resume": "Resume",
        "records.no_tts": "Read aloud failed (Edge TTS)",
        "records.tts_cold_wait": "Generating audio. On first use or after idle, model loading can take tens of seconds",
        "records.delete": "Delete",
        "records.delete_confirm": "Delete this record?",
        "records.deleted": "Record deleted",
        "records.batch_delete": "Delete Selected",
        "records.select_all": "Select All",
        "records.batch_delete_confirm": "Delete {n} selected record(s)?",
        "records.batch_deleted": "Deleted {n} record(s)",
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
        "llm.provider": "Provider",
        "llm.provider_custom": "Custom",
        "llm.model": "Model",
        "llm.model_custom": "Custom...",
        "llm.model_loading": "Loading...",
        "llm.model_load_failed": "Failed to load models (check Ollama is running)",
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
        "settings.copy": "Copy",
        "settings.token_save": "Save Token",
        "settings.token_saved": "Token saved",
        "settings.token_save_failed": "Failed to save token",
        "settings.token_required": "Please enter a token",
        "settings.conn_token": "Connection Token (LAN control)",
        "settings.conn_token_desc": "Used for write/control requests and WebSocket connections from other devices. Access from this machine does not require a token.",
        "settings.auth_enabled": "Connection token authentication",
        "settings.auth_enabled_desc": "When off, other devices can perform write/control operations without a token",
        "settings.auth_enabled_on": "Connection token authentication enabled",
        "settings.auth_enabled_off": "Connection token authentication disabled",
        "settings.regenerate": "Regenerate",
        "settings.hint": "Save after making changes. Speed & model-related settings apply after restarting the Whisper service.",
        "settings.tts": "Read-aloud TTS",
        "settings.tts_engine": "TTS Engine",
        "settings.tts_engine.edge": "Edge TTS (default·cloud)",
        "settings.tts_engine.kokoro": "Kokoro (fast local)",
        "settings.tts_engine.vibevoice": "VibeVoice (realtime local)",
        "settings.tts_device": "Device",
        "settings.tts_device.auto": "Auto (by free VRAM)",
        "settings.tts_device.cuda": "CUDA (GPU)",
        "settings.tts_device.cpu": "CPU",
        "settings.tts_hint": "Local engines download the model on first use. Switch to Edge TTS if an engine is not installed. VibeVoice requires a separate install (see README).",
        "settings.tts_vibevoice_model": "VibeVoice model",
        "settings.tts_vibevoice_model.realtime": "Realtime 0.5B (fast·incl. Japanese)",
        "settings.tts_vibevoice_model.tts": "TTS 1.5B (English/Chinese·CPU-only·no synth)",
        "settings.tts_vibevoice_hint": "VibeVoice-TTS (1.5B) is English/Chinese-only, CPU-only and cannot synthesize. When selected, Realtime (0.5B) is used for speech.",
        "settings.tts_kokoro_voice": "Kokoro voice (Japanese)",
        "settings.tts_kokoro_voice.jf_alpha": "Female Alpha (default)",
        "settings.tts_kokoro_voice.jf_gongitsune": "Female Gongitsune",
        "settings.tts_kokoro_voice.jf_nezumi": "Female Nezumi",
        "settings.tts_kokoro_voice.jf_tebukuro": "Female Tebukuro",
        "settings.tts_kokoro_voice.jm_kumo": "Male Kumo",
        "settings.tts_preload": "Load local TTS into VRAM at startup (resident)",
        "settings.tts_preload_desc": "Loads Kokoro / VibeVoice at Dashboard startup and keeps it resident without unloading (instant first read. Consumes VRAM)",
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
        "toast.saved": "Saved",
        "auth.title": "Connection token required",
        "auth.desc": "Write/control operations require a connection token. View it in Settings → Interface, or obtain it automatically from this device's browser.",
        "auth.save": "Save",
    }
};

let uiLanguage = localStorage.getItem('ui_language') || 'ja';

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
    // data-i18n-title（ツールチップ）
    $all('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key, el.title);
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
    if (typeof lastOcrStatus !== 'undefined') updateOcrStatus(lastOcrStatus || { running: false });
    renderRecords(lastRecords || []);
    renderLLMProfiles(llmProfiles || []);
    renderReadme(); // Readme セクション（言語切替・初期化時に再描画）
    // 動的テキスト（フェーズピル・ロギングボタン）を言語切替後も再描画
    setCurrentPhase(currentPhase);
    refreshRealtimeLogBtn();
    if ($('#logging')) loadRealtimeLogs(); // ロギングセクションが開いていれば一覧を再読込
    // 読み上げボタン状態（読み上げ中/一時停止中）も言語切替後も維持
    if (speakBtn) setReadBtn(speakBtn, ttsPaused ? 'paused' : 'reading');
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
    ui_language: 'ja',
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
let recordsSortKey = null; // 履历列ソートキー（null=未ソート）
let recordsSortDir = 1;    // 1=昇順 / -1=降順
let llmProfiles = []; // LLM プロファイル一覧
let activeLlmModel = ''; // アクティブな LLM プロファイルのモデル名（AI 校正バー表示用）
let currentConverting = false; // 是否正在转换（驱动状态显示与进度条）
let currentModel = ''; // 実行中 Whisper モデル（リアルタイム監視表示用）
let currentPhase = 'idle'; // 現在フェーズ: 'idle' | 'transcribe' | 'correct'（チャート帯・ピル表示用）
let chartPhases = []; // チャート帯描画用の履歴フェーズ配列（system_history.phase のスライス）
let realtimeLogActive = false; // リアルタイムロギング記録中か
let realtimeLogAuto = false;   // 現在の記録セッションが自動開始（rtl_auto_start）か
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

// 設定画面: 接続トークンを手動入力して保存
async function saveAuthToken() {
    const display = $('#auth-token-display');
    if (!display) return;
    const tok = display.value.trim();
    if (!tok) { showToast(t('settings.token_required'), 'error'); return; }
    try {
        const resp = await apiFetch(`${API_BASE}/auth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: tok })
        });
        const data = await resp.json();
        if (data.success) {
            setToken(data.token);
            if (ws) { try { ws.close(); } catch (e) {} }
            connectWebSocket();
            showToast(t('settings.token_saved'), 'success');
        } else {
            showToast(data.error || t('settings.token_save_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
}

// 接続トークン認証の有効/無効を UI に反映（無効時はトークン操作を不可視化）
function applyAuthEnabledState(enabled) {
    const toggle = $('#toggle-auth-enabled');
    if (toggle) toggle.checked = !!enabled;
    const controls = $('#auth-token-controls');
    if (controls) {
        controls.classList.toggle('opacity-40', !enabled);
        controls.classList.toggle('pointer-events-none', !enabled);
    }
}

// トグル切替: 設定画面のトグルで認証の有効/無効を即時保存
async function toggleAuthEnabled() {
    const toggle = $('#toggle-auth-enabled');
    if (!toggle) return;
    const enabled = toggle.checked;
    try {
        const resp = await apiFetch(`${API_BASE}/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ auth_enabled: enabled ? 'on' : 'off' })
        });
        const data = await resp.json();
        if (data.success) {
            config.auth_enabled = enabled ? 'on' : 'off';
            applyAuthEnabledState(enabled);
            showToast(enabled ? t('settings.auth_enabled_on') : t('settings.auth_enabled_off'), 'success');
            if (ws) { try { ws.close(); } catch (e) {} }
            connectWebSocket();
        } else {
            applyAuthEnabledState(!enabled);  // 失敗時は元の状態へ
            showToast(data.error || t('toast.action_failed'), 'error');
        }
    } catch (e) {
        applyAuthEnabledState(!enabled);
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
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
    const saveSettingBtn = $('#btn-auth-token-save-setting');
    if (saveSettingBtn) saveSettingBtn.addEventListener('click', saveAuthToken);
    const authToggle = $('#toggle-auth-enabled');
    if (authToggle) authToggle.addEventListener('change', toggleAuthEnabled);
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

// VRAM リングを 4 セグメント（Whisper / TTS / OCR / その他）で描画。
// segments: [{ id, frac }]  … frac は全体（0..1）に対する割合で、先頭から時計回りに並ぶ
function setRingSegments(segments, maxOffset = 283) {
    let start = 0;
    for (const seg of segments) {
        const el = $(seg.id);
        if (!el) { start += seg.frac; continue; }
        if (!seg.frac || seg.frac <= 0) {
            el.style.strokeDasharray = '0 ' + maxOffset;
            el.style.strokeDashoffset = maxOffset;
            start += seg.frac;
            continue;
        }
        const len = seg.frac * maxOffset;
        el.style.strokeDasharray = len + ' ' + (maxOffset - len);
        // セグメント開始位置（path 原点）まで dash パターンを後方へシフト
        el.style.strokeDashoffset = (maxOffset - start * maxOffset).toFixed(3);
        start += seg.frac;
    }
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

// 文字数（コードポイント単位でカウント：サロゲートペアも1文字扱い）
function charCount(str) {
    return str ? Array.from(String(str)).length : 0;
}

function fmtNum(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 原文/校正後 の文字数表示テキスト（校正済みなら両方を矢印で結ぶ）
function recordCharsText(raw, result) {
    const rc = fmtNum(charCount(raw));
    const cc = fmtNum(charCount(result));
    if (result !== raw) return `${t('records.chars_raw')}: ${rc} → ${t('records.chars_corr')}: ${cc}`;
    return `${t('records.chars')}: ${rc}`;
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
        case 'ocr_status':
            updateOcrStatus(msg.data);
            break;
        case 'tts_status':
            updateTtsStatus(msg.data);
            break;
        case 'llm_status':
            updateSidebarLlmStatus(msg.data);
            break;
        case 'realtime_log':
            // 自動/手動で記録が開始・終了した（セッション状態の同期）
            if (msg.data) {
                realtimeLogActive = !!msg.data.active;
                realtimeLogAuto = !!(msg.data.active && msg.data.auto);
                refreshRealtimeLogBtn();
            }
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
        case 'record_added':
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

// フェーズピル（#realtime-phase）を現在のフェーズに合わせて更新
function setCurrentPhase(phase) {
    currentPhase = phase;
    const pill = $('#realtime-phase');
    if (!pill) return;
    pill.className = `phase-pill phase-${phase}`;
    pill.textContent = t(`realtime.phase_${phase}`);
}

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
    // フェーズピル更新（変換中→transcribe / 校正中→correct / それ以外→idle）
    if (active) {
        setCurrentPhase(conversionTiming.phase === 'correct' ? 'correct' : 'transcribe');
    } else {
        setCurrentPhase('idle');
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
        setCurrentPhase('correct');
    } else if (msg.phase === 'transcribe') {
        conversionTiming.phase = 'transcribe';
        setCurrentPhase('transcribe');
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
    const fmt = (s) => formatTime(Math.max(0, s), 'minsec');

    $('#live-duration').textContent = tm.durationKnown ? fmt(tm.duration) : '--:--';
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
    gpuAvailable = !!(gpu && !gpu.error);
    // CUDA が真に使えるのは NVML 由来のときのみ（WDDM フォールバックは cuda_available=false）
    cudaAvailable = !!(gpu && !gpu.error && gpu.cuda_available !== false);
    gpuUsedMb = gpu && !gpu.error ? (gpu.memory_used_mb || 0) : 0;
    gpuTotalMb = gpu && !gpu.error ? (gpu.memory_total_mb || 1) : 1;
    if (gpu && !gpu.error) {
        $('#gpu-name').textContent = gpu.name || 'NVIDIA GPU';
        const util = gpu.utilization || 0;
        const memPercent = Math.round((gpu.memory_used_mb / Math.max(gpu.memory_total_mb, 1)) * 100);

        // 表盘
        $('#gpu-util-value').textContent = util + '%';
        gpuUtil = util;
        gpuUtilBreakdown = gpu.util_breakdown || {};
        renderGpuUtilBreakdown(); // 使用率リングは 4 セグメント描画
        $('#gpu-mem-value').textContent = memPercent + '%';
        renderGpuVramBreakdown(); // VRAM リングは 4 セグメント描画

        // 温度リング（100% = 100°C）
        const temp = gpu.temperature || 0;
        $('#gpu-temp-ring-value').textContent = temp + '°C';
        setRingProgress('#gpu-temp-ring', temp);

        // オーバーヒート表示：温度リングを赤点滅（3 ボックスはモデル情報表示のため対象外）
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
        gpuUtil = 0;
        gpuUtilBreakdown = {};
        cudaAvailable = false;
        renderGpuUtilBreakdown(); // セグメントは全消去
        renderGpuVramBreakdown(); // セグメントは全消去
        $('#gpu-temp-ring-value').textContent = '0°C';
        setRingProgress('#gpu-temp-ring', 0);
    }

    // 图表
    if (history && mainChart) {
        updateChart(history);
    }

    // GPU 有無に応じて TTS の VRAM 目安（device=auto）を再評価
    renderGpuTtsDisplay();
    syncMonitors(); // OCR 画面の複製モニターにも反映
}

// ---------------------------------------------------------------------------
// Whisper 状态
// ---------------------------------------------------------------------------
// 同一モデルへのエイリアス（turbo ⇔ large-v3-turbo / large ⇔ large-v3）。
// WS 同期時に相互を同一視し、選択中を勝手に書き換えない。
const MODEL_ALIASES = { 'turbo': 'large-v3-turbo', 'large': 'large-v3' };
function sameModel(a, b) {
    if (!a || !b) return false;
    if (a === b) return true;
    return MODEL_ALIASES[a] === b || MODEL_ALIASES[b] === a;
}

// GPU モニタ「显存」: リング 4 セグメント（Whisper / TTS / OCR / その他）と各モデル詳細
let gpuAvailable = false;   // updateSystemDisplay で GPU 情報（NVML or WDDM フォールバック）が取得できたか
let cudaAvailable = false;  // CUDA (NVIDIA) が利用可能か（TTS の device=auto 判定に使用。WDDM フォールバックでは false）
let gpuWhisperVram = 0;     // Whisper VRAM 目安（GB）
let gpuOcrVram = 0;         // OCR モデル VRAM 目安（GB）
let gpuUsedMb = 0;          // NVML 実測: 使用中 VRAM（MB）
let gpuTotalMb = 1;         // NVML 実測: 全 VRAM（MB）
let gpuUtil = 0;            // GPU 総合使用率（%）
let gpuUtilBreakdown = {};  // 使用率の PID 別内訳 {whisper, tts, ocr, other}（バックエンドの GPU Engine カウンタ由来）

function updateGpuModelDisplay(model) {
    const memModel = $('#gpu-mem-model');
    gpuWhisperVram = 0;
    if (!model) {
        if (memModel) { memModel.textContent = '--'; memModel.title = ''; }
    } else if (memModel) {
        memModel.textContent = model;
        const info = modelCatalog && modelCatalog[model];
        if (info) {
            const ct = (config.whisper_compute_type || 'int8_float16').toLowerCase();
            gpuWhisperVram = parseFloat(ct.includes('int8') ? info.vram_int8 : info.vram_fp16) || 0;
            memModel.title = `Whisper ${model}: VRAM ${gpuWhisperVram.toFixed(1)}GB`;
        } else {
            memModel.title = '';
        }
    }
    renderGpuTtsDisplay();
    syncMonitors(); // OCR 画面の複製モニターにも反映
}

// 現在の TTS 設定から実行モデル名と VRAM 目安を返す（GPU 実行のみ vram>0、CPU/クラウドは 0）
function ttsVramEstimate() {
    const engine = (config.tts_engine || 'edge').toLowerCase();
    if (engine === 'edge') return { label: 'Edge TTS', mode: 'cloud', vram: 0 };
    const dev = (config.tts_device || 'auto').toLowerCase();
    const gpu = dev === 'cuda' || (dev === 'auto' && cudaAvailable);
    if (engine === 'kokoro') {
        return gpu
            ? { label: 'Kokoro', mode: 'vram', vram: 1.0 }
            : { label: 'Kokoro', mode: 'cpu', vram: 0 };
    }
    if (engine === 'vibevoice') {
        const vv = (config.tts_vibevoice_model || 'realtime').toLowerCase();
        if (vv === 'tts') return { label: 'VibeVoice TTS 1.5B', mode: 'cpu', vram: 0 };
        return gpu
            ? { label: 'VibeVoice Realtime', mode: 'vram', vram: 4.5 }
            : { label: 'VibeVoice Realtime', mode: 'cpu', vram: 0 };
    }
    return null;
}

// 現在の OCR 稼働状態からモデル名と VRAM 目安（GB）を返す（GPU 実行・読込済みのみ vram>0）
function ocrVramEstimate() {
    const ocr = lastOcrStatus;
    if (!ocr || !ocr.running) return { label: '', vram: 0 };
    const health = ocr.health || {};
    if (String(health.device).toLowerCase() === 'cpu') return { label: 'PP-OCR', vram: 0 };
    const label = [];
    let vram = 0;
    if (health.ocr_ready) { label.push('PP-OCR'); vram += 0.6; }
    if (health.structure_ready) { label.push('PP-StructureV3'); vram += 1.2; }
    return { label: label.join(' + '), vram };
}

// GPU モニタの TTS モデル行（VRAM 容量下の折り畳み）を描画
function renderGpuTtsDisplay() {
    const tts = ttsVramEstimate();
    const ttsModel = $('#gpu-mem-tts-model');
    if (!tts) {
        if (ttsModel) { ttsModel.textContent = '--'; ttsModel.title = ''; }
        renderGpuVramBreakdown();
        return;
    }
    if (ttsModel) {
        ttsModel.textContent = tts.label;
        const sizeText = tts.mode === 'vram' ? `VRAM ${tts.vram.toFixed(1)}GB` : (tts.mode === 'cloud' ? t('gpu.tts_cloud') : t('gpu.tts_cpu'));
        ttsModel.title = `${tts.label}: ${sizeText}`;
    }
    renderGpuVramBreakdown();
    syncMonitors(); // OCR 画面の複製モニターにも反映
}

// GPU モニタの OCR モデル行（消費電力下の折り畳み）を描画
function renderGpuOcrDisplay() {
    const ocr = lastOcrStatus;
    const ocrV = ocrVramEstimate();
    gpuOcrVram = ocrV.vram;
    const modelEl = $('#gpu-mem-ocr-model');
    if (!ocr || !ocr.running) {
        if (modelEl) { modelEl.textContent = '--'; modelEl.title = ''; }
    } else if (modelEl) {
        modelEl.textContent = ocrV.label || '...';
        const health = ocr.health || {};
        if (String(health.device).toLowerCase() === 'cpu') {
            modelEl.title = t('gpu.tts_cpu');
        } else if (ocrV.vram > 0) {
            modelEl.title = `OCR: VRAM ${ocrV.vram.toFixed(1)}GB`;
        } else {
            modelEl.title = '';
        }
    }
    renderGpuVramBreakdown();
    syncMonitors(); // OCR 画面の複製モニターにも反映
}

// GPU 使用率リング（4 セグメント）を一括描画（100% = 全周）
function renderGpuUtilBreakdown() {
    const bd = gpuUtilBreakdown || {};
    const total = Math.max(0, gpuUtil || 0);
    let w = Math.max(0, bd.whisper || 0);
    let t = Math.max(0, bd.tts || 0);
    let o = Math.max(0, bd.ocr || 0);
    // PID 別合計が総合使用率を上回る場合は比例縮小（VRAM リングと同じ整合ロジック）
    const known = w + t + o;
    if (known > total && total > 0) {
        const s = total / known;
        w *= s; t *= s; o *= s;
    }
    const other = Math.max(0, total - (w + t + o));
    const frac = v => Math.max(0, Math.min(1, v / 100));
    setRingSegments([
        { id: '#gpu-util-whisper', frac: frac(w) },
        { id: '#gpu-util-tts', frac: frac(t) },
        { id: '#gpu-util-ocr', frac: frac(o) },
        { id: '#gpu-util-other', frac: frac(other) },
    ]);
}

// VRAM リング（4 セグメント）と各モデルの「全体割合」行を一括描画
function renderGpuVramBreakdown() {
    const whisperMb = (gpuWhisperVram || 0) * 1024;
    const tts = ttsVramEstimate();
    const ttsMb = ((tts && tts.vram) || 0) * 1024;
    const ocrMb = (gpuOcrVram || 0) * 1024;
    const usedMb = gpuUsedMb;
    const totalMb = Math.max(gpuTotalMb, 1);
    const known = whisperMb + ttsMb + ocrMb;

    // モデル推定（カタログのピーク値）が実測使用量を上回る場合は比例縮小し、
    // 「その他」（デスクトップ・他プロセスの使用分）が常に確保されるようにする。
    let w = whisperMb, t = ttsMb, o = ocrMb;
    if (known > usedMb) {
        const s = (usedMb * 0.75) / known;
        w *= s; t *= s; o *= s;
    }
    const otherMb = Math.max(0, usedMb - (w + t + o));

    // リング: 各セグメントは全体容量に対する割合（未使用分はベース色のまま）
    const frac = mb => totalMb > 0 ? mb / totalMb : 0;
    const pct = mb => frac(mb) * 100;
    setRingSegments([
        { id: '#gpu-mem-whisper', frac: frac(w) },
        { id: '#gpu-mem-tts-ring', frac: frac(t) },
        { id: '#gpu-mem-ocr-ring', frac: frac(o) },
        { id: '#gpu-mem-other-ring', frac: frac(otherMb) },
    ]);

    // 詳細行: 各モデルの VRAM使用容量（MB）と「全体割合」。リング描画と同じ縮小後値で一致させる
    const setDetail = (vramId, pctId, mb) => {
        const vramEl = vramId ? $(vramId) : null;
        if (vramEl) vramEl.textContent = mb > 0 ? `${Math.round(mb)} MB` : '--';
        const pctEl = pctId ? $(pctId) : null;
        if (pctEl) pctEl.textContent = mb > 0 ? `${pct(mb).toFixed(1)}%` : '';
    };
    setDetail('#gpu-mem-vram', '#gpu-mem-pct', w);
    setDetail('#gpu-mem-tts-vram', '#gpu-mem-tts-pct', t);
    setDetail('#gpu-mem-ocr-vram', '#gpu-mem-ocr-pct', o);
}

// ---------------------------------------------------------------------------
// モニター同期: OCR 画面の複製カードへダッシュボードの値をコピー
// （data-monitor-sync="<dashboard-id>" で紐付いた要素を更新）
// ---------------------------------------------------------------------------
function syncMonitors() {
    document.querySelectorAll('[data-monitor-sync]').forEach(dst => {
        const src = document.getElementById(dst.dataset.monitorSync);
        if (!src) return;
        if (dst.tagName === 'circle') {
            dst.style.strokeDasharray = src.style.strokeDasharray;
            dst.style.strokeDashoffset = src.style.strokeDashoffset;
        } else {
            // 子要素を持つコンテナ（例: gpu-temp-ring-wrap）は innerHTML を破壊しない
            if (!dst.querySelector('*')) dst.textContent = src.textContent;
            dst.className = src.className;
        }
    });
}

function updateWhisperStatus(data) {
    lastWhisperStatus = data;
    // LLM（AI 校正）状態: whisper_status に同梱（WS 再接続後の初期状態復元用）
    if (data.llm_status) updateSidebarLlmStatus(data.llm_status);
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
    const eq = $('#sidebar-eq');
    const sidebarCard = eq ? eq.closest('.glass-card') : null;

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

    // サイドバー：変換中のみイコライザー＋カード発光（変換以外では非表示）
    if (eq) eq.classList.toggle('hidden', !converting);
    if (sidebarCard) sidebarCard.classList.toggle('sidebar-converting', converting);

    // サイドバー開始/停止ボタン（稼働中:停止表示 / 停止中:開始表示）
    const sbStart = $('#sidebar-btn-start-whisper');
    const sbStop = $('#sidebar-btn-stop-whisper');
    if (sbStart) sbStart.classList.toggle('hidden', running || starting);
    if (sbStop) sbStop.classList.toggle('hidden', !(running || starting));

    const proc = data.process;
    if (data.health && data.health.model) {
        currentModel = data.health.model;
        $('#stat-model').textContent = data.health.model;
        updateGpuModelDisplay(data.health.model);
        const sel = $('#select-model');
        // エイリアス（turbo ⇔ large-v3-turbo）は同一モデルなので選択中を書き換えない。
        // ユーザーがドロップダウンで選んだ直後（切替ボタン未クリック）は上書きしない
        if (sel && !modelSelectionPending && !sameModel(sel.value, data.health.model)) {
            sel.value = data.health.model;
        }
    } else if (!starting) {
        // 完全停止時のみクリア（起動中はモデル情報を維持し、切替後にチラつかせない）
        updateGpuModelDisplay(null);
    }
    if (proc) {
        pid.textContent = proc.pid;
        uptime.textContent = formatDateTime(proc.start_time);
        // 外部起動（ポート検出）は managed=false → 「外部起動」ラベルを維持
        const isManaged = proc.managed !== false;
        managed.textContent = isManaged ? t('whisper.managed') : t('whisper.external');
        managed.className = 'text-xs mt-1 block ' + (isManaged ? 'text-emerald-400' : 'text-amber-400');
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

// ---------------------------------------------------------------------------
// PaddleOCR サービス
// ---------------------------------------------------------------------------
let lastOcrStatus = null;
let ocrResultText = '';
let ocrResultIsMd = false;
let ocrTimer = null;   // OCR 実行中の経過時間表示タイマー
let ocrBusyOverrideUntil = 0;   // 変換完了後、ocr_server の busy ホールド中も「実行中」を維持する猶予（ms）

function updateOcrStatus(data) {
    lastOcrStatus = data;
    const running = data.running;
    const starting = !running && !!data.process;
    const health = data.health || {};
    // OCR 変換実行中（busy）。変換完了直後は busy ホールド（_BUSY_HOLD）で「変換中」が残るため、
    // runOcr 完了時に設定した猶予期間中は busy とみなさず「実行中」を維持する
    const busy = running && !!health.busy && Date.now() > ocrBusyOverrideUntil;
    const dot = $('#sidebar-ocr-dot');
    const status = $('#ocr-status');
    const pid = $('#ocr-pid');
    const uptime = $('#ocr-uptime');
    const engine = $('#ocr-engine');
    const managed = $('#ocr-managed');

    if (busy) {
        if (dot) dot.className = 'w-2 h-2 rounded-full bg-amber-500 status-pulse';
        if (status) { status.textContent = t('ocr.converting'); status.className = 'font-medium text-amber-400'; }
    } else if (running) {
        if (dot) dot.className = 'w-2 h-2 rounded-full bg-emerald-500 status-pulse';
        if (status) { status.textContent = t('status.running'); status.className = 'font-medium text-emerald-400'; }
    } else if (starting) {
        if (dot) dot.className = 'w-2 h-2 rounded-full bg-amber-400 status-pulse';
        if (status) { status.textContent = t('status.starting'); status.className = 'font-medium text-amber-400'; }
    } else {
        if (dot) dot.className = 'w-2 h-2 rounded-full bg-rose-500';
        if (status) { status.textContent = t('status.stopped'); status.className = 'font-medium text-rose-400'; }
    }

    // サイドバー（OCR 状態テキスト + 開始/停止ボタン）
    const sbText = $('#sidebar-ocr-status-text');
    if (sbText) {
        sbText.textContent = busy ? t('ocr.converting') : running ? t('status.running') : starting ? t('status.starting') : t('status.stopped');
        sbText.className = 'text-sm font-medium ' + (busy ? 'text-amber-400' : running ? 'text-emerald-400' : starting ? 'text-amber-400' : 'text-rose-400');
    }
    const sbOcrStart = $('#sidebar-btn-start-ocr');
    const sbOcrStop = $('#sidebar-btn-stop-ocr');
    if (sbOcrStart) sbOcrStart.classList.toggle('hidden', running || starting);
    if (sbOcrStop) sbOcrStop.classList.toggle('hidden', !(running || starting));

    const proc = data.process;
    if (pid) pid.textContent = proc ? proc.pid : '--';
    if (uptime) uptime.textContent = proc ? formatDateTime(proc.start_time) : '--';
    if (engine) {
        const dev = health.device ? ` (${health.device})` : '';
        const ready = health.ocr_ready ? ' ✓' : (running ? ' ⏳' : '');
        engine.textContent = (health.engine || 'paddleocr') + dev + ready;
    }
    if (managed) {
        if (proc) {
            managed.textContent = t('ocr.managed');
            managed.className = 'text-xs mt-1 block text-emerald-400';
        } else if (running) {
            managed.textContent = t('ocr.external');
            managed.className = 'text-xs mt-1 block text-amber-400';
        } else {
            managed.textContent = '';
            managed.className = 'text-xs mt-1 block';
        }
    }

    // サービス制御カード（OCR グループ）にも反映
    const svcStatus = $('#svc-ocr-status');
    if (svcStatus) {
        if (busy) { svcStatus.textContent = t('ocr.converting'); svcStatus.className = 'text-sm font-medium text-amber-400'; }
        else if (running) { svcStatus.textContent = t('status.running'); svcStatus.className = 'text-sm font-medium text-emerald-400'; }
        else if (starting) { svcStatus.textContent = t('status.starting'); svcStatus.className = 'text-sm font-medium text-amber-400'; }
        else { svcStatus.textContent = t('status.stopped'); svcStatus.className = 'text-sm font-medium text-rose-400'; }
    }
    const svcPid = $('#svc-ocr-pid');
    if (svcPid) svcPid.textContent = proc ? proc.pid : '--';
    const svcUptime = $('#svc-ocr-uptime');
    if (svcUptime) svcUptime.textContent = proc ? formatDateTime(proc.start_time) : '--';
    const svcEngine = $('#svc-ocr-engine');
    if (svcEngine) {
        const dev = health.device ? ` (${health.device})` : '';
        const ready = health.ocr_ready ? ' ✓' : (running ? ' ⏳' : '');
        svcEngine.textContent = (health.engine || 'paddleocr') + dev + ready;
    }
    const svcManaged = $('#svc-ocr-managed');
    if (svcManaged) {
        if (proc) { svcManaged.textContent = t('ocr.managed'); svcManaged.className = 'text-xs text-emerald-400'; }
        else if (running) { svcManaged.textContent = t('ocr.external'); svcManaged.className = 'text-xs text-amber-400'; }
        else { svcManaged.textContent = ''; svcManaged.className = 'text-xs'; }
    }

    // GPU モニタ「消費電力下」の OCR モデル行を更新
    renderGpuOcrDisplay();
}

// サイドバー「LLM 活用」: AI 校正（LLM）の実行状態を表示
function updateSidebarLlmStatus(data) {
    const dot = $('#sidebar-llm-dot');
    const text = $('#sidebar-llm-status-text');
    const modelEl = $('#sidebar-llm-model');
    if (!dot || !text) return;
    const processing = !!(data && data.processing);
    const model = (data && data.model) || '';
    if (processing) {
        dot.className = 'w-2 h-2 rounded-full bg-amber-500 status-pulse';
        text.textContent = t('sidebar.llm_processing');
        text.className = 'text-sm font-medium text-amber-400';
    } else {
        dot.className = 'w-2 h-2 rounded-full bg-stone-500';
        text.textContent = t('sidebar.llm_idle');
        text.className = 'text-sm font-medium text-stone-400';
    }
    if (modelEl) {
        modelEl.textContent = model;
        modelEl.title = model;
    }
}

async function loadOcrStatus() {
    try {
        const resp = await apiFetch(`${API_BASE}/ocr/status`);
        if (resp.ok) updateOcrStatus(await resp.json());
    } catch (e) { /* WebSocket 状態が引き継ぐ */ }
}

async function controlOcr(action) {
    try {
        const resp = await apiFetch(`${API_BASE}/ocr/${action}`, { method: 'POST' });
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

// OCR 実行中状態を制御カード/サイドバーへ即時反映する
// active=true: 変換中表示（WS の busy を待たずに即時） / active=false: 実行中へ戻す（busy ホールドを猶予）
function setOcrConverting(active, elapsedSec) {
    const dot = $('#sidebar-ocr-dot');
    const status = $('#ocr-status');
    const sbText = $('#sidebar-ocr-status-text');
    const svc = $('#svc-ocr-status');
    const elEl = $('#ocr-elapsed');
    if (active) {
        ocrBusyOverrideUntil = 0;
        if (dot) dot.className = 'w-2 h-2 rounded-full bg-amber-500 status-pulse';
        if (status) { status.textContent = t('ocr.converting'); status.className = 'font-medium text-amber-400'; }
        if (sbText) { sbText.textContent = t('ocr.converting'); sbText.className = 'text-sm font-medium text-amber-400'; }
        if (svc) { svc.textContent = t('ocr.converting'); svc.className = 'text-sm font-medium text-amber-400'; }
        if (elEl) elEl.textContent = `${elapsedSec || 0}s`;
    } else {
        // 完了/失敗: 経過時間を確定値で表示し、最新の status を再取得（busy ホールド中も実行中表示）
        if (elEl && elapsedSec != null) elEl.textContent = `${elapsedSec}s`;
        ocrBusyOverrideUntil = Date.now() + 4000;
        loadOcrStatus();
    }
}

async function runOcr() {
    const fileInput = $('#ocr-file');
    const status = $('#ocr-exec-status');
    const btn = $('#btn-run-ocr');
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
        showToast(t('ocr.no_file'), 'error');
        return;
    }
    const format = $('#ocr-format') ? $('#ocr-format').value : 'md';
    const aiCorrect = $('#ocr-ai-correct') ? $('#ocr-ai-correct').value : 'off';
    const form = new FormData();
    form.append('file', fileInput.files[0]);
    form.append('lang', $('#select-ocr-lang').value || 'japan');
    form.append('format', format);
    form.append('ai_correct', aiCorrect);

    if (btn) btn.disabled = true;
    if (status) { status.textContent = t('ocr.converting'); status.className = 'text-sm text-amber-400'; }
    const t0 = Date.now();
    if (ocrTimer) clearInterval(ocrTimer);
    // 変換中状態を制御カード/サイドバーへ即時反映し、経過時間を 1 秒毎に更新
    setOcrConverting(true, 0);
    const updateElapsed = () => {
        const el = Math.round((Date.now() - t0) / 1000);
        if (status) status.textContent = `${t('ocr.converting')} ・ ${t('ocr.elapsed')} ${el}s`;
        const elEl = $('#ocr-elapsed');
        if (elEl) elEl.textContent = `${el}s`;
    };
    updateElapsed();
    ocrTimer = setInterval(updateElapsed, 1000);

    try {
        const resp = await apiFetch(`${API_BASE}/ocr/convert`, { method: 'POST', body: form });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.detail || resp.statusText);
        ocrResultText = data.text || '';
        ocrResultIsMd = data.format === 'md';
        renderOcrResult();
        const info = [];
        if (data.pages != null) info.push(`${t('ocr.pages')}: ${data.pages}`);
        if (data.elapsed != null) info.push(`${t('ocr.time')}: ${data.elapsed}s`);
        if (data.speed != null) info.push(`${t('ocr.speed')}: ${data.speed}s/${t('ocr.page_unit')}`);
        if (data.corrected) info.push(t('ocr.corrected'));
        if (status) {
            status.textContent = t('ocr.done') + (info.length ? ' ・ ' + info.join(' / ') : '');
            status.className = 'text-sm text-emerald-400';
        }
        showToast(t('ocr.done'), 'success');
        // 完了: 経過時間を確定し、状態を実行中へ戻す
        setOcrConverting(false, data.elapsed);
        // 変換履歴（records）を更新
        if (typeof handleNewRecord === 'function') handleNewRecord();
    } catch (e) {
        if (status) { status.textContent = t('ocr.error'); status.className = 'text-sm text-rose-400'; }
        showToast(t('ocr.error') + ': ' + e.message, 'error');
        setOcrConverting(false, null);
    } finally {
        if (ocrTimer) { clearInterval(ocrTimer); ocrTimer = null; }
        if (btn) btn.disabled = false;
    }
}

function renderOcrResult() {
    const block = $('#ocr-result-block');
    const pre = $('#ocr-result');
    const mdBtn = $('#btn-download-ocr-md');
    if (!block || !pre) return;
    block.classList.remove('hidden');
    setResultContent(pre, ocrResultText || '--');
    if (mdBtn) mdBtn.classList.toggle('hidden', !ocrResultText);
}

function copyOcrResult() {
    if (!ocrResultText) return;
    copyToClipboard(ocrResultText).then((ok) => {
        showToast(ok ? t('ocr.copied') : t('ocr.copy_failed'), ok ? 'success' : 'error');
    });
}

// 表示中の形式（MD/TXT）でダウンロード
function downloadOcrResult() {
    if (!ocrResultText) return;
    const type = ocrResultIsMd ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8';
    const ext = ocrResultIsMd ? '.md' : '.txt';
    const blob = new Blob([ocrResultText], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocr_result_${Date.now()}${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// OCR 設定（device/lang/autostart）をロードして UI に反映
async function loadOcrSettings() {
    try {
        const resp = await apiFetch(`${API_BASE}/config`);
        if (!resp.ok) return;
        const data = await resp.json();
        config = { ...config, ...data };
        const dev = $('#select-ocr-device');
        if (dev) dev.value = config.ocr_device || 'cuda';
        const svcDev = $('#svc-select-ocr-device');
        if (svcDev) svcDev.value = config.ocr_device || 'cuda';
        const lang = $('#select-ocr-lang');
        if (lang) lang.value = config.ocr_lang || 'japan';
        const svcLang = $('#svc-select-ocr-lang');
        if (svcLang) svcLang.value = config.ocr_lang || 'japan';
        const toggle = $('#toggle-ocr-autostart');
        if (toggle) toggle.checked = (config.ocr_autostart || 'off') === 'on';
        const fmt = $('#ocr-format');
        if (fmt) fmt.value = config.ocr_format || 'md';
        const ai = $('#ocr-ai-correct');
        if (ai) ai.value = config.ocr_ai_correct || 'off';
    } catch (e) { /* ignore */ }
}

// OCR 実行カードの出力形式 / AI校正 を即保存（選択保存）
async function saveOcrRunSettings() {
    const data = {};
    const fmt = $('#ocr-format');
    if (fmt) data.ocr_format = fmt.value;
    const ai = $('#ocr-ai-correct');
    if (ai) data.ocr_ai_correct = ai.value;
    try {
        const resp = await apiFetch(`${API_BASE}/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await resp.json();
        if (result.success) {
            config = { ...config, ...data };
        }
    } catch (e) { /* 保存失敗は静かに無視（次回実行時も値を維持） */ }
}

// OCR 設定の変更を即保存（device/lang は OCR 再起動で反映）
async function saveOcrSettings() {
    const data = {};
    const dev = $('#select-ocr-device');
    if (dev) data.ocr_device = dev.value;
    const lang = $('#select-ocr-lang');
    if (lang) data.ocr_lang = lang.value;
    const toggle = $('#toggle-ocr-autostart');
    if (toggle) data.ocr_autostart = toggle.checked ? 'on' : 'off';
    try {
        const resp = await apiFetch(`${API_BASE}/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await resp.json();
        if (result.success) {
            config = { ...config, ...data };
            showToast(t('settings.saved'), 'success');
        } else {
            showToast(result.error || t('settings.save_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
}

// ---------------------------------------------------------------------------
// TTS サービス（ダッシュボード内蔵・モデルの読込/解放で制御）
// ---------------------------------------------------------------------------
let lastTtsStatus = null;

// TTS の通常表示（モデル読込状態）を制御カードとサイドバーへ描画
function renderTtsStatus(data) {
    const el = $('#svc-tts-status');
    if (el) {
        const engine = (data.engine || 'edge').toUpperCase();
        if (data.loaded) {
            el.textContent = `${engine}${data.active_device ? ' ' + data.active_device : ''}${data.resident ? ' ◉' : ''}`;
            el.className = 'text-sm font-medium text-fuchsia-400';
            el.title = t('tts.status_loaded');
        } else if (engine === 'EDGE') {
            el.textContent = `${engine}（${t('tts.edge_cloud')}）`;
            el.className = 'text-sm font-medium text-stone-400';
            el.title = '';
        } else {
            el.textContent = `${engine}（${t('tts.status_idle')}）`;
            el.className = 'text-sm font-medium text-stone-400';
            el.title = '';
        }
    }
    updateSidebarTtsStatus(data);
}

function updateTtsStatus(data) {
    lastTtsStatus = data;
    renderTtsStatus(data);
    syncTtsSpeakingUi();
}

// 読み上げ中/一時停止中の状態をサイドバー・制御カードへ反映。停止時は通常表示へ戻す
function syncTtsSpeakingUi() {
    const speaking = !!speakBtn && !ttsPaused;
    const paused = !!speakBtn && ttsPaused;
    const dot = $('#sidebar-tts-dot');
    const text = $('#sidebar-tts-status-text');
    const svc = $('#svc-tts-status');
    if (speaking) {
        if (dot) dot.className = 'w-2 h-2 rounded-full bg-amber-500 status-pulse';
        if (text) { text.textContent = t('tts.speaking'); text.className = 'text-sm font-medium text-amber-400'; text.title = ''; }
        if (svc) { svc.textContent = `${t('tts.speaking')}…`; svc.className = 'text-sm font-medium text-amber-400'; svc.title = ''; }
    } else if (paused) {
        if (dot) dot.className = 'w-2 h-2 rounded-full bg-stone-500';
        if (text) { text.textContent = t('tts.paused'); text.className = 'text-sm font-medium text-stone-300'; text.title = ''; }
        if (svc) { svc.textContent = `${t('tts.paused')}…`; svc.className = 'text-sm font-medium text-stone-300'; svc.title = ''; }
    } else if (lastTtsStatus) {
        renderTtsStatus(lastTtsStatus);   // 停止: 通常表示へ戻す
    }
}

// サイドバー「TTS サービス」: モデル読込状態を表示（内蔵サービスのためボタンなし）
function updateSidebarTtsStatus(data) {
    const dot = $('#sidebar-tts-dot');
    const text = $('#sidebar-tts-status-text');
    if (!dot || !text) return;
    data = data || {};
    const engine = (data.engine || 'edge').toUpperCase();
    if (data.loaded) {
        dot.className = 'w-2 h-2 rounded-full bg-fuchsia-400 status-pulse';
        text.textContent = `${engine}${data.active_device ? ' ' + data.active_device : ''}${data.resident ? ' ◉' : ''}`;
        text.className = 'text-sm font-medium text-fuchsia-400';
        text.title = t('tts.status_loaded');
    } else if (engine === 'EDGE') {
        dot.className = 'w-2 h-2 rounded-full bg-stone-500';
        text.textContent = `${engine}（${t('tts.edge_cloud')}）`;
        text.className = 'text-sm font-medium text-stone-400';
        text.title = '';
    } else {
        dot.className = 'w-2 h-2 rounded-full bg-stone-500';
        text.textContent = `${engine}（${t('tts.status_idle')}）`;
        text.className = 'text-sm font-medium text-stone-400';
        text.title = '';
    }
}

async function loadTtsStatus() {
    try {
        const resp = await apiFetch(`${API_BASE}/tts/status`);
        if (resp.ok) updateTtsStatus(await resp.json());
    } catch (e) { /* WebSocket 状態が引き継ぐ */ }
}

async function controlTts(action) {
    try {
        const resp = await apiFetch(`${API_BASE}/tts/${action}`, { method: 'POST' });
        const data = await resp.json();
        if (data.success) {
            const key = action === 'preload' ? 'tts.load' : action === 'unload' ? 'tts.unload' : 'tts.reload';
            showToast(t(key) + ' ✓', 'success');
            loadTtsStatus();
        } else {
            showToast(data.message || t('toast.action_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
}

// 選択中モデルの compute_type 連動 VRAM 目安を返す（GB）
function selectedModelVram() {
    const sel = $('#select-model');
    if (!sel || !sel.selectedIndex) return 0;
    const opt = sel.options[sel.selectedIndex];
    if (!opt) return 0;
    const ct = (config.whisper_compute_type || 'int8_float16').toLowerCase();
    return ct.includes('int8')
        ? (parseFloat(opt.dataset.vramInt8) || 0)
        : (parseFloat(opt.dataset.vramFp16) || 0);
}

// モデルカタログ（DL 状態含む）を保持。選択肢生成と設定画面の管理リストで共用
let modelCatalog = null;
// モデル切替ドロップダウンをユーザーが選択中か（切替未実行）
// updateWhisperStatus が 2 秒毎に現在実行中モデルでドロップダウンを上書きするため、
// ユーザーが選んだ直後の「Small→medium が勝手に small に戻る」事故を防ぐ
let modelSelectionPending = false;

async function fetchModelCatalog() {
    try {
        const resp = await apiFetch(`${API_BASE}/whisper/models`);
        if (!resp.ok) return null;
        const data = await resp.json();
        modelCatalog = data.models || {};
        renderReadmeModels(); // Readme のモデル比較表を反映
        return modelCatalog;
    } catch (e) {
        console.error('Failed to fetch model catalog:', e);
        return null;
    }
}

// モデルカタログから選択肢を生成（DL 済みモデルのみ表示）
async function populateModelSelect() {
    const sel = $('#select-model');
    if (!sel) return;
    const models = await fetchModelCatalog();
    if (!models) return;
    sel.innerHTML = '';
    Object.keys(models).forEach((name) => {
        const info = models[name];
        if (!info.downloaded) return;  // DL 済みのみドロップダウンに表示
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        opt.dataset.vramFp16 = info.vram_fp16;
        opt.dataset.vramInt8 = info.vram_int8;
        opt.dataset.diskGb = info.disk_gb;
        opt.dataset.lang = info.lang;
        opt.dataset.desc = info.desc;
        sel.appendChild(opt);
    });
    // 現在の設定モデルを反映（DL 済みリストに存在する場合のみ）
    if (config.whisper_model && Array.from(sel.options).some(o => o.value === config.whisper_model)) {
        sel.value = config.whisper_model;
    }
    renderModelManageList();
}

// カタログ（DL 状態・サイズ等）からモデルの VRAM 目安を返す（管理リストからの切替用）
function modelVramFromCatalog(name) {
    if (!modelCatalog || !modelCatalog[name]) return 0;
    const info = modelCatalog[name];
    const ct = (config.whisper_compute_type || 'int8_float16').toLowerCase();
    return ct.includes('int8')
        ? (parseFloat(info.vram_int8) || 0)
        : (parseFloat(info.vram_fp16) || 0);
}

// 設定画面「模型管理」カードのモデルリストを描画
function renderModelManageList() {
    const list = $('#model-manage-list');
    if (!list || !modelCatalog) return;
    list.innerHTML = '';
    Object.keys(modelCatalog).forEach((name) => {
        const info = modelCatalog[name];
        const downloading = info.download_state === 'downloading';
        const failed = info.download_state === 'error';

        const row = document.createElement('div');
        row.className = 'p-2 rounded-lg bg-stone-900/50 hover:bg-stone-800 transition-colors duration-150 text-sm';
        const top = document.createElement('div');
        top.className = 'flex items-center justify-between gap-2';

        // 左: モデル名 + DL 容量 + 状態（モデル名の後ろに表示）。マウスオンで保存パス表示
        const left = document.createElement('div');
        left.className = 'flex items-center gap-2 min-w-0 flex-wrap';
        const nameTitle = info.path ? ` title="${escapeHtml(info.path)}"` : '';
        left.innerHTML = `<span class="font-mono text-xs"${nameTitle}>${escapeHtml(name)}</span><span class="text-xs text-stone-500">DL ${info.disk_gb}GB</span>`;

        // 右: ボタン
        const right = document.createElement('div');
        right.className = 'flex items-center gap-2 shrink-0';
        let btn;

        if (downloading) {
            const pct = Math.min(100, Math.max(0, info.download_progress || 0));
            const state = document.createElement('span');
            state.className = 'text-xs text-amber-400';
            state.textContent = `${t('model.downloading')} ${pct}%`;
            left.appendChild(state);
            btn = document.createElement('button');
            btn.disabled = true;
            btn.className = 'px-3 py-1 rounded-lg bg-stone-800 text-stone-400 text-xs';
            btn.textContent = t('model.downloading_short');
            // プログレスバー
            const bar = document.createElement('div');
            bar.className = 'w-full h-1.5 bg-stone-800 rounded-full overflow-hidden mt-1.5';
            const fill = document.createElement('div');
            fill.className = 'h-full bg-amber-500 rounded-full transition-all duration-500';
            fill.style.width = pct + '%';
            bar.appendChild(fill);
            row.appendChild(top);
            row.appendChild(bar);
        } else if (info.downloaded) {
            const state = document.createElement('span');
            state.className = 'text-xs text-emerald-400';
            state.textContent = t('model.downloaded');
            left.appendChild(state);
            btn = document.createElement('button');
            btn.className = 'px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-medium transition-all';
            btn.textContent = t('model.use');
            btn.addEventListener('click', () => switchToModel(name));
            row.appendChild(top);
            // 削除ボタン（使用中モデルは削除不可）
            if (String(config.whisper_model || '').toLowerCase() !== name.toLowerCase()) {
                right.appendChild(makeDeleteBtn(name, deleteWhisperModel));
            }
        } else if (failed) {
            const state = document.createElement('span');
            state.className = 'text-xs text-rose-400';
            state.textContent = t('model.download_failed');
            left.appendChild(state);
            btn = document.createElement('button');
            btn.className = 'px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-medium transition-all';
            btn.textContent = t('model.retry_download');
            btn.addEventListener('click', () => downloadModel(name));
            row.appendChild(top);
        } else {
            const state = document.createElement('span');
            state.className = 'text-xs text-stone-500';
            state.textContent = t('model.not_downloaded');
            left.appendChild(state);
            btn = document.createElement('button');
            btn.className = 'px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-medium transition-all';
            btn.textContent = t('model.download');
            btn.addEventListener('click', () => downloadModel(name));
            row.appendChild(top);
        }

        right.appendChild(btn);
        top.appendChild(left);
        top.appendChild(right);
        list.appendChild(row);
    });
}

// モデルのダウンロードを開始し、進行中は 2 秒ごとに状態をポーリング（Whisper / VibeVoice 共用）
let _pollDownload = null;
function _startDownloadPolling() {
    if (_pollDownload) return;
    _pollDownload = setInterval(async () => {
        let anyDl = false;
        const models = await fetchModelCatalog();
        if (models) {
            renderModelManageList();
            populateModelSelect();  // DL 完了で選択肢に追加
            anyDl = anyDl || Object.values(models).some(m => m.download_state === 'downloading');
        }
        const vv = await fetchVibevoiceModelCatalog();
        if (vv) {
            renderVibevoiceModelList();
            anyDl = anyDl || Object.values(vv).some(m => m.download_state === 'downloading');
        }
        const kk = await fetchKokoroModelInfo();
        if (kk) {
            renderKokoroModelList();
            anyDl = anyDl || kk.download_state === 'downloading';
        }
        const po = await fetchPaddleocrModelCatalog();
        if (po) {
            renderPaddleocrModelList();
            anyDl = anyDl || Object.values(po).some(m => m.download_state === 'downloading');
        }
        if (!anyDl) {
            clearInterval(_pollDownload);
            _pollDownload = null;
        }
    }, 2000);
}

async function downloadModel(name) {
    try {
        const resp = await apiFetch(`${API_BASE}/whisper/models/${encodeURIComponent(name)}/download`, { method: 'POST' });
        const data = await resp.json();
        if (data.success) {
            showToast(t('model.download_start') + ': ' + name, 'success');
            await fetchModelCatalog();
            renderModelManageList();
            _startDownloadPolling();
        } else {
            showToast(data.message || t('toast.action_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
}

// ---------------------------------------------------------------------------
// VibeVoice モデル管理（DL + 選択）
// ---------------------------------------------------------------------------
// カタログ（DL 状態含む）を保持。設定画面の管理リストで描画
let vibevoiceCatalog = null;

async function fetchVibevoiceModelCatalog() {
    try {
        const resp = await apiFetch(`${API_BASE}/vibevoice/models`);
        if (!resp.ok) return null;
        const data = await resp.json();
        vibevoiceCatalog = data.models || {};
        return vibevoiceCatalog;
    } catch (e) {
        console.error('Failed to fetch VibeVoice model catalog:', e);
        return null;
    }
}

// 設定画面「模型管理」カードの VibeVoice モデルリストを描画
function renderVibevoiceModelList() {
    const list = $('#vibevoice-model-list');
    if (!list || !vibevoiceCatalog) return;
    list.innerHTML = '';
    Object.keys(vibevoiceCatalog).forEach((name) => {
        const info = vibevoiceCatalog[name];
        const downloading = info.download_state === 'downloading';
        const failed = info.download_state === 'error';

        const row = document.createElement('div');
        row.className = 'p-2 rounded-lg bg-stone-900/50 hover:bg-stone-800 transition-colors duration-150 text-sm';
        const top = document.createElement('div');
        top.className = 'flex items-center justify-between gap-2';

        const left = document.createElement('div');
        left.className = 'flex items-center gap-2 min-w-0 flex-wrap';
        const nameTitle = info.path ? ` title="${escapeHtml(info.path)}"` : '';
        left.innerHTML = `<span class="font-mono text-xs"${nameTitle}>${escapeHtml(name)}</span><span class="text-xs text-stone-500">DL ${info.disk_gb}GB</span>`;

        const right = document.createElement('div');
        right.className = 'flex items-center gap-2 shrink-0';
        let btn;

        if (downloading) {
            const pct = Math.min(100, Math.max(0, info.download_progress || 0));
            const state = document.createElement('span');
            state.className = 'text-xs text-amber-400';
            state.textContent = `${t('model.downloading')} ${pct}%`;
            left.appendChild(state);
            btn = document.createElement('button');
            btn.disabled = true;
            btn.className = 'px-3 py-1 rounded-lg bg-stone-800 text-stone-400 text-xs';
            btn.textContent = t('model.downloading_short');
            const bar = document.createElement('div');
            bar.className = 'w-full h-1.5 bg-stone-800 rounded-full overflow-hidden mt-1.5';
            const fill = document.createElement('div');
            fill.className = 'h-full bg-amber-500 rounded-full transition-all duration-500';
            fill.style.width = pct + '%';
            bar.appendChild(fill);
            row.appendChild(top);
            row.appendChild(bar);
        } else if (info.downloaded) {
            const state = document.createElement('span');
            state.className = 'text-xs text-emerald-400';
            state.textContent = t('model.downloaded');
            left.appendChild(state);
            btn = document.createElement('button');
            btn.disabled = true;
            btn.className = 'px-3 py-1 rounded-lg bg-stone-800 text-stone-500 text-xs';
            btn.textContent = t('model.use');
            row.appendChild(top);
            // 削除ボタン
            right.appendChild(makeDeleteBtn(name, deleteVibevoiceModel));
        } else if (failed) {
            const state = document.createElement('span');
            state.className = 'text-xs text-rose-400';
            state.textContent = t('model.download_failed');
            left.appendChild(state);
            btn = document.createElement('button');
            btn.className = 'px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-medium transition-all';
            btn.textContent = t('model.retry_download');
            btn.addEventListener('click', () => downloadVibevoiceModel(name));
            row.appendChild(top);
        } else {
            const state = document.createElement('span');
            state.className = 'text-xs text-stone-500';
            state.textContent = t('model.not_downloaded');
            left.appendChild(state);
            btn = document.createElement('button');
            btn.className = 'px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-medium transition-all';
            btn.textContent = t('model.download');
            btn.addEventListener('click', () => downloadVibevoiceModel(name));
            row.appendChild(top);
        }

        right.appendChild(btn);
        top.appendChild(left);
        top.appendChild(right);
        list.appendChild(row);
    });
}

// VibeVoice モデルのダウンロードを開始（既存 Whisper DL 機構を流用）
async function downloadVibevoiceModel(name) {
    try {
        const resp = await apiFetch(`${API_BASE}/vibevoice/models/${encodeURIComponent(name)}/download`, { method: 'POST' });
        const data = await resp.json();
        if (data.success) {
            showToast(t('model.download_start') + ': ' + name, 'success');
            await fetchVibevoiceModelCatalog();
            renderVibevoiceModelList();
            _startDownloadPolling();
        } else {
            showToast(data.message || t('toast.action_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
}

// ---------------------------------------------------------------------------
// モデル削除（Whisper / VibeVoice / Kokoro 共用の削除ボタン）
// ---------------------------------------------------------------------------
function makeDeleteBtn(name, deleteFn) {
    const del = document.createElement('button');
    del.className = 'px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-medium transition-all';
    del.textContent = t('model.delete');
    del.addEventListener('click', async () => {
        if (!window.confirm(`${t('model.delete_confirm')}\n\n${name}`)) return;
        del.disabled = true;
        const ok = await deleteFn(name);
        if (!ok) del.disabled = false;
    });
    return del;
}

async function deleteWhisperModel(name) {
    try {
        const resp = await apiFetch(`${API_BASE}/whisper/models/${encodeURIComponent(name)}`, { method: 'DELETE' });
        const data = await resp.json();
        if (data.success) {
            showToast(t('model.deleted') + ': ' + name, 'success');
            await fetchModelCatalog();
            renderModelManageList();
            populateModelSelect();
            return true;
        }
        showToast(data.message || t('toast.action_failed'), 'error', 8000);
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
    return false;
}

async function deleteVibevoiceModel(name) {
    try {
        const resp = await apiFetch(`${API_BASE}/vibevoice/models/${encodeURIComponent(name)}`, { method: 'DELETE' });
        const data = await resp.json();
        if (data.success) {
            showToast(t('model.deleted') + ': ' + name, 'success');
            await fetchVibevoiceModelCatalog();
            renderVibevoiceModelList();
            return true;
        }
        showToast(data.message || t('toast.action_failed'), 'error', 8000);
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
    return false;
}

async function deleteKokoroModel() {
    try {
        const resp = await apiFetch(`${API_BASE}/kokoro/model`, { method: 'DELETE' });
        const data = await resp.json();
        if (data.success) {
            showToast(t('model.deleted') + ': kokoro', 'success');
            await fetchKokoroModelInfo();
            renderKokoroModelList();
            return true;
        }
        showToast(data.message || t('toast.action_failed'), 'error', 8000);
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
    return false;
}

// ---------------------------------------------------------------------------
// Kokoro モデル管理（DL・状態・削除。オフライン TTS 用）
// ---------------------------------------------------------------------------
let kokoroModel = null;

async function fetchKokoroModelInfo() {
    try {
        const resp = await apiFetch(`${API_BASE}/kokoro/model`);
        if (!resp.ok) return null;
        kokoroModel = await resp.json();
        return kokoroModel;
    } catch (e) {
        console.error('Failed to fetch Kokoro model info:', e);
        return null;
    }
}

function renderKokoroModelList() {
    const list = $('#kokoro-model-list');
    if (!list) return;
    list.innerHTML = '';
    if (!kokoroModel) {
        list.innerHTML = '<div class="p-2 text-xs text-stone-500">--</div>';
        return;
    }
    const info = kokoroModel;
    const downloading = info.download_state === 'downloading';
    const failed = info.download_state === 'error';

    const row = document.createElement('div');
    row.className = 'p-2 rounded-lg bg-stone-900/50 hover:bg-stone-800 transition-colors duration-150 text-sm';
    const top = document.createElement('div');
    top.className = 'flex items-center justify-between gap-2';
    const left = document.createElement('div');
    left.className = 'flex items-center gap-2 min-w-0 flex-wrap';
    const pathTitle = info.path ? ` title="${escapeHtml(info.path)}"` : '';
    const sizeTxt = info.size_mb ? `${info.size_mb}MB` : '';
    left.innerHTML = `<span class="font-mono text-xs"${pathTitle}>kokoro</span><span class="text-xs text-stone-500">${sizeTxt}</span>`;
    const right = document.createElement('div');
    right.className = 'flex items-center gap-2 shrink-0';
    let btn;

    if (downloading) {
        const pct = Math.min(100, Math.max(0, info.download_progress || 0));
        const state = document.createElement('span');
        state.className = 'text-xs text-amber-400';
        state.textContent = `${t('model.downloading')} ${pct}%`;
        left.appendChild(state);
        btn = document.createElement('button');
        btn.disabled = true;
        btn.className = 'px-3 py-1 rounded-lg bg-stone-800 text-stone-400 text-xs';
        btn.textContent = t('model.downloading_short');
        const bar = document.createElement('div');
        bar.className = 'w-full h-1.5 bg-stone-800 rounded-full overflow-hidden mt-1.5';
        const fill = document.createElement('div');
        fill.className = 'h-full bg-amber-500 rounded-full transition-all duration-500';
        fill.style.width = pct + '%';
        bar.appendChild(fill);
        row.appendChild(top);
        row.appendChild(bar);
    } else if (info.downloaded) {
        const state = document.createElement('span');
        state.className = 'text-xs text-emerald-400';
        state.textContent = t('model.downloaded') + (info.voices && info.voices.length ? `・${info.voices.length} ${t('model.voices')}` : '');
        left.appendChild(state);
        row.appendChild(top);
        btn = makeDeleteBtn('kokoro', deleteKokoroModel);
    } else if (failed) {
        const state = document.createElement('span');
        state.className = 'text-xs text-rose-400';
        state.textContent = t('model.download_failed');
        left.appendChild(state);
        row.appendChild(top);
        btn = document.createElement('button');
        btn.className = 'px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-medium transition-all';
        btn.textContent = t('model.retry_download');
        btn.addEventListener('click', () => downloadKokoroModel());
    } else {
        const state = document.createElement('span');
        state.className = 'text-xs text-stone-500';
        state.textContent = t('model.not_downloaded');
        left.appendChild(state);
        row.appendChild(top);
        btn = document.createElement('button');
        btn.className = 'px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-medium transition-all';
        btn.textContent = t('model.download');
        btn.addEventListener('click', () => downloadKokoroModel());
    }

    right.appendChild(btn);
    top.appendChild(left);
    top.appendChild(right);
    list.appendChild(row);
}

async function downloadKokoroModel() {
    try {
        const resp = await apiFetch(`${API_BASE}/kokoro/model/download`, { method: 'POST' });
        const data = await resp.json();
        if (data.success) {
            showToast(t('model.download_start') + ': kokoro', 'success');
            await fetchKokoroModelInfo();
            renderKokoroModelList();
            _startDownloadPolling();
        } else {
            showToast(data.message || t('toast.action_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
}

// ---------------------------------------------------------------------------
// PaddleOCR モデル管理（DL・状態・削除。保存先 models/paddlex、PaddleX と同一レイアウト）
// ---------------------------------------------------------------------------
let paddleocrCatalog = null;
let paddleocrCacheDir = '';

async function fetchPaddleocrModelCatalog() {
    try {
        const resp = await apiFetch(`${API_BASE}/paddleocr/models`);
        if (!resp.ok) return null;
        const data = await resp.json();
        paddleocrCatalog = data.models || {};
        paddleocrCacheDir = data.cache_dir || '';
        return paddleocrCatalog;
    } catch (e) {
        console.error('Failed to fetch PaddleOCR model catalog:', e);
        return null;
    }
}

// 設定画面「模型管理」カードの PaddleOCR モデルリストを描画
function renderPaddleocrModelList() {
    const list = $('#paddleocr-model-list');
    if (!list) return;
    list.innerHTML = '';
    const cache = $('#paddleocr-cache-dir');
    if (cache) cache.textContent = paddleocrCacheDir ? t('model.cache_dir') + ': ' + paddleocrCacheDir : '';
    if (!paddleocrCatalog) {
        list.innerHTML = '<div class="p-2 text-xs text-stone-500">--</div>';
        return;
    }
    Object.keys(paddleocrCatalog).forEach((name) => {
        const info = paddleocrCatalog[name];
        const downloading = info.download_state === 'downloading';
        const failed = info.download_state === 'error';

        const row = document.createElement('div');
        row.className = 'p-2 rounded-lg bg-stone-900/50 hover:bg-stone-800 transition-colors duration-150 text-sm';
        const top = document.createElement('div');
        top.className = 'flex items-center justify-between gap-2';

        const left = document.createElement('div');
        left.className = 'flex items-center gap-2 min-w-0 flex-wrap';
        const nameTitle = info.path ? ` title="${escapeHtml(info.path)}"` : '';
        const sizeTxt = info.disk_gb ? `DL ${info.disk_gb}GB` : '';
        left.innerHTML = `<span class="font-mono text-xs"${nameTitle}>${escapeHtml(name)}</span><span class="text-xs text-stone-500">${sizeTxt}</span>`;

        const right = document.createElement('div');
        right.className = 'flex items-center gap-2 shrink-0';
        let btn;

        if (downloading) {
            const pct = Math.min(100, Math.max(0, info.download_progress || 0));
            const state = document.createElement('span');
            state.className = 'text-xs text-amber-400';
            state.textContent = `${t('model.downloading')} ${pct}%`;
            left.appendChild(state);
            btn = document.createElement('button');
            btn.disabled = true;
            btn.className = 'px-3 py-1 rounded-lg bg-stone-800 text-stone-400 text-xs';
            btn.textContent = t('model.downloading_short');
            const bar = document.createElement('div');
            bar.className = 'w-full h-1.5 bg-stone-800 rounded-full overflow-hidden mt-1.5';
            const fill = document.createElement('div');
            fill.className = 'h-full bg-amber-500 rounded-full transition-all duration-500';
            fill.style.width = pct + '%';
            bar.appendChild(fill);
            row.appendChild(top);
            row.appendChild(bar);
        } else if (info.downloaded) {
            const state = document.createElement('span');
            state.className = 'text-xs text-emerald-400';
            state.textContent = t('model.downloaded');
            left.appendChild(state);
            row.appendChild(top);
            btn = makeDeleteBtn(name, deletePaddleocrModel);
        } else if (failed) {
            const state = document.createElement('span');
            state.className = 'text-xs text-rose-400';
            state.textContent = t('model.download_failed');
            left.appendChild(state);
            btn = document.createElement('button');
            btn.className = 'px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-medium transition-all';
            btn.textContent = t('model.retry_download');
            btn.addEventListener('click', () => downloadPaddleocrModel(name));
            row.appendChild(top);
        } else {
            const state = document.createElement('span');
            state.className = 'text-xs text-stone-500';
            state.textContent = t('model.not_downloaded');
            left.appendChild(state);
            btn = document.createElement('button');
            btn.className = 'px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-medium transition-all';
            btn.textContent = t('model.download');
            btn.addEventListener('click', () => downloadPaddleocrModel(name));
            row.appendChild(top);
        }

        right.appendChild(btn);
        top.appendChild(left);
        top.appendChild(right);
        list.appendChild(row);
    });
}

// PaddleOCR モデルのダウンロードを開始（PaddleX と同じ official_models/<name> へ保存）
async function downloadPaddleocrModel(name) {
    try {
        const resp = await apiFetch(`${API_BASE}/paddleocr/models/${encodeURIComponent(name)}/download`, { method: 'POST' });
        const data = await resp.json();
        if (data.success) {
            showToast(t('model.download_start') + ': ' + name, 'success');
            await fetchPaddleocrModelCatalog();
            renderPaddleocrModelList();
            _startDownloadPolling();
        } else {
            showToast(data.message || t('toast.action_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
}

async function deletePaddleocrModel(name) {
    try {
        const resp = await apiFetch(`${API_BASE}/paddleocr/models/${encodeURIComponent(name)}`, { method: 'DELETE' });
        const data = await resp.json();
        if (data.success) {
            showToast(t('model.deleted') + ': ' + name, 'success');
            await fetchPaddleocrModelCatalog();
            renderPaddleocrModelList();
            return true;
        }
        showToast(data.message || t('toast.action_failed'), 'error', 8000);
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
    return false;
}

// 管理リストの「使用」からモデル切替（ドロップダウン選択を伴う）
async function switchToModel(name) {
    const sel = $('#select-model');
    if (sel) {
        sel.value = name;
    }
    await switchModel(name);
}

async function switchModel(modelName) {
    // click イベント等が渡された場合を弾く（文字列モデル名のみ受け付ける）
    const model = typeof modelName === 'string' && modelName ? modelName : $('#select-model').value;
    if (!model) return;
    // 危険モデルは切替前に確認（未キャッシュなら大容量 DL + VRAM 不足で OOM の恐れ）
    const vram = modelName ? modelVramFromCatalog(modelName) : selectedModelVram();
    if (vram > 5.5 && !window.confirm(t('model.confirm_danger'))) {
        return;
    }
    // 切替中（モデル読込 20〜30秒）は多重実行を防ぐため操作を無効化＋ラベル変更
    const btn = $('#btn-switch-model');
    const btnLabel = btn ? btn.querySelector('[data-i18n]') : null;
    const sel = $('#select-model');
    if (btn) btn.disabled = true;
    if (sel) sel.disabled = true;
    if (btnLabel) { btnLabel.dataset.i18n = 'whisper.switching'; btnLabel.textContent = t('whisper.switching'); }
    try {
        // 選択状態を確定して送信 → 以降は実行中モデルで自動同期してよい
        modelSelectionPending = false;
        showToast(t('whisper.switching') + ': ' + model, 'info', 60000);
        const resp = await apiFetch(`${API_BASE}/whisper/model`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model })
        });
        const data = await resp.json();
        if (data.success) {
            $('#stat-model').textContent = model;
            updateGpuModelDisplay(model); // GPU モニタのモデル情報を即時反映
            showToast(t('whisper.switch_done') + ': ' + model, 'success');
        } else {
            showToast(data.message || t('toast.action_failed'), 'error', 8000);
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    } finally {
        if (btn) btn.disabled = false;
        if (sel) sel.disabled = false;
        if (btnLabel) { btnLabel.dataset.i18n = 'whisper.switch_model'; btnLabel.textContent = t('whisper.switch_model'); }
    }
}

// ---------------------------------------------------------------------------
// 图表
// ---------------------------------------------------------------------------
// 変換（transcribe）/ AI 校正（correct）フェーズをチャート背景帯で色分けするカスタムプラグイン
const phaseBandsPlugin = {
    id: 'phaseBands',
    beforeDatasetsDraw(chart, args, opts) {
        if (!chartPhases || chartPhases.length < 2) return;
        const xScale = chart.scales.x;
        const yScale = chart.scales.y;
        const area = chart.chartArea;
        if (!xScale || !area) return;
        const colors = {
            transcribe: 'rgba(255, 176, 32, 0.10)',
            correct: 'rgba(255, 61, 129, 0.14)',
        };
        const step = Math.max(2, Math.abs(xScale.getPixelForValue(1) - xScale.getPixelForValue(0)));
        const ctx = chart.ctx;
        let i = 0;
        const phases = chartPhases;
        while (i < phases.length) {
            const phase = phases[i];
            if (phase === 'transcribe' || phase === 'correct') {
                let j = i;
                while (j + 1 < phases.length && phases[j + 1] === phase) j++;
                const x0 = xScale.getPixelForValue(i);
                const x1 = xScale.getPixelForValue(j);
                ctx.save();
                ctx.fillStyle = colors[phase];
                ctx.fillRect(x0, area.top, Math.max(1, x1 - x0 + step), area.bottom - area.top);
                ctx.restore();
                i = j + 1;
            } else {
                i++;
            }
        }
    }
};

function initChart() {
    const ctx = $('#main-chart');
    if (!ctx) return;

    Chart.defaults.color = '#a8a29e';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.1)';

    mainChart = new Chart(ctx, {
        type: 'line',
        plugins: [phaseBandsPlugin],
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
                },
                {
                    label: 'GPU Temp °C',
                    data: Array(60).fill(0),
                    borderColor: '#f87171',
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, 'rgba(248, 113, 113, 0.3)');
                        gradient.addColorStop(1, 'rgba(248, 113, 113, 0)');
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
                    labels: { usePointStyle: true, boxWidth: 8, padding: 20 }
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
    mainChart.data.datasets[4].data = (history.gpu_temp || []).slice(start);
    // フェーズ帯描画用：同じウィンドウに揃えてスライス（ラベルと要素数を一致させる）
    chartPhases = (history.phase || []).slice(start);
    mainChart.update('none');
}

// ---------------------------------------------------------------------------
// リアルタイムロギング（JSONL 記録の開始/停止 + ボタン状態）
// ---------------------------------------------------------------------------

// リアルタイム推移カードヘッダー: サンプリング周期（refresh_interval）と
// 波形間隔（trendWindow 表示点数と時間幅）を表示
function updateTrendMeta() {
    const el = $('#trend-meta');
    if (!el) return;
    const ms = parseInt(config.refresh_interval, 10) || 1000;
    const points = trendWindow;
    const secs = Math.round((ms * points) / 1000);
    el.textContent = `${t('realtime.sample_period')} ${ms}ms ・ ${t('realtime.wave_span')} ${points}${t('realtime.point_unit')}(${secs}s)`;
}

async function initRealtimeLogState() {
    try {
        const resp = await fetch(`${API_BASE}/realtime-log`);
        if (!resp.ok) return;
        const data = await resp.json();
        realtimeLogActive = !!(data && data.active);
        realtimeLogAuto = !!(data && data.active && data.active.auto);
    } catch (e) {
        console.error('Failed to load realtime-log state:', e);
    }
    // 自動開始トグルの状態を config から反映
    try {
        const c = await (await fetch(`${API_BASE}/config`)).json();
        config = { ...config, ...c };
    } catch (e) { /* config は loadSettings 側でも取得される */ }
    applyRtlAutoToggle();
    refreshRealtimeLogBtn();
    updateTrendMeta();
}

// 自動記録トグル（rtl_auto_start）の表示反映
function applyRtlAutoToggle() {
    const toggle = $('#toggle-rtl-auto');
    if (toggle) toggle.checked = (config.rtl_auto_start || 'off') === 'on';
}

// 自動記録トグル切替: サービス/LLM の稼働に連動して自動で記録開始/終了
async function toggleRtlAuto() {
    const toggle = $('#toggle-rtl-auto');
    if (!toggle) return;
    const enabled = toggle.checked;
    try {
        const resp = await apiFetch(`${API_BASE}/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rtl_auto_start: enabled ? 'on' : 'off' })
        });
        const data = await resp.json();
        if (data.success) {
            config.rtl_auto_start = enabled ? 'on' : 'off';
            // 手動で OFF にしたら自動開始セッションは終了する（仕様）
            if (!enabled && realtimeLogActive && realtimeLogAuto) {
                realtimeLogAuto = false;
                await stopRealtimeLog();
            }
            showToast(enabled ? t('realtime.auto_start_on') : t('realtime.auto_start_off'), 'success');
        } else {
            applyRtlAutoToggle();  // 失敗時は元の状態へ
            showToast(data.error || t('toast.action_failed'), 'error');
        }
    } catch (e) {
        applyRtlAutoToggle();
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
}

function refreshRealtimeLogBtn() {
    const btn = $('#btn-realtime-log');
    if (!btn) return;
    btn.classList.toggle('recording-active', realtimeLogActive);
    const dot = btn.querySelector('.rec-dot');
    if (dot) dot.classList.toggle('rec-dot-active', realtimeLogActive);
    const label = btn.querySelector('[data-i18n]');
    if (label) label.textContent = t(realtimeLogActive ? 'realtime.log_stop' : 'realtime.log_start');
    btn.title = t(realtimeLogActive ? 'realtime.log_recording_tip' : '');
}

async function startRealtimeLog() {
    try {
        const resp = await apiFetch(`${API_BASE}/realtime-log/start`, { method: 'POST' });
        if (!resp.ok) {
            const body = await resp.json().catch(() => ({}));
            console.error('realtime-log start failed:', resp.status, body);
            return false;
        }
        realtimeLogActive = true;
        realtimeLogAuto = false;
        refreshRealtimeLogBtn();
        return true;
    } catch (e) { console.error(e); return false; }
}

async function stopRealtimeLog() {
    try {
        const resp = await apiFetch(`${API_BASE}/realtime-log/stop`, { method: 'POST' });
        if (!resp.ok) {
            const body = await resp.json().catch(() => ({}));
            console.error('realtime-log stop failed:', resp.status, body);
            return false;
        }
        realtimeLogActive = false;
        realtimeLogAuto = false;
        refreshRealtimeLogBtn();
        // 記録停止時：ログ履歴セクションが開いていれば一覧を再読み込み
        const section = document.querySelector('.nav-link.active');
        if (section && section.dataset.section === 'logging') loadRealtimeLogs();
        return true;
    } catch (e) { console.error(e); return false; }
}

async function toggleRealtimeLog() {
    if (realtimeLogActive) {
        await stopRealtimeLog();
    } else {
        await startRealtimeLog();
    }
}

// ---------------------------------------------------------------------------
// ログ履歴セクション（JSONL 一覧・閲覧・ダウンロード・コピー・削除）
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// リアルタイムロギング（JSONL 記録の一覧・閲覧・DL・削除）
// ---------------------------------------------------------------------------

// グラフ表示するモニタ定義（色はメイン推移チャートと同一）
const RTLOG_MONITORS = [
    { key: 'cpu',      label: 'CPU %',       color: '#ffb020', field: 'cpu_percent' },
    { key: 'memory',   label: 'Memory %',    color: '#ff3d81', field: 'memory_percent' },
    { key: 'gpu_util', label: 'GPU Util %',  color: '#22d3ee', field: 'gpu_util' },
    { key: 'gpu_mem',  label: 'GPU VRAM %',  color: '#c084fc', field: 'gpu_mem_percent' },
    { key: 'gpu_temp', label: 'GPU Temp °C', color: '#f87171', field: 'gpu_temp' },
];
const RTLOG_DASHES = [[], [6, 4], [2, 4], [8, 2, 2, 2]];  // 重ね合わせ時にログを区別する線種

let rtlogSelected = [];          // 選択中ログのファイル名（複数可）
let lastRtlogFiles = [];         // 現在一覧に表示中のファイル名（全選択チェック用）
let rtlogDataCache = {};         // ファイル名 -> {samples, meta, raw}
let rtlogView = 'graph';         // 表示モード: 'graph' | 'data'
let rtlogFormat = 'jsonl';       // 実データ形式: 'jsonl' | 'csv'
let rtlogMonitors = new Set(RTLOG_MONITORS.map(m => m.key));  // グラフ表示中のモニタ
let rtlogChart = null;           // ログ履歴グラフ（Chart.js）

function fmtBytes(bytes) {
    if (!bytes && bytes !== 0) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

async function loadRealtimeLogs() {
    const listEl = $('#rtlog-list');
    if (!listEl) return;
    try {
        const resp = await fetch(`${API_BASE}/realtime-log`);
        const data = await resp.json();
        // 一覧から消えた選択中ログを整理
        const files = (data && data.files) || [];
        rtlogSelected = rtlogSelected.filter(n => files.some(f => f.name === n));
        renderRealtimeLogList(data || { files: [], active: null });
        renderRtlogPanel();
    } catch (e) {
        console.error('Failed to load realtime logs:', e);
        listEl.innerHTML = `<div class="text-sm text-rose-400">${t('logging.empty')}</div>`;
    }
}

function renderRealtimeLogList(data) {
    const listEl = $('#rtlog-list');
    if (!listEl) return;
    const files = data.files || [];
    lastRtlogFiles = files.map(f => f.name);
    if (!files.length) {
        listEl.innerHTML = `<div class="text-sm text-stone-500">${t('logging.empty')}</div>`;
        return;
    }
    listEl.innerHTML = files.map(f => {
        const active = data.active && data.active.filename === f.name;
        const isSel = rtlogSelected.includes(f.name);
        const cls = isSel ? 'bg-amber-500/15 border-amber-500/40' : 'border-white/10 hover:border-amber-500/30';
        const samples = f.samples != null ? fmtNum(f.samples) : '-';
        return `
        <div class="rtlog-item rounded-xl border ${cls} bg-stone-900/40 px-3 py-2.5 cursor-pointer transition-all" data-name="${escapeHtml(f.name)}">
            <div class="flex items-start gap-2">
                <input type="checkbox" class="rtlog-check mt-0.5 shrink-0 accent-amber-500" ${isSel ? 'checked' : ''}>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                        <span class="font-mono text-xs text-amber-300 truncate">${escapeHtml(f.name)}</span>
                        ${active ? `<span class="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300">${t('logging.active_badge')}</span>` : ''}
                    </div>
                    <div class="mt-1 flex items-center gap-3 text-[11px] text-stone-400">
                        <span>${t('logging.samples')}: ${samples}</span>
                        ${f.duration_sec != null ? `<span>${t('logging.duration')}: ${f.duration_sec}s</span>` : ''}
                        ${f.avg_cpu != null ? `<span>CPU ${f.avg_cpu}%</span>` : ''}
                        ${f.avg_gpu_util != null ? `<span>GPU ${f.avg_gpu_util}%</span>` : ''}
                    </div>
                    <div class="mt-0.5 flex items-center gap-3 text-[11px] text-stone-500">
                        <span>${f.started_at ? String(f.started_at).replace('T', ' ') : ''}</span>
                        <span>${fmtBytes(f.size)}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
    // クリックで選択/解除（トグル）→ 複数選択で波形重ね合わせ。チェックボックスはクリックを止めて change でトグル
    listEl.querySelectorAll('.rtlog-item').forEach(el => {
        const cb = el.querySelector('.rtlog-check');
        if (cb) {
            cb.addEventListener('click', e => e.stopPropagation());
            cb.addEventListener('change', () => toggleRtlogSelect(el.dataset.name));
        }
        el.addEventListener('click', () => toggleRtlogSelect(el.dataset.name));
    });
    updateRtlogSelectedCount();
}

function renderRealtimeLogSummary(meta) {
    const sum = $('#rtlog-summary');
    if (!sum) return;
    if (!meta) { sum.innerHTML = ''; return; }
    const items = [];
    if (meta.whisper_model) items.push([t('live.model'), meta.whisper_model]);
    if (meta.samples != null) items.push([t('logging.samples'), fmtNum(meta.samples)]);
    if (meta.duration_sec != null) items.push([t('logging.duration'), meta.duration_sec + 's']);
    if (meta.avg_cpu != null) items.push([t('logging.avg_cpu'), meta.avg_cpu + '%']);
    if (meta.avg_gpu_util != null) items.push([t('logging.avg_gpu'), meta.avg_gpu_util + '%']);
    if (meta.avg_gpu_temp != null) items.push([t('logging.avg_temp'), meta.avg_gpu_temp + '°C']);
    sum.innerHTML = items.map(([k, v]) =>
        `<span class="inline-flex items-center gap-1.5 mr-3 mb-1 text-[11px] text-stone-300 bg-stone-900/50 rounded-lg px-2.5 py-1 border border-white/10"><span class="text-stone-500">${k}</span><span class="font-semibold">${escapeHtml(String(v))}</span></span>`
    ).join('');
}

// 選択中ログの JSONL を取得・パースしキャッシュ（samples / meta / raw）
async function getRtlogData(name) {
    if (rtlogDataCache[name]) return rtlogDataCache[name];
    const resp = await fetch(`${API_BASE}/realtime-log/${encodeURIComponent(name)}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const raw = await resp.text();
    const samples = [];
    const meta = { name };
    for (const line of raw.split('\n')) {
        const s = line.trim();
        if (!s) continue;
        try {
            const obj = JSON.parse(s);
            if (obj && obj.type === 'sample') {
                samples.push(obj);
            } else if (obj && obj.type === 'meta') {
                if (obj.event === 'session_start') {
                    meta.started_at = obj.ts;
                    if (obj.whisper_model) meta.whisper_model = obj.whisper_model;
                } else if (obj.event === 'session_end') {
                    for (const k of ['samples', 'duration_sec', 'avg_cpu', 'avg_gpu_util', 'avg_gpu_mem', 'avg_gpu_temp']) {
                        if (obj[k] != null) meta[k] = obj[k];
                    }
                    if (obj.stop_reason) meta.stop_reason = obj.stop_reason;
                }
            }
        } catch (e) { /* 破損行は無視 */ }
    }
    const data = { samples, meta, raw };
    rtlogDataCache[name] = data;
    return data;
}

function toggleRtlogSelect(name) {
    const idx = rtlogSelected.indexOf(name);
    if (idx === -1) rtlogSelected.push(name);
    else rtlogSelected.splice(idx, 1);
    // 一覧の選択状態を更新（行ハイライト + チェックボックス）
    document.querySelectorAll('#rtlog-list .rtlog-item').forEach(el => {
        const sel = rtlogSelected.includes(el.dataset.name);
        el.classList.toggle('bg-amber-500/15', sel);
        el.classList.toggle('border-amber-500/40', sel);
        const cb = el.querySelector('.rtlog-check');
        if (cb) cb.checked = sel;
    });
    renderRtlogPanel();
    updateRtlogSelectedCount();
}

function clearRtlogSelect() {
    rtlogSelected = [];
    document.querySelectorAll('#rtlog-list .rtlog-item').forEach(el => {
        el.classList.remove('bg-amber-500/15', 'border-amber-500/40');
        const cb = el.querySelector('.rtlog-check');
        if (cb) cb.checked = false;
    });
    renderRtlogPanel();
    updateRtlogSelectedCount();
}

// ヘッダーの「すべて選択」チェックボックス（現在表示中のログを一括選択/解除）
window.toggleSelectAllRtlogs = function(cb) {
    const files = lastRtlogFiles || [];
    if (cb.checked) {
        rtlogSelected = [...new Set([...rtlogSelected, ...files])];
    } else {
        rtlogSelected = rtlogSelected.filter(n => !files.includes(n));
    }
    document.querySelectorAll('#rtlog-list .rtlog-item').forEach(el => {
        const sel = rtlogSelected.includes(el.dataset.name);
        el.classList.toggle('bg-amber-500/15', sel);
        el.classList.toggle('border-amber-500/40', sel);
        const c = el.querySelector('.rtlog-check');
        if (c) c.checked = sel;
    });
    renderRtlogPanel();
    updateRtlogSelectedCount();
};

// 選択数に応じて一括削除ボタンの表示/非表示と全選択チェックボックス状態を更新
function updateRtlogSelectedCount() {
    const count = rtlogSelected.length;
    const btn = $('#btn-delete-selected-logs');
    const cnt = $('#rtlog-selected-count');
    if (btn) btn.classList.toggle('hidden', count === 0);
    if (cnt) cnt.textContent = count;
    const selAll = $('#rtlog-select-all');
    if (selAll) {
        const files = lastRtlogFiles || [];
        const onPage = files.filter(n => rtlogSelected.includes(n)).length;
        selAll.checked = onPage > 0 && onPage === files.length;
        selAll.indeterminate = onPage > 0 && onPage < files.length;
    }
}

// 選択中のログを一括削除
window.deleteSelectedRealtimeLogs = async function() {
    const files = [...rtlogSelected];
    if (!files.length) return;
    if (!window.confirm(t('logging.delete_selected_confirm').replace('{n}', files.length))) return;
    try {
        const resp = await apiFetch(`${API_BASE}/realtime-log/batch-delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ files })
        });
        const data = await resp.json();
        if (resp.ok && data.success) {
            const gone = data.deleted || [];
            rtlogSelected = rtlogSelected.filter(n => !gone.includes(n));
            gone.forEach(n => delete rtlogDataCache[n]);
            renderRtlogPanel();
            loadRealtimeLogs();
            updateRtlogSelectedCount();
            showToast(t('logging.batch_deleted').replace('{n}', gone.length), 'success');
        } else {
            showToast(t('toast.action_failed'), 'error');
        }
    } catch (e) {
        console.error('Failed to batch delete logs:', e);
        showToast('Error: ' + e.message, 'error');
    }
};

// 選択数に応じて右パネル全体を描画（タブ・ボタン・要約・モニタ行・コンテンツ）
function renderRtlogPanel() {
    const title = $('#rtlog-detail-title');
    const actions = $('#rtlog-detail-actions');
    const clearBtn = $('#btn-clear-rtlog-select');
    const viewTabs = $('#rtlog-view-tabs');
    const fmtTabs = $('#rtlog-format-tabs');
    const monitorRow = $('#rtlog-monitor-toggle');
    const graphWrap = $('#rtlog-graph-wrap');
    const content = $('#rtlog-content');
    const copyBtn = $('#btn-copy-log');
    const deleteBtn = $('#btn-delete-log');

    if (clearBtn) clearBtn.classList.toggle('hidden', rtlogSelected.length === 0);
    updateRtlogSelectedCount();

    if (rtlogSelected.length === 0) {
        if (title) title.textContent = t('logging.select_hint');
        if (actions) actions.classList.add('hidden');
        if (monitorRow) monitorRow.classList.add('hidden');
        if (viewTabs) viewTabs.classList.add('hidden');
        if (fmtTabs) fmtTabs.classList.add('hidden');
        if (graphWrap) graphWrap.classList.add('hidden');
        if (content) { content.classList.add('hidden'); content.textContent = ''; }
        renderRealtimeLogSummary(null);
        clearRtlogChart();
        return;
    }

    if (actions) actions.classList.remove('hidden');
    const single = rtlogSelected.length === 1;
    // 実データタブ・コピー・削除は単一選択時のみ
    if (viewTabs) viewTabs.classList.toggle('hidden', !single);
    if (fmtTabs) fmtTabs.classList.toggle('hidden', !(single && rtlogView === 'data'));
    if (copyBtn) copyBtn.classList.toggle('hidden', !single);
    if (deleteBtn) deleteBtn.classList.toggle('hidden', !single);

    if (title) {
        title.textContent = single
            ? rtlogSelected[0]
            : t('logging.sel_count').replace('{n}', String(rtlogSelected.length));
    }

    // 要約（単一: メタ情報 / 複数: 選択中ファイル名）
    if (single) {
        const d = rtlogDataCache[rtlogSelected[0]];
        renderRealtimeLogSummary(d ? d.meta : { name: rtlogSelected[0] });
    } else {
        const sum = $('#rtlog-summary');
        if (sum) {
            sum.innerHTML = rtlogSelected.map(n =>
                `<span class="inline-flex items-center gap-1.5 mr-3 mb-1 text-[11px] text-amber-300 bg-stone-900/50 rounded-lg px-2.5 py-1 border border-white/10 font-mono">${escapeHtml(n)}</span>`
            ).join('');
        }
    }

    // モニタ ON/OFF 行（グラフ用）
    if (monitorRow) monitorRow.classList.remove('hidden');
    renderRtlogMonitorToggles();

    applyRtlogViewTabs();

    // コンテンツ: 単一+実データ → データ表示 / それ以外 → グラフ
    if (single && rtlogView === 'data') {
        if (graphWrap) graphWrap.classList.add('hidden');
        if (content) content.classList.remove('hidden');
        clearRtlogChart();
        renderRtlogData();
    } else {
        if (content) { content.classList.add('hidden'); content.textContent = ''; }
        if (graphWrap) graphWrap.classList.remove('hidden');
        if (rtlogChart) rtlogChart.resize();
        buildRtlogChart();
    }
}

function renderRtlogMonitorToggles() {
    const wrap = $('#rtlog-monitor-chips');
    if (!wrap) return;
    wrap.innerHTML = RTLOG_MONITORS.map(m => {
        const checked = rtlogMonitors.has(m.key) ? 'checked' : '';
        return `<label class="inline-flex items-center gap-1.5 text-[11px] text-stone-300 bg-stone-900/50 rounded-lg px-2.5 py-1 border border-white/10 cursor-pointer select-none">
            <input type="checkbox" data-monitor="${m.key}" ${checked} class="accent-amber-500">
            <span class="w-2 h-2 rounded-full inline-block" style="background:${m.color}"></span>
            ${escapeHtml(m.label)}
        </label>`;
    }).join('');
    wrap.querySelectorAll('input[data-monitor]').forEach(inp => {
        inp.addEventListener('change', () => {
            if (inp.checked) rtlogMonitors.add(inp.dataset.monitor);
            else rtlogMonitors.delete(inp.dataset.monitor);
            buildRtlogChart();
        });
    });
}

// グラフ/実データタブ・JSONL/CSVタブの活性表示
function applyRtlogViewTabs() {
    document.querySelectorAll('#rtlog-view-tabs .rtlog-tab').forEach(b => {
        const on = b.dataset.rtview === rtlogView;
        b.classList.toggle('bg-amber-500/25', on);
        b.classList.toggle('text-amber-300', on);
        b.classList.toggle('text-stone-400', !on);
    });
    const fmtTabs = $('#rtlog-format-tabs');
    if (fmtTabs) fmtTabs.classList.toggle('hidden', !(rtlogSelected.length === 1 && rtlogView === 'data'));
    document.querySelectorAll('#rtlog-format-tabs .rtlog-tab').forEach(b => {
        const on = b.dataset.rtfmt === rtlogFormat;
        b.classList.toggle('bg-amber-500/25', on);
        b.classList.toggle('text-amber-300', on);
        b.classList.toggle('text-stone-400', !on);
    });
}

function clearRtlogChart() {
    if (rtlogChart) {
        rtlogChart.destroy();
        rtlogChart = null;
    }
}

// 選択中ログの波形を重ね合わせたグラフを描画（x軸は開始からの経過秒）
async function buildRtlogChart() {
    const canvas = $('#rtlog-chart');
    if (!canvas || !rtlogSelected.length) { clearRtlogChart(); return; }
    try {
        const datas = await Promise.all(rtlogSelected.map(n => getRtlogData(n).catch(() => null)));
        const datasets = [];
        rtlogSelected.forEach((name, li) => {
            const d = datas[li];
            if (!d) return;
            const dash = RTLOG_DASHES[li % RTLOG_DASHES.length];
            const t0 = d.samples.length ? Date.parse(d.samples[0].ts) : 0;
            RTLOG_MONITORS.forEach(m => {
                if (!rtlogMonitors.has(m.key)) return;
                datasets.push({
                    label: `${m.label} [${name}]`,
                    data: d.samples.map(s => {
                        const v = s[m.field];
                        return {
                            x: Math.round((Date.parse(s.ts) - t0) / 1000),
                            y: (v === undefined || v === null) ? null : Math.round(v * 10) / 10,
                        };
                    }),
                    borderColor: m.color,
                    borderDash: dash,
                    backgroundColor: 'rgba(0,0,0,0)',
                    pointRadius: 0,
                    borderWidth: 1.5,
                    tension: 0.3,
                });
            });
        });
        if (!datasets.length) { clearRtlogChart(); return; }

        if (!rtlogChart) {
            rtlogChart = new Chart(canvas, {
                type: 'line',
                data: { datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 0 },
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8, padding: 20 } },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#f8fafc',
                            bodyColor: '#cbd5e1',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1,
                            callbacks: {
                                title: items => (items.length && items[0].parsed) ? `${items[0].parsed.x}s` : '',
                            },
                        },
                    },
                    scales: {
                        x: {
                            type: 'linear',
                            beginAtZero: true,
                            title: { display: true, text: 's', color: '#78716c', font: { size: 10 } },
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#a8a29e', maxTicksLimit: 12 },
                        },
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#a8a29e' },
                        },
                    },
                },
            });
        } else {
            rtlogChart.data.datasets = datasets;
            rtlogChart.update('none');
        }
    } catch (e) {
        console.error('Failed to build rtlog chart:', e);
    }
}

// 実データ表示（JSONL または CSV）
function renderRtlogData() {
    const content = $('#rtlog-content');
    if (!content || rtlogSelected.length !== 1) return;
    const d = rtlogDataCache[rtlogSelected[0]];
    if (!d) return;
    content.textContent = rtlogFormat === 'csv' ? toCsv(d.samples) : d.raw;
}

// samples を CSV 文字列へ（エスケープ込み）
function toCsv(samples) {
    const cols = ['ts', 'elapsed_sec', 'cpu_percent', 'memory_percent', 'gpu_util', 'gpu_mem_percent', 'gpu_temp', 'phase', 'progress', 'whisper_model', 'converting'];
    const esc = v => {
        if (v === undefined || v === null) return '';
        const s = String(v);
        return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const t0 = samples.length ? Date.parse(samples[0].ts) : 0;
    const lines = [cols.join(',')];
    for (const s of samples) {
        const elapsed = t0 ? Math.round((Date.parse(s.ts) - t0) / 1000) : '';
        lines.push(cols.map(c => c === 'elapsed_sec' ? esc(elapsed) : esc(s[c])).join(','));
    }
    return lines.join('\n');
}

// 表示中の形式（JSONL/CSV）でダウンロード（単一選択時のみ）
function downloadRealtimeLog() {
    if (rtlogSelected.length !== 1) return;
    const name = rtlogSelected[0];
    const d = rtlogDataCache[name];
    if (!d) return;
    const isCsv = rtlogFormat === 'csv';
    const blob = new Blob(
        [isCsv ? toCsv(d.samples) : d.raw],
        { type: isCsv ? 'text/csv;charset=utf-8' : 'application/x-ndjson;charset=utf-8' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = isCsv ? name.replace(/\.jsonl$/i, '.csv') : name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

// クリップボードへ安全にコピー。navigator.clipboard が存在しない環境（非セキュアコンテキスト等）では
// writeText 呼び出し自体が同期 TypeError を投げ .catch() に到達しないため、事前に存在確認して
// textarea + execCommand 方式へフォールバックする。成功/失敗を Promise<boolean> で返す。
function copyToClipboard(text) {
    return new Promise((resolve) => {
        const fallback = () => {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.top = '-9999px';
            ta.style.left = '0';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
            document.body.removeChild(ta);
            resolve(!!ok);
        };
        if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => resolve(true)).catch(fallback);
        } else {
            fallback();
        }
    });
}

function copyRealtimeLog() {
    if (rtlogSelected.length !== 1) return;
    const d = rtlogDataCache[rtlogSelected[0]];
    if (!d) return;
    copyToClipboard(d.raw).then((ok) => {
        showToast(ok ? t('logging.copied') : t('logging.copy_failed'), ok ? 'success' : 'error');
    });
}

async function deleteRealtimeLog() {
    if (rtlogSelected.length !== 1) return;
    const name = rtlogSelected[0];
    if (!window.confirm(t('logging.delete_confirm') + '\n' + name)) return;
    try {
        const resp = await apiFetch(`${API_BASE}/realtime-log/${encodeURIComponent(name)}`, { method: 'DELETE' });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        rtlogSelected = rtlogSelected.filter(n => n !== name);
        delete rtlogDataCache[name];
        renderRtlogPanel();
        loadRealtimeLogs();
        showToast(t('logging.deleted'), 'success');
    } catch (e) {
        console.error('Failed to delete log:', e);
        showToast('Error: ' + e.message, 'error');
    }
}

// ---------------------------------------------------------------------------
// Readme（サイドバー「Readme」表示内容）
// ---------------------------------------------------------------------------
const APP_VERSION = '1.8.12';

// モデル別 60分音声ベンチマーク目安（GTX 1660 Ti 6GB・int8_float16・beam=3）
const MODEL_BENCH = {
    "tiny":             { speed: '約2分',  wer: '約2.4' },
    "tiny.en":          { speed: '約2分',  wer: '約2.2' },
    "base":             { speed: '約3分',  wer: '約2.0' },
    "base.en":          { speed: '約3分',  wer: '約1.8' },
    "small":            { speed: '約5分',  wer: '約1.5' },
    "small.en":         { speed: '約5分',  wer: '約1.4' },
    "distil-small.en":  { speed: '約4分',  wer: '約1.6' },
    "medium":           { speed: '約10分', wer: '約1.2' },
    "medium.en":        { speed: '約10分', wer: '約1.1' },
    "distil-medium.en": { speed: '約7分',  wer: '約1.2' },
    "large-v1":         { speed: '約24分', wer: '約1.1' },
    "large-v2":         { speed: '約22分', wer: '約1.0' },
    "large-v3":         { speed: '約22分', wer: '1.00' },
    "large":            { speed: '約22分', wer: '1.00' },
    "distil-large-v2":  { speed: '約15分', wer: '約1.1' },
    "distil-large-v3":  { speed: '約15分', wer: '約1.05' },
    "large-v3-turbo":   { speed: '約8分',  wer: '約1.15' },
    "turbo":            { speed: '約8分',  wer: '約1.15' },
};

const README_CONTENT = {
    zh: {
        overview_title: '功能概要',
        overview: [
            '本地语音转写（faster-whisper + CTranslate2，GPU 加速）',
            '实时监控（CPU / GPU / 内存使用率，转写中动画与实时进度）',
            'AI 校对（LLM: Deepseek / MiniMax / Ollama / 自定义 OpenAI 兼容端点）',
            '转写履历管理（搜索、再校对、SRT 输出）',
            '实时日志查看',
            'Whisper 模型管理（下载、切换、删除、保存位置指定、VRAM 警告）',
            'PaddleOCR 模型管理（下载・删除・进度。保存于项目内 models/paddlex，图像 OCR / PDF→Markdown）',
            '聊天 API（OpenAI 兼容 SSE 流式 + 逐句实时语音输出）',
            '多语言界面（中文 / 日本語 / English）',
            '连接令牌认证（写入・控制操作，本地回环免除）',
            'Windows 开机自启动',
            '朗读（Edge TTS 女声）：暂停/继续・当前句下划线・双击正文从指定位置播放',
            '实时记录（JSONL 保存・记录日志查看・AI 可解析）',
            '转换/AI 校对阶段色带 + GPU 温度图表',
        ],
        arch_title: '系统构成',
        arch_desc: '在 LAN 内 PC（例: 192.168.0.88）上运行以下服务。出外访问时经 NAS（QNAP）的 VPN（Tailscale / WireGuard）连接。',
        arch: [
            ['MyWhisperServer Dashboard', 'FastAPI + WebSocket + SQLite（:9001）— 设置・监控・履历・Readme 界面'],
            ['Whisper Server', 'faster-whisper（:9000）— GPU 推理，转写后执行 AI 校对'],
            ['PaddleOCR Server', 'PaddleOCR（:9100）— 图像 OCR / PDF→Markdown。模型保存在 models/paddlex，可在设置中管理'],
            ['LLM 校对引擎', 'Deepseek API / MiniMax API / Ollama 等 OpenAI 兼容端点'],
            ['模型保存位置', 'models/（HuggingFace 缓存格式）— 可在设置中变更'],
            ['数据库', 'dashboard/data/records.db — 转写履历・设置・LLM 配置文件'],
            ['前端', '纯静态 HTML + Tailwind + Chart.js（无外部 CDN）'],
        ],
        bench_title: 'Whisper 模型比较（以 60 分钟语音为基准）',
        bench_note: 'GTX 1660 Ti 6GB・int8_float16・beam=3 下的近似值。实际耗时随语音内容・语言・GPU 负载而异。精度为相对 large-v3（1.00）的 WER 比，数值越小越准确。',
        th_model: '模型', th_lang: '语言', th_speed: '转换时间（60分）', th_acc: '精度（相对）', th_feat: '特点',
        version_title: '版本信息',
        current_version: '当前版本',
        changelog_title: '功能追加履历',
        changelog: [
            {
                ver: 'v1.8.12', date: '2026-08-31',
                items: [
                    'OCR: PaddleOCR 服务 /pdf 响应新增图版图像（base64）输出。Obsidian 插件将其保存到 {name}_assets 并自动改写 markdown 引用（对应插件 v0.4.2）',
                ],
            },
            {
                ver: 'v1.8.11', date: '2026-08-23',
                items: [
                    '模型: 设置页「模型管理」新增 PaddleOCR 模型管理（下载/删除/进度）。PaddleOCR 模型保存到项目内 models/paddlex，随项目整体迁移',
                ],
            },
            {
                ver: 'v1.8.10', date: '2026-08-23',
                items: [
                    '履历: 删除按钮改为「批量删除」（选择行后删除），移除全删除按钮。日志履历也支持多选与批量删除',
                ],
            },
            {
                ver: 'v1.8.9', date: '2026-08-23',
                items: [
                    '履历: 转换履历支持多选（行复选框＋全选）与批量删除。外部启动的 Whisper 服务也会显示进程 ID 与启动时间',
                ],
            },
            {
                ver: 'v1.8.8', date: '2026-08-23',
                items: [
                    '界面: 侧边栏的 TTS 服务显示朗读中/暂停状态。OCR 运行时，控制卡片立即显示「转换中」，并显示进程 ID 与经时时间（外部启动的 OCR 也能识别 PID）',
                ],
            },
            {
                ver: 'v1.8.7', date: '2026-08-23',
                items: [
                    '界面: 在侧边栏的 Whisper 与 OCR 服务之间添加了 TTS 服务状态显示（模型已载入时以品红色点亮）',
                ],
            },
            {
                ver: 'v1.8.6', date: '2026-08-23',
                items: [
                    '界面: 实时趋势卡片的自动记录开关改为滑动开关（修正开关无法显示状态的问题）。同时拉开图表中各采样项目的图例间隔',
                ],
            },
            {
                ver: 'v1.8.5', date: '2026-08-23',
                items: [
                    '修正: 转换履历等的「复制」按钮，在剪贴板 API 不可用的环境（例如通过局域网 IP 打开）下不工作。通过先确认 navigator.clipboard 是否存在、并回退到旧的 textarea 方式，现在复制按钮在任何环境都能工作。失败时会显示错误提示',
                ],
            },
            {
                ver: 'v1.8.4', date: '2026-08-23',
                items: [
                    '修正: 转写履历中，结果含「\u0027（撇号）时查看・复制失败的问题。按钮 onclick 引用的字符串改用特殊编码（\u0027 → %27），含撇号的文本也能正常显示・复制',
                ],
            },
            {
                ver: 'v1.8.3', date: '2026-08-23',
                items: [
                    '结果表示: PaddleOCR 的 PDF→MD 输出包含 HTML 表格（<table>・居中 <div>）。在 Markdown 视图中将其安全地渲染为表格显示（rowspan/colspan 保持，script 等除外）',
                ],
            },
            {
                ver: 'v1.8.2', date: '2026-08-23',
                items: [
                    '结果表示: AI 校正结果（及转换结果）为 Markdown 格式时以 Markdown 视图显示。朗读时不会读出 MD 符号（标题・强调・列表・代码・表格等以渲染后的文字朗读）',
                ],
            },
            {
                ver: 'v1.8.1', date: '2026-08-23',
                items: [
                    '转换履历: 点击列标题可对列排序（再次点击切换升序/降序，▲▼ 显示当前排序列）',
                ],
            },
            {
                ver: 'v1.8.0', date: '2026-08-23',
                items: [
                    'OCR 执行: 文件选择 → 输出格式（MD/TXT）→ AI 校正选择（自动保存）→ 执行。图像 / PDF 按所选文件自动判定',
                    'OCR 执行: 开始时显示「转换中」与已用时。转换完成后记录到转换履历（音频时长以 - 显示，转换速度 = 转换时间/页数的平均值）',
                ],
            },
            {
                ver: 'v1.7.0', date: '2026-08-23',
                items: [
                    '日志履历: 左列表支持多选，点击所选日志在右侧叠加显示波形图表。各监控（CPU/Memory/GPU利用率/VRAM/温度）可单独显示ON/OFF',
                    '日志履历: 单选日志时可在「图表」与「实数据」间切换显示。实数据支持 JSONL / CSV 两种格式，下载按钮按当前显示格式保存',
                ],
            },
            {
                ver: 'v1.6.0', date: '2026-08-23',
                items: [
                    '实时推移新增「自动记录」开关: 任一服务（Whisper/TTS/OCR/LLM）从待机变为活动时自动开始记录，全部待机或本次活动中服务停止时自动结束。关闭开关时结束当前自动记录',
                    '实时推移卡片头部显示采样周期（刷新间隔）与波形跨度（显示点数・时间宽度）',
                ],
            },
            {
                ver: 'v1.5.9', date: '2026-08-23',
                items: [
                    '服务控制卡: 删除模型详细（#model-info），模型・模式・切换按钮改为一行显示',
                ],
            },
            {
                ver: 'v1.5.8', date: '2026-08-23',
                items: [
                    '侧边栏下方新增「LLM 活用」: AI 校正（LLM）处理中显示状态（处理中/待机中 + 模型名）',
                ],
            },
            {
                ver: 'v1.5.7', date: '2026-08-23',
                items: [
                    '仪表盘各监控・实时推移的更新周期现在与设置的「刷新间隔」一致（默认 1000ms）。GPU Engine 计数器改为后台持续采样，不再阻塞快照，更新显著加快',
                    '侧边栏顺序改为: 仪表盘 → OCR → 转换履历 → 设置 → 实时日志 → 日志履历 → Readme',
                ],
            },
            {
                ver: 'v1.5.6', date: '2026-08-23',
                items: [
                    '设置画面: 连接令牌新增启用/停用开关。停用后，其他设备无需令牌即可执行写入・控制操作',
                ],
            },
            {
                ver: 'v1.5.5', date: '2026-08-23',
                items: [
                    '转换履历的详细结果: 在结果画面右上角新增「校正」/「删除」按钮，可对已保存的转换结果重新执行 AI 校正并即时更新显示，或删除该记录',
                ],
            },
            {
                ver: 'v1.5.4', date: '2026-08-23',
                items: [
                    '设置画面: 连接令牌支持手动输入并保存（新增保存按钮）',
                    'OCR 标签页: 显示与仪表盘相同的 CPU & 内存 / GPU 监控（实时同步）',
                    '侧边栏: 将日志履历移动到「设置」和「Readme」之间',
                ],
            },
            {
                ver: 'v1.5.3', date: '2026-08-23',
                items: [
                    '服务控制卡改名为「服务控制」',
                    '设置画面: 补全连接令牌・重新生成等缺失的多语言文本（日语显示时完全日语化）',
                ],
            },
            {
                ver: 'v1.5.2', date: '2026-08-23',
                items: [
                    'CPU & 内存监控: 下部 3 个显示盒的字号统一为 text-xl',
                    '侧边栏: Whisper / OCR 各自添加状态显示与小开始、停止按钮（日文显示）',
                ],
            },
            {
                ver: 'v1.5.1', date: '2026-08-23',
                items: [
                    'GPU 监控卡: VRAM 圆环改为 4 色渐变分段显示（Whisper / TTS / OCR / 其他），并显示各模型的总体占比',
                    'GPU 监控卡: 各模型框改为 2 行居中显示 —— 模型名 + VRAM 使用容量（MB 与占比・实时更新），文字加大 2 档',
                    'GPU 监控卡: 使用率圆环也改为 4 色渐变分段显示（Whisper / TTS / OCR / 其他，Windows GPU Engine 按 PID 实时统计）',
                    '服务控制卡: 集成 Whisper / TTS / OCR 的启动、停止、重启，TTS 支持模型读入 / 释放 / 重读',
                ],
            },
            {
                ver: 'v1.5.0', date: '2026-08-23',
                items: [
                    '新增 PaddleOCR 服务（端口 9100）: 图像 OCR（PP-OCRv6/PP-OCRv5）+ PDF→Markdown（PP-StructureV3）',
                    'OCR 标签页: 服务启动/停止/重启・GPU/CPU 设备・语言选择・上传执行与 Markdown 下载',
                    '设置: OCR 的启动时自动启动选项（默认: 关闭）',
                ],
            },
            {
                ver: 'v1.4.4', date: '2026-08-23',
                items: [
                    '修正: 模型切换下拉框被状态定期更新重置为运行中模型，导致所选模型（Small→medium）丢失的问题',
                ],
            },
            {
                ver: 'v1.4.0', date: '2026-08-23',
                items: [
                    '聊天 API（OpenAI 兼容 /api/v1/chat + SSE 流式）与逐句实时语音输出',
                    '模型管理: Whisper / Kokoro / VibeVoice 的删除按钮、Kokoro・VibeVoice 的下载状态与管理',
                    '本地 TTS 集成: 引擎延迟加载・常驻・空闲时自动释放（VRAM）',
                    '显示改善: Whisper 状态「执行中」改为「待机中」、模型行悬停高亮',
                ],
            },
            {
                ver: 'v1.2.0', date: '2026-08-22',
                items: [
                    '朗读 TTS：引擎可切换（Edge TTS / Kokoro 本地高速 / VibeVoice 实时）+ 设备设置',
                    '本地高速 TTS（Kokoro）：日语原生音色・24kHz WAV・句级下划线高亮',
                    'VibeVoice（实验性）：~200ms 流式实时合成（需另行安装）',
                ],
            },
            {
                ver: 'v1.1.0', date: '2026-08-22',
                items: [
                    '朗读（Edge TTS 女声）：暂停/继续・当前句下划线・双击正文从指定位置播放',
                    '转换履历：转换文与 AI 校正文的字符数 + 标签切换（原文/校正后）',
                    '实时记录（JSONL）：开始/停止按钮・记录日志查看・AI 可解析格式',
                    '趋势图：转换/AI 校对阶段色带 + GPU 温度图表',
                    '模型切换：等待读入完成，失败时自动恢复旧模型',
                ],
            },
            {
                ver: 'v1.0.0', date: '2026-08-22',
                items: [
                    'LLM 管理追加 Deepseek / MiniMax / Ollama，模型列表下拉化',
                    '模型保存位置指定 + 模型管理 UI（下载・切换・仅显示已下载）',
                    '连接令牌认证・API 密钥掩码化・SSRF 对策（安全强化）',
                    'AI 校对 401 回归修复、Whisper 进程孤立对策',
                    '大容量语音对应（/asr 直列化・1GB 上限・实时进度）',
                    '多语言 UI・CDN 本地化・Readme 页面新增',
                ],
            },
        ],
    },
    ja: {
        overview_title: '機能概要',
        overview: [
            'ローカル音声認識（faster-whisper + CTranslate2、GPU 高速化）',
            'リアルタイム監視（CPU / GPU / メモリ使用率、変換中アニメーションと進捗）',
            'AI 校正（LLM: Deepseek / MiniMax / Ollama / カスタム OpenAI 互換エンドポイント）',
            '変換履歴管理（検索・再校正・SRT 出力）',
            'リアルタイムログ表示',
            'Whisper モデル管理（DL・切替・削除・保存先指定・VRAM 警告）',
            'PaddleOCR モデル管理（DL・削除・進捗。プロジェクト内 models/paddlex に保存、画像OCR / PDF→Markdown）',
            'チャットAPI（OpenAI 互換 SSE ストリーミング + 文単位リアルタイム音声出力）',
            '多言語 UI（中文 / 日本語 / English）',
            '接続トークン認証（書き込み・制御操作のみ、ループバック免除）',
            'Windows 自動起動',
            '音読み（Edge TTS 女性音声）：一時停止/再開・読上げ中の文を下線表示・本文ダブルクリックで指定位置から再生',
            'リアルタイムロギング（JSONL 記録・ログ履歴表示・AI 解析可能）',
            '変換/AI 校正フェーズの帯色分け + GPU 温度グラフ',
        ],
        arch_title: 'システム構成',
        arch_desc: 'LAN 内の PC（例: 192.168.0.88）で以下を実行。外出先からは NAS（QNAP）の VPN（Tailscale / WireGuard）経由で接続。',
        arch: [
            ['MyWhisperServer Dashboard', 'FastAPI + WebSocket + SQLite（:9001）— 設定・監視・履歴・Readme 画面'],
            ['Whisper Server', 'faster-whisper（:9000）— GPU 推論、転写後に AI 校正を実行'],
            ['PaddleOCR Server', 'PaddleOCR（:9100）— 画像OCR / PDF→Markdown。モデルは models/paddlex に保存され設定画面で管理'],
            ['LLM 校正エンジン', 'Deepseek API / MiniMax API / Ollama など OpenAI 互換エンドポイント'],
            ['モデル保存先', 'models/（HuggingFace キャッシュ形式）— 設定画面で変更可'],
            ['データベース', 'dashboard/data/records.db — 転写履歴・設定・LLM プロファイル'],
            ['フロントエンド', '静的 HTML + Tailwind + Chart.js（外部 CDN 不使用）'],
        ],
        bench_title: 'Whisper モデル比較（60分音声基準）',
        bench_note: 'GTX 1660 Ti 6GB・int8_float16・beam=3 での目安。実際の所要時間は音声内容・言語・GPU 負荷で変動。精度は large-v3（1.00）を基準とした相対 WER 比で、小さいほど正確。',
        th_model: 'モデル', th_lang: '言語', th_speed: '変換時間（60分）', th_acc: '精度（相対）', th_feat: '特徴',
        version_title: 'バージョン情報',
        current_version: '現在のバージョン',
        changelog_title: '機能追加履歴',
        changelog: [
            {
                ver: 'v1.8.12', date: '2026-08-31',
                items: [
                    'OCR: PaddleOCR サーバ /pdf 応答に図版画像（base64）を追加。Obsidian プラグインが {name}_assets に保存し markdown 参照を自動書き換え（プラグイン v0.4.2 相当）',
                ],
            },
            {
                ver: 'v1.8.11', date: '2026-08-23',
                items: [
                    'モデル: 設定ページ「音声モデル管理」に PaddleOCR モデル管理（DL/削除/進捗）を追加。PaddleOCR モデルはプロジェクト内 models/paddlex に保存され、プロジェクトごと移植可能',
                ],
            },
            {
                ver: 'v1.8.10', date: '2026-08-23',
                items: [
                    '履歴: 削除ボタンを「選択削除」（行を選択して削除）に変更し、全削除ボタンを廃止。記録ログ（ログ履歴）にも複数選択・一括削除を追加',
                ],
            },
            {
                ver: 'v1.8.9', date: '2026-08-23',
                items: [
                    '履歴: 変換履歴で複数選択（行チェックボックス＋全選択）と一括削除を追加。外部起動の Whisper サービスにもプロセス ID と起動時間を表示',
                ],
            },
            {
                ver: 'v1.8.8', date: '2026-08-23',
                items: [
                    'UI: サイドバーの TTS サービスに読み上げ中/一時停止中を表示。OCR 実行時は制御カードに即座に「変換中」を表示し、プロセス ID・経過時間を表示（外部起動の OCR も PID を検出）',
                ],
            },
            {
                ver: 'v1.8.7', date: '2026-08-23',
                items: [
                    'UI: サイドバーの Whisper サービスと OCR サービスの間に、TTS サービスの状態表示を追加（モデル読込中はフクシア色で表示）',
                ],
            },
            {
                ver: 'v1.8.6', date: '2026-08-23',
                items: [
                    'UI: リアルタイム推移カードの自動記録トグルをスライドスイッチに変更（状態が表示されない問題を修正）。あわせて各サンプリング項目の凡例の間隔を広げた',
                ],
            },
            {
                ver: 'v1.8.5', date: '2026-08-23',
                items: [
                    '修正: 変換履歴などの「コピー」ボタンが、クリップボード API が使えない環境（例: LAN IP で開いた場合）で動作しない問題。navigator.clipboard の存在確認と textarea 方式へのフォールバックを追加し、どの環境でもコピーできるように。失敗時はエラー表示',
                ],
            },
            {
                ver: 'v1.8.4', date: '2026-08-23',
                items: [
                    '修正: 変換履歴で結果に「\u0027（アポストロフィ）が含まれると表示・コピーできない問題。ボタン onclick に埋め込む文字列を特殊エンコード（\u0027 → %27）し、アポストロフィを含むテキストでも表示・コピーできるようにした',
                ],
            },
            {
                ver: 'v1.8.3', date: '2026-08-23',
                items: [
                    '結果表示: PaddleOCR の PDF→MD 出力に含まれる HTML テーブル（<table>・中央寄せ <div>）を、Markdown ビューで安全にテーブル表示（rowspan/colspan 維持、script 等は除外）',
                ],
            },
            {
                ver: 'v1.8.2', date: '2026-08-23',
                items: [
                    '結果表示: AI校正結果（および変換結果）が Markdown 形式のとき Markdown ビューで表示。読み上げ時は MD 記号を読まない（見出し・強調・リスト・コード・表などはレンダリング後の文字を読み上げ）',
                ],
            },
            {
                ver: 'v1.8.1', date: '2026-08-23',
                items: [
                    '変換履歴: 列ヘッダをクリックしてソート（再クリックで昇順⇔降順切替、▲▼ で現在のソート列を表示）',
                ],
            },
            {
                ver: 'v1.8.0', date: '2026-08-23',
                items: [
                    'OCR 実行: ファイル選択 → 出力形式（MD/TXT）→ AI 校正選択（選択保存）→ 実行。画像 / PDF は選択したファイルで自動判定します',
                    'OCR 実行: 実行開始時に「変換中」と経過時間を表示。完了後は変換履歴に記録（音声時間は「-」表示、変換速度は変換時間/ページ数の平均値）',
                ],
            },
            {
                ver: 'v1.7.0', date: '2026-08-23',
                items: [
                    'ログ履歴: 左の一覧が複数選択に対応し、選択したログの波形を右側で重ね合わせ表示できます。各モニタ（CPU/Memory/GPU使用率/VRAM/温度）の表示ON/OFFを選択可能',
                    'ログ履歴: 単一ログ選択時は「グラフ」と「実データ」をタブ切替。実データは JSONL / CSV の2形式に対応し、ダウンロードボタンは表示中の形式で保存します',
                ],
            },
            {
                ver: 'v1.6.0', date: '2026-08-23',
                items: [
                    'リアルタイム推移に「自動記録」トグルを追加: 各サービス（Whisper/TTS/OCR/LLM）が待機から稼働に変わった瞬間に自動で記録を開始し、全サービスが待機、または今回のセッションで活動中のサービスが停止した時に自動終了します。OFF にすると現在の自動記録は終了します',
                    'リアルタイム推移カードのヘッダーにサンプリング周期（更新間隔）と波形間隔（表示点数・時間幅）を表示',
                ],
            },
            {
                ver: 'v1.5.9', date: '2026-08-23',
                items: [
                    'サービス制御カード: モデル詳細（#model-info）を削除し、モデル・モード・切替ボタンを一行にまとめて表示',
                ],
            },
            {
                ver: 'v1.5.8', date: '2026-08-23',
                items: [
                    'サイドバー下部に「LLM 活用」を追加: AI 校正（LLM）の処理中に状態（処理中/待機中 + モデル名）を表示',
                ],
            },
            {
                ver: 'v1.5.7', date: '2026-08-23',
                items: [
                    'ダッシュボード各モニタ・リアルタイム推移の更新周期を設定の「更新間隔」（既定 1000ms）に一致させました。GPU Engine カウンタはバックグラウンドで継続サンプリングするようにし、スナップショットをブロックしないため更新が大幅に高速化',
                    'サイドバーの順序を変更: ダッシュボード → OCR → 変換履歴 → 設定 → リアルタイムログ → ログ履歴 → Readme',
                ],
            },
            {
                ver: 'v1.5.6', date: '2026-08-23',
                items: [
                    '設定画面: 接続トークンに有効/無効スイッチを追加。無効にすると、他のデバイスはトークンなしで書き込み・制御操作を実行できます',
                ],
            },
            {
                ver: 'v1.5.5', date: '2026-08-23',
                items: [
                    '変換履歴の詳細結果: 結果画面右上に「校正」/「削除」ボタンを追加。保存済みの変換結果へ AI 校正を再実行して表示を即時更新、または記録を削除できます',
                ],
            },
            {
                ver: 'v1.5.4', date: '2026-08-23',
                items: [
                    '設定画面: 接続トークンを手動入力して保存できるように（保存ボタン追加）',
                    'OCR タブ: ダッシュボードと同じ CPU & メモリ / GPU モニターを表示（リアルタイム同期）',
                    'サイドバー: ログ履歴を「設定」と「Readme」の間に移動',
                ],
            },
            {
                ver: 'v1.5.3', date: '2026-08-23',
                items: [
                    'サービス制御カードを「サービス制御」に改名',
                    '設定画面: 接続トークン・再生成などの欠落していた多言語テキストを補完（日本語表示時に完全日本語化）',
                ],
            },
            {
                ver: 'v1.5.2', date: '2026-08-23',
                items: [
                    'CPU & メモリモニター: 下部 3 ボックスの表示フォントサイズを text-xl で統一',
                    'サイドバー: Whisper / OCR それぞれに状態表示と小さな開始・停止ボタンを配置（日本語表示）',
                ],
            },
            {
                ver: 'v1.5.1', date: '2026-08-23',
                items: [
                    'GPU モニターカード: VRAM リングを 4 色グラデーションのセグメント表示（Whisper / TTS / OCR / その他）に変更し、各モデルの全体割合を表示',
                    'GPU モニターカード: 各モデルボックスを 2 行表示（モデル名 + VRAM使用容量 MB・全体割合）に変更し、文字サイズを 2 段階アップ',
                    'GPU モニターカード: 使用率リングも 4 色グラデーションのセグメント表示（Whisper / TTS / OCR / その他・Windows GPU Engine の PID 別実測）に変更',
                    'サービス制御カード: Whisper / TTS / OCR の起動・停止・再起動を集約。TTS はモデルの読込 / 解放 / 再読込に対応',
                ],
            },
            {
                ver: 'v1.5.0', date: '2026-08-23',
                items: [
                    'PaddleOCR サービスを追加（ポート 9100）: 画像OCR（PP-OCRv6/PP-OCRv5）+ PDF→Markdown（PP-StructureV3）',
                    'OCR タブ: サービス起動/停止/再起動・GPU/CPU デバイス・言語選択・アップロード実行と Markdown ダウンロード',
                    '設定: OCR の起動時自動起動オプション（既定: オフ）',
                ],
            },
            {
                ver: 'v1.4.4', date: '2026-08-23',
                items: [
                    '修正: Whisper モデル切替ドロップダウンがステータス定期更新で実行中モデルに戻され、選択（Small→medium）が消える問題',
                ],
            },
            {
                ver: 'v1.4.0', date: '2026-08-23',
                items: [
                    'チャットAPI（OpenAI 互換 /api/v1/chat + SSE ストリーミング）と文単位リアルタイム音声出力',
                    'モデル管理: Whisper / Kokoro / VibeVoice の削除ボタン、Kokoro・VibeVoice の DL 状態表示と管理',
                    'ローカル TTS 統合: エンジンの遅延ロード・常駐・アイドル時の自動アンロード（VRAM 解放）',
                    '表示改善: Whisper 状態「実行中」を「待機中」に変更、モデル行のホバー強調',
                ],
            },
            {
                ver: 'v1.2.0', date: '2026-08-22',
                items: [
                    '音読み TTS：エンジン切替（Edge TTS / Kokoro ローカル高速 / VibeVoice リアルタイム）とデバイス設定を追加',
                    'ローカル高速 TTS（Kokoro）：日本語ネイティブ音声・24kHz WAV・文単位の下線ハイライト',
                    'VibeVoice（実験的）：~200ms ストリーミング合成（別途インストールが必要）',
                ],
            },
            {
                ver: 'v1.1.0', date: '2026-08-22',
                items: [
                    '音読み（Edge TTS 女性音声）：一時停止/再開・読上げ中の文を下線表示・本文ダブルクリックで指定位置から再生',
                    '変換履歴：変換文と AI 校正文の文字数表示 + タブ切替（原文/校正後）',
                    'リアルタイムロギング（JSONL）：記録開始/停止ボタン・ログ履歴セクション・AI 解析可能な形式',
                    'トレンドチャート：変換/AI 校正フェーズの帯色分け + GPU 温度グラフ追加',
                    'モデル切替：読込完了まで待機し、失敗時は旧モデルへ自動復元',
                ],
            },
            {
                ver: 'v1.0.0', date: '2026-08-22',
                items: [
                    'LLM 管理に Deepseek / MiniMax / Ollama を追加、モデルリストをプルダウン化',
                    'モデル保存先の指定 + モデル管理 UI（DL・切替・DL 済みのみ表示）',
                    '接続トークン認証・API キーマスク化・SSRF 対策（セキュリティ強化）',
                    'AI 校正 401 回帰の修正、Whisper プロセス孤立対策',
                    '大容量音声対応（/asr 直列化・1GB 上限・リアルタイム進捗）',
                    '多言語 UI・CDN ローカル化・Readme ページ追加',
                ],
            },
        ],
    },
    en: {
        overview_title: 'Overview',
        overview: [
            'Local speech-to-text (faster-whisper + CTranslate2, GPU accelerated)',
            'Real-time monitoring (CPU / GPU / memory usage, conversion animation & progress)',
            'AI correction (LLM: Deepseek / MiniMax / Ollama / custom OpenAI-compatible endpoints)',
            'Transcription history (search, re-correct, SRT export)',
            'Real-time log viewer',
            'Whisper model management (download, switch, delete, storage location, VRAM warning)',
            'PaddleOCR model management (download/delete/progress, stored under models/paddlex; image OCR / PDF→Markdown)',
            'Chat API (OpenAI-compatible SSE streaming + per-sentence real-time audio output)',
            'Multilingual UI (中文 / 日本語 / English)',
            'Connection-token auth (write/control only, loopback exempt)',
            'Windows auto-start',
            'Read-aloud (Edge TTS female): pause/resume, current-sentence underline, double-click to jump',
            'Real-time logging (JSONL save, log history viewer, AI-parseable)',
            'Phase-colored trend chart (transcribe/correct) + GPU temperature line',
        ],
        arch_title: 'System Architecture',
        arch_desc: 'Runs on a PC in the LAN (e.g. 192.168.0.88). For remote access, connect via the NAS (QNAP) VPN (Tailscale / WireGuard).',
        arch: [
            ['MyWhisperServer Dashboard', 'FastAPI + WebSocket + SQLite (:9001) — settings, monitoring, history, Readme UI'],
            ['Whisper Server', 'faster-whisper (:9000) — GPU inference, AI correction after transcription'],
            ['PaddleOCR Server', 'PaddleOCR (:9100) — image OCR / PDF→Markdown. Models stored under models/paddlex, managed in settings'],
            ['LLM correction engine', 'Deepseek API / MiniMax API / Ollama or any OpenAI-compatible endpoint'],
            ['Model storage', 'models/ (HuggingFace cache layout) — configurable in settings'],
            ['Database', 'dashboard/data/records.db — history, settings, LLM profiles'],
            ['Frontend', 'Static HTML + Tailwind + Chart.js (no external CDN)'],
        ],
        bench_title: 'Whisper model comparison (60-min audio baseline)',
        bench_note: 'Approximate values on GTX 1660 Ti 6GB · int8_float16 · beam=3. Actual time varies with audio content, language and GPU load. Accuracy is relative WER vs large-v3 (1.00); lower is better.',
        th_model: 'Model', th_lang: 'Lang', th_speed: 'Time (60min)', th_acc: 'Accuracy (rel.)', th_feat: 'Notes',
        version_title: 'Version Info',
        current_version: 'Current version',
        changelog_title: 'Changelog',
        changelog: [
            {
                ver: 'v1.8.12', date: '2026-08-31',
                items: [
                    'OCR: PaddleOCR /pdf now returns figure images (base64). The Obsidian plugin saves them to {name}_assets and rewrites the markdown references (plugin v0.4.2)',
                ],
            },
            {
                ver: 'v1.8.11', date: '2026-08-23',
                items: [
                    'Models: Added PaddleOCR model management (download/delete/progress) to the Model Management card in settings. PaddleOCR models are stored under models/paddlex inside the project, so the whole project stays portable',
                ],
            },
            {
                ver: 'v1.8.10', date: '2026-08-23',
                items: [
                    'History: The delete button is now "Delete Selected" (select rows to delete); the Clear All button is removed. The log history also supports multi-select and batch delete',
                ],
            },
            {
                ver: 'v1.8.9', date: '2026-08-23',
                items: [
                    'History: Conversion history now supports multi-select (row checkboxes + select all) and batch delete. The process ID and start time are shown even for an externally started Whisper service',
                ],
            },
            {
                ver: 'v1.8.8', date: '2026-08-23',
                items: [
                    'UI: The sidebar TTS service now shows the speaking/paused state. When OCR runs, the control card immediately shows "Converting", and the process ID and elapsed time are displayed (the PID is detected even for externally started OCR)',
                ],
            },
            {
                ver: 'v1.8.7', date: '2026-08-23',
                items: [
                    'UI: Added a TTS service status display in the sidebar between the Whisper and OCR services (shown in fuchsia when the model is loaded)',
                ],
            },
            {
                ver: 'v1.8.6', date: '2026-08-23',
                items: [
                    'UI: The auto-record toggle in the realtime trend card is now a slide switch (fixes the state not being shown). Also increased the spacing between the legend items of each sampled metric',
                ],
            },
            {
                ver: 'v1.8.5', date: '2026-08-23',
                items: [
                    'Fix: The Copy buttons in the conversion history stopped working in environments where the Clipboard API is unavailable (e.g. opened via a LAN IP). Now the buttons first check whether navigator.clipboard exists and fall back to the legacy textarea method, so copying works everywhere. Failures are surfaced with an error toast',
                ],
            },
            {
                ver: 'v1.8.4', date: '2026-08-23',
                items: [
                    'Fix: View/Copy failed in the conversion history when a result contains an apostrophe ("\u0027"). The string embedded in the button onclick is now specially encoded ("\u0027" → %27) so apostrophe-bearing text displays and copies correctly',
                ],
            },
            {
                ver: 'v1.8.3', date: '2026-08-23',
                items: [
                    'Result View: HTML tables emitted by PaddleOCR in PDF→MD output (<table> / centered <div>) are now safely rendered as tables in the Markdown view (rowspan/colspan preserved, scripts dropped)',
                ],
            },
            {
                ver: 'v1.8.2', date: '2026-08-23',
                items: [
                    'Result View: AI-corrected (and raw) results are shown as rendered Markdown when in Markdown format. When reading aloud, MD symbols are not spoken (headings, emphasis, lists, code, tables are read as their rendered text)',
                ],
            },
            {
                ver: 'v1.8.1', date: '2026-08-23',
                items: [
                    'Conversion History: click a column header to sort (click again to toggle asc/desc; ▲▼ shows the active sort column)',
                ],
            },
            {
                ver: 'v1.8.0', date: '2026-08-23',
                items: [
                    'OCR Run: file select → output format (MD/TXT) → AI correction select (auto-saved) → run. Image / PDF is auto-detected from the selected file',
                    'OCR Run: shows "Converting" and elapsed time on start. On completion, records to the conversion history (audio time shown as "-", speed = conversion time / pages average)',
                ],
            },
            {
                ver: 'v1.7.0', date: '2026-08-23',
                items: [
                    'Log History: the left list supports multi-select — selected logs overlay their waveforms on the right. Each monitor (CPU/Memory/GPU Util/VRAM/Temp) can be toggled ON/OFF',
                    'Log History: with a single log selected, switch between "Graph" and "Data" views. Data supports JSONL / CSV formats; the Download button saves in the current display format',
                ],
            },
            {
                ver: 'v1.6.0', date: '2026-08-23',
                items: [
                    'Real-time trend: added "Auto-record" toggle — recording auto-starts the moment any service (Whisper/TTS/OCR/LLM) goes active, and auto-ends when all are idle or an active service of this session stops. Toggling OFF ends the current auto session',
                    'Real-time trend card header now shows the sample period (refresh interval) and wave span (displayed points · time width)',
                ],
            },
            {
                ver: 'v1.5.9', date: '2026-08-23',
                items: [
                    'Service Control Card: removed model details (#model-info); model, mode, and switch button now display on one line',
                ],
            },
            {
                ver: 'v1.5.8', date: '2026-08-23',
                items: [
                    'Sidebar: added "LLM Activity" at the bottom — shows status (correcting / idle + model name) while AI correction (LLM) is running',
                ],
            },
            {
                ver: 'v1.5.7', date: '2026-08-23',
                items: [
                    'Dashboard monitors and real-time trend updates now match the configured "Refresh interval" (default 1000ms). The GPU Engine counter is sampled continuously in the background so it no longer blocks snapshots, making updates much faster',
                    'Sidebar order changed to: Dashboard → OCR → Conversion History → Settings → Realtime Log → Log History → Readme',
                ],
            },
            {
                ver: 'v1.5.6', date: '2026-08-23',
                items: [
                    'Settings screen: added an enable/disable switch for the connection token. When off, other devices can perform write/control operations without a token',
                ],
            },
            {
                ver: 'v1.5.5', date: '2026-08-23',
                items: [
                    'Conversion history detail: added "Correct" / "Delete" buttons at the top-right of the result screen to re-run AI correction on a saved result (updating the display immediately) or delete the record',
                ],
            },
            {
                ver: 'v1.5.4', date: '2026-08-23',
                items: [
                    'Settings screen: connection token now supports manual entry and saving (added save button)',
                    'OCR tab: shows the same CPU & memory / GPU monitors as the dashboard (real-time sync)',
                    'Sidebar: moved Log History to between Settings and Readme',
                ],
            },
            {
                ver: 'v1.5.3', date: '2026-08-23',
                items: [
                    'Renamed "Service Control Card" heading to "Service Control"',
                    'Settings screen: added missing multilingual text for connection token / regenerate (fully Japanese when UI is Japanese)',
                ],
            },
            {
                ver: 'v1.5.2', date: '2026-08-23',
                items: [
                    'CPU & memory monitor: unified the font size of the 3 bottom boxes to text-xl',
                    'Sidebar: added status display plus small start/stop buttons for Whisper and OCR (Japanese labels)',
                ],
            },
            {
                ver: 'v1.5.1', date: '2026-08-23',
                items: [
                    'GPU monitor card: VRAM ring now shows 4 gradient segments (Whisper / TTS / OCR / Other) with each model\'s share of total',
                    'GPU monitor card: each model box now shows 2 centered lines — model name + VRAM usage (MB & share, real-time), text bumped 2 sizes',
                    'GPU monitor card: utilization ring also segmented into 4 gradients (Whisper / TTS / OCR / Other, measured per-PID via Windows GPU Engine counters)',
                    'Service Control card: start/stop/restart for Whisper, TTS and OCR in one place; TTS supports model load / unload / reload',
                ],
            },
            {
                ver: 'v1.5.0', date: '2026-08-23',
                items: [
                    'Added PaddleOCR service (port 9100): image OCR (PP-OCRv6/PP-OCRv5) + PDF→Markdown (PP-StructureV3)',
                    'OCR tab: service start/stop/restart, GPU/CPU device, language selection, upload-and-run with Markdown download',
                    'Settings: OCR auto-start option (default: off)',
                ],
            },
            {
                ver: 'v1.4.4', date: '2026-08-23',
                items: [
                    'Fixed: model-switch dropdown was reset to the running model by periodic status updates, discarding the selected model (Small→medium)',
                ],
            },
            {
                ver: 'v1.4.0', date: '2026-08-23',
                items: [
                    'Chat API (OpenAI-compatible /api/v1/chat + SSE streaming) with per-sentence real-time audio output',
                    'Model management: delete buttons for Whisper / Kokoro / VibeVoice; Kokoro & VibeVoice download status and management',
                    'Local TTS integration: lazy engine load, resident model, idle auto-unload (VRAM)',
                    'UI: Whisper status "Running" → "Standby"; hover highlight on model rows',
                ],
            },
            {
                ver: 'v1.2.0', date: '2026-08-22',
                items: [
                    'Read-aloud TTS: switchable engine (Edge TTS / Kokoro fast local / VibeVoice realtime) + device setting',
                    'Fast local TTS (Kokoro): native Japanese voices, 24kHz WAV, sentence-level highlight',
                    'VibeVoice (experimental): ~200ms streaming synthesis (requires separate install)',
                ],
            },
            {
                ver: 'v1.1.0', date: '2026-08-22',
                items: [
                    'Read-aloud (Edge TTS female): pause/resume, current-sentence underline, double-click jump',
                    'Transcription history: char counts for raw & corrected text + tab switcher (raw/corrected)',
                    'Real-time logging (JSONL): start/stop button, log history section, AI-parseable format',
                    'Trend chart: transcribe/correct phase color bands + GPU temperature line',
                    'Model switch: waits for model load; auto-reverts to the previous model on failure',
                ],
            },
            {
                ver: 'v1.0.0', date: '2026-08-22',
                items: [
                    'Added Deepseek / MiniMax / Ollama to LLM management with model dropdowns',
                    'Model storage location setting + model management UI (download, switch, downloaded-only)',
                    'Connection-token auth, API key masking, SSRF protection (security hardening)',
                    'Fixed AI correction 401 regression; orphan Whisper process fix',
                    'Large-audio support (/asr serialization, 1GB cap, real-time progress)',
                    'Multilingual UI, local CDN assets, Readme page added',
                ],
            },
        ],
    },
};

// モデル比較表のソート状態（key: name / speed / wer, dir: 1=昇順, -1=降順）
let readmeSort = { key: null, dir: 1 };

// 表示文字列から数値ソートキーを取り出す（例: '約22分'→22, '約2.4'→2.4, '1.00'→1）
function readmeSortValue(name, key) {
    if (key === 'name') return name;
    const bench = MODEL_BENCH[name] || {};
    const raw = key === 'speed' ? bench.speed : bench.wer;
    return parseFloat(String(raw || '').replace(/[^0-9.]/g, '')) || 0;
}

// ソート矢印（▲/▼）をヘッダーに反映
function updateReadmeSortArrows() {
    const c = README_CONTENT[uiLanguage] || README_CONTENT['zh'];
    const keyToTh = { name: 'th_model', speed: 'th_speed', wer: 'th_acc' };
    [['#th-model', 'name'], ['#th-speed', 'speed'], ['#th-acc', 'wer']].forEach(([id, key]) => {
        const el = $(id);
        if (!el) return;
        const base = c[keyToTh[key]] || '';
        el.textContent = base + (readmeSort.key === key ? (readmeSort.dir > 0 ? ' ▲' : ' ▼') : '');
    });
}

// ソートクリックのバインド（初回のみ）
function initReadmeSort() {
    const bind = (id, key) => {
        const el = $(id);
        if (!el) return;
        el.classList.add('cursor-pointer', 'select-none', 'hover:text-amber-300');
        el.addEventListener('click', () => {
            if (readmeSort.key === key) {
                readmeSort.dir = -readmeSort.dir; // 同じ列は昇順⇔降順トグル
            } else {
                readmeSort.key = key;
                readmeSort.dir = 1; // 初回は昇順（速い/正確 が先頭）
            }
            updateReadmeSortArrows();
            renderReadmeModels();
        });
    };
    bind('#th-model', 'name');
    bind('#th-speed', 'speed');
    bind('#th-acc', 'wer');
}

function renderReadmeModels() {
    const tbody = $('#readme-model-tbody');
    if (!tbody || !modelCatalog) return;
    const langLabel = (info) => {
        if (info.lang === 'en') return uiLanguage === 'ja' ? '英語' : uiLanguage === 'zh' ? '英语' : 'English';
        if (info.lang === 'multi') return uiLanguage === 'ja' ? '多言語' : uiLanguage === 'zh' ? '多语言' : 'Multilingual';
        return info.lang || '';
    };
    let names = Object.keys(modelCatalog);
    if (readmeSort.key) {
        const { key, dir } = readmeSort;
        names = names.slice().sort((a, b) => {
            if (key === 'name') return a.localeCompare(b) * dir;
            return (readmeSortValue(a, key) - readmeSortValue(b, key)) * dir;
        });
    }
    const rows = names.map(name => {
        const info = modelCatalog[name] || {};
        const bench = MODEL_BENCH[name] || {};
        const w = parseFloat(bench.wer);
        const wc = !isNaN(w)
            ? (w <= 1.15 ? 'text-emerald-400' : w <= 1.6 ? 'text-amber-300' : 'text-rose-400')
            : 'text-stone-500';
        return `<tr class="border-b border-white/5">
            <td class="py-2 pr-3 font-mono text-cyan-300">${escapeHtml(name)}</td>
            <td class="py-2 pr-3">${langLabel(info)}</td>
            <td class="py-2 pr-3 text-right">${escapeHtml(bench.speed || '—')}</td>
            <td class="py-2 pr-3 text-right font-medium ${wc}">${escapeHtml(bench.wer || '—')}</td>
            <td class="py-2 text-stone-400">${escapeHtml(info.desc || '')}</td>
        </tr>`;
    }).join('');
    tbody.innerHTML = rows;
}

function renderReadme() {
    const c = README_CONTENT[uiLanguage] || README_CONTENT['zh'];
    const set = (id, val) => { const el = $(id); if (el) el.textContent = val; };
    set('#readme-overview-title', c.overview_title);
    set('#readme-arch-title', c.arch_title);
    set('#readme-bench-title', c.bench_title);
    set('#readme-bench-note', c.bench_note);
    set('#readme-version-title', c.version_title);
    set('#readme-changelog-title', c.changelog_title);
    set('#readme-current-version', `${c.current_version}: v${APP_VERSION}`);
    set('#th-model', c.th_model);
    set('#th-lang', c.th_lang);
    set('#th-speed', c.th_speed);
    set('#th-acc', c.th_acc);
    set('#th-feat', c.th_feat);
    updateReadmeSortArrows(); // ソート矢印を反映（言語切替後も保持）

    const ov = $('#readme-overview');
    if (ov) ov.innerHTML = c.overview.map(x =>
        `<li class="flex items-start gap-2"><span class="text-amber-400 mt-1">•</span><span>${escapeHtml(x)}</span></li>`).join('');

    const arch = $('#readme-arch');
    if (arch) {
        arch.innerHTML = `<p class="text-sm text-stone-400 mb-3">${escapeHtml(c.arch_desc)}</p>` +
            c.arch.map(([n, d]) => `<div class="flex items-start gap-3 py-2 border-b border-white/5">
                <span class="text-amber-300 text-sm font-mono w-72 shrink-0">${escapeHtml(n)}</span>
                <span class="text-sm text-stone-300">${escapeHtml(d)}</span>
            </div>`).join('');
    }

    const ver = $('#readme-version');
    if (ver) {
        ver.innerHTML = c.changelog.map(e => `<div class="border-l-2 border-amber-500/40 pl-4 py-1">
            <div class="font-medium text-amber-300">${escapeHtml(e.ver)}<span class="text-stone-500 text-xs ml-2">${escapeHtml(e.date)}</span></div>
            <ul class="list-disc pl-5 mt-1 space-y-0.5 text-sm text-stone-300">${e.items.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
        </div>`).join('');
    }
    renderReadmeModels();
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
    } else if (name === 'logging') {
        loadRealtimeLogs();
        if (rtlogChart) rtlogChart.resize();
    } else if (name === 'settings') {
        loadSettings();
        loadAutostartStatus();
    } else if (name === 'ocr') {
        loadOcrStatus();
        loadOcrSettings();
    } else if (name === 'readme') {
        renderReadme(); // カタログ取得前に開いた場合も最新状態で描画
    }
}

// ---------------------------------------------------------------------------
// 履历
// ---------------------------------------------------------------------------
async function loadRecords(search = '') {
    // 新しいデータ取得時は選択をリセット（ソート再描画のみ選択を維持）
    recordSelection.clear();
    updateSelectedCount();
    try {
        const url = `${API_BASE}/records?limit=50&search=${encodeURIComponent(search)}`;
        const resp = await apiFetch(url);
        const data = await resp.json();
        renderRecords(data.records || []);
    } catch (e) {
        console.error('Failed to load records:', e);
    }
}

// onclick に埋め込む文字列エンコード：encodeURIComponent は ' をエスケープしないため、
// 結果テキストにアポストロフィが含まれても onclick が壊れないよう ' → %27 にする
function enc(s) {
    return encodeURIComponent(s == null ? '' : s).replace(/'/g, '%27');
}

function renderRecords(records) {
    lastRecords = records;
    const tbody = $('#records-table-body');
    if (!records || records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="13" class="py-8 text-center text-slate-500">${t('records.empty')}</td></tr>`;
        updateRecordSortIndicators();
        updateSelectedCount();
        return;
    }

    // ソート適用（records は不変、コピーをソート）
    let list = records;
    if (recordsSortKey) {
        const key = recordsSortKey, dir = recordsSortDir;
        const numericKeys = new Set(['time', 'duration', 'convert', 'correct', 'elapsed', 'speed', 'chars']);
        const isNumeric = numericKeys.has(key);
        list = [...records].sort((a, b) => {
            const va = recordSortValue(a, key);
            const vb = recordSortValue(b, key);
            if (isNumeric) {
                const na = (typeof va === 'number' && isFinite(va)) ? va : Infinity;
                const nb = (typeof vb === 'number' && isFinite(vb)) ? vb : Infinity;
                return (na - nb) * dir;
            }
            return String(va).localeCompare(String(vb), undefined, { numeric: true }) * dir;
        });
    }

    tbody.innerHTML = list.map(r => {
        // 时间分量：処理時間 = elapsed（総合）、変換時間 = elapsed - AI校正（Whisper のみ）
        const total = (r.elapsed_seconds || 0);
        const correct = r.correct_elapsed || 0;
        const convert = Math.max(0, total - correct);
        // OCR レコード判定（source='ocr' または pages 有り）
        const isOcr = r.source === 'ocr' || r.pages != null;
        // OCR: 変換速度 = 変換時間 / ページ数（平均値）。Whisper: 変換速度 = 変換耗时 / 音频长度（1/x 表示）
        const speed = isOcr && r.pages > 0
            ? (total / r.pages)
            : (r.duration > 0 ? (total / r.duration) : null);
        const speedText = isOcr
            ? (speed > 0 ? speed.toFixed(1) + ' s/' + t('ocr.page_unit') : '--')
            : (speed !== null && speed > 0 ? `1/${(1 / speed).toFixed(1)}` : '--');
        const speedClass = isOcr
            ? 'text-slate-400'
            : (speed !== null && speed <= 0.5 ? 'text-emerald-400' : speed !== null && speed <= 1 ? 'text-amber-400' : 'text-rose-400');
        const modelTag = r.model ? `<span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs">${escapeHtml(r.model)}</span>` : '--';
        // LLM 校正模型（存在则显示）
        const llmTag = r.llm_model
            ? `<span class="ml-1 px-2 py-0.5 rounded-md bg-fuchsia-500/20 text-fuchsia-300 text-xs" title="${t('records.llm_corrected')}">AI: ${escapeHtml(r.llm_model)}</span>`
            : '';
        // 校正按钮（SRT 含时间轴，不做 AI 校正）
        const correctBtn = r.output_format !== 'srt'
            ? `<button class="text-fuchsia-400 hover:text-fuchsia-300 text-sm ml-2" title="${t('records.correct')}" onclick="correctRecord(${r.id})">${t('records.correct')}</button>`
            : '';
        // 文字数：校正済み（原文≠結果）なら 原文→校正後 の両方を表示
        const res = r.result || '';
        const rawRes = r.raw_result || res;
        const charsCell = (rawRes !== res)
            ? `${fmtNum(charCount(rawRes))}<span class="text-fuchsia-400" title="${t('records.chars_corr')}"> → ${fmtNum(charCount(res))}</span>`
            : `${fmtNum(charCount(res))}`;
        return `
        <tr>
            <td class="py-3 w-8"><input type="checkbox" class="record-check" value="${r.id}" ${recordSelection.has(r.id) ? 'checked' : ''} onchange="toggleRecordSelect(${r.id}, this.checked)"></td>
            <td class="py-3 text-slate-400 font-mono text-xs">${formatDateTime(r.timestamp)}</td>
            <td class="py-3">${escapeHtml(r.filename || '--')}</td>
            <td class="py-3"><span class="px-2 py-0.5 rounded-md bg-slate-800 text-xs">${escapeHtml(r.language || 'auto')}</span></td>
            <td class="py-3">${modelTag}${llmTag}</td>
            <td class="py-3 text-slate-400">${isOcr ? '-' : formatTime(r.duration)}</td>
            <td class="py-3 text-slate-400">${formatTime(convert)}</td>
            <td class="py-3 text-fuchsia-400">${r.correct_elapsed ? formatTime(correct) : '--'}</td>
            <td class="py-3 text-amber-300">${formatTime(total)}</td>
            <td class="py-3 font-mono ${speedClass}">${speedText}</td>
            <td class="py-3 text-slate-300">${escapeHtml(truncate(r.summary, 40))}</td>
            <td class="py-3 text-slate-400 font-mono text-xs whitespace-nowrap">${charsCell}</td>
            <td class="py-3">
                <button class="text-amber-400 hover:text-amber-300 text-sm" onclick="showRecordContent(${r.id}, '${enc(r.result)}', '${r.language || ''}', '${enc(r.raw_result)}')">${t('records.view')}</button>
                <button class="text-cyan-400 hover:text-cyan-300 text-sm ml-2" onclick="copyRecordText(${r.id}, '${enc(r.result)}')">${t('records.copy')}</button>
                ${correctBtn}
                <button class="text-rose-400 hover:text-rose-300 ml-2 align-middle" title="${t('records.delete')}" onclick="deleteRecord(${r.id})">
                    <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </td>
        </tr>`;
    }).join('');

    $('#records-badge').textContent = records.length;
    $('#records-badge').classList.remove('hidden');
    updateRecordSortIndicators();
    updateSelectedCount();
}

// ---------------------------------------------------------------------------
// 変換履歴の複数選択・一括削除
// ---------------------------------------------------------------------------
const recordSelection = new Set();   // 選択中のレコード ID（ソート再描画を跨いで維持）

// 行チェックボックス切替（onchange）
window.toggleRecordSelect = function(id, checked) {
    if (checked) recordSelection.add(id);
    else recordSelection.delete(id);
    updateSelectedCount();
};

// ヘッダーの全選択チェックボックス（現在表示ページ分）
window.toggleSelectAllRecords = function(cb) {
    const ids = (lastRecords || []).map(r => r.id);
    if (cb.checked) ids.forEach(id => recordSelection.add(id));
    else ids.forEach(id => recordSelection.delete(id));
    updateSelectedCount();
};

// 選択数に応じて一括削除ボタンの表示/非表示とヘッダー全選択状態を更新
function updateSelectedCount() {
    const count = recordSelection.size;
    const btn = $('#btn-delete-selected');
    const cnt = $('#records-selected-count');
    if (btn) btn.classList.toggle('hidden', count === 0);
    if (cnt) cnt.textContent = count;
    const selAll = $('#records-select-all');
    if (selAll) {
        const ids = (lastRecords || []).map(r => r.id);
        const onPage = ids.filter(id => recordSelection.has(id)).length;
        selAll.checked = onPage > 0 && onPage === ids.length;
        selAll.indeterminate = onPage > 0 && onPage < ids.length;
    }
}

// 選択中のレコードを一括削除
window.deleteSelectedRecords = async function() {
    const ids = [...recordSelection];
    if (!ids.length) return;
    if (!confirm(t('records.batch_delete_confirm').replace('{n}', ids.length))) return;
    try {
        const resp = await apiFetch(`${API_BASE}/records/batch-delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
        });
        const data = await resp.json();
        if (data.success) {
            recordSelection.clear();
            updateSelectedCount();
            showToast(t('records.batch_deleted').replace('{n}', data.deleted), 'success');
            loadRecords($('#records-search').value);
            loadStats();
        } else {
            showToast(t('toast.action_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    }
};

// 履历列ソート用の比較値を返す（表示と整合する実値）
function recordSortValue(r, key) {
    const total = (r.elapsed_seconds || 0);
    switch (key) {
        case 'time': return new Date(r.timestamp).getTime() || 0;
        case 'duration': return Number(r.duration || 0);
        case 'convert': return Math.max(0, total - (r.correct_elapsed || 0));
        case 'correct': return Number(r.correct_elapsed || 0);
        case 'elapsed': return total;
        case 'speed': {
            const isOcr = r.source === 'ocr' || r.pages != null;
            return isOcr
                ? (r.pages > 0 ? total / r.pages : NaN)
                : (r.duration > 0 ? total / r.duration : NaN);
        }
        case 'chars': return charCount(r.result || '');
        default: return String(r[key] != null ? r[key] : '');
    }
}

// 列ヘッダクリックでソート切替（再クリックで昇順⇔降順）
function sortRecords(key) {
    if (recordsSortKey === key) {
        recordsSortDir = -recordsSortDir;
    } else {
        recordsSortKey = key;
        recordsSortDir = 1;
    }
    renderRecords(lastRecords || []);
}

// ソート中の列ヘッダに ▲/▼ を付与
function updateRecordSortIndicators() {
    $all('#records thead th[data-sort-key]').forEach(th => {
        const active = th.getAttribute('data-sort-key') === recordsSortKey;
        th.classList.toggle('sort-active', active);
        th.classList.toggle('sort-asc', active && recordsSortDir === 1);
        th.classList.toggle('sort-desc', active && recordsSortDir === -1);
    });
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

// 詳細結果画面右上の「校正」ボタン：表示中のレコードへ AI 校正を再実行し、
// 開いている表示（変換結果パネル / 詳細モーダル）の校正結果タブを即時更新する
function updateCorrectedDisplay(id, newResult, llmModel) {
    const refresh = (pre, charsEl, metaFmt) => {
        if (!pre) return;
        const raw = pre.dataset.raw || '';
        pre.dataset.corrected = newResult;
        if (charsEl) charsEl.textContent = metaFmt ? metaFmt(raw, newResult) : recordCharsText(raw, newResult);
    };
    // パネル（変換履歴画面）
    const panelPre = $('#record-content');
    if (panelPre && panelPre.dataset.corrected !== undefined && String($('#record-content-panel').dataset.recordId || '') === String(id)) {
        refresh(panelPre, $('#record-content-meta'), (raw, corr) => `${t('records.detail')} #${id} · ${recordCharsText(raw, corr)}`);
        const corrBtn = $('#btn-tab-content-corrected');
        if (corrBtn && corrBtn.classList.contains('result-tab-active')) setResultContent(panelPre, newResult);
    }
    // モーダル（底部クイックビュー）
    const modalPre = $('#record-detail-content');
    if (modalPre && modalPre.dataset.corrected !== undefined && String($('#record-detail-modal').dataset.recordId || '') === String(id)) {
        refresh(modalPre, $('#record-detail-chars'));
        const corrBtn = $('#btn-tab-detail-corrected');
        if (corrBtn && corrBtn.classList.contains('result-tab-active')) setResultContent(modalPre, newResult);
    }
}

window.correctRecordDisplay = async function(view) {
    // 表示中のビューからレコード id を特定（view: 'content' | 'detail'）
    const panel = $('#record-content-panel');
    const modal = $('#record-detail-modal');
    let id = null;
    if (view === 'content' && panel && !panel.classList.contains('hidden')) id = panel.dataset.recordId;
    else if (view === 'detail' && modal && !modal.classList.contains('hidden')) id = modal.dataset.recordId;
    if (!id) { showToast(t('toast.action_failed'), 'error'); return; }
    const btn = view === 'content' ? $('#btn-correct-content') : $('#btn-correct-modal');
    const original = btn ? btn.innerHTML : '';
    if (btn) btn.disabled = true;
    showToast(t('records.correcting'), 'info');
    try {
        const resp = await apiFetch(`${API_BASE}/records/${id}/correct`, { method: 'POST' });
        const data = await resp.json();
        if (data.success) {
            updateCorrectedDisplay(id, data.result, data.llm_model);
            showToast(t('records.corrected') + (data.llm_model ? ` (AI: ${data.llm_model})` : ''), 'success');
            loadRecords($('#records-search').value);  // 一覧・集計を最新化
        } else {
            showToast(data.error || t('toast.action_failed'), 'error');
        }
    } catch (e) {
        showToast(t('toast.network_error') + ': ' + e.message, 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = original; }
    }
};

// 詳細結果画面右上の「削除」ボタン：表示中のレコードを削除し、表示を閉じる
window.deleteRecordDisplay = async function(view) {
    const panel = $('#record-content-panel');
    const modal = $('#record-detail-modal');
    let id = null;
    if (view === 'content' && panel && !panel.classList.contains('hidden')) id = panel.dataset.recordId;
    else if (view === 'detail' && modal && !modal.classList.contains('hidden')) id = modal.dataset.recordId;
    if (!id) { showToast(t('toast.action_failed'), 'error'); return; }
    if (!confirm(t('records.delete_confirm'))) return;
    try {
        const resp = await apiFetch(`${API_BASE}/records/${id}`, { method: 'DELETE' });
        const data = await resp.json();
        if (data.success) {
            stopSpeaking();
            if (view === 'content') panel.classList.add('hidden');
            else modal.classList.add('hidden');
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

// ---------------------------------------------------------------------------
// 詳細結果の読み上げ（Microsoft Edge TTS / 女性ニューラル音声）
// バックエンド /api/v1/tts の音声（MP3 base64）＋文境界情報を
// チャンク単位で連続再生し、読み上げ中の文を詳細結果本文に下線表示する
// ---------------------------------------------------------------------------
const TTS_CHUNK_CHARS = 60;     // 1 リクエストあたりの目安文字数（1文前後）。ローカル合成の初回音声を短縮
let speakBtn = null;            // 読み上げ中のボタン（トグル用）
let ttsAudio = null;            // 現在再生中の Audio
let ttsQueue = [];              // 残りの再生チャンク {text, start}
let ttsGen = 0;                 // 世代カウンタ（停止後の遅延再生を防止）
let lastHi = null;              // 現在の下線ハイライト位置（重複再描画の防止）
let ttsPaused = false;          // 一時停止中か（ボタン再クリックで現在位置から再開）
let ttsBuf = null;              // 次チャンクのプリロード済み音声 {chunk, data}（連続再生ギャップ短縮）
let ttsColdWarnTimer = null;    // 初回音声までの待ちが長い場合のヒント toast タイマー

// 文末（。！？.!?）区切りで文のリスト（文字位置付き）を返す
function splitSentences(text) {
    const parts = text.match(/[^。！？.!?]*[。！？.!?]|[^。！？.!?]+$/g) || [text];
    const out = [];
    let pos = 0;
    for (const s of parts) {
        out.push({ text: s, start: pos, end: pos + s.length });
        pos += s.length;
    }
    return out;
}

// 文を最大 maxLen 文字のチャンクにまとめる（連続読み上げ用）。
// fromOffset 以降の文だけを対象にする（ダブルクリックでのジャンプ再生用）。
function chunkText(text, maxLen, fromOffset = 0) {
    const chunks = [];
    let cur = '';
    let curStart = -1;
    for (const s of splitSentences(text)) {
        if (s.end <= fromOffset) continue;   // fromOffset より前に終わる文はスキップ
        if (curStart === -1) curStart = s.start;
        if ((cur + s.text).length > maxLen && cur) {
            chunks.push({ text: cur, start: curStart });
            cur = s.text;
            curStart = s.start;
        } else {
            cur += s.text;
        }
    }
    if (cur) chunks.push({ text: cur, start: curStart });
    return chunks;
}

// base64 の MP3 を Blob に変換
function b64ToBlob(b64, mime) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime });
}

// 指定文字範囲（本文全体基準の offset）を <span class="tts-underline"> で囲んで下線表示
function highlightRange(contentId, start, end) {
    const el = $(contentId);
    if (!el || start < 0 || end <= start) return;
    clearHighlight(contentId);
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let offset = 0;
    let startNode = null, startOff = 0, endNode = null, endOff = 0;
    while (walker.nextNode()) {
        const node = walker.currentNode;
        const len = node.length;
        if (startNode === null && offset + len > start) {
            startNode = node; startOff = start - offset;
        }
        if (offset + len >= end) {
            if (startNode === null) { startNode = node; startOff = 0; }
            endNode = node; endOff = end - offset;
            break;
        }
        offset += len;
    }
    if (!startNode || !endNode) return;
    const range = document.createRange();
    range.setStart(startNode, startOff);
    range.setEnd(endNode, endOff);
    const span = document.createElement('span');
    span.className = 'tts-underline';
    try { range.surroundContents(span); } catch (e) { /* 境界の都合で囲めない場合は無視 */ }
}

function clearHighlight(contentId) {
    const el = $(contentId);
    if (!el) return;
    el.querySelectorAll('.tts-underline').forEach(span => {
        const parent = span.parentNode;
        while (span.firstChild) parent.insertBefore(span.firstChild, span);
        parent.removeChild(span);
        parent.normalize();
    });
}

function setReadBtn(btn, mode = 'reading') {
    // 全読み上げボタンをリセットしてから対象ボタンのみ状態表示
    // mode: 'reading'（再生中・発光） / 'paused'（一時停止中・静的表示）
    ['#btn-read-content', '#btn-read-modal'].forEach(sel => {
        const el = $(sel);
        if (!el) return;
        const s = el.querySelector('[data-i18n]');
        if (s) { s.setAttribute('data-i18n', 'records.read'); s.textContent = t('records.read'); }
        el.classList.remove('read-active', 'read-paused');
    });
    speakBtn = btn;
    if (btn) {
        const s = btn.querySelector('[data-i18n]');
        const key = mode === 'paused' ? 'records.resume' : 'records.reading';
        if (s) { s.setAttribute('data-i18n', key); s.textContent = t(key); }
        btn.classList.add(mode === 'paused' ? 'read-paused' : 'read-active');
    }
    // 読み上げ中/一時停止/停止に応じてサイドバー・制御カードの TTS 状態を反映
    syncTtsSpeakingUi();
}

function pauseSpeaking() {
    // 一時停止：現在の再生位置で停止し、再クリックで再開できる状態にする
    ttsPaused = true;
    if (ttsAudio) ttsAudio.pause();
    setReadBtn(speakBtn, 'paused');
}

function stopSpeaking() {
    ttsGen++;                       // 進行中の非同期再生を無効化
    ttsPaused = false;
    if (ttsAudio) { ttsAudio.pause(); ttsAudio = null; }
    ttsQueue = [];
    ttsBuf = null;
    if (ttsColdWarnTimer) { clearTimeout(ttsColdWarnTimer); ttsColdWarnTimer = null; }
    lastHi = null;
    clearHighlight('#record-content');
    clearHighlight('#record-detail-content');
    setReadBtn(null);
}

window.readRecordContent = function(btn, contentId, lang, startOffset = 0) {
    // 一時停止中なら現在位置から再開
    if (ttsPaused) {
        ttsPaused = false;
        setReadBtn(btn, 'reading');
        if (ttsAudio) ttsAudio.play().catch(() => {});
        return;
    }
    // 読み上げ中（取得中も含む）なら一時停止
    if (speakBtn || ttsAudio || ttsQueue.length) {
        pauseSpeaking();
        return;
    }
    const text = ($(contentId).textContent || '');   // 生の textContent（オフセット照合のため trim しない）
    if (!text.trim()) return;
    // ダブルクリックでのジャンプ開始位置をクランプ
    startOffset = Math.max(0, Math.min(startOffset, text.length));
    const gen = ++ttsGen;
    ttsQueue = chunkText(text, TTS_CHUNK_CHARS, startOffset);
    // 合成待ち中もボタンを「読み上げ中」表示にする（冷間ロードでも視覚フィードバック）
    setReadBtn(btn, 'reading');
    // 8 秒経っても音声が鳴らない場合は冷間ロードのヒントを表示（温間ユーザーには邪魔しない）
    ttsColdWarnTimer = setTimeout(() => {
        if (ttsGen === gen && !ttsAudio) {
            showToast(t('records.tts_cold_wait'), 'info', 5000);
        }
    }, 8000);
    speakNextChunk(btn, contentId, lang || '', gen);
};

// /api/v1/tts を呼び、音声 base64 + 文境界を返す（失敗時 throw）
async function fetchTtsChunk(chunk, lang) {
    const resp = await apiFetch(`${API_BASE}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: chunk.text, lang: lang })
    });
    if (!resp.ok) {
        // エンジン未導入などの詳細を toast に出す（例: VibeVoice 未インストール）
        let msg = `HTTP ${resp.status}`;
        try { const e = await resp.json(); if (e && e.detail) msg = e.detail; } catch (_) {}
        throw new Error(msg);
    }
    return resp.json();
}

async function speakNextChunk(btn, contentId, lang, gen) {
    if (!ttsQueue.length || gen !== ttsGen) { stopSpeaking(); return; }
    const chunk = ttsQueue.shift();
    // プリロード済みならそれを即再生（合成待ちギャップを短縮）
    if (ttsBuf && ttsBuf.chunk === chunk) {
        const data = ttsBuf.data;
        ttsBuf = null;
        if (gen === ttsGen) playChunk(btn, contentId, lang, gen, chunk, data);
        return;
    }
    try {
        const data = await fetchTtsChunk(chunk, lang);
        if (gen !== ttsGen) return;                 // 停止されたら再生しない
        playChunk(btn, contentId, lang, gen, chunk, data);
    } catch (e) {
        if (gen === ttsGen) {                        // 停止ではなく実エラーの場合のみ報告
            stopSpeaking();
            showToast(t('records.no_tts') + ': ' + (e.message || ''), 'error');
        }
    }
}

function playChunk(btn, contentId, lang, gen, chunk, data) {
    // 再生中に次のチャンクをプリロード（合成時間を再生に隠す）
    startPreload(btn, contentId, lang, gen);
    // mime はエンジンにより audio/mpeg（edge）/ audio/wav（ローカル）
    const audioBlob = b64ToBlob(data.audio_base64, data.mime || 'audio/mpeg');
    const url = URL.createObjectURL(audioBlob);
    // 文境界（各エンジンの開始秒）と文リストを順対応付ける
    const sentences = splitSentences(chunk.text);
    const audio = new Audio(url);
    ttsAudio = audio;
    if (ttsColdWarnTimer) { clearTimeout(ttsColdWarnTimer); ttsColdWarnTimer = null; }
    audio.addEventListener('timeupdate', () => {
        if (gen !== ttsGen) return;
        const t = audio.currentTime;
        let idx = -1;
        const b = data.boundaries || [];
        for (let i = 0; i < b.length; i++) { if (b[i].t <= t) idx = i; else break; }
        if (idx >= 0) {
            const si = Math.min(idx, sentences.length - 1);
            const st = sentences[si];
            const key = (chunk.start + st.start) + '_' + (chunk.start + st.end);
            if (key !== lastHi) {
                lastHi = key;
                highlightRange(contentId, chunk.start + st.start, chunk.start + st.end);
            }
        }
    });
    audio.onended = () => {
        URL.revokeObjectURL(url);
        ttsAudio = null;
        lastHi = null;
        clearHighlight(contentId);
        speakNextChunk(btn, contentId, lang, gen);
    };
    audio.onerror = () => {
        URL.revokeObjectURL(url);
        ttsAudio = null;
        stopSpeaking();
        showToast(t('records.no_tts'), 'error');
    };
    // チャンク取得中に一時停止された場合は再生せずに停止状態を維持（再開時に play）
    setReadBtn(btn, ttsPaused ? 'paused' : 'reading');
    if (!ttsPaused) audio.play().catch(() => {});
}

// 次のチャンク音声を先に合成しておく（失敗時は無視し、順次取得にフォールバック）
function startPreload(btn, contentId, lang, gen) {
    if (ttsBuf || !ttsQueue.length) return;
    const nextChunk = ttsQueue[0];
    fetchTtsChunk(nextChunk, lang).then(data => {
        if (gen === ttsGen && !ttsBuf && ttsQueue.length && ttsQueue[0] === nextChunk) {
            ttsBuf = { chunk: nextChunk, data };
        }
    }).catch(() => {});
}

// ---------------------------------------------------------------------------
// 本文ダブルクリック：クリック位置の文から読み上げ開始（ジャンプ再生）
// ---------------------------------------------------------------------------
// 指定要素内の、現在の選択位置までの文字オフセットを返す（本文全体基準）
function getCaretOffsetWithin(el) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return -1;
    const range = sel.getRangeAt(0);
    if (!el.contains(range.startContainer)) return -1;
    const preRange = document.createRange();
    preRange.selectNodeContents(el);
    preRange.setEnd(range.startContainer, range.startOffset);
    return preRange.toString().length;
}

function startReadingAt(contentId) {
    const el = $(contentId);
    if (!el) return;
    const offset = getCaretOffsetWithin(el);
    if (offset < 0) return;
    const isModal = contentId === '#record-detail-content';
    const btn = isModal ? $('#btn-read-modal') : $('#btn-read-content');
    const lang = isModal
        ? ($('#record-detail-modal').dataset.lang || '')
        : ($('#record-content-panel').dataset.lang || '');
    if (!btn) return;
    stopSpeaking();   // 再生中の読み上げを一旦止めて、指定位置の文から開始
    readRecordContent(btn, contentId, lang, offset);
}

// ---------------------------------------------------------------------------
// Markdown 表示（AI校正結果が MD 形式のとき MD ビューで表示・読み上げで記号を読まない）
// ---------------------------------------------------------------------------
// テキストが Markdown 記法を含むかを判定（変換結果/校正結果どちらのタブでも適用）
function looksLikeMarkdown(text) {
    if (!text) return false;
    const t = String(text);
    return /(^|\n)\s{0,3}#{1,6}\s/.test(t)                        // 見出し
        || /\*\*[^*\n]+\*\*/.test(t) || /__[^_\n]+__/.test(t)     // 太字
        || /(^|\n)\s{0,3}>\s?/.test(t)                            // 引用
        || /(^|\n)\s{0,3}(?:[-*+]\s+|\d+\.\s+)/.test(t)           // リスト
        || /(^|\n)\s{0,3}```/.test(t)                             // コードフェンス
        || /`[^`\n]+`/.test(t)                                    // インラインコード
        || /(^|\n)\s{0,3}(?:[-*_]\s*){3,}\s*$/.test(t)            // 区切り線
        || (/[\|].*\|/.test(t) && /\|[\s:]*[-]{2,}/.test(t))      // 表
        || /!\[[^\]]*\]\([^)\s]+\)/.test(t)                       // 画像
        || /\[[^\]]+\]\([^)\s]+\)/.test(t)                        // リンク
        || /<div[\s\S]*?<\/div>|<table[\s\S]*?<\/table>/i.test(t) // PaddleOCR の HTML テーブル/中央寄せブロック
}

// http(s) / mailto / アンカー のみ許可（javascript: 等を遮断）
function mdSafeUrl(u) {
    u = String(u || '').trim();
    return /^(https?:|mailto:|#)/i.test(u) ? u : '';
}

// PaddleOCR PP-StructureV3 の HTML 断片（<div…><html><body><table border="1">…</table></body></html></div> 等）を
// 許可タグだけの安全な HTML に変換して返す（rowspan/colspan を維持、script/iframe/style 等は破棄）
function renderPaddleHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const allowed = { table: 'table', tr: 'tr', td: 'td', th: 'th',
                      b: 'strong', strong: 'strong', i: 'em', em: 'em', u: 'u',
                      br: 'br', ul: 'ul', ol: 'ol', li: 'li', p: 'p', span: 'span' };
    const build = (node) => {
        if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.nodeValue);
        if (node.nodeType !== Node.ELEMENT_NODE) return '';
        const tag = node.tagName.toLowerCase();
        // ラッパー（html/body/div と、HTMLパーサが挿入する tbody/thead/tfoot）は中身だけを返す
        if (tag === 'html' || tag === 'body' || tag === 'div'
            || tag === 'tbody' || tag === 'thead' || tag === 'tfoot') {
            return Array.from(node.childNodes).map(build).join('');
        }
        if (!allowed[tag]) return '';   // script/iframe/style/link 等は子ごと破棄
        if (tag === 'br') return '<br/>';
        const inner = Array.from(node.childNodes).map(build).join('');
        let cls = '';
        if (tag === 'table') cls = 'w-full text-sm border-collapse my-2';
        if (tag === 'th') cls = 'border border-stone-700 px-2 py-1 text-stone-200 bg-stone-800/60 text-left';
        if (tag === 'td') cls = 'border border-stone-700 px-2 py-1 text-stone-300';
        let attrs = '';
        ['colspan', 'rowspan'].forEach(a => {
            if (node.hasAttribute(a)) attrs += ' ' + a + '="' + escapeHtml(node.getAttribute(a)) + '"';
        });
        if (cls) attrs += ' class="' + cls + '"';
        return '<' + tag + attrs + '>' + inner + '</' + tag + '>';
    };
    let out = Array.from(doc.body.childNodes).map(build).join('');
    // 元が text-align:center の div なら中央寄せで包む
    const outer = doc.body.firstElementChild;
    const isCenter = outer && /text-align\s*:\s*center/i.test(outer.getAttribute('style') || '');
    return isCenter ? '<div class="text-center">' + out + '</div>' : out;
}

// 安全な Markdown → HTML 変換（テキストは全て escape、タグは白限定）
function renderMarkdown(md) {
    // PaddleOCR の HTML ブロック（<div…>…</div> / <table…>…</table>）を先に安全レンダリングして退避
    const padBlocks = [];
    const sentinel = (i) => '@@PADDLE' + i + '@@';
    let mdBody = String(md || '');
    mdBody = mdBody.replace(/<div[^>]*>[\s\S]*?<\/div>|<table[\s\S]*?<\/table>/g, (m) => {
        padBlocks.push(m);
        return sentinel(padBlocks.length - 1);
    });

    const esc = s => escapeHtml(String(s == null ? '' : s));
    const inline = (t) => {
        let s = esc(t);
        // インラインコード（他より先に保護）
        s = s.replace(/`([^`]+)`/g, (m, c) => '<code class="bg-stone-800 px-1 rounded text-fuchsia-300">' + c + '</code>');
        // 画像 / リンク（URL は安全なもののみ）
        s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, url) => {
            const u = mdSafeUrl(url);
            return u ? '<img src="' + u + '" alt="' + esc(alt) + '" class="max-w-full rounded-lg my-1" />' : m;
        });
        s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, txt, url) => {
            const u = mdSafeUrl(url);
            return u ? '<a href="' + u + '" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline">' + txt + '</a>' : m;
        });
        // 太字 + 斜体 → 太字 → 斜体 → 打ち消し線
        s = s.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
        s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
        s = s.replace(/(^|[^_])_([^_\s][^_]*)_/g, '$1<em>$2</em>');
        s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
        return s;
    };

    const lines = mdBody.split(/\r?\n/);
    const out = [];
    let i = 0;
    let listTag = null, listItems = [];
    let bqBuf = [];
    let curPara = '';

    const push = (html) => { if (html) out.push(html); };
    const flushList = () => {
        if (listItems.length) {
            push('<' + listTag + ' class="my-2 space-y-1 pl-5 list-disc">'
                + listItems.map(x => '<li>' + x + '</li>').join('') + '</' + listTag + '>');
            listItems = []; listTag = null;
        }
    };
    const flushBq = () => {
        if (bqBuf.length) {
            push('<blockquote class="border-l-4 border-stone-600 pl-3 my-2 text-stone-400">'
                + bqBuf.join('<br/>') + '</blockquote>');
            bqBuf = [];
        }
    };
    const flushPara = () => {
        if (!curPara) return;
        const parts = curPara.split('\n');
        const allSentinel = parts.every(x => /^\s*@@PADDLE(\d+)@@\s*$/.test(x));
        if (allSentinel) {
            parts.forEach(x => {
                const m = x.match(/@@PADDLE(\d+)@@/);
                if (m) push(renderPaddleHtml(padBlocks[+m[1]]));
            });
        } else {
            push('<p class="my-2">' + inline(curPara) + '</p>');
        }
        curPara = '';
    };

    while (i < lines.length) {
        const line = lines[i];

        // コードフェンス
        const fence = line.match(/^\s*(```|~~~)(.*)$/);
        if (fence) {
            flushList(); flushBq(); flushPara();
            const lang = fence[2].trim();
            const buf = [];
            i++;
            while (i < lines.length && !/^\s*(```|~~~)\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
            i++;
            push('<pre class="bg-stone-950 border border-white/10 rounded-lg p-3 my-2 overflow-x-auto text-xs"><code'
                + (lang ? ' data-lang="' + esc(lang) + '"' : '') + '>' + esc(buf.join('\n')) + '</code></pre>');
            continue;
        }

        // 見出し
        const h = line.match(/^\s{0,3}(#{1,6})\s+(.*)$/);
        if (h) {
            flushList(); flushBq(); flushPara();
            const lv = h[1].length;
            push('<h' + lv + ' class="font-semibold my-2 ' + (lv <= 2 ? 'text-lg' : 'text-base') + '">' + inline(h[2]) + '</h' + lv + '>');
            i++;
            continue;
        }

        // 区切り線
        if (/^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
            flushList(); flushBq(); flushPara();
            push('<hr class="border-stone-700 my-3" />');
            i++;
            continue;
        }

        // 表（ヘッダ行 + |---| 区切り）
        const isSep = /^\s*\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?\s*$/.test(line) && /-{2,}/.test(line);
        if (line.includes('|') && !isSep && lines[i + 1] && /-{2,}/.test(lines[i + 1])
            && /^\s*\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?\s*$/.test(lines[i + 1])) {
            flushList(); flushBq(); flushPara();
            const cells = line.split('|').filter((c, k, a) => !(k === 0 && c.trim() === '') && !(k === a.length - 1 && c.trim() === '')).map(c => c.trim());
            const aligns = lines[i + 1].split('|').filter((c, k, a) => !(k === 0 && c.trim() === '') && !(k === a.length - 1 && c.trim() === '')).map(c => {
                c = c.trim();
                if (/^:.*:$/.test(c)) return 'center';
                if (c.startsWith(':')) return 'left';
                if (c.endsWith(':')) return 'right';
                return 'left';
            });
            let html = '<table class="w-full text-sm border-collapse my-2"><thead><tr>';
            cells.forEach((c, k) => {
                html += '<th class="border border-stone-700 px-2 py-1 bg-stone-800/60 text-left">' + inline(c) + '</th>';
            });
            html += '</tr></thead><tbody>';
            i += 2;
            while (i < lines.length && lines[i].includes('|')) {
                const row = lines[i].split('|').filter((c, k, a) => !(k === 0 && c.trim() === '') && !(k === a.length - 1 && c.trim() === '')).map(c => c.trim());
                html += '<tr>' + row.map(c => '<td class="border border-stone-700 px-2 py-1 text-stone-300">' + inline(c) + '</td>').join('') + '</tr>';
                i++;
            }
            html += '</tbody></table>';
            push('<div class="overflow-x-auto my-2">' + html + '</div>');
            continue;
        }

        // リスト
        const ul = line.match(/^\s{0,3}([-*+])\s+(.*)$/);
        const ol = line.match(/^\s{0,3}\d+\.\s+(.*)$/);
        if (ul || ol) {
            flushBq(); flushPara();
            const tag = ol ? 'ol' : 'ul';
            if (listTag !== tag) flushList();
            listTag = tag;
            listItems.push(inline(ol ? ol[1] : ul[2]));
            i++;
            continue;
        }

        // 引用
        const bq = line.match(/^\s{0,3}>\s?(.*)$/);
        if (bq) {
            flushList(); flushPara();
            bqBuf.push(inline(bq[1]));
            i++;
            continue;
        }

        // 空行 → 段落区切り
        if (/^\s*$/.test(line)) {
            flushList(); flushBq(); flushPara();
            i++;
            continue;
        }

        // 通常行（段落）
        flushList(); flushBq();
        curPara = curPara ? curPara + '\n' + line : line;
        i++;
    }
    flushList(); flushBq(); flushPara();
    return out.join('\n');
}

// 表示要素へテキストを反映：MD ならレンダリング、そうでなければ生テキスト
function setResultContent(el, text) {
    if (!el) return;
    const txt = String(text == null ? '' : text);
    if (txt && looksLikeMarkdown(txt)) {
        el.innerHTML = renderMarkdown(txt);
        el.classList.add('md-rendered');
        el.classList.remove('font-mono', 'whitespace-pre-wrap');
    } else {
        el.textContent = txt;
        el.classList.remove('md-rendered');
        el.classList.add('font-mono', 'whitespace-pre-wrap');
    }
}

// 詳細結果のタブ切替：'raw'（変換結果）⇔ 'corrected'（AI校正結果）
function switchResultTab(view, tab) {
    stopSpeaking();
    const pre = $(view === 'content' ? '#record-content' : '#record-detail-content');
    if (!pre) return;
    const isCorr = tab === 'corrected';
    const raw = pre.dataset.raw || '';
    const corrected = pre.dataset.corrected || raw;
    setResultContent(pre, isCorr ? corrected : raw);
    const rawBtn = $('#btn-tab-' + view + '-raw');
    const corrBtn = $('#btn-tab-' + view + '-corrected');
    if (rawBtn) rawBtn.classList.toggle('result-tab-active', !isCorr);
    if (corrBtn) corrBtn.classList.toggle('result-tab-active', isCorr);
}

window.showRecordDetail = function(id, encodedResult, lang, encodedRaw) {
    stopSpeaking();
    const result = decodeURIComponent(encodedResult || '');
    const raw = decodeURIComponent(encodedRaw || '') || result;
    const pre = $('#record-detail-content');
    pre.dataset.raw = raw;
    pre.dataset.corrected = result;
    $('#record-detail-modal').dataset.lang = lang || '';
    $('#record-detail-modal').dataset.recordId = id;
    $('#record-detail-chars').textContent = recordCharsText(raw, result);
    $('#record-detail-modal').classList.remove('hidden');
    switchResultTab('detail', raw !== result ? 'corrected' : 'raw');
};

// 履历页面：在列表下方显示转换内容（上下布局）
window.showRecordContent = function(id, encodedResult, lang, encodedRaw) {
    stopSpeaking();
    const result = decodeURIComponent(encodedResult || '');
    const raw = decodeURIComponent(encodedRaw || '') || result;
    const pre = $('#record-content');
    pre.dataset.raw = raw;
    pre.dataset.corrected = result;
    $('#record-content-meta').textContent = `${t('records.detail')} #${id} · ${recordCharsText(raw, result)}`;
    const panel = $('#record-content-panel');
    panel.dataset.lang = lang || '';
    panel.dataset.recordId = id;
    panel.classList.remove('hidden');
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    switchResultTab('content', raw !== result ? 'corrected' : 'raw');
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
        updateTrendMeta();
    }
    $('#btn-trend-shrink').addEventListener('click', () => stepWindow(1));    // 缩小 → 显示更长时间
    $('#btn-trend-expand').addEventListener('click', () => stepWindow(-1));  // 放大 → 放大波形

    // リアルタイムロギング 開始/停止トグル
    const rtLogBtn = $('#btn-realtime-log');
    if (rtLogBtn) rtLogBtn.addEventListener('click', () => toggleRealtimeLog());
    // 自動記録トグル（rtl_auto_start）
    const rtlAuto = $('#toggle-rtl-auto');
    if (rtlAuto) rtlAuto.addEventListener('change', () => toggleRtlAuto());

    // 推移カードヘッダーの周期/波形間隔を即時表示（config 取得完了後は updateTrendMeta が再反映）
    updateTrendMeta();
}

window.copyRecordText = function(id, encodedResult) {
    const result = decodeURIComponent(encodedResult);
    copyToClipboard(result).then((ok) => {
        showToast(ok ? t('records.copied') : t('records.copy_failed'), ok ? 'success' : 'error');
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
        renderGpuTtsDisplay();
        updateTrendMeta();  // 設定の refresh_interval 変更を推移カードヘッダーへ反映

        // 接続トークン認証の有効/無効（トグル状態とトークン操作UIの反映）
        applyAuthEnabledState((config.auth_enabled || 'on') !== 'off');

        $('#setting-language').value = config.default_language || 'zh';
        $('#setting-output').value = config.default_output || 'txt';
        $('#setting-refresh').value = parseInt(config.refresh_interval) || 1000;
        $('#setting-temp').value = parseInt(config.gpu_temp_threshold) || 80;
        $('#setting-ui-language').value = uiLanguage;
        if (config.whisper_model && $('#select-model')) {
            $('#select-model').value = config.whisper_model;
        }
        if ($('#setting-model-dir')) {
            $('#setting-model-dir').value = config.whisper_model_dir || '';
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
        // 音読み TTS エンジン設定
        if ($('#setting-tts-engine')) {
            $('#setting-tts-engine').value = config.tts_engine || 'edge';
        }
        if ($('#setting-tts-device')) {
            $('#setting-tts-device').value = config.tts_device || 'auto';
        }
        // VibeVoice モデル選択（設定画面とダッシュボード制御を同期）
        const vvModel = config.tts_vibevoice_model || 'realtime';
        if ($('#setting-tts-vibevoice-model')) {
            $('#setting-tts-vibevoice-model').value = vvModel;
        }
        if ($('#vv-model-select')) {
            $('#vv-model-select').value = vvModel;
        }
        // Kokoro 日本語音声選択（設定画面とダッシュボード制御を同期）
        const kkVoice = config.tts_kokoro_voice || 'jf_alpha';
        if ($('#setting-tts-kokoro-voice')) {
            $('#setting-tts-kokoro-voice').value = kkVoice;
        }
        if ($('#kk-voice-select')) {
            $('#kk-voice-select').value = kkVoice;
        }
        // 起動時プリロード（ローカルTTS常駐）
        if ($('#setting-tts-preload')) {
            $('#setting-tts-preload').checked = String(config.tts_preload || 'on').toLowerCase() !== 'off';
        }
        showVibevoiceModelSetting();
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
        // モデル保存先（次回の切替・起動時に反映）
        whisper_model_dir: $('#setting-model-dir').value.trim(),
        // 音読み TTS エンジン設定
        tts_engine: $('#setting-tts-engine').value,
        tts_device: $('#setting-tts-device').value,
        tts_vibevoice_model: $('#setting-tts-vibevoice-model').value,
        tts_kokoro_voice: $('#setting-tts-kokoro-voice').value,
        tts_preload: $('#setting-tts-preload').checked ? 'on' : 'off',
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
            renderGpuTtsDisplay();
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
// プロバイダ定義（Deepseek / MiniMax / Ollama / 自定义）
const LLM_PROVIDERS = {
    deepseek: {
        label: 'Deepseek',
        base_url: 'https://api.deepseek.com/v1',
        models: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-v4-flash'],
    },
    minimax: {
        label: 'MiniMax',
        base_url: 'https://api.minimaxi.com/v1',
        models: ['MiniMax-M3', 'MiniMax-Text-01', 'MiniMax-M2', 'MiniMax-M1'],
    },
    ollama: {
        label: 'Ollama',
        base_url: 'http://localhost:11434/v1',
        models: null,   // 動的取得（/api/tags をバックエンド経由で）
    },
    custom: {
        label: 'Custom',
        base_url: '',
        models: [],
    },
};

// base_url からプロバイダを推定（旧データは provider 未設定のため）
function providerFromBaseUrl(base_url) {
    const u = (base_url || '').toLowerCase();
    if (u.includes('api.deepseek.com')) return 'deepseek';
    if (u.includes('minimax')) return 'minimax';
    if (u.includes(':11434') || u.includes('ollama')) return 'ollama';
    return 'custom';
}

// モデルプルダウンを描画（保存済みモデルが一覧に無ければ先頭に追加）
function renderModelOptions(provider, savedModel) {
    const sel = $('#llm-f-model');
    const list = [...(LLM_PROVIDERS[provider]?.models || [])];
    if (savedModel && !list.includes(savedModel)) list.unshift(savedModel);
    const opts = list.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`);
    opts.push(`<option value="__custom__">${t('llm.model_custom')}</option>`);
    sel.innerHTML = opts.join('');
    if (savedModel && list.includes(savedModel)) {
        sel.value = savedModel;
        $('#llm-f-model-custom').value = '';
    } else if (savedModel) {
        sel.value = '__custom__';
        $('#llm-f-model-custom').value = savedModel;
    } else {
        sel.value = list[0] || '__custom__';
    }
    toggleModelCustom();
}

// カスタム入力欄の表示切り替え（__custom__ 選択時のみ表示）
function toggleModelCustom() {
    const customInput = $('#llm-f-model-custom');
    customInput.classList.toggle('hidden', $('#llm-f-model').value !== '__custom__');
}

// プロバイダ変更時: base_url 自動入力 + モデル一覧取得
function setProfileProvider(provider, savedModel) {
    $('#llm-f-provider').value = provider;
    const base = LLM_PROVIDERS[provider]?.base_url || '';
    if (base && !$('#llm-f-base').value.trim()) $('#llm-f-base').value = base;
    if (provider === 'ollama') {
        loadOllamaModels($('#llm-f-base').value || base, savedModel);
    } else {
        renderModelOptions(provider, savedModel);
    }
}

// フォーム内プロバイダ変更ハンドラ（index.html onchange）
function onProfileProviderChange() {
    const savedModel = editingProfileId
        ? (llmProfiles.find(p => p.id === editingProfileId)?.model || '')
        : '';
    setProfileProvider($('#llm-f-provider').value, savedModel);
}

// Ollama のモデル一覧をバックエンド経由で取得
async function loadOllamaModels(base_url, savedModel) {
    const sel = $('#llm-f-model');
    sel.innerHTML = `<option value="">${t('llm.model_loading')}</option>`;
    let failed = false;
    try {
        const resp = await apiFetch(`${API_BASE}/llm/ollama/models?base_url=${encodeURIComponent(base_url || '')}`);
        const data = await resp.json();
        if (data.success && data.models.length) {
            const list = data.models;
            const opts = list.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`);
            opts.push(`<option value="__custom__">${t('llm.model_custom')}</option>`);
            sel.innerHTML = opts.join('');
            if (savedModel && list.includes(savedModel)) {
                sel.value = savedModel;
                $('#llm-f-model-custom').value = '';
            } else if (savedModel) {
                sel.value = '__custom__';
                $('#llm-f-model-custom').value = savedModel;
            } else {
                sel.value = list[0];
            }
        } else {
            failed = true;
            sel.innerHTML = `<option value="__custom__">${t('llm.model_custom')}</option>`;
            if (savedModel) { sel.value = '__custom__'; $('#llm-f-model-custom').value = savedModel; }
            showToast(t('llm.model_load_failed') + (data.error ? ': ' + data.error : ''), 'error');
        }
    } catch (e) {
        failed = true;
        sel.innerHTML = `<option value="__custom__">${t('llm.model_custom')}</option>`;
        if (savedModel) { sel.value = '__custom__'; $('#llm-f-model-custom').value = savedModel; }
        showToast(t('llm.model_load_failed'), 'error');
    }
    if (!failed) toggleModelCustom();
}

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
                <div class="text-xs text-stone-400 truncate">${escapeHtml(p.provider ? p.provider + ' · ' : '')}${escapeHtml(p.base_url)} · ${escapeHtml(p.model)}</div>
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
    // プロバイダ: 保存値があればそれ、なければ base_url から推定
    const provider = profile && profile.provider
        ? profile.provider
        : providerFromBaseUrl(profile ? profile.base_url : '');
    $('#llm-f-provider').value = provider;
    $('#llm-f-model-custom').value = '';
    $('#llm-f-model-custom').classList.add('hidden');
    setProfileProvider(provider, profile ? (profile.model || '') : '');
    $('#llm-profile-form').classList.remove('hidden');
    $('#llm-f-name').focus();
}

function closeProfileForm() {
    $('#llm-profile-form').classList.add('hidden');
    editingProfileId = null;
}

async function saveProfile() {
    let model = $('#llm-f-model').value;
    if (model === '__custom__') model = $('#llm-f-model-custom').value.trim();
    const payload = {
        name: $('#llm-f-name').value.trim(),
        base_url: $('#llm-f-base').value.trim(),
        model: model,
        provider: $('#llm-f-provider').value,
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
function showToast(message, type = 'info', duration = 3000) {
    // 既存トーストを除去して重ねない（切替中メッセージの置き換えにも使用）
    const prev = document.querySelector('.ws-toast');
    if (prev) prev.remove();
    const colors = {
        success: 'bg-emerald-500',
        error: 'bg-rose-500',
        info: 'bg-amber-500'
    };
    const toast = document.createElement('div');
    toast.className = `ws-toast fixed bottom-6 right-6 ${colors[type] || colors.info} text-white px-5 py-3 rounded-xl shadow-lg shadow-black/30 z-50 animate-bounce`;
    toast.style.animation = `cardFadeIn 0.3s ease-out forwards, fadeOut 0.3s ease-out ${Math.max(0, (duration - 300) / 1000)}s forwards`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// TTS エンジンが vibevoice の時のみ VibeVoice モデル設定を表示
function showVibevoiceModelSetting() {
    const eng = config.tts_engine || 'edge';
    const visible = eng === 'vibevoice';
    const wrap = $('#setting-tts-vibevoice-wrap');
    if (wrap) wrap.classList.toggle('hidden', !visible);
    const vvWrap = $('#vv-model-select-wrap');
    if (vvWrap) vvWrap.classList.toggle('hidden', !visible);
    // Kokoro 日本語音声セレクタ（エンジンが kokoro の時のみ表示）
    const kkWrap = $('#setting-tts-kokoro-voice-wrap');
    if (kkWrap) kkWrap.classList.toggle('hidden', eng !== 'kokoro');
    const kkDashWrap = $('#kk-voice-select-wrap');
    if (kkDashWrap) kkDashWrap.classList.toggle('hidden', eng !== 'kokoro');
}

// 起動時に config を取得し、ダッシュボードの VibeVoice 制御を実際の設定で初期化
async function initTtsVibevoiceControl() {
    try {
        const resp = await apiFetch(`${API_BASE}/config`);
        if (!resp.ok) return;
        const data = await resp.json();
        config = { ...config, ...data };
        const vvModel = config.tts_vibevoice_model || 'realtime';
        if ($('#vv-model-select')) $('#vv-model-select').value = vvModel;
        if ($('#setting-tts-vibevoice-model')) $('#setting-tts-vibevoice-model').value = vvModel;
        if ($('#tts-engine-select')) $('#tts-engine-select').value = config.tts_engine || 'edge';
        if ($('#tts-device-select')) $('#tts-device-select').value = config.tts_device || 'auto';
        loadTtsStatus();
        showVibevoiceModelSetting();
        renderGpuTtsDisplay();
    } catch (e) {
        console.error('Failed to load config for VibeVoice control:', e);
    }
}

// ---------------------------------------------------------------------------
// 事件绑定
// ---------------------------------------------------------------------------
function initEventListeners() {
    $('#btn-start-whisper').addEventListener('click', () => controlWhisper('start'));
    $('#btn-stop-whisper').addEventListener('click', () => controlWhisper('stop'));
    $('#btn-restart-whisper').addEventListener('click', () => controlWhisper('restart'));

    // サイドバー（Whisper 開始/停止）
    const sbWsStart = $('#sidebar-btn-start-whisper');
    if (sbWsStart) sbWsStart.addEventListener('click', () => controlWhisper('start'));
    const sbWsStop = $('#sidebar-btn-stop-whisper');
    if (sbWsStop) sbWsStop.addEventListener('click', () => controlWhisper('stop'));

    // PaddleOCR 制御
    const btnStartOcr = $('#btn-start-ocr');
    if (btnStartOcr) btnStartOcr.addEventListener('click', () => controlOcr('start'));
    const btnStopOcr = $('#btn-stop-ocr');
    if (btnStopOcr) btnStopOcr.addEventListener('click', () => controlOcr('stop'));
    const btnRestartOcr = $('#btn-restart-ocr');
    if (btnRestartOcr) btnRestartOcr.addEventListener('click', () => controlOcr('restart'));
    // サイドバー（OCR 開始/停止）
    const sbOcrStart = $('#sidebar-btn-start-ocr');
    if (sbOcrStart) sbOcrStart.addEventListener('click', () => controlOcr('start'));
    const sbOcrStop = $('#sidebar-btn-stop-ocr');
    if (sbOcrStop) sbOcrStop.addEventListener('click', () => controlOcr('stop'));
    const btnRunOcr = $('#btn-run-ocr');
    if (btnRunOcr) btnRunOcr.addEventListener('click', runOcr);
    const btnCopyOcr = $('#btn-copy-ocr');
    if (btnCopyOcr) btnCopyOcr.addEventListener('click', copyOcrResult);
    const btnDownloadOcrMd = $('#btn-download-ocr-md');
    if (btnDownloadOcrMd) btnDownloadOcrMd.addEventListener('click', downloadOcrResult);
    // OCR 実行カード: 出力形式 / AI校正 の選択は即保存
    const ocrFmtSel = $('#ocr-format');
    if (ocrFmtSel) ocrFmtSel.addEventListener('change', saveOcrRunSettings);
    const ocrAiSel = $('#ocr-ai-correct');
    if (ocrAiSel) ocrAiSel.addEventListener('change', saveOcrRunSettings);
    const ocrDevSel = $('#select-ocr-device');
    if (ocrDevSel) ocrDevSel.addEventListener('change', saveOcrSettings);
    const ocrLangSel = $('#select-ocr-lang');
    if (ocrLangSel) ocrLangSel.addEventListener('change', saveOcrSettings);
    const toggleOcrAutostart = $('#toggle-ocr-autostart');
    if (toggleOcrAutostart) toggleOcrAutostart.addEventListener('change', saveOcrSettings);
    // サービス制御カード: OCR ボタン + 設定セレクタ（OCR タブと双方向同期）
    const svcBtnStartOcr = $('#svc-btn-start-ocr');
    if (svcBtnStartOcr) svcBtnStartOcr.addEventListener('click', () => controlOcr('start'));
    const svcBtnStopOcr = $('#svc-btn-stop-ocr');
    if (svcBtnStopOcr) svcBtnStopOcr.addEventListener('click', () => controlOcr('stop'));
    const svcBtnRestartOcr = $('#svc-btn-restart-ocr');
    if (svcBtnRestartOcr) svcBtnRestartOcr.addEventListener('click', () => controlOcr('restart'));
    const svcOcrDevSel = $('#svc-select-ocr-device');
    if (svcOcrDevSel) svcOcrDevSel.addEventListener('change', () => {
        const dev = $('#select-ocr-device');
        if (dev) dev.value = svcOcrDevSel.value;
        saveOcrSettings();
    });
    const svcOcrLangSel = $('#svc-select-ocr-lang');
    if (svcOcrLangSel) svcOcrLangSel.addEventListener('change', () => {
        const lang = $('#select-ocr-lang');
        if (lang) lang.value = svcOcrLangSel.value;
        saveOcrSettings();
    });
    // サービス制御カード: TTS（読込/解放/再読込）
    const btnTtsPreload = $('#btn-tts-preload');
    if (btnTtsPreload) btnTtsPreload.addEventListener('click', () => controlTts('preload'));
    const btnTtsUnload = $('#btn-tts-unload');
    if (btnTtsUnload) btnTtsUnload.addEventListener('click', () => controlTts('unload'));
    const btnTtsReload = $('#btn-tts-reload');
    if (btnTtsReload) btnTtsReload.addEventListener('click', () => controlTts('reload'));
    const svcTtsEngineSel = $('#tts-engine-select');
    if (svcTtsEngineSel) svcTtsEngineSel.addEventListener('change', () => {
        const eng = svcTtsEngineSel.value;
        config.tts_engine = eng;
        const s = $('#setting-tts-engine');
        if (s) s.value = eng;
        showVibevoiceModelSetting();
        renderGpuTtsDisplay();
        apiFetch(`${API_BASE}/config`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tts_engine: eng })
        });
    });
    const svcTtsDeviceSel = $('#tts-device-select');
    if (svcTtsDeviceSel) svcTtsDeviceSel.addEventListener('change', () => {
        const dev = svcTtsDeviceSel.value;
        config.tts_device = dev;
        const s = $('#setting-tts-device');
        if (s) s.value = dev;
        renderGpuTtsDisplay();
        apiFetch(`${API_BASE}/config`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tts_device: dev })
        });
    });
    // 引数無しで呼ぶ（click イベントが modelName に渡るのを防ぐ。switchToModel は文字列を渡す）
    $('#btn-switch-model').addEventListener('click', () => switchModel());
    const modelSel = $('#select-model');
    if (modelSel) modelSel.addEventListener('change', () => {
        modelSelectionPending = true;  // 切替未実行の間はステータス更新で上書きさせない
    });

    $('#records-search').addEventListener('input', (e) => {
        loadRecords(e.target.value);
    });

    $('#btn-refresh-records').addEventListener('click', () => {
        loadRecords($('#records-search').value);
    });

    // 時間単位切替（秒 ⇔ 分秒）
    const timeToggle = $('#toggle-time-unit');
    if (timeToggle) {
        timeToggle.checked = timeUnit === 'minsec';
        timeToggle.addEventListener('change', (e) => {
            setTimeUnit(e.target.checked ? 'minsec' : 'sec');
        });
    }

    $('#btn-close-modal').addEventListener('click', () => {
        stopSpeaking();
        $('#record-detail-modal').classList.add('hidden');
    });

    // 詳細結果の読み上げ（トグル：再生中に押すと一時停止、再クリックで再開）
    $('#btn-read-modal').addEventListener('click', (e) => {
        readRecordContent(e.currentTarget, '#record-detail-content', $('#record-detail-modal').dataset.lang);
    });
    $('#btn-read-content').addEventListener('click', (e) => {
        readRecordContent(e.currentTarget, '#record-content', $('#record-content-panel').dataset.lang);
    });
    // 本文ダブルクリック：クリックした文の位置から読み上げ開始
    ['#record-content', '#record-detail-content'].forEach(sel => {
        const el = $(sel);
        if (el) el.addEventListener('dblclick', () => startReadingAt(sel));
    });

    $('#btn-copy-modal').addEventListener('click', () => {
        // アクティブなタブの元テキストをコピー（MD 表示時も記号付き原文を保持）
        const el = $('#record-detail-content');
        const isCorr = $('#btn-tab-detail-corrected').classList.contains('result-tab-active');
        const content = (isCorr ? (el.dataset.corrected || '') : (el.dataset.raw || '')) || el.textContent || '';
        copyToClipboard(content).then((ok) => {
            showToast(ok ? t('records.copied') : t('records.copy_failed'), ok ? 'success' : 'error');
        });
    });

    // 履历页面内容区：关闭 / 复制
    $('#btn-close-content').addEventListener('click', () => {
        stopSpeaking();
        $('#record-content-panel').classList.add('hidden');
    });
    $('#btn-copy-content').addEventListener('click', () => {
        // アクティブなタブの元テキストをコピー（MD 表示時も記号付き原文を保持）
        const el = $('#record-content');
        const isCorr = $('#btn-tab-content-corrected').classList.contains('result-tab-active');
        const content = (isCorr ? (el.dataset.corrected || '') : (el.dataset.raw || '')) || el.textContent || '';
        copyToClipboard(content).then((ok) => {
            showToast(ok ? t('records.copied') : t('records.copy_failed'), ok ? 'success' : 'error');
        });
    });

    $('#record-detail-modal').addEventListener('click', (e) => {
        if (e.target === $('#record-detail-modal')) {
            stopSpeaking();
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

    // TTS エンジン変更で VibeVoice モデル設定の表示を切替
    const ttsEngineSel = $('#setting-tts-engine');
    if (ttsEngineSel) {
        ttsEngineSel.addEventListener('change', () => {
            config.tts_engine = ttsEngineSel.value;
            showVibevoiceModelSetting();
            renderGpuTtsDisplay();
        });
    }
    // ダッシュボード制御の VibeVoice モデル選択：即時 config 保存＋設定画面と同期
    const vvDashSel = $('#vv-model-select');
    if (vvDashSel) {
        vvDashSel.addEventListener('change', async () => {
            const v = vvDashSel.value;
            if ($('#setting-tts-vibevoice-model')) $('#setting-tts-vibevoice-model').value = v;
            config.tts_vibevoice_model = v;
            renderGpuTtsDisplay();
            try {
                await apiFetch(`${API_BASE}/config`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tts_vibevoice_model: v }),
                });
                showToast(t('toast.saved'), 'success');
            } catch (e) {
                showToast(t('toast.network_error') + ': ' + e.message, 'error');
            }
        });
    }
    // ダッシュボード制御の Kokoro 音声選択：即時 config 保存＋設定画面と同期
    const kkDashSel = $('#kk-voice-select');
    if (kkDashSel) {
        kkDashSel.addEventListener('change', async () => {
            const v = kkDashSel.value;
            if ($('#setting-tts-kokoro-voice')) $('#setting-tts-kokoro-voice').value = v;
            config.tts_kokoro_voice = v;
            renderGpuTtsDisplay();
            try {
                await apiFetch(`${API_BASE}/config`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tts_kokoro_voice: v }),
                });
                showToast(t('toast.saved'), 'success');
            } catch (e) {
                showToast(t('toast.network_error') + ': ' + e.message, 'error');
            }
        });
    }
    // 設定画面の VibeVoice モデル選択：ダッシュボード制御の選択肢に同期
    const vvSettingSel = $('#setting-tts-vibevoice-model');
    if (vvSettingSel) {
        vvSettingSel.addEventListener('change', () => {
            if ($('#vv-model-select')) $('#vv-model-select').value = vvSettingSel.value;
        });
    }

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

    // ログ履歴セクション：一覧更新 / 選択解除 / 表示タブ / 形式タブ / DL / コピー / 削除
    const btnRefreshLogs = $('#btn-refresh-logs');
    if (btnRefreshLogs) btnRefreshLogs.addEventListener('click', () => loadRealtimeLogs());
    const btnClearSel = $('#btn-clear-rtlog-select');
    if (btnClearSel) btnClearSel.addEventListener('click', () => clearRtlogSelect());
    $all('#rtlog-view-tabs .rtlog-tab').forEach(b => {
        b.addEventListener('click', () => {
            rtlogView = b.dataset.rtview;
            applyRtlogViewTabs();
            renderRtlogPanel();
        });
    });
    $all('#rtlog-format-tabs .rtlog-tab').forEach(b => {
        b.addEventListener('click', () => {
            rtlogFormat = b.dataset.rtfmt;
            applyRtlogViewTabs();
            renderRtlogData();
        });
    });
    const btnDownloadLog = $('#btn-download-log');
    if (btnDownloadLog) btnDownloadLog.addEventListener('click', () => downloadRealtimeLog());
    const btnCopyLog = $('#btn-copy-log');
    if (btnCopyLog) btnCopyLog.addEventListener('click', () => copyRealtimeLog());
    const btnDeleteLog = $('#btn-delete-log');
    if (btnDeleteLog) btnDeleteLog.addEventListener('click', () => deleteRealtimeLog());
}

// ---------------------------------------------------------------------------
// 初始化
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.lang = uiLanguage === 'zh' ? 'zh-CN' : uiLanguage;
    initNavigation();
    initReadmeSort();
    initChart();
    initEventListeners();
    initTrendResize();
    initAuth();
    setupAuthUI();
    populateModelSelect();
    fetchVibevoiceModelCatalog().then(() => renderVibevoiceModelList());
    fetchKokoroModelInfo().then(() => renderKokoroModelList());
    fetchPaddleocrModelCatalog().then(() => renderPaddleocrModelList());
    initTtsVibevoiceControl();
    connectWebSocket();
    loadStats();
    loadRecords();
    setInterval(updateClock, 1000);
    updateClock();
    // 変換リアルタイム監視のティック（変換中のみ 4 つの時間を滑らかに増加表示）
    setInterval(updateConversionMonitor, 250);
    applyI18n();
    initRealtimeLogState();
});
