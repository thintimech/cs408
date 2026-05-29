import { NextRequest } from "next/server";
import { streamChat } from "@/lib/deepseek";
import { subjects, SubjectId } from "@/data/subjects";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) {
    return new Response("请求过于频繁，请稍后再试", { status: 429 });
  }

  try {
    const body = await req.json();
    const messages = body?.messages;
    const context = body?.context;
    const subject = body?.subject as SubjectId | undefined;

    if (!Array.isArray(messages)) {
      return new Response("Invalid request: messages must be an array", { status: 400 });
    }

    const config = subject ? subjects[subject] : subjects.ds;
    const systemPrompt = context
      ? `${config.teacherPrompt}\n\n当前学习上下文：${context}`
      : config.teacherPrompt;

    const stream = await streamChat(messages, systemPrompt);

    if (!stream) {
      return new Response("Failed to get response stream", { status: 502 });
    }

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error";
    return new Response(message, { status: 500 });
  }
}
