"use client";

import { useEffect } from "react";
import { useLenis } from "@/hooks/useLenis";
import { useGlobalData } from "@/hooks/useGlobalData";
import { fetchMe } from "@/services/auth";
import { Header } from "@/components/Header";
import { StickyBadges } from "@/components/sections/HeroSection";

// Global site chrome: smooth scrolling, session validation, header + badges.
// (Was AppContent in the Vite app.)
export function SiteChrome() {
  useLenis();
  const { data: globalData } = useGlobalData();

  // Validate any persisted session once on load (refreshes /me, or clears it).
  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <>
      <Header />
      {globalData && <StickyBadges badges={globalData.sideBadges} />}
    </>
  );
}
