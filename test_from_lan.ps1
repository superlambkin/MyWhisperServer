# 内网其他 Windows 电脑运行此脚本测试 Whisper 服务
param(
    [string]$ServerIP = "192.168.0.88",
    [string]$AudioFile = "test.mp3"
)

$uri = "http://${ServerIP}:9000/asr"

if (-not (Test-Path $AudioFile)) {
    Write-Host "未找到音频文件: $AudioFile" -ForegroundColor Red
    exit 1
}

Write-Host "正在发送音频到 $uri ..."

try {
    $result = Invoke-RestMethod -Uri $uri -Method Post -Form @{
        audio_file = Get-Item $AudioFile
        language = "zh"
        output = "txt"
    } -TimeoutSec 120
    Write-Host "转文字结果：" -ForegroundColor Green
    Write-Host $result
} catch {
    Write-Host "请求失败：$_" -ForegroundColor Red
}

pause
