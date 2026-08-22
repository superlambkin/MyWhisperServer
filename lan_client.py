import requests
import sys
from pathlib import Path


def transcribe(server_ip: str, audio_path: Path, language: str = "zh", output: str = "txt") -> str:
    url = f"http://{server_ip}:9000/asr"
    with open(audio_path, "rb") as f:
        files = {"audio_file": (audio_path.name, f)}
        data = {"language": language, "output": output}
        resp = requests.post(url, files=files, data=data, timeout=120)
        resp.raise_for_status()
        return resp.text


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(f"用法: python {sys.argv[0]} <服务器IP> <音频文件路径>")
        print(f"示例: python {sys.argv[0]} 192.168.0.88 test.mp3")
        sys.exit(1)

    server_ip = sys.argv[1]
    audio_path = Path(sys.argv[2])
    text = transcribe(server_ip, audio_path)
    print("转文字结果：")
    print(text)
