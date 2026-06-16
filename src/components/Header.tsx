import { useState, useEffect, useRef, forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
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

  // Load animation once
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const recolor = () => {
      const c = colorRef.current;
      if (!c) return;
      const shapes = el.querySelectorAll("path, circle, rect, line, ellipse, polyline, polygon");
      shapes.forEach((p) => {
        const stroke = p.getAttribute("stroke");
        if (stroke && stroke !== "none" && stroke !== "transparent") p.setAttribute("stroke", c);
        const fill = p.getAttribute("fill");
        if (fill && fill !== "none" && fill !== "transparent") p.setAttribute("fill", c);
        // Boost stroke width for better visibility at small sizes
        const sw = parseFloat(p.getAttribute("stroke-width") || "0");
        if (sw > 0 && sw < 22) p.setAttribute("stroke-width", "22");
      });
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
      anim.addEventListener("DOMLoaded", recolor);
      anim.addEventListener("enterFrame", recolor);
    };

    if (lottieCache[src]) { load(lottieCache[src]); return; }

    let cancelled = false;
    fetch(src)
      .then((r) => r.json())
      .then((json) => { lottieCache[src] = json; if (!cancelled) load(json); })
      .catch(() => {});

    return () => { cancelled = true; el.innerHTML = ""; };
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
import { useGlobalData } from "@/hooks/useGlobalData";

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
  const location = useLocation();
  const hasAnimated = useRef(false);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

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
  }, [location.pathname]);

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
            backgroundColor: scrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.08)",
            boxShadow: scrolled
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
              : "0 0 0 0 rgba(0, 0, 0, 0)",
          }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          style={{
            borderBottom: scrolled ? "none" : "1px solid rgba(255, 255, 255, 0.12)",
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

      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-3 sm:h-16 sm:px-6 md:h-20 lg:h-24 lg:px-8 xl:px-12">
        {/* Logo — sits OUTSIDE the parallelogram shape */}
        <Link to="/" className="relative z-10 flex-shrink-0">
          <img
            src={logoSrc}
            alt="The LogSabha"
            className="mt-2 h-16 w-auto sm:h-20 md:h-28 lg:mt-3 lg:h-32 xl:h-40"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 xl:flex xl:gap-3">
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
              <Link to={link.href}>
                <motion.span
                  className={cn(
                    "group relative inline-block rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors duration-500 xl:px-3 xl:text-sm",
                    scrolled ? "text-gray-600" : "text-white/90",
                    isActive(link.href) && "text-amber-600",
                  )}
                  whileHover="hover"
                  variants={{
                    hover: { color: "#d97706" },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Border — only on active tab with orbiting animation */}
                  {isActive(link.href) && (
                    <span className="pointer-events-none absolute -inset-[2px] rounded-lg">
                      <span className={cn("absolute inset-0 rounded-lg border", scrolled ? "border-gray-300/60" : "border-white/20")} />
                      <motion.span
                        className="absolute inset-[-1px] rounded-lg"
                        style={{
                          background:
                            "conic-gradient(from var(--angle), transparent 0%, transparent 65%, rgba(245,158,11,0.85) 80%, rgba(245,158,11,1) 85%, rgba(245,158,11,0.85) 90%, transparent 100%)",
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
                  <motion.span
                    className={cn(
                      "absolute inset-0 -z-20 rounded-lg",
                      scrolled ? "bg-amber-50" : "bg-white/10",
                    )}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={isActive(link.href) ? { opacity: 1, scale: 1 } : undefined}
                    variants={{
                      hover: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Shimmer + glow text — continuous animation */}
                  <span
                    className={cn(
                      scrolled ? "nav-text-shimmer-dark" : "nav-text-shimmer-light",
                    )}
                    style={{ animationDelay: `${i * 0.4}s, ${i * 0.4}s` }}
                  >
                    {link.label}
                  </span>

                  {/* Underline with glow */}
                  <motion.span
                    className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-full bg-amber-500 xl:left-3 xl:right-3"
                    initial={{ scaleX: 0 }}
                    variants={{ hover: { scaleX: 1 } }}
                    style={{ originX: 0, boxShadow: "0 0 8px rgba(245,158,11,0.5)" }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {isActive(link.href) && (
                    <motion.span
                      className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-full bg-amber-500 xl:left-3 xl:right-3"
                      layoutId="activeNav"
                      style={{ boxShadow: "0 0 8px rgba(245,158,11,0.4)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.span>
              </Link>
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
                    style={{ boxShadow: "0 0 6px rgba(245,158,11,0.2)" }}
                    animate={{ scale: [1, 1.04, 1], opacity: [0.8, 0.1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.span
                    className="pointer-events-none absolute inset-[-1px] rounded-full border-2 border-amber-500/50"
                    animate={{ scale: [1, 1.02, 1], opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  />
                  <LottieIcon src="/lottie/search (1).json" size={24} color="#f59e0b" className="flex-shrink-0" />
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
                      ? "rgba(0, 0, 0, 0.05)"
                      : "rgba(255, 255, 255, 0.1)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSearchOpen(true)}
                  className={cn(
                    "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500 sm:h-10 sm:w-10",
                    scrolled ? "text-gray-500 hover:text-gray-800" : "text-white/80 hover:text-white",
                  )}
                >
                  {/* Breathing pulse ring — visible on both backgrounds */}
                  <motion.span
                    className={cn(
                      "absolute inset-[-3px] rounded-full",
                      scrolled ? "border-2 border-amber-500/70" : "border-2 border-amber-400/50",
                    )}
                    style={{ boxShadow: scrolled ? "0 0 8px rgba(245,158,11,0.25)" : "0 0 8px rgba(245,158,11,0.15)" }}
                    animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.span
                    className={cn(
                      "absolute inset-[-1px] rounded-full",
                      scrolled ? "border-2 border-amber-500/50" : "border-2 border-amber-400/35",
                    )}
                    animate={{ scale: [1, 1.12, 1], opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  />
                  <LottieIcon src="/lottie/search (1).json" size={28} color={scrolled ? "#6b7280" : "#ffffff"} />
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
              borderColor: "rgba(245, 158, 11, 0.5)",
              backgroundColor: scrolled
                ? "rgba(245, 158, 11, 0.05)"
                : "rgba(255, 255, 255, 0.15)",
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
                    "conic-gradient(from var(--angle), transparent 0%, transparent 70%, rgba(245,158,11,0.8) 85%, rgba(245,158,11,1) 90%, rgba(245,158,11,0.8) 95%, transparent 100%)",
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
              <LottieIcon src="/lottie/worldwide.json" size={24} color={scrolled ? "#6b7280" : "#ffffff"} />
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
                  ? "rgba(0, 0, 0, 0.05)"
                  : "rgba(255, 255, 255, 0.1)",
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => setAccountOpen(!accountOpen)}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500 sm:h-10 sm:w-10",
                scrolled ? "text-gray-500 hover:text-gray-800" : "text-white/80 hover:text-white",
                accountOpen && (scrolled ? "bg-gray-100 text-gray-800" : "bg-white/10 text-white"),
              )}
            >
              {/* Orbiting highlighted border arc */}
              <svg
                className="absolute inset-[-3px] h-[calc(100%+6px)] w-[calc(100%+6px)]"
                viewBox="0 0 44 44"
                style={{ filter: "drop-shadow(0 0 3px rgba(245,158,11,0.2))" }}
              >
                <circle
                  cx="22"
                  cy="22"
                  r="20"
                  fill="none"
                  stroke="rgba(245,158,11,0.3)"
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
              <LottieIcon src="/lottie/add-user.json" size={28} color={scrolled ? "#6b7280" : "#ffffff"} />
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
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.08)", x: 4 }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    <motion.div whileHover={{ rotate: 15 }}>
                      <LottieIcon src="/lottie/add-user.json" size={24} color="#f59e0b" />
                    </motion.div>
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.08)", x: 4 }}
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Search — circular icon (visible below md) */}
          <motion.button
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500 md:hidden",
              scrolled ? "bg-gray-100/80 text-gray-500" : "bg-white/10 text-white/80",
            )}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <LottieIcon src="/lottie/search (1).json" size={18} color={scrolled ? "#6b7280" : "#ffffff"} />
          </motion.button>

          {/* Hamburger — animated morph between menu and X */}
          <motion.button
            className={cn(
              "relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500 xl:hidden",
              scrolled ? "bg-gray-100/80 text-gray-700" : "bg-white/10 text-white",
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
                    <Link
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block border-b border-gray-50 py-3.5 text-[15px] font-medium text-gray-700 transition-colors hover:text-amber-600",
                        isActive(link.href) && "font-semibold text-amber-600",
                      )}
                    >
                      {link.label}
                    </Link>
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

                {/* Login / Sign Up */}
                <motion.button
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ boxShadow: "0 0 20px rgba(245,158,11,0.4)" }}
                >
                  <LottieIcon src="/lottie/add-user.json" size={18} color="#ffffff" />
                  Login / Sign Up
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
