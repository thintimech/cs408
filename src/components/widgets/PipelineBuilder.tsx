"use client";

import { useState, useMemo } from "react";
import { WidgetShell } from "./WidgetShell";

const STAGES = ["IF", "ID", "EX", "MEM", "WB"] as const;
type Stage = (typeof STAGES)[number];

interface Instruction {
  text: string;
  rd?: string;
  rs?: string;
  rt?: string;
}

interface CellInfo {
  stage: Stage | "stall";
  hazard?: boolean;
  forward?: boolean;
}

function parseInstruction(line: string): Instruction {
  const trimmed = line.trim();
  const match = trimmed.match(/^(\w+)\s+(\w+)\s*,\s*(\w+)\s*,?\s*(\w+)?/);
  if (!match) return { text: trimmed };
  const [, , rd, rs, rt] = match;
  return { text: trimmed, rd, rs, rt };
}

function buildPipeline(instructions: Instruction[], forwarding: boolean): { grid: (CellInfo | null)[][]; totalCycles: number } {
  const n = instructions.length;
  if (n === 0) return { grid: [], totalCycles: 0 };

  const startCycle: number[] = [];
  const stalls: number[] = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    const baseStart = i === 0 ? 0 : startCycle[i - 1] + 1 + stalls[i - 1];
    let stallCount = 0;

    for (let j = 0; j < i; j++) {
      const prev = instructions[j];
      const curr = instructions[i];
      if (!prev.rd || (!curr.rs && !curr.rt)) continue;
      if (prev.rd !== curr.rs && prev.rd !== curr.rt) continue;

      const prevStart = startCycle[j] + stalls[j];
      const prevExEnd = prevStart + 3;
      const prevMemEnd = prevStart + 4;
      const currIdStart = baseStart + stallCount + 1;

      if (forwarding) {
        if (currIdStart < prevExEnd) {
          stallCount = Math.max(stallCount, prevExEnd - currIdStart);
        }
      } else {
        if (currIdStart < prevMemEnd + 1) {
          stallCount = Math.max(stallCount, prevMemEnd + 1 - currIdStart);
        }
      }
    }

    stalls[i] = stallCount;
    startCycle.push(baseStart);
  }

  const totalCycles = (startCycle[n - 1] + stalls[n - 1]) + STAGES.length;

  const grid: (CellInfo | null)[][] = [];
  for (let i = 0; i < n; i++) {
    const row: (CellInfo | null)[] = new Array(totalCycles).fill(null);
    const start = startCycle[i];

    for (let s = 0; s < stalls[i]; s++) {
      row[start + 1 + s] = { stage: "stall" };
    }

    for (let s = 0; s < STAGES.length; s++) {
      const cycle = start + stalls[i] + s;
      const hasHazard = s === 1 && stalls[i] > 0;
      const hasForward = forwarding && s === 2 && stalls[i] > 0;
      row[cycle] = { stage: STAGES[s], hazard: hasHazard, forward: hasForward };
    }

    grid.push(row);
  }

  return { grid, totalCycles };
}

const STAGE_COLORS: Record<Stage | "stall", string> = {
  IF: "bg-blue-400 text-white",
  ID: "bg-green-400 text-white",
  EX: "bg-yellow-400 text-white",
  MEM: "bg-purple-400 text-white",
  WB: "bg-orange-400 text-white",
  stall: "bg-muted text-muted-foreground",
};

const DEFAULT_CODE = `add x1, x2, x3
sub x4, x1, x5
and x6, x1, x4
or x7, x8, x9`;

export function PipelineBuilder() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [forwarding, setForwarding] = useState(false);

  const instructions = useMemo(
    () => code.split("\n").filter((l) => l.trim()).map(parseInstruction),
    [code]
  );

  const { grid, totalCycles } = useMemo(
    () => buildPipeline(instructions, forwarding),
    [instructions, forwarding]
  );

  return (
    <WidgetShell title="流水线时空图" description="输入指令序列，查看流水线执行过程和数据冒险">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="text-xs text-muted-foreground mb-1 block">指令序列（每行一条）</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={4}
              className="w-full bg-muted rounded-md px-3 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="add x1, x2, x3&#10;sub x4, x1, x5"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">转发</label>
            <div className="flex gap-1">
              <button
                onClick={() => setForwarding(false)}
                className={`px-2.5 py-1.5 text-xs rounded-md border transition-colors ${!forwarding ? "bg-[var(--subject-color)] text-white border-transparent" : "border-border hover:bg-muted"}`}
              >
                无转发
              </button>
              <button
                onClick={() => setForwarding(true)}
                className={`px-2.5 py-1.5 text-xs rounded-md border transition-colors ${forwarding ? "bg-[var(--subject-color)] text-white border-transparent" : "border-border hover:bg-muted"}`}
              >
                有转发
              </button>
            </div>
          </div>
        </div>

        {grid.length > 0 && (
          <div className="overflow-x-auto">
            <table className="text-[10px] font-mono border-collapse">
              <thead>
                <tr>
                  <th className="p-1 text-left text-muted-foreground font-normal min-w-[100px]">指令</th>
                  {Array.from({ length: totalCycles }).map((_, c) => (
                    <th key={c} className="p-1 text-center text-muted-foreground font-normal min-w-[28px]">
                      {c + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.map((row, i) => (
                  <tr key={i}>
                    <td className="p-1 text-xs truncate max-w-[120px]" title={instructions[i].text}>
                      {instructions[i].text}
                    </td>
                    {row.map((cell, c) => (
                      <td key={c} className="p-0.5 text-center">
                        {cell ? (
                          <span className={`inline-block w-full rounded px-1 py-0.5 text-[9px] font-semibold ${STAGE_COLORS[cell.stage]} ${cell.hazard ? "ring-1 ring-red-500" : ""} ${cell.forward ? "ring-1 ring-green-500" : ""}`}>
                            {cell.stage === "stall" ? "—" : cell.stage}
                          </span>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {grid.length > 0 && (
          <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
            {STAGES.map((s) => (
              <span key={s} className="flex items-center gap-1">
                <span className={`inline-block w-3 h-3 rounded ${STAGE_COLORS[s].split(" ")[0]}`} />
                {s}
              </span>
            ))}
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-muted ring-1 ring-red-500" />
              冒险
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-muted ring-1 ring-green-500" />
              转发
            </span>
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
