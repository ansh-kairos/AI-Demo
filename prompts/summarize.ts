export interface SummaryThread {
  messages: { from: string; date: string; body: string }[];
}

export function buildSummaryPrompt(thread: SummaryThread) {
  const systemPrompt = `You are an expert at summarizing email threads. Be concise and accurate. Return JSON only.`;

  const userPrompt = `Summarize this email thread. Return ONLY valid JSON in this exact format, no other text:
{
  "tldr": "One sentence summary",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "actionItems": ["action 1", "action 2"]
}

Thread:
${thread.messages
  .map((m) => `From: ${m.from}\nDate: ${m.date}\n${m.body}`)
  .join("\n---\n")}`;

  return { systemPrompt, userPrompt };
}
