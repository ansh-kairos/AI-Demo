import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getThread } from "@/lib/gmail";
import { callLLM } from "@/lib/llm";
import { buildReplyPrompt } from "@/prompts/reply";
import { truncateText } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { threadId, tone = "professional", userContext } = body;

    if (!threadId) {
      return NextResponse.json(
        { error: "Thread ID required" },
        { status: 400 }
      );
    }

    const thread = await getThread(session.user.id, threadId);

    const truncatedMessages = thread.messages.slice(-5).map((m) => ({
      from: m.from,
      body: truncateText(m.body, 1200),
    }));

    const { systemPrompt, userPrompt } = buildReplyPrompt(
      { messages: truncatedMessages },
      tone,
      {
        name: userContext?.name || session.user.name || "User",
        role: userContext?.role || "professional",
      }
    );

    const result = await callLLM(systemPrompt, userPrompt);

    return NextResponse.json({
      draft: result.content,
      model_used: result.model,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error generating reply:", err.message);
    return NextResponse.json(
      { error: "Failed to generate reply", details: err.message },
      { status: 500 }
    );
  }
}
