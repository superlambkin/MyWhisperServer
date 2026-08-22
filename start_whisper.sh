#!/bin/bash
# 单独启动 Whisper 服务（Linux）
# 用法：bash start_whisper.sh

cd "$(dirname "$0")"

# 优先使用 venv 中的 Python，否则用系统 python3
if [ -f "venv/bin/python" ]; then
    PY=venv/bin/python
elif [ -f ".venv/bin/python" ]; then
    PY=.venv/bin/python
else
    PY=python3
fi

exec "$PY" -u whisper_server.py
