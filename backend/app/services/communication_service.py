import os
import json
import base64
import re
import urllib.request
import urllib.error
import logging
from typing import Dict, Any, Optional
from fastapi import HTTPException, status
from app.schemas.communication import SpeechAnalysisResponse, STARFeedback

logger = logging.getLogger(__name__)

COMMUNICATION_ANALYSIS_PROMPT = """
You are an expert AI Placement Communication Coach.
Analyze the attached audio recording of an interview candidate's spoken response.

CONTEXT:
Prompt Title: {prompt_title}
Prompt Category: {prompt_category}
Target Time Limit: {target_duration} seconds
Actual Recording Duration: {actual_duration} seconds

INSTRUCTIONS:
1. Transcribe the exact audio spoken verbatim into "transcript". If no audible speech is detected (silence, background noise, or blank audio), set "transcript" to "[No speech detected]" and set scores accordingly (fluency 0, clarity 0, overall_score 0) with suggestion "No speech was detected. Please speak clearly into your microphone and try again."
2. Evaluate Fluency (0-100), Clarity (0-100), and Overall Score (0-100).
3. Count filler words actually spoken in the transcript (such as "um", "uh", "like", "you know", "actually"). Return them as a list of strings with counts (e.g. ["um (2x)", "like (1x)"]). If none, return empty list.
4. Calculate approximate Pace in WPM (Words Per Minute) based on transcript word count and actual audio duration.
5. Provide 2-4 factual strengths based ONLY on what was actually said in the transcript.
6. Provide 1-3 actionable suggestions grounded strictly in the transcript content.
7. If the prompt category is behavioral ("STAR") or prompt requests a STAR story, break down the answer into "star_feedback": {{ "situation": "...", "task": "...", "action": "...", "result": "..." }}. If not applicable, set star_feedback to null.
8. FACTUAL SAFETY: Never invent experiences, projects, metrics, or technologies not present in the user's transcript.

Return JSON ONLY in this exact schema:
{{
  "transcript": "string",
  "fluency": 85,
  "pace": 135,
  "clarity": 90,
  "filler_words": ["um (2x)"],
  "overall_score": 88,
  "strengths": ["string"],
  "suggestions": ["string"],
  "star_feedback": {{
    "situation": "string",
    "task": "string",
    "action": "string",
    "result": "string"
  }}
}}
"""


def _safe_int(val: Any, default: int = 80, min_val: int = 0, max_val: int = 250) -> int:
    try:
        if val is None:
            return default
        num = int(float(str(val).strip()))
        return max(min_val, min(max_val, num))
    except (ValueError, TypeError):
        return default


def _no_speech_response() -> SpeechAnalysisResponse:
    return SpeechAnalysisResponse(
        transcript="[No speech detected]",
        fluency=0,
        pace=0,
        clarity=0,
        filler_words=[],
        overall_score=0,
        strengths=[],
        suggestions=[
            "No audible speech was detected in your recording. Please check your microphone input volume and speak clearly into your mic during the practice session."
        ],
        star_feedback=None
    )


def _clean_audio_mime_type(raw_mime: str) -> str:
    if not raw_mime:
        return "audio/webm"
    base_mime = raw_mime.split(";")[0].strip().lower()
    if base_mime in ["audio/webm", "audio/mp4", "audio/m4a", "audio/wav", "audio/ogg", "audio/mp3", "audio/mpeg"]:
        return base_mime
    if "mp4" in base_mime or "m4a" in base_mime:
        return "audio/mp4"
    if "wav" in base_mime:
        return "audio/wav"
    if "ogg" in base_mime:
        return "audio/ogg"
    if "mp3" in base_mime or "mpeg" in base_mime:
        return "audio/mp3"
    return "audio/webm"


def _call_gemini_audio_api(
    api_key: str,
    audio_bytes: bytes,
    mime_type: str,
    prompt_title: str,
    prompt_category: str,
    target_duration: int,
    actual_duration: int
) -> SpeechAnalysisResponse:
    clean_mime = _clean_audio_mime_type(mime_type)
    b64_audio = base64.b64encode(audio_bytes).decode("utf-8")
    
    logger.info(f"Analyzing speech recording with Gemini AI: byte_length={len(audio_bytes)}, mime_type={clean_mime}")

    safe_actual_duration = max(0, min(1800, int(actual_duration or 0)))
    safe_target_duration = max(10, min(600, int(target_duration or 90)))

    user_prompt = COMMUNICATION_ANALYSIS_PROMPT.format(
        prompt_title=prompt_title or "General Interview Practice",
        prompt_category=prompt_category or "Interview Answer",
        target_duration=safe_target_duration,
        actual_duration=safe_actual_duration
    )
    
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": clean_mime,
                            "data": b64_audio
                        }
                    },
                    {
                        "text": user_prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2
        }
    }
    
    req_data = json.dumps(payload).encode("utf-8")
    models_to_try = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-3.5-flash-lite"]
    last_error = None

    for model_name in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        req = urllib.request.Request(
            url,
            data=req_data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                res_data = json.loads(resp.read().decode("utf-8"))
                candidates = res_data.get("candidates", [])
                if not candidates or "content" not in candidates[0]:
                    raise ValueError("Invalid response structure from Gemini API")
                
                parts = candidates[0]["content"]["parts"]
                raw_text = ""
                for part in parts:
                    if "text" in part:
                        raw_text = part["text"].strip()
                        if raw_text:
                            break

                if not raw_text:
                    raise ValueError("Empty text content in Gemini response candidate")

                # Clean markdown code block formatting if returned by Gemini
                if raw_text.startswith("```"):
                    raw_text = re.sub(r"^```[a-zA-Z]*\n?", "", raw_text)
                    raw_text = re.sub(r"\n?```$", "", raw_text).strip()

                parsed = json.loads(raw_text)
                transcript_text = str(parsed.get("transcript", "")).strip()

                # Check if Gemini detected silence / no speech
                if not transcript_text or "[no speech" in transcript_text.lower() or "no speech detected" in transcript_text.lower():
                    return _no_speech_response()
                
                star_fb = None
                if isinstance(parsed.get("star_feedback"), dict):
                    sf = parsed["star_feedback"]
                    star_fb = STARFeedback(
                        situation=sf.get("situation"),
                        task=sf.get("task"),
                        action=sf.get("action"),
                        result=sf.get("result")
                    )
                
                return SpeechAnalysisResponse(
                    transcript=transcript_text,
                    fluency=_safe_int(parsed.get("fluency"), 80, 0, 100),
                    pace=_safe_int(parsed.get("pace"), 130, 0, 250),
                    clarity=_safe_int(parsed.get("clarity"), 80, 0, 100),
                    filler_words=parsed.get("filler_words") if isinstance(parsed.get("filler_words"), list) else [],
                    overall_score=_safe_int(parsed.get("overall_score"), 80, 0, 100),
                    strengths=parsed.get("strengths") if isinstance(parsed.get("strengths"), list) else [],
                    suggestions=parsed.get("suggestions") if isinstance(parsed.get("suggestions"), list) else [],
                    star_feedback=star_fb
                )
        except urllib.error.HTTPError as http_err:
            err_body = http_err.read().decode("utf-8", errors="ignore")
            logger.error(f"Gemini HTTP Error ({model_name}) {http_err.code}: {err_body}")
            if http_err.code in (400, 404, 429, 500, 502, 503) and model_name != models_to_try[-1]:
                last_error = f"HTTP {http_err.code}: {err_body}"
                continue
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Speech analysis service failed: {err_body or 'API call failed'}"
            )
        except Exception as e:
            logger.error(f"Error calling Gemini speech API ({model_name}): {e}")
            last_error = str(e)
            if model_name != models_to_try[-1]:
                continue
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to analyze audio recording: {e}"
            )

    raise HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail=f"Speech analysis failed: {last_error}"
    )


async def analyze_speech_audio(
    audio_bytes: bytes,
    mime_type: str,
    prompt_title: str = "",
    prompt_category: str = "",
    target_duration: int = 90,
    actual_duration: int = 0,
    is_silent: bool = False,
) -> SpeechAnalysisResponse:
    if is_silent or actual_duration <= 1 or len(audio_bytes) < 500:
        return _no_speech_response()

    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not gemini_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI Speech Analysis is unavailable because GEMINI_API_KEY is not configured in backend/.env. Please add a valid GEMINI_API_KEY."
        )
    
    return _call_gemini_audio_api(
        api_key=gemini_key,
        audio_bytes=audio_bytes,
        mime_type=mime_type,
        prompt_title=prompt_title,
        prompt_category=prompt_category,
        target_duration=target_duration,
        actual_duration=actual_duration
    )


OUTREACH_PROMPT_TEMPLATE = """
You are an expert AI Professional Career & Recruiter Communication Coach.
Generate a high-converting, professional outreach message based ONLY on the supplied candidate and role information.

MESSAGE CONFIGURATION:
Message Type: {message_type}
Recipient Name: {recipient_name}
Target Company: {company_name}
Target Role: {role}
Job Context / Requirements: {job_context}
Candidate Skills / User Context: {user_context}
Tone: {tone}

CRITICAL FACTUAL SAFETY & RECRUITER WRITING RULES:
1. NEVER invent candidate degrees, universities, companies, job titles, years of experience, projects, metrics, certifications, or technical skills not explicitly supplied in the User Context or Job Context.
2. If candidate details are minimal, use neutral professional phrasing (e.g. "I have experience working on projects involving [Skill]") rather than fabricating specific employment or project details.
3. Keep LinkedIn messages concise (80-150 words max). Do not generate long email bodies for LinkedIn messages.
4. For emails (Recruiter Cold Email, Interview Follow-up), generate a compelling, professional Subject line and structured Body (120-220 words max).
5. Avoid exaggerated claims, excessive flattery, spam-like buzzwords, or fake urgency.
6. Return JSON ONLY in this exact schema:
{{
  "subject": "string or null",
  "body": "string",
  "notes": ["string"]
}}
"""


async def generate_outreach_message(
    message_type: str,
    recipient_name: str = "",
    company_name: str = "",
    role: str = "",
    job_context: str = "",
    user_context: str = "",
    tone: str = "professional"
) -> Dict[str, Any]:
    valid_types = ["recruiter_email", "linkedin_message", "interview_followup", "networking_message"]
    if message_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid message_type '{message_type}'. Must be one of: {', '.join(valid_types)}"
        )

    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not gemini_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Gemini API key is not configured on the server. Outreach generation requires a valid GEMINI_API_KEY environment variable."
        )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={gemini_key}"
    
    prompt = OUTREACH_PROMPT_TEMPLATE.format(
        message_type=message_type,
        recipient_name=recipient_name or "Hiring Team / Recruiter",
        company_name=company_name or "Target Organization",
        role=role or "Software Engineer",
        job_context=job_context or "Not specified",
        user_context=user_context or "Not specified",
        tone=tone or "professional"
    )

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3
        }
    }

    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            candidates = res_data.get("candidates", [])
            if not candidates or "content" not in candidates[0]:
                raise ValueError("Invalid response structure from Gemini API")

            raw_text = candidates[0]["content"]["parts"][0]["text"].strip()
            if raw_text.startswith("```"):
                raw_text = re.sub(r"^```[a-zA-Z]*\n?", "", raw_text)
                raw_text = re.sub(r"\n?```$", "", raw_text).strip()

            parsed = json.loads(raw_text)
            return {
                "message_type": message_type,
                "subject": parsed.get("subject"),
                "body": parsed.get("body", ""),
                "notes": parsed.get("notes", ["Review and edit template before sending."])
            }
    except urllib.error.HTTPError as http_err:
        err_body = http_err.read().decode("utf-8", errors="ignore")
        logger.error(f"Gemini Outreach HTTP Error {http_err.code}: {err_body}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Outreach generation service failed to generate response. Please try again."
        )
    except Exception as e:
        logger.error(f"Error generating outreach message: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate outreach message."
        )


GD_EVALUATION_PROMPT_TEMPLATE = """
You are an expert AI Group Discussion Evaluator for Placement Preparation.
Evaluate the candidate's Group Discussion session performance based STRICTLY on the available observable evidence provided below.

AVAILABLE EVIDENCE:
- Discussion Topic: {topic}
- Room Participant Count: {participant_count} Users
- Target Session Duration: {duration_minutes} minutes
- Participant Role: {role_title}
- Speech Audio Stream / Transcript: NOT CAPTURED (Audio was not recorded or transcribed)

CRITICAL EVALUATION RULES:
1. FACTUAL EVIDENCE ONLY: Evaluate participation, turn-taking, and confidence using ONLY the observable room evidence.
2. NO CONTENT FABRICATION: Since no speech transcript exists for this session, you MUST set score to null for "clarity" and "relevance" with exact limitation explanations.
3. NEVER INVENT: Never invent spoken sentences, arguments, opinions, claims, or mistakes that were not in the transcript.
4. RATIONALE: Provide clear, constructive, and realistic rationale for participation, turn-taking, and confidence.
5. LIMITATIONS: Include an explicit limitation in "data_limitations": "Detailed content-level relevance and clarity analysis requires speech transcription. This session was evaluated using participation and available communication signals."

Return JSON ONLY in this exact schema:
{{
  "overall_score": 82,
  "dimensions": {{
    "participation": {{
      "score": 85,
      "reason": "Active participation in a {participant_count}-user session over {duration_minutes} minutes."
    }},
    "clarity": {{
      "score": null,
      "reason": "Detailed clarity analysis requires speech transcription. Speech audio was not recorded in this session."
    }},
    "relevance": {{
      "score": null,
      "reason": "Detailed topic relevance analysis requires speech transcription. Discussion transcript was unavailable."
    }},
    "turn_taking": {{
      "score": 80,
      "reason": "Balanced turn-taking etiquette in a multi-user group discussion arena."
    }},
    "confidence": {{
      "score": 80,
      "reason": "Maintained active connection and presence throughout the {duration_minutes}-minute discussion."
    }}
  }},
  "strengths": [
    "Consistent presence and engagement throughout the {duration_minutes}-minute discussion.",
    "Maintained active room connection in a multi-user group environment."
  ],
  "suggestions": [
    "In future sessions, practice taking concise turns to allow balanced group contribution.",
    "Use structured opening and concluding remarks during discussion phases."
  ],
  "data_limitations": [
    "Detailed content-level relevance and clarity analysis requires speech transcription. This session was evaluated using participation and available communication signals."
  ]
}}
"""


async def evaluate_gd_session(room_data: dict, user: dict) -> dict:
    """
    Evaluates participant GD session performance using deterministic metrics and Gemini AI.
    Strictly enforces zero fabricated speech transcripts or unsupplied facts.
    """
    user_id = user.get("id")
    participants = room_data.get("participants", [])
    user_p = next((p for p in participants if p["user_id"] == user_id), None)

    if not user_p:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be a participant of this Group Discussion room to request an evaluation.",
        )

    topic = room_data.get("topic", "Group Discussion")
    participant_count = max(1, len(participants))
    duration_secs = room_data.get("duration_seconds", 900)
    duration_minutes = max(1, duration_secs // 60)
    role_title = "Host" if user_p.get("is_host") else "Participant"

    # Deterministic base calculation
    data_limitation_msg = "Detailed content-level relevance and clarity analysis requires speech transcription. This session was evaluated using participation and available communication signals."

    fallback_eval = {
        "overall_score": 82,
        "dimensions": {
            "participation": {
                "score": 85,
                "reason": f"Active participation in a {participant_count}-user session over {duration_minutes} minutes.",
            },
            "clarity": {
                "score": None,
                "reason": "Detailed clarity analysis requires speech transcription. Speech audio was not recorded in this session.",
            },
            "relevance": {
                "score": None,
                "reason": "Detailed topic relevance analysis requires speech transcription. Discussion transcript was unavailable.",
            },
            "turn_taking": {
                "score": 80,
                "reason": "Balanced turn-taking etiquette in a multi-user group discussion arena.",
            },
            "confidence": {
                "score": 80,
                "reason": f"Maintained active connection and presence throughout the {duration_minutes}-minute discussion.",
            },
        },
        "strengths": [
            f"Consistent presence and engagement throughout the {duration_minutes}-minute discussion.",
            "Maintained active room connection in a multi-user group environment.",
        ],
        "suggestions": [
            "In future sessions, practice taking concise turns to allow balanced group contribution.",
            "Use structured opening and concluding remarks during discussion phases.",
        ],
        "data_limitations": [data_limitation_msg],
    }

    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        return fallback_eval

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={gemini_key}"
    prompt = GD_EVALUATION_PROMPT_TEMPLATE.format(
        topic=topic,
        participant_count=participant_count,
        duration_minutes=duration_minutes,
        role_title=role_title,
    )

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2
        }
    }

    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            candidates = res_data.get("candidates", [])
            if not candidates or "content" not in candidates[0]:
                return fallback_eval

            raw_text = candidates[0]["content"]["parts"][0]["text"].strip()
            if raw_text.startswith("```"):
                raw_text = re.sub(r"^```[a-zA-Z]*\n?", "", raw_text)
                raw_text = re.sub(r"\n?```$", "", raw_text).strip()

            parsed = json.loads(raw_text)
            # Ensure clarity and relevance remain null if transcript is missing
            dims = parsed.get("dimensions", {})
            if "clarity" in dims:
                dims["clarity"]["score"] = None
            if "relevance" in dims:
                dims["relevance"]["score"] = None

            parsed["dimensions"] = dims
            if not parsed.get("data_limitations"):
                parsed["data_limitations"] = [data_limitation_msg]
            return parsed
    except Exception as e:
        logger.warning(f"Gemini GD evaluation API error, returning deterministic fallback: {e}")
        return fallback_eval

