# TextLab — Text Processing & Classification Studio

A full-stack NLP text analytics platform: real TF-IDF + classical ML
classifiers (Naive Bayes / Logistic Regression / SVM) served by FastAPI,
with a React + Tailwind dashboard for single-text classification, batch
CSV analysis, live preprocessing inspection, model performance/confusion
matrices, history, and settings.

Three classification tasks are supported out of the box:
- **Topic Classification** — Technology, Sports, Business, Politics, Health, Entertainment
- **Sentiment** — Positive, Neutral, Negative
- **Spam** — Spam, Not Spam

Every metric shown in the UI (accuracy, precision, recall, F1, confusion
matrix, model comparison) is computed from a real train/test split — not
hardcoded — by `backend/app/ml/train.py`.

## Project structure

```
textlab/
├── backend/
│   └── app/
│       ├── main.py                # FastAPI app entrypoint
│       ├── routers/               # dashboard, classify, process, batch, performance, history, settings
│       ├── ml/
│       │   ├── preprocess.py      # cleaning / tokenizing / stopwords / stemming / lemmatization
│       │   ├── train.py           # trains + saves the 3 task models
│       │   └── classifier.py      # loads models, serves predictions
│       ├── data/
│       │   └── generate_datasets.py  # builds the training CSVs
│       ├── models/                # saved .joblib models + metrics.json (generated)
│       └── textlab.db             # SQLite history/settings (generated on first run)
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/            # Sidebar, TopBar, Card, StatCard, DonutChart
    │   ├── pages/                 # Dashboard, TextProcessor, ClassifyText, BatchAnalysis,
    │   │                          # ModelPerformance, History, Settings
    │   └── lib/api.js             # API client
    └── package.json
```

## Running it locally

### 1. Backend (FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cd app
# (Optional — pre-trained models are already included in app/models/.
#  Only re-run these if you want to regenerate data / retrain from scratch.)
python data/generate_datasets.py
python ml/train.py

uvicorn main:app --reload --port 8000
```

The API will be live at `http://localhost:8000` (interactive docs at
`http://localhost:8000/docs`).

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend talks to the backend at the
URL set in `frontend/.env` (`VITE_API_URL`, defaults to
`http://localhost:8000`).

### 3. Production build

```bash
cd frontend
npm run build     # outputs to frontend/dist — serve with any static host
```

## How the ML actually works

1. **Preprocessing** (`ml/preprocess.py`): lowercasing, punctuation/URL
   stripping, tokenization, stopword removal (scikit-learn's bundled
   list), stemming (`snowballstemmer`, pure-Python, no network needed),
   and a small rule-based lemmatizer — fully offline, no `nltk.download()`.
2. **Feature extraction**: `TfidfVectorizer` with unigrams+bigrams.
3. **Classification**: three candidate models (Multinomial Naive Bayes,
   Logistic Regression, calibrated Linear SVM) are trained per task;
   whichever scores highest on the held-out test split is saved and
   served — this is exactly what the "Model Comparison" panel on the
   Model Performance page shows.
4. **Confidence scores** come from each model's real predicted-class
   probability, not a fixed number.

## Notes

- History and settings persist in a local SQLite file
  (`backend/app/textlab.db`), created automatically on first run.
- Batch CSV upload looks for a `text`, `review`, `comment`, `message`,
  or `content` column (case-insensitive); otherwise it falls back to the
  first column.
- To add a new classification task, add a dataset CSV in
  `backend/app/data/`, add it to `TASKS` in `ml/train.py`, run
  `python ml/train.py`, then add the task id to `CATEGORY_LABELS` in
  `ml/classifier.py` and the task pickers in the frontend.
