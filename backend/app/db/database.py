import sqlite3
import os
import json
import threading
import hashlib

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "textlab.db")
_lock = threading.Lock()


def _hash_pw(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def get_conn():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with _lock:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT DEFAULT (datetime('now'))
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                input_text TEXT NOT NULL,
                task TEXT NOT NULL,
                prediction TEXT NOT NULL,
                confidence REAL NOT NULL,
                keywords TEXT,
                processing_time REAL,
                created_at TEXT DEFAULT (datetime('now'))
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS batch_jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT,
                task TEXT,
                total INTEGER,
                successful INTEGER,
                failed INTEGER,
                results TEXT,
                created_at TEXT DEFAULT (datetime('now'))
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        """)
        
        # Seed default demo account if no users exist
        existing = cur.execute("SELECT COUNT(*) c FROM users").fetchone()["c"]
        if existing == 0:
            cur.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                ("Priyanshi", "priyanshi@example.com", _hash_pw("password123"))
            )
            
        conn.commit()
        conn.close()


def create_user(name: str, email: str, password: str):
    name = name.strip()
    email = email.strip().lower()
    if not name or not email or not password:
        raise ValueError("Name, email, and password are required.")
    if len(password) < 4:
        raise ValueError("Password must be at least 4 characters.")
        
    with _lock:
        conn = get_conn()
        cur = conn.cursor()
        existing = cur.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if existing:
            conn.close()
            raise ValueError("An account with this email already exists. Please log in.")
            
        cur.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (name, email, _hash_pw(password))
        )
        conn.commit()
        user_id = cur.lastrowid
        conn.close()
        return {"id": user_id, "name": name, "email": email}


def authenticate_user(email: str, password: str):
    email = email.strip().lower()
    conn = get_conn()
    cur = conn.cursor()
    row = cur.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()
    if not row:
        return None
    if row["password_hash"] != _hash_pw(password):
        return None
    return {"id": row["id"], "name": row["name"], "email": row["email"]}


def add_history(input_text, task, prediction, confidence, keywords, processing_time):
    with _lock:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO history (input_text, task, prediction, confidence, keywords, processing_time) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (input_text, task, prediction, confidence, json.dumps(keywords), processing_time),
        )
        conn.commit()
        row_id = cur.lastrowid
        conn.close()
        return row_id


def get_history(search=None, task_filter=None, limit=200):
    conn = get_conn()
    cur = conn.cursor()
    query = "SELECT * FROM history"
    conditions = []
    params = []
    if search:
        conditions.append("input_text LIKE ?")
        params.append(f"%{search}%")
    if task_filter and task_filter != "all":
        conditions.append("task = ?")
        params.append(task_filter)
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    query += " ORDER BY id DESC LIMIT ?"
    params.append(limit)
    rows = cur.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def add_history_bulk(records):
    """records is list of tuples: (input_text, task, prediction, confidence, keywords_json, processing_time)"""
    if not records:
        return
    with _lock:
        conn = get_conn()
        cur = conn.cursor()
        cur.executemany(
            "INSERT INTO history (input_text, task, prediction, confidence, keywords, processing_time) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            records,
        )
        conn.commit()
        conn.close()


def delete_history_item(item_id):
    with _lock:
        conn = get_conn()
        conn.execute("DELETE FROM history WHERE id = ?", (item_id,))
        conn.commit()
        conn.close()


def clear_history():
    with _lock:
        conn = get_conn()
        conn.execute("DELETE FROM history")
        conn.execute("DELETE FROM batch_jobs")
        conn.commit()
        conn.close()


def add_batch_job(filename, task, total, successful, failed, results):
    with _lock:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO batch_jobs (filename, task, total, successful, failed, results) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (filename, task, total, successful, failed, json.dumps(results)),
        )
        conn.commit()
        row_id = cur.lastrowid
        conn.close()
        return row_id


def delete_batch_job(job_id):
    with _lock:
        conn = get_conn()
        conn.execute("DELETE FROM batch_jobs WHERE id = ?", (job_id,))
        conn.commit()
        conn.close()


def get_batch_jobs(task=None, limit=50):
    conn = get_conn()
    cur = conn.cursor()
    if task and task != "all":
        rows = cur.execute("SELECT * FROM batch_jobs WHERE task = ? ORDER BY id DESC LIMIT ?", (task, limit)).fetchall()
    else:
        rows = cur.execute("SELECT * FROM batch_jobs ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_dashboard_stats():
    conn = get_conn()
    cur = conn.cursor()
    total_texts = cur.execute("SELECT COUNT(*) c FROM history").fetchone()["c"]
    avg_time = cur.execute("SELECT AVG(processing_time) a FROM history").fetchone()["a"]
    conn.close()
    return {
        "texts_analyzed": total_texts,
        "avg_processing_time": round(avg_time, 3) if avg_time else 0.00,
    }


def get_setting(key, default=None):
    conn = get_conn()
    row = conn.execute("SELECT value FROM settings WHERE key = ?", (key,)).fetchone()
    conn.close()
    return json.loads(row["value"]) if row else default


def set_setting(key, value):
    with _lock:
        conn = get_conn()
        conn.execute(
            "INSERT INTO settings (key, value) VALUES (?, ?) "
            "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            (key, json.dumps(value)),
        )
        conn.commit()
        conn.close()

