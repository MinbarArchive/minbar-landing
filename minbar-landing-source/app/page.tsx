import Link from "next/link";
import Image from "next/image";
import { PlayButton } from "@/components/audio-player";
import { WeeklyReminder } from "@/components/weekly-reminder";
import { loadKhutbas } from "@/lib/supabase-khutbas";

export default async function Home() {
  const khutbas = await loadKhutbas();
  const featured = khutbas.find((khutba) => khutba.audioUrl) ?? khutbas[0];

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
          aria-hidden="true"
        />
        <div className="hero-copy">
          <p className="eyebrow">Аудиоархив пятничных хутб</p>
          <h1>Слушайте.<br />Размышляйте.<br /><em>Делитесь.</em></h1>
          <p className="hero-lead">
            Находите записи по городу, мечети или имаму и слушайте их в удобное время.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/archive">Открыть архив</Link>
            <Link className="text-link" href="/upload">Добавить свою запись <span aria-hidden="true">→</span></Link>
          </div>
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

      <section className="section-shell contribute">
        <div><p className="eyebrow">Пополнить архив</p><h2>Есть запись хутбы?</h2></div>
        <div className="contribute-copy">
          <p>Загрузите MP3 и основные данные. После проверки запись появится в архиве.</p>
          <div className="contribute-actions"><Link className="button button-primary" href="/upload">Загрузить хутбу</Link></div>
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
