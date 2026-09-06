import json
from fastapi import APIRouter, HTTPException, Query
from db import database

router = APIRouter(prefix="/api", tags=["history"])


@router.get("/history")
def list_history(search: str | None = None, task: str | None = None, limit: int = 200):
    rows = database.get_history(search=search, task_filter=task, limit=limit)
    for r in rows:
        r["keywords"] = json.loads(r["keywords"]) if r["keywords"] else []
    return {"items": rows, "count": len(rows)}


@router.get("/history/batches")
def list_batch_history(task: str | None = None, limit: int = 50):
    rows = database.get_batch_jobs(task=task, limit=limit)
    for r in rows:
        r["results"] = json.loads(r["results"]) if isinstance(r["results"], str) else r["results"]
    return {"batches": rows, "count": len(rows)}


@router.delete("/history/batches/{item_id}")
def delete_batch_job_item(item_id: int):
    database.delete_batch_job(item_id)
    return {"status": "deleted", "id": item_id}


@router.delete("/history/{item_id}")
def delete_history(item_id: int):
    database.delete_history_item(item_id)
    return {"status": "deleted", "id": item_id}


@router.delete("/history")
def clear_all_history():
    database.clear_history()
    return {"status": "cleared"}
