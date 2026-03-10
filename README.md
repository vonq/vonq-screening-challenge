# VONQ AI Labs -- Backend Engineering Challenge

## Scenario

You're joining VONQ AI Labs on Day 1. A previous contractor built the start of our candidate screening platform -- a Django API, a React frontend, Celery for async processing, and a partial LangGraph agent for automated candidate screening.

Your job: **make the AI screening agent work end-to-end.**

Here's the Slack message from the CEO:

> Hey, we need the screening agent working before the investor demo. When a candidate applies, an AI agent should:
>
> - Look at their resume/profile and the job requirements
> - Decide if they're a fit
> - If yes, pick 3 good interview questions tailored to them
> - If no, write a polite rejection reason
> - All of this should happen automatically, not block the API, and we need to be able to see what the agent decided and why
>
> Use LangGraph. We want this to be a proper agentic workflow, not just a single LLM call. Think about it as a pipeline: screen → evaluate → decide → act.
>
> Oh, and the last engineer's Celery setup might have some issues. Not sure.
>
> Don't over-engineer it. We need it working, not perfect.

## Setup

```bash
cp .env.example .env
# Add the OpenAI API key we sent you
docker-compose up
```

Then open [http://localhost:3000](http://localhost:3000).

## What's Already Here

- **Django API** with models for Employers, Jobs, Candidates, and Applications
- **Celery** setup with Redis broker
- **A partial LangGraph agent** with 3 nodes (parse_resume, evaluate_fit, decide) -- incomplete
- **React frontend** for testing (fully functional, you don't need to modify it)
- **Seeded database** with sample employers, jobs, and candidates

## What's Not Here

A working screening pipeline. That's your job.

## Time Limit

**2 hours 30 minutes.**

Good luck. Ship it.
