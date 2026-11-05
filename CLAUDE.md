# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

This is **Next.js 16** (App Router, React 19, Tailwind CSS v4, TypeScript 6). APIs differ from older versions — check `node_modules/next/dist/docs/` before using Next.js APIs (e.g. `middleware` is now `proxy`).

## Commands

```bash
npm run dev        # dev server on http://localhost:3000
npm run build      # production build; also the type-check for content/site.json
npm run lint       # eslint (flat config, eslint.config.mjs)
npm run lint:fix
```

There is no test suite. Verify changes with `npm run build` and `npm run lint`.

## Architecture

"Lorem Agency": a one-page digital/creative agency site (dark theme by default with a light toggle, lime accent), plus an optional Markdown blog and a hidden `/docs` guide page. Animation libraries: `motion` (import from `motion/react`) for reveals, counters, the loader and the services hover image; `embla-carousel-react` + `embla-carousel-autoplay` for the Work and Testimonials sliders; plain CSS (`animate-marquee`) for scrolling text bands.

**Content-driven: all copy, links, images, icons and toggles live in `content/site.json`.** Components never hardcode text.
- `src/data/site.ts` imports the JSON (via the `@content/*` alias), assigns it to the `SiteContent` type (so `npm run build` fails on missing/misspelled fields), and exports derived values: per-section blocks, `enabledSectionIds`, `isSectionEnabled`, `isLinkAvailable`, `navItems`, `absoluteUrl`/`SITE_URL`, and icon-resolved `socialLinks`/`contact`. Components import from `@/data/site`, not the JSON directly. `process` is re-exported as `workProcess` to avoid shadowing Node's global.
- Adding a content field means: update `site.json`, the `SiteContent` type in `src/data/site.ts`, and the `/docs` page (`src/app/docs/`) and README where the field is documented.
- `site.json` is bundled to the client — never put secrets in it. Secrets go in `.env.local` (see `.env.example`).
- Icon names in content map to `react-icons` via `src/lib/icons.ts` (unknown names fall back to a generic link icon).

**Sections.** `src/app/page.tsx` maps every `SectionId` → component (`src/components/site/`) in a full `Record` and renders `enabledSectionIds` in the fixed `SECTION_ORDER`: home, clients, about, services, process, work, team, testimonials, pricing, blog, contact. All of them (including `home`) are toggled by `sections` in `site.json`. A disabled section also disappears from nav/menu/footer, and links pointing at it are hidden via `isLinkAvailable` (the navbar logo falls back to `/` when `home` is off). Disabling `blog` also makes `/blog` routes `notFound()` and yields no static params. Enum-like content fields (`hero.variant`, `hero.media.type`, `theme.defaultMode`) are checked with `requireOneOf()` in `site.ts`, so a bad value fails the build.

**Theme.** Colour tokens (`bg`, `surface`, `surface-raised`, `fg`, `muted`, `line`, `accent`, `on-accent`, `accent-text`, `danger`) are CSS variables in `globals.css`; `[data-theme="light"]` overrides them. Always use these tokens, never `text-white`/`bg-black`. The root layout sets `data-theme` and the accent colours (from `theme` in `site.json`) on `<html>`; `THEME_INIT_SCRIPT` in `src/lib/theme.ts` applies the saved choice (localStorage key `lorem-theme`) before first paint, and `ThemeToggle` saves it. Tailwind's `dark:` variant is tied to `[data-theme=dark]`. Sections over dark footage (media/scrollVideo hero, the navbar above them) set `data-theme="dark"` on themselves to scope the dark palette. `MotionProvider` wraps the app in `MotionConfig reducedMotion="user"`.

**Hero + loader.** `Hero.tsx` picks a style from `hero.variant`: `MarqueeHero` (word band + `ShowreelModal`), `MediaHero` (photo/video background) or `ScrollStory` (scroll-scrubbed video). Shared buttons live in `hero/HeroButtons.tsx`. `Preloader` counts to 100, then calls `markPageReady()` (`src/hooks/usePageReady.ts`) as it wipes away; hero intro animations (`hero/IntroReveal.tsx`) wait for that signal.

**Scroll video.** `ScrollStory` + `src/hooks/useScrollVideo.ts` scrub `hero.scrollVideo.video` by scroll position; the opening screen and each `hero.scrollVideo.chapters` item get one viewport height. Videos must be H.264 with short keyframe intervals (ffmpeg command in README).

**Shared UI.** `Marquee` (CSS band, content rendered twice, second copy `inert`), `SliderControls` + `src/hooks/useCarouselControls.ts` (Embla prev/next state via `useSyncExternalStore`), `SocialLinks`, `StatCounter`, `SectionHeading`, `Reveal`, `ImageReveal`, and `buttonStyle(variant, size)` in `buttonStyles.ts` (don't append extra padding classes to a button style; add a size instead). Client logos are SVGs rendered as a CSS mask filled with the text colour; `publicFileExists()` (`src/lib/publicAsset.ts`) falls back to the name as text when a file is missing.

**Blog.** `src/lib/blog.ts` (server-only) reads `content/blog/*.md` with `gray-matter`; filename = slug. Frontmatter `title`, `date` (YYYY-MM-DD), `excerpt` are required and validated with thrown errors; `cover`, `readMinutes`, `draft` optional. Rendered with `react-markdown` + `remark-gfm`. Blog UI labels/date locale come from the `blog` block of `site.json`.

**Forms.** Two server actions share `src/lib/formState.ts` (`FormState`/`FormStatus`, `HONEYPOT_FIELD`, `isValidEmail`), `src/lib/formServer.ts` (server-only field/IP/escape helpers), the client hook `src/hooks/useValidatedForm.ts` (browser validation, then the action; clears only on success) and `FormStatusMessage` (messages from `site.json`).
- `src/app/actions/contact.ts`: honeypot, validation against `CONTACT_FIELD_LIMITS` in `src/lib/contactForm.ts`, in-memory per-IP rate limit (`src/lib/rateLimit.ts`, 5 per 10 min), then `sendEmail()`.
- `src/app/actions/newsletter.ts`: refuses when `footer.newsletter.enabled` is off, honeypot, email validation, its own rate limiter, then emails a signup notice to `contact.notifications.sendTo` with `footer.newsletter.subjectPrefix`. Nothing is stored.
- `sendEmail()` in `src/lib/email/` dispatches on `contact.notifications.provider` (`"smtp"` via nodemailer or `"resend"`). To add a provider, add a sender and register it in the `SENDERS` map and the `EmailProvider` type.

**SEO.** Derived from `meta` in `site.json`: metadata in layouts/pages, `src/app/sitemap.ts` (includes blog posts), `src/app/robots.ts` (disallows `/docs`), and JSON-LD via `src/components/seo/JsonLd.tsx` (`Organization` on home, `BlogPosting` on posts).

**Supabase** clients exist in `src/lib/supabase/` but are currently disabled (no `proxy.ts` wires them in). Any DB change must come with a migration in `supabase/migrations/`.

## Project rules (from `.continue/rules/`)

- Keep changes aligned with `content/site.json` and the `/docs` page.
- Every database change needs a migration file.
- Don't make changes beyond what was asked; preserve unrelated code.
- Prefer named constants over magic numbers, descriptive names, and comments that explain *why* rather than *what*.
- Images go in `public/images/` and are referenced as `/images/...`; filename case must match exactly (Vercel is case-sensitive), and `.jfif` must be renamed to `.jpg`. Placeholder photos are free Unsplash photos credited in `src/app/docs/imageCredits.ts` (shown on `/docs`); update that list when swapping a photo.
