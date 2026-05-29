"use client";

interface QueueViewProps {
  state: Record<string, unknown>;
}

export function QueueView({ state }: QueueViewProps) {
  const queue = state.queue as (number | string)[];
  const front = state.front as string | undefined;
  const rear = state.rear as string | undefined;
  const action = state.action as string | undefined;
  const output = state.output as (number | string)[] | undefined;

  return (
    <div className="space-y-3">
      {/* Queue visualization */}
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-blue-400 w-8">{front || "前"}</span>
          <div className="flex items-center gap-0.5 flex-1">
            {queue.length === 0 ? (
              <div className="flex-1 h-8 rounded border border-dashed border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground">
                空
              </div>
            ) : (
              queue.map((item, i) => (
                <div
                  key={i}
                  className={`h-8 min-w-[32px] px-2 rounded border flex items-center justify-center text-xs font-mono font-medium ${
                    i === 0
                      ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                      : i === queue.length - 1
                      ? "border-orange-500/50 bg-orange-500/10 text-orange-400"
                      : "border-primary/30 bg-primary/5 text-primary"
                  }`}
                >
                  {item}
                </div>
              ))
            )}
          </div>
          <span className="text-[10px] text-orange-400 w-8 text-right">{rear || "后"}</span>
        </div>
      </div>

      {/* Action */}
      {action && (
        <div className="text-xs px-2 py-1.5 rounded bg-muted text-foreground font-medium">
          {action}
        </div>
      )}

      {/* Output sequence */}
      {output && output.length > 0 && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">输出:</span>
          <div className="flex gap-1">
            {output.map((item, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 font-mono">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
