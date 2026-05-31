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
        scrolled
          ? "bg-white/40 backdrop-blur-sm"
          : "bg-white shadow-sm",
      )}
    >

      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:h-24 sm:px-6 lg:h-28 xl:px-8">
        {/* Logo */}
        <Link to="/" className="relative z-10 flex-shrink-0">
          <motion.img
            src={logoSrc}
            alt="The LogSabha"
            className="h-40 w-auto"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </Link>

        {/* Desktop Navigation — visible from xl */}
        <nav className="hidden items-center gap-0.5 xl:flex">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.1 + i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link to={link.href}>
                <motion.span
                  className={cn(
                    "group relative inline-block overflow-hidden rounded-lg px-2.5 py-2 text-[13px] font-medium text-gray-600 xl:px-3 xl:text-sm",
                    location.pathname === link.href && "text-amber-600",
                  )}
                  whileHover="hover"
                  variants={{
                    hover: { color: "#d97706" },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Background highlight on hover */}
                  <motion.span
                    className="absolute inset-0 -z-10 rounded-lg bg-amber-50"
                    initial={{ opacity: 0, scale: 0.85 }}
                    variants={{
                      hover: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Text with letter-spacing animation */}
                  <motion.span
                    className="relative inline-block"
                    variants={{
                      hover: { letterSpacing: "0.03em" },
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {link.label}
                  </motion.span>

                  {/* Animated underline — slides in from left */}
                  <motion.span
                    className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-full bg-amber-500 xl:left-3 xl:right-3"
                    initial={{ scaleX: 0 }}
                    variants={{ hover: { scaleX: 1 } }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Active indicator — animated pill that follows active route */}
                  {location.pathname === link.href && (
                    <motion.span
                      className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-full bg-amber-500 xl:left-3 xl:right-3"
                      layoutId="activeNav"
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
          {/* Search Icon → Expandable Search Bar (visible from md) */}
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
                  <Search className="h-4 w-4 flex-shrink-0 text-amber-500" />
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
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
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
                    scale: 1.1,
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSearchOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:text-gray-800 sm:h-10 sm:w-10"
                >
                  <Search className="h-[18px] w-[18px]" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Language Selector (visible from lg) */}
          <motion.button
            className="hidden items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-gray-600 sm:py-2 sm:text-sm lg:flex lg:px-3"
            whileHover={{
              borderColor: "rgba(245, 158, 11, 0.5)",
              backgroundColor: "rgba(245, 158, 11, 0.05)",
              color: "#111827",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <Globe className="h-4 w-4" />
            <span>EN</span>
            <svg
              className="h-3 w-3 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.button>

          {/* User Icon → Account Dropdown (visible from md) */}
          <div ref={accountContainerRef} className="relative hidden md:block">
            <motion.button
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => setAccountOpen(!accountOpen)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:text-gray-800 sm:h-10 sm:w-10",
                accountOpen && "bg-gray-100 text-gray-800",
              )}
            >
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
                    whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.08)" }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    <User className="h-4 w-4 text-amber-500" />
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.08)" }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    <svg
                      className="h-4 w-4 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Sign Up
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hamburger — visible below xl */}
          <motion.button
            className="relative z-10 ml-1 text-gray-700 xl:hidden"
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile / Tablet Menu — below xl */}
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
              {/* Tablet: 2-column grid / Mobile: single column */}
              <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-x-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
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

              {/* Search — only in menu on mobile */}
              <div className="mt-4 flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 md:hidden">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search elections..."
                  className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                />
              </div>

              {/* Language selector — only in menu below lg */}
              <motion.button
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 lg:hidden"
                whileTap={{ scale: 0.97 }}
              >
                <Globe className="h-4 w-4" />
                <span>EN</span>
                <svg
                  className="h-3 w-3 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.button>

              {/* Account buttons — only in menu on mobile */}
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
