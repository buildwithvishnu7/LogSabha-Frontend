"use client";

import { useEffect } from "react";
import { useGlobalData } from "@/hooks/useGlobalData";
import { fetchMe } from "@/services/auth";
import { Header } from "@/components/Header";
import { StickyBadges } from "@/components/sections/HeroSection";
import { FloatingChatButton } from "@/components/FloatingChatButton";

// Global site chrome: smooth scrolling, session validation, header + badges.
// (Was AppContent in the Vite app.)
export function SiteChrome() {
  // Lenis removed: it hijacked native scrolling through a permanent rAF loop
  // (which was also never cancelled on unmount), and the only thing depending on
  // it was ScrollTrigger.update — and no component registers a ScrollTrigger.
  // Native scrolling is smoother here and lets scroll-driven CSS run on the
  // compositor.
  const { data: globalData } = useGlobalData();

  // Validate any persisted session once on load (refreshes /me, or clears it).
  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <>
      <Header />
      {globalData && <StickyBadges badges={globalData.sideBadges} />}
      <FloatingChatButton />
    </>
  );
}
