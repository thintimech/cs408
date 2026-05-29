"use client";

import { useState } from "react";
import { Exercise, EvaluationResult } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2, CheckCircle2, AlertCircle, XCircle, Lightbulb,
  ChevronDown, ChevronRight, Eye,
} from "lucide-react";

const difficultyLabel = { easy: "简单", medium: "中等", hard: "困难" };
const difficultyColor = {
  easy: "bg-green-500/10 text-green-600 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-600 border-red-500/20",
};

interface ExerciseCardProps {
  exercise: Exercise;
  subject: string;
}

export function ExerciseCard({ exercise, subject }: ExerciseCardProps) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  async function handleSubmit() {
    if (!answer.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemTitle: exercise.title,
          problemDescription: exercise.description,
          referenceSolution: exercise.referenceSolution,
          userAnswer: answer,
          subject,
        }),
      });
      const data: EvaluationResult = await res.json();
      setResult(data);
    } catch {
      setResult({ verdict: "incorrect", feedback: "网络错误，请稍后重试。", suggestions: [] });
    } finally {
      setLoading(false);
    }
  }

  const VerdictIcon = { correct: CheckCircle2, partial: AlertCircle, incorrect: XCircle };
  const verdictColor = { correct: "text-green-500", partial: "text-yellow-500", incorrect: "text-red-500" };
  const verdictLabel = { correct: "正确", partial: "部分正确", incorrect: "错误" };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm">{exercise.title}</CardTitle>
          <Badge variant="outline" className={`text-xs ${difficultyColor[exercise.difficulty]}`}>
            {difficultyLabel[exercise.difficulty]}
          </Badge>
        </div>
        <pre className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed mt-2 font-sans">
          {exercise.description}
        </pre>
      </CardHeader>
      <CardContent className="space-y-3">
        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Lightbulb className="h-3.5 w-3.5" />
          {showHints ? "隐藏提示" : "查看提示"}
          {showHints ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>

        {showHints && (
          <ul className="text-xs text-muted-foreground space-y-1 pl-5 border-l-2 border-muted">
            {exercise.hints.map((hint, i) => <li key={i}>{i + 1}. {hint}</li>)}
          </ul>
        )}

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="在此写下你的答案..."
          className="w-full min-h-[100px] bg-muted rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-y font-mono"
          disabled={loading}
        />

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading || !answer.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
          >
            {loading && <Loader2 className="h-3 w-3 animate-spin" />}
            {loading ? "评判中..." : "AI 评判"}
          </button>
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="px-4 py-2 border border-border rounded-md text-xs font-medium hover:bg-muted flex items-center gap-1.5 transition-colors"
          >
            <Eye className="h-3 w-3" />
            {showSolution ? "隐藏答案" : "查看参考答案"}
          </button>
        </div>

        {result && (
          <div className="rounded-md border border-border p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              {(() => { const Icon = VerdictIcon[result.verdict]; return <Icon className={`h-4 w-4 ${verdictColor[result.verdict]}`} />; })()}
              {verdictLabel[result.verdict]}
            </div>
            <p className="text-xs text-foreground/80">{result.feedback}</p>
            {result.suggestions.length > 0 && (
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {result.suggestions.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            )}
          </div>
        )}

        {showSolution && (
          <div className="rounded-md border border-border bg-muted/50 p-3">
            <p className="text-xs font-medium mb-1 text-muted-foreground">参考答案：</p>
            <pre className="whitespace-pre-wrap text-xs leading-relaxed font-mono">
              {exercise.referenceSolution}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
