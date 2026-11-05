"use client";

import { useSyncExternalStore } from "react";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export function useScrolledPast(offsetPx: number) {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > offsetPx,
    () => false,
  );
}
