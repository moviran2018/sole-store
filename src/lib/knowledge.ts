"use client";

export interface KnowledgeMedia {
  imageLinks: string[];
  audioLinks: string[];
  videoLinks: string[];
  documentLinks: string[];
  driveLinks: string[];
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  type: "faq" | "policy" | "product_info" | "shipping" | "custom";
  tags: string[];
  createdAt: string;
  media?: KnowledgeMedia;
}

const KNOWLEDGE_KEY = "sole_knowledge_base";
const KNOWLEDGE_TABLE = "knowledge_base";

function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch { return fallback; }
}
function lsSet(key: string, value: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

import { getSupabase, isSupabaseConfigured } from "./supabase";

export async function getKnowledgeBase(): Promise<KnowledgeEntry[]> {
  const local = lsGet<KnowledgeEntry[]>(KNOWLEDGE_KEY, []);

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await (supabase.from(KNOWLEDGE_TABLE) as any).select("*").order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          const merged = new Map<string, KnowledgeEntry>();
          for (const e of local) merged.set(e.id, e);
          for (const d of data) {
            let media: KnowledgeMedia | undefined;
            if (d.media) {
              try { media = typeof d.media === "string" ? JSON.parse(d.media) : d.media; } catch { }
            }
            merged.set(d.id, {
              id: d.id, title: d.title, content: d.content,
              type: d.type || "custom", tags: d.tags || [],
              createdAt: d.created_at || d.createdAt,
              media,
            });
          }
          return Array.from(merged.values());
        }
      }
    } catch { /* fall through */ }
  }

  return local;
}

export async function addKnowledge(entry: KnowledgeEntry): Promise<void> {
  const list = lsGet<KnowledgeEntry[]>(KNOWLEDGE_KEY, []);
  const idx = list.findIndex((e) => e.id === entry.id);
  idx !== -1 ? list[idx] = entry : list.unshift(entry);
  lsSet(KNOWLEDGE_KEY, list);

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase()!;
      await (supabase.from(KNOWLEDGE_TABLE) as any).upsert([{
        id: entry.id, title: entry.title, content: entry.content,
        type: entry.type, tags: entry.tags, created_at: entry.createdAt,
        media: entry.media ? JSON.stringify(entry.media) : null,
      }], { onConflict: "id" });
    } catch { }
  }
}

export async function deleteKnowledge(id: string): Promise<void> {
  lsSet(KNOWLEDGE_KEY, lsGet<KnowledgeEntry[]>(KNOWLEDGE_KEY, []).filter((e) => e.id !== id));
  if (isSupabaseConfigured()) {
    try { await (getSupabase()!.from(KNOWLEDGE_TABLE) as any).delete().eq("id", id); } catch { }
  }
}

export function buildKnowledgePrompt(entries: KnowledgeEntry[]): string {
  if (entries.length === 0) return "";
  const sections = entries.map((e) => {
    let text = `[${e.type}] ${e.title}\n${e.content}`;
    if (e.media) {
      if (e.media.imageLinks.length) text += `\nImages: ${e.media.imageLinks.join(", ")}`;
      if (e.media.audioLinks.length) text += `\nAudio: ${e.media.audioLinks.join(", ")}`;
      if (e.media.videoLinks.length) text += `\nVideos: ${e.media.videoLinks.join(", ")}`;
      if (e.media.documentLinks.length) text += `\nDocuments: ${e.media.documentLinks.join(", ")}`;
      if (e.media.driveLinks.length) text += `\nDrive: ${e.media.driveLinks.join(", ")}`;
    }
    return text;
  }).join("\n\n");
  return `Here is the store's knowledge base. Use it to answer customer questions accurately:\n\n${sections}`;
}
