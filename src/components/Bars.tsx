// horizontal bar list for importances and probabilities
export function Bars({ items, max, format = (v) => v.toFixed(2), color = "bg-leaf-500" }: {
  items: { label: string; value: number; sub?: string }[];
  max?: number;
  format?: (v: number) => string;
  color?: string;
}) {
  const top = max ?? Math.max(...items.map((i) => i.value));
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i.label} className="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-sm">
          <span className="truncate text-leaf-900">
            {i.label}
            {i.sub && <span className="ml-1 text-xs text-leaf-900/50">{i.sub}</span>}
          </span>
          <span className="h-2.5 overflow-hidden rounded-full bg-leaf-100">
            <span className={`block h-full rounded-full ${color}`} style={{ width: `${(i.value / top) * 100}%` }} />
          </span>
          <span className="text-right tabular-nums text-leaf-900/80">{format(i.value)}</span>
        </li>
      ))}
    </ul>
  );
}
