import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reminders = await prisma.reminder.findMany({
      where: { userId: session.user.id },
      orderBy: { remindAt: "asc" },
    });

    return NextResponse.json({ reminders });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error listing reminders:", err.message);
    return NextResponse.json(
      { error: "Failed to list reminders", details: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Reminder ID required" }, { status: 400 });
    }

    await prisma.reminder.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error deleting reminder:", err.message);
    return NextResponse.json(
      { error: "Failed to delete reminder", details: err.message },
      { status: 500 }
    );
  }
}
