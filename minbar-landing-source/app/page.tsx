import Link from "next/link";
import Image from "next/image";
import { PlayButton } from "@/components/audio-player";
import { WeeklyReminder } from "@/components/weekly-reminder";
import { KhutbaList } from "@/components/khutba-list";
import { HomeStats } from "@/components/home-stats";
import { loadKhutbas } from "@/lib/supabase-khutbas";

export default async function Home() {
  const khutbas = await loadKhutbas();
  const featured = khutbas.find((khutba) => khutba.audioUrl) ?? khutbas[0];
  const latest = khutbas.slice(0, 5);
  const mosques = new Set(khutbas.map((khutba) => khutba.mosque).filter(Boolean)).size;
  const cities = new Set(khutbas.map((khutba) => khutba.city).filter(Boolean)).size;
  const languages = new Set(khutbas.map((khutba) => khutba.language).filter(Boolean)).size;

  return (
    <main>
      <section className="hero section-shell">
        <Image
          className="moon-visual"
          src="/moon-crescent.png"
          alt=""
          width={1024}
          height={1024}
          priority
          unoptimized
          aria-hidden="true"
        />
        <div className="hero-copy">
          <p className="eyebrow">Живой архив пятничных хутб</p>
          <h1>Слова, к которым<br />можно <em>вернуться.</em></h1>
          <p className="hero-lead">
            Находите хутбы по теме, городу, мечети или хазрату. Слушайте, читайте краткий конспект и сохраняйте важное.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/archive">Открыть архив</Link>
            <Link className="text-link" href="/upload">Сохранить хутбу <span aria-hidden="true">→</span></Link>
          </div>
          <div className="hero-note"><span aria-hidden="true">●</span> Доступно бесплатно · без регистрации</div>
        </div>

        {featured && (
          <article className="featured" aria-label="Запись для прослушивания">
            <div className="featured-topline"><span>Послушать сейчас</span><span>{featured.duration}</span></div>
            <div className="featured-body">
              <span className="language-tag">{featured.language}</span>
              <h2>{featured.title}</h2>
              <p>{featured.summary}</p>
            </div>
            <div className="featured-meta">
              <div><span>Имам</span><strong>{featured.imam}</strong></div>
              <div><span>Мечеть</span><strong>{featured.mosque} · {featured.city}</strong></div>
            </div>
            <div className="featured-controls">
              <PlayButton track={featured} label="Слушать" large />
              <Link href={`/khutba/${featured.id}`}>Открыть запись</Link>
            </div>
          </article>
        )}
      </section>

      <HomeStats recordings={khutbas.length} mosques={mosques} cities={cities} languages={languages} />

      <section className="latest-section section-shell">
        <div className="section-heading">
          <div><p className="eyebrow">Недавно добавлено</p><h2>Новые записи</h2></div>
          <Link className="text-link" href="/archive">Смотреть весь архив <span aria-hidden="true">→</span></Link>
        </div>
        <KhutbaList items={latest} compact />
      </section>

      <section className="home-story section-shell" aria-labelledby="home-story-title">
        <div className="home-story-heading">
          <p className="eyebrow">Minbar рядом</p>
          <h2 id="home-story-title">Один архив.<br />Три простых действия.</h2>
          <p>Не нужно искать старый файл в чатах. Всё важное остаётся в понятной структуре и открывается с любого устройства.</p>
        </div>
        <div className="home-story-steps">
          <article><span>01</span><div><h3>Найдите</h3><p>По теме, словам из расшифровки, мечети, городу или имени хазрата.</p></div></article>
          <article><span>02</span><div><h3>Послушайте</h3><p>Запустите запись на сайте или продолжите в Telegram — как вам удобнее.</p></div></article>
          <article><span>03</span><div><h3>Сохраните</h3><p>Добавьте важную хутбу в избранное или поделитесь ею с близкими.</p></div></article>
        </div>
      </section>

      <section className="section-shell contribute contribute-premium">
        <div><p className="eyebrow">Пополнить архив</p><h2>У вас сохранилась хутба?</h2></div>
        <div className="contribute-copy">
          <p>Отправьте аудиозапись в удобном формате и укажите мечеть, город и дату. После проверки она появится в архиве.</p>
          <div className="contribute-actions"><Link className="button button-primary" href="/upload">Добавить запись</Link><a className="button button-secondary" href="https://t.me/minbar_archive_bot" target="_blank" rel="noreferrer">Через Telegram ↗</a></div>
        </div>
      </section>

      <section
        className="section-shell"
        aria-label="Цитата недели"
        style={{ paddingBlock: "8px 76px" }}
      >
        <WeeklyReminder />
      </section>
    </main>
  );
}
