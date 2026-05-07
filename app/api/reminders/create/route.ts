import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId, subject, senderEmail, remindAt } = await request.json();

    if (!threadId || !subject || !senderEmail || !remindAt) {
      return NextResponse.json(
        { error: "threadId, subject, senderEmail, and remindAt are required" },
        { status: 400 }
      );
    }

    const activeCount = await prisma.reminder.count({
      where: { userId: session.user.id, sent: false },
    });

    if (activeCount >= 10) {
      return NextResponse.json(
        { error: "Maximum 10 active reminders allowed" },
        { status: 429 }
      );
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId: session.user.id,
        threadId,
        subject,
        senderEmail,
        remindAt: new Date(remindAt),
      },
    });

    return NextResponse.json({ success: true, reminderId: reminder.id });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error creating reminder:", err.message);
    return NextResponse.json(
      { error: "Failed to create reminder", details: err.message },
      { status: 500 }
    );
  }
}
