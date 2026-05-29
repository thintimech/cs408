import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/deepseek";
import { subjects, SubjectId } from "@/data/subjects";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { verdict: "incorrect", feedback: "请求过于频繁，请稍后再试。", suggestions: [] },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { problemTitle, problemDescription, referenceSolution, userAnswer, subject } = body ?? {};

    if (!problemTitle || !userAnswer) {
      return NextResponse.json(
        { verdict: "incorrect", feedback: "请求参数不完整", suggestions: [] },
        { status: 400 }
      );
    }

    const config = subject ? subjects[subject as SubjectId] : subjects.ds;

    const userMessage = `题目：${problemTitle}

题目描述：
${problemDescription}

参考答案：
${referenceSolution}

学生提交的答案：
${userAnswer}

请评判学生的答案。`;

    const result = await chatCompletion(
      [{ role: "user", content: userMessage }],
      config.evaluatorPrompt
    );

    try {
      const parsed = JSON.parse(result);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({
        verdict: "partial",
        feedback: result,
        suggestions: [],
      });
    }
  } catch {
    return NextResponse.json(
      {
        verdict: "incorrect",
        feedback: "评判服务暂时不可用，请稍后重试。",
        suggestions: [],
      },
      { status: 500 }
    );
  }
}
