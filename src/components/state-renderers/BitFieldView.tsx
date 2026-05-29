"use client";

interface BitFieldViewProps {
  state: Record<string, unknown>;
}

interface BitSegment {
  label: string;
  bits: string;
  color?: string;
}

const SEGMENT_COLORS = [
  "bg-blue-500/20 border-blue-500/50",
  "bg-green-500/20 border-green-500/50",
  "bg-yellow-500/20 border-yellow-500/50",
  "bg-purple-500/20 border-purple-500/50",
  "bg-pink-500/20 border-pink-500/50",
];

export function BitFieldView({ state }: BitFieldViewProps) {
  const segments = state.segments as BitSegment[] | undefined;
  const bits = state.bits as string | undefined;
  const labels = state.labels as string[] | undefined;
  const highlight = state.highlight as number[] | undefined;
  const caption = state.caption as string | undefined;

  if (segments) {
    return (
      <div className="space-y-2">
        {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
        <div className="flex border border-border rounded overflow-hidden">
          {segments.map((seg, i) => (
            <div
              key={i}
              className={`flex flex-col items-center border-r last:border-r-0 ${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}`}
              style={{ flex: seg.bits.length }}
            >
              <span className="text-[10px] text-muted-foreground px-1 py-0.5 border-b border-border/50 w-full text-center">
                {seg.label}
              </span>
              <span className="font-mono text-xs px-1 py-1 tracking-wider">
                {seg.bits}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (bits) {
    return (
      <div className="space-y-1">
        {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
        <div className="flex">
          {bits.split("").map((bit, i) => (
            <div
              key={i}
              className={`w-6 h-7 flex items-center justify-center text-xs font-mono border-r border-border last:border-r-0 ${
                highlight?.includes(i) ? "bg-primary/20 font-bold text-primary" : "bg-muted/50"
              }`}
            >
              {bit}
            </div>
          ))}
        </div>
        {labels && (
          <div className="flex">
            {labels.map((label, i) => (
              <div key={i} className="w-6 text-center text-[9px] text-muted-foreground">
                {label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
