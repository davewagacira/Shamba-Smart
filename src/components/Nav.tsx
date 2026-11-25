"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  // hidden from the header for presentations; the page still exists at /developers
  // { href: "/developers", label: "Developers" },
  { href: "/about", label: "About" },
];

// pages that are already inside the product, where "Get started" makes no sense
const APP_ROUTES = ["/start", "/crop-advisor", "/yield-forecast"];

// true once the photo hero (id="hero") has scrolled up under the header
function usePastHero(enabled: boolean) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const check = () => {
      const hero = document.getElementById("hero");
      setPast(hero ? hero.getBoundingClientRect().bottom <= 72 : true);
    };
    const frame = requestAnimationFrame(check);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [enabled]);
  return enabled ? past : true;
}

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const inApp = APP_ROUTES.includes(path);
  const isHome = path === "/";
  const pastHero = usePastHero(isHome);
  const clear = isHome && !pastHero && !open;

  return (
    <header
      className={`${isHome ? "fixed inset-x-0" : "sticky"} top-0 z-30 border-b transition-colors duration-300 ${
        clear ? "border-transparent bg-transparent" : "border-leaf-100 bg-cream/95 backdrop-blur"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
        <Link
          href="/"
          onClick={close}
          className={`flex items-center gap-2 font-semibold transition-colors duration-300 ${clear ? "text-white" : "text-leaf-800"}`}
        >
          <Logo />
          <span className="text-lg tracking-tight">ShambaSmart</span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 whitespace-nowrap text-sm md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-1.5 transition-colors duration-300 ${
                clear
                  ? "text-white/85 hover:bg-white/10 hover:text-white"
                  : path === l.href
                    ? "bg-leaf-100 font-medium text-leaf-900"
                    : "text-leaf-900/80 hover:bg-leaf-50 hover:text-leaf-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {!inApp && (
            <Link
              href="/start"
              className={`ml-2 rounded-full px-4 py-1.5 font-medium transition-colors duration-300 ${
                clear ? "bg-sun-400 text-leaf-900 hover:brightness-95" : "bg-leaf-700 text-white hover:bg-leaf-800"
              }`}
            >
              Get started
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={`ml-auto flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 md:hidden ${
            clear ? "text-white hover:bg-white/10" : "text-leaf-900 hover:bg-leaf-50"
          }`}
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
