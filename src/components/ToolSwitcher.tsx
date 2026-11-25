"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TOOLS = [
  { href: "/crop-advisor", label: "Crop Advisor" },
  { href: "/yield-forecast", label: "Yield Forecast" },
];

// segmented tabs for moving between the two tools
export function ToolSwitcher() {
  const path = usePathname();
  return (
    <div className="mb-6 inline-flex rounded-full border border-leaf-200 bg-white p-1 text-sm shadow-sm">
      {TOOLS.map((t) => {
        const active = path === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-2 transition ${
              active ? "bg-leaf-700 font-medium text-white" : "text-leaf-900/75 hover:bg-leaf-50 hover:text-leaf-900"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
