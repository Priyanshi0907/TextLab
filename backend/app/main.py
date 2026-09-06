from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from db import database
from ml import classifier
from routers import classify, process, batch, performance, history, settings, dashboard, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    database.init_db()
    classifier.load_all()
    if not classifier.model_ready():
        print("WARNING: not all models were found in app/models — run `python ml/train.py` first.")
    yield


app = FastAPI(title="TextLab API", description="Text Processing & Classification Studio", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(classify.router)
app.include_router(process.router)
app.include_router(batch.router)
app.include_router(performance.router)
app.include_router(history.router)
app.include_router(settings.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "models_ready": classifier.model_ready()}
