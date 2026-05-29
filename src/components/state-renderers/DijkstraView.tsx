"use client";

interface DijkstraViewProps {
  state: Record<string, unknown>;
}

export function DijkstraView({ state }: DijkstraViewProps) {
  const dist = state.dist as Record<string, string | number> | undefined;
  const path = state.path as Record<string, string> | undefined;
  const final_ = state.final as Record<string, boolean> | undefined;
  const relaxation = state.relaxation as string | undefined;
  const shortestPaths = state.shortestPaths as Record<string, string> | undefined;

  if (!dist) return null;

  const vertices = Object.keys(dist);

  return (
    <div className="space-y-3">
      {/* Distance table */}
      <div className="rounded border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-muted">
            <tr>
              <th className="px-2 py-1.5 text-left font-medium">顶点</th>
              {vertices.map((v) => (
                <th key={v} className="px-2 py-1.5 text-center font-medium">{v}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-1.5 font-medium text-muted-foreground">dist</td>
              {vertices.map((v) => {
                const val = dist[v];
                const isFinalized = final_?.[v];
                return (
                  <td
                    key={v}
                    className={`px-2 py-1.5 text-center font-mono ${
                      isFinalized
                        ? "text-green-400 font-medium"
                        : "text-foreground"
                    }`}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
            {path && (
              <tr>
                <td className="px-2 py-1.5 font-medium text-muted-foreground">path</td>
                {vertices.map((v) => (
                  <td key={v} className="px-2 py-1.5 text-center font-mono text-muted-foreground">
                    {path[v] || "-"}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Relaxation info */}
      {relaxation && (
        <div className="text-xs px-2 py-1.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-300">
          松弛：{relaxation}
        </div>
      )}

      {/* Final shortest paths */}
      {shortestPaths && (
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">最短路径：</span>
          <div className="grid gap-1">
            {Object.entries(shortestPaths).map(([key, val]) => (
              <div key={key} className="text-xs font-mono text-green-400 pl-2">
                {key}: {val}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
