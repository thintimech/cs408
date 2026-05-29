"use client";

interface WindowViewProps {
  state: Record<string, unknown>;
}

interface Frame {
  seq: number;
  status: "sent" | "acked" | "lost" | "waiting" | "buffered";
}

const STATUS_STYLES: Record<string, string> = {
  sent: "bg-blue-500/70 text-white",
  acked: "bg-green-500/70 text-white",
  lost: "bg-red-500/70 text-white line-through",
  waiting: "bg-muted border border-border text-muted-foreground",
  buffered: "bg-yellow-500/70 text-white",
};

export function WindowView({ state }: WindowViewProps) {
  const frames = state.frames as Frame[];
  const windowBase = state.windowBase as number;
  const windowSize = state.windowSize as number;
  const caption = state.caption as string | undefined;
  const sender = state.sender as string | undefined;
  const receiver = state.receiver as string | undefined;

  return (
    <div className="space-y-2">
      {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
      {sender && <p className="text-xs font-medium">{sender}</p>}
      <div className="relative">
        <div className="flex gap-0.5">
          {frames.map((frame, i) => (
            <div
              key={i}
              className={`w-8 h-8 flex items-center justify-center rounded text-xs font-mono ${STATUS_STYLES[frame.status]}`}
            >
              {frame.seq}
            </div>
          ))}
        </div>
        <div
          className="absolute top-0 h-8 border-2 border-primary rounded pointer-events-none"
          style={{
            left: `${windowBase * 34}px`,
            width: `${windowSize * 34 - 2}px`,
          }}
        />
      </div>
      {receiver && <p className="text-xs font-medium mt-2">{receiver}</p>}
      <div className="flex gap-3 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-500/70" />已发送</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-500/70" />已确认</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500/70" />丢失</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-muted border border-border" />等待</span>
      </div>
    </div>
  );
}
