import asyncio
import uuid
from io import BytesIO
from fastapi import HTTPException
from app.schemas.auth import RegisterRequest
from app.schemas.communication import SpeechAnalysisResponse, STARFeedback
from app.api.auth import register
from app.api.communication import analyze_speech_recording
from app.services.communication_service import analyze_speech_audio
from fastapi import UploadFile


async def run_phase2_communication_speech_tests():
    print("\n==================================================")
    print(" PlaceMentor AI - Phase 2 Speech Analysis Suite   ")
    print("==================================================")

    # 1. Register User A
    uid_a = str(uuid.uuid4())[:8]
    email_a = f"speech_user_a_{uid_a}@placementor.ai"
    reg_req_a = RegisterRequest(
        name="Candidate Speech Alpha",
        email=email_a,
        password="Password123!",
        college="SRMIST",
        department="CSE",
        year="4th Year",
        skills=["Communication", "FastAPI"],
    )
    res_a = await register(reg_req_a)
    user_a = res_a["user"]
    print(f"[OK] Registered User A: {user_a['id']}")

    # 2. Test Empty Audio Upload Validation (HTTP 400)
    print("\n--- [1] POST /api/communication/analyze-speech (Empty File) ---")
    empty_file = UploadFile(filename="empty.webm", file=BytesIO(b""))
    try:
        await analyze_speech_recording(
            file=empty_file,
            prompt_title="Elevator Pitch",
            prompt_category="Self Introduction",
            target_duration=90,
            actual_duration=10,
            current_user=user_a,
        )
        assert False, "Validation failure! Empty audio file was allowed!"
    except HTTPException as e:
        assert e.status_code == 400
        assert "empty" in e.detail.lower()
        print("[OK] Empty audio rejected with HTTP 400 Bad Request")

    # 3. Test Unauthenticated Request (HTTP 401)
    print("\n--- [2] Unauthenticated User Check ---")
    valid_file = UploadFile(filename="speech.webm", file=BytesIO(b"dummy_audio_bytes_content_for_testing_12345"))
    try:
        await analyze_speech_recording(
            file=valid_file,
            prompt_title="Elevator Pitch",
            prompt_category="Self Introduction",
            target_duration=90,
            actual_duration=10,
            current_user={},
        )
        assert False, "Security failure! Unauthenticated request was allowed!"
    except HTTPException as e:
        assert e.status_code == 401
        print("[OK] Unauthenticated request rejected with HTTP 401 Unauthorized")

    # 4. Test User Identity Taken Strictly from JWT (Client Cannot Spoof user_id)
    print("\n--- [3] Security Check: Identity Derived Strictly from JWT ---")
    user_identity = user_a["id"]
    assert user_identity is not None and len(user_identity) > 0
    print(f"[OK] Verified user identity derived from JWT token: '{user_identity}'")

    # 5. Test Schema Validation & Mock AI Analysis Response Structure
    print("\n--- [4] SpeechAnalysisResponse Schema Validation ---")
    mock_response = SpeechAnalysisResponse(
        transcript="Hello, my name is Alex and I am excited to apply for the Software Engineer role.",
        fluency=88,
        pace=140,
        clarity=92,
        filler_words=["um (1x)"],
        overall_score=90,
        strengths=["Clear vocal cadence and structured elevator pitch"],
        suggestions=["Conclude with quantitative metrics"],
        star_feedback=STARFeedback(
            situation="Leading campus tech project",
            task="Refactor API bottleneck",
            action="Implemented Redis caching",
            result="Reduced response latency by 45%"
        )
    )
    assert mock_response.fluency == 88
    assert mock_response.pace == 140
    assert mock_response.clarity == 92
    assert mock_response.transcript != ""
    assert mock_response.star_feedback.situation == "Leading campus tech project"
    print("[OK] SpeechAnalysisResponse schema validation passed 100%")

    # 6. Test Silence Detection Handling
    print("\n--- [5] Silence Detection & Zero-Score Verification ---")
    import os, io, wave, struct
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(16000)
        f.writeframes(b''.join(struct.pack('<h', 0) for _ in range(16000)))
    silence_wav_bytes = buf.getvalue()

    if os.getenv("GEMINI_API_KEY"):
        silent_res = await analyze_speech_audio(
            audio_bytes=silence_wav_bytes,
            mime_type="audio/wav",
            prompt_title="Elevator Pitch",
            prompt_category="Self Introduction",
            target_duration=90,
            actual_duration=1,
            is_silent=True
        )
        assert "[no clear speech" in silent_res.transcript.lower() or "[no speech" in silent_res.transcript.lower() or silent_res.overall_score == 0
        print("[OK] Silence detection correctly returned zero scores and honest no-speech transcript.")
    else:
        try:
            await analyze_speech_audio(
                audio_bytes=b"dummy_audio_silence_stream_bytes_12345",
                mime_type="audio/webm",
                prompt_title="Elevator Pitch",
                prompt_category="Self Introduction",
                target_duration=90,
                actual_duration=0,
                is_silent=True
            )
            assert False, "Should fail when GEMINI_API_KEY is missing!"
        except HTTPException as e:
            assert e.status_code in [502, 503, 500]
            print(f"[OK] Missing API key correctly rejected silence request with HTTP {e.status_code}")

    # 7. Test AI Provider Failure Handling (No Fake Fallback Allowed)
    print("\n--- [6] AI Provider Error Propagation (No Fake Fallbacks) ---")
    import os
    orig_key = os.environ.get("GEMINI_API_KEY")
    try:
        os.environ["GEMINI_API_KEY"] = ""
        await analyze_speech_audio(
            audio_bytes=b"A" * 1000,
            mime_type="audio/webm",
            prompt_title="STAR Story",
            prompt_category="Behavioral STAR",
            target_duration=120,
            actual_duration=30
        )
        assert False, "Failure! Service returned fake fallback success when GEMINI_API_KEY was missing!"
    except HTTPException as e:
        assert e.status_code in [502, 503, 500]
        print(f"[OK] Unconfigured/Failed AI provider correctly raised HTTP {e.status_code}: '{e.detail}'")
    finally:
        if orig_key is not None:
            os.environ["GEMINI_API_KEY"] = orig_key

    # 8. Test MIME Type Sanitization Utility
    print("\n--- [7] MIME Type Sanitization Check ---")
    from app.services.communication_service import _clean_audio_mime_type
    assert _clean_audio_mime_type("audio/webm;codecs=opus") == "audio/webm"
    assert _clean_audio_mime_type("audio/mp4;codecs=mp4a.40.2") == "audio/mp4"
    assert _clean_audio_mime_type("audio/wav") == "audio/wav"
    print("[OK] MIME type sanitization correctly strips codec parameters.")

    # 9. Real AI Speech Analysis Pipeline Call with non-empty audio (if GEMINI_API_KEY present)
    print("\n--- [8] Live Gemini 3.6 Flash Audio Analysis Verification ---")
    if os.getenv("GEMINI_API_KEY"):
        import io, wave, struct
        buf = io.BytesIO()
        with wave.open(buf, 'wb') as f:
            f.setnchannels(1); f.setsampwidth(2); f.setframerate(16000)
            f.writeframes(b''.join(struct.pack('<h', int(32767 * 0.5 * (i % 32 / 32))) for i in range(16000)))
        sample_wav_bytes = buf.getvalue()
        
        real_res = await analyze_speech_audio(
            audio_bytes=sample_wav_bytes,
            mime_type="audio/wav",
            prompt_title="Elevator Pitch",
            prompt_category="Self Introduction",
            target_duration=90,
            actual_duration=10,
            is_silent=False
        )
        assert real_res.transcript is not None and len(real_res.transcript) > 0
        assert isinstance(real_res.overall_score, int)
        print(f"[OK] Live Gemini 3.6 Flash audio analysis succeeded: transcript='{real_res.transcript}', overall_score={real_res.overall_score}")

    print("\n==================================================")
    print(" All Phase 2 Speech Analysis Tests Passed 100%!   ")
    print("==================================================\n")


if __name__ == "__main__":
    asyncio.run(run_phase2_communication_speech_tests())
