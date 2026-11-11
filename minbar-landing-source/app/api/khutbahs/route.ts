export async function POST() {
  return Response.json(
    {
      ok: false,
      message: "Безопасная загрузка доступна через Telegram-бот Minbar.",
      url: "https://t.me/minbar_archive_bot?start=upload",
    },
    { status: 410 },
  );
}
