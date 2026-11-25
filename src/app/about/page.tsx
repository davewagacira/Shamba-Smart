import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Why we built ShambaSmart and the team behind it.",
};

const team = ["Hashim Njoroge", "Veronicah Wanjiru", "Dit Deng", "David Wagacira", "Yna Njoki"];

const values = [
  { title: "Grounded in data", text: "Every recommendation comes from real field measurements and national harvest records, not rules of thumb." },
  { title: "Clear, local language", text: "Results come in kilograms and 90 kg bags per acre, with practical next steps for your soil." },
  { title: "Honest about limits", text: "We show how confident each answer is and say plainly what the data cannot tell you." },
];

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-leaf-600">About</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-leaf-900">Helping every shamba make the most of its land</h1>
        <p className="mt-4 text-lg text-leaf-900/75">
          Agriculture is the backbone of Kenya&apos;s economy, yet many smallholder farmers still choose crops by habit
          and plant without knowing what harvest to expect. A poor match between crop, soil and climate wastes seed,
          fertiliser and land, and costs families income.
        </p>
        <p className="mt-3 text-lg text-leaf-900/75">
          ShambaSmart turns a soil test and local conditions into a clear planting decision and a realistic harvest
          forecast, in seconds and at no cost.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-leaf-900">{v.title}</h2>
            <p className="mt-1 text-sm text-leaf-900/70">{v.text}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-leaf-800 p-7 text-white">
          <h2 className="text-xl font-semibold">What&apos;s next</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-leaf-100/90">
            <li>County-level soil and harvest data from Kenyan research institutions</li>
            <li>Seasonal rainfall forecasts in the harvest model</li>
            <li>A full Swahili interface and SMS access for farmers without smartphones</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-leaf-100 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-semibold text-leaf-900">The team</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {team.map((name) => (
              <li key={name} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-100 text-sm font-semibold text-leaf-800">
                  {name.split(" ").map((p) => p[0]).join("")}
                </span>
                <span className="text-leaf-900">{name}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-leaf-900/60">
            Want to learn how the models work? See <Link href="/how-it-works" className="text-leaf-700 underline">How it works</Link>,
            or build on them with our <Link href="/developers" className="text-leaf-700 underline">API</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
