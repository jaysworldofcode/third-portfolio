"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { hero } from "@/data/site";
import { HeroButtons, hasHeroButtons } from "./HeroButtons";
import { FadeUp, MaskLine } from "./IntroReveal";

const { media } = hero;

/** Headline over a full-screen background video or photo. */
export function MediaHero() {
  return (
    // Footage is dark in both themes, so the dark palette is scoped here to keep text readable.
    <section
      id="home"
      data-theme="dark"
      className="relative flex min-h-svh items-end overflow-hidden bg-bg text-muted"
    >
      {media.type === "video" ? (
        <BackgroundVideo />
      ) : (
        <Image src={media.src} alt={media.alt} fill preload sizes="100vw" className="object-cover" />
      )}
      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/40" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-36 pb-24 md:px-10 md:pb-32">
        <FadeUp order={0}>
          <p className="flex items-center gap-3 text-label text-fg/80">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {hero.eyebrow}
          </p>
        </FadeUp>

        <h1 className="mt-8 max-w-5xl font-heading text-[clamp(2.75rem,8vw,8rem)] leading-[0.95] font-bold tracking-tight text-fg">
          <MaskLine order={1}>{hero.title}</MaskLine>
          <MaskLine order={2}>
            <span className="text-accent-text">{hero.titleHighlight}</span>
          </MaskLine>
        </h1>

        <FadeUp order={3}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-fg/80">{hero.summary}</p>
        </FadeUp>

        {hasHeroButtons && (
          <FadeUp order={4} className="mt-10 flex flex-wrap gap-4">
            <HeroButtons />
          </FadeUp>
        )}
      </div>

      <div aria-hidden className="absolute right-6 bottom-10 hidden items-center gap-4 md:right-10 md:flex">
        <span className="text-label text-fg/70">{hero.scrollHintLabel}</span>
        <span className="relative h-10 w-px overflow-hidden bg-fg/20">
          <span className="absolute inset-0 animate-scroll-line bg-fg motion-reduce:animate-none" />
        </span>
      </div>
    </section>
  );
}

function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // The autoplay attribute starts the video before hydration; stop it for visitors who prefer less motion.
  useEffect(() => {
    if (prefersReducedMotion) videoRef.current?.pause();
  }, [prefersReducedMotion]);

  return (
    <video
      ref={videoRef}
      src={media.src}
      poster={media.poster || undefined}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden
      tabIndex={-1}
      className="absolute inset-0 size-full object-cover"
    />
  );
}
