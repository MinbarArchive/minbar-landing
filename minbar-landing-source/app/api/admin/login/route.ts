import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieOptions, createAdminSession, timingSafeTextEqual } from "@/lib/admin-auth";

const attempts = new Map<string, { count: number; resetAt: number }>();
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 6;

function clientAddress(request: Request) {
  return request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";
}

export async function POST(request: Request) {
  const expectedPassword = process.env.ADMIN_PANEL_PASSWORD?.trim() ?? "";
  if (!expectedPassword || !process.env.ADMIN_SESSION_SECRET?.trim()) {
    return NextResponse.json({ error: "Панель ещё не настроена" }, { status: 503 });
  }

  const address = clientAddress(request);
  const now = Date.now();
  const previous = attempts.get(address);
  const current = !previous || previous.resetAt <= now
    ? { count: 0, resetAt: now + ATTEMPT_WINDOW_MS }
    : previous;
  if (current.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
  }

  let password = "";
  try {
    const body = await request.json() as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Неверный запрос" }, { status: 400 });
  }

  if (password.length > 256 || !timingSafeTextEqual(password, expectedPassword)) {
    current.count += 1;
    attempts.set(address, current);
    await new Promise((resolve) => setTimeout(resolve, 350));
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  attempts.delete(address);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await createAdminSession(), adminCookieOptions);
  return response;
}
