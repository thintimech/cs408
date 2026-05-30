import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/deepseek";
import { subjects, SubjectId } from "@/data/subjects";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_ANSWER_LENGTH = 5_000;
const MAX_FIELD_LENGTH = 10_000;
const VALID_SUBJECTS = new Set(Object.keys(subjects));

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { verdict: "incorrect", feedback: "请求过于频繁，请稍后再试。", suggestions: [] },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { problemTitle, problemDescription, referenceSolution, userAnswer, subject } = body ?? {};

    if (!problemTitle || typeof problemTitle !== "string") {
      return NextResponse.json(
        { verdict: "incorrect", feedback: "请求参数不完整", suggestions: [] },
        { status: 400 }
      );
    }

    if (!userAnswer || typeof userAnswer !== "string") {
      return NextResponse.json(
        { verdict: "incorrect", feedback: "请提交你的答案", suggestions: [] },
        { status: 400 }
      );
    }

    if (userAnswer.length > MAX_ANSWER_LENGTH) {
      return NextResponse.json(
        { verdict: "incorrect", feedback: "答案内容过长，请精简后重试", suggestions: [] },
        { status: 400 }
      );
    }

    const subjectId: SubjectId = (typeof subject === "string" && VALID_SUBJECTS.has(subject))
      ? subject as SubjectId
      : "ds";
    const config = subjects[subjectId];

    const safeDescription = typeof problemDescription === "string"
      ? problemDescription.slice(0, MAX_FIELD_LENGTH)
      : "";
    const safeReference = typeof referenceSolution === "string"
      ? referenceSolution.slice(0, MAX_FIELD_LENGTH)
      : "";

    const userMessage = `题目：${problemTitle.slice(0, 200)}

题目描述：
${safeDescription}

参考答案：
${safeReference}

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
  } catch (e) {
    console.error("[evaluate]", e);
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
