"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// jump to the top on page change so Lenis and the router agree
function ResetOnNavigate() {
  const lenis = useLenis();
  const path = usePathname();
  useEffect(() => {
    if (!lenis) return;
    const id = window.location.hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) {
      lenis.scrollTo(0, { immediate: true });
      return;
    }
    // let the new page lay out, then glide to the section
    const t = setTimeout(() => {
      lenis.resize();
      lenis.scrollTo(target, { offset: -96, duration: 1.2 });
    }, 300);
    return () => clearTimeout(t);
  }, [path, lenis]);
  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: true, stopInertiaOnNavigate: true }}>
      <ResetOnNavigate />
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}
