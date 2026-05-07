export interface LLMResponse {
  content: string;
  model: string;
}

export async function callGroq(
  systemPrompt: string,
  userPrompt: string
): Promise<LLMResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    throw new Error("GROQ_API_KEY not configured");
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    }
  );

  if (!response.ok) {
    const err = new Error(`Groq API error: ${response.status}`) as Error & {
      status: number;
    };
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const remaining = response.headers.get("x-ratelimit-remaining-requests");
  if (remaining) {
    console.log(`Groq rate limit remaining: ${remaining}`);
  }

  return {
    content: data.choices[0]?.message?.content || "",
    model: "groq/llama3-8b-8192",
  };
}
