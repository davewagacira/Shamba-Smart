"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/developers", label: "Developers" },
  { href: "/about", label: "About" },
];

// pages that are already inside the product, where "Get started" makes no sense
const APP_ROUTES = ["/start", "/crop-advisor", "/yield-forecast"];

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const inApp = APP_ROUTES.includes(path);

  return (
    <header className="sticky top-0 z-30 border-b border-leaf-100 bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
        <Link href="/" onClick={close} className="flex items-center gap-2 font-semibold text-leaf-800">
          <Logo />
          <span className="text-lg tracking-tight">ShambaSmart</span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 whitespace-nowrap text-sm md:flex">
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
          {!inApp && (
            <Link href="/start" className="ml-2 rounded-full bg-leaf-700 px-4 py-1.5 font-medium text-white hover:bg-leaf-800">
              Get started
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-leaf-900 hover:bg-leaf-50 md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-leaf-100 bg-cream px-5 pb-5 pt-2 md:hidden">
          <ul className="space-y-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={close}
                  className={`block rounded-xl px-3 py-3 text-base ${
                    path === l.href ? "bg-leaf-100 font-medium text-leaf-900" : "text-leaf-900/85 hover:bg-leaf-50"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          {!inApp && (
            <Link href="/start" onClick={close}
              className="mt-3 block rounded-full bg-leaf-700 py-3 text-center font-medium text-white hover:bg-leaf-800">
              Get started
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
