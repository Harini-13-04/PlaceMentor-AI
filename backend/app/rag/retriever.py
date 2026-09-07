"""
PlaceMentor AI — Semantic & BM25 Hybrid Retriever
Extracts relevant placement knowledge chunks using tokenized BM25/TF-IDF scoring
and contextual boosting (problem title, topic, language, execution error status).
"""

import math
import re
from typing import List, Dict, Any, Optional
from app.rag.knowledge_base import get_all_chunks


def _tokenize(text: str) -> List[str]:
    """Tokenize and normalize text into clean lowercase alphanumeric tokens."""
    if not text:
        return []
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower())
    tokens = [t for t in cleaned.split() if len(t) > 1]
    return tokens


class PlacementRAGRetriever:
    def __init__(self):
        self.chunks = get_all_chunks()
        self._build_index()

    def _build_index(self):
        self.doc_tokens = []
        self.doc_freqs: Dict[str, int] = {}
        self.doc_lengths = []
        self.total_docs = len(self.chunks)

        for chunk in self.chunks:
            # Combine title, keywords, content, and cheat sheet
            full_text = f"{chunk['title']} {' '.join(chunk.get('keywords', []))} {chunk['topic']} {chunk['category']} {chunk['content']} {chunk.get('cheat_sheet', '')}"
            tokens = _tokenize(full_text)
            self.doc_tokens.append(tokens)
            self.doc_lengths.append(len(tokens))

            # Update document frequencies
            unique_tokens = set(tokens)
            for token in unique_tokens:
                self.doc_freqs[token] = self.doc_freqs.get(token, 0) + 1

        self.avg_doc_len = sum(self.doc_lengths) / max(1, self.total_docs)

    def retrieve(
        self,
        query: str,
        context: Optional[Dict[str, Any]] = None,
        top_k: int = 3,
        min_score: float = 0.05,
    ) -> List[Dict[str, Any]]:
        """
        Retrieve the top_k most relevant knowledge chunks for a query + optional context.
        """
        query_tokens = _tokenize(query)
        if not query_tokens and not context:
            # Return top default starter chunks
            return [
                {
                    "id": c["id"],
                    "title": c["title"],
                    "category": c["category"],
                    "relevance_score": 0.95,
                    "snippet": c["content"][:240].strip() + "...",
                    "full_chunk": c,
                }
                for c in self.chunks[:top_k]
            ]

        # Context boosting terms
        context_tokens = []
        if context:
            if context.get("problemTitle"):
                context_tokens.extend(_tokenize(context["problemTitle"]) * 3)  # High boost
            if context.get("problemTopic"):
                context_tokens.extend(_tokenize(context["problemTopic"]) * 2)
            if context.get("executionStatus") and context["executionStatus"] != "Accepted":
                context_tokens.extend(["edge", "cases", "error", "debugging", "complexity", "boundary"])
            if context.get("language"):
                context_tokens.extend(_tokenize(context["language"]))

        all_query_terms = query_tokens + context_tokens

        # BM25 Parameters
        k1 = 1.5
        b = 0.75

        scores = []
        for idx, chunk in enumerate(self.chunks):
            doc_toks = self.doc_tokens[idx]
            doc_len = self.doc_lengths[idx]
            tok_counts: Dict[str, int] = {}
            for t in doc_toks:
                tok_counts[t] = tok_counts.get(t, 0) + 1

            score = 0.0
            for term in set(all_query_terms):
                if term in tok_counts:
                    tf = tok_counts[term]
                    df = self.doc_freqs.get(term, 1)
                    # Standard IDF
                    idf = math.log(1 + (self.total_docs - df + 0.5) / (df + 0.5))
                    # BM25 TF formula
                    numerator = tf * (k1 + 1)
                    denominator = tf + k1 * (1 - b + b * (doc_len / max(1, self.avg_doc_len)))
                    score += idf * (numerator / denominator)

            # Keyword direct match bonus
            for kw in chunk.get("keywords", []):
                if any(kw in query.lower() for kw in [kw.lower()]):
                    score += 2.5

            scores.append((score, chunk))

        # Sort by score descending
        scores.sort(key=lambda x: x[0], reverse=True)

        results = []
        max_score = max([s[0] for s in scores]) if scores and scores[0][0] > 0 else 1.0

        for score, chunk in scores[:top_k]:
            normalized_score = round(min(0.99, max(0.20, score / max(1.0, max_score))), 2)
            snippet = chunk["content"][:240].strip().replace("\n\n", " ") + "..."
            results.append({
                "id": chunk["id"],
                "title": chunk["title"],
                "category": chunk["category"],
                "relevance_score": normalized_score,
                "snippet": snippet,
                "content": chunk["content"],
                "full_chunk": chunk,
            })

        return results


# Global singleton instance
_retriever_instance = None


def get_retriever() -> PlacementRAGRetriever:
    global _retriever_instance
    if _retriever_instance is None:
        _retriever_instance = PlacementRAGRetriever()
    return _retriever_instance
