"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useSubject } from "@/contexts/SubjectContext";
import { PseudoCodeEditor } from "@/components/editor/PseudoCodeEditor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EvaluationResult } from "@/types";
import { Loader2, CheckCircle2, AlertCircle, XCircle, Lightbulb } from "lucide-react";

const difficultyLabel = { easy: "简单", medium: "中等", hard: "困难" };

export default function PracticePage() {
  const params = useParams();
  const subject = useSubject();
  const exerciseId = params.id as string;

  const exercise = subject.chapters
    .flatMap((c) => c.lessons)
    .flatMap((l) => l.exercises || [])
    .find((e) => e.id === exerciseId);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [showHints, setShowHints] = useState(false);

  if (!exercise) {
    return <div className="p-8"><p className="text-muted-foreground">未找到该题目</p></div>;
  }

  async function handleSubmit() {
    if (!code.trim() || !exercise) return;
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
          userAnswer: code,
          subject: subject.id,
        }),
      });
      const data: EvaluationResult = await res.json();
      setResult(data);
    } catch {
      setResult({ verdict: "incorrect", feedback: "网络错误，请检查连接后重试。", suggestions: [] });
    } finally {
      setLoading(false);
    }
  }

  const VerdictIcon = { correct: CheckCircle2, partial: AlertCircle, incorrect: XCircle };
  const verdictColor = { correct: "text-green-500", partial: "text-yellow-500", incorrect: "text-red-500" };
  const verdictLabel = { correct: "正确", partial: "部分正确", incorrect: "错误" };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-bold">{exercise.title}</h1>
              <Badge variant="outline">{difficultyLabel[exercise.difficulty]}</Badge>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">{exercise.description}</pre>
          </div>
          <button onClick={() => setShowHints(!showHints)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Lightbulb className="h-4 w-4" />{showHints ? "隐藏提示" : "查看提示"}
          </button>
          {showHints && (
            <Card><CardContent className="pt-4"><ul className="space-y-1 text-sm">{exercise.hints.map((hint, i) => <li key={i} className="text-muted-foreground">{i + 1}. {hint}</li>)}</ul></CardContent></Card>
          )}
          {result && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {(() => { const Icon = VerdictIcon[result.verdict]; return <Icon className={`h-5 w-5 ${verdictColor[result.verdict]}`} />; })()}
                  评判结果：{verdictLabel[result.verdict]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{result.feedback}</p>
                {result.suggestions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">改进建议：</p>
                    <ul className="text-sm text-muted-foreground space-y-1">{result.suggestions.map((s, i) => <li key={i}>• {s}</li>)}</ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        <div className="space-y-4">
          <div className="h-[400px]">
            <PseudoCodeEditor value={code} onChange={setCode} placeholder="在此编写你的答案..." />
          </div>
          <button onClick={handleSubmit} disabled={loading || !code.trim()} className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "AI 评判中..." : "提交评判"}
          </button>
        </div>
      </div>
    </div>
  );
}
