export interface ReplyContext {
  messages: { from: string; body: string }[];
}

export interface UserContext {
  name: string;
  role: string;
}

export function buildReplyPrompt(
  thread: ReplyContext,
  tone: string,
  user: UserContext
) {
  const systemPrompt = `You are a professional email assistant. Your job is to draft a clear, concise, and ${tone} email reply on behalf of ${user.name}, who is a ${user.role}.

Rules:
- Keep the reply under 150 words unless the thread requires more detail
- Match the tone: ${tone}
- Do not use filler phrases like "I hope this email finds you well"
- End with an appropriate sign-off
- Do not add subject line — only the body
- If you need a placeholder (like a date or number), use [PLACEHOLDER] format`;

  const userPrompt = `Draft a reply to the following email thread.

Last messages in thread:
${thread.messages
  .slice(-5)
  .map((m) => `From: ${m.from}\n${m.body}`)
  .join("\n---\n")}

User's name: ${user.name}
User's role: ${user.role}
Reply tone: ${tone}

Write only the reply body. No subject line.`;

  return { systemPrompt, userPrompt };
}
