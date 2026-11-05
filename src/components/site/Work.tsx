"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { FaArrowRight } from "react-icons/fa6";
import { work, type Project } from "@/data/site";
import { useCarouselControls } from "@/hooks/useCarouselControls";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SliderControls } from "@/components/ui/SliderControls";

export function Work() {
  const [viewportRef, carouselApi] = useEmblaCarousel({ align: "start" });
  const controls = useCarouselControls(carouselApi);

  return (
    <section id="work" className="relative overflow-hidden border-t border-line bg-bg py-28 text-muted md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8 md:mb-20">
          <SectionHeading
            eyebrow={work.eyebrow}
            title={work.title}
            titleHighlight={work.titleHighlight}
            description={work.description}
            className=""
          />
          <SliderControls
            previousLabel={work.previousLabel}
            nextLabel={work.nextLabel}
            canScrollPrev={controls.canScrollPrev}
            canScrollNext={controls.canScrollNext}
            onPrevious={controls.scrollPrev}
            onNext={controls.scrollNext}
          />
        </div>

        <Reveal>
          {/* Visible overflow lets the next card peek past the container edge as a hint to drag. */}
          <div ref={viewportRef} role="region" aria-label={work.title} className="overflow-visible">
            <ul className="-ml-6 flex touch-pan-y">
              {work.projects.map((project) => (
                <li key={project.title} className="min-w-0 shrink-0 grow-0 basis-[88%] pl-6 sm:basis-[60%] lg:basis-[42%]">
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <a href={project.href} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 40vw, (min-width: 640px) 60vw, 88vw"
          className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-105"
        />
        <span className="absolute top-5 left-5 rounded-full bg-bg/80 px-4 py-2 text-label text-fg backdrop-blur-md">
          {project.category}
        </span>
        <span
          aria-hidden
          className="absolute right-5 bottom-5 grid size-14 translate-y-3 place-items-center rounded-full bg-accent text-on-accent opacity-0 transition duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          <FaArrowRight className="size-4 -rotate-45" />
        </span>
      </div>
      <div className="mt-6 flex items-center gap-3 text-label">
        <span>{project.client}</span>
        <span aria-hidden className="size-1 rounded-full bg-accent" />
        <span>{project.year}</span>
      </div>
      <h3 className="mt-3 font-heading text-2xl font-bold text-fg transition-colors duration-300 group-hover:text-accent-text md:text-3xl">
        {project.title}
      </h3>
      <p className="mt-2 max-w-md leading-relaxed">{project.description}</p>
    </a>
  );
}
