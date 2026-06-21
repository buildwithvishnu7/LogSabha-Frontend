import lottieWeb, { type AnimationItem } from "lottie-web";

interface LoadLottieOptions {
  container: HTMLElement;
  animationData: object;
  loop?: boolean;
  autoplay?: boolean;
  renderer?: "svg" | "canvas" | "html";
}

/**
 * Drop-in replacement for `lottieWeb.loadAnimation` that pauses the animation
 * whenever its container scrolls out of view.
 *
 * lottie-web's SVG renderer redraws every frame via requestAnimationFrame and
 * does NOT stop when off-screen. With dozens of looping Lottie icons mounted at
 * once, that keeps the main thread busy even for sections the user can't see.
 * Gating playback on an IntersectionObserver cuts that to only the visible ones.
 *
 * Returns the same `AnimationItem` as `loadAnimation`. Calling `.destroy()` also
 * disconnects the observer, so existing cleanup code keeps working unchanged.
 */
export function loadLottieInView(opts: LoadLottieOptions): AnimationItem {
  const wantPlay = opts.autoplay ?? true;

  const anim = lottieWeb.loadAnimation({
    container: opts.container,
    renderer: opts.renderer ?? "svg",
    loop: opts.loop ?? true,
    // We drive playback ourselves through the observer below.
    autoplay: false,
    animationData: opts.animationData,
  });

  let inView = false;

  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      if (inView && wantPlay) {
        anim.play();
      } else {
        anim.pause();
      }
    },
    { threshold: 0.01 },
  );
  observer.observe(opts.container);

  // Preserve existing cleanup: callers already call anim.destroy() / clear the
  // container, so fold observer teardown into destroy().
  const originalDestroy = anim.destroy.bind(anim);
  anim.destroy = () => {
    observer.disconnect();
    originalDestroy();
  };

  return anim;
}
