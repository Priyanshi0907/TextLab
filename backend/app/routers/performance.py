from fastapi import APIRouter, HTTPException
from ml import classifier

router = APIRouter(prefix="/api", tags=["performance"])


@router.get("/performance/{task}")
def get_performance(task: str):
    try:
        return classifier.get_metrics(task)
    except ValueError as e:
        raise HTTPException(404, str(e))


@router.get("/performance")
def get_all_performance():
    return classifier.get_all_metrics()
