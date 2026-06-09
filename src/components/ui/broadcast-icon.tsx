import { forwardRef, useImperativeHandle, useRef } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const BroadcastIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();
    const animationControls = useRef<Array<ReturnType<typeof animate>>>([]);

    const start = async () => {
      animationControls.current.forEach((control) => control.stop());
      animationControls.current = [];

      animationControls.current.push(
        animate(
          ".wave-inner",
          { opacity: [0, 1, 0], scale: [0.8, 1, 0.8] },
          { duration: 1.2, ease: "easeInOut", repeat: 2 },
        ),
      );
      animationControls.current.push(
        animate(
          ".wave-outer",
          { opacity: [0, 1, 0], scale: [0.85, 1, 0.85] },
          { duration: 1.2, ease: "easeInOut", repeat: 2, delay: 0.2 },
        ),
      );
      animationControls.current.push(
        animate(
          ".broadcast-dot",
          { scale: [1, 1.3, 1] },
          { duration: 0.6, ease: "easeInOut", repeat: 4 },
        ),
      );
    };

    const stop = () => {
      animationControls.current.forEach((control) => control.stop());
      animationControls.current = [];

      animate(".wave-inner", { opacity: 1, scale: 1 }, { duration: 0.3 });
      animate(".wave-outer", { opacity: 1, scale: 1 }, { duration: 0.3 });
      animate(".broadcast-dot", { scale: 1 }, { duration: 0.3 });
    };

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    return (
      <motion.svg
        ref={scope}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`cursor-pointer ${className}`}
        onHoverStart={start}
        onHoverEnd={stop}
      >
        {/* Center dot */}
        <motion.circle
          className="broadcast-dot"
          cx="12"
          cy="12"
          r="2"
          fill={color}
          stroke="none"
          style={{ transformOrigin: "12px 12px" }}
        />

        {/* Inner wave left */}
        <motion.path
          className="wave-inner"
          d="M8.46 15.54a5 5 0 0 1 0-7.07"
          style={{ transformOrigin: "12px 12px" }}
        />
        {/* Inner wave right */}
        <motion.path
          className="wave-inner"
          d="M15.54 8.46a5 5 0 0 1 0 7.07"
          style={{ transformOrigin: "12px 12px" }}
        />

        {/* Outer wave left */}
        <motion.path
          className="wave-outer"
          d="M4.93 19.07a10 10 0 0 1 0-14.14"
          style={{ transformOrigin: "12px 12px" }}
        />
        {/* Outer wave right */}
        <motion.path
          className="wave-outer"
          d="M19.07 4.93a10 10 0 0 1 0 14.14"
          style={{ transformOrigin: "12px 12px" }}
        />
      </motion.svg>
    );
  },
);

BroadcastIcon.displayName = "BroadcastIcon";
export default BroadcastIcon;
