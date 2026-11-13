export type AdminSubmission = { id: string; telegram_id: number; username: string | null; language: string; city: string; mosque: string; imam: string | null; khutba_date: string; status: "pending" | "reviewing" | "approved" | "rejected"; created_at: string; reviewed_at: string | null };
export type AdminSupportRequest = { id: string; telegram_id: number; question: string; status: "open" | "sending" | "answered" | "delivery_unknown"; created_at: string };
export type AdminViolation = { id: number; telegram_id: number; username: string | null; full_name: string | null; kind: "bad_text" | "rejected_audio"; field: string | null; content: string | null; reason: string; created_at: string };
export type AdminRecentKhutba = { id: number; title: string; topic: string | null; imam: string | null; mosque: string; city: string; language: string; date: string; transcription_status: "pending" | "processing" | "ready" | "failed"; created_at: string };

export type AdminDashboard = {
  generated_at: string;
  users: { total: number; today: number; last_7_days: number; last_30_days: number };
  archive: { total: number; cities: number; mosques: number; transcripts_ready: number; transcripts_pending: number };
  moderation: { pending: number; reviewing: number; approved: number; rejected: number; recent: AdminSubmission[] };
  support: { open: number; recent: AdminSupportRequest[] };
  violations: { total: number; recent: AdminViolation[] };
  favorites: { total: number };
  recent_khutbas: AdminRecentKhutba[];
};

export async function loadAdminDashboard(): Promise<AdminDashboard> {
  const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/$/, "");
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secret = process.env.ADMIN_DATA_SECRET;
  if (!url || !key || !secret) throw new Error("admin_dashboard_not_configured");

  const response = await fetch(`${url}/rest/v1/rpc/minbar_admin_dashboard`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_secret: secret }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`admin_dashboard_unavailable_${response.status}`);
  return await response.json() as AdminDashboard;
}
