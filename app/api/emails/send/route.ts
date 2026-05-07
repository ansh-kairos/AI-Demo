import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/gmail";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { to, subject, body, threadId } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "to, subject, and body are required" },
        { status: 400 }
      );
    }

    const result = await sendEmail(session.user.id, to, subject, body, threadId);
    return NextResponse.json({ success: true, messageId: result.id });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error sending email:", err.message);
    return NextResponse.json(
      { error: "Failed to send email", details: err.message },
      { status: 500 }
    );
  }
}
