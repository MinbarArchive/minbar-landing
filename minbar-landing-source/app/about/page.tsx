import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "О проекте",
  description: "Что такое Minbar, почему архив удобен и как им пользоваться.",
};

const frequentlyAskedQuestions = [
  {
    question: "Что можно найти в архиве Minbar?",
    answer: "Аудиозаписи пятничных хутб с датой, языком, городом, мечетью и именем хазрата. Эти сведения помогают быстро найти нужную запись.",
  },
  {
    question: "Как найти нужную хутбу?",
    answer: "Откройте архив и введите в поиск название, имя хазрата, мечеть или слова, прозвучавшие в хутбе. Также можно использовать фильтры по языку, городу, мечети и хазрату.",
  },
  {
    question: "Как работает расшифровка?",
    answer: "После загрузки Minbar автоматически создаёт текст и краткий конспект записи. В именах и цитатах возможны неточности, поэтому важные фрагменты лучше сверять с аудио.",
  },
  {
    question: "Как добавить свою запись?",
    answer: "Перейдите на страницу загрузки, выберите аудиофайл и заполните сведения о хутбе. Загрузить запись также можно через Telegram-бот Minbar.",
  },
  {
    question: "Можно ли пользоваться Minbar с телефона?",
    answer: "Да. Сайт и встроенный аудиоплеер работают на телефонах, планшетах и компьютерах.",
  },
  {
    question: "На каких языках доступны записи?",
    answer: "В архиве могут быть хутбы на разных языках. Доступные варианты отображаются в фильтре и зависят от уже добавленных записей.",
  },
  {
    question: "Что делать, если не получается найти или загрузить запись?",
    answer: "Напишите через кнопку «Вопрос админу» в Telegram-боте или нажмите «Поддержка» внизу страницы.",
  },
  {
    question: "Куда написать по вопросам сотрудничества?",
    answer: "Нажмите кнопку «Сотрудничество» внизу страницы — откроется нужный Telegram-чат.",
  },
];

export default function AboutPage() {
  return (
    <main className="page-main">
      <section className="about-hero section-shell">
        <p className="eyebrow">О Minbar</p>
        <h1>Важные слова не должны теряться после пятничной молитвы.</h1>
        <p>
          Minbar — это единый аудиоархив хутб. Он помогает сохранить запись вместе с её контекстом:
          языком, городом, мечетью, именем хазрата и датой.
        </p>
      </section>

      <section className="section-shell" style={{ paddingBlock: "68px 34px" }}>
        <p className="eyebrow">Почему Minbar удобен</p>
        <h2 style={{ maxWidth: "820px", margin: "15px 0 0", fontSize: "clamp(2.65rem, 5vw, 4.9rem)", lineHeight: 1.04, letterSpacing: "-0.06em", fontWeight: 550 }}>
          Не лента сообщений, а понятный архив.
        </h2>
      </section>

      <section className="about-principles section-shell">
        <article>
          <span>01</span>
          <h2>Ничего не теряется</h2>
          <p>Хутба остаётся в каталоге и не исчезает среди пересланных сообщений, файлов и старых публикаций.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Легко найти</h2>
          <p>Поиск находит запись по названию, сведениям о хутбе и словам из готовой расшифровки.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Удобно слушать</h2>
          <p>Запись открывается в простом плеере на телефоне или компьютере — без лишних экранов и действий.</p>
        </article>
      </section>

      <section className="section-shell" style={{ paddingBlock: "84px 34px" }}>
        <p className="eyebrow">Как пользоваться</p>
        <h2 style={{ maxWidth: "760px", margin: "15px 0 0", fontSize: "clamp(2.65rem, 5vw, 4.9rem)", lineHeight: 1.04, letterSpacing: "-0.06em", fontWeight: 550 }}>
          Три простых шага.
        </h2>
      </section>

      <section className="about-principles section-shell">
        <article>
          <span>01</span>
          <h2>Откройте архив</h2>
          <p>Введите название или используйте фильтры, чтобы быстро сузить список подходящих записей.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Выберите хутбу</h2>
          <p>Посмотрите хазрата, мечеть, город, язык и дату, затем нажмите кнопку прослушивания.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Добавьте запись</h2>
          <p>Если у вас есть MP3 хутбы, заполните основные сведения и отправьте запись в архив.</p>
        </article>
      </section>

      <section className="about-faq section-shell" aria-labelledby="faq-title">
        <div className="about-faq-heading">
          <p className="eyebrow">Коротко о главном</p>
          <h2 id="faq-title">Частые вопросы</h2>
          <p>Ответы на вопросы, которые чаще всего возникают перед первым использованием Minbar.</p>
        </div>
        <div className="about-faq-list">
          {frequentlyAskedQuestions.map((item, index) => (
            <details key={item.question} open={index === 0}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.question}
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="telegram" className="about-cta section-shell">
        <div>
          <p className="eyebrow">Пополнить архив</p>
          <h2>Есть запись хутбы?</h2>
        </div>
        <div>
          <p>Загрузите MP3 через сайт или перейдите в Telegram-бот Minbar.</p>
          <div>
            <Link className="button button-primary" href="/upload">Загрузить хутбу</Link>
            <a className="button button-secondary" href="https://t.me/minbar_archive_bot" target="_blank" rel="noreferrer">Telegram</a>
          </div>
        </div>
      </section>
    </main>
  );
}
