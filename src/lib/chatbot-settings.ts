"use client";

export interface ChatbotSettings {
  systemPrompt: string;
}

const SETTINGS_KEY = "sole_chatbot_settings";
const SETTINGS_TABLE = "chatbot_settings";
const SETTINGS_ID = "main";

function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch { return fallback; }
}
function lsSet(key: string, value: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

import { getSupabase, isSupabaseConfigured } from "./supabase";

export function getChatbotSettings(): ChatbotSettings {
  return lsGet<ChatbotSettings>(SETTINGS_KEY, { systemPrompt: "" });
}

export async function saveChatbotSettings(settings: ChatbotSettings): Promise<void> {
  lsSet(SETTINGS_KEY, settings);

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase()!;
      await (supabase.from(SETTINGS_TABLE) as any).upsert([{
        id: SETTINGS_ID,
        system_prompt: settings.systemPrompt,
        updated_at: new Date().toISOString(),
      }], { onConflict: "id" });
    } catch { }
  }
}

export async function loadChatbotSettings(): Promise<ChatbotSettings> {
  const local = getChatbotSettings();

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase()!;
      const { data, error } = await (supabase.from(SETTINGS_TABLE) as any).select("*").eq("id", SETTINGS_ID).single();
      if (!error && data) {
        return { systemPrompt: data.system_prompt || local.systemPrompt };
      }
    } catch { }
  }

  return local;
}
