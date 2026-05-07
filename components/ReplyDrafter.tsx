"use client";

import { useState } from "react";
import { useEmailStore } from "@/store/emailStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Send, RefreshCw, Pencil, Check } from "lucide-react";

export default function ReplyDrafter() {
  const {
    selectedEmail,
    draft,
    setDraft,
    draftTone,
    setDraftTone,
    draftLoading,
    setDraftLoading,
  } = useEmailStore();
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!selectedEmail) return null;

  const generateDraft = async () => {
    setDraftLoading(true);
    try {
      const res = await fetch("/api/emails/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: selectedEmail.threadId,
          tone: draftTone,
        }),
      });
      const data = await res.json();
      if (data.draft) {
        setDraft(data.draft);
      } else {
        setDraft("Error: " + (data.error || "Failed to generate draft"));
      }
    } catch (err) {
      setDraft("Error generating draft. Please try again.");
      console.error(err);
    } finally {
      setDraftLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendReply = async () => {
    if (!draft || !selectedEmail) return;
    setSending(true);
    try {
      const senderEmail =
        selectedEmail.from.match(/<(.+?)>/)?.[1] || selectedEmail.from;
      const res = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: senderEmail,
          subject: `Re: ${selectedEmail.subject}`,
          body: draft,
          threadId: selectedEmail.threadId,
        }),
      });
      if (res.ok) {
        setSent(true);
        setTimeout(() => setSent(false), 3000);
      }
    } catch (err) {
      console.error("Failed to send:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">AI Draft Reply</h3>
        <div className="flex items-center gap-2">
          <Select value={draftTone} onValueChange={setDraftTone}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="brief">Brief / Concise</SelectItem>
              <SelectItem value="assertive">Assertive</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="outline"
            onClick={generateDraft}
            disabled={draftLoading}
          >
            <RefreshCw
              className={`h-3 w-3 mr-1 ${draftLoading ? "animate-spin" : ""}`}
            />
            {draft ? "Regenerate" : "Generate"}
          </Button>
        </div>
      </div>

      {draftLoading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
          Generating draft...
        </div>
      ) : draft ? (
        <>
          {isEditing ? (
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={8}
              className="text-sm"
            />
          ) : (
            <div className="bg-muted/50 rounded-md p-3 text-sm whitespace-pre-wrap">
              {draft}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil className="h-3 w-3 mr-1" />
              {isEditing ? "Preview" : "Edit"}
            </Button>
            <Button size="sm" variant="outline" onClick={copyToClipboard}>
              {copied ? (
                <Check className="h-3 w-3 mr-1" />
              ) : (
                <Copy className="h-3 w-3 mr-1" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              size="sm"
              onClick={sendReply}
              disabled={sending || sent}
            >
              {sent ? (
                <Check className="h-3 w-3 mr-1" />
              ) : (
                <Send className="h-3 w-3 mr-1" />
              )}
              {sent ? "Sent!" : sending ? "Sending..." : "Send via Gmail"}
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Click &quot;Generate&quot; to create an AI-powered reply draft
        </p>
      )}
    </div>
  );
}
