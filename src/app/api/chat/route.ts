import { NextRequest } from "next/server";
import { streamChat } from "@/lib/deepseek";
import { subjects, SubjectId } from "@/data/subjects";
import { rateLimit } from "@/lib/rate-limit";

const MAX_MESSAGES = 50;
const MAX_CONTENT_LENGTH = 10_000;
const VALID_SUBJECTS = new Set(Object.keys(subjects));

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) {
    return new Response("请求过于频繁，请稍后再试", { status: 429 });
  }

  try {
    const body = await req.json();
    const messages = body?.messages;
    const context = body?.context;
    const subject = body?.subject as string | undefined;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("请求参数无效", { status: 400 });
    }

    if (messages.length > MAX_MESSAGES) {
      return new Response("消息数量超出限制", { status: 400 });
    }

    for (const msg of messages) {
      if (!msg || typeof msg.content !== "string" || typeof msg.role !== "string") {
        return new Response("消息格式无效", { status: 400 });
      }
      if (msg.content.length > MAX_CONTENT_LENGTH) {
        return new Response("单条消息内容过长", { status: 400 });
      }
    }

    const subjectId: SubjectId = (subject && VALID_SUBJECTS.has(subject))
      ? subject as SubjectId
      : "ds";
    const config = subjects[subjectId];

    const systemPrompt = context
      ? `${config.teacherPrompt}\n\n当前学习上下文：${String(context).slice(0, 2000)}`
      : config.teacherPrompt;

    const stream = await streamChat(messages, systemPrompt);

    if (!stream) {
      return new Response("服务暂时不可用，请稍后重试", { status: 502 });
    }

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return new Response("服务暂时不可用，请稍后重试", { status: 500 });
  }
}
