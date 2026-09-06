import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Binary, BarChart3, ListFilter, CheckCircle2 } from "lucide-react";
import TopBar from "../components/TopBar";
import Card from "../components/Card";
import api from "../lib/api";

const DEFAULT_TEXT = "The Companies are developing AMAZING AI products!";

const OPTIONS = [
  { key: "lowercase", label: "Convert text to lowercase" },
  { key: "remove_punct", label: "Remove punctuation" },
  { key: "remove_spaces", label: "Remove unnecessary spaces" },
  { key: "remove_special", label: "Remove special characters & URLs" },
  { key: "stopwords", label: "Remove stopwords" },
  { key: "tokenize_step", label: "Tokenization" },
  { key: "lemmatization", label: "Lemmatization" },
  { key: "stemming", label: "Stemming (Suffix Reduction)" },
];

export default function TextProcessor() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [opts, setOpts] = useState({
    lowercase: true,
    remove_punct: true,
    remove_spaces: true,
    remove_special: true,
    stopwords: true,
    tokenize_step: true,
    lemmatization: true,
    stemming: false,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pipeline"); // pipeline | frequency | features

  useEffect(() => {
    handleProcess(DEFAULT_TEXT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleProcess(inputText = text) {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const r = await api.process(inputText, opts);
      setResult(r);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleToggle(key, val) {
    const next = { ...opts, [key]: val };
    if (key === "lemmatization" && val) next.stemming = false;
    if (key === "stemming" && val) next.lemmatization = false;
    setOpts(next);
  }

  return (
    <div>
      <TopBar
        title="Text Processing & Feature Extraction"
        subtitle="Inspect how raw text is cleaned, tokenized, lemmatized, and converted into numerical TF-IDF vectors."
      />

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <Card title="Input Text">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-[14.5px] text-ink resize-none outline-none focus:border-tan/60"
              placeholder="Enter text to preprocess..."
            />
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => handleProcess()}
                disabled={loading}
                className="bg-olive hover:bg-olive-dark transition-colors text-[#181a10] font-semibold rounded-xl px-6 py-2.5 flex items-center gap-2 disabled:opacity-60 cursor-pointer text-[14px]"
              >
                <Sparkles size={16} />
                {loading ? "Processing..." : "Process Text"}
              </button>
              <button
                onClick={() => {
                  setText(DEFAULT_TEXT);
                  handleProcess(DEFAULT_TEXT);
                }}
                className="bg-surface-2 border border-border hover:bg-border text-ink-soft rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors cursor-pointer"
              >
                Reset to Example
              </button>
            </div>
            {error && <p className="text-danger text-[13px] mt-3">{error}</p>}
          </Card>

          {result && (
            <Card>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-2 border border-border rounded-xl p-4">
                  <div className="text-[12px] uppercase tracking-wider text-ink-muted font-semibold mb-1">
                    Original Text
                  </div>
                  <div className="text-[14px] text-ink-soft italic font-serif">
                    "{result.original}"
                  </div>
                </div>
                <div className="bg-olive/10 border border-olive/30 rounded-xl p-4">
                  <div className="text-[12px] uppercase tracking-wider text-olive-light font-semibold mb-1">
                    Processed Output
                  </div>
                  <div className="text-[14.5px] text-olive-light font-mono font-medium">
                    {result.processed || <span className="text-ink-faint italic">(empty after processing)</span>}
                  </div>
                </div>
              </div>

              {/* View Tabs */}
              <div className="flex items-center gap-2 border-b border-border pb-3 mb-5">
                <button
                  onClick={() => setActiveTab("pipeline")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13.5px] font-medium transition-colors cursor-pointer ${
                    activeTab === "pipeline"
                      ? "bg-tan text-[#241d10]"
                      : "text-ink-soft hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  <ListFilter size={15} />
                  Processing Steps ({result.steps?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("frequency")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13.5px] font-medium transition-colors cursor-pointer ${
                    activeTab === "frequency"
                      ? "bg-tan text-[#241d10]"
                      : "text-ink-soft hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  <BarChart3 size={15} />
                  Word Frequency ({result.word_frequency?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("features")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13.5px] font-medium transition-colors cursor-pointer ${
                    activeTab === "features"
                      ? "bg-tan text-[#241d10]"
                      : "text-ink-soft hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  <Binary size={15} />
                  Feature Extraction (TF-IDF & BoW)
                </button>
              </div>

              {/* Tab 1: Step by Step Pipeline */}
              {activeTab === "pipeline" && (
                <div className="space-y-2.5">
                  {result.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 bg-surface-2 border border-border/80 rounded-xl px-4 py-3">
                      <div className="w-6 h-6 rounded-full bg-olive/20 text-olive-light flex items-center justify-center text-[12px] font-bold shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-[12.5px] font-semibold text-tan-light min-w-[200px] shrink-0">
                        {step.name}
                      </span>
                      <ArrowRight size={14} className="text-ink-faint shrink-0" />
                      <span className="text-[13.5px] text-ink-soft font-mono truncate">{step.output || "—"}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Word Frequency Detection */}
              {activeTab === "frequency" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-[13.5px]">
                    <thead>
                      <tr className="text-left text-ink-muted border-b border-border">
                        <th className="pb-2.5 font-medium">Word Token</th>
                        <th className="pb-2.5 font-medium text-center">Occurrences</th>
                        <th className="pb-2.5 font-medium text-right">Relative Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.word_frequency?.map((item) => (
                        <tr key={item.word} className="border-b border-border/40">
                          <td className="py-2.5 font-mono text-ink-soft">{item.word}</td>
                          <td className="py-2.5 text-center">
                            <span className="bg-surface-2 border border-border px-2.5 py-0.5 rounded-full text-[12px] font-semibold text-ink">
                              {item.count}
                            </span>
                          </td>
                          <td className="py-2.5 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <span className="text-ink-muted text-[13px]">{item.frequency}%</span>
                              <div className="w-24 h-2 bg-surface-2 rounded-full overflow-hidden">
                                <div className="h-full bg-olive rounded-full" style={{ width: `${Math.min(item.frequency * 2, 100)}%` }} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 3: Feature Extraction (TF-IDF & Bag of Words) */}
              {activeTab === "features" && (
                <div className="space-y-6">
                  <div>
                    <div className="text-[13.5px] font-semibold text-ink mb-1 flex items-center gap-2">
                      <Binary size={15} className="text-tan-light" />
                      TF-IDF Numerical Representation (Term Frequency - Inverse Document Frequency)
                    </div>
                    <p className="text-[12.5px] text-ink-muted mb-3">
                      Converts text tokens into weighted mathematical vectors used by Naive Bayes / SVM classifiers.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {result.features?.tfidf?.map((feat) => (
                        <div key={feat.term} className="bg-surface-2 border border-border rounded-xl p-3 flex items-center justify-between">
                          <div>
                            <div className="font-mono text-[13.5px] text-ink font-semibold">{feat.term}</div>
                            <div className="text-[11.5px] text-ink-muted">TF: {feat.tf} | IDF: {feat.idf}</div>
                          </div>
                          <div className="text-right">
                            <span className="bg-tan/20 text-tan-light px-2.5 py-1 rounded-lg font-mono text-[13px] font-bold">
                              {feat.tfidf}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="text-[13.5px] font-semibold text-ink mb-1">
                      Bag of Words (BoW) Vector
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.features?.bow?.map((b) => (
                        <div key={b.term} className="bg-surface-2 border border-border/80 px-3 py-1.5 rounded-xl text-[12.5px] flex items-center gap-2">
                          <span className="font-mono text-ink-soft">{b.term}</span>
                          <span className="w-5 h-5 rounded-full bg-border text-ink text-[11px] font-bold flex items-center justify-center">
                            {b.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <Card title="Preprocessing Pipeline">
            <p className="text-[12px] text-ink-muted mb-4">
              Toggle preprocessing stages to see how the downstream text changes:
            </p>
            <div className="space-y-3">
              {OPTIONS.map((o) => (
                <label key={o.key} className="flex items-center gap-3 text-[13.5px] text-ink-soft cursor-pointer hover:text-ink transition-colors">
                  <input
                    type="checkbox"
                    checked={opts[o.key] || false}
                    onChange={(e) => handleToggle(o.key, e.target.checked)}
                    className="w-4 h-4 accent-olive cursor-pointer"
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </Card>

          {result && (
            <Card title="Text Statistics">
              <div className="space-y-3 text-[13.5px]">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Token Count</span>
                  <span className="text-ink font-semibold">{result.stats.word_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Unique Vocabulary</span>
                  <span className="text-ink font-semibold">{result.stats.unique_words}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Raw Characters</span>
                  <span className="text-ink font-semibold">{result.stats.characters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Vector Dimensions</span>
                  <span className="text-olive-light font-mono font-semibold">{result.tokens?.length || 0}D</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
