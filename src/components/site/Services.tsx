"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useId, useRef, useState, type PointerEvent } from "react";
import { FaPlus } from "react-icons/fa6";
import { services } from "@/data/site";
import { formatIndex } from "@/lib/formatIndex";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ROW_STAGGER_MS = 80;
/** A soft spring so the preview trails the cursor a little instead of sticking to it. */
const FOLLOW_SPRING = { stiffness: 220, damping: 26, mass: 0.6 };
const PREVIEW_FADE_S = 0.3;
const HIDDEN_PREVIEW_SCALE = 0.85;

export function Services() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const followX = useSpring(pointerX, FOLLOW_SPRING);
  const followY = useSpring(pointerY, FOLLOW_SPRING);
  const prefersReducedMotion = useReducedMotion();
  const idPrefix = useId();

  // Only a real mouse drives the preview; touch and pen show the image inside the opened row instead.
  const handlePointerMove = (event: PointerEvent<HTMLUListElement>) => {
    const list = listRef.current;
    if (event.pointerType !== "mouse" || !list) return;
    const bounds = list.getBoundingClientRect();
    pointerX.set(event.clientX - bounds.left);
    pointerY.set(event.clientY - bounds.top);
  };

  const toggleRow = (index: number) => setOpenIndex((current) => (current === index ? null : index));

  return (
    <section id="services" className="relative border-t border-line bg-bg py-28 text-muted md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow={services.eyebrow}
          title={services.title}
          titleHighlight={services.titleHighlight}
          description={services.description}
        />

        <ul
          ref={listRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoveredIndex(null)}
          className="relative border-b border-line"
        >
          {services.items.map((service, index) => {
            const isOpen = openIndex === index;
            const buttonId = `${idPrefix}-service-${index}`;
            const panelId = `${buttonId}-panel`;

            return (
              <li
                key={service.title}
                onPointerEnter={(event) => event.pointerType === "mouse" && setHoveredIndex(index)}
                className="border-t border-line"
              >
                <Reveal delayMs={index * ROW_STAGGER_MS}>
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleRow(index)}
                      className="group grid w-full cursor-pointer grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-8 text-left md:grid-cols-[4rem_1fr_auto] md:gap-10 md:py-10"
                    >
                      <span className="text-label text-muted">{formatIndex(index + 1)}</span>
                      <span
                        className={`font-heading text-3xl font-bold transition duration-500 ease-out-expo group-hover:translate-x-2 md:text-5xl ${
                          isOpen ? "text-accent-text" : "text-fg"
                        }`}
                      >
                        {service.title}
                      </span>
                      <span
                        aria-hidden
                        className={`grid size-12 place-items-center rounded-full border transition duration-500 ease-out-expo ${
                          isOpen ? "rotate-45 border-accent bg-accent text-on-accent" : "border-line text-fg"
                        }`}
                      >
                        <FaPlus className="size-3.5" />
                      </span>
                    </button>
                  </h3>

                  {/* Animating grid rows from 0fr to 1fr lets the panel grow to its natural height. */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    inert={!isOpen}
                    className={`grid transition-[grid-template-rows] duration-500 ease-out-expo motion-reduce:transition-none ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      {/* Left padding = index column (4rem) + gap (2.5rem), so the text lines up under the title. */}
                      <div className="grid gap-8 pb-10 md:grid-cols-12 md:pl-[6.5rem]">
                        <div className="md:col-span-7">
                          <p className="max-w-xl text-lg leading-relaxed">{service.description}</p>
                          <ul className="mt-6 flex flex-wrap gap-2">
                            {service.tags.map((tag) => (
                              <li key={tag} className="rounded-full border border-line px-4 py-1.5 text-sm text-fg">
                                {tag}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Devices that can hover get the cursor preview instead. */}
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface md:col-span-5 [@media(hover:hover)]:hidden">
                          <Image src={service.image} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}

          <motion.li
            aria-hidden
            style={prefersReducedMotion ? { x: pointerX, y: pointerY } : { x: followX, y: followY }}
            className="pointer-events-none absolute top-0 left-0 z-10 hidden [@media(hover:hover)]:block"
          >
            {/* Centres the preview on the cursor; kept apart from the element motion scales. */}
            <div className="-translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={false}
                animate={{
                  opacity: hoveredIndex === null ? 0 : 1,
                  scale: hoveredIndex === null ? HIDDEN_PREVIEW_SCALE : 1,
                }}
                transition={{ duration: PREVIEW_FADE_S }}
                className="relative aspect-[4/3] w-72 overflow-hidden rounded-2xl bg-surface shadow-2xl lg:w-80"
              >
                {/* All images stay mounted so moving between rows swaps instantly without a fresh load. */}
                {services.items.map((service, index) => (
                  <Image
                    key={service.title}
                    src={service.image}
                    alt=""
                    fill
                    sizes="320px"
                    className={`object-cover transition-opacity duration-300 ${hoveredIndex === index ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
              </motion.div>
            </div>
          </motion.li>
        </ul>
      </div>
    </section>
  );
}
