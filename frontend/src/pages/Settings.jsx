import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import TopBar from "../components/TopBar";
import Card from "../components/Card";
import api from "../lib/api";

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings);
  }, []);

  async function update(patch) {
    const next = { ...settings, ...patch };
    setSettings(next);
    await api.updateSettings(patch);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  if (!settings) return null;

  return (
    <div>
      <TopBar title="Settings" subtitle="Configure the default model, preprocessing steps, and app behavior." />

      <div className="grid grid-cols-2 gap-5">
        <Card title="Model">
          <Field label="Model">
            <select
              value={settings.model}
              onChange={(e) => update({ model: e.target.value })}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-[14px] text-ink outline-none focus:border-tan/60"
            >
              <option>Logistic Regression</option>
              <option>Naive Bayes</option>
              <option>SVM</option>
            </select>
          </Field>
          <Field label="Classification type">
            <select
              value={settings.classification_type}
              onChange={(e) => update({ classification_type: e.target.value })}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-[14px] text-ink outline-none focus:border-tan/60 cursor-pointer"
            >
              <option>Topic Classification</option>
              <option>Sentiment & Emotion</option>
              <option>Spam Detection</option>
              <option>Intent Classification</option>
            </select>
          </Field>
        </Card>

        <Card title="Processing Options">
          <Toggle
            label="Remove stopwords"
            checked={settings.remove_stopwords}
            onChange={(v) => update({ remove_stopwords: v })}
          />
          <Toggle
            label="Lemmatization"
            checked={settings.lemmatization}
            onChange={(v) => update({ lemmatization: v })}
          />
          <Toggle
            label="Lowercase text"
            checked={settings.lowercase_text}
            onChange={(v) => update({ lowercase_text: v })}
          />
        </Card>

        <Card title="Other Options">
          <Field label="Maximum text length">
            <input
              type="number"
              value={settings.max_text_length}
              onChange={(e) => update({ max_text_length: Number(e.target.value) })}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-[14px] text-ink outline-none focus:border-tan/60"
            />
          </Field>
          <Field label="Confidence threshold (%)">
            <input
              type="number"
              value={settings.confidence_threshold}
              onChange={(e) => update({ confidence_threshold: Number(e.target.value) })}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-[14px] text-ink outline-none focus:border-tan/60"
            />
          </Field>
        </Card>

        <Card title="Appearance">
          <Field label="Theme">
            <select
              value={settings.theme}
              onChange={(e) => update({ theme: e.target.value })}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-[14px] text-ink outline-none focus:border-tan/60"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </Field>
          {saved && (
            <div className="flex items-center gap-2 text-success text-[13px] mt-2">
              <Check size={14} /> Settings saved
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="text-[13px] text-ink-muted mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between py-2.5 cursor-pointer">
      <span className="text-[14px] text-ink-soft">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-olive"
      />
    </label>
  );
}
