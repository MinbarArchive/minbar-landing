"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadIcon } from "@/components/icons";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const selectFile = (selected: File | null) => {
    if (!selected) {
      setFile(null);
      return;
    }
    const isMp3 = selected.type === "audio/mpeg" || selected.name.toLowerCase().endsWith(".mp3");
    if (!isMp3) {
      setFile(null);
      setStatus("error");
      setMessage("Выберите аудиофайл в формате MP3.");
      return;
    }
    if (selected.size > 100 * 1024 * 1024) {
      setFile(null);
      setStatus("error");
      setMessage("Файл слишком большой. Максимальный размер — 100 МБ.");
      return;
    }
    setFile(selected);
    setStatus("idle");
    setMessage("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("audio", file);
    const date = new Date(`${String(formData.get("date"))}T12:00:00`);
    if (Number.isNaN(date.getTime()) || date.getDay() !== 5) {
      setStatus("error");
      setMessage("Выберите дату пятничной хутбы.");
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/khutbahs", { method: "POST", body: formData });
      const result = await response.json() as { ok: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || "Не удалось загрузить хутбу.");
      setStatus("success");
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Не удалось загрузить хутбу.");
    }
  };

  if (status === "success") {
    return (
      <div className="upload-success" role="status">
        <span>Заявка принята</span><h2>Спасибо. Запись отправлена на проверку.</h2><p>После проверки хутба появится в архиве. Обычно это занимает до двух рабочих дней.</p>
        <button className="button button-secondary" onClick={() => { setStatus("idle"); setFile(null); }}>Добавить ещё одну</button>
      </div>
    );
  }

  return (
    <form className="upload-form" onSubmit={submit}>
      <div className="form-section-title"><span>01</span><div><h2>Основные сведения</h2><p>Поля со звёздочкой обязательны.</p></div></div>
      <div className="form-grid">
        <label><span>Язык *</span><select required name="language" defaultValue="Русский"><option>Русский</option><option>Татарский</option><option>Арабский</option><option>Английский</option><option>Казахский</option><option>Узбекский</option></select></label>
        <label><span>Город *</span><input required name="city" placeholder="Казань" /></label>
        <label><span>Мечеть *</span><input required name="mosque" placeholder="Название мечети" /></label>
        <label><span>Хазрат</span><input name="imam" placeholder="Если имя неизвестно — оставьте пустым" /></label>
        <label><span>Дата пятницы *</span><input required name="date" type="date" /></label>
      </div>
      <div className="form-divider" />
      <div className="form-section-title"><span>02</span><div><h2>Аудиозапись</h2><p>Только MP3, рекомендуемый размер — до 100 МБ.</p></div></div>
      <label className="file-field">
        <input required name="audio" type="file" accept=".mp3,audio/mpeg,audio/*" onChange={(event) => selectFile(event.target.files?.[0] ?? null)} />
        <UploadIcon size={24} /><strong>{file ? file.name : "Выберите MP3-файл"}</strong>
        {file ? <span>{(file.size / 1024 / 1024).toFixed(1)} МБ</span> : <><span className="desktop-file-hint">или перетащите его сюда</span><span className="mobile-file-hint">нажмите, чтобы выбрать из «Файлов»</span></>}
      </label>
      {status === "error" && <p className="form-error" role="alert">{message}</p>}
      <div className="form-consent"><p>Отправляя запись, вы подтверждаете право на её публикацию в открытом архиве.</p><button className="button button-primary" type="submit" disabled={status === "submitting" || !file}>{status === "submitting" ? "Отправляем…" : "Отправить на проверку"}</button></div>
    </form>
  );
}
