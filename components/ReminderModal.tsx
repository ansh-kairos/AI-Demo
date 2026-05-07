"use client";

import { useState } from "react";
import { type Email } from "@/store/emailStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Clock, Check } from "lucide-react";

interface ReminderModalProps {
  email: Email;
}

export default function ReminderModal({ email }: ReminderModalProps) {
  const [open, setOpen] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createReminder = async (remindAt: Date) => {
    setLoading(true);
    setError("");
    try {
      const senderEmail =
        email.from.match(/<(.+?)>/)?.[1] || email.from;
      const res = await fetch("/api/reminders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: email.threadId,
          subject: email.subject,
          senderEmail,
          remindAt: remindAt.toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
        }, 1500);
      } else {
        setError(data.error || "Failed to create reminder");
      }
    } catch {
      setError("Failed to create reminder");
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    { label: "1 day", days: 1 },
    { label: "3 days", days: 3 },
    { label: "1 week", days: 7 },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Clock className="h-3 w-3 mr-1" />
          Remind Me
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Follow-up Reminder</DialogTitle>
          <DialogDescription>
            Get notified to follow up on: {email.subject}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex items-center justify-center py-6 text-green-600">
            <Check className="h-6 w-6 mr-2" />
            Reminder set!
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              {presets.map((p) => (
                <Button
                  key={p.days}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + p.days);
                    d.setHours(9, 0, 0, 0);
                    createReminder(d);
                  }}
                >
                  {p.label}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
              <Button
                disabled={!customDate || loading}
                onClick={() => createReminder(new Date(customDate))}
              >
                Set
              </Button>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
