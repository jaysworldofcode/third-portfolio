"use client";

import { useCallback, useState } from "react";
import { FaPlay } from "react-icons/fa6";
import { hero } from "@/data/site";
import { formatIndex } from "@/lib/formatIndex";
import { Marquee } from "@/components/ui/Marquee";
import { HeroButtons } from "./HeroButtons";
import { FadeUp, MaskLine } from "./IntroReveal";
import { ShowreelModal } from "./ShowreelModal";

const BAND_DURATION_S = 30;

/** Big type, a scrolling word band and a showreel button. */
export function MarqueeHero() {
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);
  const closeShowreel = useCallback(() => setIsShowreelOpen(false), []);

  return (
    <section id="home" className="relative flex min-h-svh flex-col overflow-hidden bg-bg pt-32 text-muted md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 -right-40 size-[36rem] rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        <FadeUp order={0}>
          <p className="flex items-center gap-3 text-label">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {hero.eyebrow}
          </p>
        </FadeUp>

        <h1 className="mt-8 font-heading text-[clamp(3rem,9vw,9rem)] leading-[0.95] font-bold tracking-tight text-fg">
          <MaskLine order={1}>{hero.title}</MaskLine>
          <MaskLine order={2}>
            <span className="text-accent-text">{hero.titleHighlight}</span>
          </MaskLine>
        </h1>

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:items-end">
          <FadeUp order={3} className="lg:col-span-5">
            <p className="max-w-md text-lg leading-relaxed">{hero.summary}</p>
          </FadeUp>
          <FadeUp order={4} className="flex flex-wrap items-center gap-4 lg:col-span-7 lg:justify-end">
            <HeroButtons />
            <ShowreelButton onClick={() => setIsShowreelOpen(true)} />
          </FadeUp>
        </div>
      </div>

      <div className="relative mt-auto pt-16 md:pt-24">
        <Marquee durationSeconds={BAND_DURATION_S} className="border-y border-line py-6 md:py-8">
          {hero.marquee.map((word, index) => (
            <span key={`${word}-${index}`} className="flex items-center">
              <span
                className={`px-6 font-heading text-5xl font-bold whitespace-nowrap uppercase md:px-10 md:text-7xl ${
                  index % 2 === 0 ? "text-fg" : "text-outline"
                }`}
              >
                {word}
              </span>
              <span aria-hidden className="size-3 rotate-45 bg-accent md:size-4" />
            </span>
          ))}
        </Marquee>

        {hero.highlights.length > 0 && (
          <ul className="mx-auto grid max-w-7xl gap-4 px-6 py-8 sm:grid-cols-3 md:px-10">
            {hero.highlights.map((highlight, index) => (
              <li key={highlight} className="flex items-center gap-4 text-sm">
                <span className="text-label text-accent-text">{formatIndex(index + 1)}</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ShowreelModal isOpen={isShowreelOpen} onClose={closeShowreel} />
    </section>
  );
}

function ShowreelButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className="group inline-flex cursor-pointer items-center gap-4 text-label text-fg"
    >
      <span className="grid size-14 place-items-center rounded-full border border-line transition duration-500 ease-out-expo group-hover:scale-110 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
        <FaPlay aria-hidden className="ml-0.5 size-3.5" />
      </span>
      {hero.showreel.label}
    </button>
  );
}
