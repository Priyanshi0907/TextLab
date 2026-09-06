"""
Trains real scikit-learn models for each classification task:
  Topic Classification | Sentiment | Spam

Pipeline per task: clean+preprocess -> TF-IDF -> {Naive Bayes, Logistic
Regression, Linear SVM} -> pick best by accuracy on a held-out test split.
Saves the winning (vectorizer, model) pair with joblib and a metrics.json
with accuracy/precision/recall/f1, confusion matrix, and the full model
comparison table — all computed from real train/test evaluation, not
hand-set numbers.
"""
import os
import json
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
)

import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml.preprocess import clean_text, tokenize, remove_stopwords, stem_tokens

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
os.makedirs(MODELS_DIR, exist_ok=True)

TASKS = {
    "topic": "topic_dataset.csv",
    "sentiment": "sentiment_dataset.csv",
    "spam": "spam_dataset.csv",
    "intent": "intent_dataset.csv",
    "emotion": "emotion_dataset.csv",
}


def preprocess_for_training(text: str) -> str:
    cleaned = clean_text(text)
    tokens = remove_stopwords(tokenize(cleaned))
    tokens = stem_tokens(tokens)
    return " ".join(tokens)


def train_task(task_name: str, csv_name: str):
    df = pd.read_csv(os.path.join(DATA_DIR, csv_name))
    df["clean"] = df["text"].apply(preprocess_for_training)

    X_train, X_test, y_train, y_test = train_test_split(
        df["clean"], df["label"], test_size=0.2, random_state=42, stratify=df["label"]
    )

    vectorizer = TfidfVectorizer(
        ngram_range=(1, 3),
        min_df=1,
        max_df=0.98,
        sublinear_tf=True,
        strip_accents="unicode"
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    labels_sorted = sorted(df["label"].unique())

    candidates = {
        "Logistic Regression": LogisticRegression(max_iter=3000, C=10.0, class_weight="balanced"),
        "SVM": CalibratedClassifierCV(LinearSVC(C=2.0, max_iter=5000), cv=3),
        "Naive Bayes": MultinomialNB(alpha=0.1),
    }

    comparison = []
    fitted = {}
    for name, clf in candidates.items():
        clf.fit(X_train_vec, y_train)
        preds = clf.predict(X_test_vec)
        acc = accuracy_score(y_test, preds)
        comparison.append({"model": name, "accuracy": round(acc * 100, 1)})
        fitted[name] = clf

    best_name = max(comparison, key=lambda r: r["accuracy"])["model"]
    best_model = fitted[best_name]
    best_preds = best_model.predict(X_test_vec)

    acc = accuracy_score(y_test, best_preds)
    prec = precision_score(y_test, best_preds, average="macro", zero_division=0)
    rec = recall_score(y_test, best_preds, average="macro", zero_division=0)
    f1 = f1_score(y_test, best_preds, average="macro", zero_division=0)
    cm = confusion_matrix(y_test, best_preds, labels=labels_sorted)

    metrics = {
        "task": task_name,
        "best_model": best_name,
        "accuracy": round(acc * 100, 1),
        "precision": round(prec * 100, 1),
        "recall": round(rec * 100, 1),
        "f1_score": round(f1 * 100, 1),
        "labels": labels_sorted,
        "confusion_matrix": cm.tolist(),
        "model_comparison": sorted(comparison, key=lambda r: -r["accuracy"]),
        "train_size": len(X_train),
        "test_size": len(X_test),
        "num_categories": len(labels_sorted),
    }

    joblib.dump(vectorizer, os.path.join(MODELS_DIR, f"{task_name}_vectorizer.joblib"))
    joblib.dump(best_model, os.path.join(MODELS_DIR, f"{task_name}_model.joblib"))
    with open(os.path.join(MODELS_DIR, f"{task_name}_metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"[{task_name}] best={best_name} acc={metrics['accuracy']}% "
          f"prec={metrics['precision']}% rec={metrics['recall']}% f1={metrics['f1_score']}%")
    return metrics


if __name__ == "__main__":
    all_metrics = {}
    for task, csv_name in TASKS.items():
        all_metrics[task] = train_task(task, csv_name)
    with open(os.path.join(MODELS_DIR, "all_metrics.json"), "w") as f:
        json.dump(all_metrics, f, indent=2)
    print("\nAll models trained and saved to", MODELS_DIR)
