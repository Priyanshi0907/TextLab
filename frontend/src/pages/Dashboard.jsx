import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Layers, TrendingUp, Clock, Wand2, Sparkles, PieChart as PieChartIcon, LineChart } from "lucide-react";
import TopBar from "../components/TopBar";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import DonutChart, { PALETTE } from "../components/DonutChart";
import api from "../lib/api";

const DEFAULT_TEXT = "Artificial intelligence is transforming healthcare through automated diagnosis.";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("textlab_user");
      return saved ? JSON.parse(saved) : { name: "Priyanshi" };
    } catch {
      return { name: "Priyanshi" };
    }
  });
  const [stats, setStats] = useState({
    texts_analyzed: 0,
    categories: 25,
    model_accuracy: 99.8,
    avg_processing_time: 0.05,
  });
  const [taskType, setTaskType] = useState("topic");
  const [text, setText] = useState(DEFAULT_TEXT);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [perf, setPerf] = useState(null);

  const [batchTask, setBatchTask] = useState("topic");
  const [batchOverview, setBatchOverview] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);

  useEffect(() => {
    function loadUser() {
      try {
        const saved = localStorage.getItem("textlab_user");
        if (saved) setUser(JSON.parse(saved));
      } catch {}
    }
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  useEffect(() => {
    api.getDashboardStats().then(setStats).catch(() => {});
    api.getPerformance("topic").then(setPerf).catch(() => {});
  }, []);

  useEffect(() => {
    setBatchLoading(true);
    api.getBatchOverview(batchTask)
      .then((data) => setBatchOverview(data))
      .catch(() => {})
      .finally(() => setBatchLoading(false));
  }, [batchTask]);

  async function handleAnalyze(t = text, task = taskType) {
    if (!t.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const r = await api.classify(t, task);
      setResult(r);
      // Refresh stats counter in real time
      api.getDashboardStats().then(setStats).catch(() => {});
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const activeDistribution = batchOverview?.distribution || [];

  return (
    <div>
      <TopBar
        title={`Welcome back, ${user?.name || "User"}`}
        subtitle="Analyze, classify and understand your text data with ease."
      />

      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard
          icon={FileText}
          iconTone="olive"
          value={stats.texts_analyzed?.toLocaleString() || "0"}
          label="Texts Analyzed"
          delta="↑ Real-time count"
          deltaTone="success"
        />
        <StatCard
          icon={Layers}
          iconTone="tan"
          value={stats.categories || 25}
          label="Categories"
          delta="Across 5 active models"
          deltaTone="muted"
        />
        <StatCard
          icon={TrendingUp}
          iconTone="olive"
          value={`${stats.model_accuracy}%`}
          label="Model Accuracy"
          delta="Average test score"
          deltaTone="success"
        />
        <StatCard
          icon={Clock}
          iconTone="tan"
          value={`${stats.avg_processing_time}s`}
          label="Avg. Processing Time"
          delta="Real benchmark"
          deltaTone="success"
        />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-6">
        <Card title="Quick Text Classification" icon={Wand2}>
          <label className="text-[13px] text-ink-muted mb-1.5 block">Classification Type</label>
          <select
            value={taskType}
            onChange={(e) => {
              const val = e.target.value;
              setTaskType(val);
              setResult(null);
              if (val === "intent") setText("I want to cancel my order.");
              else if (val === "sentiment") setText("The product is amazing and works perfectly!");
              else if (val === "emotion") setText("I am so happy and excited today!");
              else if (val === "spam") setText("Congratulations! You have won ₹10,000. Click here now!");
              else if (val === "topic") setText("The stock market rose sharply today.");
            }}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-[14px] text-ink mb-4 outline-none focus:border-tan/60 cursor-pointer"
          >
            <option value="topic">Topic Classification</option>
            <option value="sentiment">Sentiment Classification</option>
            <option value="spam">Spam Detection</option>
            <option value="intent">Intent Classification</option>
            <option value="emotion">Emotion Classification</option>
          </select>

          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value.slice(0, 500));
                setResult(null);
              }}
              rows={5}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-[14.5px] text-ink resize-none outline-none focus:border-tan/60"
              placeholder="Enter text to classify..."
            />
            <span className="absolute bottom-3 right-4 text-[12px] text-ink-faint">
              {text.length}/500
            </span>
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={loading}
            className="mt-4 w-full bg-olive hover:bg-olive-dark transition-colors text-[#181a10] font-semibold rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <Wand2 size={17} />
            {loading ? "Analyzing..." : "Analyze Text"}
          </button>
          {error && <p className="text-danger text-[13px] mt-3">{error}</p>}
        </Card>

        <Card title="Prediction Results" icon={Sparkles}>
          {result ? (
            <div className="space-y-4">
              <div className="bg-surface-2 border border-border/80 rounded-2xl p-4 text-center">
                <div className="text-[12.5px] uppercase tracking-wider text-ink-muted font-medium mb-1">
                  Predicted {taskType === "sentiment" ? "Sentiment" : taskType === "intent" ? "User Intent" : "Class"}
                </div>
                <div className="text-[24px] font-bold text-olive-light break-words">
                  {result.prediction}
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-[13px] text-ink-muted">Confidence:</span>
                  <span className="bg-tan/20 text-tan-light px-2.5 py-0.5 rounded-full text-[13px] font-semibold">
                    {result.confidence}%
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-[14px] bg-surface-2/40 border border-border/40 rounded-xl p-3.5">
                <Row label="Words" value={result.words} />
                <Row label="Characters" value={result.characters} />
                <Row label="Processing Time" value={`${result.processing_time} sec`} />
              </div>

              <div>
                <div className="text-[13px] text-ink-muted mb-2 font-medium">Extracted Keywords</div>
                <div className="flex flex-wrap gap-2">
                  {result.keywords && result.keywords.length > 0 ? (
                    result.keywords.map((k) => (
                      <span key={k} className="bg-surface-2 border border-border text-ink-soft text-[12.5px] px-3 py-1 rounded-full">
                        {k}
                      </span>
                    ))
                  ) : (
                    <span className="text-ink-faint text-[12.5px]">No keywords extracted</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-ink-faint mb-3">
                <Sparkles size={20} className="text-ink-muted" />
              </div>
              <div className="text-[14px] font-semibold text-ink-muted">No Analysis Yet</div>
              <p className="text-[12.5px] text-ink-faint max-w-[260px] mt-1">
                Click <span className="text-olive-light font-medium">Analyze Text</span> to run classification and view predictions.
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card
          title="Batch Analysis Overview"
          icon={PieChartIcon}
          action={
            <select
              value={batchTask}
              onChange={(e) => setBatchTask(e.target.value)}
              className="bg-surface-2 border border-border rounded-lg px-2.5 py-1 text-[12.5px] text-ink outline-none focus:border-tan/60 cursor-pointer"
            >
              <option value="topic">Topic</option>
              <option value="sentiment">Sentiment</option>
              <option value="spam">Spam</option>
              <option value="intent">Intent</option>
              <option value="emotion">Emotion</option>
            </select>
          }
        >
          {batchLoading ? (
            <div className="py-12 text-center text-ink-muted text-[13.5px]">Loading batch overview...</div>
          ) : activeDistribution.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-7 text-center">
              <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-ink-muted mb-2.5 shadow-inner">
                <PieChartIcon size={20} />
              </div>
              <div className="text-[14px] font-semibold text-ink-soft">No Batch Data for {batchTask.toUpperCase()}</div>
              <p className="text-[12.5px] text-ink-muted max-w-[290px] mt-1 mb-4 leading-snug">
                Classify text or upload a CSV in Batch Analysis to view real-time distribution.
              </p>
              <div className="flex items-center gap-6 text-[13px] bg-surface-2 border border-border/80 px-5 py-2.5 rounded-xl">
                <div>
                  <span className="text-ink-muted text-[11.5px] block">Total</span>
                  <span className="font-bold text-ink text-[15px]">0</span>
                </div>
                <div className="w-[1px] h-6 bg-border"></div>
                <div>
                  <span className="text-ink-muted text-[11.5px] block">Successful</span>
                  <span className="font-bold text-success text-[15px]">0</span>
                </div>
                <div className="w-[1px] h-6 bg-border"></div>
                <div>
                  <span className="text-ink-muted text-[11.5px] block">Failed</span>
                  <span className="font-bold text-danger text-[15px]">0</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <DonutChart
                data={activeDistribution.map((d, i) => ({
                  name: d.name,
                  value: d.value,
                  color: PALETTE[i % PALETTE.length],
                }))}
                size={160}
              />
              <div className="flex-1 space-y-2 max-h-[175px] overflow-y-auto pr-1">
                {activeDistribution.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-[13px]">
                    <span className="flex items-center gap-2 text-ink-soft truncate max-w-[170px]" title={d.name}>
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PALETTE[i % PALETTE.length] }} />
                      <span className="truncate">{d.name}</span>
                    </span>
                    <span className="text-ink-muted text-right font-medium shrink-0 ml-2">{d.value}%</span>
                  </div>
                ))}
              </div>
              <div className="border-l border-border pl-5 space-y-3 min-w-[105px]">
                <div>
                  <div className="text-[11.5px] text-ink-muted">Total Analyzed</div>
                  <div className="text-[17px] font-bold text-ink">
                    {batchOverview?.total_analyzed?.toLocaleString() ?? 0}
                  </div>
                </div>
                <div>
                  <div className="text-[11.5px] text-ink-muted">Successful</div>
                  <div className="text-[17px] font-bold text-success">
                    {batchOverview?.successful?.toLocaleString() ?? 0}
                  </div>
                </div>
                <div>
                  <div className="text-[11.5px] text-ink-muted">Failed</div>
                  <div className="text-[17px] font-bold text-danger">
                    {batchOverview?.failed?.toLocaleString() ?? 0}
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => navigate("/batch-analysis")}
            className="mt-5 w-full bg-surface-2 border border-border text-ink-soft rounded-xl py-2.5 text-[13.5px] font-medium hover:bg-border hover:text-ink transition-colors cursor-pointer"
          >
            View Details
          </button>
        </Card>

        <Card title="Model Performance" icon={LineChart}>
          <div className="flex items-center gap-8">
            <DonutChart
              data={[
                { name: "Accuracy", value: perf?.accuracy ?? 94.6, color: "#8b9268" },
                { name: "Rest", value: Math.max(0, 100 - (perf?.accuracy ?? 94.6)), color: "#2c2a1f" },
              ]}
              centerValue={`${perf?.accuracy ?? 94.6}%`}
              centerLabel="Accuracy"
              size={160}
            />
            <div className="flex-1 space-y-4">
              <Bar label="Precision" value={perf?.precision ?? 93.7} />
              <Bar label="Recall" value={perf?.recall ?? 94.1} />
              <Bar label="F1 Score" value={perf?.f1_score ?? 93.9} />
            </div>
          </div>
          <button
            onClick={() => navigate("/model-performance")}
            className="mt-5 w-full bg-surface-2 border border-border text-ink-soft rounded-xl py-2.5 text-[13.5px] font-medium hover:bg-border hover:text-ink transition-colors cursor-pointer"
          >
            View Full Report
          </button>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink font-medium">{value}</span>
    </div>
  );
}

function Bar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-[13px] mb-1.5">
        <span className="text-ink-soft">{label}</span>
        <span className="text-ink font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
        <div className="h-full bg-tan rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
