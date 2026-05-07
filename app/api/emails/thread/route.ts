import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getThread } from "@/lib/gmail";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const threadId = request.nextUrl.searchParams.get("id");
    if (!threadId) {
      return NextResponse.json(
        { error: "Thread ID required" },
        { status: 400 }
      );
    }

    const thread = await getThread(session.user.id, threadId);
    return NextResponse.json(thread);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error fetching thread:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch thread", details: err.message },
      { status: 500 }
    );
  }
}
