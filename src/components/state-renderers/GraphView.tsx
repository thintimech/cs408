"use client";

import { motion } from "framer-motion";

interface GraphViewProps {
  state: Record<string, unknown>;
}

const DEFAULT_NODES = ["V0", "V1", "V2", "V3", "V4"];
const DEFAULT_EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [1, 2], [2, 4],
];
const DEFAULT_POSITIONS = [
  { x: 100, y: 40 },
  { x: 40, y: 120 },
  { x: 160, y: 120 },
  { x: 40, y: 200 },
  { x: 220, y: 200 },
];

export function GraphView({ state }: GraphViewProps) {
  const visited = state.visited as boolean[] | undefined;
  const stack = state.stack as string[] | undefined;
  const queue = state.queue as string[] | undefined;
  const sequence = state.sequence as string[] | undefined;
  const nodes = (state.nodes as string[]) ?? DEFAULT_NODES;
  const edges = (state.edges as [number, number][]) ?? DEFAULT_EDGES;
  const positions = (state.positions as { x: number; y: number }[]) ?? DEFAULT_POSITIONS;
  const current = state.current as number | undefined;

  const width = 280;
  const height = 240;
  const nodeR = 20;

  function getNodeColor(i: number) {
    if (current === i) return "fill-orange-500/30 stroke-orange-500";
    if (visited?.[i]) return "fill-green-500/20 stroke-green-500";
    return "fill-background/50 stroke-border";
  }

  function getTextColor(i: number) {
    if (current === i) return "fill-orange-300";
    if (visited?.[i]) return "fill-green-300";
    return "fill-current";
  }

  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-xs mx-auto" style={{ height: `${height}px` }}>
        {edges.map(([a, b], idx) => (
          <line
            key={idx}
            x1={positions[a].x}
            y1={positions[a].y}
            x2={positions[b].x}
            y2={positions[b].y}
            className={
              visited?.[a] && visited?.[b]
                ? "stroke-green-500/60"
                : "stroke-border"
            }
            strokeWidth={1.5}
          />
        ))}
        {nodes.map((name, i) => (
          <motion.g
            key={i}
            animate={current === i ? { scale: 1.15 } : { scale: 1 }}
            style={{ transformOrigin: `${positions[i].x}px ${positions[i].y}px` }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <circle
              cx={positions[i].x}
              cy={positions[i].y}
              r={nodeR}
              className={getNodeColor(i)}
              strokeWidth={2}
            />
            <text
              x={positions[i].x}
              y={positions[i].y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-[11px] font-mono ${getTextColor(i)}`}
            >
              {name}
            </text>
          </motion.g>
        ))}
      </svg>

      {/* Data structures display */}
      <div className="flex gap-4 text-xs">
        {stack && (
          <div className="flex-1">
            <span className="text-muted-foreground font-medium">栈：</span>
            <span className="font-mono">[{stack.join(", ")}]</span>
          </div>
        )}
        {queue && (
          <div className="flex-1">
            <span className="text-muted-foreground font-medium">队列：</span>
            <span className="font-mono">[{queue.join(", ")}]</span>
          </div>
        )}
        {sequence && (
          <div className="flex-1">
            <span className="text-muted-foreground font-medium">访问序列：</span>
            <span className="font-mono text-green-400">{sequence.join(" → ")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
