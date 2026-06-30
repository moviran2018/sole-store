export interface AiClient {
  ask(system: string, message: string): Promise<string>;
}

const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || "";
const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "https://api.groq.com/openai/v1/chat/completions";
const aiModel = process.env.NEXT_PUBLIC_AI_MODEL || "llama3-70b-8192";

export function getAiClient(): AiClient | null {
  if (!apiKey) return null;

  return {
    async ask(system: string, message: string): Promise<string> {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: aiModel,
          messages: [
            { role: "system", content: system },
            { role: "user", content: message },
          ],
          max_tokens: 512,
        }),
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content || "پاسخی دریافت نشد.";
    },
  };
}

export function hasAiConfigured(): boolean {
  return !!apiKey;
}
