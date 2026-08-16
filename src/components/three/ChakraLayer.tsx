"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Loaded only when we've decided to use it, so three.js never enters the
// initial bundle for anyone — including visitors who never reach this page.
const ChakraScene = dynamic(() => import("@/components/three/ChakraScene"), {
  ssr: false,
  loading: () => null,
});

/** Is a WebGL wheel worth it on this device? */
function capable(): boolean {
  if (typeof window === "undefined") return false;
  // Never override a stated motion preference.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  // Phones get the flat chakra: the GPU and battery cost is real and the wheel
  // is decorative, not content.
  if (window.innerWidth < 900) return false;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof mem === "number" && mem < 4) return false;
  if ((navigator.hardwareConcurrency ?? 4) < 4) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Mounts the 3D chakra over the flat one when the device can carry it.
 * The flat SVG chakra stays in the markup underneath in every case, so the hero
 * is never blank while this loads and never broken if it doesn't.
 */
export function ChakraLayer({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!capable()) return;
    // Defer past first paint — the hero's type and CTA matter more than the wheel.
    const id = window.setTimeout(() => setOn(true), 400);
    return () => window.clearTimeout(id);
  }, []);

  if (!on) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-[1] ${className}`}
      data-chakra-3d="on"
    >
      <ChakraScene />
    </div>
  );
}
