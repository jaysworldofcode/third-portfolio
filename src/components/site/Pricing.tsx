import { FaCheck } from "react-icons/fa6";
import { isLinkAvailable, pricing, type PricingPlan } from "@/data/site";
import { BUTTON_STYLES, buttonStyle } from "@/components/ui/buttonStyles";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const CARD_STAGGER_MS = 100;

export function Pricing() {
  return (
    <section id="pricing" className="relative border-t border-line bg-bg py-28 text-muted md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          titleHighlight={pricing.titleHighlight}
          description={pricing.description}
          align="center"
        />

        <ul className="grid items-stretch gap-6 lg:grid-cols-3">
          {pricing.plans.map((plan, index) => (
            <li key={plan.name}>
              <Reveal delayMs={index * CARD_STAGGER_MS} className="h-full">
                <PlanCard plan={plan} />
              </Reveal>
            </li>
          ))}
        </ul>

        {pricing.note && (
          <Reveal>
            <p className="mt-10 text-center text-sm">{pricing.note}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: PricingPlan }) {
  const { featured } = plan;
  const showButton = isLinkAvailable(plan.button.href);
  // On the accent background every colour switches to the accent's own text colour.
  const strongText = featured ? "text-on-accent" : "text-fg";
  const softText = featured ? "text-on-accent/75" : "text-muted";
  const divider = featured ? "border-on-accent/20" : "border-line";

  return (
    <article
      className={`flex h-full flex-col rounded-3xl border p-8 md:p-10 ${
        featured ? "border-accent bg-accent" : "border-line bg-surface"
      }`}
    >
      <div className="flex min-h-8 items-center justify-between gap-4">
        <h3 className={`font-heading text-2xl font-bold ${strongText}`}>{plan.name}</h3>
        {plan.badge && (
          <span
            className={`rounded-full px-3 py-1 text-label ${featured ? "bg-on-accent text-accent" : "bg-accent text-on-accent"}`}
          >
            {plan.badge}
          </span>
        )}
      </div>
      <p className={`mt-4 leading-relaxed ${softText}`}>{plan.description}</p>

      <p className={`mt-8 flex items-baseline gap-2 border-b pb-8 ${divider}`}>
        <span className={`font-heading text-5xl font-bold ${strongText}`}>{plan.price}</span>
        <span className={`text-sm ${softText}`}>{plan.period}</span>
      </p>

      <ul className="mt-8 flex-1 space-y-4">
        {plan.features.map((feature) => (
          <li key={feature} className={`flex items-start gap-3 ${strongText}`}>
            <span
              className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
                featured ? "bg-on-accent text-accent" : "bg-accent text-on-accent"
              }`}
            >
              <FaCheck aria-hidden className="size-2.5" />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {showButton && (
        <a
          href={plan.button.href}
          className={`mt-10 w-full ${featured ? buttonStyle("contrast") : BUTTON_STYLES.outline}`}
        >
          {plan.button.label}
        </a>
      )}
    </article>
  );
}
