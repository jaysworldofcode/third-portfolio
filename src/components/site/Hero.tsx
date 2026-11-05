import type { ComponentType } from "react";
import { hero, type HeroVariant } from "@/data/site";
import { MarqueeHero } from "./hero/MarqueeHero";
import { MediaHero } from "./hero/MediaHero";
import { ScrollStory } from "./ScrollStory";

/** Each style renders the `id="home"` section itself, so the navbar's scroll spy finds it. */
const HERO_STYLES: Record<HeroVariant, ComponentType> = {
  marquee: MarqueeHero,
  scrollVideo: ScrollStory,
  media: MediaHero,
};

/** The landing section, in the style picked by `hero.variant` in content/site.json. */
export function Hero() {
  const HeroStyle = HERO_STYLES[hero.variant];
  return <HeroStyle />;
}
