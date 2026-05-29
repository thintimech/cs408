"use client";

import Link from "next/link";
import {
  List, Layers, GitBranch, Share2, Search, ArrowUpDown, BookOpen, Type,
  Cpu, Lock, AlertTriangle, HardDrive, FolderOpen, Monitor,
  Binary, Calculator, Database, FileCode, Network, Radio,
  Link2, Globe, ArrowLeftRight, AppWindow,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSubject } from "@/contexts/SubjectContext";
import { getProgress } from "@/lib/storage";
import { useEffect, useState } from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  List, Layers, GitBranch, Share2, Search, ArrowUpDown, Type,
  Cpu, Lock, AlertTriangle, HardDrive, FolderOpen, Monitor,
  Binary, Calculator, Database, FileCode, Network, Radio,
  Link2, Globe, ArrowLeftRight, AppWindow, BookOpen,
  Bus: ArrowLeftRight,
};

export default function SubjectHomePage() {
  const subject = useSubject();
  const [stats, setStats] = useState<Record<string, { total: number; completed: number }>>({});

  useEffect(() => {
    const progress = getProgress(subject.storageKey);
    const perChapter: Record<string, { total: number; completed: number }> = {};
    for (const chapter of subject.chapters) {
      const total = chapter.lessons.length;
      const completed = chapter.lessons.filter((l) => progress[l.id]?.completed).length;
      perChapter[chapter.id] = { total, completed };
    }
    setStats(perChapter);
  }, [subject]);

  const totalLessons = subject.chapters.reduce((sum, c) => sum + c.lessons.length, 0);
  const completedLessons = Object.values(stats).reduce((sum, s) => sum + s.completed, 0);
  const overallPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{subject.fullName}</h1>
        <p className="text-muted-foreground mt-1">{subject.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            学习进度
          </CardTitle>
          <CardDescription>
            已学完 {completedLessons} / {totalLessons} 节课
          </CardDescription>
          <Progress value={overallPercent} className="mt-2" />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subject.chapters.map((chapter) => {
          const Icon = iconMap[chapter.icon];
          const s = stats[chapter.id];
          const pct = s && s.total > 0 ? (s.completed / s.total) * 100 : 0;
          return (
            <Link key={chapter.id} href={`/${subject.id}/chapters/${chapter.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="h-5 w-5 text-primary" />}
                    <CardTitle className="text-base">{chapter.name}</CardTitle>
                  </div>
                  <CardDescription className="mt-1">{chapter.description}</CardDescription>
                  <p className="text-xs text-muted-foreground mt-2">
                    {chapter.lessons.length} 节课
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Progress value={pct} className="flex-1 h-1.5" />
                    <span>{s?.completed || 0}/{s?.total || 0}</span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
