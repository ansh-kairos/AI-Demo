"use client";

import { useCallback, useEffect } from "react";
import { useEmailStore } from "@/store/emailStore";
import EmailList from "@/components/EmailList";
import EmailDetail from "@/components/EmailDetail";

export default function DashboardPage() {
  const { setEmails, setLoading, updateEmailPriority, selectedEmail } =
    useEmailStore();

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/emails/list");
      const data = await res.json();
      if (data.emails) {
        setEmails(data.emails);

        try {
          const priorityRes = await fetch("/api/emails/prioritize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              emails: data.emails.map(
                (e: { id: string; subject: string; snippet: string; from: string }) => ({
                  id: e.id,
                  subject: e.subject,
                  snippet: e.snippet,
                  from: e.from,
                })
              ),
            }),
          });
          const priorityData = await priorityRes.json();
          if (priorityData.scores) {
            for (const score of priorityData.scores) {
              updateEmailPriority(
                score.id,
                score.score,
                score.label,
                score.reason
              );
            }
          }
        } catch (err) {
          console.error("Failed to prioritize:", err);
        }
      }
    } catch (err) {
      console.error("Failed to fetch emails:", err);
    } finally {
      setLoading(false);
    }
  }, [setEmails, setLoading, updateEmailPriority]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  return (
    <div className="flex h-full">
      <div
        className={`w-full md:w-[400px] lg:w-[450px] border-r flex-shrink-0 overflow-hidden ${
          selectedEmail ? "hidden md:flex md:flex-col" : "flex flex-col"
        }`}
      >
        <EmailList onRefresh={fetchEmails} />
      </div>
      <div
        className={`flex-1 ${
          selectedEmail ? "flex" : "hidden md:flex"
        }`}
      >
        <EmailDetail />
      </div>
    </div>
  );
}
