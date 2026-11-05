"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { owner } from "@/data/site";
import { markPageReady } from "@/hooks/usePageReady";

const COUNT_DURATION_S = 1.6;
const WIPE_DURATION_S = 0.9;
const MAX_PERCENT = 100;
/** Slow start and end, so the wipe feels like a curtain rather than a slide. */
const WIPE_EASE = [0.76, 0, 0.24, 1] as const;

function waitForPageLoad() {
  return new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });
}

/** Covers the page while it loads, counting to 100 before wiping upwards to reveal it. */
export function Preloader() {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const progress = useMotionValue(0);
  const percent = useTransform(progress, (value) => Math.round(value));
  const barScale = useTransform(progress, [0, MAX_PERCENT], [0, 1]);

  useEffect(() => {
    let isCancelled = false;
    // Reduced motion jumps straight to 100; the wipe itself is a transform, which MotionConfig skips.
    const counting = animate(progress, MAX_PERCENT, {
      duration: prefersReducedMotion ? 0 : COUNT_DURATION_S,
      ease: "easeInOut",
    });

    Promise.all([counting, waitForPageLoad()]).then(() => {
      if (isCancelled) return;
      markPageReady();
      setIsVisible(false);
    });

    return () => {
      isCancelled = true;
      counting.stop();
    };
  }, [prefersReducedMotion, progress]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          aria-hidden
          exit={{ y: "-100%" }}
          transition={{ duration: WIPE_DURATION_S, ease: WIPE_EASE }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-accent p-6 text-on-accent md:p-10"
        >
          <div className="flex items-center justify-between gap-6">
            <span className="font-heading text-xl font-bold md:text-2xl">{owner.name}</span>
            <span className="size-2.5 animate-pulse rounded-full bg-on-accent motion-reduce:animate-none" />
          </div>

          <div>
            <div className="flex items-end justify-end gap-2">
              <motion.span className="font-heading text-[clamp(6rem,24vw,20rem)] leading-[0.8] font-bold tabular-nums">
                {percent}
              </motion.span>
              <span className="font-heading text-3xl font-bold md:text-5xl">%</span>
            </div>
            <div className="mt-6 h-0.5 w-full bg-on-accent/20 md:mt-10">
              <motion.span style={{ scaleX: barScale }} className="block h-full origin-left bg-on-accent" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
