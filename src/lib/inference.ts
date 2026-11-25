import "server-only";
import path from "node:path";
import * as ort from "onnxruntime-node";
import { meta, type CropFeature } from "@/lib/meta";

const sessions = new Map<string, Promise<ort.InferenceSession>>();

// load each model once per server instance
function session(file: string) {
  if (!sessions.has(file)) {
    sessions.set(file, ort.InferenceSession.create(path.join(process.cwd(), "models", file)));
  }
  return sessions.get(file)!;
}

export type CropInput = Record<CropFeature, number>;

// probability for every crop, highest first
export async function recommendCrops(input: CropInput) {
  const s = await session("crop_model.onnx");
  const x = Float32Array.from(meta.crop.features.map((f) => input[f]));
  const out = await s.run({ X: new ort.Tensor("float32", x, [1, x.length]) });
  const probs = out.probabilities.data as Float32Array;
  return meta.crop.classes
    .map((crop, i) => ({ crop, probability: probs[i] }))
    .sort((a, b) => b.probability - a.probability);
}

export type YieldInput = {
  country: string;
  crop: string;
  year: number;
  rainfall: number;
  pesticides: number;
  temperature: number;
};

// yield in t/ha for a batch of scenarios
export async function predictYield(rows: YieldInput[]) {
  const s = await session("yield_model.onnx");
  const n = rows.length;
  const str = (v: string[]) => new ort.Tensor("string", v, [n, 1]);
  const num = (v: number[]) => new ort.Tensor("float32", Float32Array.from(v), [n, 1]);
  const out = await s.run({
    Area: str(rows.map((r) => r.country)),
    Item: str(rows.map((r) => r.crop)),
    Year: num(rows.map((r) => r.year)),
    average_rain_fall_mm_per_year: num(rows.map((r) => r.rainfall)),
    pesticides_tonnes: num(rows.map((r) => r.pesticides)),
    avg_temp: num(rows.map((r) => r.temperature)),
  });
  return Array.from(out.variable.data as Float32Array).map((v) => Math.max(0, v));
}
