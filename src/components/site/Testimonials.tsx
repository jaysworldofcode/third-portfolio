"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { FaQuoteLeft } from "react-icons/fa6";
import { testimonials, type Testimonial } from "@/data/site";
import { useCarouselControls } from "@/hooks/useCarouselControls";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SliderControls } from "@/components/ui/SliderControls";

const AUTOPLAY_DELAY_MS = 6000;
const AVATAR_SIZE_PX = 56;

export function Testimonials() {
  const prefersReducedMotion = useReducedMotion();
  // Autoplay pauses while hovered or focused, and is left out entirely for visitors who prefer less motion.
  const plugins = useMemo(
    () =>
      prefersReducedMotion
        ? []
        : [Autoplay({ delay: AUTOPLAY_DELAY_MS, stopOnMouseEnter: true, stopOnInteraction: false })],
    [prefersReducedMotion],
  );
  const [viewportRef, carouselApi] = useEmblaCarousel({ loop: true, align: "start" }, plugins);
  const controls = useCarouselControls(carouselApi);

  return (
    <section id="testimonials" className="relative border-t border-line bg-bg py-28 text-muted md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8 md:mb-20">
          <SectionHeading
            eyebrow={testimonials.eyebrow}
            title={testimonials.title}
            titleHighlight={testimonials.titleHighlight}
            description={testimonials.description}
            className=""
          />
          <SliderControls
            previousLabel={testimonials.previousLabel}
            nextLabel={testimonials.nextLabel}
            canScrollPrev={controls.canScrollPrev}
            canScrollNext={controls.canScrollNext}
            onPrevious={controls.scrollPrev}
            onNext={controls.scrollNext}
          />
        </div>

        <Reveal>
          <div ref={viewportRef} role="region" aria-label={testimonials.title} className="overflow-hidden">
            <ul className="-ml-6 flex touch-pan-y">
              {testimonials.items.map((item) => (
                <li key={item.name} className="min-w-0 shrink-0 grow-0 basis-full pl-6 lg:basis-1/2">
                  <TestimonialCard testimonial={item} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col justify-between gap-12 rounded-3xl border border-line bg-surface p-8 md:p-12">
      <div>
        <FaQuoteLeft aria-hidden className="size-8 text-accent-text" />
        <blockquote className="mt-8 font-heading text-2xl leading-snug font-bold text-fg md:text-3xl">
          {testimonial.quote}
        </blockquote>
      </div>
      <figcaption className="flex items-center gap-4">
        <Image
          src={testimonial.avatar}
          alt=""
          width={AVATAR_SIZE_PX}
          height={AVATAR_SIZE_PX}
          className="size-14 rounded-full bg-surface-raised object-cover"
        />
        <div>
          <p className="font-heading text-lg font-bold text-fg">{testimonial.name}</p>
          <p className="text-sm">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
