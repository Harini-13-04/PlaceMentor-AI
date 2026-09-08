import os
import json
import urllib.request
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

key = os.getenv("GEMINI_API_KEY")
print(f"Loaded Key: {key[:8]}...{key[-4:]}" if key else "NO KEY FOUND")

models = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-3.6-flash",
]

payload = {
    "contents": [{"parts": [{"text": "Hello, respond with JSON {\"status\":\"ok\"}"}]}],
    "generationConfig": {"responseMimeType": "application/json"}
}
req_data = json.dumps(payload).encode("utf-8")

for m in models:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={key}"
    req = urllib.request.Request(url, data=req_data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            print(f"[SUCCESS 200] Model {m} works! Response: {text.strip()}")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        print(f"[HTTP {e.code}] Model {m} error: {body[:150]}")
    except Exception as e:
        print(f"[ERROR] Model {m} error: {e}")
