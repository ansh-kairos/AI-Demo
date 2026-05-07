import { prisma } from "./prisma";

export interface EmailMeta {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
  isRead: boolean;
}

export interface ThreadMessage {
  id: string;
  from: string;
  to: string;
  date: string;
  body: string;
}

const DEMO_EMAILS: EmailMeta[] = [
  {
    id: "demo_1",
    threadId: "thread_1",
    subject: "Invoice #1234 - Payment Overdue",
    from: "John Smith <john@clientcorp.com>",
    snippet: "Hi, just following up on the invoice from last week. The payment was due on Monday and we haven't received it yet...",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: "demo_2",
    threadId: "thread_2",
    subject: "Project Update - Q2 Deliverables",
    from: "Sarah Johnson <sarah@agency.io>",
    snippet: "Hey! Just checking in on the project timeline. The client is asking for an update on the Q2 deliverables...",
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: "demo_3",
    threadId: "thread_3",
    subject: "Re: Meeting Tomorrow at 3pm",
    from: "Mike Chen <mike@techstartup.co>",
    snippet: "Confirmed! I'll bring the presentation slides. Let me know if you need anything else prepared...",
    date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: "demo_4",
    threadId: "thread_4",
    subject: "URGENT: Server Down - Production Issue",
    from: "DevOps Alert <alerts@monitoring.dev>",
    snippet: "Critical alert: Production server app-prod-01 is unresponsive. CPU usage at 98%. Immediate action required...",
    date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: "demo_5",
    threadId: "thread_5",
    subject: "New Partnership Opportunity",
    from: "Lisa Wong <lisa@ventures.capital>",
    snippet: "I came across your product and I think there's a great synergy here. Would love to schedule a call to discuss...",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: "demo_6",
    threadId: "thread_6",
    subject: "Weekly Newsletter - Tech Roundup",
    from: "TechDigest <newsletter@techdigest.io>",
    snippet: "This week in tech: AI advances, new frameworks released, and more. Read the full roundup inside...",
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: "demo_7",
    threadId: "thread_7",
    subject: "Contract Renewal - Due Next Week",
    from: "Legal Team <legal@bigclient.com>",
    snippet: "Please review the attached contract renewal terms. We need your signature by end of next week to continue...",
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: "demo_8",
    threadId: "thread_8",
    subject: "Feedback on Design Mockups",
    from: "Anna Designer <anna@creative.studio>",
    snippet: "I've attached the revised mockups based on your feedback. The hero section now has the gradient you mentioned...",
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
];

const DEMO_THREADS: Record<string, ThreadMessage[]> = {
  thread_1: [
    {
      id: "msg_1a",
      from: "John Smith <john@clientcorp.com>",
      to: "you@example.com",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      body: "Hi,\n\nI'm sending over invoice #1234 for the website redesign project. Total amount: $4,500. Payment is due by next Monday.\n\nPlease let me know if you have any questions.\n\nBest,\nJohn",
    },
    {
      id: "msg_1b",
      from: "John Smith <john@clientcorp.com>",
      to: "you@example.com",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      body: "Hi,\n\nJust following up on the invoice from last week. The payment was due on Monday and we haven't received it yet. Could you please process it ASAP?\n\nIf there are any issues with the invoice, please let me know so we can resolve them.\n\nThanks,\nJohn",
    },
  ],
  thread_2: [
    {
      id: "msg_2a",
      from: "Sarah Johnson <sarah@agency.io>",
      to: "you@example.com",
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      body: "Hey!\n\nJust checking in on the project timeline. The client is asking for an update on the Q2 deliverables. Could you share where things stand?\n\nSpecifically, they want to know:\n1. Landing page progress\n2. API integration status\n3. Estimated launch date\n\nThanks!\nSarah",
    },
  ],
  thread_3: [
    {
      id: "msg_3a",
      from: "you@example.com",
      to: "Mike Chen <mike@techstartup.co>",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      body: "Hi Mike,\n\nCan we meet tomorrow at 3pm to discuss the integration plan? I have some ideas for the API architecture.\n\nBest",
    },
    {
      id: "msg_3b",
      from: "Mike Chen <mike@techstartup.co>",
      to: "you@example.com",
      date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      body: "Confirmed! I'll bring the presentation slides. Let me know if you need anything else prepared.\n\nLooking forward to it!\nMike",
    },
  ],
  thread_4: [
    {
      id: "msg_4a",
      from: "DevOps Alert <alerts@monitoring.dev>",
      to: "you@example.com",
      date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      body: "CRITICAL ALERT\n\nServer: app-prod-01\nStatus: UNRESPONSIVE\nCPU Usage: 98%\nMemory: 95%\nLast healthy: 30 minutes ago\n\nImmediate action required. Please investigate and resolve ASAP.\n\n-- Monitoring System",
    },
  ],
  thread_5: [
    {
      id: "msg_5a",
      from: "Lisa Wong <lisa@ventures.capital>",
      to: "you@example.com",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      body: "Hi there,\n\nI came across your product and I think there's a great synergy between what you're building and our portfolio companies. We invest in AI-first tools and would love to learn more.\n\nWould you be open to a 30-minute call next week? Happy to work around your schedule.\n\nBest regards,\nLisa Wong\nPartner, Ventures Capital",
    },
  ],
  thread_6: [
    {
      id: "msg_6a",
      from: "TechDigest <newsletter@techdigest.io>",
      to: "you@example.com",
      date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      body: "# This Week in Tech\n\n- OpenAI releases GPT-5 with 1M context window\n- React 19 goes stable with new compiler\n- Rust adoption grows 40% in enterprise\n- New CSS features land in all browsers\n\nRead more at techdigest.io\n\nUnsubscribe: techdigest.io/unsubscribe",
    },
  ],
  thread_7: [
    {
      id: "msg_7a",
      from: "Legal Team <legal@bigclient.com>",
      to: "you@example.com",
      date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      body: "Dear Contractor,\n\nPlease review the attached contract renewal terms for the upcoming fiscal year. Key changes include:\n\n1. Rate adjustment: 5% increase\n2. Scope expansion: includes mobile app maintenance\n3. Term: 12 months (renewable)\n\nWe need your signature by end of next week to ensure continuity of service.\n\nPlease reach out if you have any questions or concerns about the terms.\n\nBest regards,\nLegal Team\nBigClient Inc.",
    },
  ],
  thread_8: [
    {
      id: "msg_8a",
      from: "Anna Designer <anna@creative.studio>",
      to: "you@example.com",
      date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      body: "Hi!\n\nI've attached the revised mockups based on your feedback. Here's what changed:\n\n- Hero section now has the gradient you mentioned\n- CTA buttons are larger and more prominent\n- Mobile layout has been completely reworked\n- Added the testimonials section\n\nLet me know your thoughts! Happy to iterate further.\n\nCheers,\nAnna",
    },
  ],
};

export async function listInboxEmails(
  _userId: string,
  _maxResults = 20
): Promise<EmailMeta[]> {
  return DEMO_EMAILS;
}

export async function getThread(
  _userId: string,
  threadId: string
): Promise<{ messages: ThreadMessage[] }> {
  const messages = DEMO_THREADS[threadId] || [
    {
      id: "fallback",
      from: "Unknown <unknown@example.com>",
      to: "you@example.com",
      date: new Date().toISOString(),
      body: "This email thread could not be found.",
    },
  ];
  return { messages };
}

export async function sendEmail(
  userId: string,
  to: string,
  subject: string,
  body: string,
  _threadId?: string
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  console.log(
    `[Demo Mode] Sending email from ${user?.email} to ${to}: ${subject}\n${body}`
  );
  return { id: `sent_${Date.now()}` };
}
