"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getLessonProgress } from "@/lib/storage";
import { useSubject } from "@/contexts/SubjectContext";
import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, FileText } from "lucide-react";
import { LessonProgress } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function ChapterPage() {
  const params = useParams();
  const subject = useSubject();
  const chapterId = params.chapterId as string;
  const chapter = subject.chapters.find((c) => c.id === chapterId);
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});

  useEffect(() => {
    if (!chapter) return;
    const p: Record<string, LessonProgress> = {};
    for (const lesson of chapter.lessons) {
      p[lesson.id] = getLessonProgress(subject.storageKey, lesson.id);
    }
    setProgress(p);
  }, [chapter, subject.storageKey]);

  if (!chapter) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">未找到该章节</p>
      </div>
    );
  }

  const completedCount = chapter.lessons.filter((l) => progress[l.id]?.completed).length;
  const totalCount = chapter.lessons.length;
  const chapterProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">{chapter.name}</h1>
        <p className="text-muted-foreground">{chapter.description}</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden max-w-xs">
            <div
              className="h-full rounded-full bg-[var(--subject-color)] transition-all duration-500"
              style={{ width: `${chapterProgress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{completedCount}/{totalCount} 课时</span>
        </div>
      </div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={containerVariants} initial="hidden" animate="show">
        {chapter.lessons.map((lesson, index) => {
          const lp = progress[lesson.id];
          const isCompleted = lp?.completed;
          const sectionsRead = lp?.sectionsRead?.length ?? 0;
          const totalSections = lesson.sections.length;
          const lessonPct = totalSections > 0 ? Math.round((sectionsRead / totalSections) * 100) : 0;

          return (
            <motion.div key={lesson.id} variants={cardVariants}>
            <Link href={`/${subject.id}/lessons/${lesson.id}`}>
              <div className={cn(
                "group rounded-lg border p-4 h-full transition-all hover:shadow-md hover:border-[var(--subject-color)]/50",
                isCompleted ? "border-green-500/30 bg-green-500/5" : "border-border"
              )}>
                <div className="flex items-start justify-between mb-2">
                  <div className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                    isCompleted
                      ? "bg-green-500/20 text-green-500"
                      : "bg-[var(--subject-color)]/10 text-[var(--subject-color)]"
                  )}>
                    {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
                  </div>
                  {isCompleted && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 font-medium">已完成</span>
                  )}
                </div>

                <h3 className="font-medium text-sm group-hover:text-[var(--subject-color)] transition-colors mb-1">
                  {lesson.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{lesson.brief}</p>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />{totalSections} 节
                  </span>
                  {lesson.exercises && lesson.exercises.length > 0 && (
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />{lesson.exercises.length} 题
                    </span>
                  )}
                </div>

                {!isCompleted && lessonPct > 0 && (
                  <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--subject-color)]/60 transition-all" style={{ width: `${lessonPct}%` }} />
                  </div>
                )}
              </div>
            </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
