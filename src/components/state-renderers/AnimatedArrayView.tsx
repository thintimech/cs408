"use client";

import { motion, LayoutGroup } from "framer-motion";
import { useMemo } from "react";

interface AnimatedArrayViewProps {
  state: Record<string, unknown>;
  prevState?: Record<string, unknown>;
}

function assignStableIds(array: (number | string)[]): string[] {
  const countMap: Record<string, number> = {};
  return array.map((val) => {
    const key = String(val);
    countMap[key] = (countMap[key] || 0) + 1;
    return `${key}__${countMap[key]}`;
  });
}

function getElementColor(
  index: number,
  { low, high, highlight, sorted, comparing, swapping }: {
    low?: number;
    high?: number;
    highlight?: number | number[];
    sorted?: number | number[];
    comparing?: number[];
    swapping?: number[];
  }
) {
  const sortedArr = sorted === undefined ? [] : typeof sorted === "number"
    ? Array.from({ length: sorted }, (_, i) => i)
    : sorted;
  const highlightArr = highlight === undefined ? [] : typeof highlight === "number" ? [highlight] : highlight;

  if (swapping?.includes(index))
    return "border-orange-500 bg-orange-500/20 text-orange-300 scale-110";
  if (comparing?.includes(index))
    return "border-yellow-500 bg-yellow-500/15 text-yellow-300";
  if (index === low)
    return "border-blue-500 bg-blue-500/15 text-blue-300";
  if (index === high)
    return "border-red-500 bg-red-500/15 text-red-300";
  if (highlightArr.includes(index))
    return "border-yellow-500 bg-yellow-500/15 text-yellow-300";
  if (sortedArr.includes(index))
    return "border-green-500 bg-green-500/15 text-green-300";
  return "border-border bg-background/50";
}

export function AnimatedArrayView({ state }: AnimatedArrayViewProps) {
  const array = state.array as (number | string)[];
  const low = state.low as number | undefined;
  const high = state.high as number | undefined;
  const pivot = state.pivot as number | string | undefined;
  const highlight = state.highlight as number | number[] | undefined;
  const sorted = state.sorted as number | number[] | undefined;
  const comparing = state.comparing as number[] | undefined;
  const swapping = state.swapping as number[] | undefined;
  const phase = state.phase as string | undefined;

  const stableIds = useMemo(() => assignStableIds(array), [array]);

  const maxVal = useMemo(() => {
    const nums = array.filter((v): v is number => typeof v === "number" && v !== 0);
    return nums.length > 0 ? Math.max(...nums) : 100;
  }, [array]);

  return (
    <div className="space-y-3">
      {/* Bar chart view */}
      <LayoutGroup>
        <div className="flex items-end gap-[2px] h-28 px-1">
          {array.map((val, i) => {
            const numVal = typeof val === "number" ? val : 0;
            const heightPct = maxVal > 0 ? Math.max((numVal / maxVal) * 100, 8) : 8;
            const color = getElementColor(i, { low, high, highlight, sorted, comparing, swapping });
            const isPlaceholder = val === "_" || val === "";

            return (
              <motion.div
                key={stableIds[i]}
                layoutId={stableIds[i]}
                className={`relative flex-1 min-w-[24px] max-w-[48px] rounded-t border ${color} flex items-end justify-center transition-colors duration-200`}
                style={{ height: isPlaceholder ? "8%" : `${heightPct}%` }}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              >
                <span className="text-[10px] font-mono pb-0.5 leading-none">
                  {isPlaceholder ? "" : val}
                </span>
              </motion.div>
            );
          })}
        </div>
      </LayoutGroup>

      {/* Index labels + grid view */}
      <div className="flex gap-[2px] px-1">
        {array.map((val, i) => {
          const color = getElementColor(i, { low, high, highlight, sorted, comparing, swapping });
          return (
            <motion.div
              key={`cell-${i}`}
              className={`flex-1 min-w-[24px] max-w-[48px] h-9 flex items-center justify-center rounded text-xs font-mono border ${color} transition-colors duration-200`}
              animate={swapping?.includes(i) ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {val}
            </motion.div>
          );
        })}
      </div>

      {/* Index numbers */}
      <div className="flex gap-[2px] px-1">
        {array.map((_, i) => (
          <div key={`idx-${i}`} className="flex-1 min-w-[24px] max-w-[48px] text-center text-[10px] text-muted-foreground font-mono">
            {i}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap text-xs text-muted-foreground pt-1">
        {low !== undefined && (
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/70 border border-blue-500" /> low={low}
          </span>
        )}
        {high !== undefined && (
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500/70 border border-red-500" /> high={high}
          </span>
        )}
        {pivot !== undefined && (
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500/70 border border-purple-500" /> pivot={pivot}
          </span>
        )}
        {phase && (
          <span className="text-muted-foreground/70 ml-auto">{phase}</span>
        )}
      </div>
    </div>
  );
}
