"use client";

import { useEffect, useState, type RefObject } from "react";

/** Share of the remaining distance covered each frame; lower is smoother but lags more. */
const SMOOTHING = 0.12;
const SETTLE_THRESHOLD = 0.0005;
const SEEK_TOLERANCE_S = 0.01;
/** Some browsers show a black frame when seeking to the exact end of a video. */
const END_OFFSET_S = 0.05;

type ScrollVideoOptions = {
  sectionRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  progressRef: RefObject<HTMLElement | null>;
  stepCount: number;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Scrubs a video with the scroll position inside a tall section and reports which of `stepCount`
 * equal steps of that section is on screen.
 */
export function useScrollVideo({ sectionRef, videoRef, progressRef, stepCount }: ScrollVideoOptions) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const smoothing = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : SMOOTHING;
    let targetProgress = 0;
    let progress = 0;
    let frame = 0;

    const readProgress = () => {
      const rect = section.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;
      return scrollableHeight > 0 ? clamp01(-rect.top / scrollableHeight) : 0;
    };

    // Skipped while a seek is running; the "seeked" listener catches up afterwards.
    const seekVideo = () => {
      if (!video.duration || video.seeking) return;
      const time = progress * Math.max(0, video.duration - END_OFFSET_S);
      if (Math.abs(video.currentTime - time) > SEEK_TOLERANCE_S) video.currentTime = time;
    };

    const render = () => {
      seekVideo();
      progressRef.current?.style.setProperty("transform", `scaleX(${progress})`);
      setActiveStep(Math.min(stepCount - 1, Math.floor(progress * stepCount)));
    };

    const tick = () => {
      progress += (targetProgress - progress) * smoothing;
      if (Math.abs(targetProgress - progress) < SETTLE_THRESHOLD) progress = targetProgress;
      render();
      frame = progress === targetProgress ? 0 : requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      targetProgress = readProgress();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // iOS Safari only paints seeked frames once the video has started playing at least once.
    const unlockVideo = () => {
      video
        .play()
        .then(() => video.pause())
        .catch(() => {});
    };

    targetProgress = progress = readProgress();
    render();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    window.addEventListener("touchstart", unlockVideo, { once: true, passive: true });
    video.addEventListener("loadedmetadata", render);
    video.addEventListener("seeked", seekVideo);
    video.addEventListener("pause", seekVideo);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("touchstart", unlockVideo);
      video.removeEventListener("loadedmetadata", render);
      video.removeEventListener("seeked", seekVideo);
      video.removeEventListener("pause", seekVideo);
    };
  }, [sectionRef, videoRef, progressRef, stepCount]);

  return activeStep;
}
