"use client";

import { useState, useMemo } from "react";
import { WidgetShell } from "./WidgetShell";

function ipToNum(ip: string): number | null {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return null;
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function numToIp(num: number): string {
  return [(num >>> 24) & 0xff, (num >>> 16) & 0xff, (num >>> 8) & 0xff, num & 0xff].join(".");
}

function numToBin(num: number): string {
  return [(num >>> 24) & 0xff, (num >>> 16) & 0xff, (num >>> 8) & 0xff, num & 0xff]
    .map((b) => b.toString(2).padStart(8, "0")).join(".");
}

export function SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.100");
  const [prefix, setPrefix] = useState(24);

  const result = useMemo(() => {
    const ipNum = ipToNum(ip);
    if (ipNum === null || prefix < 0 || prefix > 32) return null;

    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    const network = (ipNum & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const hostCount = Math.max(0, (1 << (32 - prefix)) - 2);
    const firstHost = prefix < 31 ? network + 1 : network;
    const lastHost = prefix < 31 ? broadcast - 1 : broadcast;

    return { mask, network, broadcast, hostCount, firstHost, lastHost };
  }, [ip, prefix]);

  return (
    <WidgetShell title="子网计算器" description="输入 IP 地址和前缀长度，实时计算子网信息">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs text-muted-foreground mb-1 block">IP 地址</label>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full bg-muted rounded-md px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-ring"
              placeholder="192.168.1.0"
            />
          </div>
          <div className="w-24">
            <label className="text-xs text-muted-foreground mb-1 block">前缀 /{prefix}</label>
            <input
              type="range"
              min={0}
              max={32}
              value={prefix}
              onChange={(e) => setPrefix(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            {/* Binary visualization */}
            <div className="rounded-md border border-border p-3 overflow-x-auto">
              <p className="text-[10px] text-muted-foreground mb-1">地址位分解</p>
              <div className="font-mono text-xs flex flex-wrap">
                {numToBin(ipToNum(ip)!).split("").map((ch, i) => {
                  const bitIdx = i - Math.floor(i / 9);
                  const isNetwork = bitIdx < prefix;
                  if (ch === ".") return <span key={i} className="opacity-30 mx-0.5">.</span>;
                  return (
                    <span key={i} className={isNetwork ? "text-[var(--subject-color)] font-semibold" : "text-muted-foreground"}>
                      {ch}
                    </span>
                  );
                })}
              </div>
              <div className="flex mt-1 text-[10px]">
                <span className="text-[var(--subject-color)]">← 网络位 ({prefix}) →</span>
                <span className="ml-auto text-muted-foreground">← 主机位 ({32 - prefix}) →</span>
              </div>
            </div>

            {/* Results table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="rounded-md border border-border p-2.5">
                <span className="text-[10px] text-muted-foreground">子网掩码</span>
                <p className="font-mono mt-0.5">{numToIp(result.mask)}</p>
              </div>
              <div className="rounded-md border border-border p-2.5">
                <span className="text-[10px] text-muted-foreground">网络地址</span>
                <p className="font-mono mt-0.5">{numToIp(result.network)}</p>
              </div>
              <div className="rounded-md border border-border p-2.5">
                <span className="text-[10px] text-muted-foreground">广播地址</span>
                <p className="font-mono mt-0.5">{numToIp(result.broadcast)}</p>
              </div>
              <div className="rounded-md border border-border p-2.5">
                <span className="text-[10px] text-muted-foreground">可用主机数</span>
                <p className="font-mono mt-0.5">{result.hostCount}</p>
              </div>
              <div className="rounded-md border border-border p-2.5 sm:col-span-2">
                <span className="text-[10px] text-muted-foreground">可用主机范围</span>
                <p className="font-mono mt-0.5">{numToIp(result.firstHost)} ~ {numToIp(result.lastHost)}</p>
              </div>
            </div>
          </div>
        )}

        {!result && ip.trim() && (
          <p className="text-xs text-destructive">请输入有效的 IP 地址（如 192.168.1.0）</p>
        )}
      </div>
    </WidgetShell>
  );
}
