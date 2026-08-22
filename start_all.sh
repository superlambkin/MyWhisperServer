#!/bin/bash
# 一键启动：Dashboard（会自动拉起 Whisper 服务）
# Linux 版本：直接前台运行 Dashboard，Ctrl+C 停止
# 用法：bash start_all.sh

cd "$(dirname "$0")"
exec bash start_dashboard.sh
