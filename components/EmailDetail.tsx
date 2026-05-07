"use client";

import { useState, useEffect } from "react";
import { useEmailStore } from "@/store/emailStore";
import PriorityBadge from "./PriorityBadge";
import ReplyDrafter from "./ReplyDrafter";
import ThreadSummary from "./ThreadSummary";
import ReminderModal from "./ReminderModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Pencil, RefreshCw } from "lucide-react";
import { timeAgo } from "@/lib/utils";

interface ThreadMessage {
  id: string;
  from: string;
  to: string;
  date: string;
  body: string;
}

export default function EmailDetail() {
  const { selectedEmail, setSelectedEmail } = useEmailStore();
  const [thread, setThread] = useState<ThreadMessage[]>([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [showReplyDrafter, setShowReplyDrafter] = useState(false);

  useEffect(() => {
    if (!selectedEmail) return;
    setShowReplyDrafter(false);
    setThreadLoading(true);
    fetch(`/api/emails/thread?id=${selectedEmail.threadId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) setThread(data.messages);
      })
      .catch(console.error)
      .finally(() => setThreadLoading(false));
  }, [selectedEmail]);

  if (!selectedEmail) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Pencil className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Select an email to view</p>
        </div>
      </div>
    );
  }

  const senderName =
    selectedEmail.from.split("<")[0].trim().replace(/"/g, "") ||
    selectedEmail.from;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedEmail(null)}
            className="md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-semibold text-lg flex-1">{selectedEmail.subject}</h2>
          <PriorityBadge
            label={selectedEmail.urgencyLabel}
            score={selectedEmail.urgencyScore}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            From: <strong className="text-foreground">{senderName}</strong>
          </span>
          <span>{timeAgo(selectedEmail.date)}</span>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {threadLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            Loading thread...
          </div>
        ) : (
          thread.map((msg, i) => (
            <div key={msg.id || i} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">{msg.from}</span>
                <span>{msg.date}</span>
              </div>
              <div className="bg-muted/30 rounded-md p-3 text-sm whitespace-pre-wrap">
                {msg.body || "(empty)"}
              </div>
            </div>
          ))
        )}

        <Separator />

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => setShowReplyDrafter(!showReplyDrafter)}
          >
            <Pencil className="h-3 w-3 mr-1" />
            Draft Reply
          </Button>
          <ThreadSummary />
          <ReminderModal email={selectedEmail} />
        </div>

        {showReplyDrafter && <ReplyDrafter />}
      </div>
    </div>
  );
}
