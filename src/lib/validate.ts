import { meta, type CropFeature } from "@/lib/meta";
import type { CropInput, YieldInput } from "@/lib/inference";

// physically sensible limits; values outside the training range only raise a warning
const CROP_LIMITS: Record<CropFeature, [number, number]> = {
  N: [0, 300],
  P: [0, 300],
  K: [0, 400],
  temperature: [-5, 55],
  humidity: [0, 100],
  ph: [0, 14],
  rainfall: [0, 1000],
};

type Result<T> = { ok: true; value: T; warnings: string[] } | { ok: false; error: string };

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export function parseCropInput(body: unknown): Result<CropInput> {
  if (!body || typeof body !== "object") return { ok: false, error: "Send a JSON object with N, P, K, temperature, humidity, ph and rainfall." };
  const b = body as Record<string, unknown>;
  const value = {} as CropInput;
  const warnings: string[] = [];
  for (const f of meta.crop.features) {
    const v = b[f];
    if (!isNum(v)) return { ok: false, error: `"${f}" must be a number.` };
    const [lo, hi] = CROP_LIMITS[f];
    if (v < lo || v > hi) return { ok: false, error: `"${f}" must be between ${lo} and ${hi}.` };
    const r = meta.crop.ranges[f];
    if (v < r.min || v > r.max) warnings.push(`${f} = ${v} is outside the training data (${r.min.toFixed(1)}–${r.max.toFixed(1)}), so treat the result with care.`);
    value[f] = v;
  }
  return { ok: true, value, warnings };
}

export function parseYieldRow(body: unknown): Result<YieldInput> {
  if (!body || typeof body !== "object") return { ok: false, error: "Each row must be a JSON object." };
  const b = body as Record<string, unknown>;
  const warnings: string[] = [];
  if (typeof b.country !== "string" || !meta.yield.countries.includes(b.country))
    return { ok: false, error: `"country" must be one of the ${meta.yield.countries.length} supported countries.` };
  if (typeof b.crop !== "string" || !meta.yield.crops.includes(b.crop))
    return { ok: false, error: `"crop" must be one of: ${meta.yield.crops.join(", ")}.` };
  const limits = { year: [1990, 2035], rainfall: [0, 5000], pesticides: [0, 500000], temperature: [-10, 40] } as const;
  for (const k of Object.keys(limits) as (keyof typeof limits)[]) {
    const v = b[k];
    if (!isNum(v)) return { ok: false, error: `"${k}" must be a number.` };
    if (v < limits[k][0] || v > limits[k][1]) return { ok: false, error: `"${k}" must be between ${limits[k][0]} and ${limits[k][1]}.` };
  }
  const usual = meta.yield.country_defaults[b.country].rainfall;
  if (b.rainfall !== usual)
    warnings.push(`Rainfall in the training data is one fixed long-term average per country (${b.country}: ${usual} mm), so other values make the model treat ${b.country} like a different country.`);
  if ((b.year as number) > meta.yield.year_range[1])
    warnings.push(`The data ends in ${meta.yield.year_range[1]}; later years are predicted like ${meta.yield.year_range[1]}.`);
  return {
    ok: true,
    value: {
      country: b.country,
      crop: b.crop,
      year: b.year as number,
      rainfall: b.rainfall as number,
      pesticides: b.pesticides as number,
      temperature: b.temperature as number,
    },
    warnings,
  };
}
