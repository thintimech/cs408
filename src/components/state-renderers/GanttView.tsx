"use client";

interface GanttViewProps {
  state: Record<string, unknown>;
}

interface GanttBlock {
  process: string;
  start: number;
  end: number;
  color?: string;
}

const COLORS = [
  "bg-blue-500/70",
  "bg-green-500/70",
  "bg-yellow-500/70",
  "bg-purple-500/70",
  "bg-pink-500/70",
  "bg-cyan-500/70",
  "bg-orange-500/70",
];

export function GanttView({ state }: GanttViewProps) {
  const blocks = state.blocks as GanttBlock[];
  const currentTime = state.currentTime as number | undefined;
  const totalTime = state.totalTime as number || (blocks.length > 0 ? blocks[blocks.length - 1].end : 10);
  const processes = [...new Set(blocks.map(b => b.process))];
  const processColorMap: Record<string, string> = {};
  processes.forEach((p, i) => { processColorMap[p] = COLORS[i % COLORS.length]; });

  return (
    <div className="space-y-2">
      <div className="relative border border-border rounded overflow-hidden">
        <div className="flex h-8">
          {blocks.map((block, i) => {
            const widthPct = ((block.end - block.start) / totalTime) * 100;
            const leftPct = (block.start / totalTime) * 100;
            return (
              <div
                key={i}
                className={`absolute h-full flex items-center justify-center text-xs font-mono text-white ${processColorMap[block.process]}`}
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
              >
                {block.process}
              </div>
            );
          })}
          {currentTime !== undefined && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
              style={{ left: `${(currentTime / totalTime) * 100}%` }}
            />
          )}
        </div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground font-mono">
        <span>0</span>
        {currentTime !== undefined && <span className="text-red-500">t={currentTime}</span>}
        <span>{totalTime}</span>
      </div>
      <div className="flex gap-3 flex-wrap text-xs">
        {processes.map((p) => (
          <span key={p} className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded-sm ${processColorMap[p]}`} />
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
