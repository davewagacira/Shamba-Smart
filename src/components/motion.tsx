"use client";

import { animate, motion, useInView, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

// fade and rise into view once
export function Reveal({ children, delay = 0, className, y = 28 }: {
  children: React.ReactNode; delay?: number; className?: string; y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

// parent that reveals its <StaggerItem> children one after another
export function Stagger({ children, className, gap = 0.12, onMount = false }: {
  children: React.ReactNode; className?: string; gap?: number; onMount?: boolean;
}) {
  const variants = { hidden: {}, show: { transition: { staggerChildren: gap } } };
  return onMount ? (
    <motion.div className={className} variants={variants} initial="hidden" animate="show">{children}</motion.div>
  ) : (
    <motion.div className={className} variants={variants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, as = "div" }: {
  children: React.ReactNode; className?: string; as?: "div" | "li";
}) {
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp
      className={className}
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
    >
      {children}
    </Comp>
  );
}

// hero result card: slides in, then floats gently
export function FloatIn({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 40, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.9, delay: 0.35, ease }}
    >
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.3 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

// background photo that drifts slower than the page
export function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.16]);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Image src={src} alt={alt} fill preload sizes="100vw" className="object-cover" />
      </motion.div>
    </div>
  );
}

// photo that eases from slightly zoomed to normal as it enters
export function ZoomImage({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ scale: 1.12 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.4, ease }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </motion.div>
  );
}

// number that counts up when scrolled into view, e.g. "13,130" or "24 yrs"
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  const target = match ? Number(match[2].replace(/,/g, "")) : 0;
  const [shown, setShown] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!inView || !match) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease,
      onUpdate: (v) => setShown(`${match[1]}${Math.round(v).toLocaleString("en-US")}${match[3]}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return <span ref={ref} className={className}>{shown}</span>;
}
