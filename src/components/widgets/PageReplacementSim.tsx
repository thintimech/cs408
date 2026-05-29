"use client";

import { useState, useMemo } from "react";
import { WidgetShell } from "./WidgetShell";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";

type Algorithm = "FIFO" | "LRU" | "OPT";

interface FrameState {
  frames: (number | null)[];
  fault: boolean;
  replaced: number | null;
}

function simulate(refs: number[], frameCount: number, algo: Algorithm): FrameState[] {
  const states: FrameState[] = [];
  const frames: (number | null)[] = Array(frameCount).fill(null);
  const queue: number[] = []; // FIFO order or LRU order

  for (let i = 0; i < refs.length; i++) {
    const page = refs[i];
    const inFrames = frames.includes(page);

    if (inFrames) {
      if (algo === "LRU") {
        const idx = queue.indexOf(page);
        queue.splice(idx, 1);
        queue.push(page);
      }
      states.push({ frames: [...frames], fault: false, replaced: null });
      continue;
    }

    // Page fault
    const emptyIdx = frames.indexOf(null);
    let replaced: number | null = null;

    if (emptyIdx !== -1) {
      frames[emptyIdx] = page;
      queue.push(page);
    } else {
      let victimIdx: number;
      if (algo === "FIFO" || algo === "LRU") {
        const victim = queue.shift()!;
        victimIdx = frames.indexOf(victim);
        queue.push(page);
      } else {
        // OPT: replace the page used furthest in the future
        let farthest = -1;
        victimIdx = 0;
        for (let f = 0; f < frames.length; f++) {
          const nextUse = refs.indexOf(frames[f]!, i + 1);
          if (nextUse === -1) { victimIdx = f; break; }
          if (nextUse > farthest) { farthest = nextUse; victimIdx = f; }
        }
      }
      replaced = frames[victimIdx];
      frames[victimIdx] = page;
    }

    states.push({ frames: [...frames], fault: true, replaced });
  }

  return states;
}

export function PageReplacementSim() {
  const [refStr, setRefStr] = useState("7,0,1,2,0,3,0,4,2,3,0,3");
  const [frameCount, setFrameCount] = useState(3);
  const [algo, setAlgo] = useState<Algorithm>("FIFO");
  const [currentStep, setCurrentStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refs = useMemo(() => refStr.split(/[,\s]+/).map(Number).filter((n) => !isNaN(n)), [refStr]);
  const states = useMemo(() => simulate(refs, frameCount, algo), [refs, frameCount, algo]);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= states.length - 1) { setPlaying(false); return states.length - 1; }
        return s + 1;
      });
    }, 500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, states.length]);

  function reset() { setCurrentStep(-1); setPlaying(false); }

  const faults = states.slice(0, currentStep + 1).filter((s) => s.fault).length;
  const faultRate = currentStep >= 0 ? ((faults / (currentStep + 1)) * 100).toFixed(1) : "0";

  return (
    <WidgetShell title="页面置换模拟器" description="输入引用串，逐步观察 FIFO/LRU/OPT 算法的帧变化">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs text-muted-foreground mb-1 block">引用串（逗号分隔）</label>
            <input type="text" value={refStr} onChange={(e) => { setRefStr(e.target.value); reset(); }}
              className="w-full bg-muted rounded-md px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">帧数</label>
            <div className="flex gap-1">
              {[2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => { setFrameCount(n); reset(); }} className={`px-2.5 py-1.5 text-xs rounded-md border transition-colors ${frameCount === n ? "bg-[var(--subject-color)] text-white border-transparent" : "border-border hover:bg-muted"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">算法</label>
            <div className="flex gap-1">
              {(["FIFO", "LRU", "OPT"] as Algorithm[]).map((a) => (
                <button key={a} onClick={() => { setAlgo(a); reset(); }} className={`px-2.5 py-1.5 text-xs rounded-md border transition-colors ${algo === a ? "bg-[var(--subject-color)] text-white border-transparent" : "border-border hover:bg-muted"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button onClick={() => setPlaying(!playing)} className="p-1.5 rounded-md border border-border hover:bg-muted transition-colors">
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button onClick={() => { if (currentStep < states.length - 1) setCurrentStep(currentStep + 1); }} disabled={currentStep >= states.length - 1} className="p-1.5 rounded-md border border-border hover:bg-muted disabled:opacity-30 transition-colors">
            <SkipForward className="h-3.5 w-3.5" />
          </button>
          <button onClick={reset} className="p-1.5 rounded-md border border-border hover:bg-muted transition-colors">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs text-muted-foreground ml-2">
            缺页 {faults} 次 | 缺页率 {faultRate}%
          </span>
        </div>

        {/* Frame table */}
        {refs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="text-xs font-mono border-collapse">
              <thead>
                <tr>
                  <th className="p-1.5 text-left text-muted-foreground font-normal">页面</th>
                  {refs.map((r, i) => (
                    <th key={i} className={`p-1.5 text-center min-w-[28px] ${i === currentStep ? "bg-[var(--subject-color)]/10 font-bold" : ""} ${i <= currentStep && states[i]?.fault ? "text-red-500" : ""}`}>
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: frameCount }).map((_, f) => (
                  <tr key={f}>
                    <td className="p-1.5 text-muted-foreground">帧{f}</td>
                    {refs.map((_, i) => {
                      if (i > currentStep) return <td key={i} className="p-1.5 text-center border border-border/30">-</td>;
                      const val = states[i].frames[f];
                      const isNew = states[i].fault && states[i].frames[f] === refs[i];
                      return (
                        <td key={i} className={`p-1.5 text-center border border-border/30 ${i === currentStep ? "bg-[var(--subject-color)]/5" : ""} ${isNew ? "text-[var(--subject-color)] font-bold" : ""}`}>
                          {val ?? "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="p-1.5 text-muted-foreground">状态</td>
                  {refs.map((_, i) => {
                    if (i > currentStep) return <td key={i} className="p-1.5 text-center">-</td>;
                    return (
                      <td key={i} className={`p-1.5 text-center text-[10px] font-semibold ${states[i].fault ? "text-red-500" : "text-green-500"}`}>
                        {states[i].fault ? "缺" : "命中"}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
