import { useState } from "react";
import { Tag, Wand2, HeartHandshake, HelpCircle, ShieldAlert, Sparkles } from "lucide-react";
import TopBar from "../components/TopBar";
import Card from "../components/Card";
import api from "../lib/api";

const TASKS = [
  {
    id: "topic",
    label: "Topic Classification",
    categories: ["Technology", "Sports", "Health", "Finance", "Politics", "Entertainment", "Education"],
  },
  {
    id: "sentiment",
    label: "Sentiment Classification",
    categories: ["Positive", "Neutral", "Negative"],
  },
  {
    id: "spam",
    label: "Spam Detection",
    categories: ["Spam", "Not Spam"],
  },
  {
    id: "intent",
    label: "Intent Classification",
    categories: ["Inquiry", "Complaint", "Feedback", "Order Tracking", "Refund", "Cancellation", "Technical Support"],
  },
  {
    id: "emotion",
    label: "Emotion Classification",
    categories: ["Joy", "Sadness", "Anger", "Fear", "Surprise", "Love", "Neutral"],
  },
];

const SAMPLE_TEXT = {
  topic: "The stock market rose sharply today.",
  sentiment: "The product is amazing and works perfectly!",
  spam: "Congratulations! You have won ₹10,000. Click here now!",
  intent: "I want to cancel my order.",
  emotion: "I am so happy and excited today!",
};

const EMOTION_EMOJIS = {
  Joy: "✨",
  Love: "💖",
  Surprise: "⚡",
  Anger: "🔥",
  Sadness: "💧",
  Fear: "🛡️",
  Neutral: "⚖️",
};

export default function ClassifyText() {
  const [task, setTask] = useState("topic");
  const [text, setText] = useState(SAMPLE_TEXT.topic);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeTask = TASKS.find((t) => t.id === task);

  function handleTaskChange(id) {
    setTask(id);
    setText(SAMPLE_TEXT[id]);
    setResult(null);
  }

  async function handleClassify() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const r = await api.classify(text, task);
      setResult(r);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <TopBar title="Classify Text" subtitle="Choose a classification task, enter text, and get instant machine learning predictions." />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
        {TASKS.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTaskChange(t.id)}
            className={`text-left rounded-2xl border p-4 transition-colors cursor-pointer ${
              task === t.id ? "bg-tan/15 border-tan/50" : "bg-surface border-border hover:border-border-light"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Tag size={15} className={task === t.id ? "text-tan-light" : "text-ink-muted"} />
              <span className="font-semibold text-ink text-[13.5px] truncate">{t.label}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {t.categories.slice(0, 3).map((c) => (
                <span key={c} className="text-[10.5px] bg-surface-2 text-ink-muted px-1.5 py-0.5 rounded-full">
                  {c}
                </span>
              ))}
              {t.categories.length > 3 && (
                <span className="text-[10.5px] bg-surface-2 text-ink-faint px-1 py-0.5 rounded-full">
                  +{t.categories.length - 3}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card title={`Input — ${activeTask.label}`}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-[14.5px] text-ink resize-none outline-none focus:border-tan/60"
            placeholder="Enter text to classify..."
          />
          <button
            onClick={handleClassify}
            disabled={loading}
            className="mt-4 w-full bg-olive hover:bg-olive-dark transition-colors text-[#181a10] font-semibold rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer text-[14.5px]"
          >
            <Wand2 size={17} />
            {loading ? "Classifying..." : "Classify Text"}
          </button>
          {error && <p className="text-danger text-[13px] mt-3">{error}</p>}
        </Card>

        <Card title="Prediction Results">
          {result ? (
            <div className="space-y-4">
              <div className="bg-surface-2 border border-border/80 rounded-2xl p-5 text-center">
                <div className="text-[12.5px] uppercase tracking-wider text-ink-muted font-medium mb-1">
                  Predicted {task === "sentiment" ? "Sentiment" : task === "intent" ? "User Intent" : task === "emotion" ? "Emotion" : "Class"}
                </div>
                <div className="text-[28px] font-bold text-olive-light break-words flex items-center justify-center gap-2">
                  {task === "emotion" && <span>{EMOTION_EMOJIS[result.prediction] || "🎭"}</span>}
                  <span>{result.prediction}</span>
                </div>

                <div className="flex items-center justify-center gap-3 mt-2">
                  <span className="text-[13px] text-ink-muted">Confidence:</span>
                  <span className="bg-tan/20 text-tan-light px-3 py-0.5 rounded-full text-[13.5px] font-semibold">
                    {result.confidence}%
                  </span>
                </div>

                {/* Emotion badge when sentiment task is selected */}
                {task === "sentiment" && result.emotion && (
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-center gap-2">
                    <span className="text-[13px] text-ink-muted">Detected Emotion:</span>
                    <span className="bg-olive/20 text-olive-light border border-olive/30 px-3 py-1 rounded-full text-[13px] font-bold flex items-center gap-1.5">
                      <span>{EMOTION_EMOJIS[result.emotion] || "🎭"}</span>
                      {result.emotion}
                    </span>
                  </div>
                )}
              </div>

              {/* Emotion Score Breakdown */}
              {(task === "emotion" || task === "sentiment") && result.emotion_scores && (
                <div className="bg-surface-2/40 border border-border/60 rounded-xl p-4 space-y-2">
                  <div className="text-[12.5px] text-ink-muted font-semibold mb-2">Emotion Breakdown:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {result.emotion_scores.slice(0, 6).map((em) => (
                      <div key={em.emotion} className="flex items-center justify-between text-[12.5px] bg-surface-2 border border-border/50 px-2.5 py-1.5 rounded-lg">
                        <span className="text-ink-soft flex items-center gap-1.5">
                          <span>{EMOTION_EMOJIS[em.emotion] || "•"}</span>
                          {em.emotion}
                        </span>
                        <span className="font-semibold text-ink-muted">{em.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-3">
                <div className="text-[13px] text-ink-muted mb-2 font-medium">Extracted Keywords</div>
                <div className="flex flex-wrap gap-2">
                  {result.keywords && result.keywords.length > 0 ? (
                    result.keywords.map((k) => (
                      <span key={k} className="bg-surface-2 border border-border text-ink-soft text-[12px] px-3 py-1 rounded-full">
                        {k}
                      </span>
                    ))
                  ) : (
                    <span className="text-ink-faint text-[12px]">No keywords extracted</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-ink-muted text-[14px] text-center py-14">
              Enter text and click Classify to see model predictions and emotions.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
