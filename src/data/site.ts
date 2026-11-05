import type { IconType } from "react-icons";
import siteJson from "@content/site.json";
import { getIcon } from "@/lib/icons";

export type SectionId =
  | "home"
  | "clients"
  | "about"
  | "services"
  | "process"
  | "work"
  | "team"
  | "testimonials"
  | "pricing"
  | "blog"
  | "contact";

export const SECTION_ORDER: SectionId[] = [
  "home",
  "clients",
  "about",
  "services",
  "process",
  "work",
  "team",
  "testimonials",
  "pricing",
  "blog",
  "contact",
];

export const HERO_VARIANTS = ["marquee", "scrollVideo", "media"] as const;
export type HeroVariant = (typeof HERO_VARIANTS)[number];

export const THEME_MODES = ["dark", "light"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const MEDIA_TYPES = ["video", "image"] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export type EmailProvider = "smtp" | "resend";

type Link = { label: string; href: string };
type IconLink = Link & { icon: string };
type FormField = { label: string; placeholder: string };
type TitledText = { title: string; description: string };

type SectionIntro = {
  eyebrow: string;
  title: string;
  titleHighlight?: string;
  description: string;
};

/** Labels for the arrow buttons of a slider. */
type SliderLabels = { previousLabel: string; nextLabel: string };

/** Messages shown under a form for each result the server action can return. */
export type FormMessages = {
  submitLabel: string;
  sendingLabel: string;
  successMessage: string;
  errorMessage: string;
  failureMessage: string;
  rateLimitMessage: string;
};

export type StoryChapter = {
  label: string;
  title: string;
  description: string;
  caption: string;
  button?: Link;
};

/** A counter that animates from zero up to `value` when it scrolls into view. */
export type Stat = { value: number; suffix: string; label: string };

export type TimelineEntry = { year: string; title: string; description: string };
export type Award = { title: string; issuer: string; year: string };
export type Service = TitledText & { tags: string[]; image: string };

export type Project = {
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  image: string;
  href: string;
};

export type Testimonial = { quote: string; name: string; role: string; company: string; avatar: string };

export type PricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  button: Link;
  featured: boolean;
  /** Small label above a plan, such as "Most popular". Empty hides it. */
  badge: string;
};

type SiteContent = {
  meta: {
    title: string;
    description: string;
    favicon: string;
    siteUrl: string;
    siteName: string;
    ogImage: string;
  };
  owner: { name: string; initials: string; logo: string };
  theme: {
    /** One of {@link ThemeMode}; checked at build time. */
    defaultMode: string;
    showToggle: boolean;
    accentColor: string;
    /** Text colour used on top of the accent colour (buttons, badges). */
    accentTextColor: string;
    switchToLightLabel: string;
    switchToDarkLabel: string;
  };
  sections: Record<SectionId, boolean>;
  navigation: {
    labels: Record<SectionId, string>;
    /** Section ids, in the order they appear in the navbar, menu and footer. */
    menuItems: string[];
    ctaButton: Link;
    openMenuLabel: string;
    closeMenuLabel: string;
  };
  socialLinks: IconLink[];
  hero: {
    /** One of {@link HeroVariant}; checked at build time. */
    variant: string;
    eyebrow: string;
    title: string;
    titleHighlight: string;
    summary: string;
    primaryButton: Link;
    secondaryButton: Link;
    scrollHintLabel: string;
    /** Words in the scrolling text band of the "marquee" hero. */
    marquee: string[];
    highlights: string[];
    showreel: { label: string; closeLabel: string; video: string; poster: string };
    media: {
      /** One of {@link MediaType}; checked at build time. */
      type: string;
      src: string;
      poster: string;
      alt: string;
    };
    scrollVideo: {
      video: string;
      poster: string;
      index: string;
      label: string;
      chapters: StoryChapter[];
    };
  };
  clients: { label: string; logos: { name: string; image: string }[] };
  about: SectionIntro & {
    paragraphs: string[];
    image: string;
    imageAlt: string;
    stats: Stat[];
    timelineTitle: string;
    timeline: TimelineEntry[];
    awardsTitle: string;
    awards: Award[];
  };
  services: SectionIntro & { items: Service[] };
  process: SectionIntro & { steps: TitledText[] };
  work: SectionIntro & SliderLabels & { projects: Project[] };
  team: SectionIntro & {
    members: { name: string; role: string; image: string; socials: IconLink[] }[];
  };
  testimonials: SectionIntro & SliderLabels & { items: Testimonial[] };
  pricing: SectionIntro & { note: string; plans: PricingPlan[] };
  blog: SectionIntro & {
    postsOnHomePage: number;
    dateLocale: string;
    readTimeLabel: string;
    viewAllLabel: string;
    backToBlogLabel: string;
    emptyMessage: string;
  };
  contact: SectionIntro & {
    /** Phrases in the scrolling "Let's talk" band above the form. */
    band: string[];
    methods: (IconLink & { value: string })[];
    form: FormMessages & {
      nameField: FormField;
      emailField: FormField;
      subjectField: FormField;
      messageField: FormField;
    };
    notifications: {
      /** One of {@link EmailProvider}; checked when sending. */
      provider: string;
      sendTo: string;
      senderName: string;
      subjectPrefix: string;
    };
  };
  footer: {
    description: string;
    exploreTitle: string;
    contactTitle: string;
    studioTitle: string;
    studioItems: string[];
    rightsText: string;
    tagline: string;
    backToTopLabel: string;
    newsletter: FormMessages & {
      enabled: boolean;
      title: string;
      description: string;
      emailField: FormField;
      subjectPrefix: string;
    };
  };
};

const content: SiteContent = siteJson;

/**
 * JSON imports type every string as plain `string`, so fields limited to a fixed set of
 * values are checked here instead. Throwing makes `npm run build` fail with a clear message.
 */
function requireOneOf<T extends string>(value: string, allowed: readonly T[], field: string): T {
  if ((allowed as readonly string[]).includes(value)) return value as T;
  throw new Error(`content/site.json: "${field}" is "${value}". Use one of: ${allowed.join(", ")}.`);
}

const withIcon = <T extends { icon: string }>(item: T): Omit<T, "icon"> & { icon: IconType } => ({
  ...item,
  icon: getIcon(item.icon),
});

export const { meta, owner, navigation, clients, services, work, about, pricing, blog, footer } = content;

export const theme = {
  ...content.theme,
  defaultMode: requireOneOf(content.theme.defaultMode, THEME_MODES, "theme.defaultMode"),
};

export const hero = {
  ...content.hero,
  variant: requireOneOf(content.hero.variant, HERO_VARIANTS, "hero.variant"),
  media: { ...content.hero.media, type: requireOneOf(content.hero.media.type, MEDIA_TYPES, "hero.media.type") },
};

/** The `process` block, renamed so it does not shadow Node's global `process`. */
export const workProcess = content.process;

const LOCAL_SITE_URL = "http://localhost:3000";

/** Absolute site address without a trailing slash, for the sitemap and structured data. */
export const SITE_URL = (meta.siteUrl || LOCAL_SITE_URL).replace(/\/+$/, "");

export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path}`);

export const isSectionEnabled = (id: SectionId) => content.sections[id];

export const enabledSectionIds = SECTION_ORDER.filter(isSectionEnabled);

const isSectionId = (id: string): id is SectionId => SECTION_ORDER.includes(id as SectionId);

/** False for in-page links (like "#work") that point to a switched-off section. */
export const isLinkAvailable = (href: string) => {
  const targetId = href.startsWith("#") ? href.slice(1) : "";
  return !isSectionId(targetId) || isSectionEnabled(targetId);
};

export const navItems = navigation.menuItems
  .filter(isSectionId)
  .filter(isSectionEnabled)
  .map((id) => ({ id, label: navigation.labels[id] }));

export const socialLinks = content.socialLinks.map(withIcon);

export const contact = { ...content.contact, methods: content.contact.methods.map(withIcon) };

export const team = {
  ...content.team,
  members: content.team.members.map((member) => ({ ...member, socials: member.socials.map(withIcon) })),
};

export const testimonials = content.testimonials;
