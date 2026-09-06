import { useEffect, useState } from "react";
import { LineChart } from "lucide-react";
import TopBar from "../components/TopBar";
import Card from "../components/Card";
import api from "../lib/api";

const TASKS = [
  { id: "topic", label: "Topic Classification" },
  { id: "sentiment", label: "Sentiment Classification" },
  { id: "spam", label: "Spam Detection" },
  { id: "intent", label: "Intent Classification" },
  { id: "emotion", label: "Emotion Classification" },
];

export default function ModelPerformance() {
  const [task, setTask] = useState("topic");
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getPerformance(task).then(setMetrics).catch((e) => setError(e.message));
  }, [task]);

  return (
    <div>
      <TopBar title="Model Performance" subtitle="Evaluation metrics computed on a held-out test split for each task." />

      <div className="flex gap-2 mb-5">
        {TASKS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTask(t.id)}
            className={`px-4 py-2 rounded-xl text-[13.5px] font-medium transition-colors ${
              task === t.id ? "bg-tan text-[#241d10]" : "bg-surface border border-border text-ink-soft hover:border-border-light"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="text-danger text-[13px] mb-4">{error}</p>}

      {metrics && (
        <>
          <div className="grid grid-cols-4 gap-5 mb-5">
            <MetricCard label="Accuracy" value={metrics.accuracy} />
            <MetricCard label="Precision" value={metrics.precision} />
            <MetricCard label="Recall" value={metrics.recall} />
            <MetricCard label="F1 Score" value={metrics.f1_score} />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Card title="Confusion Matrix" icon={LineChart}>
              <div className="overflow-x-auto">
                <table className="text-[12.5px] w-full">
                  <thead>
                    <tr>
                      <th className="p-2"></th>
                      <th className="p-2 text-ink-muted font-medium text-center" colSpan={metrics.labels.length}>
                        Predicted
                      </th>
                    </tr>
                    <tr>
                      <th className="p-2"></th>
                      {metrics.labels.map((l) => (
                        <th key={l} className="p-2 text-ink-muted font-medium text-center whitespace-nowrap">
                          {l}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.confusion_matrix.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2 text-ink-muted font-medium whitespace-nowrap">{metrics.labels[i]}</td>
                        {row.map((val, j) => (
                          <td
                            key={j}
                            className="p-2 text-center rounded-lg"
                            style={{
                              background: i === j ? "rgba(139,146,104,0.25)" : "rgba(255,255,255,0.02)",
                              color: i === j ? "#a7ad86" : "#c9c5b6",
                              fontWeight: i === j ? 700 : 500,
                            }}
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[12px] text-ink-faint mt-4">
                Computed on a {metrics.test_size}-example held-out test split ({metrics.train_size} training examples).
              </p>
            </Card>

            <Card title="Model Comparison">
              <div className="space-y-3">
                {metrics.model_comparison.map((m, i) => (
                  <div key={m.model} className="flex items-center gap-4">
                    <span className="w-40 text-[13.5px] text-ink-soft shrink-0">{m.model}</span>
                    <div className="flex-1 h-2.5 bg-surface-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${i === 0 ? "bg-tan" : "bg-olive"}`}
                        style={{ width: `${m.accuracy}%` }}
                      />
                    </div>
                    <span className="text-[13.5px] font-semibold text-ink w-14 text-right">{m.accuracy}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-tan/10 border border-tan/30 rounded-xl px-4 py-3">
                <p className="text-[13px] text-tan-light">
                  <span className="font-semibold">{metrics.best_model}</span> was automatically selected as the
                  best-performing model for this task.
                </p>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 text-center shadow-card">
      <div className="text-[28px] font-bold text-ink">{value}%</div>
      <div className="text-[13px] text-ink-muted mt-1.5">{label}</div>
    </div>
  );
}
