"use client";

import { useState, useMemo } from "react";
import { WidgetShell } from "./WidgetShell";

type Base = 2 | 8 | 10 | 16;
type BitWidth = 8 | 16 | 32;

const BASE_LABELS: Record<Base, string> = { 2: "二进制", 8: "八进制", 10: "十进制", 16: "十六进制" };

function parseInput(input: string, base: Base): number | null {
  if (!input.trim()) return null;
  const cleaned = input.trim().replace(/^0[xXoObB]/, "");
  const negative = cleaned.startsWith("-");
  const abs = negative ? cleaned.slice(1) : cleaned;
  const val = parseInt(abs, base);
  if (isNaN(val)) return null;
  return negative ? -val : val;
}

function getComplement(value: number, width: BitWidth) {
  const max = 1 << (width - 1);
  const inRange = value >= -max && value < max;
  if (!inRange) return null;

  if (value >= 0) {
    const bits = value.toString(2).padStart(width, "0");
    return { sign: "正数", original: bits, inverse: bits, complement: bits };
  }

  const abs = Math.abs(value);
  const original = "1" + abs.toString(2).padStart(width - 1, "0");
  const inverseBits = "1" + abs.toString(2).padStart(width - 1, "0").split("").map((b) => b === "0" ? "1" : "0").join("");
  const complementVal = ((1 << width) + value) >>> 0;
  const complement = complementVal.toString(2).padStart(width, "0");

  return { sign: "负数", original, inverse: inverseBits, complement };
}

export function BaseConverter() {
  const [input, setInput] = useState("13");
  const [fromBase, setFromBase] = useState<Base>(10);
  const [bitWidth, setBitWidth] = useState<BitWidth>(8);

  const value = useMemo(() => parseInput(input, fromBase), [input, fromBase]);

  const conversions = useMemo(() => {
    if (value === null) return null;
    return {
      bin: value >= 0 ? value.toString(2) : "-" + Math.abs(value).toString(2),
      oct: value >= 0 ? value.toString(8) : "-" + Math.abs(value).toString(8),
      dec: value.toString(10),
      hex: value >= 0 ? value.toString(16).toUpperCase() : "-" + Math.abs(value).toString(16).toUpperCase(),
    };
  }, [value]);

  const complement = useMemo(() => {
    if (value === null) return null;
    return getComplement(value, bitWidth);
  }, [value, bitWidth]);

  return (
    <WidgetShell title="进制转换器" description="输入数字实时转换，支持原码/反码/补码推导">
      <div className="space-y-4">
        {/* Input row */}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[120px]">
            <label className="text-xs text-muted-foreground mb-1 block">输入数值</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-muted rounded-md px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-ring"
              placeholder="输入数字..."
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">源进制</label>
            <div className="flex gap-1">
              {([2, 8, 10, 16] as Base[]).map((b) => (
                <button key={b} onClick={() => setFromBase(b)} className={`px-2.5 py-1.5 text-xs rounded-md border transition-colors ${fromBase === b ? "bg-[var(--subject-color)] text-white border-transparent" : "border-border hover:bg-muted"}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">位宽</label>
            <div className="flex gap-1">
              {([8, 16, 32] as BitWidth[]).map((w) => (
                <button key={w} onClick={() => setBitWidth(w)} className={`px-2.5 py-1.5 text-xs rounded-md border transition-colors ${bitWidth === w ? "bg-[var(--subject-color)] text-white border-transparent" : "border-border hover:bg-muted"}`}>
                  {w}位
                </button>
              ))}
            </div>
          </div>
        </div>

        {value === null && input.trim() && (
          <p className="text-xs text-destructive">无法解析输入（请检查是否符合{BASE_LABELS[fromBase]}格式）</p>
        )}

        {/* Conversion results */}
        {conversions && (
          <div className="grid grid-cols-2 gap-2">
            {([2, 8, 10, 16] as Base[]).map((b) => {
              const key = b === 2 ? "bin" : b === 8 ? "oct" : b === 10 ? "dec" : "hex";
              return (
                <div key={b} className={`rounded-md border p-2.5 ${b === fromBase ? "border-[var(--subject-color)]/50 bg-[var(--subject-color)]/5" : "border-border"}`}>
                  <span className="text-[10px] text-muted-foreground uppercase">{BASE_LABELS[b]}</span>
                  <p className="font-mono text-sm mt-0.5 break-all">{conversions[key]}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Complement representation */}
        {complement && (
          <div className="rounded-md border border-border p-3 space-y-2">
            <p className="text-xs font-medium">机器数表示（{bitWidth}位，{complement.sign}）</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-10 shrink-0">原码</span>
                <code className="text-xs font-mono tracking-wider">
                  <span className="text-red-500">{complement.original[0]}</span>
                  <span className="opacity-30 mx-px">|</span>
                  <span>{complement.original.slice(1)}</span>
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-10 shrink-0">反码</span>
                <code className="text-xs font-mono tracking-wider">
                  <span className="text-red-500">{complement.inverse[0]}</span>
                  <span className="opacity-30 mx-px">|</span>
                  <span>{complement.inverse.slice(1)}</span>
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-10 shrink-0">补码</span>
                <code className="text-xs font-mono tracking-wider">
                  <span className="text-blue-500">{complement.complement[0]}</span>
                  <span className="opacity-30 mx-px">|</span>
                  <span className="text-blue-500">{complement.complement.slice(1)}</span>
                </code>
              </div>
            </div>
          </div>
        )}

        {value !== null && !complement && (
          <p className="text-xs text-muted-foreground">值超出 {bitWidth} 位有符号整数范围（-{1 << (bitWidth - 1)} ~ {(1 << (bitWidth - 1)) - 1}）</p>
        )}
      </div>
    </WidgetShell>
  );
}
