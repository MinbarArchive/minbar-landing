"use client";

import { usePathname } from "next/navigation";
import { AudioPlayerProvider, GlobalPlayer } from "@/components/audio-player";
import { MaintenanceScreen } from "@/components/maintenance-screen";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { MaintenanceState } from "@/lib/maintenance";

const ALWAYS_AVAILABLE = (pathname: string) =>
  pathname.startsWith("/admin") || pathname.startsWith("/share");

export function MaintenanceGate({ state, children }: { state: MaintenanceState; children: React.ReactNode }) {
  const pathname = usePathname();

  if (state.enabled && !ALWAYS_AVAILABLE(pathname)) {
    return <MaintenanceScreen state={state} />;
  }

  return (
    <AudioPlayerProvider>
      <SiteHeader />
      {children}
      <SiteFooter />
      <GlobalPlayer />
    </AudioPlayerProvider>
  );
}
