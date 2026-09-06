from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from ml import classifier
from db import database

router = APIRouter(prefix="/api", tags=["classify"])


class ClassifyRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    task: str = "topic"  # topic | sentiment | spam
    save_to_history: bool = True


class ClassifyResponse(BaseModel):
    prediction: str
    confidence: float
    keywords: list[str]
    words: int
    characters: int
    processing_time: float
    emotion: str | None = None
    emotion_scores: list[dict] | None = None


@router.post("/classify", response_model=ClassifyResponse)
def classify_text(req: ClassifyRequest):
    if req.task not in classifier.TASKS:
        raise HTTPException(400, f"task must be one of {classifier.TASKS}")
    try:
        result = classifier.classify(req.text, req.task)
    except ValueError as e:
        raise HTTPException(400, str(e))

    if req.save_to_history:
        database.add_history(
            input_text=req.text,
            task=req.task,
            prediction=result["prediction"],
            confidence=result["confidence"],
            keywords=result["keywords"],
            processing_time=result["processing_time"],
        )
    return result


@router.get("/classify/tasks")
def list_tasks():
    return {
        "tasks": [
            {
                "id": task_id,
                "label": classifier.TASK_DISPLAY_NAMES.get(task_id, task_id.replace("_", " ").title()),
                "categories": classifier.CATEGORY_LABELS.get(task_id, []),
            }
            for task_id in classifier.TASKS
        ]
    }
