"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Trash2, CheckCircle, AlertCircle } from "lucide-react";

interface Reminder {
  id: string;
  threadId: string;
  subject: string;
  senderEmail: string;
  remindAt: string;
  sent: boolean;
  createdAt: string;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    try {
      const res = await fetch("/api/reminders/list");
      const data = await res.json();
      if (data.reminders) setReminders(data.reminders);
    } catch (err) {
      console.error("Failed to fetch reminders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const deleteReminder = async (id: string) => {
    try {
      await fetch(`/api/reminders/list?id=${id}`, { method: "DELETE" });
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete reminder:", err);
    }
  };

  const pending = reminders.filter((r) => !r.sent);
  const sent = reminders.filter((r) => r.sent);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Clock className="h-6 w-6" />
        Follow-up Reminders
      </h1>

      {loading ? (
        <p className="text-muted-foreground">Loading reminders...</p>
      ) : reminders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No reminders set</p>
            <p className="text-sm text-muted-foreground">
              Open an email and click &quot;Remind Me&quot; to set one
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <h2 className="font-semibold text-sm text-muted-foreground mb-3">
                Pending ({pending.length})
              </h2>
              <div className="space-y-2">
                {pending.map((r) => (
                  <Card key={r.id}>
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">
                          {r.subject}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteReminder(r.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>From: {r.senderEmail}</span>
                        <span className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Remind: {new Date(r.remindAt).toLocaleDateString()}{" "}
                          {new Date(r.remindAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {sent.length > 0 && (
            <div>
              <h2 className="font-semibold text-sm text-muted-foreground mb-3">
                Sent ({sent.length})
              </h2>
              <div className="space-y-2">
                {sent.map((r) => (
                  <Card key={r.id} className="opacity-60">
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {r.subject}
                        </CardTitle>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Sent on {new Date(r.remindAt).toLocaleDateString()}
                      </p>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
