import { useRef, useEffect } from "react";

interface BackgroundVideoProps {
  src: string;
  poster?: string;
  className?: string;
  onPlaying?: () => void;
}

export function BackgroundVideo({ src, poster, className = "", onPlaying }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlaying = () => onPlaying?.();
    video.addEventListener("playing", handlePlaying);

    // IntersectionObserver to pause when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => {
      video.removeEventListener("playing", handlePlaying);
      observer.disconnect();
    };
  }, [onPlaying]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
