import os
import json
import joblib
import time
from collections import Counter
from ml.preprocess import clean_text, tokenize, remove_stopwords, stem_tokens, extract_keywords

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")

_vectorizers = {}
_models = {}
_metrics = {}

TASKS = ["topic", "sentiment", "spam", "intent", "emotion"]

CATEGORY_LABELS = {
    "topic": ["Technology", "Sports", "Health", "Finance", "Politics", "Entertainment", "Education"],
    "sentiment": ["Positive", "Neutral", "Negative"],
    "spam": ["Spam", "Not Spam"],
    "intent": ["Inquiry", "Complaint", "Feedback", "Order Tracking", "Refund", "Cancellation", "Technical Support"],
    "emotion": ["Joy", "Sadness", "Anger", "Fear", "Surprise", "Love", "Neutral"],
}

TASK_DISPLAY_NAMES = {
    "topic": "Topic Classification",
    "sentiment": "Sentiment Classification",
    "spam": "Spam Detection",
    "intent": "Intent Classification",
    "emotion": "Emotion Classification",
}

# Emotion lexicons for rich sentiment emotion breakdown
EMOTION_LEXICON = {
    "Joy": {
        "amazing", "great", "fantastic", "happy", "delighted", "wonderful", "perfect",
        "best", "excellent", "pleased", "glad", "awesome", "thrilled", "super",
        "outstanding", "enjoy", "enjoyed", "good", "flawless", "brilliant", "smooth",
        "superb", "satisfaction", "satisfied", "pleasure", "uplifting", "yay", "cheerful"
    },
    "Love": {
        "love", "loved", "loving", "adore", "adored", "favorite", "favourite",
        "cherish", "beautiful", "gorgeous", "sweet", "precious", "masterpiece", "charming"
    },
    "Surprise": {
        "wow", "unbelievable", "shocked", "surprised", "astonishing", "unexpected",
        "incredible", "amazed", "stunning", "sudden", "congratulations", "miracle", "fascinating"
    },
    "Anger": {
        "bad", "terrible", "awful", "horrible", "angry", "furious", "mad", "rude",
        "hate", "worst", "unacceptable", "scam", "frustrated", "annoyed", "useless",
        "garbage", "waste", "cheat", "disgusted", "offensive", "annoying", "pathetic",
        "sluggish", "buggy", "lags", "crashes", "junk", "broken", "defective"
    },
    "Sadness": {
        "sad", "depressed", "disappointed", "unhappy", "broken", "crying", "lost",
        "hurt", "grief", "regret", "miss", "failed", "sorrow", "painful", "poor",
        "heartbroken", "dissatisfied", "unfortunate", "down", "gloomy"
    },
    "Fear": {
        "fear", "scared", "urgent", "warning", "suspicious", "danger", "dangerous",
        "risk", "anxiety", "worried", "panic", "threat", "suspended", "lock", "alarm",
        "terrified", "emergency", "phishing", "unauthorized", "vulnerability"
    },
    "Neutral": {
        "scheduled", "standard", "average", "normal", "routine", "specification",
        "parameter", "dimension", "status", "report", "regular", "adequate", "moderate"
    }
}


def detect_emotions(text: str, sentiment_pred: str, confidence: float):
    tokens = [t.lower() for t in tokenize(text)]
    token_set = set(tokens)
    
    scores = {e: 0.2 for e in ["Joy", "Love", "Surprise", "Anger", "Sadness", "Fear", "Neutral"]}
    
    for emotion, words in EMOTION_LEXICON.items():
        matches = len(token_set & words)
        if matches > 0:
            scores[emotion] += matches * 4.0
            
    # Align baseline with predicted sentiment
    if sentiment_pred == "Positive":
        if scores["Joy"] <= 0.5 and scores["Love"] <= 0.5 and scores["Surprise"] <= 0.5:
            scores["Joy"] += (confidence / 15.0)
        else:
            scores["Joy"] += (confidence / 25.0)
    elif sentiment_pred == "Negative":
        if scores["Anger"] <= 0.5 and scores["Sadness"] <= 0.5 and scores["Fear"] <= 0.5:
            scores["Anger"] += (confidence / 18.0)
            scores["Sadness"] += (confidence / 25.0)
        else:
            if scores["Anger"] > 0.5:
                scores["Anger"] += (confidence / 20.0)
            if scores["Sadness"] > 0.5:
                scores["Sadness"] += (confidence / 20.0)
    else:
        scores["Neutral"] += 3.5

    total_score = sum(scores.values()) or 1.0
    normalized = {e: round((s / total_score) * 100, 1) for e, s in scores.items()}
    primary = max(normalized, key=normalized.get)
    
    sorted_emotions = sorted(
        [{"emotion": e, "score": s} for e, s in normalized.items() if s > 1.0 or e == primary],
        key=lambda x: -x["score"]
    )
    
    return primary, sorted_emotions


_model_mtimes = {}

def load_task(task: str, force: bool = False):
    vec_path = os.path.join(MODELS_DIR, f"{task}_vectorizer.joblib")
    model_path = os.path.join(MODELS_DIR, f"{task}_model.joblib")
    metrics_path = os.path.join(MODELS_DIR, f"{task}_metrics.json")
    
    if os.path.exists(model_path):
        mtime = os.path.getmtime(model_path)
        if force or task not in _models or _model_mtimes.get(task) != mtime:
            if os.path.exists(vec_path):
                _vectorizers[task] = joblib.load(vec_path)
                _models[task] = joblib.load(model_path)
                _model_mtimes[task] = mtime
    if os.path.exists(metrics_path):
        with open(metrics_path, encoding="utf-8") as f:
            _metrics[task] = json.load(f)


def load_all(force: bool = False):
    for task in TASKS:
        load_task(task, force=force)


def _prep(text: str) -> str:
    cleaned = clean_text(text)
    tokens = remove_stopwords(tokenize(cleaned))
    tokens = stem_tokens(tokens)
    return " ".join(tokens)


def classify(text: str, task: str = "topic"):
    load_task(task)
    if task not in _models:
        raise ValueError(f"Unknown task '{task}'. Available: {list(_models.keys())}")

    start = time.perf_counter()
    processed = _prep(text)
    vec = _vectorizers[task].transform([processed])
    model = _models[task]

    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(vec)[0]
        classes = model.classes_
        best_idx = probs.argmax()
        prediction = classes[best_idx]
        confidence = float(probs[best_idx]) * 100
    else:
        prediction = model.predict(vec)[0]
        confidence = 92.0

    elapsed = time.perf_counter() - start
    keywords = extract_keywords(text, top_n=5)

    res = {
        "prediction": str(prediction),
        "confidence": round(confidence, 1),
        "keywords": keywords,
        "words": len(text.split()),
        "characters": len(text),
        "processing_time": round(elapsed, 3),
    }

    if task == "emotion":
        if hasattr(model, "predict_proba"):
            emotion_breakdown = [
                {"emotion": str(cls), "score": round(float(prob) * 100, 1)}
                for cls, prob in zip(classes, probs)
            ]
            emotion_breakdown.sort(key=lambda x: -x["score"])
        else:
            _, emotion_breakdown = detect_emotions(text, str(prediction), confidence)
        res["emotion"] = str(prediction)
        res["emotion_scores"] = emotion_breakdown
    elif task == "sentiment":
        primary_emotion, emotion_breakdown = detect_emotions(text, str(prediction), confidence)
        res["emotion"] = primary_emotion
        res["emotion_scores"] = emotion_breakdown

    return res


def get_metrics(task: str = "topic"):
    if task not in _metrics:
        load_task(task)
    if task not in _metrics:
        raise ValueError(f"No metrics for task '{task}'")
    return _metrics[task]


def get_all_metrics():
    if len(_metrics) < len(TASKS):
        load_all()
    return _metrics


def model_ready():
    return len(_models) == len(TASKS)
