"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
// AnimatedIcons no longer needed — using Flaticon Lottie for all header icons
import lottie from "lottie-web";

// ─── Lottie icon via lottie-web directly ───
const lottieCache: Record<string, object> = {};

function LottieIcon({ src, size = 24, color = "", className = "" }: { src: string; size?: number; color?: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef(color);
  colorRef.current = color;
  const animRef = useRef<{ destroy: () => void } | null>(null);

  // Load animation once
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const recolor = () => {
      const c = colorRef.current;
      if (!c) return;
      const shapes = el.querySelectorAll("path, circle, rect, line, ellipse, polyline, polygon");
      shapes.forEach((p) => {
        // Lottie assets ship solid background <rect> layers — recoloring them
        // paints the whole icon box (the "white pill" bug). Make them invisible.
        if (p.tagName.toLowerCase() === "rect") {
          p.setAttribute("fill", "none");
          p.setAttribute("stroke", "none");
          return;
        }
        const stroke = p.getAttribute("stroke");
        if (stroke && stroke !== "none" && stroke !== "transparent") p.setAttribute("stroke", c);
        const fill = p.getAttribute("fill");
        if (fill && fill !== "none" && fill !== "transparent") p.setAttribute("fill", c);
        // Boost stroke width for better visibility at small sizes
        const sw = parseFloat(p.getAttribute("stroke-width") || "0");
        if (sw > 0 && sw < 22) p.setAttribute("stroke-width", "22");
      });
    };

    // recolor used to run on EVERY enterFrame — a full querySelectorAll over
    // the icon's shapes plus attribute writes, 60x a second, for every Lottie
    // icon on the page. That is permanent main-thread work and it showed up as
    // ~800ms of jank on each route change. Lottie can still swap shapes between
    // frames, so we keep re-checking, just at 4Hz instead of 60Hz.
    let lastRecolor = 0;
    const recolorThrottled = () => {
      const now = performance.now();
      if (now - lastRecolor < 250) return;
      lastRecolor = now;
      recolor();
    };

    const load = (data: object) => {
      el.innerHTML = "";
      const anim = lottie.loadAnimation({
        container: el,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: data,
      });
      animRef.current = anim;
      anim.addEventListener("DOMLoaded", recolor);
      anim.addEventListener("enterFrame", recolorThrottled);
    };

    if (lottieCache[src]) { load(lottieCache[src]); return; }

    let cancelled = false;
    fetch(src)
      .then((r) => r.json())
      .then((json) => { lottieCache[src] = json; if (!cancelled) load(json); })
      .catch(() => {});

    // destroy() matters: without it the lottie instance keeps its rAF loop
    // running after unmount, so every remount stacked another animation.
    return () => {
      cancelled = true;
      animRef.current?.destroy();
      animRef.current = null;
      el.innerHTML = "";
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: size, height: size, display: "inline-flex" }}
    />
  );
}

// ─── Flaticon animated GIF icon ───
export function FlatIcon({ src, size = 24, className = "" }: { src: string; size?: number; className?: string }) {
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types";
import { useGlobalData } from "@/hooks/useGlobalData";

/* A top-level nav item. A plain link when it has no children; a disclosure
   button plus a panel when it does.

   The group opens on hover AND on focus, so it is reachable from the keyboard
   rather than pointer-only, and Escape closes it. The button carries
   aria-expanded/aria-haspopup so a screen reader is told it is a menu rather
   than a dead label. */
function NavItemShell({
  link,
  open,
  onOpen,
  onClose,
  darkNav,
  isActive,
  children,
}: {
  link: NavLink;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  darkNav: boolean;
  isActive: (href: string) => boolean;
  children: React.ReactNode;
}) {
  if (!link.children?.length) {
    return <Link href={link.href}>{children}</Link>;
  }

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={(e) => {
        // Only close once focus has actually left the group, not when it moves
        // between the button and the items inside the panel.
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => (open ? onClose() : onOpen())}
        className="cursor-pointer"
      >
        {children}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={link.label}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-full z-50 w-[300px] -translate-x-1/2 pt-3"
          >
            <div className="overflow-hidden rounded-xl border border-[#dce4ef] bg-white shadow-[0_18px_48px_rgba(10,30,63,0.15)]">
              {link.children.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  role="menuitem"
                  onClick={onClose}
                  className={cn(
                    "block border-b border-[#f1f5f9] px-4 py-3 transition-colors last:border-b-0 hover:bg-[#fff8f0] focus-visible:bg-[#fff8f0] focus-visible:outline-none",
                    isActive(c.href) && "bg-[#fff4e6]",
                  )}
                >
                  <span
                    className={cn(
                      "block text-[13px] font-semibold",
                      isActive(c.href) ? "text-[#c96608]" : "text-[#0a1e3f]",
                    )}
                  >
                    {c.label}
                  </span>
                  {c.blurb && (
                    <span className="mt-0.5 block text-[11px] leading-snug text-[#5a7091]">
                      {c.blurb}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import { useAuthStore } from "@/stores/authStore";
import { logoutUser } from "@/services/auth";

// ─── Typewriter placeholder search input ───
const PLACEHOLDER_PHRASES = [
  "Search elections...",
  "Search candida.....",
  "Search parties...",
  "Search constituenc.....",
  "Search policies...",
];

const TypewriterInput = forwardRef<
  HTMLInputElement,
  { onKeyDown?: (e: React.KeyboardEvent) => void }
>(({ onKeyDown }, ref) => {
  const [placeholder, setPlaceholder] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = PLACEHOLDER_PHRASES[phraseIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          setPlaceholder(currentPhrase.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);

          if (charIndex + 1 === currentPhrase.length) {
            // Pause at end, then start deleting
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          // Deleting
          setPlaceholder(currentPhrase.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);

          if (charIndex <= 1) {
            setIsDeleting(false);
            setPhraseIndex((p) => (p + 1) % PLACEHOLDER_PHRASES.length);
            setCharIndex(0);
          }
        }
      },
      isDeleting ? 40 : 80,
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <motion.input
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.15, duration: 0.2 }}
      type="text"
      placeholder={placeholder + "│"}
      className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
      onKeyDown={onKeyDown}
    />
  );
});
TypewriterInput.displayName = "TypewriterInput";

export function Header() {
  const { data: globalData } = useGlobalData();
  const navLinks = globalData?.nav.links ?? [];
  const logoSrc = globalData?.nav.logo ?? "/logo/Logfinalsabha.gif";
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const accountContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hasAnimated = useRef(false);

  // Routes whose hero is LIGHT. The unscrolled nav paints light ink, which
  // vanishes on a light hero, so those pages get the dark treatment from the
  // top instead of only after scrolling.
  //
  // /services is deliberately NOT here: its hero is dark navy, so forcing the
  // dark treatment painted gray-600 links onto a dark photo and washed the
  // whole nav out. Keep this list in step with each hero's actual background.
  // TRAP: forgetting to register a light-hero route here does not fail loudly —
  // the nav simply paints near-white ink on a near-white hero (contrast 1.18)
  // and becomes invisible. It has already happened twice. Every new page built
  // from the reference has a light hero, so add it here as it lands.
  const LIGHT_HERO_ROUTES = ["/political-analysis", "/election-database", "/political-parties"];
  const lightHero = LIGHT_HERO_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );
  const darkNav = scrolled || lightHero;

  const go = (path: string) => {
    setAccountOpen(false);
    setMobileMenuOpen(false);
    router.push(path);
  };
  const onLogout = async () => {
    setAccountOpen(false);
    setMobileMenuOpen(false);
    await logoutUser();
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // A group has no page of its own, so it counts as active when any child is.
  const isGroupActive = (link: NavLink): boolean =>
    link.children ? link.children.some((c) => isActive(c.href)) : isActive(link.href);

  // Which dropdown is open. Hover opens it; focus does too, so the groups are
  // reachable from the keyboard rather than pointer-only.
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    // Mark initial animation as done after first render
    const timer = setTimeout(() => {
      hasAnimated.current = true;
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
      if (
        accountContainerRef.current &&
        !accountContainerRef.current.contains(e.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Full-width background — glassmorphism initially, solid on scroll */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          opacity: 1,
        }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      >
        <motion.div
          className="h-full w-full backdrop-blur-md"
          animate={{
            backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.06)",
            boxShadow: scrolled ? "0 8px 30px -12px rgba(10,10,10,0.18)" : "0 0 0 0 rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          style={{
            borderBottom: scrolled ? "none" : "1px solid rgba(255,255,255,0.12)",
          }}
        />
      </motion.div>

      {/* Animated bottom border line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"
        animate={{
          opacity: scrolled ? 0.4 : 0,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%" }}
      />

      {/* Fixed height, not animated: the logo deliberately overhangs the bar,
          and a shrinking bar cropped it. Taller than the original for room. */}
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-3 sm:h-20 sm:px-6 md:h-24 lg:h-28 lg:px-8 xl:px-12">
        {/* Logo — sits OUTSIDE the parallelogram shape */}
        <Link href="/" className="relative z-10 flex-shrink-0">
          <img
            src={logoSrc}
            alt="The LogSabha"
            className="h-12 w-auto sm:h-14 md:h-16 lg:h-26"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 xl:flex xl:gap-2">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={hasAnimated.current ? false : { opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: hasAnimated.current ? 0 : 0.3 + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <NavItemShell
                link={link}
                open={openGroup === link.label}
                onOpen={() => setOpenGroup(link.label)}
                onClose={() => setOpenGroup((g) => (g === link.label ? null : g))}
                darkNav={darkNav}
                isActive={isActive}
              >
                <motion.span
                  className={cn(
                    // xl:px-2 rather than xl:px-3: nine nav items need 831px of
                    // the 835px between the logo and the action icons at the
                    // 1280px breakpoint where this nav first appears. Trimming
                    // 4px a side buys ~72px of breathing room.
                    "group relative inline-block rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors duration-500 xl:px-2 xl:text-sm",
                    darkNav ? "text-gray-600" : "text-white/90",
                    isGroupActive(link) && "text-amber-600",
                  )}
                  whileHover="hover"
                  variants={{
                    hover: { color: "#e87d12" },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Border — only on active tab with orbiting animation */}
                  {isGroupActive(link) && (
                    <span className="pointer-events-none absolute -inset-[2px] rounded-lg">
                      <span className={cn("absolute inset-0 rounded-lg border", darkNav ? "border-gray-300/60" : "border-white/20")} />
                      <motion.span
                        className="absolute inset-[-1px] rounded-lg"
                        style={{
                          background:
                            "conic-gradient(from var(--angle), transparent 0%, transparent 65%, rgba(255,153,51,0.85) 80%, rgba(255,153,51,1) 85%, rgba(255,153,51,0.85) 90%, transparent 100%)",
                          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          maskComposite: "exclude",
                          WebkitMaskComposite: "xor",
                          padding: "2px",
                        }}
                        animate={{
                          "--angle": ["0deg", "360deg"],
                        } as Record<string, string[]>}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                    </span>
                  )}

                  {/* Background highlight on hover + active */}
                  {/* One shared pill, not one per link: layoutId lets it travel
                      between items so the active state glides instead of
                      blinking out here and in over there. */}
                  {isGroupActive(link) && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className={cn(
                        "absolute inset-0 -z-20 rounded-full",
                        darkNav ? "bg-amber-100/80" : "bg-white/15",
                      )}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <motion.span
                    className={cn(
                      "absolute inset-0 -z-30 rounded-full opacity-0",
                      darkNav ? "bg-gray-900/[0.06]" : "bg-white/10",
                    )}
                    variants={{ hover: { opacity: 1 } }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Shimmer + glow text — continuous animation */}
                  <span
                    className={cn(
                      "relative transition-colors duration-300",
                      darkNav
                        ? isGroupActive(link) ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                        : isGroupActive(link) ? "text-white" : "text-white/75 hover:text-white",
                    )}
                  >
                    {link.label}
                  </span>

                  {/* Underline with glow */}
                  <motion.span
                    className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-full bg-amber-500 xl:left-3 xl:right-3"
                    initial={{ scaleX: 0 }}
                    variants={{ hover: { scaleX: 1 } }}
                    style={{ originX: 0, boxShadow: "0 0 8px rgba(255,153,51,0.5)" }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {isGroupActive(link) && (
                    <motion.span
                      className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-full bg-amber-500 xl:left-3 xl:right-3"
                      layoutId="activeNav"
                      style={{ boxShadow: "0 0 8px rgba(255,153,51,0.4)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.span>
              </NavItemShell>
            </motion.div>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
          {/* Search — with breathing pulse */}
          <div ref={searchContainerRef} className="relative hidden md:block">
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div
                  key="search-bar"
                  initial={{ width: 40, opacity: 0.5, borderRadius: 9999 }}
                  animate={{ width: 200, opacity: 1, borderRadius: 9999 }}
                  exit={{ width: 40, opacity: 0, borderRadius: 9999 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex h-10 items-center gap-2 overflow-hidden rounded-full border border-amber-500/40 bg-gray-100 px-3"
                >
                  {/* Breathing pulse rings on expanded bar */}
                  <motion.span
                    className="pointer-events-none absolute inset-[-3px] rounded-full border-2 border-amber-500/70"
                    style={{ boxShadow: "0 0 6px rgba(255,153,51,0.2)" }}
                    animate={{ scale: [1, 1.04, 1], opacity: [0.8, 0.1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.span
                    className="pointer-events-none absolute inset-[-1px] rounded-full border-2 border-amber-500/50"
                    animate={{ scale: [1, 1.02, 1], opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  />
                  <LottieIcon src="/lottie/search (1).json" size={24} color="#ff9933" className="flex-shrink-0" />
                  <TypewriterInput
                    ref={searchInputRef}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                  />
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    onClick={() => setSearchOpen(false)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  key="search-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{
                    scale: 1.15,
                    rotate: -15,
                    backgroundColor: scrolled
                      ? "rgba(0,0,0,0.05)"
                      : "rgba(255,255,255,0.1)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSearchOpen(true)}
                  className={cn(
                    "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500 sm:h-10 sm:w-10",
                    darkNav ? "text-gray-500 hover:text-gray-800" : "text-white/80 hover:text-white",
                  )}
                >
                  {/* Breathing pulse ring — visible on both backgrounds */}
                  <motion.span
                    className={cn(
                      "absolute inset-[-3px] rounded-full",
                      darkNav ? "border-2 border-amber-500/70" : "border-2 border-amber-400/50",
                    )}
                    style={{ boxShadow: darkNav ? "0 0 8px rgba(255,153,51,0.25)" : "0 0 8px rgba(255,153,51,0.15)" }}
                    animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.span
                    className={cn(
                      "absolute inset-[-1px] rounded-full",
                      darkNav ? "border-2 border-amber-500/50" : "border-2 border-amber-400/35",
                    )}
                    animate={{ scale: [1, 1.12, 1], opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  />
                  <LottieIcon src="/lottie/search (1).json" size={28} color={darkNav ? "#6b7280" : "#ffffff"} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Language Selector — with spinning globe */}
          <motion.button
            className={cn(
              "relative hidden items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs transition-all duration-500 sm:py-2 sm:text-sm lg:flex lg:px-3",
              scrolled
                ? "border border-gray-200 bg-gray-50 text-gray-600"
                : "border border-white/20 bg-white/10 text-white/80",
            )}
            whileHover={{
              borderColor: "rgba(255,153,51,0.5)",
              backgroundColor: scrolled
                ? "rgba(255,153,51,0.05)"
                : "rgba(255,255,255,0.15)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            {/* Orbiting highlighted border — matches capsule shape exactly */}
            <span className="pointer-events-none absolute -inset-[2px] rounded-full">
              {/* Faint full border */}
              <span className="absolute inset-0 rounded-full border border-amber-500/30" />
              {/* Rotating arc highlight */}
              <motion.span
                className="absolute inset-[-1px] rounded-full"
                style={{
                  background:
                    "conic-gradient(from var(--angle), transparent 0%, transparent 70%, rgba(255,153,51,0.8) 85%, rgba(255,153,51,1) 90%, rgba(255,153,51,0.8) 95%, transparent 100%)",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                  WebkitMaskComposite: "xor",
                  padding: "2.5px",
                }}
                animate={{
                  "--angle": ["0deg", "360deg"],
                } as Record<string, string[]>}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <LottieIcon src="/lottie/worldwide.json" size={24} color={darkNav ? "#6b7280" : "#ffffff"} />
            </motion.div>
            <span>EN</span>
            <motion.svg
              className="h-3 w-3 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ y: [0, 2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </motion.button>

          {/* User Icon — with orbit ring */}
          <div ref={accountContainerRef} className="relative hidden md:block">
            <motion.button
              whileHover={{
                scale: 1.1,
                backgroundColor: scrolled
                  ? "rgba(0,0,0,0.05)"
                  : "rgba(255,255,255,0.1)",
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => setAccountOpen(!accountOpen)}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500 sm:h-10 sm:w-10",
                darkNav ? "text-gray-500 hover:text-gray-800" : "text-white/80 hover:text-white",
                accountOpen && (darkNav ? "bg-gray-100 text-gray-800" : "bg-white/10 text-white"),
              )}
            >
              {/* Orbiting highlighted border arc */}
              <svg
                className="absolute inset-[-3px] h-[calc(100%+6px)] w-[calc(100%+6px)]"
                viewBox="0 0 44 44"
                style={{ filter: "drop-shadow(0 0 3px rgba(255,153,51,0.2))" }}
              >
                <circle
                  cx="22"
                  cy="22"
                  r="20"
                  fill="none"
                  stroke="rgba(255,153,51,0.3)"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="22"
                  cy="22"
                  r="20"
                  fill="none"
                  stroke="rgb(245,158,11)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="35 90"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "center" }}
                />
              </svg>
              <LottieIcon src="/lottie/add-user.json" size={28} color={darkNav ? "#6b7280" : "#ffffff"} />
            </motion.button>

            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg sm:w-48"
                >
                  {user ? (
                    <>
                      <div className="px-3 pb-1.5 pt-1 text-xs text-gray-400">
                        Signed in as{" "}
                        <span className="font-medium text-gray-600">
                          {user.name}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(255,153,51,0.08)", x: 4 }}
                        onClick={() => go("/account")}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition-colors hover:text-gray-900"
                      >
                        <motion.div whileHover={{ rotate: 15 }}>
                          <LottieIcon src="/lottie/add-user.json" size={24} color="#ff9933" />
                        </motion.div>
                        My Account
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(239,68,68,0.08)", x: 4 }}
                        onClick={onLogout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition-colors hover:text-red-600"
                      >
                        Log out
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(255,153,51,0.08)", x: 4 }}
                        onClick={() => go("/login")}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition-colors hover:text-gray-900"
                      >
                        <motion.div whileHover={{ rotate: 15 }}>
                          <LottieIcon src="/lottie/add-user.json" size={24} color="#ff9933" />
                        </motion.div>
                        Login
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(255,153,51,0.08)", x: 4 }}
                        onClick={() => go("/signup")}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition-colors hover:text-gray-900"
                      >
                        <motion.svg
                          className="h-4 w-4 text-amber-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          whileHover={{ rotate: 15 }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </motion.svg>
                        Sign Up
                      </motion.button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hamburger — animated morph between menu and X */}
          <motion.button
            className={cn(
              "relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500 xl:hidden",
              darkNav ? "bg-gray-100/80 text-gray-700" : "bg-white/10 text-white",
            )}
            whileTap={{ scale: 0.85, rotate: 90 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm xl:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-[60] flex w-[280px] flex-col bg-white shadow-2xl xl:hidden sm:w-[320px]"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <img src={logoSrc} alt="The LogSabha" className="h-10 w-auto" />
                <motion.button
                  whileTap={{ scale: 0.85, rotate: 90 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Search */}
              <div className="mx-5 mt-4 flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5">
                <LottieIcon src="/lottie/search (1).json" size={20} color="#9ca3af" />
                <input
                  type="text"
                  placeholder="Search elections..."
                  className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                />
              </div>

              {/* Nav Links */}
              <nav className="mt-4 flex-1 overflow-y-auto px-5">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
                  >
                    {link.children?.length ? (
                      // Groups are flattened here rather than made into
                      // accordions: a phone menu that hides destinations behind
                      // a second tap is how modules go unfound, and the whole
                      // list still fits one scroll.
                      <div className="border-b border-gray-50 py-3">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                          {link.label}
                        </span>
                        <div className="mt-1.5">
                          {link.children.map((c) => (
                            <Link
                              key={c.href}
                              href={c.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={cn(
                                "block py-2 text-[15px] font-medium text-gray-700 transition-colors hover:text-amber-600",
                                isActive(c.href) && "font-semibold text-amber-600",
                              )}
                            >
                              {c.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "block border-b border-gray-50 py-3.5 text-[15px] font-medium text-gray-700 transition-colors hover:text-amber-600",
                          isGroupActive(link) && "font-semibold text-amber-600",
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Bottom Section */}
              <div className="border-t border-gray-100 px-5 py-5">
                {/* Language */}
                <motion.button
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600"
                  whileTap={{ scale: 0.97 }}
                >
                  <LottieIcon src="/lottie/worldwide.json" size={20} color="#6b7280" />
                  <span>English</span>
                  <svg className="ml-auto h-3.5 w-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>

                {/* Login / Sign Up / Account */}
                <motion.button
                  onClick={() => go(user ? "/account" : "/login")}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ boxShadow: "0 0 20px rgba(255,153,51,0.4)" }}
                >
                  <LottieIcon src="/lottie/add-user.json" size={18} color="#ffffff" />
                  {user ? "My Account" : "Login / Sign Up"}
                </motion.button>
                {user && (
                  <motion.button
                    onClick={onLogout}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 py-2.5 text-sm font-medium text-gray-600"
                    whileTap={{ scale: 0.97 }}
                  >
                    Log out
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
