import Link from "next/link";
import { Logo } from "@/components/Logo";

const COLUMNS = [
  { title: "Product", links: [["Get started", "/start"], ["Crop Advisor", "/crop-advisor"], ["Yield Forecast", "/yield-forecast"], ["How it works", "/how-it-works"]] },
  { title: "Resources", links: [["Developer API", "/developers"], ["About us", "/about"]] },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-leaf-100 bg-white/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold text-leaf-800">
            <Logo className="h-7 w-7" /> ShambaSmart
          </Link>
          <p className="mt-3 max-w-sm text-sm text-leaf-900/60">
            Data-driven crop and harvest planning for Kenyan farmers, agronomists and extension officers.
          </p>
        </div>
        {COLUMNS.map((c) => (
          <div key={c.title}>
            <p className="text-sm font-semibold text-leaf-900">{c.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {c.links.map(([label, href]) => (
                <li key={href}><Link href={href} className="text-leaf-900/60 hover:text-leaf-800">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-leaf-100">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-4 text-xs text-leaf-900/50">
          <span>© 2026 ShambaSmart. Recommendations are guidance and do not replace advice from a local agronomist.</span>
          <span>Data: FAO and World Bank via Kaggle · Photos: Unsplash</span>
        </div>
      </div>
    </footer>
  );
}
