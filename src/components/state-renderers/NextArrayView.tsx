"use client";

interface NextArrayViewProps {
  state: Record<string, unknown>;
}

export function NextArrayView({ state }: NextArrayViewProps) {
  const pattern = state.pattern as string[];
  const next = state.next as (number | string)[];
  const nextval = (state as Record<string, unknown>).nextval as (number | string)[] | undefined;
  const highlight = state.highlight as number | undefined;

  return (
    <div className="overflow-x-auto">
      <table className="text-xs font-mono border-collapse w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="p-1.5 text-left text-muted-foreground">j</th>
            {pattern.map((_, i) => (
              <th key={i} className={`p-1.5 text-center ${i === highlight ? "bg-primary/20" : ""}`}>
                {i + 1}
              </th>
            ))}
          </tr>
          <tr className="border-b border-border">
            <th className="p-1.5 text-left text-muted-foreground">模式</th>
            {pattern.map((ch, i) => (
              <td key={i} className={`p-1.5 text-center font-semibold ${i === highlight ? "bg-primary/20 text-primary" : ""}`}>
                {ch}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="p-1.5 text-muted-foreground">next</td>
            {next.map((val, i) => (
              <td key={i} className={`p-1.5 text-center ${i === highlight ? "bg-primary/20 font-bold text-primary" : ""}`}>
                {val === -1 ? "" : val}
              </td>
            ))}
          </tr>
          {nextval && (
            <tr>
              <td className="p-1.5 text-muted-foreground">nextval</td>
              {nextval.map((val, i) => (
                <td key={i} className={`p-1.5 text-center ${i === highlight ? "bg-primary/20 font-bold text-primary" : ""}`}>
                  {val === -1 ? "" : String(val)}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
