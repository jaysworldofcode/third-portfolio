"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { hero, isLinkAvailable, type StoryChapter } from "@/data/site";
import { useScrollVideo } from "@/hooks/useScrollVideo";
import { formatIndex } from "@/lib/formatIndex";
import { BUTTON_STYLES } from "@/components/ui/buttonStyles";
import { HeroButtons, hasHeroButtons } from "./hero/HeroButtons";

/** Scroll distance for the intro and for each chapter, in screen heights. */
const STEP_HEIGHT_SVH = 100;
const LINE_STAGGER_MS = 90;

const story = hero.scrollVideo;
const stepCount = story.chapters.length + 1;

/** The "scrollVideo" hero style: a pinned video scrubbed by scroll, with one screen per chapter. */
export function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const activeStep = useScrollVideo({ sectionRef, videoRef, progressRef, stepCount });

  return (
    // Footage is dark in both themes, so the dark palette is scoped here to keep text readable.
    <section
      id="home"
      ref={sectionRef}
      data-theme="dark"
      style={{ height: `${stepCount * STEP_HEIGHT_SVH}svh` }}
      className="relative bg-bg text-muted"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <video
          ref={videoRef}
          src={story.video}
          poster={story.poster}
          muted
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0 size-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-bg/30" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-bg/80 to-transparent" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-bg via-bg/60 to-transparent"
        />

        <StoryIntro isActive={activeStep === 0} />
        {story.chapters.map((chapter, index) => (
          <StoryChapterPanel
            key={chapter.title}
            chapter={chapter}
            position={index + 1}
            isActive={activeStep === index + 1}
          />
        ))}

        <ChapterIndex activeChapter={activeStep} />

        <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-fg/10">
          <span ref={progressRef} className="block h-full origin-left scale-x-0 bg-accent" />
        </div>
      </div>
    </section>
  );
}

function StoryIntro({ isActive }: { isActive: boolean }) {
  return (
    <StoryPanel isActive={isActive} className="flex items-center">
      <div className="mx-auto w-full max-w-7xl px-6 pt-20 md:px-10">
        <StoryLine isActive={isActive} order={0}>
          <span className="flex items-center gap-3 text-label text-fg/70">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {hero.eyebrow}
          </span>
        </StoryLine>
        <StoryLine isActive={isActive} order={1}>
          <h1 className="mt-6 font-heading text-[clamp(2.5rem,min(8.5vw,11svh),7.5rem)] leading-[0.98] font-bold tracking-tight text-fg md:mt-8">
            {hero.title}
            <br />
            <span className="text-accent-text">{hero.titleHighlight}</span>
          </h1>
        </StoryLine>
        <StoryLine isActive={isActive} order={2}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/80 md:mt-8 md:text-xl">{hero.summary}</p>
        </StoryLine>
        {hasHeroButtons && (
          <StoryLine isActive={isActive} order={3}>
            <div inert={!isActive} className="mt-8 flex flex-wrap gap-4 md:mt-12">
              <HeroButtons />
            </div>
          </StoryLine>
        )}
      </div>

      <StepCaption text={`${story.index} / ${story.label}`} />

      <div aria-hidden className="absolute bottom-10 left-0 w-full [@media(max-height:760px)]:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-6 md:px-10">
          <span className="text-label text-fg/70">{hero.scrollHintLabel}</span>
          <span className="relative h-10 w-px overflow-hidden bg-fg/20">
            <span className="absolute inset-0 animate-scroll-line bg-fg motion-reduce:animate-none" />
          </span>
        </div>
      </div>
    </StoryPanel>
  );
}

function StoryChapterPanel({
  chapter,
  position,
  isActive,
}: {
  chapter: StoryChapter;
  position: number;
  isActive: boolean;
}) {
  const showButton = chapter.button && isLinkAvailable(chapter.button.href);

  return (
    <StoryPanel isActive={isActive} className="flex items-end">
      <div className="mx-auto w-full max-w-7xl px-6 pb-20 md:px-10 md:pb-24">
        <StoryLine isActive={isActive} order={0}>
          <div className="flex items-end gap-6">
            <span className="font-heading text-[clamp(3.5rem,min(9vw,12svh),6rem)] leading-none font-bold text-outline">
              {formatIndex(position)}
            </span>
            <span className="pb-2 text-label text-accent-text">{chapter.label}</span>
          </div>
        </StoryLine>
        <StoryLine isActive={isActive} order={1}>
          <h2 className="mt-6 max-w-4xl font-heading text-[clamp(2.25rem,min(6.5vw,9svh),4.75rem)] leading-[1.02] font-bold tracking-tight text-fg md:mt-8">
            {chapter.title}
          </h2>
        </StoryLine>
        <StoryLine isActive={isActive} order={2}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-fg/75 md:text-lg">{chapter.description}</p>
        </StoryLine>
        {showButton && chapter.button && (
          <StoryLine isActive={isActive} order={3}>
            <div inert={!isActive} className="mt-10">
              <a href={chapter.button.href} className={BUTTON_STYLES.solid}>
                {chapter.button.label}
              </a>
            </div>
          </StoryLine>
        )}
      </div>

      <StepCaption text={chapter.caption} />
    </StoryPanel>
  );
}

function StoryPanel({ isActive, className, children }: { isActive: boolean; className: string; children: ReactNode }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
        isActive ? "opacity-100" : "pointer-events-none opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Slides one line of a panel up into place, one after another, when its panel becomes active. */
function StoryLine({ isActive, order, children }: { isActive: boolean; order: number; children: ReactNode }) {
  const style: CSSProperties = { transitionDelay: isActive ? `${order * LINE_STAGGER_MS}ms` : "0ms" };

  return (
    <div
      style={style}
      className={`transition-all duration-1000 ease-out-expo motion-reduce:transition-none ${
        isActive ? "translate-y-0 opacity-100 blur-none" : "translate-y-8 opacity-0 blur-sm"
      }`}
    >
      {children}
    </div>
  );
}

function StepCaption({ text }: { text: string }) {
  return (
    <div className="absolute top-28 left-0 hidden w-full md:block">
      <div className="mx-auto flex max-w-7xl justify-end px-6 md:px-10">
        <span className="flex items-center gap-4 text-label text-fg/70">
          <span className="h-px w-10 bg-accent" />
          {text}
        </span>
      </div>
    </div>
  );
}

function ChapterIndex({ activeChapter }: { activeChapter: number }) {
  return (
    <ol aria-hidden className="absolute top-1/2 right-6 hidden -translate-y-1/2 flex-col gap-4 md:right-10 md:flex">
      {story.chapters.map((chapter, index) => {
        const isActive = activeChapter === index + 1;
        return (
          <li
            key={chapter.title}
            className={`flex items-center justify-end gap-3 text-label transition-colors duration-500 ${
              isActive ? "text-accent-text" : "text-fg/40"
            }`}
          >
            {formatIndex(index + 1)}
            <span
              className={`h-px bg-current transition-all duration-500 ease-out-expo ${isActive ? "w-10" : "w-4"}`}
            />
          </li>
        );
      })}
    </ol>
  );
}
