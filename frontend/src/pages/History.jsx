import { useEffect, useState } from "react";
import { Search, Trash2, FileSpreadsheet, FileText, CheckCircle2, AlertTriangle, Eye, X, Download } from "lucide-react";
import TopBar from "../components/TopBar";
import Card from "../components/Card";
import api from "../lib/api";

export default function History() {
  const [activeTab, setActiveTab] = useState("texts"); // "texts" | "batches"
  const [items, setItems] = useState([]);
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [taskFilter, setTaskFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === "texts") {
        const r = await api.getHistory(search, taskFilter);
        setItems(r.items || []);
      } else {
        const r = await api.getBatchHistory(taskFilter);
        setBatches(r.batches || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(loadData, 250);
    return () => clearTimeout(t);
  }, [search, taskFilter, activeTab]);

  async function handleDeleteItem(id) {
    await api.deleteHistoryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function handleDeleteBatch(id) {
    await api.deleteBatchJob(id);
    setBatches((prev) => prev.filter((b) => b.id !== id));
    if (selectedBatch?.id === id) {
      setSelectedBatch(null);
    }
  }

  async function handleClearAll() {
    const msg =
      activeTab === "texts"
        ? "Are you sure you want to clear all classified text history?"
        : "Are you sure you want to clear all batch history?";
    if (!window.confirm(msg)) return;

    try {
      await api.clearHistory();
      setItems([]);
      setBatches([]);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDownloadBatch(batch) {
    if (!batch.results || batch.results.length === 0) return;
    try {
      const blob = await api.exportBatch(batch.results);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `classified_${batch.filename || "batch"}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
    }
  }

  const filteredBatches = batches.filter((b) => {
    if (!search) return true;
    return b.filename?.toLowerCase().includes(search.toLowerCase()) || b.task?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <TopBar
        title="History"
        subtitle="Browse, search, and manage your previous text classifications and batch analysis files."
      />

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-5 border-b border-border/80 pb-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab("texts");
            setSearch("");
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-all cursor-pointer ${
            activeTab === "texts"
              ? "bg-tan text-[#241d10] shadow-sm"
              : "bg-surface-2/60 text-ink-muted hover:text-ink hover:bg-surface-2"
          }`}
        >
          <FileText size={16} />
          <span>Classified Texts</span>
          <span
            className={`text-[12px] px-2 py-0.5 rounded-full ${
              activeTab === "texts" ? "bg-[#241d10]/15 text-[#241d10]" : "bg-border text-ink-muted"
            }`}
          >
            {items.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("batches");
            setSearch("");
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-all cursor-pointer ${
            activeTab === "batches"
              ? "bg-tan text-[#241d10] shadow-sm"
              : "bg-surface-2/60 text-ink-muted hover:text-ink hover:bg-surface-2"
          }`}
        >
          <FileSpreadsheet size={16} />
          <span>Batch Analysis Jobs</span>
          <span
            className={`text-[12px] px-2 py-0.5 rounded-full ${
              activeTab === "batches" ? "bg-[#241d10]/15 text-[#241d10]" : "bg-border text-ink-muted"
            }`}
          >
            {batches.length}
          </span>
        </button>
      </div>

      <Card>
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeTab === "texts" ? "Search classified texts..." : "Search batch file names..."}
              className="w-full bg-surface-2 border border-border rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-ink outline-none focus:border-tan/60 transition-colors"
            />
          </div>

          <select
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            className="bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-[14px] text-ink outline-none focus:border-tan/60 cursor-pointer"
          >
            <option value="all">All types</option>
            <option value="topic">Topic</option>
            <option value="sentiment">Sentiment</option>
            <option value="spam">Spam</option>
            <option value="intent">Intent</option>
            <option value="emotion">Emotion</option>
          </select>

          <button
            onClick={handleClearAll}
            disabled={activeTab === "texts" ? items.length === 0 : batches.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface-2 hover:bg-danger/10 hover:border-danger/30 hover:text-danger text-ink-muted text-[13.5px] font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={15} />
            <span>Clear All</span>
          </button>
        </div>

        {/* Tab 1: Single Texts Table */}
        {activeTab === "texts" && (
          <div>
            {loading ? (
              <p className="text-ink-muted text-[14px] py-10 text-center">Loading history...</p>
            ) : items.length === 0 ? (
              <div className="py-12 text-center">
                <FileText size={28} className="mx-auto text-ink-faint mb-2" />
                <p className="text-ink-soft text-[14px] font-medium">No classified texts found</p>
                <p className="text-ink-muted text-[12.5px] mt-1">
                  Classify text in the workspace or run a batch analysis to view history here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13.5px]">
                  <thead>
                    <tr className="text-left text-ink-muted border-b border-border">
                      <th className="pb-3 font-medium">Input Text</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Result</th>
                      <th className="pb-3 font-medium">Confidence</th>
                      <th className="pb-3 font-medium">Processing</th>
                      <th className="pb-3 font-medium">When</th>
                      <th className="pb-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-border/50 hover:bg-surface-2/40 transition-colors">
                        <td className="py-3 text-ink max-w-[320px] truncate pr-4 font-normal" title={item.input_text}>
                          {item.input_text}
                        </td>
                        <td className="py-3 text-ink-muted capitalize text-[13px]">{item.task}</td>
                        <td className="py-3">
                          <span className="bg-olive/15 text-olive-light border border-olive/30 px-2.5 py-1 rounded-full text-[12px] font-medium">
                            {item.prediction}
                          </span>
                        </td>
                        <td className="py-3 text-ink-soft font-medium">{item.confidence}%</td>
                        <td className="py-3 text-ink-muted text-[12.5px]">{item.processing_time || "0.01"}s</td>
                        <td className="py-3 text-ink-muted text-[12.5px]">
                          {item.created_at ? new Date(item.created_at.includes("Z") ? item.created_at : item.created_at + "Z").toLocaleString() : "Just now"}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg text-ink-faint hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Batch Analysis Jobs */}
        {activeTab === "batches" && (
          <div>
            {loading ? (
              <p className="text-ink-muted text-[14px] py-10 text-center">Loading batch jobs...</p>
            ) : filteredBatches.length === 0 ? (
              <div className="py-12 text-center">
                <FileSpreadsheet size={28} className="mx-auto text-ink-faint mb-2" />
                <p className="text-ink-soft text-[14px] font-medium">No batch jobs found</p>
                <p className="text-ink-muted text-[12.5px] mt-1">
                  Upload a CSV file in the Batch Analysis section to generate batch history.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13.5px]">
                  <thead>
                    <tr className="text-left text-ink-muted border-b border-border">
                      <th className="pb-3 font-medium">Dataset File</th>
                      <th className="pb-3 font-medium">Model Task</th>
                      <th className="pb-3 font-medium">Total Rows</th>
                      <th className="pb-3 font-medium">Successful</th>
                      <th className="pb-3 font-medium">Failed</th>
                      <th className="pb-3 font-medium">Uploaded</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBatches.map((batch) => (
                      <tr key={batch.id} className="border-b border-border/50 hover:bg-surface-2/40 transition-colors">
                        <td className="py-3.5 text-ink font-semibold flex items-center gap-2">
                          <FileSpreadsheet size={16} className="text-tan-light shrink-0" />
                          <span className="truncate max-w-[220px]" title={batch.filename}>
                            {batch.filename || "Uploaded Dataset"}
                          </span>
                        </td>
                        <td className="py-3.5 text-ink-muted capitalize">{batch.task}</td>
                        <td className="py-3.5 text-ink font-medium">{batch.total?.toLocaleString()}</td>
                        <td className="py-3.5">
                          <span className="flex items-center gap-1.5 text-success font-medium">
                            <CheckCircle2 size={14} />
                            {batch.successful?.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3.5">
                          {batch.failed > 0 ? (
                            <span className="flex items-center gap-1.5 text-danger font-medium">
                              <AlertTriangle size={14} />
                              {batch.failed}
                            </span>
                          ) : (
                            <span className="text-ink-muted">0</span>
                          )}
                        </td>
                        <td className="py-3.5 text-ink-muted text-[12.5px]">
                          {batch.created_at ? new Date(batch.created_at.includes("Z") ? batch.created_at : batch.created_at + "Z").toLocaleString() : "Recently"}
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedBatch(batch)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-2 border border-border text-ink-soft hover:text-ink text-[12px] font-medium transition-colors cursor-pointer"
                              title="Inspect rows"
                            >
                              <Eye size={13} />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleDownloadBatch(batch)}
                              className="p-1.5 rounded-lg text-ink-faint hover:text-tan-light hover:bg-tan/10 transition-colors cursor-pointer"
                              title="Export CSV"
                            >
                              <Download size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteBatch(batch.id)}
                              className="p-1.5 rounded-lg text-ink-faint hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                              title="Delete batch"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Batch Inspection Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141610] border border-[#2b3123] rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-tan/20 flex items-center justify-center text-tan-light">
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-ink leading-tight">{selectedBatch.filename}</h3>
                  <p className="text-[12px] text-ink-muted mt-0.5">
                    Task: <span className="capitalize text-ink-soft">{selectedBatch.task}</span> • Total Rows:{" "}
                    <span className="text-ink-soft">{selectedBatch.total}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadBatch(selectedBatch)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 border border-border text-ink-soft hover:text-ink text-[12.5px] font-medium transition-colors cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download CSV</span>
                </button>
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Table Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedBatch.results && selectedBatch.results.length > 0 ? (
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="text-left text-ink-muted border-b border-border">
                      <th className="pb-2.5 font-medium">Row #</th>
                      <th className="pb-2.5 font-medium">Text Content</th>
                      <th className="pb-2.5 font-medium">Prediction</th>
                      <th className="pb-2.5 font-medium">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBatch.results.map((row, idx) => (
                      <tr key={idx} className="border-b border-border/40 hover:bg-surface-2/30">
                        <td className="py-2.5 text-ink-muted text-[12px] w-14">#{idx + 1}</td>
                        <td className="py-2.5 text-ink-soft pr-4 max-w-[360px] truncate" title={row.text}>
                          {row.text}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11.5px] font-medium ${
                              row.prediction === "Error"
                                ? "bg-danger/20 text-danger"
                                : "bg-olive/20 text-olive-light border border-olive/30"
                            }`}
                          >
                            {row.prediction}
                          </span>
                        </td>
                        <td className="py-2.5 text-ink-muted font-medium">
                          {row.confidence ? `${row.confidence}%` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-ink-muted text-center py-8">No row details stored for this job.</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-border/80 bg-surface flex justify-end">
              <button
                onClick={() => setSelectedBatch(null)}
                className="px-4 py-2 rounded-xl bg-surface-2 border border-border text-ink-soft hover:text-ink text-[13px] font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
