# 以管理员身份运行此脚本，放行 Whisper API 9000 端口
New-NetFirewallRule -DisplayName "Whisper API 9000" -Direction Inbound -Protocol TCP -LocalPort 9000 -Action Allow -Profile Any
Write-Host "防火墙规则已添加：允许任意来源访问 TCP 9000 端口" -ForegroundColor Green
pause
