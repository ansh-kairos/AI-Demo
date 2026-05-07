"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Mail,
  Zap,
  FileText,
  Clock,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Brain className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  const features = [
    {
      icon: Mail,
      title: "Smart Inbox",
      description: "AI-prioritized emails with urgency scores",
    },
    {
      icon: Zap,
      title: "AI Reply Drafts",
      description: "Generate context-aware replies in seconds",
    },
    {
      icon: FileText,
      title: "Thread Summaries",
      description: "TL;DR + key points for long email threads",
    },
    {
      icon: Clock,
      title: "Follow-up Reminders",
      description: "Never forget to follow up on important emails",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Emails never stored — always fetched live from Gmail",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl">MailMind AI</span>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <section className="py-20 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Your AI-Powered
            <span className="text-primary"> Email Assistant</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Draft smart replies, prioritize urgent emails, summarize long
            threads, and set follow-up reminders — all powered by free AI
            models.
          </p>
          <Button
            size="lg"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="gap-2 text-lg px-8 py-6"
          >
            <Mail className="h-5 w-5" />
            Sign in with Google
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Connects to Gmail via OAuth. Your emails are never stored.
          </p>
        </section>

        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">100% Free to Use</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built with free-tier APIs from Groq and NVIDIA NIM. No credit card
            required. Deploy on Vercel or Render for free.
          </p>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>MailMind AI — Open Source Email Assistant</p>
      </footer>
    </div>
  );
}
