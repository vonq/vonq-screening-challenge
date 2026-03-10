import json
import logging

from django.conf import settings
from langchain_openai import ChatOpenAI

from .prompts import (
    DECIDE_SYSTEM,
    EVALUATE_FIT_SYSTEM,
    PARSE_RESUME_SYSTEM,
)
from .state import ScreeningState

logger = logging.getLogger(__name__)


def _get_llm():
    return ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.1,
        api_key=settings.OPENAI_API_KEY,
    )


def _parse_json_response(content: str) -> dict:
    """Best-effort JSON extraction from LLM response."""
    content = content.strip()
    if content.startswith("```"):
        lines = content.split("\n")
        content = "\n".join(lines[1:-1])
    return json.loads(content)


def parse_resume(state: ScreeningState) -> dict:
    """Extract structured skill data from the candidate's resume."""
    llm = _get_llm()
    candidate = state["candidate_data"]

    prompt = f"""Resume text:
{candidate.get('resume_text', 'No resume provided')}

Skills listed: {', '.join(candidate.get('skills', []))}
Experience: {candidate.get('experience_years', 0)} years"""

    response = llm.invoke([
        {"role": "system", "content": PARSE_RESUME_SYSTEM},
        {"role": "user", "content": prompt},
    ])

    try:
        parsed = _parse_json_response(response.content)
        skills = parsed.get("skills", [])
    except (json.JSONDecodeError, AttributeError):
        logger.warning("Failed to parse resume extraction response")
        skills = [
            {"skill": s, "years": 1}
            for s in candidate.get("skills", [])
        ]

    return {
        "screening_results": [
            {"stage": "parse_resume", "data": skills}
        ],
        "messages": [f"Parsed resume: found {len(skills)} skills"],
    }


def evaluate_fit(state: ScreeningState) -> dict:
    """Compare parsed candidate skills against job requirements."""
    llm = _get_llm()
    job = state["job_data"]
    candidate = state["candidate_data"]

    prompt = f"""Candidate skills: {json.dumps(candidate.get('skills', []))}
Candidate experience: {candidate.get('experience_years', 0)} years

Job requirements:
{json.dumps(job.get('requirements', []), indent=2)}

Job description:
{job.get('description', 'No description')}"""

    response = llm.invoke([
        {"role": "system", "content": EVALUATE_FIT_SYSTEM},
        {"role": "user", "content": prompt},
    ])

    try:
        parsed = _parse_json_response(response.content)
        evaluations = parsed.get("evaluations", [])
        overall_score = parsed.get("overall_score", 0.0)
    except (json.JSONDecodeError, AttributeError):
        logger.warning("Failed to parse fit evaluation response")
        evaluations = []
        overall_score = 0.0

    return {
        "screening_results": [
            {
                "stage": "evaluate_fit",
                "data": evaluations,
                "overall_score": overall_score,
            }
        ],
        "messages": [f"Evaluated fit: overall score {overall_score}"],
    }


def decide(state: ScreeningState) -> dict:
    """Make a final accept/reject decision based on screening results."""
    llm = _get_llm()

    prompt = f"""Screening results so far:
{json.dumps(state.get('screening_results', []), indent=2, default=str)}

Candidate: {state['candidate_data'].get('name', 'Unknown')}
Job: {state['job_data'].get('title', 'Unknown')}"""

    response = llm.invoke([
        {"role": "system", "content": DECIDE_SYSTEM},
        {"role": "user", "content": prompt},
    ])

    try:
        parsed = _parse_json_response(response.content)
        decision = parsed.get("decision", "Reject")
        reasoning = parsed.get("reasoning", "Unable to determine fit.")
    except (json.JSONDecodeError, AttributeError):
        decision = "Reject"
        reasoning = "Failed to parse decision response."

    return {
        "decision": decision,
        "reasoning": reasoning,
        "messages": [f"Decision: {decision}"],
    }
