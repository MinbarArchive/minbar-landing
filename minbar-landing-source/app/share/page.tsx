import type { Metadata } from "next";
import { ShareClient } from "./share-client";

export const metadata: Metadata = {
  title: "Поделиться хутбой",
  robots: { index: false, follow: false },
};

type SharePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function value(param: string | string[] | undefined): string {
  return typeof param === "string" ? param : "";
}

export default async function SharePage({ searchParams }: SharePageProps) {
  const params = await searchParams;
  return (
    <ShareClient
      mode={value(params.mode) === "story" ? "story" : "message"}
      prepared={value(params.prepared)}
      media={value(params.media)}
      text={value(params.text)}
    />
  );
}
