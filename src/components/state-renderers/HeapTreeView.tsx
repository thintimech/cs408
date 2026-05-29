"use client";

import { motion } from "framer-motion";

interface HeapTreeViewProps {
  state: Record<string, unknown>;
}

function getNodeColor(
  index: number,
  { adjusting, swapping, sorted, highlight }: {
    adjusting?: number;
    swapping?: number[];
    sorted?: number[];
    highlight?: number[];
  }
) {
  if (swapping?.includes(index))
    return "fill-orange-500/20 stroke-orange-500 text-orange-300";
  if (index === adjusting)
    return "fill-purple-500/20 stroke-purple-500 text-purple-300";
  if (highlight?.includes(index))
    return "fill-yellow-500/20 stroke-yellow-500 text-yellow-300";
  if (sorted?.includes(index))
    return "fill-green-500/20 stroke-green-500 text-green-300";
  return "fill-background/50 stroke-border text-foreground";
}

export function HeapTreeView({ state }: HeapTreeViewProps) {
  const array = state.array as (number | string)[];
  const adjusting = state.adjusting as number | undefined;
  const swapping = state.swapping as number[] | undefined;
  const sorted = state.sorted as number[] | undefined;
  const highlight = state.highlight as number[] | undefined;
  const heapSize = (state.heapSize as number) ?? array.length;

  const n = array.length;
  const depth = Math.ceil(Math.log2(n + 1));
  const width = 400;
  const height = Math.max(depth * 60 + 20, 120);
  const nodeR = 18;

  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const posInLevel = i - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    const spacing = width / (nodesInLevel + 1);
    positions.push({
      x: spacing * (posInLevel + 1),
      y: level * 60 + 35,
    });
  }

  const edges: { from: number; to: number }[] = [];
  for (let i = 1; i < n; i++) {
    const parent = Math.floor((i - 1) / 2);
    edges.push({ from: parent, to: i });
  }

  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-md mx-auto" style={{ height: `${height}px` }}>
        {edges.map(({ from, to }) => {
          const isOutOfHeap = to >= heapSize;
          return (
            <line
              key={`${from}-${to}`}
              x1={positions[from].x}
              y1={positions[from].y}
              x2={positions[to].x}
              y2={positions[to].y}
              className={isOutOfHeap ? "stroke-border/30" : "stroke-border"}
              strokeWidth={1.5}
            />
          );
        })}
        {array.map((val, i) => {
          const { x, y } = positions[i];
          const isOutOfHeap = i >= heapSize;
          const color = isOutOfHeap
            ? "fill-green-500/20 stroke-green-500/50 text-green-400"
            : getNodeColor(i, { adjusting, swapping, sorted, highlight });
          return (
            <motion.g
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.02 }}
            >
              <circle
                cx={x}
                cy={y}
                r={nodeR}
                className={color}
                strokeWidth={2}
              />
              <text
                x={x}
                y={y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[11px] font-mono fill-current"
              >
                {val}
              </text>
              <text
                x={x}
                y={y + nodeR + 10}
                textAnchor="middle"
                className="text-[9px] fill-muted-foreground"
              >
                {i + 1}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Array representation below */}
      <div className="flex gap-[2px] px-1 justify-center">
        {array.map((val, i) => {
          const isOutOfHeap = i >= heapSize;
          const isAdj = i === adjusting;
          const isSorted = sorted?.includes(i) || isOutOfHeap;
          const borderColor = isAdj
            ? "border-purple-500 bg-purple-500/15"
            : swapping?.includes(i)
              ? "border-orange-500 bg-orange-500/15"
              : isSorted
                ? "border-green-500 bg-green-500/15"
                : "border-border bg-background/50";
          return (
            <div
              key={i}
              className={`w-9 h-8 flex items-center justify-center rounded text-xs font-mono border ${borderColor} transition-colors duration-200`}
            >
              {val}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap text-xs text-muted-foreground pt-1">
        {adjusting !== undefined && adjusting >= 0 && (
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500/70 border border-purple-500" /> 调整结点 [{adjusting + 1}]
          </span>
        )}
        {heapSize < n && (
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70 border border-green-500" /> 已排序
          </span>
        )}
      </div>
    </div>
  );
}
