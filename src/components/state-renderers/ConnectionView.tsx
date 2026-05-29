"use client";

interface ConnectionViewProps {
  state: Record<string, unknown>;
}

const stateColors: Record<string, string> = {
  CLOSED: "bg-muted text-muted-foreground",
  LISTEN: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "SYN-SENT": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "SYN-RCVD": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  ESTABLISHED: "bg-green-500/15 text-green-400 border-green-500/30",
  "FIN-WAIT-1": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "FIN-WAIT-2": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "CLOSE-WAIT": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "LAST-ACK": "bg-red-500/15 text-red-400 border-red-500/30",
  "TIME-WAIT": "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export function ConnectionView({ state }: ConnectionViewProps) {
  const client = state.client as string;
  const server = state.server as string;
  const message = state.message as string | undefined;

  const clientColor = stateColors[client] || "bg-muted text-foreground";
  const serverColor = stateColors[server] || "bg-muted text-foreground";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        {/* Client */}
        <div className="flex-1 text-center">
          <div className="text-[10px] text-muted-foreground mb-1">客户端</div>
          <div className={`rounded-lg border px-3 py-2 text-xs font-mono font-medium ${clientColor}`}>
            {client}
          </div>
        </div>

        {/* Message arrow */}
        <div className="flex-1 flex flex-col items-center">
          {message ? (
            <>
              <div className="text-[10px] font-mono text-primary text-center leading-tight mb-1">
                {message}
              </div>
              <div className="w-full h-px bg-primary/50 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-primary/50 border-y-[3px] border-y-transparent" />
              </div>
            </>
          ) : (
            <div className="w-full h-px bg-muted" />
          )}
        </div>

        {/* Server */}
        <div className="flex-1 text-center">
          <div className="text-[10px] text-muted-foreground mb-1">服务器</div>
          <div className={`rounded-lg border px-3 py-2 text-xs font-mono font-medium ${serverColor}`}>
            {server}
          </div>
        </div>
      </div>
    </div>
  );
}
