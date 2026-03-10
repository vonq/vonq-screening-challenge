import logging

from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task
def run_screening_task(application_id):
    """Run the LangGraph screening agent for a given application."""
    from .agents.graph import graph
    from .models import Application

    try:
        application = Application.objects.select_related(
            "candidate", "job", "job__employer"
        ).get(id=application_id)
    except Application.DoesNotExist:
        logger.error(f"Application {application_id} not found")
        return

    application.status = "screening"
    application.save()

    candidate = application.candidate
    job = application.job

    initial_state = {
        "candidate_data": {
            "name": candidate.full_name,
            "email": candidate.email,
            "resume_text": candidate.resume_text,
            "skills": candidate.skills,
            "experience_years": candidate.experience_years,
        },
        "job_data": {
            "title": job.title,
            "description": job.description,
            "requirements": job.requirements,
            "employer": job.employer.name,
        },
        "messages": [],
        "screening_results": [],
        "decision": "",
        "reasoning": "",
        "interview_questions": [],
    }

    try:
        result = graph.invoke(initial_state)

        application.screening_result = result
        application.screening_score = _extract_score(result)
        application.status = (
            "interview_ready"
            if result.get("decision", "").lower() == "accept"
            else "rejected"
        )
        application.save()

    except Exception as e:
        logger.exception(f"Screening failed for application {application_id}")
        application.status = "error"
        application.screening_result = {"error": str(e)}
        application.save()


def _extract_score(result: dict) -> float:
    """Pull an overall score from screening results if available."""
    for item in result.get("screening_results", []):
        if "overall_score" in item:
            return float(item["overall_score"])
    return 0.0
