"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

const COUNT_DURATION_S = 2;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
/** Start counting once the number is a little way into the viewport, not at its very edge. */
const IN_VIEW_MARGIN = "0px 0px -15% 0px";

type StatCounterProps = { value: number; suffix: string };

/** Counts up from zero to `value` the first time it scrolls into view. */
export function StatCounter({ value, suffix }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: IN_VIEW_MARGIN });
  const prefersReducedMotion = useReducedMotion();
  const count = useMotionValue(0);
  const roundedCount = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (!isInView) return;
    const counting = animate(count, value, {
      duration: prefersReducedMotion ? 0 : COUNT_DURATION_S,
      ease: EASE_OUT_EXPO,
    });
    return () => counting.stop();
  }, [count, isInView, prefersReducedMotion, value]);

  return (
    <span ref={ref}>
      {/* Screen readers get the final figure once, instead of every number on the way up. */}
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span aria-hidden className="tabular-nums">
        <motion.span>{roundedCount}</motion.span>
        {suffix}
      </span>
    </span>
  );
}
