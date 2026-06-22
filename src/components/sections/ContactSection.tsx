import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  CheckCircle,
} from "lucide-react";
import { loadLottieInView } from "@/lib/lottie";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

// ─── Lottie icon for contact cards ───
const contactLottieCache: Record<string, object> = {};

function ContactLottieIcon({ src, size = 22, color = "#f97316" }: { src: string; size?: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const colorRef = useRef(color);
  colorRef.current = color;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const load = (data: object) => {
      el.innerHTML = "";
      const anim = loadLottieInView({ container: el, animationData: data });
      const recolor = () => {
        const c = colorRef.current;
        el.querySelectorAll("path,circle,rect,line,ellipse,polyline,polygon").forEach(p => {
          const s = p.getAttribute("stroke"); if (s && s !== "none" && s !== "transparent") p.setAttribute("stroke", c);
        });
      };
      anim.addEventListener("DOMLoaded", recolor);
      anim.addEventListener("enterFrame", recolor);
    };
    if (contactLottieCache[src]) { load(contactLottieCache[src]); return; }
    let cancelled = false;
    fetch(src).then(r => r.json()).then(json => { contactLottieCache[src] = json; if (!cancelled) load(json); }).catch(() => {});
    return () => { cancelled = true; el.innerHTML = ""; };
  }, [src]);
  return <div ref={ref} style={{ width: size, height: size, display: "inline-flex" }} />;
}

// ─── Data ───

const CONTACT_INFO = [
  {
    lottieSrc: "/lottie/location.json",
    label: "Noida Office",
    lines: ["206 Second Floor, Tower 1, Assotech Business Cresterra, Plot No-22, Sector 135, Noida - 201301, Uttar Pradesh, India"],
    color: "#f97316",
  },
  {
    lottieSrc: "/lottie/location.json",
    label: "Lucknow Office",
    lines: ["Vibhuti Khand, Gomti Nagar, Lucknow - 226010, Uttar Pradesh, India"],
    color: "#f97316",
  },
  {
    lottieSrc: "/lottie/message.json",
    label: "Email",
    lines: ["logsabhabharat@gmail.com"],
    color: "#22c55e",
    href: "mailto:logsabhabharat@gmail.com",
  },
  {
    lottieSrc: "/lottie/contact.json",
    label: "Phone",
    lines: ["+91 9839773333"],
    color: "#3b82f6",
    href: "tel:+919839773333",
  },
];

const TYPEWRITER_PHRASES = [
  "We'd love to hear from you...",
  "Have a question? Reach out...",
  "Let's build something together...",
  "Share your ideas with us...",
];

// ─── Typewriter ───

function TypewriterText() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = TYPEWRITER_PHRASES[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < phrase.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), 60);
    } else if (!deleting && charIdx === phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), 30);
    } else {
      setDeleting(false);
      setPhraseIdx((p) => (p + 1) % TYPEWRITER_PHRASES.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx]);

  return (
    <span className="text-slate-400">
      {TYPEWRITER_PHRASES[phraseIdx].slice(0, charIdx)}
      <span className="ml-0.5 inline-block animate-pulse text-amber-500">|</span>
    </span>
  );
}

// ─── Typewriter Placeholder Hook ───

function useTypewriterPlaceholder(phrases: string[], active: boolean) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!active) return;
    const phrase = phrases[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < phrase.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), 70);
    } else if (!deleting && charIdx === phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), 35);
    } else {
      setDeleting(false);
      setPhraseIdx((p) => (p + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases, active]);

  return phrases[phraseIdx].slice(0, charIdx);
}

// ─── Animated Input ───

const NAME_PHRASES = ["Your Name", "Enter full name", "e.g. Rahul Sharma"];
const EMAIL_PHRASES = ["Your Email", "Enter email address", "e.g. name@example.com"];
const MESSAGE_PHRASES = ["Your Message", "How can we help you?", "Tell us about your project...", "Share your ideas with us..."];

function AnimatedInput({
  type = "text",
  name,
  value,
  onChange,
  delay,
  textarea = false,
  phrases,
}: {
  type?: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  delay: number;
  textarea?: boolean;
  phrases: string[];
}) {
  const [focused, setFocused] = useState(false);
  const showTypewriter = !focused && value.length === 0;
  const typewriterText = useTypewriterPlaceholder(phrases, showTypewriter);
  const Tag = textarea ? "textarea" : "input";

  return (
    <ScrollReveal delay={delay}>
      <div className="relative">
        <Tag
          type={textarea ? undefined : type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={textarea ? 5 : undefined}
          className={`w-full resize-none rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none backdrop-blur-sm transition-all duration-300 ${textarea ? "flex-1 " : ""}${
            focused
              ? "border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              : "border-white/10 hover:border-white/20"
          }`}
        />
        {/* Typewriter placeholder overlay */}
        {showTypewriter && (
          <div className="pointer-events-none absolute top-0 left-0 flex items-start px-4 py-3">
            <span className="text-sm text-slate-500">
              {typewriterText}
            </span>
            <span className="ml-0.5 inline-block animate-pulse text-sm text-amber-500">|</span>
          </div>
        )}
        {/* Bottom highlight bar */}
        <motion.div
          className="absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0"
          initial={{ width: "0%" }}
          animate={{ width: focused ? "80%" : "0%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </ScrollReveal>
  );
}

// ─── Contact Info Card ───

function ContactCard({
  item,
  index,
}: {
  item: (typeof CONTACT_INFO)[0];
  index: number;
}) {
  const content = (
    <motion.div
      className="group flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.06]"
      whileHover={{ x: 4 }}
    >
      {/* Icon */}
      <motion.div
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${item.color}15` }}
        animate={{
          boxShadow: [
            `0 0 0px ${item.color}00`,
            `0 0 12px ${item.color}30`,
            `0 0 0px ${item.color}00`,
          ],
        }}
        transition={{
          duration: 3,
          delay: 2 + index * 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ContactLottieIcon src={item.lottieSrc} size={24} color={item.color} />
      </motion.div>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
          {item.label}
        </p>
        {item.lines.map((line, i) => (
          <p
            key={i}
            className="mt-0.5 text-sm text-slate-300 transition-colors group-hover:text-white"
          >
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );

  if (item.href) {
    return (
      <ScrollReveal delay={0.15 + index * 0.1} direction="right">
        <a href={item.href} className="block">
          {content}
        </a>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal delay={0.15 + index * 0.1} direction="right">
      {content}
    </ScrollReveal>
  );
}

// ─── Main Section ───

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0b1120] py-4 sm:py-6 lg:py-8"
    >
      {/* Geometric grid background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(245,158,11,0.4) 1px, transparent 1px), linear-gradient(-45deg, rgba(245,158,11,0.4) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120] via-transparent to-[#0b1120]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1120] via-transparent to-[#0b1120]" />
      </div>

      {/* Static ambient glows — no animation for scroll performance */}
      {isInView && (
        <>
          <div className="pointer-events-none absolute top-1/4 left-0 h-[500px] w-[500px] rounded-full bg-amber-500/[0.04] blur-[120px]" />
          <div className="pointer-events-none absolute right-0 bottom-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/[0.03] blur-[100px]" />
        </>
      )}

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              Get in{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mt-2 h-5 text-xs sm:text-sm">
              <TypewriterText />
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.25}>
            <div className="mt-2 h-[3px] w-12 rounded-full bg-amber-500" />
          </ScrollReveal>
        </div>

        {/* Grid: Form + Contact Info */}
        <div className="mt-4 grid gap-5 lg:mt-5 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          {/* Left: Form Card */}
          <ScrollReveal delay={0.1}>
            <motion.form
              onSubmit={handleSubmit}
              className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-md sm:p-5"
              animate={
                isInView
                  ? {
                      borderColor: [
                        "rgba(255,255,255,0.08)",
                        "rgba(245,158,11,0.2)",
                        "rgba(255,255,255,0.08)",
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 5,
                delay: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl" />
              <div className="absolute right-0 bottom-0 h-8 w-8 border-r-2 border-b-2 border-amber-500/30 rounded-br-2xl" />

              <div className="flex flex-1 flex-col space-y-3">
                <AnimatedInput
                  name="name"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  delay={0.2}
                  phrases={NAME_PHRASES}
                />
                <AnimatedInput
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  delay={0.3}
                  phrases={EMAIL_PHRASES}
                />
                <AnimatedInput
                  name="message"
                  value={form.message}
                  onChange={(v) => setForm((f) => ({ ...f, message: v }))}
                  delay={0.4}
                  textarea
                  phrases={MESSAGE_PHRASES}
                />

                {/* Submit button */}
                <ScrollReveal delay={0.6}>
                  <motion.button
                    type="submit"
                    className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30 sm:w-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Pulse ring */}
                    <motion.span
                      className="pointer-events-none absolute inset-[-2px] rounded-xl border-2 border-amber-400/50"
                      animate={
                        isInView
                          ? {
                              scale: [1, 1.04, 1],
                              opacity: [0.6, 0, 0.6],
                            }
                          : undefined
                      }
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    {submitted ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Sent Successfully!
                      </>
                    ) : (
                      <>
                        <ContactLottieIcon src="/lottie/paper-plane.json" size={32} color="#ffffff" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </ScrollReveal>
              </div>
            </motion.form>
          </ScrollReveal>

          {/* Right: Contact Info */}
          <div className="flex flex-col gap-5">
            <ScrollReveal delay={0.1} direction="right">
              <p className="text-sm leading-relaxed text-slate-400">
                Have questions about political analytics, campaign strategies, or
                partnership opportunities? Our team is ready to assist you. Reach
                out through any of the channels below.
              </p>
            </ScrollReveal>

            <div className="flex flex-col gap-2">
              {CONTACT_INFO.map((item, i) => (
                <ContactCard key={item.label} item={item} index={i} />
              ))}
            </div>

            {/* Social links */}
            {/* <ScrollReveal delay={0.6} direction="right">
              <div className="mt-2 flex items-center gap-3">
                <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Follow Us
                </span>
                <div className="h-px flex-1 bg-white/5" />
                {[
                  {
                    label: "Facebook",
                    d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                  },
                  {
                    label: "Twitter",
                    d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
                  },
                  {
                    label: "Instagram",
                    d: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z",
                  },
                  {
                    label: "LinkedIn",
                    d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                  },
                ].map((s) => (
                  <motion.a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-slate-400 transition-colors hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400"
                    whileHover={{ y: -2, scale: 1.1 }}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={s.d} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </ScrollReveal> */}
          </div>
        </div>
      </div>
    </section>
  );
}
