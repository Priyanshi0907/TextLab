import { useState, useRef } from "react";
import { UploadCloud, Download, FileSpreadsheet } from "lucide-react";
import TopBar from "../components/TopBar";
import Card from "../components/Card";
import DonutChart, { PALETTE } from "../components/DonutChart";
import api from "../lib/api";

export default function BatchAnalysis() {
  const [task, setTask] = useState("sentiment");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  async function handleUpload(f) {
    if (!f) return;
    setFile(f);
    setLoading(true);
    setError(null);
    try {
      const r = await api.batchAnalyze(f, task);
      setResult(r);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    if (!result) return;
    const blob = await api.exportBatch(result.results);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "batch_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <TopBar title="Batch Analysis" subtitle="Upload a CSV of texts and classify every row in one pass." />

      <Card title="Upload Dataset" icon={FileSpreadsheet} className="mb-5">
        <div className="flex items-center gap-4 mb-4">
          <label className="text-[13px] text-ink-muted">Classification Type</label>
          <select
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="bg-surface-2 border border-border rounded-xl px-4 py-2 text-[14px] text-ink outline-none focus:border-tan/60 cursor-pointer"
          >
            <option value="topic">Topic Classification</option>
            <option value="sentiment">Sentiment Classification</option>
            <option value="spam">Spam Detection</option>
            <option value="intent">Intent Classification</option>
            <option value="emotion">Emotion Classification</option>
          </select>
        </div>

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleUpload(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-border rounded-2xl py-12 flex flex-col items-center justify-center cursor-pointer hover:border-tan/50 transition-colors"
        >
          <UploadCloud size={32} className="text-ink-muted mb-3" />
          <p className="text-[14px] text-ink-soft">
            {file ? file.name : "Drag & drop a CSV file, or click to browse"}
          </p>
          <p className="text-[12px] text-ink-faint mt-1">
            Expects a "text" (or "review"/"comment") column — up to 2,000 rows
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files[0])}
          />
        </div>
        {loading && <p className="text-ink-muted text-[13px] mt-3">Processing rows…</p>}
        {error && <p className="text-danger text-[13px] mt-3">{error}</p>}
      </Card>

      {result && (
        <div className="grid grid-cols-3 gap-5">
          <Card title="Summary" className="col-span-1">
            <div className="flex justify-center mb-5">
              <DonutChart
                data={result.category_distribution.map((c) => ({ name: c.category, value: c.count }))}
                size={150}
              />
            </div>
            <div className="space-y-2.5 mb-4">
              {result.category_distribution.map((c, i) => (
                <div key={c.category} className="flex items-center justify-between text-[13px]">
                  <span className="flex items-center gap-2 text-ink-soft">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                    {c.category}
                  </span>
                  <span className="text-ink-muted">{c.percent}%</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2 text-[13.5px]">
              <div className="flex justify-between"><span className="text-ink-muted">Total texts</span><span className="text-ink font-semibold">{result.total_texts}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Successful</span><span className="text-success font-semibold">{result.successful}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Failed</span><span className="text-danger font-semibold">{result.failed}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Avg confidence</span><span className="text-ink font-semibold">{result.avg_confidence}%</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Most common</span><span className="text-ink font-semibold">{result.most_common_category}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Processing time</span><span className="text-ink font-semibold">{result.processing_time}s</span></div>
            </div>
            <button
              onClick={handleExport}
              className="mt-5 w-full bg-olive hover:bg-olive-dark transition-colors text-[#181a10] font-semibold rounded-xl py-2.5 flex items-center justify-center gap-2 text-[13.5px]"
            >
              <Download size={15} />
              Export Results (CSV)
            </button>
          </Card>

          <Card title="Results" className="col-span-2">
            <div className="max-h-[480px] overflow-y-auto">
              <table className="w-full text-[13.5px]">
                <thead>
                  <tr className="text-left text-ink-muted border-b border-border">
                    <th className="pb-2 font-medium">Text</th>
                    <th className="pb-2 font-medium">Prediction</th>
                    <th className="pb-2 font-medium text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {result.results.map((r, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2.5 text-ink-soft pr-4">{r.text}</td>
                      <td className="py-2.5">
                        <span className="bg-surface-2 border border-border text-ink-soft px-2.5 py-1 rounded-full text-[12px]">
                          {r.prediction}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-ink-muted">{r.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
