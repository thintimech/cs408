"use client";

interface StateMachineViewProps {
  state: Record<string, unknown>;
}

const allStates = ["创建态", "就绪态", "运行态", "阻塞态", "终止态"];

const stateStyles: Record<string, { bg: string; border: string; text: string }> = {
  "创建态": { bg: "bg-slate-500/15", border: "border-slate-500/40", text: "text-slate-300" },
  "就绪态": { bg: "bg-blue-500/15", border: "border-blue-500/40", text: "text-blue-400" },
  "运行态": { bg: "bg-green-500/15", border: "border-green-500/40", text: "text-green-400" },
  "阻塞态": { bg: "bg-red-500/15", border: "border-red-500/40", text: "text-red-400" },
  "终止态": { bg: "bg-gray-500/15", border: "border-gray-500/40", text: "text-gray-400" },
};

export function StateMachineView({ state }: StateMachineViewProps) {
  const currentState = state.currentState as string;
  const event = state.event as string | undefined;

  return (
    <div className="space-y-3">
      {/* State circles */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {allStates.map((s) => {
          const isCurrent = s === currentState;
          const style = stateStyles[s] || { bg: "bg-muted", border: "border-muted", text: "text-foreground" };
          return (
            <div
              key={s}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                isCurrent
                  ? `${style.bg} ${style.border} ${style.text} ring-2 ring-offset-1 ring-offset-background ring-current scale-110`
                  : "bg-muted/50 border-muted text-muted-foreground/50"
              }`}
            >
              {s}
            </div>
          );
        })}
      </div>

      {/* Event trigger */}
      {event && (
        <div className="text-xs text-center px-3 py-1.5 rounded bg-primary/10 border border-primary/20 text-primary font-medium">
          {event}
        </div>
      )}
    </div>
  );
}
