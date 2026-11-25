import Link from "next/link";
import { meta } from "@/lib/meta";

const stats = [
  { value: `${(meta.crop.metrics.test_accuracy * 100).toFixed(1)}%`, label: "of test fields matched to the right crop" },
  { value: `±${meta.yield.metrics.MAE.toFixed(1)} t/ha`, label: "typical margin on harvest forecasts" },
  { value: `${meta.crop.classes.length}`, label: "crops covered, from maize to coffee" },
  { value: "24 yrs", label: "of harvest records from 101 countries" },
];

const steps = [
  { title: "Tell us about your shamba", text: "Enter your soil test results and local climate, or choose your country and crop." },
  { title: "We analyse it instantly", text: "Our models compare your field with thousands of real fields and harvests." },
  { title: "Plan with confidence", text: "Get the best crops for your land, what to fix in your soil, and the harvest to expect." },
];

const audiences = [
  { title: "Farmers", text: "Decide what to plant before buying seed, and know roughly how many bags to expect." },
  { title: "Extension officers", text: "Give quick, consistent advice in the field from a soil test and a phone." },
  { title: "Agri-lenders and co-ops", text: "Estimate expected harvests when planning input loans and collections." },
];

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="grid items-center gap-10 pt-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="mb-4 inline-block rounded-full bg-leaf-100 px-3 py-1 text-xs font-medium text-leaf-800">
            Smart planning for Kenyan agriculture
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-leaf-900 md:text-5xl">
            Plant the right crop.
            <br />
            <span className="text-leaf-600">Know your harvest.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-leaf-900/75">
            ShambaSmart reads your soil test and local climate to recommend the crops most likely to thrive, and
            forecasts the harvest you can expect, in kilograms and bags per acre.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/crop-advisor" className="rounded-full bg-leaf-700 px-5 py-3 font-medium text-white shadow-sm hover:bg-leaf-800">
              Find the right crop
            </Link>
            <Link href="/yield-forecast" className="rounded-full border border-leaf-700 px-5 py-3 font-medium text-leaf-800 hover:bg-leaf-50">
              Forecast my harvest
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
        <Link href="/crop-advisor" className="group rounded-3xl bg-leaf-800 p-7 text-white shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wider text-sun-400">Crop Advisor</p>
          <h2 className="mt-2 text-2xl font-semibold">What should I plant?</h2>
          <p className="mt-3 text-leaf-100/85">
            Enter soil nutrients, pH, temperature, humidity and rainfall. Get the crops that best suit your field, how
            your soil compares with what each crop needs, and what to fix.
          </p>
          <span className="mt-5 inline-block text-sun-400 group-hover:underline">Open Crop Advisor →</span>
        </Link>
        <Link href="/yield-forecast" className="group rounded-3xl bg-soil-100 p-7 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wider text-soil-700">Yield Forecast</p>
          <h2 className="mt-2 text-2xl font-semibold text-leaf-900">How much will I harvest?</h2>
          <p className="mt-3 text-leaf-900/75">
            Choose your country and crop to see the expected harvest per hectare, per acre and in 90 kg bags, test
            different conditions, and compare crops side by side.
          </p>
          <span className="mt-5 inline-block text-soil-700 group-hover:underline">Open Yield Forecast →</span>
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

      <section>
        <h2 className="text-2xl font-semibold text-leaf-900">Who it is for</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {audiences.map((a) => (
            <div key={a.title} className="rounded-2xl bg-leaf-50 p-5">
              <h3 className="font-semibold text-leaf-900">{a.title}</h3>
              <p className="mt-1 text-sm text-leaf-900/70">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-leaf-900 px-8 py-10 text-white">
        <div>
          <h2 className="text-2xl font-semibold">Have a soil test result?</h2>
          <p className="mt-1 text-leaf-100/80">Get a crop recommendation in seconds. No sign-up needed.</p>
        </div>
        <Link href="/crop-advisor" className="rounded-full bg-sun-400 px-6 py-3 font-medium text-leaf-900 hover:brightness-95">
          Try the Crop Advisor
        </Link>
      </section>
    </div>
  );
}
