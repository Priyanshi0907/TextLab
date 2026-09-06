import io
import os
import json
import csv as csv_mod
import time
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from collections import Counter
from ml import classifier
from db import database

router = APIRouter(prefix="/api", tags=["batch"])

MAX_ROWS = 2000


def _extract_texts_from_csv(raw_bytes: bytes):
    text = raw_bytes.decode("utf-8-sig", errors="ignore")
    reader = csv_mod.reader(io.StringIO(text))
    rows = list(reader)
    if not rows:
        return []
    header = [h.strip().lower() for h in rows[0]]
    # find a plausible text column, else fall back to the first column
    text_col = 0
    for candidate in ("text", "review", "comment", "message", "content", "input"):
        if candidate in header:
            text_col = header.index(candidate)
            break
    data_rows = rows[1:] if any(h.isalpha() for h in header) else rows
    texts = [r[text_col].strip() for r in data_rows if len(r) > text_col and r[text_col].strip()]
    return texts[:MAX_ROWS]


@router.post("/batch")
async def batch_analyze(file: UploadFile = File(...), task: str = Form("sentiment")):
    if task not in classifier.TASKS:
        raise HTTPException(400, f"task must be one of {classifier.TASKS}")
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(400, "Please upload a .csv file")

    raw = await file.read()
    texts = _extract_texts_from_csv(raw)
    if not texts:
        raise HTTPException(400, "No usable text rows found in the CSV")

    results = []
    failed = 0
    category_counts = Counter()
    total_conf = 0.0
    start = time.perf_counter()

    for t in texts:
        try:
            r = classifier.classify(t, task)
            results.append({
                "text": t if len(t) <= 120 else t[:117] + "...",
                "prediction": r["prediction"],
                "confidence": r["confidence"],
            })
            category_counts[r["prediction"]] += 1
            total_conf += r["confidence"]
        except Exception:
            failed += 1
            results.append({"text": t[:117], "prediction": "Error", "confidence": 0.0})

    elapsed = time.perf_counter() - start
    successful = len(texts) - failed
    avg_conf = round(total_conf / successful, 1) if successful else 0.0
    most_common = category_counts.most_common(1)[0][0] if category_counts else "N/A"

    database.add_batch_job(
        filename=file.filename, task=task, total=len(texts),
        successful=successful, failed=failed, results=results,
    )

    # Also persist each successfully analyzed text to the main history table
    avg_time_per_row = round(elapsed / max(len(texts), 1), 3)
    bulk_history = [
        (
            r["text"],
            task,
            r["prediction"],
            r["confidence"],
            json.dumps([]),
            avg_time_per_row,
        )
        for r in results
        if r["prediction"] != "Error"
    ]
    database.add_history_bulk(bulk_history)

    return {
        "total_texts": len(texts),
        "successful": successful,
        "failed": failed,
        "avg_confidence": avg_conf,
        "processing_time": round(elapsed, 2),
        "category_distribution": [
            {"category": c, "count": n, "percent": round(n / len(texts) * 100, 1)}
            for c, n in category_counts.most_common()
        ],
        "most_common_category": most_common,
        "results": results,
    }


@router.get("/batch/overview")
def get_batch_overview(task: str = "topic"):
    if task not in classifier.TASKS:
        raise HTTPException(400, f"task must be one of {classifier.TASKS}")

    jobs = database.get_batch_jobs(task=task)
    
    if jobs:
        total = sum(j["total"] for j in jobs)
        successful = sum(j["successful"] for j in jobs)
        failed = sum(j["failed"] for j in jobs)
        
        category_counts = Counter()
        for j in jobs:
            try:
                results = json.loads(j["results"]) if isinstance(j["results"], str) else j["results"]
                for r in results:
                    pred = r.get("prediction")
                    if pred and pred != "Error":
                        category_counts[pred] += 1
            except Exception:
                pass
        
        total_valid = sum(category_counts.values()) or 1
        distribution = [
            {"name": cat, "value": round((cnt / total_valid) * 100, 1), "count": cnt}
            for cat, cnt in category_counts.most_common()
        ]
        
        return {
            "task": task,
            "task_label": classifier.TASK_DISPLAY_NAMES.get(task, task.title()),
            "total_analyzed": total,
            "successful": successful,
            "failed": failed,
            "distribution": distribution,
            "has_user_batches": True,
        }

    # If no batch uploads exist, check classified history items for this task
    history_items = database.get_history(task_filter=task)
    if history_items:
        category_counts = Counter()
        for h in history_items:
            pred = h.get("prediction")
            if pred:
                category_counts[pred] += 1
        total_valid = sum(category_counts.values()) or 1
        distribution = [
            {"name": cat, "value": round((cnt / total_valid) * 100, 1), "count": cnt}
            for cat, cnt in category_counts.most_common()
        ]
        return {
            "task": task,
            "task_label": classifier.TASK_DISPLAY_NAMES.get(task, task.title()),
            "total_analyzed": len(history_items),
            "successful": len(history_items),
            "failed": 0,
            "distribution": distribution,
            "has_user_batches": True,
        }

    # Real zero count when no data has been analyzed yet
    return {
        "task": task,
        "task_label": classifier.TASK_DISPLAY_NAMES.get(task, task.title()),
        "total_analyzed": 0,
        "successful": 0,
        "failed": 0,
        "distribution": [],
        "has_user_batches": False,
    }

    # Fallback to category labels equally distributed
    labels = classifier.CATEGORY_LABELS.get(task, [])
    pct = round(100 / len(labels), 1) if labels else 0
    return {
        "task": task,
        "task_label": classifier.TASK_DISPLAY_NAMES.get(task, task.title()),
        "total_analyzed": 0,
        "successful": 0,
        "failed": 0,
        "distribution": [{"name": l, "value": pct, "count": 0} for l in labels],
        "has_user_batches": False,
    }


@router.post("/batch/export")
async def export_batch(payload: dict):
    """Re-serializes previously returned batch results as a downloadable CSV."""
    results = payload.get("results", [])
    if not results:
        raise HTTPException(400, "No results to export")

    buf = io.StringIO()
    writer = csv_mod.writer(buf)
    writer.writerow(["Text", "Prediction", "Confidence"])
    for r in results:
        writer.writerow([r.get("text", ""), r.get("prediction", ""), r.get("confidence", "")])
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=batch_results.csv"},
    )
