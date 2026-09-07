"""
PlaceMentor AI — Grounded LLM Generator & Multi-Tier Provider Cascade
Combines retrieved placement knowledge with user context and conversation history.
Supports Gemini API, OpenAI API, and Grounded Knowledge Synthesizer for 100% reliable local demos.
"""

import os
import json
import urllib.request
import urllib.error
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

GROUNDED_SYSTEM_PROMPT = """
You are PlaceMentor AI, the intelligent, expert placement preparation mentor for engineering students.
You provide clear, accurate, grounded, and actionable guidance for campus recruitments, DSA coding rounds,
speed aptitude, core CS technical interviews, behavioral STAR discussions, and resume optimization.

CRITICAL GROUNDING RULES:
1. Base your technical and factual claims firmly on the provided Grounding Knowledge Chunks.
2. When giving algorithms or coding solutions, provide clean, idiomatic code with clear variable names and exact time/space complexity analysis (Big-O).
3. If discussing company hiring bars (e.g. Amazon, Google, TCS), reference their specific interview criteria accurately.
4. If the user is currently debugging code in the Practice IDE, analyze their execution state, pinpoint potential off-by-one errors, boundary conditions, or time limit exceeded causes.
5. Format your response cleanly using GitHub-Flavored Markdown (headers, bullet points, bold key terms, fenced code blocks with language tags).
6. End with 1-2 actionable next steps or recommendations.
"""


def _build_context_prompt(
    question: str,
    retrieved_chunks: List[Dict[str, Any]],
    context: Optional[Dict[str, Any]] = None,
    history: Optional[List[Dict[str, str]]] = None,
) -> str:
    parts = []

    # 1. Retrieved Knowledge Chunks
    parts.append("=== GROUNDING KNOWLEDGE BASE CHUNKS ===")
    for idx, c in enumerate(retrieved_chunks):
        chunk_data = c.get("full_chunk", c)
        parts.append(
            f"--- Source [{idx + 1}]: {chunk_data.get('title', 'Knowledge Chunk')} ({chunk_data.get('category', 'General')}) ---\n"
            f"{chunk_data.get('content', '')}\n"
            f"Key Takeaway: {chunk_data.get('cheat_sheet', '')}\n"
        )

    # 2. User IDE / Session Context
    if context:
        parts.append("=== USER ACTIVE WORKSPACE CONTEXT ===")
        if context.get("problemTitle"):
            parts.append(f"Current Problem: {context['problemTitle']} (Topic: {context.get('problemTopic', 'General')})")
        if context.get("language"):
            parts.append(f"Selected Programming Language: {context['language']}")
        if context.get("executionStatus"):
            parts.append(f"Last Code Execution Status: {context['executionStatus']}")
        if context.get("errorMessage"):
            parts.append(f"Execution Error Output: {context['errorMessage']}")
        if context.get("code"):
            parts.append(f"User Code Draft:\n```{context.get('language', 'python')}\n{context['code'][:1200]}\n```")

    # 3. Conversation History
    if history and len(history) > 0:
        parts.append("=== RECENT CONVERSATION HISTORY ===")
        for msg in history[-4:]:
            sender = "User" if msg.get("sender") == "user" else "AI Mentor"
            parts.append(f"{sender}: {msg.get('text', '')}")

    # 4. User Question
    parts.append(f"=== CURRENT USER QUESTION ===\n{question}\n")
    parts.append("Please provide a thorough, structured, grounded response to the student's question.")

    return "\n\n".join(parts)


def _call_gemini(api_key: str, full_prompt: str) -> Optional[str]:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": GROUNDED_SYSTEM_PROMPT + "\n\n" + full_prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 1500,
        }
    }
    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=req_data, headers={"Content-Type": "application/json"}, method="POST")

    with urllib.request.urlopen(req, timeout=14) as resp:
        res_data = json.loads(resp.read().decode("utf-8"))
        return res_data["candidates"][0]["content"]["parts"][0]["text"]


def _call_openai(api_key: str, full_prompt: str) -> Optional[str]:
    url = "https://api.openai.com/v1/chat/completions"
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": GROUNDED_SYSTEM_PROMPT},
            {"role": "user", "content": full_prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 1500,
    }
    req_data = json.dumps(payload).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    req = urllib.request.Request(url, data=req_data, headers=headers, method="POST")

    with urllib.request.urlopen(req, timeout=14) as resp:
        res_data = json.loads(resp.read().decode("utf-8"))
        return res_data["choices"][0]["message"]["content"]


def _synthesize_grounded_offline_response(
    question: str,
    retrieved_chunks: List[Dict[str, Any]],
    context: Optional[Dict[str, Any]] = None,
) -> str:
    """
    High-accuracy deterministic synthesis engine using retrieved knowledge chunks
    and active problem context. Ensures 100% functional demo even without internet/API keys.
    """
    primary_chunk = retrieved_chunks[0]["full_chunk"] if retrieved_chunks else None
    secondary_chunk = retrieved_chunks[1]["full_chunk"] if len(retrieved_chunks) > 1 else None

    lines = []

    # Title & Topic alignment
    if primary_chunk:
        lines.append(f"### 💡 **{primary_chunk.get('title', 'Placement Guidance')}**")
        lines.append("")

    # If context has execution errors, address them immediately
    if context and context.get("executionStatus") and context.get("executionStatus") != "Accepted":
        status = context["executionStatus"]
        lines.append(f"⚠️ **Execution Diagnostic ({status}):**")
        if status == "Wrong Answer":
            lines.append("Your code produced an unexpected output on one or more test cases. Verify boundary conditions (e.g. empty lists, negative integers, single-element collections, duplicate values) and ensure return types strictly match requirements.")
        elif status in ["Runtime Error", "Compilation Error"]:
            lines.append("A syntax, index out-of-bounds, or type mismatch occurred during execution. Verify array indices, null/None checks, and variable scopes.")
        elif status == "Time Limit Exceeded":
            lines.append("Your current approach exceeds the allowed runtime constraint (typically O(n²) instead of O(n) or O(n log n)). Consider replacing nested loops with a HashMap or Two-Pointer technique.")
        lines.append("")

    # Core Grounded Knowledge Extraction
    if primary_chunk:
        content_text = primary_chunk.get("content", "").strip()
        lines.append(content_text)
        lines.append("")

        if primary_chunk.get("cheat_sheet"):
            lines.append(f"> **⚡ Placement Key Takeaway:** {primary_chunk['cheat_sheet']}")
            lines.append("")

    # Secondary Knowledge Connection if available
    if secondary_chunk:
        lines.append(f"#### 🔗 **Related Concept: {secondary_chunk.get('title')}**")
        snippet = secondary_chunk.get("content", "").strip().split("\n\n")[0]
        lines.append(snippet)
        lines.append("")

    # Specific question resolution & practical advice
    lines.append("#### 🎯 **Interview Best Practices & Actionable Steps:**")
    lines.append("1. **Explain your intuition first:** Never jump directly into writing code. State your data structure choices and why they optimize time/space complexity.")
    lines.append("2. **Walk through an example trace:** Manually trace a sample input through your logic before calling it complete.")
    lines.append("3. **Highlight Big-O Complexity:** Clearly state Worst-Case Time and Space requirements.")

    return "\n".join(lines)


def _generate_suggested_followups(
    question: str,
    retrieved_chunks: List[Dict[str, Any]],
    context: Optional[Dict[str, Any]] = None,
) -> List[str]:
    """Generate 2-3 dynamic follow-up prompts based on retrieved domain."""
    if not retrieved_chunks:
        return [
            "Explain the time and space complexity in detail.",
            "Can you provide a clean Python implementation?",
            "What are common edge cases for this pattern?"
        ]

    category = retrieved_chunks[0].get("category", "")

    if "DSA" in category or "Algorithms" in category:
        return [
            "What is the optimal Time and Space Complexity?",
            "Show me a step-by-step code implementation with edge cases.",
            "What are 3 similar LeetCode pattern questions I should practice next?"
        ]
    elif "Company" in category:
        return [
            "Give me a sample STAR answer tailored for this company.",
            "What are the most common coding topics asked in their screening round?",
            "How does their interview scoring rubric evaluate problem solving?"
        ]
    elif "Aptitude" in category:
        return [
            "Show me an example calculation using this shortcut method.",
            "What formulas apply when variables or efficiencies are unequal?",
            "Give me a 60-second speed trick for solving this in campus tests."
        ]
    elif "Core CS" in category:
        return [
            "What are the top 5 interview questions on this topic?",
            "How does this behave under high concurrency and scale?",
            "Explain this with a simple real-world analogy."
        ]
    elif "Behavioral" in category:
        return [
            "How do I structure my answer using the STAR method?",
            "What metrics should I emphasize in my Result section?",
            "Give me another example response for a team conflict scenario."
        ]
    else:
        return [
            "How do I highlight this on my technical resume?",
            "What are the key keywords ATS scanners search for?",
            "Can you evaluate my draft bullet point for impact?"
        ]


async def generate_mentor_response(
    question: str,
    retrieved_chunks: List[Dict[str, Any]],
    context: Optional[Dict[str, Any]] = None,
    history: Optional[List[Dict[str, str]]] = None,
) -> Dict[str, Any]:
    """
    Executes the full RAG generation pipeline across provider cascade.
    """
    full_prompt = _build_context_prompt(question, retrieved_chunks, context, history)

    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    answer = None
    model_used = "PlaceMentor Grounded RAG Engine"

    # 1. Try Gemini API
    if gemini_key:
        try:
            answer = _call_gemini(gemini_key, full_prompt)
            model_used = "Gemini 1.5 Flash (Grounded RAG)"
        except Exception as e:
            logger.warning(f"Gemini API call failed: {e}. Cascading to next provider.")

    # 2. Try OpenAI API
    if not answer and openai_key:
        try:
            answer = _call_openai(openai_key, full_prompt)
            model_used = "GPT-4o-mini (Grounded RAG)"
        except Exception as e:
            logger.warning(f"OpenAI API call failed: {e}. Cascading to Grounded Knowledge Synthesizer.")

    # 3. Grounded Knowledge Synthesizer Fallback
    if not answer:
        answer = _synthesize_grounded_offline_response(question, retrieved_chunks, context)
        model_used = "PlaceMentor Grounded Knowledge Engine"

    # Clean sources for response
    sources = [
        {
            "id": c.get("id", f"src-{i}"),
            "title": c.get("title", "Placement Guide"),
            "category": c.get("category", "General"),
            "relevance_score": c.get("relevance_score", 0.90),
            "snippet": c.get("snippet", ""),
        }
        for i, c in enumerate(retrieved_chunks)
    ]

    followups = _generate_suggested_followups(question, retrieved_chunks, context)

    return {
        "answer": answer,
        "sources": sources,
        "suggested_followups": followups,
        "model_used": model_used,
        "status": "success",
    }
