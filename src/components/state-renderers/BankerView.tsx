"use client";

interface BankerViewProps {
  state: Record<string, unknown>;
}

export function BankerView({ state }: BankerViewProps) {
  const Work = state.Work as number[] | undefined;
  const Finish = state.Finish as boolean[] | undefined;
  const safeSequence = state.safeSequence as string[] | undefined;
  const note = state.note as string | undefined;
  const result = state.result as string | undefined;

  return (
    <div className="space-y-3">
      {/* Work vector */}
      {Work && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">Work =</span>
          <div className="flex gap-0.5">
            {Work.map((v, i) => (
              <span key={i} className="w-8 h-7 flex items-center justify-center rounded border border-blue-500/50 bg-blue-500/10 text-blue-300 font-mono">
                {v}
              </span>
            ))}
          </div>
          <span className="text-muted-foreground ml-1">({["A", "B", "C"].slice(0, Work.length).join(",")})</span>
        </div>
      )}

      {/* Finish array */}
      {Finish && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">Finish =</span>
          <div className="flex gap-0.5">
            {Finish.map((v, i) => (
              <span
                key={i}
                className={`w-8 h-7 flex items-center justify-center rounded border font-mono text-[10px] ${
                  v
                    ? "border-green-500/50 bg-green-500/15 text-green-400"
                    : "border-border bg-background/50 text-muted-foreground"
                }`}
              >
                {v ? "T" : "F"}
              </span>
            ))}
          </div>
          <span className="text-muted-foreground ml-1">({Finish.map((_, i) => `P${i}`).join(",")})</span>
        </div>
      )}

      {/* Safe sequence */}
      {safeSequence && safeSequence.length > 0 && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">安全序列：</span>
          <div className="flex items-center gap-1">
            {safeSequence.map((p, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-muted-foreground">→</span>}
                <span className="px-2 py-0.5 rounded bg-green-500/15 border border-green-500/50 text-green-400 font-mono">
                  {p}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      {note && (
        <div className="text-xs px-2 py-1.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 font-mono">
          {note}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`text-xs px-3 py-2 rounded font-medium ${
          result === "安全"
            ? "bg-green-500/15 border border-green-500/30 text-green-400"
            : "bg-red-500/15 border border-red-500/30 text-red-400"
        }`}>
          系统状态：{result}
        </div>
      )}
    </div>
  );
}
