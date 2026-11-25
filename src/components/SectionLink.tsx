"use client";

import { useLenis } from "lenis/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const HEADER_OFFSET = -96;

// scrolls smoothly to a home page section, or opens the home page at that section
export function SectionLink({ id, className, children, onNavigate }: {
  id: string; className?: string; children: React.ReactNode; onNavigate?: () => void;
}) {
  const path = usePathname();
  const lenis = useLenis();
  return (
    <Link
      href={`/#${id}`}
      scroll={false}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        if (path !== "/") return;
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(el, { offset: HEADER_OFFSET, duration: 1.2 });
        else el.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", `/#${id}`);
      }}
    >
      {children}
    </Link>
  );
}
