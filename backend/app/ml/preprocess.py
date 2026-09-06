import re
import math
from collections import Counter
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

_stemmer = PorterStemmer()

NEGATION_AND_MODIFIERS = {
    "no", "not", "nor", "neither", "never", "none", "nobody", "nowhere",
    "nothing", "cannot", "cant", "can't", "dont", "don't", "didnt", "didn't",
    "isnt", "isn't", "arent", "aren't", "wasnt", "wasn't", "werent", "weren't",
    "hasnt", "hasn't", "havent", "haven't", "hadnt", "hadn't", "wont", "won't",
    "wouldnt", "wouldn't", "shouldnt", "shouldn't", "couldnt", "couldn't",
    "very", "too", "extremely", "really", "super", "bad", "good", "worst", "best"
}
STOPWORDS = set(ENGLISH_STOP_WORDS) - NEGATION_AND_MODIFIERS
_TOKEN_RE = re.compile(r"[a-zA-Z0-9']+")

_IRREGULAR_LEMMAS = {
    "was": "be", "were": "be", "is": "be", "are": "be", "am": "be", "been": "be",
    "has": "have", "had": "have", "having": "have",
    "went": "go", "gone": "go", "goes": "go",
    "better": "good", "best": "good", "worse": "bad", "worst": "bad",
    "children": "child", "people": "person", "men": "man", "women": "woman",
    "companies": "company", "products": "product", "services": "service",
    "mice": "mouse", "geese": "goose", "feet": "foot", "teeth": "tooth",
    "developing": "develop", "developed": "develop", "develops": "develop",
}


def clean_text(text: str) -> str:
    """Lowercase + strip punctuation/extra whitespace/special chars."""
    text = text.lower()
    text = re.sub(r"http\S+|www\.\S+", " ", text)
    text = re.sub(r"[^a-z0-9\s']", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def tokenize(text: str):
    return _TOKEN_RE.findall(text)


def remove_stopwords(tokens):
    return [t for t in tokens if t.lower() not in STOPWORDS and len(t) > 1]


def stem_tokens(tokens):
    return [_stemmer.stem(t) for t in tokens]


def lemmatize_token(tok: str) -> str:
    low = tok.lower()
    if low in _IRREGULAR_LEMMAS:
        return _IRREGULAR_LEMMAS[low]
    for suf, repl in [("ies", "y"), ("ves", "f"), ("ing", ""), ("ed", ""),
                       ("es", ""), ("s", "")]:
        if low.endswith(suf) and len(low) - len(suf) > 2:
            return low[: -len(suf)] + repl
    return low


def lemmatize_tokens(tokens):
    return [lemmatize_token(t) for t in tokens]


def compute_features(tokens):
    """Computes Bag of Words and TF-IDF numerical vector representations."""
    if not tokens:
        return {"bow": [], "tfidf": []}
    
    counts = Counter(tokens)
    total = len(tokens)
    unique = len(counts)
    
    # Bag of Words
    bow = [{"term": term, "count": count} for term, count in counts.most_common()]
    
    # Term Frequency - Inverse Document Frequency (Simulated local + smooth idf)
    tfidf = []
    for term, count in counts.most_common():
        tf = count / total
        # smooth idf simulation based on term rarity
        idf = math.log((1 + total) / (1 + count)) + 1.2
        tfidf_score = round(tf * idf, 4)
        tfidf.append({
            "term": term,
            "tf": round(tf, 3),
            "idf": round(idf, 3),
            "tfidf": tfidf_score,
        })
        
    return {"bow": bow, "tfidf": tfidf}


def process_pipeline(
    text: str,
    lowercase: bool = True,
    remove_punct: bool = True,
    remove_special: bool = True,
    remove_spaces: bool = True,
    stopwords: bool = True,
    tokenize_step: bool = True,
    stemming: bool = False,
    lemmatization: bool = False,
):
    """
    Runs the full, inspectable preprocessing pipeline and returns a dict
    describing each stage and numerical feature extraction.
    """
    original = text
    steps = []
    working = text

    if lowercase:
        working = working.lower()
        steps.append({"name": "Convert text to lowercase", "output": working})

    if remove_special:
        working = re.sub(r"http\S+|www\.\S+", " ", working)
        working = re.sub(r"[^a-zA-Z0-9\s.,!?'\"-]", " ", working)
        steps.append({"name": "Remove special characters & URLs", "output": working})

    if remove_punct:
        working = re.sub(r"[^\w\s]", " ", working)
        steps.append({"name": "Remove punctuation", "output": working})

    if remove_spaces:
        working = re.sub(r"\s+", " ", working).strip()
        steps.append({"name": "Remove unnecessary spaces", "output": working})

    tokens = tokenize(working) if tokenize_step else working.split()
    if tokenize_step:
        steps.append({"name": "Tokenization", "output": " | ".join(tokens)})

    if stopwords:
        tokens = remove_stopwords(tokens)
        steps.append({"name": "Remove stopwords", "output": " ".join(tokens)})

    if stemming:
        tokens = stem_tokens(tokens)
        steps.append({"name": "Stemming", "output": " ".join(tokens)})

    if lemmatization and not stemming:
        tokens = lemmatize_tokens(tokens)
        steps.append({"name": "Lemmatization", "output": " ".join(tokens)})

    final_text = " ".join(tokens)

    # Word Frequency Detection
    word_counts = Counter(tokens)
    total_tokens = len(tokens) or 1
    word_frequency = [
        {"word": w, "count": c, "frequency": round((c / total_tokens) * 100, 1)}
        for w, c in word_counts.most_common()
    ]

    features = compute_features(tokens)

    return {
        "original": original,
        "processed": final_text,
        "tokens": tokens,
        "steps": steps,
        "word_frequency": word_frequency,
        "features": features,
        "stats": {
            "word_count": len(tokens),
            "unique_words": len(set(tokens)),
            "characters": len(original),
        },
    }


def extract_keywords(text: str, top_n: int = 5):
    tokens = remove_stopwords(tokenize(clean_text(text)))
    seen = []
    for t in tokens:
        if t not in seen:
            seen.append(t)
    seen.sort(key=lambda w: -len(w))
    return seen[:top_n]
