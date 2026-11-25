type Series = { name: string; color: string; points: [number, number][]; dashed?: boolean };

type Props = {
  series: Series[];
  xLabel?: string;
  yLabel?: string;
  marker?: { x: number; y: number };
  height?: number;
};

const nice = (v: number) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `${+v.toFixed(1)}`);

// small dependency-free SVG line chart
export function LineChart({ series, xLabel, yLabel, marker, height = 220 }: Props) {
  const W = 560, H = height, L = 46, R = 12, T = 12, B = 34;
  const all = series.flatMap((s) => s.points).concat(marker ? [[marker.x, marker.y]] : []);
  if (all.length === 0) return null;
  const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y1 = Math.max(...ys) * 1.1 || 1, y0 = 0;
  const sx = (x: number) => L + ((x - x0) / (x1 - x0 || 1)) * (W - L - R);
  const sy = (y: number) => T + (1 - (y - y0) / (y1 - y0)) * (H - T - B);
  const yt = [0, 0.25, 0.5, 0.75, 1].map((f) => y0 + f * (y1 - y0));
  const xt = [0, 0.25, 0.5, 0.75, 1].map((f) => x0 + f * (x1 - x0));

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={yLabel}>
        {yt.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={sy(v)} y2={sy(v)} stroke="#e4ebe0" />
            <text x={L - 6} y={sy(v) + 4} textAnchor="end" fontSize="10" fill="#5b6b55">{nice(v)}</text>
          </g>
        ))}
        {xt.map((v) => (
          <text key={v} x={sx(v)} y={H - B + 16} textAnchor="middle" fontSize="10" fill="#5b6b55">
            {Number.isInteger(x0) && x1 - x0 < 100 ? Math.round(v) : nice(v)}
          </text>
        ))}
        {series.map((s) => (
          <polyline
            key={s.name}
            fill="none"
            stroke={s.color}
            strokeWidth="2.2"
            strokeDasharray={s.dashed ? "5 4" : undefined}
            strokeLinejoin="round"
            points={s.points.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" ")}
          />
        ))}
        {marker && (
          <g>
            <line x1={sx(marker.x)} x2={sx(marker.x)} y1={T} y2={H - B} stroke="#a8743f" strokeDasharray="3 3" />
            <circle cx={sx(marker.x)} cy={sy(marker.y)} r="5" fill="#f2b632" stroke="#6e4a26" strokeWidth="1.5" />
          </g>
        )}
        {xLabel && <text x={(W + L) / 2} y={H - 4} textAnchor="middle" fontSize="11" fill="#3d4a38">{xLabel}</text>}
      </svg>
      {series.length > 1 && (
        <div className="mt-1 flex flex-wrap gap-4 text-xs text-leaf-900/70">
          {series.map((s) => (
            <span key={s.name} className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4" style={{ background: s.color }} /> {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
