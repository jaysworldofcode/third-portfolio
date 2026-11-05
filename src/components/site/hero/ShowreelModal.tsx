"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { hero } from "@/data/site";
import { getVideoEmbedUrl } from "@/lib/videoEmbed";

const { showreel } = hero;
// Computed once: the showreel link is static content, so there's no need to re-parse it on every render.
const embedUrl = getVideoEmbedUrl(showreel.video);
const FADE_DURATION_S = 0.35;
const PANEL_START_SCALE = 0.94;
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), video[controls], iframe, [tabindex]:not([tabindex="-1"])';

/** Keeps Tab and Shift+Tab cycling inside the dialog instead of escaping to the page behind it. */
function trapFocus(event: KeyboardEvent, container: HTMLElement | null) {
  const focusable = container ? Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];
  const first = focusable[0];
  const last = focusable.at(-1);
  if (!first || !last) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

type ShowreelModalProps = {
  isOpen: boolean;
  /** Must keep the same identity between renders (e.g. from useCallback). */
  onClose: () => void;
};

export function ShowreelModal({ isOpen, onClose }: ShowreelModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "Tab") trapFocus(event, dialogRef.current);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={showreel.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION_S }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-10"
        >
          <div aria-hidden onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={showreel.closeLabel}
            title={showreel.closeLabel}
            className="absolute top-5 right-5 z-10 grid size-12 cursor-pointer place-items-center rounded-full bg-accent text-on-accent transition-transform duration-300 hover:rotate-90 md:top-8 md:right-8"
          >
            <FaXmark aria-hidden className="size-5" />
          </button>

          <motion.div
            initial={{ opacity: 0, scale: PANEL_START_SCALE }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: PANEL_START_SCALE }}
            transition={{ duration: FADE_DURATION_S }}
            className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-2xl bg-black"
          >
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={showreel.label}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="size-full border-0"
              />
            ) : (
              <video
                src={showreel.video}
                poster={showreel.poster || undefined}
                controls
                autoPlay
                playsInline
                className="size-full object-contain"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
