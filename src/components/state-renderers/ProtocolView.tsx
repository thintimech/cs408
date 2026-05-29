"use client";

interface ProtocolViewProps {
  state: Record<string, unknown>;
}

const phaseStyles: Record<string, { label: string; color: string }> = {
  discover: { label: "Discover", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  offer: { label: "Offer", color: "text-green-400 bg-green-500/10 border-green-500/30" },
  request: { label: "Request", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  ack: { label: "ACK", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
};

const allPhases = ["discover", "offer", "request", "ack"];

export function ProtocolView({ state }: ProtocolViewProps) {
  const phase = state.phase as string;
  const src = state.src as string | undefined;
  const dst = state.dst as string | undefined;
  const offeredIP = state.offeredIP as string | undefined;
  const selectedIP = state.selectedIP as string | undefined;
  const assignedIP = state.assignedIP as string | undefined;
  const lease = state.lease as string | undefined;
  const note = state.note as string | undefined;

  const currentIdx = allPhases.indexOf(phase);

  return (
    <div className="space-y-3">
      {/* Phase progress */}
      <div className="flex items-center gap-1">
        {allPhases.map((p, i) => {
          const style = phaseStyles[p];
          const isActive = i === currentIdx;
          const isPast = i < currentIdx;
          return (
            <div key={p} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full py-1 rounded text-center text-[10px] font-medium border ${
                  isActive
                    ? style.color
                    : isPast
                    ? "bg-muted text-muted-foreground border-muted"
                    : "bg-transparent text-muted-foreground/40 border-muted/50"
                }`}
              >
                {style.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Key-value details */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {src && (
          <div className="rounded bg-muted p-1.5">
            <span className="text-muted-foreground">源: </span>
            <span className="font-mono text-foreground">{src}</span>
          </div>
        )}
        {dst && (
          <div className="rounded bg-muted p-1.5">
            <span className="text-muted-foreground">目的: </span>
            <span className="font-mono text-foreground">{dst}</span>
          </div>
        )}
        {offeredIP && (
          <div className="rounded bg-muted p-1.5">
            <span className="text-muted-foreground">提供IP: </span>
            <span className="font-mono text-green-400">{offeredIP}</span>
          </div>
        )}
        {selectedIP && (
          <div className="rounded bg-muted p-1.5">
            <span className="text-muted-foreground">选择IP: </span>
            <span className="font-mono text-yellow-400">{selectedIP}</span>
          </div>
        )}
        {assignedIP && (
          <div className="rounded bg-muted p-1.5">
            <span className="text-muted-foreground">分配IP: </span>
            <span className="font-mono text-purple-400">{assignedIP}</span>
          </div>
        )}
        {lease && (
          <div className="rounded bg-muted p-1.5">
            <span className="text-muted-foreground">租期: </span>
            <span className="font-mono text-foreground">{lease}</span>
          </div>
        )}
      </div>

      {/* Note */}
      {note && (
        <div className="text-[10px] text-muted-foreground italic">{note}</div>
      )}
    </div>
  );
}
