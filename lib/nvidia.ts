import type { LLMResponse } from "./groq";

export async function callNvidiaNIM(
  systemPrompt: string,
  userPrompt: string
): Promise<LLMResponse> {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  if (!apiKey || apiKey === "your_nvidia_nim_api_key_here") {
    throw new Error("NVIDIA_NIM_API_KEY not configured");
  }

  const response = await fetch(
    "https://integrate.api.nvidia.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct-v0.3",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: false,
      }),
    }
  );

  if (!response.ok) {
    const err = new Error(`NVIDIA NIM API error: ${response.status}`) as Error & {
      status: number;
    };
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || "",
    model: "nvidia/mistral-7b-instruct-v0.3",
  };
}
