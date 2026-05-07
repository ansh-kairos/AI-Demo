"use client";

import { useEmailStore } from "@/store/emailStore";
import EmailCard from "./EmailCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Inbox as InboxIcon } from "lucide-react";
import { useCallback } from "react";

interface EmailListProps {
  onRefresh: () => void;
}

export default function EmailList({ onRefresh }: EmailListProps) {
  const { emails, loading, sortBy, setSortBy } = useEmailStore();

  const sortedEmails = useCallback(() => {
    const sorted = [...emails];
    if (sortBy === "urgency") {
      sorted.sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));
    } else {
      sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    return sorted;
  }, [emails, sortBy]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">
          Inbox{" "}
          <span className="text-muted-foreground font-normal">
            ({emails.length} emails)
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as "urgency" | "date")}
          >
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgency">Sort: Urgency</SelectItem>
              <SelectItem value="date">Sort: Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <RefreshCw className="h-8 w-8 animate-spin mb-2" />
            <p>Loading emails...</p>
          </div>
        ) : emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <InboxIcon className="h-12 w-12 mb-2" />
            <p>No emails found</p>
            <p className="text-xs mt-1">Your inbox is empty or not connected</p>
          </div>
        ) : (
          sortedEmails().map((email) => (
            <EmailCard key={email.id} email={email} />
          ))
        )}
      </div>
    </div>
  );
}
