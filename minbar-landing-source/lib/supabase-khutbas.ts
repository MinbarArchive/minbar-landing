import type { Khutba } from "@/lib/khutbas";
import { getKhutba, khutbas as fallbackKhutbas } from "@/lib/khutbas";

type SupabaseKhutba = {
  id: number;
  title: string;
  topic: string | null;
  imam: string | null;
  mosque: string;
  city: string;
  language: string;
  date: string;
  duration: string | null;
  audio_url: string;
  transcript: string | null;
  ai_summary: string | null;
  transcription_status: "pending" | "processing" | "ready" | "failed" | null;
};

function getConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}
function parseDurationSeconds(value: string | null) {
  if (!value) return 1800;
  const normalized = value.trim().toLocaleLowerCase("ru");
  const seconds = normalized.match(/^(\d+)\s*сек/);
  if (seconds) return Number(seconds[1]);
  const minutes = normalized.match(/^(\d+)\s*мин/);
  if (minutes) return Number(minutes[1]) * 60;
  const clock = normalized.match(/^(?:(\d+):)?(\d{1,2}):(\d{2})$/);
  if (clock) return Number(clock[1] ?? 0) * 3600 + Number(clock[2]) * 60 + Number(clock[3]);
  return 1800;
}

function displayTitle(value: string | null | undefined, mosque: string) {
  const title = String(value ?? "")
    .replace(/^хутба\s+на\s+тему\s*[:—-]?\s*/i, "")
    .replace(/^тема\s*[:—-]\s*/i, "")
    .trim();
  const generic = new Set(["", "без темы", "хутба", "пятничная хутба"]);
  return generic.has(title.toLocaleLowerCase("ru"))
    ? `Хутба из мечети «${mosque}»`
    : title;
}

function mapKhutba(record: SupabaseKhutba): Khutba {
  const date = new Date(`${record.date}T12:00:00`);
  const formattedDate = Number.isNaN(date.getTime())
    ? record.date
    : new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(date);
  const topic = record.topic?.trim();
  const usefulTopic = topic && !["без темы", "хутба", "пятничная хутба"].includes(topic.toLocaleLowerCase("ru"))
    ? topic
    : undefined;
  return {
    id: record.id,
    title: displayTitle(usefulTopic ?? record.title, record.mosque),
    topic: usefulTopic,
    imam: record.imam ?? "Хазрат не указан",
    mosque: record.mosque,
    city: record.city,
    language: record.language,
    date: formattedDate,
    isoDate: record.date,
    duration: record.duration ?? "Длительность не указана",
    durationSeconds: parseDurationSeconds(record.duration),
    summary: record.ai_summary?.trim() || `Пятничная хутба, прочитанная в мечети ${record.mosque}.`,
    audioUrl: record.audio_url,
    transcript: record.transcript?.trim() || undefined,
    transcriptionStatus: record.transcription_status ?? undefined,
  };
}

export async function loadKhutbas(): Promise<Khutba[]> {
  const config = getConfig();
  if (!config) return fallbackKhutbas;
  try {
    const response = await fetch(`${config.url}/rest/v1/khutbas?select=*&order=date.desc`, {
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
      next: { revalidate: 60 },
    });
    if (!response.ok) return fallbackKhutbas;
    const records = await response.json() as SupabaseKhutba[];
    return records.length ? records.map(mapKhutba) : fallbackKhutbas;
  } catch {
    return fallbackKhutbas;
  }
}

export async function loadKhutba(id: number): Promise<Khutba | undefined> {
  const config = getConfig();
  if (!config) return getKhutba(id);
  try {
    const response = await fetch(`${config.url}/rest/v1/khutbas?id=eq.${id}&select=*&limit=1`, {
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
      next: { revalidate: 60 },
    });
    if (!response.ok) return getKhutba(id);
    const records = await response.json() as SupabaseKhutba[];
    return records[0] ? mapKhutba(records[0]) : getKhutba(id);
  } catch {
    return getKhutba(id);
  }
}

