import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "app"))
from ml import classifier
classifier.load_all(force=True)

emotion_tests = [
    ("I can't stop smiling", ["Joy"]),
    ("I'm furious that they cancelled my flight without any warning.", ["Anger"]),
    ("I feel so lonely and heartbroken since she moved away.", ["Sadness"]),
    ("I'm terrified about the results of my medical test tomorrow.", ["Fear"]),
    ("Wow", ["Surprise"]),
    ("I'm so grateful for all the support you've given me this year.", ["Joy", "Love"]),
    ("This traffic jam is driving me insane", ["Anger"]),
    ("I miss my family so much during the holidays", ["Sadness"]),
    ("I'm nervous about my job interview scheduled for tomorrow morning.", ["Fear"]),
    ("That surprise party left me completely speechless and overjoyed.", ["Joy", "Surprise"]),
]

print("=== EMOTION CLASSIFICATION TESTS ===")
for text, valid_preds in emotion_tests:
    r = classifier.classify(text, "emotion")
    pred = r["prediction"]
    conf = r["confidence"]
    status = "PASS" if pred in valid_preds else "FAIL"
    print(f"[{status}] '{text}' -> {pred} ({conf}%)")

intent_tests = [
    ("I'd like to book a table for four people this Saturday evening.", ["Inquiry"]),
    ("I want to cancel my subscription", ["Cancellation"]),
    ("Can you tell me what your opening hours are on weekends?", ["Inquiry"]),
    ("I'm writing to complain about the poor quality of the item I received.", ["Complaint"]),
    ("Could you help me reset my account password", ["Technical Support"]),
    ("I'd like to schedule an appointment with a specialist next week.", ["Inquiry"]),
    ("What is the status of my order that I placed three days ago?", ["Order Tracking"]),
    ("I want a refund for the product since it arrived damaged.", ["Refund"]),
    ("Just wanted to say the support team was fantastic", ["Feedback"]),
    ("Is it possible to upgrade my current plan to the premium tier?", ["Inquiry"]),
]

print("\n=== LIVE API CHECK VIA HTTP ===")
import urllib.request, json
sample_emotions = [
    ("I can't stop smiling", "Joy"),
    ("I'm furious that they cancelled my flight without any warning.", "Anger"),
    ("I miss my family so much during the holidays", "Sadness"),
    ("I'm nervous about my job interview scheduled for tomorrow morning.", "Fear"),
    ("I'd like to book a table for four people this Saturday evening.", "Inquiry"),
    ("Just wanted to say the support team was fantastic", "Feedback"),
]

for text, exp in sample_emotions:
    task = "intent" if "table" in text or "support team" in text else "emotion"
    req = urllib.request.Request(
        "http://localhost:8000/api/classify",
        data=json.dumps({"text": text, "task": task, "save_to_history": False}).encode(),
        headers={"Content-Type": "application/json"}
    )
    res = json.loads(urllib.request.urlopen(req).read())
    print(f"[{res['prediction'] == exp}] {text[:42]:<42} -> {res['prediction']} ({res['confidence']}%)")
