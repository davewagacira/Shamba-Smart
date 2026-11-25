import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

const team = [
  ["Hashim Njoroge", "672183"],
  ["Veronicah Wanjiru", "669927"],
  ["Dit Deng", "673047"],
  ["David Wagacira", "674718"],
  ["Yna Njoki", "672396"],
];

const recommendExample = `curl -X POST https://<your-deployment>/api/recommend \\
  -H "Content-Type: application/json" \\
  -d '{"N":76,"P":48,"K":20,"temperature":22.8,"humidity":65,"ph":6.3,"rainfall":84}'`;

const yieldExample = `curl -X POST https://<your-deployment>/api/yield \\
  -H "Content-Type: application/json" \\
  -d '{"country":"Kenya","crop":"Maize","year":2013,"rainfall":630,"pesticides":1578,"temperature":16.9}'`;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-leaf-900">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-leaf-900/80">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-leaf-900">About ShambaSmart</h1>
        <p className="mt-2 max-w-2xl text-leaf-900/70">
          A machine learning application built for SWE2020C Machine Learning and Big Data (Assignment 4: Machine
          Learning in Real-World Applications), USIU-Africa.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="The problem">
          <p>
            Agriculture employs most rural Kenyans, yet many smallholder farmers choose crops by habit and plan without
            any estimate of the harvest. A poor match between crop, soil and climate wastes seed, fertiliser and land,
            and lowers household income and food security.
          </p>
        </Section>
        <Section title="Our solution">
          <p>
            <b>Crop recommendation</b> (classification): from soil N, P, K, pH, temperature, humidity and rainfall,
            rank 22 crops and explain how the field compares with each crop&apos;s usual conditions.
          </p>
          <p>
            <b>Yield prediction</b> (regression): from country, crop, year, rainfall, temperature and pesticide use,
            predict tonnes per hectare and convert it to kg and 90 kg bags per acre.
          </p>
        </Section>
        <Section title="Data">
          <p>
            <b>Crop Recommendation dataset</b> (Kaggle): 2,200 field samples, 22 crops, 100 each, no missing values.
          </p>
          <p>
            <b>Crop Yield dataset</b> (Kaggle, from FAO and World Bank data): 28,242 rows covering 101 countries and 10
            crops from 1990 to 2013, merged to 13,130 unique country-crop-year records.
          </p>
        </Section>
        <Section title="Architecture">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Python and scikit-learn: cleaning, exploration, model comparison and tuning in a Jupyter notebook.</li>
            <li>Export of the final Random Forests to ONNX, with parity checks against scikit-learn.</li>
            <li>Next.js route handlers (Node.js) load the models with onnxruntime-node and answer in milliseconds.</li>
            <li>React front end with live sliders, charts and plain-language advice, deployed on Vercel.</li>
          </ol>
        </Section>
      </div>

      <Section title="Use the API directly">
        <p>Both endpoints accept JSON and return predictions in real time. The yield endpoint also accepts <code>{`{"rows": [...]}`}</code> for up to 60 scenarios at once.</p>
        <pre className="overflow-x-auto rounded-xl bg-leaf-900 p-4 text-xs text-leaf-50">{recommendExample}</pre>
        <pre className="overflow-x-auto rounded-xl bg-leaf-900 p-4 text-xs text-leaf-50">{yieldExample}</pre>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Limitations">
          <ul className="list-disc space-y-1 pl-5">
            <li>The crop dataset is clean and curated; readings from real farms are noisier, so expect lower accuracy in practice.</li>
            <li>Yield data is national and yearly, so predictions describe a typical yield for a country, not one farm.</li>
            <li>The yield data ends in 2013; a Random Forest cannot extrapolate trends beyond it.</li>
            <li>Rainfall in the yield data is a fixed average per country, so the model cannot capture wet or dry seasons.</li>
            <li>Local data (KALRO soil surveys, county yield records) would make the models more accurate for Kenya.</li>
          </ul>
        </Section>
        <Section title="Group 1">
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {team.map(([name, id]) => (
              <li key={id}>{name} <span className="text-leaf-900/50">· {id}</span></li>
            ))}
          </ul>
          <p className="text-leaf-900/60">Professor: John Kimani</p>
        </Section>
      </div>
    </div>
  );
}
