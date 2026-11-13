import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = { title: "Вход в админку", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) redirect("/admin");
  return (
    <main className="admin-login-shell section-shell">
      <section className="admin-login-card">
        <p className="eyebrow">Закрытый раздел</p>
        <h1>Админка Minbar</h1>
        <p>Статистика, новые записи, обращения и журнал модерации в одном месте.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
