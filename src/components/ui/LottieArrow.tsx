import { useRef, useEffect } from "react";
import lottieWeb from "lottie-web";

export function LottieArrow({
  size = 16,
  color = "#d97706",
}: {
  size?: number;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    fetch("/lottie/right-arrow.json")
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
        const restyle = () => {
          el.querySelectorAll(
            "path,circle,rect,line,ellipse,polyline,polygon"
          ).forEach((p) => {
            const s = p.getAttribute("stroke");
            if (s && s !== "none" && s !== "transparent")
              p.setAttribute("stroke", color);
            const f = p.getAttribute("fill");
            if (f && f !== "none" && f !== "transparent")
              p.setAttribute("fill", color);
            const sw = parseFloat(p.getAttribute("stroke-width") || "0");
            if (sw > 0) p.setAttribute("stroke-width", "25");
          });
        };
        anim.addEventListener("DOMLoaded", restyle);
        anim.addEventListener("enterFrame", restyle);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      el.innerHTML = "";
    };
  }, [color]);
  return (
    <div
      ref={ref}
      style={{ width: size, height: size, display: "inline-flex", flexShrink: 0 }}
    />
  );
}
