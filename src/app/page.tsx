"use client";

import Link from "next/link";
import { subjects } from "@/data/subjects";
import { getProgress } from "@/lib/storage";
import { useEffect, useState } from "react";
import { BookOpen, Database, Cpu, Network, HardDrive, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const subjectIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  ds: Database,
  co: Cpu,
  cn: Network,
  os: HardDrive,
};

const subjectPatterns: Record<string, string> = {
  ds: "M10 10h4v4h-4zM20 10h4v4h-4zM15 20h4v4h-4zM10 10l5 10M20 10l-5 10",
  co: "M12 6v12M6 12h12M8 8l8 8M16 8l-8 8",
  cn: "M6 12h4M14 12h4M22 12h4M10 12a2 2 0 100-4 2 2 0 000 4zM18 12a2 2 0 100-4 2 2 0 000 4zM26 12a2 2 0 100-4 2 2 0 000 4z",
  os: "M6 6h20v16H6zM6 10h20M10 10v12M16 10v12",
};

export default function HomePage() {
  const [stats, setStats] = useState<Record<string, { total: number; completed: number }>>({});

  useEffect(() => {
    const s: Record<string, { total: number; completed: number }> = {};
    for (const [id, config] of Object.entries(subjects)) {
      const progress = getProgress(config.storageKey);
      const total = config.chapters.reduce((sum, c) => sum + c.lessons.length, 0);
      const completed = config.chapters
        .flatMap((c) => c.lessons)
        .filter((l) => progress[l.id]?.completed).length;
      s[id] = { total, completed };
    }
    setStats(s);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">考研 CS</h1>
          <p className="text-sm text-muted-foreground">计算机考研四科学习系统</p>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            选择科目
          </h2>
          <p className="text-sm text-muted-foreground mt-1">选择一个科目开始学习</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {Object.values(subjects).map((config) => {
            const Icon = subjectIcons[config.id];
            const s = stats[config.id];
            const pct = s && s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
            return (
              <Link key={config.id} href={`/${config.id}`}>
                <div
                  className="group relative overflow-hidden rounded-xl border border-border h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg p-5 cursor-pointer"
                  style={{ borderTopWidth: "3px", borderTopColor: `var(--subject-${config.id})` } as React.CSSProperties}
                >
                  {/* Background pattern */}
                  <svg className="absolute top-2 right-2 w-20 h-20 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d={subjectPatterns[config.id]} />
                  </svg>

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity"
                    style={{ background: `radial-gradient(ellipse at top right, var(--subject-${config.id}), transparent 70%)` } as React.CSSProperties}
                  />

                  <div className="relative space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `color-mix(in oklch, var(--subject-${config.id}) 15%, transparent)` } as React.CSSProperties}
                        >
                          <span style={{ color: `var(--subject-${config.id})` } as React.CSSProperties}>
                            <Icon className="h-5 w-5" />
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-base group-hover:text-foreground transition-colors">{config.name}</h3>
                        <p className="text-[11px] text-muted-foreground">{config.fullName}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">{config.description}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-muted">{config.chapters.length} 章</span>
                      <span className="px-2 py-0.5 rounded-full bg-muted">{s?.total || 0} 课时</span>
                      {(s?.completed ?? 0) > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">{s!.completed} 已完成</span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: `var(--subject-${config.id})` } as React.CSSProperties}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">{pct}% 完成</span>
                        <span className="text-[11px] text-muted-foreground group-hover:text-[var(--subject-color)] flex items-center gap-0.5 transition-colors">
                          进入学习 <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
