import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Search, Globe, Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGlobalData } from "@/hooks/useGlobalData";

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
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-white shadow-sm" : "bg-transparent",
      )}
    >
      {/* Animated bottom border line that sweeps across on scroll */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"
        animate={{
          width: scrolled ? "100%" : "0%",
          opacity: scrolled ? 0.4 : 0,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-3 sm:h-16 sm:px-6 md:h-20 lg:h-24 xl:px-8">
        {/* Logo with subtle float animation */}
        <Link to="/" className="absolute left-1/2 z-10 -translate-x-1/2 sm:relative sm:left-auto sm:translate-x-0 sm:flex-shrink-0">
          <motion.img
            src={logoSrc}
            alt="The LogSabha"
            className="h-20 w-auto sm:h-14 md:h-20 lg:h-24 xl:h-28"
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0.5 xl:flex">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3 + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link to={link.href}>
                <motion.span
                  className={cn(
                    "group relative inline-block overflow-hidden rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors duration-500 xl:px-3 xl:text-sm",
                    scrolled ? "text-gray-600" : "text-white/90",
                    location.pathname === link.href && "text-amber-600",
                  )}
                  whileHover="hover"
                  variants={{
                    hover: { color: "#d97706" },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Shimmer sweep on hover */}
                  <motion.span
                    className="absolute inset-0 -z-10 rounded-lg"
                    style={{
                      background: scrolled
                        ? "linear-gradient(90deg, transparent, rgba(245,158,11,0.08), transparent)"
                        : "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                    }}
                    initial={{ x: "-100%" }}
                    variants={{
                      hover: { x: "100%" },
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />

                  {/* Background highlight */}
                  <motion.span
                    className={cn(
                      "absolute inset-0 -z-20 rounded-lg",
                      scrolled ? "bg-amber-50" : "bg-white/10",
                    )}
                    initial={{ opacity: 0, scale: 0.85 }}
                    variants={{
                      hover: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {link.label}

                  {/* Underline with glow */}
                  <motion.span
                    className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-full bg-amber-500 xl:left-3 xl:right-3"
                    initial={{ scaleX: 0 }}
                    variants={{ hover: { scaleX: 1 } }}
                    style={{ originX: 0, boxShadow: "0 0 8px rgba(245,158,11,0.5)" }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {location.pathname === link.href && (
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
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search — with breathing pulse */}
          <div ref={searchContainerRef} className="relative hidden md:block">
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div
                  key="search-bar"
                  initial={{ width: 36, opacity: 0.5 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 36, opacity: 0.5 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2 overflow-hidden rounded-full border border-amber-500/40 bg-gray-100 px-3 py-1.5 sm:py-2 xl:w-[260px]"
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <Search className="h-4 w-4 flex-shrink-0 text-amber-500" />
                  </motion.div>
                  <motion.input
                    ref={searchInputRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.15, duration: 0.2 }}
                    type="text"
                    placeholder="Search elections..."
                    className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                  />
                  <motion.button
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2 }}
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
                  {/* Subtle pulse ring */}
                  <motion.span
                    className={cn(
                      "absolute inset-0 rounded-full",
                      scrolled ? "border border-gray-200" : "border border-white/20",
                    )}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <Search className="h-[18px] w-[18px]" />
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
              <span className="absolute inset-0 rounded-full border border-amber-500/15" />
              {/* Rotating arc highlight */}
              <motion.span
                className="absolute inset-[-1px] rounded-full"
                style={{
                  background:
                    "conic-gradient(from var(--angle), transparent 0%, transparent 70%, rgba(245,158,11,0.6) 85%, rgba(245,158,11,0.8) 90%, rgba(245,158,11,0.6) 95%, transparent 100%)",
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
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Globe className="h-4 w-4" />
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
              >
                <circle
                  cx="22"
                  cy="22"
                  r="20"
                  fill="none"
                  stroke="rgba(245,158,11,0.15)"
                  strokeWidth="1.5"
                />
                <motion.circle
                  cx="22"
                  cy="22"
                  r="20"
                  fill="none"
                  stroke="rgb(245,158,11)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="25 100"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "center" }}
                />
              </svg>
              <User className="h-[18px] w-[18px]" />
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
                      <User className="h-4 w-4 text-amber-500" />
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

          {/* Hamburger — animated morph between menu and X */}
          <motion.button
            className={cn(
              "relative z-10 ml-1 transition-colors duration-500 xl:hidden",
              scrolled ? "text-gray-700" : "text-white",
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-gray-100 bg-white/98 backdrop-blur-lg xl:hidden"
          >
            <nav className="mx-auto flex max-w-[1440px] flex-col px-4 py-4 sm:px-6">
              <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-x-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={link.href}
                      className={cn(
                        "block border-b border-gray-100 py-3 text-sm font-medium text-gray-600 transition-colors hover:text-amber-600",
                        location.pathname === link.href && "text-amber-600",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 md:hidden">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search elections..."
                  className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                />
              </div>

              <motion.button
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 lg:hidden"
                whileTap={{ scale: 0.97 }}
              >
                <Globe className="h-4 w-4" />
                <span>EN</span>
              </motion.button>

              <div className="mt-3 flex gap-3 md:hidden">
                <motion.button
                  className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-medium text-gray-600"
                  whileTap={{ scale: 0.97 }}
                >
                  Login
                </motion.button>
                <motion.button
                  className="flex-1 rounded-full bg-amber-500 py-2.5 text-sm font-semibold text-white"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ boxShadow: "0 0 20px rgba(245,158,11,0.4)" }}
                >
                  Sign Up
                </motion.button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
