"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

const LINKS = [
  { href: "/crop-advisor", label: "Crop Advisor" },
  { href: "/yield-forecast", label: "Yield Forecast" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/developers", label: "Developers" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-20 border-b border-leaf-100 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-leaf-800">
          <Logo />
          <span className="text-lg tracking-tight">ShambaSmart</span>
        </Link>
        <div className="ml-auto flex flex-wrap items-center gap-1 text-sm">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-1.5 transition ${
                path === l.href ? "bg-leaf-100 font-medium text-leaf-900" : "text-leaf-900/80 hover:bg-leaf-50 hover:text-leaf-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/crop-advisor" className="ml-2 hidden rounded-full bg-leaf-700 px-4 py-1.5 font-medium text-white hover:bg-leaf-800 sm:inline-block">
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
