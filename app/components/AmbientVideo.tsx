"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * A silent, looping background film with no controls of any kind: no play or
 * pause button, no picture-in-picture, no casting, and taps pass straight
 * through it. If a browser holds autoplay back (iOS Low Power Mode does), it
 * starts on the visitor's first touch or scroll, and again whenever the tab
 * comes back into view.
 */
export default function AmbientVideo({
  src,
  poster,
  className = "",
  style,
}: {
  src: string | null;
  poster: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    v.muted = true;
    const play = () => {
      if (v.paused) v.play().catch(() => {});
    };
    play();
    const onVisible = () => {
      if (document.visibilityState === "visible") play();
    };
    const events = ["touchstart", "pointerdown", "scroll", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, play, { passive: true }));
    document.addEventListener("visibilitychange", onVisible);
    v.addEventListener("pause", play);
    return () => {
      events.forEach((e) => window.removeEventListener(e, play));
      document.removeEventListener("visibilitychange", onVisible);
      v.removeEventListener("pause", play);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      src={src ?? undefined}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
      aria-hidden="true"
      tabIndex={-1}
      className={`ambient-video pointer-events-none select-none ${className}`}
      style={style}
    />
  );
}
