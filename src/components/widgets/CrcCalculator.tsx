"use client";

import { useState, useMemo } from "react";
import { WidgetShell } from "./WidgetShell";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";

interface DivisionStep {
  dividend: string;
  divisor: string;
  position: number;
  result: string;
}

function computeCrc(data: string, generator: string): { steps: DivisionStep[]; fcs: string; frame: string } {
  const r = generator.length - 1;
  const padded = data + "0".repeat(r);
  const bits = padded.split("");
  const gen = generator.split("");
  const steps: DivisionStep[] = [];

  let pos = 0;
  while (pos <= bits.length - gen.length) {
    const segment = bits.slice(pos, pos + gen.length).join("");
    if (bits[pos] === "1") {
      const result: string[] = [];
      for (let i = 0; i < gen.length; i++) {
        result.push(bits[pos + i] === gen[i] ? "0" : "1");
      }
      steps.push({ dividend: segment, divisor: generator, position: pos, result: result.join("") });
      for (let i = 0; i < gen.length; i++) {
        bits[pos + i] = result[i];
      }
    } else {
      steps.push({ dividend: segment, divisor: "0".repeat(gen.length), position: pos, result: segment });
    }
    pos++;
  }

  const fcs = bits.slice(bits.length - r).join("");
  return { steps, fcs, frame: data + fcs };
}

export function CrcCalculator() {
  const [data, setData] = useState("101001");
  const [generator, setGenerator] = useState("1011");
  const [currentStep, setCurrentStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const result = useMemo(() => {
    if (!/^[01]+$/.test(data) || !/^[01]+$/.test(generator) || generator.length < 2) return null;
    if (generator[0] !== "1") return null;
    return computeCrc(data, generator);
  }, [data, generator]);

  const totalSteps = result?.steps.length ?? 0;

  useEffect(() => {
    if (!playing || !result) return;
    timerRef.current = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= totalSteps - 1) { setPlaying(false); return totalSteps - 1; }
        return s + 1;
      });
    }, 400);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, result, totalSteps]);

  function reset() { setCurrentStep(-1); setPlaying(false); }
  function stepForward() { if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1); }

  return (
    <WidgetShell title="CRC 校验计算器" description="输入数据和生成多项式，逐步演示模 2 除法">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[100px]">
            <label className="text-xs text-muted-foreground mb-1 block">数据位串</label>
            <input type="text" value={data} onChange={(e) => { setData(e.target.value.replace(/[^01]/g, "")); reset(); }}
              className="w-full bg-muted rounded-md px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-ring" placeholder="101001" />
          </div>
          <div className="w-32">
            <label className="text-xs text-muted-foreground mb-1 block">生成多项式</label>
            <input type="text" value={generator} onChange={(e) => { setGenerator(e.target.value.replace(/[^01]/g, "")); reset(); }}
              className="w-full bg-muted rounded-md px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-ring" placeholder="1011" />
          </div>
        </div>

        {result && (
          <>
            {/* Controls */}
            <div className="flex items-center gap-2">
              <button onClick={() => setPlaying(!playing)} className="p-1.5 rounded-md border border-border hover:bg-muted transition-colors">
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
              <button onClick={stepForward} disabled={currentStep >= totalSteps - 1} className="p-1.5 rounded-md border border-border hover:bg-muted disabled:opacity-30 transition-colors">
                <SkipForward className="h-3.5 w-3.5" />
              </button>
              <button onClick={reset} className="p-1.5 rounded-md border border-border hover:bg-muted transition-colors">
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs text-muted-foreground ml-2">
                {currentStep < 0 ? "就绪" : `步骤 ${currentStep + 1}/${totalSteps}`}
              </span>
            </div>

            {/* Division visualization */}
            <div className="rounded-md border border-border p-3 font-mono text-xs overflow-x-auto space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <span>被除数: {data}{"0".repeat(generator.length - 1)}</span>
                <span>÷</span>
                <span>除数: {generator}</span>
              </div>
              {result.steps.slice(0, currentStep + 1).map((step, i) => (
                <div key={i} className={`flex items-center gap-1 ${i === currentStep ? "text-[var(--subject-color)] font-semibold" : "text-foreground/70"}`}>
                  <span className="w-6 text-[10px] text-muted-foreground">{i + 1}.</span>
                  <span style={{ paddingLeft: `${step.position * 0.55}em` }}>
                    {step.dividend} ⊕ {step.divisor} = {step.result}
                  </span>
                </div>
              ))}
            </div>

            {/* Result */}
            {currentStep >= totalSteps - 1 && (
              <div className="rounded-md border border-[var(--subject-color)]/30 bg-[var(--subject-color)]/5 p-3 space-y-1">
                <p className="text-xs"><span className="text-muted-foreground">FCS (余数)：</span><span className="font-mono font-semibold">{result.fcs}</span></p>
                <p className="text-xs"><span className="text-muted-foreground">发送帧：</span><span className="font-mono">{data} <span className="font-semibold text-[var(--subject-color)]">{result.fcs}</span></span></p>
              </div>
            )}
          </>
        )}

        {!result && data.trim() && generator.trim() && (
          <p className="text-xs text-destructive">请输入有效的二进制串（生成多项式首位必须为 1）</p>
        )}
      </div>
    </WidgetShell>
  );
}
