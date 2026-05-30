"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSubject } from "@/contexts/SubjectContext";
import { getWrongAnswers, removeWrongAnswer } from "@/lib/storage";
import { ExerciseAttempt } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle, XCircle, Trash2, RotateCcw, ChevronDown, ChevronRight, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const verdictColor = {
  correct: "bg-green-500/10 text-green-600 border-green-500/20",
  partial: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  incorrect: "bg-red-500/10 text-red-600 border-red-500/20",
};
const verdictLabel = { correct: "正确", partial: "部分正确", incorrect: "错误" };
const difficultyLabel: Record<string, string> = { easy: "简单", medium: "中等", hard: "困难" };

function MistakeItem({ attempt, onRemove, subjectId }: { attempt: ExerciseAttempt; onRemove: () => void; subjectId: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        {expanded ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
        <span className="flex-1 text-sm font-medium truncate">{attempt.exerciseTitle}</span>
        <Badge variant="outline" className={cn("text-xs", verdictColor[attempt.result.verdict])}>
          {verdictLabel[attempt.result.verdict]}
        </Badge>
        <span className="text-xs text-muted-foreground shrink-0">
          {new Date(attempt.timestamp).toLocaleDateString("zh-CN")}
        </span>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0 pb-4 space-y-3 border-t border-border">
              <div className="pt-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">你的答案：</p>
                <pre className="whitespace-pre-wrap text-xs bg-muted rounded-md p-3 font-mono leading-relaxed max-h-40 overflow-auto">{attempt.userAnswer}</pre>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">AI 反馈：</p>
                <p className="text-sm text-foreground/80">{attempt.result.feedback}</p>
                {attempt.result.suggestions.length > 0 && (
                  <ul className="mt-1 text-xs text-muted-foreground space-y-0.5">
                    {attempt.result.suggestions.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <Link
                  href={`/${subjectId}/lessons/${attempt.lessonId}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />回到课程重做
                </Link>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-red-500/20 text-red-600 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />移除
                </button>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function MistakesPage() {
  const subject = useSubject();
  const [mistakes, setMistakes] = useState<ExerciseAttempt[]>([]);

  useEffect(() => {
    setMistakes(getWrongAnswers(subject.storageKey));
  }, [subject.storageKey]);

  function handleRemove(exerciseId: string) {
    removeWrongAnswer(subject.storageKey, exerciseId);
    setMistakes((prev) => prev.filter((m) => m.exerciseId !== exerciseId));
  }

  const grouped = mistakes.reduce<Record<string, ExerciseAttempt[]>>((acc, m) => {
    (acc[m.lessonId] ||= []).push(m);
    return acc;
  }, {});

  const lessonTitleMap = Object.fromEntries(
    subject.chapters.flatMap((c) => c.lessons).map((l) => [l.id, l.title])
  );

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">错题本</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {mistakes.length > 0
            ? `共 ${mistakes.length} 道错题，答对后自动移除`
            : "暂无错题记录，继续加油！"}
        </p>
      </div>

      {mistakes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <BookOpen className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm">做练习时答错的题目会出现在这里</p>
        </div>
      )}

      {Object.entries(grouped).map(([lessonId, items]) => (
        <div key={lessonId} className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--subject-color)]" />
            {lessonTitleMap[lessonId] || lessonId}
          </h2>
          {items.map((attempt) => (
            <MistakeItem
              key={attempt.exerciseId}
              attempt={attempt}
              onRemove={() => handleRemove(attempt.exerciseId)}
              subjectId={subject.id}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
