import { hero, isLinkAvailable } from "@/data/site";
import { BUTTON_STYLES } from "@/components/ui/buttonStyles";

const buttons = [
  { ...hero.primaryButton, style: BUTTON_STYLES.solid },
  { ...hero.secondaryButton, style: BUTTON_STYLES.outline },
].filter((button) => isLinkAvailable(button.href));

/** False when both buttons point at switched-off sections, so callers can drop the wrapper too. */
export const hasHeroButtons = buttons.length > 0;

/** The primary and secondary hero buttons, shared by every hero style. */
export function HeroButtons() {
  return buttons.map((button) => (
    <a key={button.label} href={button.href} className={button.style}>
      {button.label}
    </a>
  ));
}
