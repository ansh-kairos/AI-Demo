"use client";

import { useSession, signOut } from "next-auth/react";
import { Brain, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Brain className="h-6 w-6 text-primary" />
          <span>MailMind AI</span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          {session?.user && (
            <>
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {session.user.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
