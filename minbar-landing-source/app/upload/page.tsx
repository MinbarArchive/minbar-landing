import type { Metadata } from "next";
import { UploadForm } from "./upload-form";

export const metadata: Metadata = { title: "Загрузить хутбу", description: "Добавьте MP3-запись хутбы в архив Minbar." };

export default function UploadPage() {
  return (
    <main className="page-main">
      <section className="upload-layout section-shell">
        <aside className="upload-aside">
          <p className="eyebrow">Добавить запись</p>
          <h1>Сохраните хутбу в архиве.</h1>
          <p>Укажите мечеть, город, язык и дату, затем загрузите MP3. После проверки запись станет доступна слушателям.</p>
          <ol>
            <li><span>01</span><div><strong>Проверьте сведения</strong><p>Мечеть, город, язык и дата помогают найти запись.</p></div></li>
            <li><span>02</span><div><strong>Загрузите MP3</strong><p>Подойдёт чистая запись без монтажа и лишней музыки.</p></div></li>
            <li><span>03</span><div><strong>Дождитесь проверки</strong><p>Команда Minbar проверит данные перед публикацией.</p></div></li>
          </ol>
        </aside>
        <UploadForm />
      </section>
    </main>
  );
}
