"use client";

interface KMPViewProps {
  state: Record<string, unknown>;
}

export function KMPView({ state }: KMPViewProps) {
  const pattern = state.pattern as string[] | undefined;
  const next = state.next as number[] | undefined;
  const nextval = state.nextval as number[] | undefined;
  const highlight = state.highlight as number | undefined;
  const S = state.S as string | undefined;
  const P = (state.P || state.T) as string | undefined;
  const i = state.i as number | undefined;
  const j = state.j as number | undefined;
  const alignStart = state.alignStart as number | undefined;
  const matched = state.matched as string | undefined;
  const status = state.status as string | undefined;
  const result = state.result as string | undefined;
  const note = state.note as string | undefined;

  return (
    <div className="space-y-3">
      {/* Pattern + next/nextval array display */}
      {pattern && (
        <div className="overflow-x-auto">
          <table className="text-xs font-mono">
            <thead>
              <tr>
                <td className="pr-2 text-muted-foreground font-medium">j</td>
                {pattern.map((_, idx) => (
                  <td key={idx} className="w-8 text-center text-muted-foreground">{idx + 1}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pr-2 text-muted-foreground font-medium">P</td>
                {pattern.map((ch, idx) => (
                  <td
                    key={idx}
                    className={`w-8 h-7 text-center border rounded ${
                      idx === highlight
                        ? "border-yellow-500 bg-yellow-500/15 text-yellow-300 font-bold"
                        : "border-border bg-background/50"
                    }`}
                  >
                    {ch}
                  </td>
                ))}
              </tr>
              {next && (
                <tr>
                  <td className="pr-2 text-muted-foreground font-medium">next</td>
                  {next.map((v, idx) => (
                    <td
                      key={idx}
                      className={`w-8 h-7 text-center border rounded ${
                        v === -1
                          ? "border-border/50 bg-muted/30 text-muted-foreground/50"
                          : idx === highlight
                            ? "border-green-500 bg-green-500/15 text-green-300"
                            : "border-border bg-background/50"
                      }`}
                    >
                      {v === -1 ? "?" : v}
                    </td>
                  ))}
                </tr>
              )}
              {nextval && (
                <tr>
                  <td className="pr-2 text-muted-foreground font-medium text-nowrap">nextval</td>
                  {nextval.map((v, idx) => (
                    <td
                      key={idx}
                      className={`w-8 h-7 text-center border rounded ${
                        v === -1
                          ? "border-border/50 bg-muted/30 text-muted-foreground/50"
                          : idx === highlight
                            ? "border-blue-500 bg-blue-500/15 text-blue-300"
                            : "border-border bg-background/50"
                      }`}
                    >
                      {v === -1 ? "?" : v}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* String matching display */}
      {S && P && (
        <div className="space-y-1 font-mono text-xs overflow-x-auto">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground w-6">S:</span>
            <div className="flex">
              {S.split("").map((ch, idx) => (
                <span
                  key={idx}
                  className={`w-5 text-center ${
                    i !== undefined && idx + 1 === i ? "text-yellow-300 font-bold underline" : ""
                  } ${matched && idx < matched.length ? "text-green-400" : ""}`}
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground w-6">P:</span>
            <div className="flex">
              {alignStart !== undefined && alignStart > 1 &&
                Array.from({ length: alignStart - 1 }).map((_, idx) => (
                  <span key={`pad-${idx}`} className="w-5" />
                ))
              }
              {P.split("").map((ch, idx) => (
                <span
                  key={idx}
                  className={`w-5 text-center ${
                    j !== undefined && idx + 1 === j ? "text-yellow-300 font-bold underline" : ""
                  } ${matched && idx < matched.length ? "text-green-400" : ""}`}
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status */}
      {(status || result || note) && (
        <div className={`text-xs px-2 py-1.5 rounded border ${
          result
            ? "bg-green-500/10 border-green-500/20 text-green-400"
            : "bg-muted border-border text-muted-foreground"
        }`}>
          {result || status || note}
        </div>
      )}
    </div>
  );
}
