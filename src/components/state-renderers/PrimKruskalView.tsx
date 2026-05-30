"use client";

interface PrimKruskalViewProps {
  state: Record<string, unknown>;
}

export function PrimKruskalView({ state }: PrimKruskalViewProps) {
  const U = state.U as string[] | undefined;
  const lowcost = state.lowcost as Record<string, number | string> | undefined;
  const closest = state.closest as Record<string, string> | undefined;
  const selectedEdges = state.selectedEdges as string[] | undefined;
  const totalWeight = state.totalWeight as number | undefined;
  const note = state.note as string | undefined;
  const sortedEdges = state.sortedEdges as string[] | undefined;
  const currentEdge = state.currentEdge as string | undefined;

  return (
    <div className="space-y-3">
      {/* U set (Prim) */}
      {U && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">U =</span>
          <div className="flex gap-1">
            {U.map((v) => (
              <span key={v} className="px-2 py-0.5 rounded bg-green-500/15 border border-green-500/50 text-green-400 font-mono">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Lowcost table (Prim) */}
      {lowcost && (
        <div className="rounded border border-border overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-muted">
              <tr>
                <th className="px-2 py-1.5 text-left font-medium">顶点</th>
                {Object.keys(lowcost).map((v) => (
                  <th key={v} className="px-2 py-1.5 text-center font-medium">{v}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1.5 font-medium text-muted-foreground">lowcost</td>
                {Object.entries(lowcost).map(([v, cost]) => (
                  <td key={v} className="px-2 py-1.5 text-center font-mono">{cost}</td>
                ))}
              </tr>
              {closest && (
                <tr>
                  <td className="px-2 py-1.5 font-medium text-muted-foreground">closest</td>
                  {Object.entries(closest).map(([v, c]) => (
                    <td key={v} className="px-2 py-1.5 text-center font-mono text-muted-foreground">{c}</td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected edges */}
      {selectedEdges && selectedEdges.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-medium">已选边：</span>
          <div className="flex gap-1 flex-wrap">
            {selectedEdges.map((e, i) => (
              <span key={i} className="px-2 py-0.5 text-xs font-mono rounded bg-primary/10 border border-primary/30 text-primary">
                {e}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sorted edges list (Kruskal) */}
      {sortedEdges && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-medium">边按权排序：</span>
          <div className="flex gap-1 flex-wrap">
            {sortedEdges.map((e, i) => (
              <span
                key={i}
                className={`px-2 py-0.5 text-xs font-mono rounded border ${
                  e === currentEdge
                    ? "bg-yellow-500/15 border-yellow-500/50 text-yellow-300"
                    : selectedEdges?.includes(e)
                      ? "bg-green-500/15 border-green-500/50 text-green-400"
                      : "bg-muted border-border text-muted-foreground"
                }`}
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Total weight + note */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        {totalWeight !== undefined && (
          <span>总权值：<span className="text-primary font-medium">{totalWeight}</span></span>
        )}
        {note && <span className="text-yellow-400/80">{note}</span>}
      </div>
    </div>
  );
}
