import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { callLLM } from "@/lib/llm";
import { buildPriorityPrompt } from "@/prompts/prioritize";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emails } = await request.json();
    if (!emails?.length) {
      return NextResponse.json(
        { error: "Emails array required" },
        { status: 400 }
      );
    }

    const { systemPrompt, userPrompt } = buildPriorityPrompt(emails);
    const result = await callLLM(systemPrompt, userPrompt);

    try {
      const jsonMatch = result.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const scores = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ scores });
      }
      throw new Error("No JSON array found in response");
    } catch {
      const defaultScores = emails.map(
        (e: { id: string; subject: string }) => ({
          id: e.id,
          score: 3,
          label: "medium" as const,
          reason: "Unable to prioritize — scored as medium",
        })
      );
      return NextResponse.json({ scores: defaultScores });
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error prioritizing emails:", err.message);
    return NextResponse.json(
      { error: "Failed to prioritize emails", details: err.message },
      { status: 500 }
    );
  }
}
