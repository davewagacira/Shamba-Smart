import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Get started",
  description: "Choose whether to find the right crop for your field or forecast your harvest.",
};

const CHOICES = [
  {
    href: "/crop-advisor",
    tag: "Crop Advisor",
    title: "I want to know what to plant",
    text: "Get the crops that best suit your soil and climate, and what to fix in your soil.",
    needs: ["Soil test: N, P, K and pH", "Local temperature, humidity and rainfall"],
    time: "About 1 minute",
    style: "bg-leaf-800 text-white hover:bg-leaf-900",
    tagStyle: "text-sun-400",
    muted: "text-leaf-100/80",
    cta: "text-sun-400",
  },
  {
    href: "/yield-forecast",
    tag: "Yield Forecast",
    title: "I want to know how much I'll harvest",
    text: "See the expected harvest per hectare, per acre and in 90 kg bags, and compare crops.",
    needs: ["Your country and crop", "Nothing else: we fill in local conditions"],
    time: "Instant",
    style: "bg-soil-100 text-leaf-900 hover:bg-soil-300/40",
    tagStyle: "text-soil-700",
    muted: "text-leaf-900/65",
    cta: "text-soil-700",
  },
];

export default function StartPage() {
  return (
    <div className="mx-auto max-w-4xl py-4">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-leaf-600">Get started</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-leaf-900 sm:text-4xl">What would you like to do?</h1>
        <p className="mx-auto mt-3 max-w-xl text-leaf-900/70">Choose where to begin. You can switch between the two at any time.</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {CHOICES.map((c) => (
          <Link key={c.href} href={c.href} className={`group flex flex-col rounded-3xl p-7 shadow-sm transition ${c.style}`}>
            <p className={`text-sm font-medium uppercase tracking-wider ${c.tagStyle}`}>{c.tag}</p>
            <h2 className="mt-2 text-2xl font-semibold">{c.title}</h2>
            <p className={`mt-3 ${c.muted}`}>{c.text}</p>
            <div className="mt-5">
              <p className={`text-xs font-medium uppercase tracking-wider ${c.muted}`}>You will need</p>
              <ul className="mt-2 space-y-1 text-sm">
                {c.needs.map((n) => (
                  <li key={n} className="flex gap-2"><span aria-hidden>✓</span>{n}</li>
                ))}
              </ul>
            </div>
            <div className="mt-auto flex items-center justify-between pt-6">
              <span className={`text-sm ${c.muted}`}>{c.time}</span>
              <span className={`font-medium group-hover:underline ${c.cta}`}>Continue →</span>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-leaf-900/60">
        Not sure? <Link href="/how-it-works" className="text-leaf-700 underline">See how ShambaSmart works</Link>.
      </p>
    </div>
  );
}
