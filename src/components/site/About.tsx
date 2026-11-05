import { FaAward } from "react-icons/fa6";
import { about } from "@/data/site";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatCounter } from "@/components/ui/StatCounter";

const STAT_STAGGER_MS = 100;
const ROW_STAGGER_MS = 80;

export function About() {
  return (
    <section id="about" className="relative border-t border-line bg-bg py-28 text-muted md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow={about.eyebrow}
              title={about.title}
              titleHighlight={about.titleHighlight}
              description={about.description}
              className="mb-8"
            />
            <Reveal className="space-y-5">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="max-w-xl leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>

          <figure className="lg:col-span-6">
            <ImageReveal
              src={about.image}
              alt={about.imageAlt}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/5] rounded-3xl"
            />
          </figure>
        </div>

        {about.stats.length > 0 && (
          <dl className="mt-20 grid grid-cols-2 border-y border-line md:mt-28 lg:grid-cols-4">
            {about.stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delayMs={index * STAT_STAGGER_MS}
                className="flex flex-col-reverse gap-3 border-line px-2 py-10 odd:border-r md:px-8 lg:border-r lg:last:border-r-0"
              >
                <dt className="text-sm">{stat.label}</dt>
                <dd className="font-heading text-5xl font-bold text-fg md:text-7xl">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
        )}

        <div className="mt-20 grid gap-16 md:mt-28 lg:grid-cols-12 lg:gap-20">
          {about.timeline.length > 0 && (
            <div className="lg:col-span-7">
              <h3 className="text-label text-accent-text">{about.timelineTitle}</h3>
              <ol className="mt-8 border-l border-line">
                {about.timeline.map((entry, index) => (
                  <li key={`${entry.year}-${entry.title}`} className="relative pb-10 pl-8 last:pb-0 md:pl-12">
                    <span aria-hidden className="absolute top-2 -left-[5px] size-2.5 rounded-full bg-accent" />
                    <Reveal delayMs={index * ROW_STAGGER_MS}>
                      <span className="font-heading text-sm font-bold text-accent-text">{entry.year}</span>
                      <h4 className="mt-2 font-heading text-2xl font-bold text-fg">{entry.title}</h4>
                      <p className="mt-2 max-w-lg leading-relaxed">{entry.description}</p>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {about.awards.length > 0 && (
            <div className="lg:col-span-5">
              <h3 className="text-label text-accent-text">{about.awardsTitle}</h3>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {about.awards.map((award, index) => (
                  <li key={`${award.title}-${award.year}`}>
                    <Reveal
                      delayMs={index * ROW_STAGGER_MS}
                      className="flex items-center gap-5 rounded-2xl border border-line bg-surface p-5 transition-colors duration-500 hover:border-accent"
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
                        <FaAward aria-hidden className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading text-lg leading-tight font-bold text-fg">{award.title}</p>
                        <p className="mt-1 text-sm">{award.issuer}</p>
                      </div>
                      <span className="text-label text-fg">{award.year}</span>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
