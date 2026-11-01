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

function mapKhutba(record: SupabaseKhutba): Khutba {
  const date = new Date(`${record.date}T12:00:00`);
  const formattedDate = Number.isNaN(date.getTime())
    ? record.date
    : new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(date);
  const durationMinutes = Number.parseInt(record.duration ?? "0", 10);
  const topic = record.topic?.trim();
  const usefulTopic = topic && !["без темы", "хутба", "пятничная хутба"].includes(topic.toLocaleLowerCase("ru"))
    ? topic
    : undefined;
  return {
    id: record.id,
    title: usefulTopic ?? record.title,
    topic: usefulTopic,
    imam: record.imam ?? "Хазрат не указан",
    mosque: record.mosque,
    city: record.city,
    language: record.language,
    date: formattedDate,
    isoDate: record.date,
    duration: record.duration ?? "Длительность не указана",
    durationSeconds: Number.isFinite(durationMinutes) && durationMinutes > 0 ? durationMinutes * 60 : 1800,
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

export async function uploadKhutba(formData: FormData) {
  const config = getConfig();
  if (!config) throw new Error("Supabase пока не подключён к этой версии сайта.");

  const audio = formData.get("audio");
  if (!(audio instanceof File) || audio.size === 0) throw new Error("Выберите MP3-файл.");
  const cleanName = audio.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const fileName = `${Date.now()}-${cleanName}`;
  const storageResponse = await fetch(`${config.url}/storage/v1/object/khutbas/${encodeURIComponent(fileName)}`, {
    method: "POST",
    headers: { apikey: config.key, Authorization: `Bearer ${config.key}`, "Content-Type": audio.type || "audio/mpeg", "x-upsert": "false" },
    body: audio,
  });
  if (!storageResponse.ok) throw new Error("Не удалось загрузить аудиофайл.");

  const audioUrl = `${config.url}/storage/v1/object/public/khutbas/${encodeURIComponent(fileName)}`;
  const mosque = String(formData.get("mosque") ?? "");
  const record = {
    title: `Пятничная хутба — ${mosque}`,
    topic: "Пятничная хутба",
    imam: String(formData.get("imam") ?? "").trim() || null,
    mosque,
    city: String(formData.get("city") ?? ""),
    language: String(formData.get("language") ?? "Русский"),
    date: String(formData.get("date") ?? ""),
    duration: null,
    audio_url: audioUrl,
  };
  if (!record.mosque || !record.city || !record.date) throw new Error("Заполните все обязательные поля.");
  const date = new Date(`${record.date}T12:00:00`);
  if (Number.isNaN(date.getTime()) || date.getDay() !== 5) throw new Error("Выберите дату пятничной хутбы.");

  const insertResponse = await fetch(`${config.url}/rest/v1/khutbas`, {
    method: "POST",
    headers: { apikey: config.key, Authorization: `Bearer ${config.key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(record),
  });
  if (!insertResponse.ok) throw new Error("Аудио загружено, но запись не удалось добавить в архив.");
}
