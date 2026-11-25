import { predictYield, type YieldInput } from "@/lib/inference";
import { ACRES_PER_HA, BAG_CROPS, meta } from "@/lib/meta";
import { parseYieldRow } from "@/lib/validate";

const MAX_ROWS = 60;

// POST one scenario, or { rows: [...] } for up to 60 scenarios
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const batch = body && typeof body === "object" && Array.isArray((body as { rows?: unknown }).rows);
  const raw: unknown[] = batch ? (body as { rows: unknown[] }).rows : [body];
  if (raw.length === 0 || raw.length > MAX_ROWS)
    return Response.json({ error: `Send between 1 and ${MAX_ROWS} rows.` }, { status: 400 });

  const rows: YieldInput[] = [];
  const warnings = new Set<string>();
  for (const [i, r] of raw.entries()) {
    const parsed = parseYieldRow(r);
    if (!parsed.ok) return Response.json({ error: batch ? `Row ${i}: ${parsed.error}` : parsed.error }, { status: 400 });
    rows.push(parsed.value);
    parsed.warnings.forEach((w) => warnings.add(w));
  }

  const started = performance.now();
  const preds = await predictYield(rows);
  const ms = performance.now() - started;

  const predictions = rows.map((r, i) => {
    const tPerHa = preds[i];
    const kgPerAcre = (tPerHa * 1000) / ACRES_PER_HA;
    return {
      ...r,
      yield_t_ha: Number(tPerHa.toFixed(3)),
      yield_kg_acre: Math.round(kgPerAcre),
      bags_90kg_acre: BAG_CROPS.has(r.crop) ? Number((kgPerAcre / 90).toFixed(1)) : null,
    };
  });

  return Response.json({
    ...(batch ? { predictions } : predictions[0]),
    warnings: [...warnings],
    model: { name: "Random Forest regressor (ONNX)", test_r2: meta.yield.metrics.deployed["Test R2"], typical_error_t_ha: meta.yield.metrics.MAE, inference_ms: Number(ms.toFixed(1)) },
  });
}
