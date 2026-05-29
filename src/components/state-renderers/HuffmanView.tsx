"use client";

interface HuffmanViewProps {
  state: Record<string, unknown>;
}

export function HuffmanView({ state }: HuffmanViewProps) {
  const forest = state.forest as (number | string)[] | undefined;
  const merged = state.merged as string | undefined;
  const action = state.action as string | undefined;
  const wpl = state.wpl as number | undefined;

  if (!forest && !wpl) return null;

  return (
    <div className="space-y-3">
      {/* Forest visualization */}
      {forest && (
        <div className="flex items-end gap-2 flex-wrap">
          {forest.map((node, i) => {
            const val = typeof node === "string" ? parseInt(node) : node;
            const isNew = typeof node === "string" && node.includes("*");
            const displayVal = typeof node === "string" ? node.replace("*", "") : node;
            const maxVal = Math.max(...forest.map((n) => typeof n === "string" ? parseInt(n) : n));
            const heightPct = maxVal > 0 ? Math.max((val / maxVal) * 100, 25) : 25;

            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-12 rounded-t flex items-center justify-center text-sm font-mono font-medium border-2 transition-all ${
                    isNew
                      ? "border-yellow-500 bg-yellow-500/15 text-yellow-300"
                      : "border-primary/50 bg-primary/10 text-primary"
                  }`}
                  style={{ height: `${heightPct * 0.8}px`, minHeight: "32px" }}
                >
                  {displayVal}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Merge info */}
      {merged && (
        <div className="text-xs px-2 py-1.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 font-mono">
          {merged}
        </div>
      )}

      {/* WPL result */}
      {wpl !== undefined && (
        <div className="text-xs px-3 py-2 rounded bg-green-500/10 border border-green-500/20 text-green-400 font-medium">
          WPL = {wpl}
        </div>
      )}

      {/* Action label */}
      {action && !wpl && (
        <div className="text-xs text-muted-foreground">{action}</div>
      )}
    </div>
  );
}
