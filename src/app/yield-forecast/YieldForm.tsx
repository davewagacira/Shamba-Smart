"use client";

import { useEffect, useState } from "react";
import { Bars } from "@/components/Bars";
import { LineChart } from "@/components/LineChart";
import { meta } from "@/lib/meta";

type Scenario = { country: string; crop: string; year: number; rainfall: number; pesticides: number; temperature: number };
type Prediction = Scenario & { yield_t_ha: number; yield_kg_acre: number; bags_90kg_acre: number | null };

const Y = meta.yield;
const LAST_YEAR = Y.year_range[1];
const defaultsFor = (country: string) => Y.country_defaults[country];
// keep what-ifs near what each country actually recorded
const tempRange = (c: string) => [Math.floor(Y.country_ranges[c].temperature[0] - 1), Math.ceil(Y.country_ranges[c].temperature[1] + 1)];
const pestRange = (c: string) => [Math.log10(Math.max(1, Y.country_ranges[c].pesticides[0] / 2)), Math.log10(Y.country_ranges[c].pesticides[1] * 2)];

async function callYield(body: unknown) {
  const res = await fetch("/api/yield", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Prediction failed");
  return data;
}

export function YieldForm() {
  const [s, setS] = useState<Scenario>({ country: "Kenya", crop: "Maize", year: LAST_YEAR, ...defaultsFor("Kenya") });
  const [pred, setPred] = useState<Prediction | null>(null);
  const [byCrop, setByCrop] = useState<{ label: string; value: number }[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // debounce so sliding does not flood the API
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const [one, all] = await Promise.all([
          callYield(s),
          callYield({ rows: Y.crops.map((crop) => ({ ...s, crop })) }),
        ]);
        setPred(one);
        setWarnings(one.warnings);
        setByCrop(
          all.predictions
            .map((p: Prediction) => ({ label: p.crop, value: p.yield_t_ha }))
            .sort((a: { value: number }, b: { value: number }) => b.value - a.value),
        );
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Prediction failed");
      }
    }, 180);
    return () => clearTimeout(t);
  }, [s]);

  const set = (patch: Partial<Scenario>) => setS((prev) => ({ ...prev, ...patch }));
  const history = s.country === "Kenya" ? Y.kenya_history[s.crop] : undefined;
  const hasKenyaCrop = (crop: string) => Boolean(Y.kenya_history[crop]);

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-5 rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-medium text-leaf-900">
            Country
            <select value={s.country} onChange={(e) => set({ country: e.target.value, ...defaultsFor(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-leaf-200 bg-white px-2 py-2 font-normal">
              {Y.countries.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-leaf-900">
            Crop
            <select value={s.crop} onChange={(e) => set({ crop: e.target.value })}
              className="mt-1 w-full rounded-lg border border-leaf-200 bg-white px-2 py-2 font-normal">
              {Y.crops.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <Slider label="Year" value={s.year} min={Y.year_range[0]} max={2030} step={1} display={`${s.year}`}
          onChange={(year) => set({ year })} />
        <div className="flex justify-between rounded-xl bg-leaf-50 px-3 py-2 text-sm">
          <span className="text-leaf-900">Long-term average rainfall</span>
          <span className="tabular-nums text-leaf-900/70">{s.rainfall.toLocaleString()} mm/yr</span>
        </div>
        <Slider label="Average temperature" value={s.temperature} min={tempRange(s.country)[0]} max={tempRange(s.country)[1]}
          step={0.1} display={`${s.temperature.toFixed(1)} °C`} onChange={(temperature) => set({ temperature })} />
        <Slider label="Pesticide use (national)" value={Math.log10(Math.max(1, s.pesticides))} min={pestRange(s.country)[0]} max={pestRange(s.country)[1]} step={0.01}
          display={`${Math.round(s.pesticides).toLocaleString()} tonnes`}
          onChange={(v) => set({ pesticides: Math.round(10 ** v) })} />
        <button type="button" onClick={() => set({ year: LAST_YEAR, ...defaultsFor(s.country) })}
          className="text-sm text-leaf-700 underline-offset-2 hover:underline">
          Reset to {s.country}&apos;s {LAST_YEAR} values
        </button>
        <p className="text-xs text-leaf-900/50">
          Conditions are national averages. Rainfall is the country&apos;s long-term average, and the other settings stay
          within the range the country has recorded, so forecasts remain realistic.
        </p>
      </div>

      <section className="space-y-5">
        <div className="rounded-3xl bg-soil-100 p-6 shadow-sm">
          <p className="text-sm text-soil-700">Expected {s.crop.toLowerCase()} harvest in {s.country}, {s.year}</p>
          {pred ? (
            <>
              <p className="mt-1 text-5xl font-semibold text-leaf-900 tabular-nums">
                {pred.yield_t_ha.toFixed(2)} <span className="text-2xl font-normal">t/ha</span>
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/70 p-3">
                  <p className="text-leaf-900/60">Per acre</p>
                  <p className="text-xl font-semibold text-leaf-900 tabular-nums">{pred.yield_kg_acre.toLocaleString()} kg</p>
                </div>
                {pred.bags_90kg_acre !== null && (
                  <div className="rounded-2xl bg-white/70 p-3">
                    <p className="text-leaf-900/60">90 kg bags per acre</p>
                    <p className="text-xl font-semibold text-leaf-900 tabular-nums">{pred.bags_90kg_acre}</p>
                  </div>
                )}
              </div>
              <p className="mt-3 text-xs text-soil-700/80">
                Forecasts are usually within ±{Y.metrics.MAE.toFixed(1)} t/ha of the recorded harvest.
              </p>
            </>
          ) : (
            <p className="mt-2 text-leaf-900/50">Preparing your forecast…</p>
          )}
          {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
          {warnings.map((w) => <p key={w} className="mt-2 text-xs text-soil-700">{w}</p>)}
        </div>

        <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-leaf-900">Compare crops in {s.country}</h3>
          <p className="mb-4 text-sm text-leaf-900/60">
            Expected tonnes per hectare for each crop under the same conditions. Roots and tubers are weighed fresh, so they weigh more than grains.
          </p>
          <Bars items={byCrop} format={(v) => v.toFixed(1)} color="bg-leaf-500" />
        </div>

        {s.country === "Kenya" && (
          <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-leaf-900">Kenya&apos;s {s.crop.toLowerCase()} harvests, 1990–2013</h3>
            {history ? (
              <LineChart
                series={[{ name: "Recorded harvest", color: "#a8743f", points: history }]}
                marker={pred && s.year <= LAST_YEAR ? { x: s.year, y: pred.yield_t_ha } : undefined}
                xLabel="Year"
                yLabel="Yield (t/ha)"
              />
            ) : (
              <p className="mt-2 text-sm text-leaf-900/60">
                No Kenyan records for this crop. Try {Y.crops.filter(hasKenyaCrop).slice(0, 3).join(", ")}.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Slider({ label, value, min, max, step, display, onChange }: {
  label: string; value: number; min: number; max: number; step: number; display: string; onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-leaf-900">{label}</span>
        <span className="tabular-nums text-leaf-900/70">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full" />
    </label>
  );
}
