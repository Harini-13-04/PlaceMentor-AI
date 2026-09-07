"""
PlaceMentor AI — AI Mentor API Router
Mounts `/api/mentor` endpoints for real-time grounded RAG queries and topic exploration.
"""

from fastapi import APIRouter, HTTPException, status
from app.schemas.mentor import (
    MentorAskRequest,
    MentorAskResponse,
    MentorTopicsResponse,
)
from app.services.mentor_service import ask_mentor, get_topics_and_prompts
from app.rag.knowledge_base import get_all_chunks

router = APIRouter(prefix="/mentor", tags=["AI Mentor"])


@router.post("/ask", response_model=MentorAskResponse)
async def ask_ai_mentor(request: MentorAskRequest):
    """
    Execute end-to-end Grounded RAG query against PlaceMentor Knowledge Base.
    """
    if not request.question or not request.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question text cannot be empty.",
        )

    try:
        response = await ask_mentor(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Mentor service encountered an error: {str(e)}",
        )


@router.get("/topics", response_model=MentorTopicsResponse)
async def get_mentor_topics():
    """
    Retrieve curated knowledge topics, domains, and starter prompts.
    """
    try:
        return get_topics_and_prompts()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to load mentor topics: {str(e)}",
        )


@router.get("/health")
async def get_mentor_health():
    """
    Check RAG engine and knowledge base health status.
    """
    chunks = get_all_chunks()
    return {
        "status": "healthy",
        "service": "PlaceMentor RAG AI Mentor Engine",
        "knowledge_chunks_indexed": len(chunks),
        "rag_retriever_status": "ready",
    }
