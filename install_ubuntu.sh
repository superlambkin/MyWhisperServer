#!/bin/bash
# =============================================================================
# MyWhisperServer Ubuntu 安装脚本
# 支持 GPU（NVIDIA CUDA）和 CPU 两种模式
# 用法：
#   bash install_ubuntu.sh          # 自动检测，优先 GPU
#   bash install_ubuntu.sh --cpu    # 强制 CPU 模式
# =============================================================================

set -e

cd "$(dirname "$0")"

echo "=================================================="
echo " MyWhisperServer Ubuntu 安装"
echo "=================================================="

# ---- 参数解析 ----
CPU_MODE=0
for arg in "$@"; do
    case "$arg" in
        --cpu) CPU_MODE=1 ;;
        *) echo "未知参数: $arg (忽略)" ;;
    esac
done

# ---- 系统依赖 ----
echo ""
echo "[1/5] 安装系统依赖..."
sudo apt update
sudo apt install -y \
    python3 python3-venv python3-pip \
    ffmpeg \
    build-essential

# ---- GPU 检测 ----
echo ""
echo "[2/5] 检测 NVIDIA GPU..."
HAS_GPU=0
if command -v nvidia-smi >/dev/null 2>&1; then
    nvidia-smi
    HAS_GPU=1
fi

if [ "$CPU_MODE" -eq 1 ]; then
    HAS_GPU=0
    echo ">>> 已指定 CPU 模式"
elif [ "$HAS_GPU" -eq 0 ]; then
    echo ">>> 未检测到 nvidia-smi，将以 CPU 模式运行"
    echo ">>> 如需 GPU 加速，请安装 NVIDIA 驱动 + CUDA 后再运行本脚本"
fi

# ---- Python 虚拟环境 ----
echo ""
echo "[3/5] 创建 Python 虚拟环境..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate

echo "[4/5] 安装 Python 依赖（pip install -r requirements.txt）..."
pip install --upgrade pip

if [ "$HAS_GPU" -eq 1 ]; then
    echo ">>> GPU 模式：安装 CUDA 版本 PyTorch"
    pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121
    pip install -r requirements.txt
else
    echo ">>> CPU 模式：安装 CPU 版本 PyTorch"
    pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
    pip install -r requirements.txt
fi

# ---- 设置可执行权限 ----
echo ""
echo "[5/5] 设置脚本权限..."
chmod +x start_all.sh start_dashboard.sh start_whisper.sh stop_all.sh

# ---- 生成 CPU 模式配置 ----
if [ "$HAS_GPU" -eq 0 ]; then
    echo ">>> 写入 CPU 模式环境变量提示（如需持久化请 export 到 shell 配置）"
    echo "    在启动前执行：export WHISPER_COMPUTE_TYPE=int8"
fi

echo ""
echo "=================================================="
echo " 安装完成！"
echo " 启动： bash start_all.sh"
echo " 访问： http://<本机IP>:9001"
echo "=================================================="
