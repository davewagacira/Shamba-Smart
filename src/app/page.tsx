import Link from "next/link";
import { meta } from "@/lib/meta";

const stats = [
  { value: `${(meta.crop.metrics.test_accuracy * 100).toFixed(1)}%`, label: "crop recommendation accuracy on unseen fields" },
  { value: meta.yield.metrics.deployed["Test R2"].toFixed(2), label: "R² for yield on unseen years (2009–2013)" },
  { value: `${meta.crop.classes.length}`, label: "crops the recommender knows" },
  { value: `${meta.yield.countries.length}`, label: "countries in the yield model, Kenya included" },
];

const steps = [
  { title: "Describe your shamba", text: "Soil test results (N, P, K, pH) and your local climate, or your country, crop and season." },
  { title: "Models run instantly", text: "Two Random Forest models, trained in Python and exported to ONNX, run on our Node.js server." },
  { title: "Act on the answer", text: "See the best crops with confidence scores, how your soil compares, and the harvest to expect." },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 pt-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="mb-3 inline-block rounded-full bg-leaf-100 px-3 py-1 text-xs font-medium text-leaf-800">
            Machine learning for smallholder farmers
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-leaf-900 md:text-5xl">
            Plant the right crop.
            <br />
            <span className="text-leaf-600">Know your harvest.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-leaf-900/75">
            Most Kenyan farmers choose crops by habit, not by their soil and climate. ShambaSmart uses machine learning
            to recommend the crops that suit a field and to predict how many tonnes per hectare it should give.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/recommend" className="rounded-full bg-leaf-700 px-5 py-3 font-medium text-white shadow-sm hover:bg-leaf-800">
              What should I plant?
            </Link>
            <Link href="/yield" className="rounded-full border border-leaf-700 px-5 py-3 font-medium text-leaf-800 hover:bg-leaf-50">
              How much will I harvest?
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-sm">
              <div className="text-3xl font-semibold text-leaf-700">{s.value}</div>
              <div className="mt-1 text-sm text-leaf-900/65">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <Link href="/recommend" className="group rounded-3xl bg-leaf-800 p-7 text-white shadow-sm">
          <p className="text-sm uppercase tracking-wider text-leaf-200">Classification</p>
          <h2 className="mt-2 text-2xl font-semibold">Crop recommendation</h2>
          <p className="mt-3 text-leaf-100/85">
            Enter soil nutrients, pH, temperature, humidity and rainfall. The model ranks 22 crops and explains how your
            field compares with where each crop grows best.
          </p>
          <span className="mt-5 inline-block text-sun-400 group-hover:underline">Try it →</span>
        </Link>
        <Link href="/yield" className="group rounded-3xl bg-soil-100 p-7 shadow-sm">
          <p className="text-sm uppercase tracking-wider text-soil-700">Regression</p>
          <h2 className="mt-2 text-2xl font-semibold text-leaf-900">Yield prediction</h2>
          <p className="mt-3 text-leaf-900/75">
            Choose a country and crop, then move the rainfall, temperature and pesticide sliders to see the predicted
            harvest change in real time, in t/ha, kg per acre and 90 kg bags.
          </p>
          <span className="mt-5 inline-block text-soil-700 group-hover:underline">Try it →</span>
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-leaf-900">How it works</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-leaf-100 bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sun-400 font-semibold text-leaf-900">{i + 1}</span>
              <h3 className="mt-3 font-semibold text-leaf-900">{s.title}</h3>
              <p className="mt-1 text-sm text-leaf-900/70">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
