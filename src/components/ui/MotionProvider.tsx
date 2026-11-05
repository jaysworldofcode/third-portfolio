"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * With "user", motion skips transform and layout animations for visitors who prefer reduced
 * motion (opacity fades still run), so individual components don't each need to check.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
