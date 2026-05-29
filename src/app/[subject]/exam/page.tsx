"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSubject } from "@/contexts/SubjectContext";
import { ExamConfig, ExamQuestion, selectQuestions } from "@/lib/exam";
import { EvaluationResult, Difficulty } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock, Play, CheckCircle2, AlertCircle, XCircle,
  ChevronLeft, ChevronRight, Send, Loader2,
} from "lucide-react";

type Phase = "config" | "session" | "results";

interface AnswerState {
  text: string;
  result?: EvaluationResult;
  submitted: boolean;
}

export default function ExamPage() {
  const subject = useSubject();
  const [phase, setPhase] = useState<Phase>("config");
  const [config, setConfig] = useState<ExamConfig>({
    questionCount: 5,
    timeLimit: 30,
    chapters: [],
    difficulty: "all",
  });
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [evaluating, setEvaluating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalExercises = subject.chapters
    .flatMap((c) => c.lessons)
    .flatMap((l) => l.exercises || []).length;

  function startExam() {
    const selected = selectQuestions(subject.chapters, config);
    if (selected.length === 0) return;
    setQuestions(selected);
    setAnswers(selected.map(() => ({ text: "", submitted: false })));
    setCurrentIdx(0);
    if (config.timeLimit > 0) {
      setTimeLeft(config.timeLimit * 60);
    }
    setPhase("session");
  }

  useEffect(() => {
    if (phase !== "session" || config.timeLimit === 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase("results");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, config.timeLimit]);

  const submitCurrent = useCallback(async () => {
    const ans = answers[currentIdx];
    if (!ans.text.trim() || ans.submitted) return;
    setEvaluating(true);
    const q = questions[currentIdx];
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemTitle: q.exercise.title,
          problemDescription: q.exercise.description,
          referenceSolution: q.exercise.referenceSolution,
          userAnswer: ans.text,
          subject: subject.id,
        }),
      });
      const data: EvaluationResult = await res.json();
      setAnswers((prev) => {
        const next = [...prev];
        next[currentIdx] = { ...next[currentIdx], result: data, submitted: true };
        return next;
      });
    } catch {
      setAnswers((prev) => {
        const next = [...prev];
        next[currentIdx] = { ...next[currentIdx], result: { verdict: "incorrect", feedback: "评判失败", suggestions: [] }, submitted: true };
        return next;
      });
    } finally {
      setEvaluating(false);
    }
  }, [answers, currentIdx, questions, subject.id]);

  function finishExam() {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("results");
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // Config phase
  if (phase === "config") {
    return (
      <div className="p-8 max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">模拟考试</h1>
          <p className="text-muted-foreground mt-1">从{subject.name}题库中随机抽题，限时作答</p>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <label className="text-sm font-medium">题目数量</label>
              <div className="flex gap-2 mt-2">
                {[3, 5, 8, 10].map((n) => (
                  <button key={n} onClick={() => setConfig({ ...config, questionCount: n })} className={`px-4 py-2 rounded-md text-sm border transition-colors ${config.questionCount === n ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                    {n} 题
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">题库共 {totalExercises} 题</p>
            </div>
            <div>
              <label className="text-sm font-medium">时间限制</label>
              <div className="flex gap-2 mt-2">
                {[0, 15, 30, 45, 60].map((m) => (
                  <button key={m} onClick={() => setConfig({ ...config, timeLimit: m })} className={`px-4 py-2 rounded-md text-sm border transition-colors ${config.timeLimit === m ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                    {m === 0 ? "不限时" : `${m} 分钟`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">难度筛选</label>
              <div className="flex gap-2 mt-2">
                {(["all", "easy", "medium", "hard"] as const).map((d) => (
                  <button key={d} onClick={() => setConfig({ ...config, difficulty: d })} className={`px-4 py-2 rounded-md text-sm border transition-colors ${config.difficulty === d ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                    {d === "all" ? "全部" : d === "easy" ? "简单" : d === "medium" ? "中等" : "困难"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">章节范围</label>
              <div className="flex flex-wrap gap-2 mt-2">
                <button onClick={() => setConfig({ ...config, chapters: [] })} className={`px-3 py-1.5 rounded-md text-xs border transition-colors ${config.chapters.length === 0 ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                  全部章节
                </button>
                {subject.chapters.map((c) => (
                  <button key={c.id} onClick={() => {
                    const chs = config.chapters.includes(c.id)
                      ? config.chapters.filter((x) => x !== c.id)
                      : [...config.chapters, c.id];
                    setConfig({ ...config, chapters: chs });
                  }} className={`px-3 py-1.5 rounded-md text-xs border transition-colors ${config.chapters.includes(c.id) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <button onClick={startExam} disabled={totalExercises === 0} className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
          <Play className="h-4 w-4" />开始考试
        </button>
      </div>
    );
  }

  // Session phase
  if (phase === "session") {
    const q = questions[currentIdx];
    const ans = answers[currentIdx];
    return (
      <div className="flex flex-col h-dvh">
        <div className="border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">第 {currentIdx + 1}/{questions.length} 题</span>
            <Progress value={((currentIdx + 1) / questions.length) * 100} className="w-32 h-2" />
          </div>
          <div className="flex items-center gap-4">
            {config.timeLimit > 0 && (
              <span className={`flex items-center gap-1 text-sm font-mono ${timeLeft < 60 ? "text-red-500" : ""}`}>
                <Clock className="h-4 w-4" />{formatTime(timeLeft)}
              </span>
            )}
            <button onClick={finishExam} className="px-4 py-1.5 border border-border rounded-md text-xs hover:bg-muted transition-colors">
              交卷
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">{q.chapterName}</Badge>
              <span>{q.lessonTitle}</span>
            </div>
            <h2 className="text-lg font-semibold">{q.exercise.title}</h2>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{q.exercise.description}</pre>
            <textarea
              value={ans.text}
              onChange={(e) => {
                const next = [...answers];
                next[currentIdx] = { ...next[currentIdx], text: e.target.value };
                setAnswers(next);
              }}
              placeholder="在此作答..."
              className="w-full min-h-[150px] bg-muted rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring resize-y font-mono"
              disabled={ans.submitted}
            />
            {!ans.submitted && (
              <button onClick={submitCurrent} disabled={evaluating || !ans.text.trim()} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 transition-colors">
                {evaluating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {evaluating ? "评判中..." : "提交本题"}
              </button>
            )}
            {ans.result && (
              <div className="rounded-md border border-border p-3 text-sm">
                <span className={`font-medium ${ans.result.verdict === "correct" ? "text-green-500" : ans.result.verdict === "partial" ? "text-yellow-500" : "text-red-500"}`}>
                  {ans.result.verdict === "correct" ? "正确" : ans.result.verdict === "partial" ? "部分正确" : "错误"}
                </span>
                <p className="text-xs mt-1 text-muted-foreground">{ans.result.feedback}</p>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-border p-4 flex justify-between">
          <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0} className="flex items-center gap-1 text-sm disabled:opacity-30">
            <ChevronLeft className="h-4 w-4" />上一题
          </button>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)} aria-label={`第 ${i + 1} 题${answers[i].submitted ? "（已提交）" : answers[i].text ? "（已作答）" : ""}`} className={`w-7 h-7 rounded text-xs font-medium transition-colors ${i === currentIdx ? "bg-primary text-primary-foreground" : answers[i].submitted ? "bg-green-500/20 text-green-600" : answers[i].text ? "bg-muted" : "border border-border"}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <button onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))} disabled={currentIdx === questions.length - 1} className="flex items-center gap-1 text-sm disabled:opacity-30">
            下一题<ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Results phase
  const submitted = answers.filter((a) => a.submitted);
  const correct = submitted.filter((a) => a.result?.verdict === "correct").length;
  const partial = submitted.filter((a) => a.result?.verdict === "partial").length;
  const incorrect = submitted.filter((a) => a.result?.verdict === "incorrect").length;
  const unanswered = questions.length - submitted.length;
  const score = Math.round(((correct + partial * 0.5) / questions.length) * 100);

  const circumference = 2 * Math.PI * 45;
  const scoreOffset = circumference - (circumference * score) / 100;

  const chapterStats: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q, i) => {
    if (!chapterStats[q.chapterName]) chapterStats[q.chapterName] = { correct: 0, total: 0 };
    chapterStats[q.chapterName].total++;
    if (answers[i].result?.verdict === "correct") chapterStats[q.chapterName].correct++;
    else if (answers[i].result?.verdict === "partial") chapterStats[q.chapterName].correct += 0.5;
  });

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">考试结果</h1>

      {/* Score ring + stats */}
      <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border border-border p-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
            <circle
              cx="50" cy="50" r="45" fill="none" strokeWidth="8" strokeLinecap="round"
              className="text-[var(--subject-color)] transition-all duration-1000"
              strokeDasharray={circumference}
              strokeDashoffset={scoreOffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{score}</span>
            <span className="text-xs text-muted-foreground">分</span>
          </div>
        </div>

        <div className="flex-1 space-y-3 w-full">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm flex-1">正确</span>
            <span className="text-sm font-mono font-medium">{correct}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm flex-1">部分正确</span>
            <span className="text-sm font-mono font-medium">{partial}</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm flex-1">错误</span>
            <span className="text-sm font-mono font-medium">{incorrect}</span>
          </div>
          {unanswered > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm flex-1">未作答</span>
              <span className="text-sm font-mono font-medium">{unanswered}</span>
            </div>
          )}
          <div className="h-px bg-border" />
          <p className="text-xs text-muted-foreground">
            共 {questions.length} 题，已提交 {submitted.length} 题
          </p>
        </div>
      </div>

      {/* Chapter breakdown */}
      {Object.keys(chapterStats).length > 1 && (
        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-sm font-medium">章节得分</p>
          {Object.entries(chapterStats).map(([name, stat]) => {
            const pct = Math.round((stat.correct / stat.total) * 100);
            return (
              <div key={name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{name}</span>
                  <span className="font-mono">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--subject-color)] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Per-question details */}
      <div className="space-y-4">
        {questions.map((q, i) => {
          const ans = answers[i];
          const Icon = ans.result?.verdict === "correct" ? CheckCircle2 : ans.result?.verdict === "partial" ? AlertCircle : XCircle;
          const color = ans.result?.verdict === "correct" ? "text-green-500" : ans.result?.verdict === "partial" ? "text-yellow-500" : "text-red-500";
          return (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${color}`} />
                  第 {i + 1} 题：{q.exercise.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {ans.text && <div className="bg-muted rounded p-2 font-mono whitespace-pre-wrap">{ans.text}</div>}
                {ans.result && <p className="text-muted-foreground">{ans.result.feedback}</p>}
                <details className="text-muted-foreground">
                  <summary className="cursor-pointer hover:text-foreground">参考答案</summary>
                  <pre className="mt-1 whitespace-pre-wrap font-mono">{q.exercise.referenceSolution}</pre>
                </details>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <button onClick={() => setPhase("config")} className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors">
        再来一次
      </button>
    </div>
  );
}
