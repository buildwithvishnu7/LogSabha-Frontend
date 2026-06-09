import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronUp,
} from "lucide-react";
import lottieWeb from "lottie-web";

// ─── Lottie icon for footer ───
const footerLottieCache: Record<string, object> = {};

function FooterLottieIcon({ src, size = 18 }: { src: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const load = (data: object) => {
      el.innerHTML = "";
      const anim = lottieWeb.loadAnimation({ container: el, renderer: "svg", loop: true, autoplay: true, animationData: data });
      const recolor = () => {
        el.querySelectorAll("path,circle,rect,line,ellipse,polyline,polygon").forEach(p => {
          const s = p.getAttribute("stroke"); if (s && s !== "none" && s !== "transparent") p.setAttribute("stroke", "#f59e0b");
        });
      };
      anim.addEventListener("DOMLoaded", recolor);
      anim.addEventListener("enterFrame", recolor);
    };
    if (footerLottieCache[src]) { load(footerLottieCache[src]); return; }
    let cancelled = false;
    fetch(src).then(r => r.json()).then(json => { footerLottieCache[src] = json; if (!cancelled) load(json); }).catch(() => {});
    return () => { cancelled = true; el.innerHTML = ""; };
  }, [src]);
  return <div ref={ref} className="flex-shrink-0" style={{ width: size, height: size, display: "inline-flex" }} />;
}

const FOOTER_LINKS = {
  Platform: [
    { label: "Political Analysis", href: "/political-analysis" },
    { label: "Campaign Strategy", href: "/services" },
    { label: "Election Data", href: "/political-analysis" },
    { label: "Media Coverage", href: "/news" },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "News", href: "/news" },
    { label: "Case Studies", href: "/services" },
    { label: "Reports", href: "/political-analysis" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/about" },
    { label: "Careers", href: "/contact" },
    { label: "Contact", href: "/contact" },
  ],
};

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "#",
    brandColor: "#1877F2",
    brandBg: "rgba(24, 119, 242, 0.2)",
    brandGlow: "rgba(24, 119, 242, 0.35)",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    brandColor: "#ffffff",
    brandBg: "rgba(255, 255, 255, 0.12)",
    brandGlow: "rgba(255, 255, 255, 0.25)",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    brandColor: "#E4405F",
    brandBg: "rgba(228, 64, 95, 0.2)",
    brandGlow: "rgba(228, 64, 95, 0.35)",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    brandColor: "#FF0000",
    brandBg: "rgba(255, 0, 0, 0.2)",
    brandGlow: "rgba(255, 0, 0, 0.35)",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    brandColor: "#0A66C2",
    brandBg: "rgba(10, 102, 194, 0.2)",
    brandGlow: "rgba(10, 102, 194, 0.35)",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

// ─── Floating particles that drift upward continuously ───

function FloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${8 + (i * 7.5) % 85}%`,
    size: 2 + (i % 3),
    duration: 6 + (i % 5) * 2,
    delay: (i * 1.3) % 8,
    opacity: 0.08 + (i % 4) * 0.04,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bottom-0 rounded-full bg-amber-400"
          style={{ left: p.left, width: p.size, height: p.size }}
          animate={{
            y: [0, -(typeof window !== "undefined" ? 700 : 700)],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ─── Horizontal shimmer sweep across the footer ───

function ShimmerSweep() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      animate={{ x: ["-100%", "200%"] }}
      transition={{ duration: 4, delay: 1.5, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
    >
      <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-[-20deg]" />
    </motion.div>
  );
}

const TICKER_WORDS = [
  "DEMOCRACY",
  "ANALYSIS",
  "STRATEGY",
  "DATA",
  "INSIGHT",
  "BHARAT",
  "LOGSABHA",
  "ELECTIONS",
];

export function FooterTicker() {
  const items = [...TICKER_WORDS, ...TICKER_WORDS];
  return (
    <div className="overflow-hidden border-b border-white/5">
      <motion.div
        className="flex whitespace-nowrap py-3"
        animate={{ x: [0, `-${(100 / items.length) * TICKER_WORDS.length}%`] }}
        transition={{ x: { duration: 20, repeat: Infinity, ease: "linear" } }}
      >
        {items.map((word, i) => (
          <span key={i} className="flex items-center">
            <span className="px-6 text-[11px] font-bold tracking-[0.3em] text-white/60">
              {word}
            </span>
            <span className="h-1 w-1 rounded-full bg-amber-500/20" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function AnimatedDivider() {
  return (
    <div className="relative my-8 h-px">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Traveling light dot */}
      <motion.div
        className="absolute top-1/2 h-1.5 w-8 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
        animate={{ left: ["-5%", "105%"] }}
        transition={{ duration: 3, delay: 2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.6, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// ─── Auto-cycling Social Icons ───

function SocialIconsCycler() {
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      setActiveIdx(idx % SOCIAL_LINKS.length);
      idx++;
    }, 1800);
    // Start first highlight after a short delay
    const timeout = setTimeout(() => setActiveIdx(0), 600);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      {SOCIAL_LINKS.map((social, i) => {
        const isActive = i === activeIdx;
        return (
          <motion.a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white"
            animate={{
              y: isActive ? -4 : 0,
              scale: isActive ? 1.15 : 1,
              backgroundColor: isActive
                ? social.brandBg
                : "rgba(255, 255, 255, 0.05)",
              color: isActive
                ? social.brandColor
                : "rgb(255, 255, 255)",
              boxShadow: isActive
                ? `0 4px 15px ${social.brandGlow}, 0 0 20px ${social.brandGlow}`
                : "0 0 0px rgba(0, 0, 0, 0)",
            }}
            transition={{
              duration: 0.4,
              ease: [0.25, 1, 0.5, 1],
            }}
            whileHover={{ y: -4, scale: 1.15 }}
          >
            {social.icon}
            {/* Glow ring when active — uses brand color */}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  className="absolute inset-0 rounded-lg"
                  style={{ borderWidth: 1, borderStyle: "solid", borderColor: `${social.brandColor}66` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
          </motion.a>
        );
      })}
    </div>
  );
}

// ─── Animated Indian Flag with wave + "Made in India" ───

function AnimatedFlag() {
  const FLAG_COLORS = [
    { color: "bg-orange-500", delay: 0 },
    { color: "bg-white", delay: 0.12 },
    { color: "bg-green-500", delay: 0.24 },
  ];

  return (
    <div className="flex items-center gap-1.5 text-xs text-white">
      <div className="relative flex gap-px overflow-hidden">
        {FLAG_COLORS.map((stripe, i) => (
          <motion.span
            key={i}
            className={`h-2.5 w-3 rounded-sm ${stripe.color}`}
            animate={{
              skewY: [0, 2, 0, -2, 0],
              scaleY: [1, 1.08, 0.95, 1.05, 1],
              scaleX: [1, 1.03, 0.98, 1.02, 1],
            }}
            transition={{
              duration: 2.5,
              delay: stripe.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        {/* Shimmer light sweep across flag */}
        <motion.span
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />
      </div>
      <motion.span
        className="footer-link-shimmer"
        style={{ animationDelay: "1s" }}
      >
        Made in India
      </motion.span>
    </div>
  );
}

const VIEW_ONCE = { once: true, amount: 0.05 as const };

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-[#0c0f1a]">
      {/* <FooterTicker /> */}

      {/* Persistent effects — always running */}
      <ShimmerSweep />
      <FloatingParticles />

      {/* Ambient background glow */}
      <motion.div
        className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/[0.03] blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-orange-500/[0.02] blur-[100px]"
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-6 sm:px-6 lg:px-8">
        {/* Top: Brand + Links Grid */}
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEW_ONCE}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/" className="inline-flex items-center gap-3">
              <motion.img
                src="/logo/Logfinalsabha.gif"
                alt="LogSabha"
                className="h-20 w-20 rounded-xl object-contain"
                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(245,158,11,0)",
                    "0 0 20px rgba(245,158,11,0.4)",
                    "0 0 0px rgba(245,158,11,0)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="footer-shimmer-text text-xl font-bold text-white">
                Log<span className="text-amber-500">sabha</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white">
              India's premier political analysis and campaign strategy platform.
              Delivering data-driven insights for informed political decisions.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <motion.a
                href="mailto:info@logsabha.com"
                className="flex items-center gap-3 text-sm transition-colors"
                whileHover={{ x: 3 }}
              >
                <FooterLottieIcon src="/lottie/message.json" size={18} />
                <span className="footer-link-shimmer" style={{ animationDelay: "0.5s" }}>info@logsabha.com</span>
              </motion.a>
              <motion.a
                href="tel:+919876543210"
                className="flex items-center gap-3 text-sm transition-colors"
                whileHover={{ x: 3 }}
              >
                <FooterLottieIcon src="/lottie/contact.json" size={18} />
                <span className="footer-link-shimmer" style={{ animationDelay: "1s" }}>+91 98765 43210</span>
              </motion.a>
              <motion.div
                className="flex items-center gap-3 text-sm text-white"
              >
                <FooterLottieIcon src="/lottie/location.json" size={18} />
                New Delhi, India
              </motion.div>
            </div>
          </motion.div>

          {/* Links columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(FOOTER_LINKS).map(([category, links], catIdx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEW_ONCE}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + catIdx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <h3 className="text-sm font-semibold tracking-wide text-white">
                  {category}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link, linkIdx) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={VIEW_ONCE}
                      transition={{
                        duration: 0.5,
                        delay: 0.4 + catIdx * 0.1 + linkIdx * 0.05,
                      }}
                    >
                      <Link
                        to={link.href}
                        className="footer-link-shimmer group inline-flex items-center gap-1 text-sm transition-colors"
                        style={{ animationDelay: `${catIdx * 0.8 + linkIdx * 0.4}s` }}
                      >
                        {link.label}
                        <ArrowUpRight className="h-3 w-3 text-amber-400 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter — shimmer border */}
  

        <AnimatedDivider />

        {/* Bottom bar */}
        <motion.div
          className="flex flex-col items-center justify-between gap-4 sm:flex-row"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEW_ONCE}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Copyright */}
          <p className="text-xs text-white">
            &copy; {new Date().getFullYear()} Logsabha. All rights reserved.
          </p>

          {/* Legal links */}
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Disclaimer"].map(
              (text, i) => (
                <a
                  key={text}
                  href="#"
                  className="footer-legal-shimmer text-xs transition-colors"
                  style={{ animationDelay: `${i * 1.2}s` }}
                >
                  {text}
                </a>
              ),
            )}
          </div>

          {/* Social + Made in India */}
          <div className="flex items-center gap-4">
            <SocialIconsCycler />
            <AnimatedFlag />
          </div>
        </motion.div>
      </div>

      {/* Back to top */}
      <motion.button
        onClick={scrollToTop}
        className="fixed right-6 bottom-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/25 transition-colors hover:bg-amber-600"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronUp className="h-5 w-5" />
      </motion.button>
    </footer>
  );
}
