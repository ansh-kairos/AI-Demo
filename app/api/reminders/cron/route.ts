import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/gmail";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dueReminders = await prisma.reminder.findMany({
      where: {
        remindAt: { lte: new Date() },
        sent: false,
      },
      include: { user: true },
    });

    let sentCount = 0;
    let failCount = 0;

    for (const reminder of dueReminders) {
      try {
        await sendEmail(
          reminder.userId,
          reminder.user.email,
          `[MailMind Reminder] Follow up: ${reminder.subject}`,
          `Hi ${reminder.user.name || "there"},\n\nThis is a reminder to follow up on an email from ${reminder.senderEmail}.\n\nOriginal subject: ${reminder.subject}\n\n— MailMind AI`,
          reminder.threadId
        );

        await prisma.reminder.update({
          where: { id: reminder.id },
          data: { sent: true },
        });
        sentCount++;
      } catch (err) {
        console.error(`Failed to send reminder ${reminder.id}:`, err);
        failCount++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: dueReminders.length,
      sent: sentCount,
      failed: failCount,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Cron error:", err.message);
    return NextResponse.json(
      { error: "Cron job failed", details: err.message },
      { status: 500 }
    );
  }
}
