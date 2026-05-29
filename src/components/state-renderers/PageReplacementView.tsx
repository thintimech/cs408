"use client";

interface PageReplacementViewProps {
  state: Record<string, unknown>;
}

export function PageReplacementView({ state }: PageReplacementViewProps) {
  const memory = state.memory as (number | string)[] | undefined;
  const pageFaults = state.pageFaults as number | undefined;
  const queue = state.queue as (number | string)[] | undefined;
  const replaced = state.replaced as number | string | undefined;
  const referenceString = state.referenceString as number[] | undefined;
  const frames = state.frames as number | undefined;
  const algorithm = state.algorithm as string | undefined;
  const totalFaults = state.totalFaults as Record<string, number> | undefined;

  return (
    <div className="space-y-3">
      {/* Reference string display */}
      {referenceString && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-medium">引用串：</span>
          <div className="flex gap-1 flex-wrap">
            {referenceString.map((p, i) => (
              <span key={i} className="w-6 h-6 flex items-center justify-center text-xs font-mono rounded bg-muted border border-border">
                {p}
              </span>
            ))}
          </div>
          {frames && <span className="text-xs text-muted-foreground">页框数：{frames}，算法：{algorithm}</span>}
        </div>
      )}

      {/* Memory frames */}
      {memory && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-medium">内存页框：</span>
          <div className="flex gap-1">
            {memory.map((page, i) => (
              <div
                key={i}
                className={`w-10 h-10 flex items-center justify-center text-sm font-mono rounded border-2 transition-colors duration-200 ${
                  page === replaced
                    ? "border-red-500 bg-red-500/15 text-red-300 line-through"
                    : "border-green-500 bg-green-500/10 text-green-300"
                }`}
              >
                {page}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status line */}
      <div className="flex gap-4 flex-wrap text-xs text-muted-foreground">
        {pageFaults !== undefined && (
          <span>缺页次数：<span className="text-orange-400 font-medium">{pageFaults}</span></span>
        )}
        {replaced !== undefined && (
          <span>换出页面：<span className="text-red-400 font-medium">{replaced}</span></span>
        )}
        {queue && (
          <span>FIFO队列：<span className="font-mono">[{queue.join(", ")}]</span></span>
        )}
      </div>

      {/* Comparison table */}
      {totalFaults && (
        <div className="rounded border border-border overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-muted">
              <tr>
                {Object.keys(totalFaults).map((alg) => (
                  <th key={alg} className="px-3 py-1.5 text-left font-medium">{alg}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.entries(totalFaults).map(([alg, count]) => (
                  <td key={alg} className="px-3 py-1.5 font-mono">{count}次缺页</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
