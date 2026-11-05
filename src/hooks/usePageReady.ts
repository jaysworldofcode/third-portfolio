"use client";

import { useSyncExternalStore } from "react";

/**
 * Set by the Preloader when its exit wipe starts, so intro animations (like the hero headline)
 * play as the page is revealed instead of hidden behind the loader. Pages without the Preloader
 * should not wait on this.
 */
let isPageReady = false;
const listeners = new Set<() => void>();

export function markPageReady() {
  if (isPageReady) return;
  isPageReady = true;
  listeners.forEach((notify) => notify());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function usePageReady() {
  return useSyncExternalStore(
    subscribe,
    () => isPageReady,
    () => false,
  );
}
