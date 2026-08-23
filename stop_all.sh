#!/bin/bash
# 停止 Whisper 和 Dashboard 服务（Linux）
# 用法：bash stop_all.sh

echo "Stopping MyWhisperServer services..."

# 停止占用 9000 / 9001 / 9100 端口的进程
for port in 9000 9001 9100; do
    pids=$(ss -tlnp 2>/dev/null | awk -v port=":$port " '$4 ~ port {match($0, /pid=[0-9]+/); if (RSTART) print substr($0, RSTART+4, RLENGTH-4)}')
    if [ -n "$pids" ]; then
        for pid in $pids; do
            echo "  Stopping PID $pid (port $port)"
            kill "$pid" 2>/dev/null
        done
    fi
done

# 备用：按进程名停止
pkill -f "whisper_server.py" 2>/dev/null && echo "  Stopped whisper_server.py"
pkill -f "ocr_server.py" 2>/dev/null && echo "  Stopped ocr_server.py"
pkill -f "dashboard/app.py" 2>/dev/null && echo "  Stopped dashboard/app.py"

sleep 1
echo "Done."
