from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from ml.preprocess import process_pipeline

router = APIRouter(prefix="/api", tags=["process"])


class ProcessRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    lowercase: bool = True
    remove_punct: bool = True
    remove_special: bool = True
    remove_spaces: bool = True
    stopwords: bool = True
    tokenize_step: bool = True
    stemming: bool = False
    lemmatization: bool = False


@router.post("/process")
def process_text(req: ProcessRequest):
    if not req.text.strip():
        raise HTTPException(400, "text cannot be empty")
    return process_pipeline(
        req.text,
        lowercase=req.lowercase,
        remove_punct=req.remove_punct,
        remove_special=req.remove_special,
        remove_spaces=req.remove_spaces,
        stopwords=req.stopwords,
        tokenize_step=req.tokenize_step,
        stemming=req.stemming,
        lemmatization=req.lemmatization,
    )
