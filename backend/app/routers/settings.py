from fastapi import APIRouter
from pydantic import BaseModel
from db import database

router = APIRouter(prefix="/api", tags=["settings"])

DEFAULT_SETTINGS = {
    "model": "Logistic Regression",
    "classification_type": "Topic Classification",
    "remove_stopwords": True,
    "lemmatization": True,
    "lowercase_text": True,
    "max_text_length": 500,
    "confidence_threshold": 70,
    "theme": "dark",
}


class SettingsUpdate(BaseModel):
    values: dict


@router.get("/settings")
def get_settings():
    stored = database.get_setting("app_settings", DEFAULT_SETTINGS)
    merged = {**DEFAULT_SETTINGS, **stored}
    return merged


@router.put("/settings")
def update_settings(payload: SettingsUpdate):
    current = database.get_setting("app_settings", DEFAULT_SETTINGS)
    merged = {**DEFAULT_SETTINGS, **current, **payload.values}
    database.set_setting("app_settings", merged)
    return merged
