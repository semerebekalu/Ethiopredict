#!/usr/bin/env python3
"""
EthioPredict AI Analysis Generator — uses Groq (Llama3, free tier).

Setup:
  1. Get a free Groq API key at https://console.groq.com
  2. Add to ethiopredict/.env.local:  GROQ_API_KEY=your_key_here
  3. Add to GitHub Secrets as GROQ_API_KEY for the daily Action

Run manually:
  python scripts/generate_analysis.py
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

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL   = "llama3-8b-8192"

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

# ─── Helpers ──────────────────────────────────────────────────────────────────

def ts_str(v: str) -> str:
    return json.dumps(v, ensure_ascii=False)

# ─── Groq API ─────────────────────────────────────────────────────────────────

def call_groq(prompt: str) -> str | None:
    if not GROQ_API_KEY:
        return None
    payload = {
        "model": GROQ_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 700,
    }
    try:
        body = json.dumps(payload).encode()
        req = Request(GROQ_URL, data=body, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {GROQ_API_KEY}",
        })
        with urlopen(req, timeout=30) as r:
            data = json.loads(r.read())
            return data["choices"][0]["message"]["content"]
    except HTTPError as e:
        body_text = e.read().decode() if hasattr(e, 'read') else ''
        print(f"  ⚠ Groq HTTP {e.code}: {body_text[:200]}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"  ⚠ Groq error: {e}", file=sys.stderr)
        return None

# ─── Parse predictions.ts ─────────────────────────────────────────────────────

def load_predictions() -> list[dict]:
    if not PRED_FILE.exists():
        return []
    content = PRED_FILE.read_text(encoding="utf-8")
    predictions = []
    blocks = re.findall(r'\{[^{}]+\}', content, re.DOTALL)
    for block in blocks:
        pred = {}
        for key in ["id", "league", "leagueName", "home", "away", "tip", "tipType",
                    "odds", "confidence", "homeLogoUrl", "awayLogoUrl"]:
            m = re.search(rf'{key}:\s*"([^"]*)"', block)
            if m:
                val = m.group(1)
                if key == "confidence":
                    try: pred[key] = int(val)
                    except: pred[key] = 0
                else:
                    pred[key] = val
        m = re.search(r'confidence:\s*(\d+)', block)
        if m:
            pred["confidence"] = int(m.group(1))
        for fkey in ["homeForm", "awayForm"]:
            fm = re.search(rf'{fkey}:\s*\[([^\]]+)\]', block)
            if fm:
                pred[fkey] = [v.strip().strip('"') for v in fm.group(1).split(',')]
        if pred.get("home") and pred.get("away"):
            predictions.append(pred)
    return predictions

# ─── Article generation ───────────────────────────────────────────────────────

def generate_article(match: dict) -> dict | None:
    if not GROQ_API_KEY:
        return None

    home       = match.get("home", "")
    away       = match.get("away", "")
    league     = match.get("leagueName", "")
    tip        = match.get("tip", "")
    tip_type   = match.get("tipType", "")
    odds       = match.get("odds", "")
    confidence = match.get("confidence", 0)

    prompt = f"""You are a football analyst for EthioPredict, an Ethiopian football tips website.

Match: {home} vs {away} ({league})
Our tip: {tip} ({tip_type}) @ {odds} odds — {confidence}% confidence

Write in plain text only (no markdown, no asterisks, no unicode escapes):
- English title (max 10 words)
- English excerpt (2 sentences about the match)
- English article body (3 short paragraphs: team form, head-to-head history, prediction reasoning)
- Amharic title (translation)
- Amharic excerpt (translation)
- Amharic article body (translation)

Respond in EXACTLY this format with no extra text:
TITLE_EN: [title]
EXCERPT_EN: [excerpt]
BODY_EN: [body]
TITLE_AM: [title]
EXCERPT_AM: [excerpt]
BODY_AM: [body]"""

    text = call_groq(prompt)
    if not text:
        return None

    def extract(pattern):
        m = re.search(pattern, text, re.DOTALL)
        return m.group(1).strip() if m else ""

    result = {
        "titleEn":   extract(r'TITLE_EN:\s*(.+)'),
        "excerptEn": extract(r'EXCERPT_EN:\s*(.+)'),
        "bodyEn":    extract(r'BODY_EN:\s*([\s\S]+?)(?=TITLE_AM:|$)'),
        "titleAm":   extract(r'TITLE_AM:\s*(.+)'),
        "excerptAm": extract(r'EXCERPT_AM:\s*(.+)'),
        "bodyAm":    extract(r'BODY_AM:\s*([\s\S]+?)$'),
    }

    # Return None if parsing failed
    if not result["titleEn"] or not result["bodyEn"]:
        return None

    return result

# ─── Template fallback ────────────────────────────────────────────────────────

def template_article(match: dict) -> dict:
    home       = match.get("home", "Home")
    away       = match.get("away", "Away")
    league     = match.get("leagueName", "")
    tip        = match.get("tip", "")
    odds       = match.get("odds", "")
    confidence = match.get("confidence", 0)
    home_form  = match.get("homeForm", [])
    away_form  = match.get("awayForm", [])

    form_map = {"w": "W", "d": "D", "l": "L"}
    hf = " ".join(form_map.get(f, "?") for f in home_form[-5:])
    af = " ".join(form_map.get(f, "?") for f in away_form[-5:])

    body_en = (
        f"{home} take on {away} in {league}. "
        f"Recent form: {home} — {hf}, {away} — {af}.\n\n"
        f"Head-to-head records and current form both point towards an interesting contest. "
        f"Both sides have shown quality in recent weeks.\n\n"
        f"Our analysts back {tip} at odds of {odds}. Confidence: {confidence}%. "
        f"Place your bet on 1xBet or Melbet. Always bet responsibly."
    )
    body_am = (
        f"{home} እና {away} በ{league} ይፋለማሉ። "
        f"የቅርብ ቅርፅ: {home} — {hf}, {away} — {af}።\n\n"
        f"ፊት ለፊት ሪከርድ እና የቅርብ ቅርፅ ሁለቱም ወደ አስደሳች ጨዋታ ያመለክታሉ።\n\n"
        f"ምክራችን {tip} በ{odds} ኦድስ ነው። የእምነት ደረጃ: {confidence}%። "
        f"ሁልጊዜ በኃላፊነት ይወርቁ።"
    )
    return {
        "titleEn":   f"{home} vs {away}: Match Preview & Prediction",
        "excerptEn": f"{home} host {away} in {league}. Our tip: {tip} at {odds} odds ({confidence}% confidence).",
        "bodyEn":    body_en,
        "titleAm":   f"{home} vs {away}: የጨዋታ ቅድመ-ዕይታ እና ትንበያ",
        "excerptAm": f"{home} ዛሬ {away}ን ያስተናግዳሉ። ምክራችን {tip} በ{odds} ኦድስ ({confidence}% እምነት)።",
        "bodyAm":    body_am,
    }

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print(f"\n✍️  EthioPredict analysis generator — {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}\n")

    if not GROQ_API_KEY:
        print("⚠️  GROQ_API_KEY not set — using template fallback.\n")
        print("   Get a free key at https://console.groq.com\n")

    predictions = load_predictions()
    if not predictions:
        print("  ⚠ No predictions found — run fetch_data.py first")
        return

    print(f"  Found {len(predictions)} predictions")
    top_matches = sorted(predictions, key=lambda p: p.get("confidence", 0), reverse=True)[:6]
    print(f"  Generating analysis for top {len(top_matches)} matches...\n")

    today    = datetime.now(timezone.utc)
    date_str = today.strftime("%b %d, %Y").lstrip("0").replace(" 0", " ")

    blog_posts = []
    for i, match in enumerate(top_matches):
        home       = match.get("home", "")
        away       = match.get("away", "")
        league_key = match.get("league", "epl")
        confidence = match.get("confidence", 0)

        print(f"  [{i+1}/{len(top_matches)}] {home} vs {away} ({confidence}%)...")

        article = generate_article(match) or template_article(match)

        # Small delay between Groq calls
        if i < len(top_matches) - 1:
            time.sleep(1)

        emoji, tag  = LEAGUE_EMOJIS.get(league_key, ("⚽", "Football Analysis"))
        thumb_class = THUMB_CLASSES[i % len(THUMB_CLASSES)]

        blog_posts.append({
            "id":          f"blog-{today.strftime('%Y%m%d')}-{i+1:02d}",
            "tag":         tag,
            "titleEn":     article["titleEn"],
            "titleAm":     article["titleAm"],
            "excerptEn":   article["excerptEn"],
            "excerptAm":   article["excerptAm"],
            "bodyEn":      article.get("bodyEn", article["excerptEn"]),
            "bodyAm":      article.get("bodyAm", article["excerptAm"]),
            "date":        date_str,
            "readTime":    "4 min read",
            "thumbEmoji":  emoji,
            "thumbClass":  thumb_class,
            "homeTeam":    home,
            "awayTeam":    away,
            "homeLogoUrl": match.get("homeLogoUrl", ""),
            "awayLogoUrl": match.get("awayLogoUrl", ""),
        })

    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        f"// AUTO-GENERATED by scripts/generate_analysis.py — {now_str}",
        "import type { BlogPost } from '@/types';",
        "",
        "export const blogPosts: BlogPost[] = [",
    ]
    for post in blog_posts:
        lines += [
            "  {",
            f"    id: {ts_str(post['id'])},",
            f"    tag: {ts_str(post['tag'])},",
            f"    titleEn: {ts_str(post['titleEn'])},",
            f"    titleAm: {ts_str(post['titleAm'])},",
            f"    excerptEn: {ts_str(post['excerptEn'])},",
            f"    excerptAm: {ts_str(post['excerptAm'])},",
            f"    bodyEn: {ts_str(post['bodyEn'])},",
            f"    bodyAm: {ts_str(post['bodyAm'])},",
            f"    date: {ts_str(post['date'])},",
            f"    readTime: {ts_str(post['readTime'])},",
            f"    thumbEmoji: {ts_str(post['thumbEmoji'])},",
            f"    thumbClass: {ts_str(post['thumbClass'])},",
            f"    homeTeam: {ts_str(post['homeTeam'])},",
            f"    awayTeam: {ts_str(post['awayTeam'])},",
            f"    homeLogoUrl: {ts_str(post['homeLogoUrl'])},",
            f"    awayLogoUrl: {ts_str(post['awayLogoUrl'])},",
            "  },",
        ]
    lines += ["];", ""]
    BLOG_FILE.write_text("\n".join(lines), encoding="utf-8")
    print(f"\n  ✓ blog.ts — {len(blog_posts)} articles")
    print("\n✅ Done!\n")

if __name__ == "__main__":
    main()
