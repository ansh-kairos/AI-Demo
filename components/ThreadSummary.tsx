"use client";

import { useEmailStore } from "@/store/emailStore";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw, CheckSquare, ListChecks } from "lucide-react";

export default function ThreadSummary() {
  const { selectedEmail, summary, setSummary, summaryLoading, setSummaryLoading } =
    useEmailStore();

  if (!selectedEmail) return null;

  const summarize = async () => {
    setSummaryLoading(true);
    try {
      const res = await fetch("/api/emails/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: selectedEmail.threadId }),
      });
      const data = await res.json();
      if (data.tldr) {
        setSummary(data);
      }
    } catch (err) {
      console.error("Failed to summarize:", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  if (!summary && !summaryLoading) {
    return (
      <Button size="sm" variant="outline" onClick={summarize}>
        <FileText className="h-3 w-3 mr-1" />
        Summarize
      </Button>
    );
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-1">
          <FileText className="h-4 w-4" />
          Thread Summary
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={summarize}
          disabled={summaryLoading}
        >
          <RefreshCw
            className={`h-3 w-3 ${summaryLoading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {summaryLoading ? (
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
          Summarizing thread...
        </div>
      ) : summary ? (
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-xs text-muted-foreground mb-1">TL;DR</p>
            <p>{summary.tldr}</p>
          </div>

          {summary.keyPoints.length > 0 && (
            <div>
              <p className="font-medium text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <ListChecks className="h-3 w-3" /> Key Points
              </p>
              <ul className="list-disc list-inside space-y-1">
                {summary.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {summary.actionItems.length > 0 && (
            <div>
              <p className="font-medium text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <CheckSquare className="h-3 w-3" /> Action Items
              </p>
              <ul className="list-disc list-inside space-y-1">
                {summary.actionItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
