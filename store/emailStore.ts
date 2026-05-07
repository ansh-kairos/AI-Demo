import { create } from "zustand";

export interface Email {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
  isRead: boolean;
  urgencyScore?: number;
  urgencyLabel?: "urgent" | "medium" | "low";
  urgencyReason?: string;
}

export interface ThreadSummary {
  tldr: string;
  keyPoints: string[];
  actionItems: string[];
}

export interface Reminder {
  id: string;
  threadId: string;
  subject: string;
  senderEmail: string;
  remindAt: string;
  sent: boolean;
  createdAt: string;
}

interface EmailStore {
  emails: Email[];
  selectedEmail: Email | null;
  loading: boolean;
  sortBy: "urgency" | "date";
  draft: string;
  draftTone: string;
  draftLoading: boolean;
  summary: ThreadSummary | null;
  summaryLoading: boolean;
  reminders: Reminder[];

  setEmails: (emails: Email[]) => void;
  setSelectedEmail: (email: Email | null) => void;
  setLoading: (loading: boolean) => void;
  setSortBy: (sortBy: "urgency" | "date") => void;
  setDraft: (draft: string) => void;
  setDraftTone: (tone: string) => void;
  setDraftLoading: (loading: boolean) => void;
  setSummary: (summary: ThreadSummary | null) => void;
  setSummaryLoading: (loading: boolean) => void;
  setReminders: (reminders: Reminder[]) => void;
  updateEmailPriority: (
    id: string,
    score: number,
    label: "urgent" | "medium" | "low",
    reason: string
  ) => void;
}

export const useEmailStore = create<EmailStore>((set) => ({
  emails: [],
  selectedEmail: null,
  loading: false,
  sortBy: "urgency",
  draft: "",
  draftTone: "professional",
  draftLoading: false,
  summary: null,
  summaryLoading: false,
  reminders: [],

  setEmails: (emails) => set({ emails }),
  setSelectedEmail: (email) => set({ selectedEmail: email, draft: "", summary: null }),
  setLoading: (loading) => set({ loading }),
  setSortBy: (sortBy) => set({ sortBy }),
  setDraft: (draft) => set({ draft }),
  setDraftTone: (tone) => set({ draftTone: tone }),
  setDraftLoading: (loading) => set({ draftLoading: loading }),
  setSummary: (summary) => set({ summary }),
  setSummaryLoading: (loading) => set({ summaryLoading: loading }),
  setReminders: (reminders) => set({ reminders }),
  updateEmailPriority: (id, score, label, reason) =>
    set((state) => ({
      emails: state.emails.map((e) =>
        e.id === id
          ? { ...e, urgencyScore: score, urgencyLabel: label, urgencyReason: reason }
          : e
      ),
    })),
}));
