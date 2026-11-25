"use client";

import { useState } from "react";
import { Bars } from "@/components/Bars";
import { FEATURE_INFO, cropName, meta, type CropFeature } from "@/lib/meta";

type Rec = {
  crop: string;
  name: string;
  swahili: string | null;
  probability: number;
  typical: Record<CropFeature, number>;
  typical_range: Record<CropFeature, [number, number]>;
};
type Response = {
  recommendations: Rec[];
  all: { crop: string; probability: number }[];
  warnings: string[];
  model: { inference_ms: number };
};

const FEATURES = meta.crop.features;
const EXAMPLES = ["maize", "kidneybeans", "coffee", "rice", "banana", "mango"];
const start = Object.fromEntries(FEATURES.map((f) => [f, Math.round(meta.crop.ranges[f].median * 10) / 10])) as Record<CropFeature, number>;

const ADVICE: Partial<Record<CropFeature, [string, string]>> = {
  N: ["Add nitrogen: manure, compost, CAN or urea top-dressing.", "Nitrogen is high: skip extra nitrogen fertiliser."],
  P: ["Add phosphorus: DAP or rock phosphate at planting.", "Phosphorus is high: use a fertiliser with less P."],
  K: ["Add potassium: muriate of potash or wood ash.", "Potassium is high: no potash needed."],
  ph: ["Soil is too acidic: apply agricultural lime.", "Soil is too alkaline: add organic matter or sulphur."],
  rainfall: ["Drier than ideal: plan irrigation or water harvesting.", "Wetter than ideal: ensure good drainage."],
};

export function RecommendForm() {
  const [values, setValues] = useState(start);
  const [result, setResult] = useState<Response | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(v = values) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Prediction failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  }

  function loadExample(crop: string) {
    const v = { ...meta.crop.crop_profiles[crop] };
    setValues(v);
    submit(v);
  }

  const top = result?.recommendations[0];

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <form
        className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="mb-5">
          <p className="text-xs font-medium uppercase tracking-wider text-leaf-900/50">Load a typical field</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXAMPLES.map((c) => (
              <button key={c} type="button" onClick={() => loadExample(c)}
                className="rounded-full border border-leaf-200 px-3 py-1 text-sm text-leaf-800 hover:bg-leaf-50">
                {cropName(c)}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {FEATURES.map((f) => {
            const info = FEATURE_INFO[f];
            const r = meta.crop.ranges[f];
            return (
              <label key={f} className="block">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-leaf-900">{info.label}</span>
                  <span className="flex items-center gap-1 text-sm">
                    <input
                      type="number"
                      step={info.step}
                      value={values[f]}
                      onChange={(e) => setValues({ ...values, [f]: Number(e.target.value) })}
                      className="w-20 rounded-md border border-leaf-200 px-2 py-0.5 text-right tabular-nums"
                    />
                    <span className="w-10 text-leaf-900/50">{info.unit}</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={Math.floor(r.min)}
                  max={Math.ceil(r.max)}
                  step={info.step}
                  value={values[f]}
                  onChange={(e) => setValues({ ...values, [f]: Number(e.target.value) })}
                  className="mt-1 w-full"
                />
                <p className="text-xs text-leaf-900/50">{info.hint}</p>
              </label>
            );
          })}
        </div>
        <button type="submit" disabled={loading}
          className="mt-6 w-full rounded-full bg-leaf-700 py-3 font-medium text-white hover:bg-leaf-800 disabled:opacity-60">
          {loading ? "Analysing…" : "Recommend crops"}
        </button>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      </form>

      <section className="space-y-5">
        {!result && (
          <div className="flex h-full min-h-64 items-center justify-center rounded-3xl border-2 border-dashed border-leaf-200 p-8 text-center text-leaf-900/50">
            Your recommendations will appear here.
          </div>
        )}
        {result && top && (
          <>
            <div className="rounded-3xl bg-leaf-800 p-6 text-white shadow-sm">
              <p className="text-sm text-leaf-200">Best match</p>
              <h2 className="mt-1 text-4xl font-semibold">
                {top.name}
                {top.swahili && <span className="ml-3 text-xl font-normal text-leaf-200">{top.swahili}</span>}
              </h2>
              <p className="mt-2 text-leaf-100">{(top.probability * 100).toFixed(1)}% of the forest&apos;s trees vote for this crop</p>
              {result.recommendations.slice(1).every((r) => r.probability < 0.01) && (
                <p className="mt-4 text-sm text-leaf-200">No other crop comes close for these conditions.</p>
              )}
              <div className="mt-5 grid grid-cols-2 gap-3">
                {result.recommendations.slice(1).filter((r) => r.probability >= 0.01).map((r, i) => (
                  <div key={r.crop} className="rounded-2xl bg-white/10 p-3">
                    <p className="text-xs text-leaf-200">Option {i + 2}</p>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-sm text-leaf-100">{(r.probability * 100).toFixed(1)}%</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-leaf-200/80">Answered in {result.model.inference_ms} ms by the ONNX model</p>
            </div>

            {result.warnings.length > 0 && (
              <div className="rounded-2xl border border-sun-400 bg-sun-400/10 p-4 text-sm text-soil-700">
                {result.warnings.map((w) => <p key={w}>{w}</p>)}
              </div>
            )}

            <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-leaf-900">Your field vs typical {top.name.toLowerCase()} conditions</h3>
              <table className="mt-3 w-full text-sm">
                <thead className="text-left text-xs text-leaf-900/50">
                  <tr><th className="py-1">Factor</th><th>Yours</th><th>Typical range</th><th></th></tr>
                </thead>
                <tbody>
                  {FEATURES.map((f) => {
                    const [lo, hi] = top.typical_range[f];
                    const v = values[f];
                    const status = v < lo ? "low" : v > hi ? "high" : "ok";
                    return (
                      <tr key={f} className="border-t border-leaf-50">
                        <td className="py-1.5">{FEATURE_INFO[f].label}</td>
                        <td className="tabular-nums">{v}</td>
                        <td className="tabular-nums text-leaf-900/60">{lo}–{hi}</td>
                        <td>
                          <span className={`rounded-full px-2 py-0.5 text-xs ${
                            status === "ok" ? "bg-leaf-100 text-leaf-800" : "bg-soil-100 text-soil-700"}`}>
                            {status === "ok" ? "Good" : status === "low" ? "Low" : "High"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {(() => {
                const tips = FEATURES.flatMap((f) => {
                  const [lo, hi] = top.typical_range[f];
                  const a = ADVICE[f];
                  if (!a) return [];
                  return values[f] < lo ? [a[0]] : values[f] > hi ? [a[1]] : [];
                });
                return tips.length > 0 ? (
                  <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-leaf-900/75">
                    {tips.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-leaf-700">Your soil and climate are within the usual range for this crop.</p>
                );
              })()}
            </div>

            <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-semibold text-leaf-900">Model confidence across crops</h3>
              <Bars
                items={result.all.filter((r) => r.probability >= 0.01).slice(0, 8).map((r) => ({ label: cropName(r.crop), value: r.probability }))}
                max={1}
                format={(v) => `${(v * 100).toFixed(0)}%`}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
