from typing import TypedDict


class ScreeningState(TypedDict):
    candidate_data: dict
    job_data: dict
    messages: list[str]
    screening_results: list[dict]
    decision: str
    reasoning: str
    interview_questions: list[str]
