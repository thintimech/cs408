"use client";

import { useState, useMemo } from "react";
import { WidgetShell } from "./WidgetShell";
import { Plus, Trash2 } from "lucide-react";

type Algorithm = "FCFS" | "SJF" | "RR" | "Priority";

interface Process {
  id: string;
  arrival: number;
  burst: number;
  priority: number;
}

interface GanttBlock {
  pid: string;
  start: number;
  end: number;
}

interface ProcessResult {
  id: string;
  turnaround: number;
  waiting: number;
  response: number;
}

function schedule(processes: Process[], algo: Algorithm, quantum: number): { gantt: GanttBlock[]; results: ProcessResult[] } {
  const procs = processes.map((p) => ({ ...p, remaining: p.burst, started: -1 }));
  const gantt: GanttBlock[] = [];
  let time = 0;
  const completed: { id: string; finish: number; start: number }[] = [];

  if (algo === "FCFS") {
    const sorted = [...procs].sort((a, b) => a.arrival - b.arrival);
    for (const p of sorted) {
      if (time < p.arrival) time = p.arrival;
      gantt.push({ pid: p.id, start: time, end: time + p.burst });
      completed.push({ id: p.id, finish: time + p.burst, start: time });
      time += p.burst;
    }
  } else if (algo === "SJF") {
    const remaining = [...procs];
    while (remaining.length > 0) {
      const available = remaining.filter((p) => p.arrival <= time);
      if (available.length === 0) { time = Math.min(...remaining.map((p) => p.arrival)); continue; }
      available.sort((a, b) => a.burst - b.burst);
      const p = available[0];
      gantt.push({ pid: p.id, start: time, end: time + p.burst });
      completed.push({ id: p.id, finish: time + p.burst, start: time });
      time += p.burst;
      remaining.splice(remaining.indexOf(p), 1);
    }
  } else if (algo === "RR") {
    const queue: typeof procs[0][] = [];
    const remaining = [...procs].sort((a, b) => a.arrival - b.arrival);
    let idx = 0;
    while (idx < remaining.length && remaining[idx].arrival <= time) { queue.push(remaining[idx]); idx++; }
    while (queue.length > 0 || idx < remaining.length) {
      if (queue.length === 0) { time = remaining[idx].arrival; while (idx < remaining.length && remaining[idx].arrival <= time) { queue.push(remaining[idx]); idx++; } }
      const p = queue.shift()!;
      if (p.started === -1) p.started = time;
      const run = Math.min(quantum, p.remaining);
      gantt.push({ pid: p.id, start: time, end: time + run });
      time += run;
      p.remaining -= run;
      while (idx < remaining.length && remaining[idx].arrival <= time) { queue.push(remaining[idx]); idx++; }
      if (p.remaining > 0) { queue.push(p); } else { completed.push({ id: p.id, finish: time, start: p.started }); }
    }
  } else {
    const remaining = [...procs];
    while (remaining.length > 0) {
      const available = remaining.filter((p) => p.arrival <= time);
      if (available.length === 0) { time = Math.min(...remaining.map((p) => p.arrival)); continue; }
      available.sort((a, b) => a.priority - b.priority);
      const p = available[0];
      gantt.push({ pid: p.id, start: time, end: time + p.burst });
      completed.push({ id: p.id, finish: time + p.burst, start: time });
      time += p.burst;
      remaining.splice(remaining.indexOf(p), 1);
    }
  }

  const results: ProcessResult[] = processes.map((p) => {
    const c = completed.find((x) => x.id === p.id)!;
    return { id: p.id, turnaround: c.finish - p.arrival, waiting: c.finish - p.arrival - p.burst, response: c.start - p.arrival };
  });

  return { gantt, results };
}

const COLORS = ["bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-cyan-400", "bg-red-400"];

export function SchedulingSim() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: "P1", arrival: 0, burst: 4, priority: 2 },
    { id: "P2", arrival: 1, burst: 3, priority: 1 },
    { id: "P3", arrival: 2, burst: 1, priority: 3 },
    { id: "P4", arrival: 3, burst: 5, priority: 4 },
  ]);
  const [algo, setAlgo] = useState<Algorithm>("FCFS");
  const [quantum, setQuantum] = useState(2);

  const { gantt, results } = useMemo(() => schedule(processes, algo, quantum), [processes, algo, quantum]);
  const totalTime = gantt.length > 0 ? gantt[gantt.length - 1].end : 0;
  const avgTurnaround = results.length > 0 ? (results.reduce((s, r) => s + r.turnaround, 0) / results.length).toFixed(2) : "0";
  const avgWaiting = results.length > 0 ? (results.reduce((s, r) => s + r.waiting, 0) / results.length).toFixed(2) : "0";

  function addProcess() {
    const id = `P${processes.length + 1}`;
    setProcesses([...processes, { id, arrival: 0, burst: 2, priority: processes.length + 1 }]);
  }

  function removeProcess(idx: number) {
    setProcesses(processes.filter((_, i) => i !== idx));
  }

  function updateProcess(idx: number, field: keyof Process, value: string) {
    const next = [...processes];
    if (field === "id") next[idx] = { ...next[idx], id: value };
    else next[idx] = { ...next[idx], [field]: Math.max(0, Number(value)) };
    setProcesses(next);
  }

  return (
    <WidgetShell title="进程调度模拟器" description="配置进程参数，实时查看 Gantt 图和调度指标">
      <div className="space-y-4">
        {/* Algorithm selection */}
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">调度算法</label>
            <div className="flex gap-1">
              {(["FCFS", "SJF", "RR", "Priority"] as Algorithm[]).map((a) => (
                <button key={a} onClick={() => setAlgo(a)} className={`px-2.5 py-1.5 text-xs rounded-md border transition-colors ${algo === a ? "bg-[var(--subject-color)] text-white border-transparent" : "border-border hover:bg-muted"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          {algo === "RR" && (
            <div className="w-20">
              <label className="text-xs text-muted-foreground mb-1 block">时间片</label>
              <input type="number" min={1} value={quantum} onChange={(e) => setQuantum(Math.max(1, Number(e.target.value)))}
                className="w-full bg-muted rounded-md px-2 py-1.5 text-sm font-mono outline-none focus:ring-2 focus:ring-ring" />
            </div>
          )}
        </div>

        {/* Process table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="p-1.5 text-left font-medium">进程</th>
                <th className="p-1.5 text-left font-medium">到达时间</th>
                <th className="p-1.5 text-left font-medium">服务时间</th>
                {algo === "Priority" && <th className="p-1.5 text-left font-medium">优先级</th>}
                <th className="p-1.5 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="p-1"><input type="text" value={p.id} onChange={(e) => updateProcess(i, "id", e.target.value)} className="w-12 bg-muted rounded px-1.5 py-1 font-mono" /></td>
                  <td className="p-1"><input type="number" min={0} value={p.arrival} onChange={(e) => updateProcess(i, "arrival", e.target.value)} className="w-14 bg-muted rounded px-1.5 py-1 font-mono" /></td>
                  <td className="p-1"><input type="number" min={1} value={p.burst} onChange={(e) => updateProcess(i, "burst", e.target.value)} className="w-14 bg-muted rounded px-1.5 py-1 font-mono" /></td>
                  {algo === "Priority" && <td className="p-1"><input type="number" min={1} value={p.priority} onChange={(e) => updateProcess(i, "priority", e.target.value)} className="w-14 bg-muted rounded px-1.5 py-1 font-mono" /></td>}
                  <td className="p-1"><button onClick={() => removeProcess(i)} className="p-1 hover:text-destructive"><Trash2 className="h-3 w-3" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addProcess} className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Plus className="h-3 w-3" />添加进程
          </button>
        </div>

        {/* Gantt chart */}
        {gantt.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium">Gantt 图</p>
            <div className="flex h-8 rounded-md overflow-hidden border border-border">
              {gantt.map((block, i) => {
                const width = ((block.end - block.start) / totalTime) * 100;
                const colorIdx = processes.findIndex((p) => p.id === block.pid);
                return (
                  <div key={i} className={`${COLORS[colorIdx % COLORS.length]} flex items-center justify-center text-[10px] font-medium text-white border-r border-white/30 last:border-r-0`}
                    style={{ width: `${width}%` }} title={`${block.pid}: ${block.start}-${block.end}`}>
                    {width > 5 ? block.pid : ""}
                  </div>
                );
              })}
            </div>
            <div className="flex text-[10px] text-muted-foreground font-mono">
              <span>0</span>
              <span className="ml-auto">{totalTime}</span>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border">
                <th className="p-1.5 text-left font-medium">进程</th>
                <th className="p-1.5 text-left font-medium">周转时间</th>
                <th className="p-1.5 text-left font-medium">等待时间</th>
                <th className="p-1.5 text-left font-medium">响应时间</th>
              </tr></thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id} className="border-b border-border/50">
                    <td className="p-1.5 font-mono">{r.id}</td>
                    <td className="p-1.5 font-mono">{r.turnaround}</td>
                    <td className="p-1.5 font-mono">{r.waiting}</td>
                    <td className="p-1.5 font-mono">{r.response}</td>
                  </tr>
                ))}
                <tr className="font-medium">
                  <td className="p-1.5">平均</td>
                  <td className="p-1.5 font-mono">{avgTurnaround}</td>
                  <td className="p-1.5 font-mono">{avgWaiting}</td>
                  <td className="p-1.5">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
