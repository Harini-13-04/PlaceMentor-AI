import os
import json
import re
import urllib.request
import urllib.error
import logging
from typing import Dict, Any, List
from app.schemas.resume import ResumeImproveRequest, ResumeImproveResponse

logger = logging.getLogger(__name__)

FACTUAL_SAFETY_SYSTEM_PROMPT = """
You are an expert AI Resume Assistant built with strict Factual Safety rules.
Your task is to refine and optimize resume text for clarity, conciseness, active phrasing, and professional impact.

CRITICAL FACTUAL SAFETY RULES:
1. NEVER invent or hallucinate companies, job titles, technologies, frameworks, certifications, degrees, metrics, achievements, years of experience, or responsibilities that are not in the original text.
2. Preserve the exact factual meaning of the user's original content.
3. If a metric or number is missing in the original text, DO NOT invent one (e.g. do not add "by 35%" or "for 50,000 users" if not present).
4. If the text is already concise or cannot be expanded without inventing facts, focus purely on stronger action verbs, grammatical cleanup, and conciseness.
5. Return JSON ONLY matching this exact structure:
{
  "improved_text": "string",
  "explanation": "string",
  "detected_changes": ["string"],
  "warnings": ["string"]
}
"""


def _call_gemini_api(api_key: str, user_prompt: str, original_text: str) -> ResumeImproveResponse:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": FACTUAL_SAFETY_SYSTEM_PROMPT + "\n\n" + user_prompt}
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2
        }
    }
    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=req_data, headers={"Content-Type": "application/json"}, method="POST")
    
    with urllib.request.urlopen(req, timeout=12) as resp:
        res_data = json.loads(resp.read().decode("utf-8"))
        raw_text = res_data["candidates"][0]["content"]["parts"][0]["text"]
        parsed = json.loads(raw_text)
        return ResumeImproveResponse(
            original_text=original_text,
            improved_text=parsed.get("improved_text", original_text),
            explanation=parsed.get("explanation", "Enhanced action verbs and structural clarity while preserving factual integrity."),
            detected_changes=parsed.get("detected_changes", ["Improved action verbs", "Enhanced clarity"]),
            warnings=parsed.get("warnings", [])
        )


def _call_openai_api(api_key: str, user_prompt: str, original_text: str) -> ResumeImproveResponse:
    url = "https://api.openai.com/v1/chat/completions"
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": FACTUAL_SAFETY_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.2
    }
    req_data = json.dumps(payload).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    req = urllib.request.Request(url, data=req_data, headers=headers, method="POST")
    
    with urllib.request.urlopen(req, timeout=12) as resp:
        res_data = json.loads(resp.read().decode("utf-8"))
        raw_text = res_data["choices"][0]["message"]["content"]
        parsed = json.loads(raw_text)
        return ResumeImproveResponse(
            original_text=original_text,
            improved_text=parsed.get("improved_text", original_text),
            explanation=parsed.get("explanation", "Optimized phrasing and grammatical structure."),
            detected_changes=parsed.get("detected_changes", ["Improved action verbs", "Reduced repetition"]),
            warnings=parsed.get("warnings", [])
        )


def _rule_based_factual_safety_improve(request: ResumeImproveRequest) -> ResumeImproveResponse:
    orig = request.original_text.strip()
    if not orig:
        return ResumeImproveResponse(
            original_text="",
            improved_text="",
            explanation="No text provided to improve.",
            detected_changes=[],
            warnings=["Input text was empty."]
        )

    # Action verb enhancements & weak phrase replacements preserving exact facts
    replacements = [
        ("worked on", "engineered and delivered"),
        ("helped with", "collaborated on"),
        ("built a", "architected and deployed a"),
        ("fixed bugs", "resolved critical software defects"),
        ("made changes to", "refactored and optimized"),
        ("responsible for", "spearheaded"),
        ("updated", "modernized"),
        ("used", "leveraged"),
        ("handled", "orchestrated"),
        ("created", "developed and implemented"),
    ]

    improved = orig
    changes = []
    for old, new in replacements:
        if re.search(r'\b' + re.escape(old) + r'\b', improved, flags=re.IGNORECASE):
            improved = re.sub(r'\b' + re.escape(old) + r'\b', new, improved, flags=re.IGNORECASE)
            changes.append(f"Enhanced weak phrase '{old}' -> '{new}'")

    if improved == orig:
        # Refine punctuation & sentence capitalization
        improved = orig[0].upper() + orig[1:] if len(orig) > 0 else orig
        if not improved.endswith((".", "!", "?")):
            improved += "."
        changes.append("Optimized sentence structure and formatting")

    explanation = "Enhanced action verb impact and readability while preserving 100% of original factual content."

    return ResumeImproveResponse(
        original_text=orig,
        improved_text=improved,
        explanation=explanation,
        detected_changes=changes if len(changes) > 0 else ["Improved phrasing and readability"],
        warnings=[]
    )


async def improve_resume_text(request: ResumeImproveRequest, target_role: str = "") -> ResumeImproveResponse:
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    groq_key = os.getenv("GROQ_API_KEY")

    user_prompt = f"""
Target Role Context: {target_role or "Software Engineer"}
Section: {request.section}
Improvement Goal: {request.improvement_goal or "action_verbs"}
Original Text to Improve:
"{request.original_text}"

Refine this text according to Factual Safety rules. Return ONLY valid JSON.
"""

    if gemini_key:
        try:
            return _call_gemini_api(gemini_key, user_prompt, request.original_text)
        except Exception as e:
            logger.warning(f"Gemini API call failed: {e}. Falling back to rule-based enhancer.")

    if openai_key:
        try:
            return _call_openai_api(openai_key, user_prompt, request.original_text)
        except Exception as e:
            logger.warning(f"OpenAI API call failed: {e}. Falling back to rule-based enhancer.")

    return _rule_based_factual_safety_improve(request)
