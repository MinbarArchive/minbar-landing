"use client";

import { useMemo, useState } from "react";
import { KhutbaList } from "@/components/khutba-list";
import { SearchIcon } from "@/components/icons";
import type { Khutba } from "@/lib/khutbas";

function recordWord(count: number) {
  const lastTwo = count % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return "записей";
  const last = count % 10;
  if (last === 1) return "запись";
  if (last >= 2 && last <= 4) return "записи";
  return "записей";
}

export function ArchiveExplorer({ items }: { items: Khutba[] }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("Все языки");
  const [city, setCity] = useState("Все города");
  const [mosque, setMosque] = useState("Все мечети");
  const languages = useMemo(() => [...new Set(items.map((item) => item.language).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru")), [items]);
  const cities = useMemo(() => [...new Set(items.map((item) => item.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru")), [items]);
  const mosques = useMemo(() => [...new Set(items.map((item) => item.mosque).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru")), [items]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru");
    return items.filter((item) => {
      const haystack = [item.title, item.topic, item.imam, item.mosque, item.city, item.summary, item.transcript].filter(Boolean).join(" ").toLocaleLowerCase("ru");
      return (!normalized || haystack.includes(normalized))
        && (language === "Все языки" || item.language === language)
        && (city === "Все города" || item.city === city)
        && (mosque === "Все мечети" || item.mosque === mosque);
    });
  }, [query, language, city, mosque, items]);

  const reset = () => {
    setQuery(""); setLanguage("Все языки"); setCity("Все города"); setMosque("Все мечети");
    window.history.replaceState({}, "", "/archive");
  };

  return (
    <section className="archive-body section-shell">
      <div className="filter-bar">
        <label className="search-field"><SearchIcon /><span className="sr-only">Поиск по архиву и текстам хутб</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Название, мечеть, хазрат или слова из хутбы" /></label>
        <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Язык"><option>Все языки</option>{languages.map((value) => <option key={value}>{value}</option>)}</select>
        <select value={city} onChange={(event) => setCity(event.target.value)} aria-label="Город"><option>Все города</option>{cities.map((value) => <option key={value}>{value}</option>)}</select>
        <select value={mosque} onChange={(event) => setMosque(event.target.value)} aria-label="Мечеть"><option>Все мечети</option>{mosques.map((value) => <option key={value}>{value}</option>)}</select>
      </div>
      <div className="archive-results-head">
        <p>{filtered.length} {recordWord(filtered.length)}</p>
        {(query || language !== "Все языки" || city !== "Все города" || mosque !== "Все мечети") && <button onClick={reset}>Сбросить фильтры</button>}
      </div>
      {filtered.length ? <KhutbaList items={filtered} /> : (
        <div className="empty-state"><span>Ничего не найдено</span><h2>Попробуйте изменить запрос или убрать один из фильтров.</h2><button className="button button-secondary" onClick={reset}>Сбросить фильтры</button></div>
      )}
    </section>
  );
}
