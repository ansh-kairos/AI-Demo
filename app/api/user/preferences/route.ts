import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prefs = await prisma.preference.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      preferences: prefs || {
        defaultTone: "professional",
        userName: session.user.name,
        userRole: "",
        signature: "",
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error fetching preferences:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch preferences", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { defaultTone, userName, userRole, signature } = await request.json();

    const prefs = await prisma.preference.upsert({
      where: { userId: session.user.id },
      update: { defaultTone, userName, userRole, signature },
      create: {
        userId: session.user.id,
        defaultTone: defaultTone || "professional",
        userName,
        userRole,
        signature,
      },
    });

    return NextResponse.json({ preferences: prefs });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error updating preferences:", err.message);
    return NextResponse.json(
      { error: "Failed to update preferences", details: err.message },
      { status: 500 }
    );
  }
}
