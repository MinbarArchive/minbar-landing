import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth";
import { loadAdminDashboard, type AdminSubmission, type AdminSupportRequest, type AdminViolation } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Админка", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const number = new Intl.NumberFormat("ru-RU");
const dateTime = new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Moscow", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateTime.format(date);
}

const submissionStatus: Record<AdminSubmission["status"], string> = { pending: "Ожидает", reviewing: "Проверяется", approved: "Одобрена", rejected: "Отклонена" };
const supportStatus: Record<AdminSupportRequest["status"], string> = { open: "Новый", sending: "Отвечают", answered: "Закрыт", delivery_unknown: "Проверить доставку" };

function SubmissionRows({ items }: { items: AdminSubmission[] }) {
  if (!items.length) return <p className="admin-empty">Заявок пока нет.</p>;
  return <div className="admin-list">{items.map((item) => (
    <article className="admin-list-row" key={item.id}>
      <div><strong>{item.mosque}</strong><span>{item.city} · {item.language}</span></div>
      <div><span>Отправитель</span><strong>{item.username ? `@${item.username}` : `ID ${item.telegram_id}`}</strong></div>
      <div><span>Дата хутбы</span><strong>{item.khutba_date}</strong></div>
      <span className={`admin-status admin-status-${item.status}`}>{submissionStatus[item.status]}</span>
    </article>
  ))}</div>;
}

function SupportRows({ items }: { items: AdminSupportRequest[] }) {
  if (!items.length) return <p className="admin-empty">Обращений пока нет.</p>;
  return <div className="admin-list">{items.map((item) => (
    <article className="admin-message-row" key={item.id}>
      <div className="admin-message-meta"><strong>ID {item.telegram_id}</strong><span>{formatDate(item.created_at)}</span><span className={`admin-status admin-status-${item.status}`}>{supportStatus[item.status]}</span></div>
      <p>{item.question}</p>
    </article>
  ))}</div>;
}

function ViolationRows({ items }: { items: AdminViolation[] }) {
  if (!items.length) return <p className="admin-empty">Нарушений не зафиксировано.</p>;
  return <div className="admin-list">{items.map((item) => (
    <article className="admin-message-row" key={item.id}>
      <div className="admin-message-meta"><strong>{item.username ? `@${item.username}` : item.full_name || `ID ${item.telegram_id}`}</strong><span>ID {item.telegram_id}</span><span>{formatDate(item.created_at)}</span></div>
      <p><b>{item.reason}</b>{item.content ? ` — «${item.content}»` : ""}</p>
    </article>
  ))}</div>;
}

export default async function AdminPage() {
  if (!(await hasAdminSession())) redirect("/admin/login");

  let data;
  try {
    data = await loadAdminDashboard();
  } catch {
    return <main className="admin-shell section-shell"><section className="admin-error-card"><p className="eyebrow">Админка Minbar</p><h1>Данные временно недоступны</h1><p>Вход работает, но защищённый канал к статистике ещё не отвечает. Попробуйте обновить страницу позже.</p><form action="/api/admin/logout" method="post"><button className="button button-secondary">Выйти</button></form></section></main>;
  }

  const queue = data.moderation.recent.filter((item) => item.status === "pending" || item.status === "reviewing");
  const history = data.moderation.recent.filter((item) => item.status === "approved" || item.status === "rejected");

  return (
    <main className="admin-shell section-shell">
      <header className="admin-heading">
        <div><p className="eyebrow">Закрытый раздел</p><h1>Админка Minbar</h1><p>Обновлено {formatDate(data.generated_at)} · время московское</p></div>
        <div className="admin-heading-actions"><Link className="button button-secondary" href="/">Открыть сайт</Link><form action="/api/admin/logout" method="post"><button className="button button-secondary">Выйти</button></form></div>
      </header>

      <section className="admin-metrics" aria-label="Основные показатели">
        <article><span>Пользователей</span><strong>{number.format(data.users.total)}</strong><small>+{number.format(data.users.today)} активных сегодня</small></article>
        <article><span>Хутб в архиве</span><strong>{number.format(data.archive.total)}</strong><small>{data.archive.cities} городов · {data.archive.mosques} мечетей</small></article>
        <article className={data.moderation.pending ? "is-attention" : ""}><span>Ждут проверки</span><strong>{number.format(data.moderation.pending)}</strong><small>{data.moderation.reviewing} сейчас проверяются</small></article>
        <article className={data.support.open ? "is-attention" : ""}><span>Открытых вопросов</span><strong>{number.format(data.support.open)}</strong><small>обращения пользователей</small></article>
      </section>

      <section className="admin-secondary-metrics">
        <p><span>Активны 7 дней</span><strong>{number.format(data.users.last_7_days)}</strong></p><p><span>Активны 30 дней</span><strong>{number.format(data.users.last_30_days)}</strong></p><p><span>Избранных записей</span><strong>{number.format(data.favorites.total)}</strong></p><p><span>Готово расшифровок</span><strong>{number.format(data.archive.transcripts_ready)}</strong></p><p><span>Ждут расшифровки</span><strong>{number.format(data.archive.transcripts_pending)}</strong></p><p><span>Нарушений</span><strong>{number.format(data.violations.total)}</strong></p>
      </section>

      <section className="admin-section"><div className="admin-section-heading"><div><p className="eyebrow">Модерация</p><h2>На проверке</h2></div><span>{queue.length}</span></div><SubmissionRows items={queue} /></section>
      <section className="admin-section"><div className="admin-section-heading"><div><p className="eyebrow">Поддержка</p><h2>Обращения</h2></div><span>{data.support.open} открыто</span></div><SupportRows items={data.support.recent} /></section>
      <section className="admin-section"><div className="admin-section-heading"><div><p className="eyebrow">Безопасность</p><h2>Журнал нарушений</h2></div><span>{data.violations.total}</span></div><ViolationRows items={data.violations.recent} /></section>
      <section className="admin-section"><div className="admin-section-heading"><div><p className="eyebrow">История</p><h2>Проверенные заявки</h2></div><span>{data.moderation.approved} одобрено · {data.moderation.rejected} отклонено</span></div><SubmissionRows items={history} /></section>

      <section className="admin-section">
        <div className="admin-section-heading"><div><p className="eyebrow">Архив</p><h2>Последние хутбы</h2></div><Link href="/archive">Открыть архив →</Link></div>
        <div className="admin-list">{data.recent_khutbas.map((item) => (
          <article className="admin-list-row admin-khutba-row" key={item.id}><div><strong>{item.topic || item.title}</strong><span>{item.imam || "Хазрат не указан"}</span></div><div><span>Мечеть</span><strong>{item.mosque} · {item.city}</strong></div><div><span>Дата</span><strong>{item.date}</strong></div><Link href={`/khutba/${item.id}`}>Открыть →</Link></article>
        ))}</div>
      </section>
    </main>
  );
}
