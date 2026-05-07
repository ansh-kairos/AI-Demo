export interface EmailForPriority {
  id: string;
  subject: string;
  snippet: string;
  from: string;
}

export function buildPriorityPrompt(emails: EmailForPriority[]) {
  const systemPrompt = `You are an email prioritization engine. Score each email's urgency from 1-5. Return JSON only. No explanation outside JSON.
Score guide: 5=requires immediate action today, 4=important/needs reply soon, 3=normal request, 2=low priority, 1=newsletter/automated/promotional`;

  const userPrompt = `Score the urgency of these emails. Return ONLY a JSON array, no other text:
[{ "id": "...", "score": 1-5, "label": "urgent|medium|low", "reason": "brief reason" }]

Emails:
${JSON.stringify(
  emails.map((e) => ({
    id: e.id,
    subject: e.subject,
    snippet: e.snippet,
    from: e.from,
  }))
)}`;

  return { systemPrompt, userPrompt };
}
