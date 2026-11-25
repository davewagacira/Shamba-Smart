import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer API",
  description: "Integrate ShambaSmart crop recommendations and yield forecasts into your own app.",
};

const BASE = "https://shambasmart-codeverseafrica.vercel.app";

const endpoints = [
  {
    method: "POST",
    path: "/api/recommend",
    title: "Crop recommendation",
    text: "Ranks 22 crops for a field and returns the top three with confidence and ideal ranges.",
    fields: [
      ["N, P, K", "number", "Soil nitrogen, phosphorus and potassium (kg/ha)"],
      ["temperature", "number", "Average temperature (°C)"],
      ["humidity", "number", "Relative humidity (%)"],
      ["ph", "number", "Soil pH"],
      ["rainfall", "number", "Rainfall in the growing season (mm)"],
    ],
    request: `curl -X POST ${BASE}/api/recommend \\
  -H "Content-Type: application/json" \\
  -d '{"N":76,"P":48,"K":20,"temperature":22.8,"humidity":65,"ph":6.3,"rainfall":84}'`,
    response: `{
  "recommendations": [
    { "crop": "maize", "name": "Maize", "swahili": "Mahindi", "probability": 1,
      "typical_range": { "N": [67.8, 87], "ph": [5.9, 6.6], ... } },
    ...
  ],
  "all": [ { "crop": "maize", "probability": 1 }, ... ],
  "warnings": []
}`,
  },
  {
    method: "POST",
    path: "/api/yield",
    title: "Yield forecast",
    text: "Forecasts the harvest for one scenario, or up to 60 scenarios at once with { \"rows\": [...] }.",
    fields: [
      ["country", "string", "One of 101 supported countries, e.g. \"Kenya\""],
      ["crop", "string", "Cassava, Maize, Plantains and others, Potatoes, Rice, paddy, Sorghum, Soybeans, Sweet potatoes, Wheat or Yams"],
      ["year", "number", "1990–2035 (years after 2013 are forecast like 2013)"],
      ["rainfall", "number", "Country's long-term average rainfall (mm/yr)"],
      ["pesticides", "number", "National pesticide use (tonnes)"],
      ["temperature", "number", "Average temperature (°C)"],
    ],
    request: `curl -X POST ${BASE}/api/yield \\
  -H "Content-Type: application/json" \\
  -d '{"country":"Kenya","crop":"Maize","year":2013,"rainfall":630,"pesticides":1578,"temperature":16.9}'`,
    response: `{
  "country": "Kenya", "crop": "Maize", "year": 2013,
  "yield_t_ha": 1.71, "yield_kg_acre": 692, "bags_90kg_acre": 7.7,
  "warnings": []
}`,
  },
];

const Code = ({ children }: { children: string }) => (
  <pre className="overflow-x-auto rounded-xl bg-leaf-900 p-4 text-xs leading-relaxed text-leaf-50">{children}</pre>
);

export default function DevelopersPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-leaf-600">Developers</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-leaf-900">ShambaSmart API</h1>
        <p className="mt-2 max-w-2xl text-leaf-900/70">
          Bring crop recommendations and harvest forecasts into your own app, USSD service or farm-management tool.
          The API accepts and returns JSON, needs no key, and responds in milliseconds.
        </p>
      </div>

      {endpoints.map((e) => (
        <section key={e.path} className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-leaf-700 px-2 py-0.5 font-mono text-xs font-semibold text-white">{e.method}</span>
            <code className="font-mono text-sm text-leaf-900">{e.path}</code>
            <span className="text-sm text-leaf-900/60">· {e.title}</span>
          </div>
          <p className="mt-3 text-sm text-leaf-900/75">{e.text}</p>
          <table className="mt-4 w-full text-sm">
            <thead className="text-left text-xs text-leaf-900/50">
              <tr><th className="py-1 pr-4">Field</th><th className="pr-4">Type</th><th>Description</th></tr>
            </thead>
            <tbody>
              {e.fields.map(([f, t, d]) => (
                <tr key={f} className="border-t border-leaf-50 align-top">
                  <td className="py-1.5 pr-4 font-mono text-xs text-leaf-900">{f}</td>
                  <td className="pr-4 text-leaf-900/60">{t}</td>
                  <td className="text-leaf-900/80">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div><p className="mb-2 text-xs font-medium uppercase tracking-wider text-leaf-900/50">Request</p><Code>{e.request}</Code></div>
            <div><p className="mb-2 text-xs font-medium uppercase tracking-wider text-leaf-900/50">Response</p><Code>{e.response}</Code></div>
          </div>
        </section>
      ))}

      <section className="rounded-3xl bg-leaf-50 p-6 text-sm text-leaf-900/80">
        <h2 className="mb-2 font-semibold text-leaf-900">Errors and warnings</h2>
        <p>
          Invalid input returns HTTP 400 with an <code className="font-mono">error</code> message, for example an unknown
          country or a pH above 14. Values outside the range the models were trained on are still answered, with an
          explanation in <code className="font-mono">warnings</code>.
        </p>
      </section>
    </div>
  );
}
