#!/bin/bash
# 单独启动 Dashboard（Linux）
# 注意：Dashboard 启动后会自动拉起 Whisper 服务（如果未运行）
# 用法：bash start_dashboard.sh

cd "$(dirname "$0")"

if [ -f "venv/bin/python" ]; then
    PY=venv/bin/python
elif [ -f ".venv/bin/python" ]; then
    PY=.venv/bin/python
else
    PY=python3
fi

export PYTHONUNBUFFERED=1
exec "$PY" -u dashboard/app.py
