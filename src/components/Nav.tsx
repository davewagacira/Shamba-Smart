"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { SectionLink } from "@/components/SectionLink";

// home page sections the header scrolls to
const SECTIONS = [
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it works" },
  { id: "who-its-for", label: "Who it's for" },
  { id: "accuracy", label: "Accuracy" },
  { id: "faq", label: "FAQ" },
  // hidden from the header for presentations; the page still exists at /developers
  // { href: "/developers", label: "Developers" },
];

// pages that are already inside the product, where "Get started" makes no sense
const APP_ROUTES = ["/start", "/crop-advisor", "/yield-forecast"];

// scrolled: past 40px (pill shrinks); pastHero: the photo hero (id="hero") is under the header
function useScrollState(trackHero: boolean) {
  const [state, setState] = useState({ scrolled: false, pastHero: !trackHero, active: "" });
  useEffect(() => {
    const check = () => {
      const hero = trackHero ? document.getElementById("hero") : null;
      let active = "";
      if (trackHero) {
        for (const { id } of SECTIONS) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 140) active = id;
        }
      }
      setState({
        scrolled: window.scrollY > 40,
        pastHero: hero ? hero.getBoundingClientRect().bottom <= 80 : true,
        active,
      });
    };
    const frame = requestAnimationFrame(check);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [trackHero]);
  return state;
}

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const inApp = APP_ROUTES.includes(path);
  const isHome = path === "/";
  const { scrolled, pastHero, active } = useScrollState(isHome);
  const onHero = isHome && !pastHero && !open;

  const shell = onHero
    ? "border-b border-transparent bg-transparent lg:border lg:border-white/25 lg:bg-white/10 lg:backdrop-blur-md"
    : `border-b border-leaf-100 bg-cream/95 backdrop-blur-md lg:border lg:bg-white/90 ${
        scrolled
          ? "lg:border-leaf-200 lg:shadow-[0_16px_45px_-12px_rgba(24,54,20,0.25)]"
          : "lg:border-leaf-100 lg:shadow-[0_10px_30px_-10px_rgba(24,54,20,0.12)]"
      }`;
  const bar = onHero ? "bg-white" : "bg-leaf-900";

  return (
    <header
      className={`${isHome ? "fixed inset-x-0" : "sticky"} top-0 z-50 w-full transition-all duration-500 ease-out lg:top-3.5 lg:mx-auto lg:px-6 lg:pointer-events-none ${
        scrolled ? "lg:max-w-[980px]" : "lg:max-w-[1240px]"
      }`}
    >
      {/* full-width bar on mobile, floating pill on desktop */}
      <div className={`pointer-events-auto transition-all duration-500 ease-out lg:rounded-full lg:px-6 ${shell}`}>
        <div
          className={`flex items-center justify-between px-4 transition-all duration-500 ease-out sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-3 lg:px-0 ${
            scrolled ? "h-14" : "h-14 lg:h-16"
          }`}
        >
          <div className="flex items-center">
            <Link href="/" onClick={close} className="flex items-center gap-2.5">
              <Logo className={`h-8 w-8 transition-all duration-500 ease-out ${scrolled ? "lg:h-7 lg:w-7" : "lg:h-9 lg:w-9"}`} />
              <span
                className={`font-semibold tracking-tight transition-all duration-500 ease-out ${onHero ? "text-white" : "text-leaf-900"} ${
                  scrolled ? "text-lg lg:text-base" : "text-lg lg:text-xl"
                }`}
              >
                ShambaSmart
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 justify-self-center lg:flex">
            {SECTIONS.map((l) => (
              <SectionLink
                key={l.id}
                id={l.id}
                className={`whitespace-nowrap rounded-full font-medium transition-all duration-300 ${scrolled ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-[13.5px]"} ${
                  onHero
                    ? "text-white/85 hover:bg-white/10 hover:text-white"
                    : active === l.id
                      ? "bg-leaf-100 text-leaf-900"
                      : "text-leaf-900/75 hover:bg-leaf-50 hover:text-leaf-900"
                }`}
              >
                {l.label}
              </SectionLink>
            ))}
          </nav>

          <div className="hidden items-center justify-self-end lg:flex">
            {!inApp && (
              <Link
                href="/start"
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold shadow-sm transition-all duration-300 ${
                  scrolled ? "px-4 py-1.5 text-xs" : "px-4 py-2 text-sm"
                } ${onHero ? "bg-sun-400 text-leaf-900 hover:brightness-95" : "bg-leaf-700 text-white hover:bg-leaf-800"}`}
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
            className={`ml-auto flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden ${
              onHero ? "hover:bg-white/10" : "hover:bg-leaf-50"
            }`}
          >
            <span className="relative block h-4 w-[22px]">
              <span className={`absolute left-0 h-0.5 w-full rounded-full transition-all duration-300 ${bar} ${open ? "top-[7px] rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-[7px] h-0.5 w-full rounded-full transition-all duration-200 ${bar} ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 h-0.5 w-full rounded-full transition-all duration-300 ${bar} ${open ? "top-[7px] -rotate-45" : "top-3.5"}`} />
            </span>
          </button>
        </div>

        {open && (
          <div className="border-t border-leaf-100 bg-cream px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-0.5">
              {SECTIONS.map((l) => (
                <SectionLink
                  key={l.id}
                  id={l.id}
                  onNavigate={close}
                  className={`rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ${
                    active === l.id ? "bg-leaf-100 text-leaf-900" : "text-leaf-900/80 hover:bg-leaf-50"
                  }`}
                >
                  {l.label}
                </SectionLink>
              ))}
            </nav>
            {!inApp && (
              <div className="mt-3 border-t border-leaf-100 pt-3">
                <Link
                  href="/start"
                  onClick={close}
                  className="block rounded-full bg-leaf-700 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-leaf-800"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
