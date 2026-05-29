"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  List,
  Layers,
  GitBranch,
  Share2,
  Search,
  ArrowUpDown,
  MessageSquare,
  Home,
  Type,
  Menu,
  X,
  Wrench,
  Cpu,
  Lock,
  AlertTriangle,
  HardDrive,
  FolderOpen,
  Monitor,
  Binary,
  Calculator,
  Database,
  FileCode,
  Network,
  Radio,
  Link2,
  Globe,
  ArrowLeftRight,
  AppWindow,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubject } from "@/contexts/SubjectContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getProgress } from "@/lib/storage";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  List, Layers, GitBranch, Share2, Search, ArrowUpDown, Type,
  Cpu, Lock, AlertTriangle, HardDrive, FolderOpen, Monitor,
  Binary, Calculator, Database, FileCode, Network, Radio,
  Link2, Globe, ArrowLeftRight, AppWindow, BookOpen,
  Bus: ArrowLeftRight,
};

export function SubjectSidebar() {
  const pathname = usePathname();
  const subject = useSubject();
  const [open, setOpen] = useState(false);
  const [chapterProgress, setChapterProgress] = useState<Record<string, { done: number; total: number }>>({});

  useEffect(() => {
    const progress = getProgress(subject.storageKey);
    const cp: Record<string, { done: number; total: number }> = {};
    for (const chapter of subject.chapters) {
      const total = chapter.lessons.length;
      const done = chapter.lessons.filter((l) => progress[l.id]?.completed).length;
      cp[chapter.id] = { done, total };
    }
    setChapterProgress(cp);
  }, [subject, pathname]);

  const basePath = `/${subject.id}`;

  const nav = (
    <>
      <div className="p-4 border-b border-border">
        <Link href={basePath} onClick={() => setOpen(false)}>
          <h1 className="text-lg font-bold tracking-tight">{subject.name}</h1>
          <p className="text-xs text-muted-foreground">{subject.fullName}</p>
        </Link>
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-xs text-muted-foreground hover:text-foreground mt-1 inline-block"
        >
          ← 切换科目
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-auto">
        <Link
          href={basePath}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
            pathname === basePath
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <Home className="h-4 w-4 shrink-0" />
          首页
        </Link>

        <div className="pt-3 pb-1 px-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            章节
          </span>
        </div>

        {subject.chapters.map((chapter) => {
          const Icon = iconMap[chapter.icon];
          const isActive = pathname.startsWith(`${basePath}/chapters/${chapter.id}`) ||
            chapter.lessons.some((l) => pathname.includes(l.id));
          const cp = chapterProgress[chapter.id];
          const progressStatus = !cp || cp.done === 0 ? "none" : cp.done === cp.total ? "done" : "partial";
          return (
            <Link
              key={chapter.id}
              href={`${basePath}/chapters/${chapter.id}`}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              <span className="flex-1 truncate">{chapter.name}</span>
              <span className={cn(
                "h-2 w-2 rounded-full shrink-0",
                progressStatus === "done" ? "bg-green-500" :
                progressStatus === "partial" ? "bg-[var(--subject-color)]" :
                "bg-border"
              )} />
            </Link>
          );
        })}

        <div className="pt-3 pb-1 px-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            工具
          </span>
        </div>

        <Link
          href={`${basePath}/chat`}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
            pathname === `${basePath}/chat`
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <MessageSquare className="h-4 w-4 shrink-0" />
          AI 自由问答
        </Link>

        <Link
          href={`${basePath}/tools`}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
            pathname === `${basePath}/tools`
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <Wrench className="h-4 w-4 shrink-0" />
          互动工具
        </Link>

        <Link
          href={`${basePath}/exam`}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
            pathname === `${basePath}/exam`
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <BookOpen className="h-4 w-4 shrink-0" />
          模拟考试
        </Link>
      </nav>
      <div className="p-3 border-t border-border">
        <ThemeToggle />
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 left-3 z-50 p-2 rounded-md bg-background border border-border md:hidden"
        aria-label="打开菜单"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside
            className="absolute left-0 top-0 w-60 h-full bg-sidebar flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-1 rounded hover:bg-muted"
              aria-label="关闭菜单"
            >
              <X className="h-4 w-4" />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <aside className="hidden md:flex w-60 border-r border-border bg-sidebar flex-col h-screen sticky top-0">
        {nav}
      </aside>
    </>
  );
}
