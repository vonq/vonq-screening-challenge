from langgraph.graph import END, StateGraph

from .nodes import decide, evaluate_fit, parse_resume
from .state import ScreeningState


def route_decision(state: ScreeningState) -> str:
    """Route to rejection or interview questions based on decision."""
    if state.get("decision") == "reject":
        return "send_rejection"
    return "generate_questions"


def build_screening_graph():
    """Construct the candidate screening workflow graph."""
    workflow = StateGraph(ScreeningState)

    workflow.add_node("parse_resume", parse_resume)
    workflow.add_node("evaluate_fit", evaluate_fit)
    workflow.add_node("decide", decide)

    workflow.set_entry_point("parse_resume")
    workflow.add_edge("parse_resume", "evaluate_fit")
    workflow.add_edge("evaluate_fit", "decide")

    workflow.add_conditional_edges(
        "decide",
        route_decision,
        {
            "send_rejection": END,
            "generate_questions": END,
        },
    )

    return workflow.compile()


graph = build_screening_graph()
