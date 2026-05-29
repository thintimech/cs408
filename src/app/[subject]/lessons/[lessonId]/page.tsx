"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { useSubject } from "@/contexts/SubjectContext";
import { markSectionRead, markLessonCompleted, getLessonProgress } from "@/lib/storage";
import { LessonSection, AlgorithmStep } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/CodeBlock";
import { StateRenderer } from "@/components/state-renderers";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import {
  CheckCircle2, Lightbulb, BookOpen, Code, GitCompare, AlertTriangle,
  Play, MessageSquare, ChevronLeft, ChevronRight,
} from "lucide-react";
import { InlineChatPanel } from "@/components/chat/InlineChatPanel";
import { cn } from "@/lib/utils";

const sectionIcon: Record<LessonSection["type"], React.ComponentType<{ className?: string }>> = {
  motivation: Lightbulb,
  concept: BookOpen,
  walkthrough: Play,
  detail: Code,
  comparison: GitCompare,
  practice: AlertTriangle,
};

function WalkthroughSteps({ steps }: { steps: AlgorithmStep[] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);
  const step = steps[currentStep];
  const prevStep = currentStep > 0 ? steps[currentStep - 1] : undefined;

  useEffect(() => {
    if (!playing) return;
    if (currentStep >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), speed);
    return () => clearTimeout(timer);
  }, [playing, currentStep, steps.length, speed]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowRight" && currentStep < steps.length - 1) {
      e.preventDefault();
      setCurrentStep((s) => s + 1);
    } else if (e.key === "ArrowLeft" && currentStep > 0) {
      e.preventDefault();
      setCurrentStep((s) => s - 1);
    } else if (e.key === " ") {
      e.preventDefault();
      setPlaying((p) => !p);
    }
  }, [currentStep, steps.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div ref={containerRef} tabIndex={0} className="space-y-3 border border-border rounded-lg p-4 bg-muted/30 outline-none focus:ring-1 focus:ring-primary/30">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">步骤 {currentStep + 1} / {steps.length}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPlaying(!playing)}
            className="px-3 py-1 text-xs rounded bg-secondary hover:bg-secondary/80"
            aria-label={playing ? "暂停" : "自动播放"}
          >
            {playing ? "⏸" : "▶"}
          </button>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="text-xs bg-secondary rounded px-1 py-1 border-none"
          >
            <option value={1200}>慢</option>
            <option value={800}>中</option>
            <option value={400}>快</option>
          </select>
          <button onClick={() => { setCurrentStep(0); setPlaying(false); }} disabled={currentStep === 0} className="px-3 py-1 text-xs rounded bg-secondary hover:bg-secondary/80 disabled:opacity-30" aria-label="回到第一步">⟲</button>
          <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0 || playing} className="px-3 py-1 text-xs rounded bg-secondary hover:bg-secondary/80 disabled:opacity-30" aria-label="上一步">上一步</button>
          <button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} disabled={currentStep === steps.length - 1 || playing} className="px-3 py-1 text-xs rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30" aria-label="下一步">下一步</button>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-1 rounded-full bg-border overflow-hidden">
        <div
          className="h-full bg-primary/70 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
      <p className="text-sm leading-relaxed">{step.description}</p>
      {step.pseudocode && <pre className="text-xs bg-background p-3 rounded border border-border overflow-x-auto font-mono leading-5">{step.pseudocode}</pre>}
      {step.state && <StateRenderer state={step.state} prevState={prevStep?.state} />}
    </div>
  );
}

function SectionContent({ section }: { section: LessonSection }) {
  const Icon = sectionIcon[section.type];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-semibold">{section.title}</h2>
      </div>
      <div className="space-y-4 text-sm leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="text-foreground/90 mb-3">{children}</p>,
            h3: ({ children }) => <h3 className="text-base font-semibold mt-4 mb-2">{children}</h3>,
            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
            code: ({ children, className }) => {
              if (className || (typeof children === "string" && children.includes("\n"))) {
                const codeStr = String(children).replace(/\n$/, "");
                return <CodeBlock code={codeStr} />;
              }
              return <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">{children}</code>;
            },
            pre: ({ children }) => <>{children}</>,
            blockquote: ({ children }) => <blockquote className="border-l-2 border-primary pl-4 my-3 text-muted-foreground italic">{children}</blockquote>,
            ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>,
            li: ({ children }) => <li className="text-foreground/90">{children}</li>,
            table: ({ children }) => <div className="overflow-x-auto my-3"><table className="w-full text-xs border-collapse">{children}</table></div>,
            thead: ({ children }) => <thead className="border-b border-border">{children}</thead>,
            th: ({ children }) => <th className="text-left p-2 font-medium">{children}</th>,
            td: ({ children }) => <td className="p-2 border-b border-border/50">{children}</td>,
            a: ({ children, href }) => <a href={href} className="text-primary underline underline-offset-2">{children}</a>,
          }}
        >
          {section.content}
        </ReactMarkdown>
      </div>
      {section.steps && <WalkthroughSteps steps={section.steps} />}
    </div>
  );
}



export default function LessonPage() {
  const params = useParams();
  const subject = useSubject();
  const lessonId = params.lessonId as string;
  const [showChat, setShowChat] = useState(false);
  const [readSections, setReadSections] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState(0);

  const allLessons = useMemo(() => subject.chapters.flatMap((c) => c.lessons), [subject]);
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const lesson = allLessons.find((l) => l.id === lessonId);

  useEffect(() => {
    if (!lesson) return;
    const progress = getLessonProgress(subject.storageKey, lesson.id);
    setReadSections(progress.sectionsRead);
  }, [lesson, subject.storageKey]);

  useEffect(() => {
    setActiveSection(0);
  }, [lessonId]);

  if (!lesson) {
    return <div className="p-8"><p className="text-muted-foreground">未找到该课程</p></div>;
  }

  function handleSectionVisible(sectionId: string) {
    if (!readSections.includes(sectionId)) {
      markSectionRead(subject.storageKey, lessonId, sectionId);
      setReadSections((prev) => [...prev, sectionId]);
    }
  }

  function handleComplete() {
    markLessonCompleted(subject.storageKey, lessonId);
  }

  function goToSection(idx: number) {
    setActiveSection(idx);
    handleSectionVisible(lesson!.sections[idx].id);
  }

  const allRead = lesson.sections.every((s) => readSections.includes(s.id));
  const currentChapter = subject.chapters.find((c) => c.lessons.some((l) => l.id === lessonId));
  const section = lesson.sections[activeSection];

  return (
    <div className="relative h-dvh">
      <div className="h-full overflow-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {currentChapter && (
            <Link href={`/${subject.id}/chapters/${currentChapter.id}`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-3 w-3" />{currentChapter.name}
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
            <p className="text-muted-foreground mt-1">{lesson.brief}</p>
          </div>

          {/* Pedagogical aids */}
          {(lesson.analogy || lesson.prerequisites?.length || lesson.commonMistakes?.length) && (
            <div className="space-y-2">
              {lesson.analogy && (
                <div className="flex items-start gap-2 rounded-lg bg-[var(--subject-color)]/5 border border-[var(--subject-color)]/20 px-4 py-3">
                  <Lightbulb className="h-4 w-4 text-[var(--subject-color)] shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80">{lesson.analogy}</p>
                </div>
              )}
              {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                <div className="flex items-start gap-2 rounded-lg bg-muted px-4 py-3">
                  <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">前置知识：</span>
                    {lesson.prerequisites.join("、")}
                  </div>
                </div>
              )}
              {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
                <details className="rounded-lg bg-red-500/5 border border-red-500/20 px-4 py-3">
                  <summary className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 cursor-pointer">
                    <AlertTriangle className="h-3.5 w-3.5" />常见误区（点击展开）
                  </summary>
                  <ul className="mt-2 space-y-1 text-xs text-foreground/70 pl-6 list-disc">
                    {lesson.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </details>
              )}
            </div>
          )}

          {/* Timeline + Content */}
          <div className="flex gap-6">
            {/* Timeline nav */}
            <nav className="hidden md:flex flex-col items-center shrink-0 pt-1">
              {lesson.sections.map((s, i) => {
                const isRead = readSections.includes(s.id);
                const isActive = i === activeSection;
                return (
                  <div key={s.id} className="flex flex-col items-center">
                    <button
                      onClick={() => goToSection(i)}
                      aria-label={`${s.title}${isRead ? "（已读）" : ""}`}
                      className={cn(
                        "w-3.5 h-3.5 rounded-full border-2 transition-all relative z-10",
                        isActive
                          ? "border-[var(--subject-color)] bg-[var(--subject-color)] scale-125"
                          : isRead
                            ? "border-green-500 bg-green-500"
                            : "border-border bg-background hover:border-[var(--subject-color)]"
                      )}
                      title={s.title}
                    />
                    {i < lesson.sections.length - 1 && (
                      <div className={cn(
                        "w-0.5 h-8 transition-colors",
                        isRead ? "bg-green-500/50" : "bg-border"
                      )} />
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Section content with animation */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <SectionContent section={section} />
                </motion.div>
              </AnimatePresence>

              {/* Section navigation buttons */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
                <button
                  onClick={() => goToSection(activeSection - 1)}
                  disabled={activeSection === 0}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />上一节
                </button>
                <span className="text-xs text-muted-foreground">
                  {activeSection + 1} / {lesson.sections.length}
                </span>
                {activeSection < lesson.sections.length - 1 ? (
                  <button
                    onClick={() => goToSection(activeSection + 1)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    下一节<ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <span className="text-xs text-green-500 font-medium">已到末尾</span>
                )}
              </div>
            </div>
          </div>

          {/* Key takeaways */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />本节要点
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lesson.keyTakeaways.map((point, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-primary font-medium shrink-0">{i + 1}.</span>{point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Memory aids */}
          {lesson.memoryAids && lesson.memoryAids.length > 0 && (
            <div className="rounded-lg border border-[var(--subject-color)]/20 bg-[var(--subject-color)]/5 p-4 space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <span className="text-base">🧠</span>记忆口诀
              </p>
              <ul className="space-y-1">
                {lesson.memoryAids.map((aid, i) => (
                  <li key={i} className="text-sm text-foreground/80 font-mono pl-4">{aid}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Exercises */}
          {lesson.exercises && lesson.exercises.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">练习</h2>
              {lesson.exercises.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} subject={subject.id} />
              ))}
            </div>
          )}

          {allRead && (
            <button onClick={handleComplete} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium text-sm transition-colors">
              标记为已学完
            </button>
          )}

          {/* Prev/Next lesson */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            {prevLesson ? (
              <Link href={`/${subject.id}/lessons/${prevLesson.id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="h-4 w-4" /><span className="max-w-[200px] truncate">{prevLesson.title}</span>
              </Link>
            ) : <span />}
            {nextLesson ? (
              <Link href={`/${subject.id}/lessons/${nextLesson.id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="max-w-[200px] truncate">{nextLesson.title}</span><ChevronRight className="h-4 w-4" />
              </Link>
            ) : <span />}
          </div>
        </div>
      </div>

      {/* Floating chat toggle & panel */}
      <button
        onClick={() => setShowChat(!showChat)}
        className={cn(
          "fixed bottom-6 z-50 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 ease-in-out",
          showChat ? "right-[calc(20rem+1.5rem)]" : "right-6"
        )}
        aria-label={showChat ? "关闭 AI 助手" : "向 AI 提问"}
      >
        {showChat ? <ChevronRight className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>
      <div
        className={cn(
          "fixed top-0 right-0 z-40 hidden md:flex flex-col h-dvh w-80 border-l border-border bg-background shadow-xl transition-transform duration-300 ease-in-out",
          showChat ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-3 border-b border-border text-sm font-medium">
          AI 助手
        </div>
        <div className="flex-1 overflow-hidden">
          {showChat && <InlineChatPanel context={`当前正在学习：${lesson.title}`} subject={subject.id} />}
        </div>
      </div>
    </div>
  );
}
