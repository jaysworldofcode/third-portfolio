"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { UseEmblaCarouselType } from "embla-carousel-react";

type CarouselApi = UseEmblaCarouselType[1];

const noop = () => {};

/** Previous/next state and actions for an Embla carousel, kept in sync with its "select" events. */
export function useCarouselControls(api: CarouselApi) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!api) return noop;
      api.on("select", onChange).on("reInit", onChange);
      return () => {
        api.off("select", onChange).off("reInit", onChange);
      };
    },
    [api],
  );

  const canScrollPrev = useSyncExternalStore(
    subscribe,
    () => api?.canScrollPrev() ?? false,
    () => false,
  );
  const canScrollNext = useSyncExternalStore(
    subscribe,
    () => api?.canScrollNext() ?? false,
    () => false,
  );

  return {
    canScrollPrev,
    canScrollNext,
    scrollPrev: () => api?.scrollPrev(),
    scrollNext: () => api?.scrollNext(),
  };
}
