"use client";

interface ProcessSyncViewProps {
  state: Record<string, unknown>;
}

const processStates: Record<string, { color: string; label: string }> = {
  "就绪": { color: "bg-blue-500/15 border-blue-500/50 text-blue-300", label: "就绪" },
  "想进入": { color: "bg-yellow-500/15 border-yellow-500/50 text-yellow-300", label: "想进入" },
  "等待中": { color: "bg-orange-500/15 border-orange-500/50 text-orange-300", label: "等待" },
  "阻塞": { color: "bg-red-500/15 border-red-500/50 text-red-300", label: "阻塞" },
  "在临界区": { color: "bg-green-500/15 border-green-500/50 text-green-300", label: "临界区" },
  "退出": { color: "bg-muted border-border text-muted-foreground", label: "退出" },
  "剩余区": { color: "bg-muted border-border text-muted-foreground", label: "剩余区" },
  "不想进入": { color: "bg-muted border-border text-muted-foreground", label: "空闲" },
};

export function ProcessSyncView({ state }: ProcessSyncViewProps) {
  const flag = state.flag as boolean[] | undefined;
  const turn = state.turn as number | undefined;
  const mutex = state.mutex as number | undefined;
  const empty = state.empty as number | undefined;
  const full = state.full as number | undefined;
  const buffer = state.buffer as (string | number)[] | undefined;

  const processes: [string, string][] = [];
  for (const key of Object.keys(state)) {
    if (/^P\d+$/.test(key)) {
      processes.push([key, state[key] as string]);
    }
  }

  return (
    <div className="space-y-3">
      {/* Process states */}
      {processes.length > 0 && (
        <div className="flex gap-3">
          {processes.map(([name, status]) => {
            const style = processStates[status] || { color: "bg-muted border-border text-foreground", label: status };
            return (
              <div key={name} className="flex-1 space-y-1">
                <div className="text-xs text-muted-foreground font-medium text-center">{name}</div>
                <div className={`px-3 py-2 rounded border text-center text-xs font-medium ${style.color}`}>
                  {style.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Shared variables */}
      <div className="flex gap-3 flex-wrap text-xs">
        {flag && (
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">flag =</span>
            <span className="font-mono">[{flag.map((f) => f ? "T" : "F").join(", ")}]</span>
          </div>
        )}
        {turn !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">turn =</span>
            <span className="font-mono text-primary">{turn}</span>
          </div>
        )}
        {mutex !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">mutex =</span>
            <span className={`font-mono font-medium ${mutex < 0 ? "text-red-400" : mutex === 0 ? "text-yellow-400" : "text-green-400"}`}>
              {mutex}
            </span>
          </div>
        )}
        {empty !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">empty =</span>
            <span className="font-mono">{empty}</span>
          </div>
        )}
        {full !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">full =</span>
            <span className="font-mono">{full}</span>
          </div>
        )}
      </div>

      {/* Buffer visualization */}
      {buffer && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-medium">缓冲区：</span>
          <div className="flex gap-0.5">
            {buffer.map((item, i) => (
              <div
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded border text-xs font-mono ${
                  item ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-background/50 text-muted-foreground"
                }`}
              >
                {item || "-"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
