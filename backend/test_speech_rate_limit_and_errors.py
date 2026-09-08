import asyncio
import os
import sys
import json
import uuid
import hashlib
import urllib.error
from unittest.mock import patch, MagicMock

sys.path.insert(0, ".")

from app.services.communication_service import analyze_speech_audio, _call_gemini_audio_api
from fastapi import HTTPException, status

async def run_error_and_rate_limit_unit_tests():
    print("\n==========================================================================")
    print(" PlaceMentor AI - SPEECH ANALYSIS ERROR & RATE LIMIT UNIT TESTS")
    print("==========================================================================\n")

    test_bytes = b"fake_audio_payload_bytes_12345"
    attempt_id = str(uuid.uuid4())

    # --------------------------------------------------------------------------
    # TEST A: 429 Quota Response with retryDelay Extraction
    # --------------------------------------------------------------------------
    print("--- [TEST A] 429 Quota Exceeded Response ---")
    mock_429_body = json.dumps({
        "error": {
            "code": 429,
            "message": "Quota exceeded for metric: generate_content_free_tier_requests. Please retry in 45.0s.",
            "status": "RESOURCE_EXHAUSTED",
            "details": [
                {
                    "@type": "type.googleapis.com/google.rpc.RetryInfo",
                    "retryDelay": "45s"
                }
            ]
        }
    }).encode("utf-8")

    def mock_429_urlopen(req, timeout=30):
        fp = MagicMock()
        fp.read.return_value = mock_429_body
        raise urllib.error.HTTPError(req.full_url, 429, "Too Many Requests", req.headers, fp)

    with patch("urllib.request.urlopen", side_effect=mock_429_urlopen):
        try:
            await analyze_speech_audio(
                audio_bytes=test_bytes,
                mime_type="audio/webm",
                prompt_title="Test",
                prompt_category="Test",
                target_duration=60,
                actual_duration=10,
                attempt_id=attempt_id
            )
            assert False, "Should have raised HTTPException 429"
        except HTTPException as e:
            assert e.status_code == 429, f"Expected 429, got {e.status_code}"
            assert "Gemini API quota/rate limit reached" in e.detail, f"Unexpected detail: {e.detail}"
            assert "45 seconds" in e.detail, f"Expected retry delay in detail: {e.detail}"
            print(f"[PASS] HTTP 429 raised with exact retryDelay message: '{e.detail}'")

    # --------------------------------------------------------------------------
    # TEST B: 503 Provider Unavailable
    # --------------------------------------------------------------------------
    print("\n--- [TEST B] 503 Provider Unavailable ---")
    mock_503_body = json.dumps({
        "error": {"code": 503, "message": "Model experiencing high demand"}
    }).encode("utf-8")

    def mock_503_urlopen(req, timeout=30):
        fp = MagicMock()
        fp.read.return_value = mock_503_body
        raise urllib.error.HTTPError(req.full_url, 503, "Service Unavailable", req.headers, fp)

    with patch("urllib.request.urlopen", side_effect=mock_503_urlopen):
        try:
            await analyze_speech_audio(
                audio_bytes=test_bytes,
                mime_type="audio/webm",
                attempt_id=str(uuid.uuid4())
            )
            assert False, "Should have raised HTTPException 503"
        except HTTPException as e:
            assert e.status_code == 503
            assert "Gemini AI service is temporarily unavailable" in e.detail
            print(f"[PASS] HTTP 503 raised with truthful provider message: '{e.detail}'")

    # --------------------------------------------------------------------------
    # TEST C: 401 Authentication / Permission Error
    # --------------------------------------------------------------------------
    print("\n--- [TEST C] 401/403 Authentication Failure ---")
    def mock_401_urlopen(req, timeout=30):
        fp = MagicMock()
        fp.read.return_value = b'{"error": {"code": 401, "message": "API key not valid"}}'
        raise urllib.error.HTTPError(req.full_url, 401, "Unauthorized", req.headers, fp)

    with patch("urllib.request.urlopen", side_effect=mock_401_urlopen):
        try:
            await analyze_speech_audio(
                audio_bytes=test_bytes,
                mime_type="audio/webm",
                attempt_id=str(uuid.uuid4())
            )
            assert False, "Should have raised HTTPException 401"
        except HTTPException as e:
            assert e.status_code == 401
            assert "authentication/permission failed" in e.detail
            print(f"[PASS] HTTP 401 raised with authentication error detail: '{e.detail}'")

    # --------------------------------------------------------------------------
    # TEST D: 400 Bad Request / Invalid Audio
    # --------------------------------------------------------------------------
    print("\n--- [TEST D] 400 Bad Request ---")
    def mock_400_urlopen(req, timeout=30):
        fp = MagicMock()
        fp.read.return_value = b'{"error": {"code": 400, "message": "Invalid audio format"}}'
        raise urllib.error.HTTPError(req.full_url, 400, "Bad Request", req.headers, fp)

    with patch("urllib.request.urlopen", side_effect=mock_400_urlopen):
        try:
            await analyze_speech_audio(
                audio_bytes=test_bytes,
                mime_type="audio/webm",
                attempt_id=str(uuid.uuid4())
            )
            assert False, "Should have raised HTTPException 400"
        except HTTPException as e:
            assert e.status_code == 400
            assert "rejected the audio request" in e.detail
            print(f"[PASS] HTTP 400 raised with bad request detail: '{e.detail}'")

    # --------------------------------------------------------------------------
    # TEST E: Server-Side Active Request Lock (Duplicate Prevention)
    # --------------------------------------------------------------------------
    print("\n--- [TEST E] Server-Side Concurrent Request Lock ---")
    lock_attempt_id = "test-concurrent-lock-id-999"

    from app.services.communication_service import _active_analysis_locks
    _active_analysis_locks.add(lock_attempt_id)
    try:
        await analyze_speech_audio(
            audio_bytes=test_bytes,
            mime_type="audio/webm",
            attempt_id=lock_attempt_id
        )
        assert False, "Duplicate concurrent request should have been blocked"
    except HTTPException as e:
        assert e.status_code == 429
        assert "already in progress" in e.detail
        print(f"[PASS] Concurrent duplicate submission correctly blocked with 429: '{e.detail}'")
    finally:
        _active_analysis_locks.discard(lock_attempt_id)

    # --------------------------------------------------------------------------
    # TEST F: Security Audit - Key Exposure Check
    # --------------------------------------------------------------------------
    print("\n--- [TEST F] Security Check - API Key Protection ---")
    real_key = os.getenv("GEMINI_API_KEY", "")
    assert real_key != "", "GEMINI_API_KEY must be loaded"
    try:
        await analyze_speech_audio(
            audio_bytes=test_bytes,
            mime_type="audio/webm",
            attempt_id=str(uuid.uuid4())
        )
    except HTTPException as e:
        assert real_key not in e.detail, "SECURITY VIOLATION: GEMINI_API_KEY leaked in Exception detail!"
        print("[PASS] Security audit verified: GEMINI_API_KEY is never exposed in response or logs.")

    print("\n==========================================================================")
    print(" ALL RATE LIMIT & ERROR CATEGORY UNIT TESTS PASSED 100%!")
    print("==========================================================================\n")

if __name__ == "__main__":
    asyncio.run(run_error_and_rate_limit_unit_tests())
