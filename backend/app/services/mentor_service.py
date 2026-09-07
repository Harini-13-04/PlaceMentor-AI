"""
PlaceMentor AI — Mentor Service
Orchestrates knowledge base retrieval, context preparation, and grounded response generation.
"""

from typing import List, Dict, Any, Optional
from app.rag.retriever import get_retriever
from app.rag.generator import generate_mentor_response
from app.rag.knowledge_base import get_unique_topics, get_all_chunks
from app.schemas.mentor import (
    MentorAskRequest,
    MentorAskResponse,
    MentorSourceItem,
    MentorTopicsResponse,
    MentorTopicItem,
)


async def ask_mentor(request: MentorAskRequest) -> MentorAskResponse:
    retriever = get_retriever()

    context_dict = request.context.model_dump() if request.context else None
    history_list = [h.model_dump() for h in request.history] if request.history else None

    # Retrieve relevant knowledge chunks
    retrieved_chunks = retriever.retrieve(
        query=request.question,
        context=context_dict,
        top_k=3,
    )

    # Generate grounded response
    result = await generate_mentor_response(
        question=request.question,
        retrieved_chunks=retrieved_chunks,
        context=context_dict,
        history=history_list,
    )

    source_items = [
        MentorSourceItem(
            id=s["id"],
            title=s["title"],
            category=s["category"],
            relevance_score=s["relevance_score"],
            snippet=s["snippet"],
        )
        for s in result.get("sources", [])
    ]

    return MentorAskResponse(
        answer=result.get("answer", "I am here to guide your placement journey. Feel free to ask any technical or placement question."),
        sources=source_items,
        suggested_followups=result.get("suggested_followups", []),
        model_used=result.get("model_used", "PlaceMentor Grounded RAG"),
        status="success",
    )


def get_topics_and_prompts() -> MentorTopicsResponse:
    raw_topics = get_unique_topics()
    topic_items = [
        MentorTopicItem(
            id=t["id"],
            name=t["name"],
            category=t["category"],
            icon=t["icon"],
            description=t["description"],
            starter_prompts=t["starter_prompts"],
        )
        for t in raw_topics
    ]
    return MentorTopicsResponse(
        topics=topic_items,
        total_knowledge_chunks=len(get_all_chunks()),
    )
