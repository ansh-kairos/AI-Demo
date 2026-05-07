import { callGroq, type LLMResponse } from "./groq";
import { callNvidiaNIM } from "./nvidia";

export type { LLMResponse };

export async function callLLM(
  systemPrompt: string,
  userPrompt: string
): Promise<LLMResponse> {
  try {
    return await callGroq(systemPrompt, userPrompt);
  } catch (err: unknown) {
    const error = err as Error & { status?: number };
    if (
      error.status === 429 ||
      error.message?.includes("rate") ||
      error.message?.includes("GROQ_API_KEY not configured")
    ) {
      console.warn("Groq unavailable, falling back to NVIDIA NIM:", error.message);
      try {
        return await callNvidiaNIM(systemPrompt, userPrompt);
      } catch (nimErr: unknown) {
        const nimError = nimErr as Error;
        if (nimError.message?.includes("NVIDIA_NIM_API_KEY not configured")) {
          throw new Error(
            "No LLM API keys configured. Please set GROQ_API_KEY or NVIDIA_NIM_API_KEY."
          );
        }
        throw nimErr;
      }
    }
    throw err;
  }
}
