"use client";

import Script from "next/script";
import { useCallback, useEffect, useState } from "react";

type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  close: () => void;
  shareMessage?: (messageId: string, callback?: (success: boolean) => void) => void;
  shareToStory?: (mediaUrl: string, params?: { text?: string }) => void;
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

type ShareClientProps = {
  mode: "message" | "story";
  prepared: string;
  media: string;
  text: string;
};

export function ShareClient({ mode, prepared, media, text }: ShareClientProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const initialize = useCallback(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;
    webApp.ready();
    webApp.expand();
    setReady(true);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(initialize);
    return () => window.cancelAnimationFrame(frame);
  }, [initialize]);

  const share = () => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) {
      setError("Откройте эту кнопку внутри Telegram.");
      return;
    }

    if (mode === "story") {
      if (!media || !webApp.shareToStory) {
        setError("Telegram на этом устройстве пока не поддерживает публикацию историй.");
        return;
      }
      webApp.shareToStory(media, text ? { text } : undefined);
      return;
    }

    if (!prepared || !webApp.shareMessage) {
      setError("Обновите Telegram и попробуйте ещё раз.");
      return;
    }
    webApp.shareMessage(prepared, (success) => {
      if (success) webApp.close();
      else setError("Публикация отменена. Можно попробовать ещё раз.");
    });
  };

  const title = mode === "story" ? "Опубликовать в истории" : "Поделиться хутбой";
  const description = mode === "story"
    ? "Telegram откроет редактор истории с готовой карточкой."
    : "Выберите чат, группу или канал — карточка и подпись уже готовы.";

  return (
    <main className="share-page">
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" onLoad={initialize} />
      <section className="share-panel" aria-labelledby="share-title">
        <span className="share-mark" aria-hidden="true">M</span>
        <p className="eyebrow">MINBAR</p>
        <h1 id="share-title">{title}</h1>
        <p>{description}</p>
        <button className="button button-primary share-action" type="button" onClick={share} disabled={!ready}>
          {ready ? title : "Открываем Telegram…"}
        </button>
        {error ? <p className="share-error" role="alert">{error}</p> : null}
      </section>
    </main>
  );
}
