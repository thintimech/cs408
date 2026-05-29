"use client";

interface TableViewProps {
  state: Record<string, unknown>;
}

export function TableView({ state }: TableViewProps) {
  const headers = state.headers as string[];
  const rows = state.rows as (string | number)[][];
  const highlightRow = state.highlightRow as number | undefined;
  const highlightCol = state.highlightCol as number | undefined;
  const caption = state.caption as string | undefined;

  return (
    <div className="overflow-x-auto">
      {caption && <p className="text-xs text-muted-foreground mb-1">{caption}</p>}
      <table className="text-xs font-mono border-collapse w-full">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h, i) => (
              <th
                key={i}
                className={`p-1.5 text-center font-medium ${i === highlightCol ? "bg-primary/10" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={`border-b border-border/50 ${ri === highlightRow ? "bg-primary/10" : ""}`}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`p-1.5 text-center ${ci === highlightCol && ri === highlightRow ? "font-bold text-primary" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
