import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import lottieWeb from "lottie-web";

function ChatLottieIcon({ size = 28, color = "#ffffff" }: { size?: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const colorRef = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    fetch("/lottie/speech-bubble.json")
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        el.innerHTML = "";
        const anim = lottieWeb.loadAnimation({
          container: el,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: json,
        });
        const recolor = () => {
          const c = colorRef.current;
          el.querySelectorAll("path,circle,rect,line,ellipse,polyline,polygon").forEach((p) => {
            const s = p.getAttribute("stroke");
            if (s && s !== "none" && s !== "transparent") p.setAttribute("stroke", c);
            const f = p.getAttribute("fill");
            if (f && f !== "none" && f !== "transparent") p.setAttribute("fill", c);
          });
        };
        anim.addEventListener("DOMLoaded", recolor);
        anim.addEventListener("enterFrame", recolor);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      el.innerHTML = "";
    };
  }, []);

  return <div ref={ref} style={{ width: size, height: size, display: "inline-flex" }} />;
}

export function FloatingChatButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="fixed right-6 bottom-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex items-center gap-2 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-shadow hover:shadow-xl hover:shadow-orange-500/40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ padding: hovered ? "10px 20px 10px 12px" : "12px" }}
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full">
          <span className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-20" />
        </span>

        <span className="relative z-10 flex items-center justify-center">
          <ChatLottieIcon size={28} color="#ffffff" />
        </span>

        <AnimatePresence>
          {hovered && (
            <motion.span
              className="relative z-10 whitespace-nowrap text-sm font-bold tracking-wide"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Ask AI
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
