#!/usr/bin/env python3
"""
Post today's predictions to Telegram channel.
Reads TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID from environment.
Run after fetch_data.py in the GitHub Action.
"""
import json
import os
import re
import sys
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import URLError

BOT_TOKEN  = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip().replace('\n', '').replace('\r', '').replace(' ', '')
CHANNEL_ID_RAW = os.environ.get("TELEGRAM_CHANNEL_ID", "").strip().replace('\n', '').replace('\r', '')
# Add @ prefix if it's a username without it, unless it's a numeric ID
if CHANNEL_ID_RAW and not CHANNEL_ID_RAW.startswith("@") and not CHANNEL_ID_RAW.startswith("-"):
    CHANNEL_ID = f"@{CHANNEL_ID_RAW}"
else:
    CHANNEL_ID = CHANNEL_ID_RAW
PRED_FILE = Path(__file__).parent.parent / "src" / "data" / "predictions.ts"
AFFILIATE = "https://reffpa.com/L?tag=d_5554774m_97c_&site=5554774&ad=97"


def send_message(text: str) -> bool:
    if not BOT_TOKEN or not CHANNEL_ID:
        print("⚠ TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID not set", file=sys.stderr)
        return False
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = json.dumps({
        "chat_id": CHANNEL_ID,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }).encode()
    try:
        req = Request(url, data=payload, headers={"Content-Type": "application/json"})
        with urlopen(req, timeout=10) as r:
            return r.status == 200
    except URLError as e:
        print(f"⚠ Telegram error: {e}", file=sys.stderr)
        return False


def load_predictions() -> list[dict]:
    if not PRED_FILE.exists():
        return []
    content = PRED_FILE.read_text(encoding="utf-8")
    predictions = []
    blocks = re.findall(r'\{[^{}]+\}', content, re.DOTALL)
    for block in blocks:
        pred = {}
        for key in ["league", "leagueName", "home", "away", "tip", "tipType", "odds", "confidence", "time"]:
            m = re.search(rf'{key}:\s*"([^"]+)"', block)
            if m:
                pred[key] = m.group(1)
        m = re.search(r'confidence:\s*(\d+)', block)
        if m:
            pred["confidence"] = int(m.group(1))
        if pred.get("home") and pred.get("away"):
            predictions.append(pred)
    return predictions


def format_predictions(predictions: list[dict]) -> str:
    today_preds = [p for p in predictions if "Today" in p.get("time", "")]
    if not today_preds:
        today_preds = predictions

    lines = ["🔥 <b>EthioPredict — Today's Free Tips</b>\n"]
    for p in today_preds:
        conf = p.get("confidence", 0)
        conf_emoji = "🟢" if conf >= 75 else "🟡" if conf >= 55 else "🔴"
        lines.append(
            f"{conf_emoji} <b>{p.get('home')} vs {p.get('away')}</b>\n"
            f"🏆 {p.get('leagueName', '')}\n"
            f"⏰ {p.get('time', '')}\n"
            f"💡 Tip: <b>{p.get('tip')}</b> [{p.get('tipType')}]\n"
            f"📊 Odds: <b>{p.get('odds')}</b> | Confidence: <b>{conf}%</b>\n"
        )

    lines.append(f"🎯 <a href='{AFFILIATE}'>Bet on 1xBet — Get Bonus</a>")
    lines.append(f"\n📱 More tips: https://ethiopredict.vercel.app")
    lines.append("\n⚠️ 18+ | Bet Responsibly")
    return "\n".join(lines)


def main():
    print("📤 Posting predictions to Telegram...")
    print(f"  Token length: {len(BOT_TOKEN)}, Channel: {CHANNEL_ID}", file=sys.stderr)
    predictions = load_predictions()
    if not predictions:
        print("⚠ No predictions found")
        return
    message = format_predictions(predictions)
    if send_message(message):
        print(f"✅ Posted {len(predictions)} predictions to Telegram")
    else:
        print("❌ Failed to post to Telegram")


if __name__ == "__main__":
    main()
