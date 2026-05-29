"use client";

interface CongestionViewProps {
  state: Record<string, unknown>;
}

const phaseLabels: Record<string, { label: string; color: string }> = {
  "slow-start": { label: "慢开始", color: "text-blue-400" },
  "congestion-avoidance": { label: "拥塞避免", color: "text-green-400" },
  "fast-recovery": { label: "快恢复", color: "text-purple-400" },
};

export function CongestionView({ state }: CongestionViewProps) {
  const cwnd = state.cwnd as number;
  const phase = state.phase as string;
  const ssthresh = state.ssthresh as number;
  const event = state.event as string | undefined;

  const maxCwnd = Math.max(cwnd, ssthresh) + 4;
  const cwndPct = (cwnd / maxCwnd) * 100;
  const ssthreshPct = (ssthresh / maxCwnd) * 100;
  const phaseInfo = phaseLabels[phase] || { label: phase, color: "text-foreground" };

  return (
    <div className="space-y-3">
      {/* Visual bar representation */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground w-16">cwnd</span>
          <div className="flex-1 h-6 bg-muted rounded overflow-hidden relative">
            <div
              className="h-full bg-primary/40 rounded transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${cwndPct}%` }}
            >
              <span className="text-[10px] font-mono font-medium text-primary">{cwnd}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground w-16">ssthresh</span>
          <div className="flex-1 h-3 relative">
            <div
              className="absolute top-0 h-full border-r-2 border-dashed border-orange-500"
              style={{ width: `${ssthreshPct}%` }}
            />
            <span
              className="absolute text-[10px] font-mono text-orange-400 -top-0.5"
              style={{ left: `${ssthreshPct}%`, transform: "translateX(4px)" }}
            >
              {ssthresh}
            </span>
          </div>
        </div>
      </div>

      {/* Phase and event info */}
      <div className="flex gap-3 flex-wrap text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className={phaseInfo.color}>{phaseInfo.label}</span>
        </span>
        {event && (
          <span className={`px-2 py-0.5 rounded border ${
            event === "timeout"
              ? "border-red-500/50 bg-red-500/10 text-red-400"
              : "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
          }`}>
            {event === "timeout" ? "超时！" : "3个重复ACK"}
          </span>
        )}
      </div>

      {/* Key values */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded bg-muted p-2 text-center">
          <div className="text-muted-foreground">cwnd</div>
          <div className="font-mono font-medium text-primary">{cwnd} MSS</div>
        </div>
        <div className="rounded bg-muted p-2 text-center">
          <div className="text-muted-foreground">ssthresh</div>
          <div className="font-mono font-medium text-orange-400">{ssthresh} MSS</div>
        </div>
        <div className="rounded bg-muted p-2 text-center">
          <div className="text-muted-foreground">阶段</div>
          <div className={`font-medium ${phaseInfo.color}`}>{phaseInfo.label}</div>
        </div>
      </div>
    </div>
  );
}
