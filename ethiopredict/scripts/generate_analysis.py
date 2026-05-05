#!/usr/bin/env python3
"""
EthioPredict AI Analysis Generator — uses Google Gemini free API.

What it does:
  1. Reads today's auto-generated predictions from src/data/predictions.ts
  2. Picks the top 6 matches by confidence score
  3. For each match, calls Gemini to write a short match analysis article
     in both English and Amharic
  4. Writes updated src/data/blog.ts

Setup:
  1. Get a free Gemini API key at https://aistudio.google.com/app/apikey
  2. Add to ethiopredict/.env.local:
       GEMINI_API_KEY=your_key_here
  3. Also add to Vercel environment variables (for production)

Run manually:
  python scripts/generate_analysis.py

The GitHub Action runs this automatically after fetch_data.py each morning.
"""

import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

# ─── Config ───────────────────────────────────────────────────────────────────

OUT_DIR   = Path(__file__).parent.parent / "src" / "data"
BLOG_FILE = OUT_DIR / "blog.ts"
PRED_FILE = OUT_DIR / "predictions.ts"

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.0-flash:generateContent?key={key}"
)

# Gradient classes for blog card thumbnails — cycles through these
THUMB_CLASSES = [
    "from-purple-900 to-purple-600",
    "from-blue-900 to-blue-600",
    "from-green-900 to-green-600",
    "from-orange-900 to-orange-600",
    "from-red-900 to-red-600",
    "from-indigo-900 to-indigo-600",
]

LEAGUE_EMOJIS = {
    "epl":        ("🏴󠁧󠁢󠁥󠁮󠁧󠁿", "EPL Analysis"),
    "ucl":        ("⭐", "Champions League"),
    "laliga":     ("🇪🇸", "La Liga"),
    "bundesliga": ("🇩🇪", "Bundesliga"),
    "seriea":     ("🇮🇹", "Serie A"),
    "ligue1":     ("🇫🇷", "Ligue 1"),
    "uel":        ("🟠", "Europa League"),
    "eth":        ("🇪🇹", "Ethiopian Premier League"),
}

# ─── HTTP helper ──────────────────────────────────────────────────────────────

def post_json(url: str, payload: dict, retries: int = 3) -> dict | None:
    for attempt in range(retries):
        try:
            body = json.dumps(payload).encode()
            req = Request(url, data=body, headers={
                "Content-Type": "application/json",
                "User-Agent": "EthioPredict/1.0",
            })
            with urlopen(req, timeout=30) as r:
                return json.loads(r.read())
        except HTTPError as e:
            if e.code == 429:
                wait = 10 * (attempt + 1)
                print(f"  ⏳ Rate limited — waiting {wait}s before retry {attempt+1}/{retries}...", file=sys.stderr)
                time.sleep(wait)
            else:
                print(f"  ⚠ HTTP error {e.code}: {e}", file=sys.stderr)
                return None
        except URLError as e:
            print(f"  ⚠ URL error: {e}", file=sys.stderr)
            return None
    print("  ⚠ Max retries reached", file=sys.stderr)
    return None

# ─── Parse predictions.ts to extract match data ───────────────────────────────

def load_predictions() -> list[dict]:
    if not PRED_FILE.exists():
        return []

    content = PRED_FILE.read_text(encoding="utf-8")

    # Extract each prediction object using regex
    predictions = []
    blocks = re.findall(r'\{[^{}]+\}', content, re.DOTALL)

    for block in blocks:
        pred = {}
        for key in ["id", "league", "leagueName", "home", "away", "tip", "tipType", "odds", "confidence"]:
            m = re.search(rf'{key}:\s*(["\d][^,\n]+)', block)
            if m:
                val = m.group(1).strip().strip('"').strip("'").rstrip(',')
                if key == "confidence":
                    try:
                        pred[key] = int(val)
                    except ValueError:
                        pred[key] = 0
                else:
                    pred[key] = val

        if pred.get("home") and pred.get("away"):
            predictions.append(pred)

    return predictions

# ─── Gemini API call ──────────────────────────────────────────────────────────

def generate_article(match: dict) -> dict | None:
    """
    Returns {"titleEn", "titleAm", "excerptEn", "excerptAm"} or None on failure.
    """
    if not GEMINI_API_KEY:
        print("  ⚠ GEMINI_API_KEY not set — using template fallback", file=sys.stderr)
        return None

    home = match.get("home", "")
    away = match.get("away", "")
    league = match.get("leagueName", "")
    tip = match.get("tip", "")
    tip_type = match.get("tipType", "")
    odds = match.get("odds", "")
    confidence = match.get("confidence", 0)

    prompt = f"""You are a football analyst writing for EthioPredict, an Ethiopian football prediction website.

Write a short match preview for: {home} vs {away} ({league})

Our prediction: {tip} ({tip_type}) @ {odds} odds — {confidence}% confidence

Write TWO things:
1. A punchy English title (max 10 words, no quotes)
2. An English excerpt (2-3 sentences, mention form, key players or tactical angle, and our tip)
3. An Amharic title (translation of the English title)
4. An Amharic excerpt (translation of the English excerpt)

Format your response EXACTLY like this (no extra text):
TITLE_EN: [title here]
EXCERPT_EN: [excerpt here]
TITLE_AM: [amharic title]
EXCERPT_AM: [amharic excerpt]"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 400,
        }
    }

    url = GEMINI_URL.format(key=GEMINI_API_KEY)
    response = post_json(url, payload)

    if not response:
        return None

    try:
        text = response["candidates"][0]["content"]["parts"][0]["text"]

        title_en  = re.search(r'TITLE_EN:\s*(.+)', text)
        excerpt_en = re.search(r'EXCERPT_EN:\s*(.+)', text)
        title_am  = re.search(r'TITLE_AM:\s*(.+)', text)
        excerpt_am = re.search(r'EXCERPT_AM:\s*(.+)', text)

        if not all([title_en, excerpt_en, title_am, excerpt_am]):
            print(f"  ⚠ Unexpected Gemini response format for {home} vs {away}", file=sys.stderr)
            return None

        return {
            "titleEn":   title_en.group(1).strip(),
            "excerptEn": excerpt_en.group(1).strip(),
            "titleAm":   title_am.group(1).strip(),
            "excerptAm": excerpt_am.group(1).strip(),
        }
    except (KeyError, IndexError) as e:
        print(f"  ⚠ Parse error: {e}", file=sys.stderr)
        return None

# ─── Template fallback (when no API key) ─────────────────────────────────────

def template_article(match: dict) -> dict:
    home = match.get("home", "Home")
    away = match.get("away", "Away")
    league = match.get("leagueName", "")
    tip = match.get("tip", "")
    odds = match.get("odds", "")
    confidence = match.get("confidence", 0)

    return {
        "titleEn":   f"{home} vs {away}: Match Preview & Prediction",
        "excerptEn": (
            f"{home} host {away} in {league} today. "
            f"Based on recent form and head-to-head analysis, our tip is {tip} at {odds} odds. "
            f"Confidence level: {confidence}%."
        ),
        "titleAm":   f"{home} vs {away}: የጨዋታ ቅድመ-ዕይታ እና ትንበያ",
        "excerptAm": (
            f"{home} ዛሬ {away}ን በ{league} ያስተናግዳሉ። "
            f"በቅርብ ቅርፅ እና ፊት ለፊት ትንተና ላይ በመመስረት ምክራችን {tip} በ{odds} ኦድስ ነው። "
            f"የእምነት ደረጃ: {confidence}%።"
        ),
    }

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print(f"\n✍️  EthioPredict analysis generator — {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}\n")

    if not GEMINI_API_KEY:
        print("⚠️  GEMINI_API_KEY not set. Add it to .env.local to enable AI generation.")
        print("   Using template fallback for now.\n")

    # Load today's predictions
    predictions = load_predictions()
    if not predictions:
        print("  ⚠ No predictions found — run fetch_data.py first")
        return

    print(f"  Found {len(predictions)} predictions")

    # Sort by confidence, pick top 6
    top_matches = sorted(predictions, key=lambda p: p.get("confidence", 0), reverse=True)[:6]
    print(f"  Generating analysis for top {len(top_matches)} matches...\n")

    today = datetime.now(timezone.utc)
    date_str = today.strftime("%b %-d, %Y") if sys.platform != "win32" else today.strftime("%b %d, %Y").replace(" 0", " ")

    blog_posts = []
    for i, match in enumerate(top_matches):
        home = match.get("home", "")
        away = match.get("away", "")
        league_key = match.get("league", "epl")
        confidence = match.get("confidence", 0)

        print(f"  [{i+1}/{len(top_matches)}] {home} vs {away} ({confidence}% confidence)...")

        # Try AI generation, fall back to template
        article = generate_article(match) or template_article(match)

        # Small delay between API calls to avoid rate limiting
        if i < len(top_matches) - 1:
            time.sleep(2)

        emoji, tag = LEAGUE_EMOJIS.get(league_key, ("⚽", "Football Analysis"))
        thumb_class = THUMB_CLASSES[i % len(THUMB_CLASSES)]

        # Estimate read time (roughly 200 words per minute, ~150 word article)
        read_time = "4 min read"

        blog_posts.append({
            "id": f"blog-{today.strftime('%Y%m%d')}-{i+1:02d}",
            "tag": tag,
            "titleEn": article["titleEn"],
            "titleAm": article["titleAm"],
            "excerptEn": article["excerptEn"],
            "excerptAm": article["excerptAm"],
            "date": date_str,
            "readTime": read_time,
            "thumbEmoji": emoji,
            "thumbClass": thumb_class,
        })

    # Write blog.ts
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        f"// AUTO-GENERATED by scripts/generate_analysis.py — {ts}",
        "// Articles generated by Google Gemini based on today's top predictions",
        "import type { BlogPost } from '@/types';",
        "",
        "export const blogPosts: BlogPost[] = [",
    ]

    for post in blog_posts:
        lines += [
            "  {",
            f"    id: {json.dumps(post['id'])},",
            f"    tag: {json.dumps(post['tag'])},",
            f"    titleEn: {json.dumps(post['titleEn'])},",
            f"    titleAm: {json.dumps(post['titleAm'])},",
            f"    excerptEn: {json.dumps(post['excerptEn'])},",
            f"    excerptAm: {json.dumps(post['excerptAm'])},",
            f"    date: {json.dumps(post['date'])},",
            f"    readTime: {json.dumps(post['readTime'])},",
            f"    thumbEmoji: {json.dumps(post['thumbEmoji'])},",
            f"    thumbClass: {json.dumps(post['thumbClass'])},",
            "  },",
        ]

    lines.append("];")
    lines.append("")

    BLOG_FILE.write_text("\n".join(lines), encoding="utf-8")
    print(f"\n  ✓ blog.ts — {len(blog_posts)} articles written")
    print("\n✅ Done!\n")

if __name__ == "__main__":
    main()
