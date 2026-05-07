import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listInboxEmails } from "@/lib/gmail";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const emails = await listInboxEmails(session.user.id);
    return NextResponse.json({ emails });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error listing emails:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch emails", details: err.message },
      { status: 500 }
    );
  }
}
