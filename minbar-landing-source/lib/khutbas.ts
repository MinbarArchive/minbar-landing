export type Khutba = {
  id: number;
  title: string;
  topic?: string;
  imam: string;
  mosque: string;
  city: string;
  language: string;
  date: string;
  isoDate: string;
  duration: string;
  durationSeconds: number;
  summary: string;
  audioUrl?: string;
  transcript?: string;
  transcriptionStatus?: "pending" | "processing" | "ready" | "failed";
};

export const khutbas: Khutba[] = [
  {
    id: 2,
    title: "Сила дуа",
    imam: "Марат хазрат",
    mosque: "Нур",
    city: "Уфа",
    language: "Татарский",
    date: "14 августа 2026",
    isoDate: "2026-08-14",
    duration: "41 мин",
    durationSeconds: 2460,
    summary: "Почему мольба меняет сердце и как сохранять надежду в ожидании ответа.",
  },
  {
    id: 3,
    title: "Терпение мусульманина",
    imam: "Рамиль хазрат",
    mosque: "Ихлас",
    city: "Москва",
    language: "Русский",
    date: "7 августа 2026",
    isoDate: "2026-08-07",
    duration: "36 мин",
    durationSeconds: 2160,
    summary: "О сабре в испытаниях, дисциплине и доверии к решению Всевышнего.",
  },
  {
    id: 4,
    title: "Любовь к Корану",
    imam: "Айрат хазрат",
    mosque: "Азимовская мечеть",
    city: "Казань",
    language: "Татарский",
    date: "31 июля 2026",
    isoDate: "2026-07-31",
    duration: "28 мин",
    durationSeconds: 1680,
    summary: "Как сделать чтение Корана постоянной частью жизни семьи.",
  },
  {
    id: 5,
    title: "Семья как аманат",
    imam: "Ильдар хазрат",
    mosque: "Ярдэм",
    city: "Казань",
    language: "Русский",
    date: "24 июля 2026",
    isoDate: "2026-07-24",
    duration: "44 мин",
    durationSeconds: 2640,
    summary: "Об ответственности, добром слове и уважении между поколениями.",
  },
  {
    id: 6,
    title: "Ценность пятничного намаза",
    imam: "Мунир хазрат",
    mosque: "Ляля-Тюльпан",
    city: "Уфа",
    language: "Русский",
    date: "17 июля 2026",
    isoDate: "2026-07-17",
    duration: "30 мин",
    durationSeconds: 1800,
    summary: "О подготовке к джума-намазу и смысле общей молитвы.",
  },
];

export const getKhutba = (id: number) => khutbas.find((khutba) => khutba.id === id);
