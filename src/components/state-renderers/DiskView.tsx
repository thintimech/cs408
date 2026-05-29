"use client";

interface DiskViewProps {
  state: Record<string, unknown>;
}

export function DiskView({ state }: DiskViewProps) {
  const requests = state.requests as number[];
  const head = state.head as number;
  const direction = state.direction as number | undefined;
  const visited = state.visited as number[] | undefined;
  const maxTrack = state.maxTrack as number || 200;
  const caption = state.caption as string | undefined;

  const allPositions = [head, ...requests];
  const min = 0;
  const max = maxTrack;

  return (
    <div className="space-y-2">
      {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
      <div className="relative h-12 border border-border rounded bg-muted/30">
        {requests.map((req, i) => {
          const leftPct = (req / max) * 100;
          const isVisited = visited?.includes(req);
          return (
            <div
              key={i}
              className={`absolute top-1 w-1 h-4 rounded-full ${isVisited ? "bg-green-500" : "bg-muted-foreground/50"}`}
              style={{ left: `${leftPct}%` }}
              title={`${req}`}
            />
          );
        })}
        <div
          className="absolute bottom-1 w-3 h-5 bg-primary rounded-sm flex items-center justify-center"
          style={{ left: `calc(${(head / max) * 100}% - 6px)` }}
          title={`磁头: ${head}`}
        >
          <span className="text-[8px] text-primary-foreground font-bold">H</span>
        </div>
        {visited && visited.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <polyline
              points={visited.map((v, i) => `${(v / max) * 100}%,${30 + i * 2}`).join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-primary/50"
            />
          </svg>
        )}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground font-mono">
        <span>{min}</span>
        <span className="text-primary font-medium">磁头={head}{direction !== undefined ? (direction > 0 ? " →" : " ←") : ""}</span>
        <span>{max}</span>
      </div>
      {visited && (
        <p className="text-xs text-muted-foreground">
          访问顺序: {visited.join(" → ")}
        </p>
      )}
    </div>
  );
}
