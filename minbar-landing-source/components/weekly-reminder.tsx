"use client";

import { useEffect, useState } from "react";

const reminders = [
  {
    theme: "Джума",
    quote: "Устремляйтесь к поминанию Аллаха и оставьте торговлю.",
    source: "Коран, 62:9",
    href: "https://quran.com/62/9",
  },
  {
    theme: "Поминание",
    quote: "Воистину, сердца находят покой в поминании Аллаха.",
    source: "Коран, 13:28",
    href: "https://quran.com/13/28",
  },
  {
    theme: "Надежда",
    quote: "Воистину, за каждой тягостью наступает облегчение.",
    source: "Коран, 94:6",
    href: "https://quran.com/94/6",
  },
] as const;

function getHourlyReminderIndex(timestamp: number) {
  return Math.floor(timestamp / 3_600_000) % reminders.length;
}

export function WeeklyReminder() {
  const [reminderIndex, setReminderIndex] = useState(0);

  useEffect(() => {
    const updateReminder = () => setReminderIndex(getHourlyReminderIndex(Date.now()));
    updateReminder();
    const interval = window.setInterval(updateReminder, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const reminder = reminders[reminderIndex];

  return (
    <aside style={{ width: "100%", maxWidth: "780px" }} aria-labelledby="weekly-reminder-title">
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--subtle)", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        <span id="weekly-reminder-title">Цитата часа</span>
        <span aria-hidden="true">·</span>
        <span style={{ color: "var(--green)" }}>{reminder.theme}</span>
      </div>
      <blockquote style={{ margin: 0, padding: "19px 22px", borderInlineStart: "3px solid var(--green)", borderRadius: "0 8px 8px 0", background: "var(--panel)" }}>
        <p style={{ margin: 0, color: "var(--ink)", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(1.18rem, 2.2vw, 1.52rem)", lineHeight: 1.45 }}>
          {reminder.quote}
        </p>
        <footer style={{ marginTop: "10px" }}>
          <a style={{ color: "var(--muted)", fontSize: "0.76rem" }} href={reminder.href} target="_blank" rel="noreferrer">
            {reminder.source} <span aria-hidden="true" style={{ color: "var(--green)" }}>↗</span>
          </a>
        </footer>
      </blockquote>
    </aside>
  );
}
