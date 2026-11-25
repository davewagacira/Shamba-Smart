import { recommendCrops } from "@/lib/inference";
import { cropName, meta } from "@/lib/meta";
import { parseCropInput } from "@/lib/validate";

// POST { N, P, K, temperature, humidity, ph, rainfall } -> ranked crops
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = parseCropInput(body);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const started = performance.now();
  const ranked = await recommendCrops(parsed.value);
  const ms = performance.now() - started;

  return Response.json({
    input: parsed.value,
    recommendations: ranked.slice(0, 3).map((r) => ({
      crop: r.crop,
      name: cropName(r.crop),
      probability: Number(r.probability.toFixed(4)),
      typical: meta.crop.crop_profiles[r.crop],
      typical_range: meta.crop.crop_iqr[r.crop],
    })),
    all: ranked.map((r) => ({ crop: r.crop, probability: Number(r.probability.toFixed(4)) })),
    warnings: parsed.warnings,
    model: { name: "Random Forest classifier (ONNX)", test_accuracy: meta.crop.metrics.test_accuracy, inference_ms: Number(ms.toFixed(1)) },
  });
}
