import { workProcess } from "@/data/site";
import { formatIndex } from "@/lib/formatIndex";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEP_STAGGER_MS = 100;

export function Process() {
  return (
    <section id="process" className="relative border-t border-line bg-bg py-28 text-muted md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow={workProcess.eyebrow}
          title={workProcess.title}
          titleHighlight={workProcess.titleHighlight}
          description={workProcess.description}
        />

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workProcess.steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delayMs={index * STEP_STAGGER_MS} className="h-full">
                <article className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-8 transition-colors duration-500 hover:border-accent md:p-10">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-heading text-7xl leading-none font-bold text-outline transition-[-webkit-text-stroke-color] duration-500 group-hover:[-webkit-text-stroke-color:var(--accent-text)]">
                      {formatIndex(index + 1)}
                    </span>
                    <span
                      aria-hidden
                      className="mt-2 size-3 rounded-full border border-accent transition-colors duration-500 group-hover:bg-accent"
                    />
                  </div>
                  <h3 className="mt-16 font-heading text-2xl font-bold text-fg md:mt-20">{step.title}</h3>
                  <p className="mt-3 leading-relaxed">{step.description}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
