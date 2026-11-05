"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePageReady } from "@/hooks/usePageReady";

const STAGGER_S = 0.12;
const MASK_DURATION_S = 1.1;
const FADE_DURATION_S = 0.9;
const FADE_OFFSET_PX = 24;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type IntroRevealProps = {
  children: ReactNode;
  /** Position in the intro sequence; each step starts a little after the previous one. */
  order: number;
  className?: string;
};

/**
 * Slides a headline line up from behind a mask once the Preloader starts leaving.
 * The padding/negative margin pair keeps descenders from being clipped by the mask.
 */
export function MaskLine({ children, order, className = "" }: IntroRevealProps) {
  const isReady = usePageReady();

  return (
    <span className={`-mb-[0.12em] block overflow-hidden pb-[0.12em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: isReady ? "0%" : "110%" }}
        transition={{ duration: MASK_DURATION_S, ease: EASE_OUT_EXPO, delay: order * STAGGER_S }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Fades and lifts a block into place as part of the hero intro sequence. */
export function FadeUp({ children, order, className = "" }: IntroRevealProps) {
  const isReady = usePageReady();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: FADE_OFFSET_PX }}
      animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: FADE_OFFSET_PX }}
      transition={{ duration: FADE_DURATION_S, ease: EASE_OUT_EXPO, delay: order * STAGGER_S }}
    >
      {children}
    </motion.div>
  );
}
