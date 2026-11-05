"use client";

import { useEffect, useState } from "react";

// Treat a section as active when it crosses a thin band around the middle of the viewport.
const ACTIVE_BAND_ROOT_MARGIN = "-45% 0px -50% 0px";

export function useScrollSpy<T extends string>(sectionIds: readonly T[]) {
  const [activeId, setActiveId] = useState<T>(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id as T);
      },
      { rootMargin: ACTIVE_BAND_ROOT_MARGIN },
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
