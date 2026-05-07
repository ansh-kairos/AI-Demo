"use client";

import { type Email, useEmailStore } from "@/store/emailStore";
import PriorityBadge from "./PriorityBadge";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Mail, MailOpen } from "lucide-react";

interface EmailCardProps {
  email: Email;
}

export default function EmailCard({ email }: EmailCardProps) {
  const { selectedEmail, setSelectedEmail } = useEmailStore();
  const isSelected = selectedEmail?.id === email.id;

  const senderName = email.from.split("<")[0].trim().replace(/"/g, "") || email.from;

  return (
    <button
      onClick={() => setSelectedEmail(email)}
      className={cn(
        "w-full text-left p-4 border-b transition-colors hover:bg-muted/50",
        isSelected && "bg-muted",
        !email.isRead && "bg-blue-50/50"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          {email.isRead ? (
            <MailOpen className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Mail className="h-4 w-4 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className={cn(
                "text-sm truncate",
                !email.isRead && "font-semibold"
              )}
            >
              {senderName}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {timeAgo(email.date)}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <PriorityBadge label={email.urgencyLabel} score={email.urgencyScore} />
            <span
              className={cn(
                "text-sm truncate",
                !email.isRead && "font-medium"
              )}
            >
              {email.subject}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {email.snippet}
          </p>
        </div>
      </div>
    </button>
  );
}
