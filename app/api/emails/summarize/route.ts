import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getThread } from "@/lib/gmail";
import { callLLM } from "@/lib/llm";
import { buildSummaryPrompt } from "@/prompts/summarize";
import { truncateText } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId } = await request.json();
    if (!threadId) {
      return NextResponse.json(
        { error: "Thread ID required" },
        { status: 400 }
      );
    }

    const thread = await getThread(session.user.id, threadId);

    let messages = thread.messages;
    const totalLength = messages.reduce((sum, m) => sum + m.body.length, 0);
    if (totalLength > 40000) {
      const first3 = messages.slice(0, 3);
      const last3 = messages.slice(-3);
      messages = [...first3, ...last3];
    }

    const truncatedThread = {
      messages: messages.map((m) => ({
        from: m.from,
        date: m.date,
        body: truncateText(m.body, 2000),
      })),
    };

    const { systemPrompt, userPrompt } = buildSummaryPrompt(truncatedThread);
    const result = await callLLM(systemPrompt, userPrompt);

    try {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
      throw new Error("No JSON found in response");
    } catch {
      return NextResponse.json({
        tldr: result.content.slice(0, 200),
        keyPoints: [result.content],
        actionItems: [],
      });
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error summarizing thread:", err.message);
    return NextResponse.json(
      { error: "Failed to summarize thread", details: err.message },
      { status: 500 }
    );
  }
}
