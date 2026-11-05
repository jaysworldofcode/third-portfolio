import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { HERO_VARIANTS, MEDIA_TYPES, SECTION_ORDER, THEME_MODES } from "@/data/site";
import { getIcon, ICON_NAMES } from "@/lib/icons";
import { DocsSidebar, type DocsNavGroup } from "./DocsSidebar";
import { IMAGE_CREDITS } from "./imageCredits";

export const metadata: Metadata = {
  title: "Site guide",
  robots: { index: false, follow: false },
};

const CONTENT_FILE = "content/site.json";
const BLOG_FOLDER = "content/blog/";

const quoted = (values: readonly string[]) => values.map((value) => `"${value}"`).join(", ");

const BLOG_POST_TEMPLATE = `---
title: My first post
date: 2026-11-03
excerpt: A one or two sentence summary shown on the post cards and in search results.
cover: /images/blog-my-first-post.jpg
---

Write your post here using Markdown.`;

const MARKDOWN_CHEATSHEET = `## Heading
### Smaller heading

Normal paragraph text. **Bold**, *italic* and [a link](https://example.com).

- Bullet point
1. Numbered point

> A highlighted quote

![Image description](/images/my-image.jpg)

\`inline code\`

| Column | Column |
| ------ | ------ |
| Cell   | Cell   |`;

const THEME_EXAMPLE = `"theme": {
  "defaultMode": "dark",
  "showToggle": true,
  "accentColor": "#C6F432",
  "accentTextColor": "#0A0A0A",
  "switchToLightLabel": "Switch to light theme",
  "switchToDarkLabel": "Switch to dark theme"
}`;

const SECTIONS_EXAMPLE = `"sections": {
  "home": true,
  "clients": true,
  "about": true,
  "services": true,
  "process": false,
  "work": true,
  "team": true,
  "testimonials": true,
  "pricing": false,
  "blog": true,
  "contact": true
}`;

const SCROLL_VIDEO_ENCODE = `ffmpeg -i my-video.mp4 -an -vf "fps=30,scale=1920:-2" \\
  -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \\
  -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart \\
  public/images/scroll-video.mp4

ffmpeg -i public/images/scroll-video.mp4 -frames:v 1 -q:v 3 \\
  public/images/scroll-video-poster.jpg`;

const CHAPTER_TEMPLATE = `{
  "label": "Launch",
  "title": "Lights on. Ready for the world.",
  "description": "One or two sentences shown under the title.",
  "caption": "Step 05 · Launch",
  "button": { "label": "Start a Project", "href": "#contact" }
}`;

const NEWSLETTER_EXAMPLE = `"newsletter": {
  "enabled": true,
  "title": "Get studio notes in your inbox",
  "description": "One short email a month...",
  "emailField": { "label": "Email address", "placeholder": "you@company.com" },
  "submitLabel": "Subscribe",
  "sendingLabel": "Subscribing...",
  "successMessage": "You're in! Look out for our next issue.",
  "errorMessage": "Please enter a valid email address.",
  "failureMessage": "Sorry, we couldn't sign you up. Please try again later.",
  "rateLimitMessage": "Too many attempts. Please try again in a few minutes.",
  "subjectPrefix": "[Lorem Agency Newsletter]"
}`;

type Field = { key: string; description: string };

const themeFields: Field[] = [
  { key: "defaultMode", description: `The theme a first-time visitor sees: ${quoted(THEME_MODES)}.` },
  {
    key: "showToggle",
    description: "Shows the sun/moon button in the navbar. The visitor's choice is remembered in their browser.",
  },
  { key: "accentColor", description: "The highlight colour: buttons, badges, the loader, dots and highlighted words." },
  {
    key: "accentTextColor",
    description: "Text colour used on top of the accent colour. Pick dark text for a light accent, and the other way round.",
  },
  { key: "switchToLightLabel / switchToDarkLabel", description: "Screen reader labels for the theme button." },
];

const heroFields: Field[] = [
  { key: "variant", description: `Which hero style to show: ${quoted(HERO_VARIANTS)}. See below.` },
  { key: "eyebrow", description: "Small uppercase line above the headline." },
  { key: "title", description: "First headline line (the page's main heading)." },
  { key: "titleHighlight", description: "Second headline line, shown in the accent colour." },
  { key: "summary", description: "Paragraph under the headline." },
  { key: "primaryButton", description: "Solid button. Hidden if it links to a switched-off section." },
  { key: "secondaryButton", description: "Outlined button. Hidden if it links to a switched-off section." },
  { key: "scrollHintLabel", description: 'The "Scroll" hint on the media and scroll video styles.' },
  { key: "marquee", description: "Words in the scrolling band of the marquee style. They alternate solid and outlined." },
  { key: "highlights", description: "Short facts listed under the band of the marquee style." },
  { key: "showreel", description: "The showreel button and video pop-up of the marquee style (see Showreel)." },
  { key: "media", description: "Background of the media style (see below)." },
  { key: "scrollVideo", description: "Video and chapters of the scroll video style (see Scroll video)." },
];

const mediaFields: Field[] = [
  { key: "type", description: `${quoted(MEDIA_TYPES)}. A video plays muted on a loop; it pauses for visitors who prefer less motion.` },
  { key: "src", description: "The image or video file, e.g. /images/hero-media.jpg." },
  { key: "poster", description: "Video only: image shown while the video loads. Leave empty for images." },
  { key: "alt", description: "Image only: a short description for screen readers and search engines." },
];

const chapterFields: Field[] = [
  { key: "label", description: "Word next to the big chapter number." },
  { key: "title", description: "Chapter headline." },
  { key: "description", description: "Text under the headline." },
  { key: "caption", description: "Small caption in the top right, e.g. Step 04 · Build." },
  { key: "button", description: "Optional. Adds a button to the chapter, like the last one." },
];

const blogPostFields: Field[] = [
  { key: "title", description: "Required. The post title." },
  { key: "date", description: "Required. Publish date as YYYY-MM-DD. Posts are sorted by it." },
  { key: "excerpt", description: "Required. Short summary shown on post cards and in search results." },
  { key: "cover", description: "Optional. Image on the post card and at the top of the post, e.g. /images/blog-1.jpg." },
  { key: "readMinutes", description: "Optional. Reading time in minutes; calculated automatically if left out." },
  { key: "draft", description: "Optional. Set to true to hide the post from the site." },
];

const seoFields: Field[] = [
  { key: "title", description: "Search result and browser tab title. Keep it under about 60 characters." },
  { key: "description", description: "Text under the title in search results. Keep it under about 150 characters." },
  { key: "siteUrl", description: "Your live address. Used for the sitemap, link previews and canonical links." },
  { key: "siteName", description: "Studio name as search engines show it. Added to every page title after a |." },
  {
    key: "ogImage",
    description: "Image shown when the site is shared (Facebook, LinkedIn, Messenger, X). Best at 1200×630.",
  },
];

const contentSections: Field[] = [
  {
    key: "meta",
    description: "Browser tab title, search description, favicon, site address and search/social settings (see SEO).",
  },
  { key: "owner", description: "Studio name, initials and logo (navbar, footer and loading screen)." },
  { key: "theme", description: "Default light/dark theme, the theme button and the accent colour (see Theme & colours)." },
  { key: "sections", description: "Turn landing page sections on (true) or off (false)." },
  {
    key: "navigation",
    description:
      "Section labels, which sections appear in the navbar, mobile menu and footer (menuItems), the Start a Project button and menu labels.",
  },
  { key: "socialLinks", description: "Social icons in the mobile menu, contact section and footer." },
  { key: "hero", description: "The opening section, in one of three styles (see Hero styles)." },
  { key: "clients", description: "A label and the scrolling strip of client logos (name, image)." },
  {
    key: "about",
    description: "Heading, paragraphs and image; stats that count up (value, suffix, label); the timeline; and awards.",
  },
  { key: "services", description: "Heading and the numbered, expandable service rows (title, description, tags, image)." },
  { key: "process", description: "Heading and the numbered process steps (title, description)." },
  {
    key: "work",
    description: "Heading, slider button labels, and project cards (title, client, category, year, description, image, link).",
  },
  { key: "team", description: "Heading and team cards (name, role, photo, social links that appear on hover)." },
  { key: "testimonials", description: "Heading, slider button labels and quotes (quote, name, role, company, avatar)." },
  {
    key: "pricing",
    description: "Heading, plan cards (price, period, features, button, badge) and a note under the plans. featured: true highlights a plan.",
  },
  { key: "blog", description: "Blog heading, how many posts show on the home page, and blog page labels." },
  {
    key: "contact",
    description:
      'Heading, the scrolling "Let\'s talk" band (band), contact methods, form labels and messages, and email notifications.',
  },
  {
    key: "footer",
    description:
      "Studio description, column titles, the Services list, copyright text, tagline, Back to top label and the newsletter form. The Explore and Contact columns reuse navigation.menuItems and contact.methods.",
  },
];

const docsNavigation: DocsNavGroup[] = [
  {
    title: "Getting started",
    items: [{ id: "getting-started", label: "Installation" }],
  },
  {
    title: "Content",
    items: [
      { id: "editing-content", label: "Editing content" },
      { id: "theme", label: "Theme & colours" },
      { id: "sections", label: "Sections on/off" },
      { id: "hero", label: "Hero styles" },
      { id: "blog-posts", label: "Writing blog posts" },
    ],
  },
  {
    title: "Media",
    items: [
      { id: "images", label: "Images & logos" },
      { id: "scroll-video", label: "Scroll video" },
      { id: "showreel", label: "Showreel" },
      { id: "image-credits", label: "Image credits" },
      { id: "icons", label: "Icons" },
    ],
  },
  {
    title: "Setup",
    items: [
      { id: "emails", label: "Form emails" },
      { id: "newsletter", label: "Newsletter" },
      { id: "deploy", label: "Deploying" },
      { id: "domain", label: "Custom domain" },
      { id: "seo", label: "SEO" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 text-muted lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
      <DocsSidebar groups={docsNavigation} backLabel="Back to the site" />

      <div className="max-w-3xl py-12 lg:py-16">
        <header className="mb-12 border-b border-line pb-10">
          <p className="text-label text-accent-text">Hidden page</p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-fg md:text-5xl">
            Site <span className="text-accent-text">guide</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed">
            How to edit the site, change the theme and hero, swap images and videos, set up the form emails and deploy
            it. This page is not linked anywhere and is hidden from search engines.
          </p>
        </header>

        <DocSection id="getting-started" title="Installation">
          <p>Requirements: Node.js 20 or newer. Then, in the project folder:</p>
          <CodeBlock>{"npm install\nnpm run dev"}</CodeBlock>
          <p>
            Open <Code>http://localhost:3000</Code>. Changes to the content file show up after saving.
          </p>
        </DocSection>

        <DocSection id="editing-content" title="Editing content">
          <p>
            Everything on the site comes from <Code>{CONTENT_FILE}</Code>. Each top-level key controls one part of the
            site:
          </p>
          <FieldList fields={contentSections} />
          <SubHeading>Rules</SubHeading>
          <ul className="list-disc space-y-2 pl-5">
            <li>Keep it valid JSON: double quotes around text, commas between items, no comma after the last item.</li>
            <li>
              Titles are split into <Code>title</Code> and an optional <Code>titleHighlight</Code>, which is shown in
              the accent colour.
            </li>
            <li>
              Use <Code>&quot;#&quot;</Code> as a placeholder link. An empty <Code>href</Code> on a contact method makes
              it plain text and leaves it out of the mobile menu and footer.
            </li>
            <li>
              Add or remove items in lists (services, steps, projects, stats, team members, plans, quotes) freely.
              Numbers like 01 and 02 are added automatically. Section order and ids are fixed.
            </li>
            <li>
              Change a label once and it updates everywhere: section labels in <Code>navigation.labels</Code> are used
              by the navbar, mobile menu and footer, and contact details in <Code>contact.methods</Code> also appear in
              the mobile menu and footer.
            </li>
            <li>
              The content file is sent to every visitor, so never put passwords or API keys in it (see Form emails).
            </li>
            <li>
              Run <Code>npm run build</Code> after big edits: it reports any missing or misspelled field, and any value
              that isn&apos;t allowed (like an unknown hero <Code>variant</Code>).
            </li>
          </ul>
        </DocSection>

        <DocSection id="theme" title="Theme & colours">
          <p>
            The site has a dark and a light theme. Visitors switch with the sun/moon button in the navbar, and their
            choice is remembered on their device.
          </p>
          <CodeBlock>{THEME_EXAMPLE}</CodeBlock>
          <FieldList fields={themeFields} />
          <ul className="list-disc space-y-2 pl-5">
            <li>
              With <Code>showToggle</Code> off, everyone sees <Code>defaultMode</Code>, even if they picked another
              theme before.
            </li>
            <li>
              In the light theme, accent-coloured text is automatically darkened so it stays readable on the off-white
              background.
            </li>
            <li>
              The hero video and photo styles always use dark colours over the footage, so text stays readable in both
              themes.
            </li>
          </ul>
        </DocSection>

        <DocSection id="sections" title="Sections on/off">
          <p>
            Show or hide any landing page section with the <Code>sections</Code> block. Use <Code>true</Code> to show
            and <Code>false</Code> to hide. Sections always appear in this order:{" "}
            {SECTION_ORDER.map((id, index) => (
              <span key={id}>
                {index > 0 && ", "}
                <Code>{id}</Code>
              </span>
            ))}
            .
          </p>
          <CodeBlock>{SECTIONS_EXAMPLE}</CodeBlock>
          <ul className="list-disc space-y-2 pl-5">
            <li>A hidden section also disappears from the navbar, the mobile menu and the footer.</li>
            <li>
              Buttons that link to a hidden section (for example <Code>&quot;#work&quot;</Code>) are hidden too.
            </li>
            <li>
              The hero (<Code>home</Code>) can be switched off as well; the logo in the navbar then links to the top of
              the page.
            </li>
            <li>
              Turning <Code>blog</Code> off also turns off the <Code>/blog</Code> pages (they show &quot;not
              found&quot;).
            </li>
          </ul>
          <SubHeading>Navbar links</SubHeading>
          <p>
            <Code>navigation.menuItems</Code> lists the sections linked from the navbar, mobile menu and footer, in that
            order. Leave a section out to keep it on the page without a menu link:
          </p>
          <CodeBlock>{'"menuItems": ["about", "services", "work", "team", "pricing", "blog", "contact"]'}</CodeBlock>
        </DocSection>

        <DocSection id="hero" title="Hero styles">
          <p>
            The opening section comes in three styles. Pick one with <Code>hero.variant</Code>. The headline, summary
            and buttons are shared by all three.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <Code>&quot;marquee&quot;</Code>: a big headline, a scrolling band of <Code>hero.marquee</Code> words, the{" "}
              <Code>highlights</Code> list and a showreel button.
            </li>
            <li>
              <Code>&quot;media&quot;</Code>: the headline over a full-screen photo or looping video from{" "}
              <Code>hero.media</Code>.
            </li>
            <li>
              <Code>&quot;scrollVideo&quot;</Code>: a pinned video that plays as the visitor scrolls, with a screen of
              text per chapter (see Scroll video).
            </li>
          </ul>
          <FieldList fields={heroFields} />
          <SubHeading>Media style background</SubHeading>
          <FieldList fields={mediaFields} />
          <p>
            A loading screen counts to 100 with the studio name before the page appears, and the hero headline slides
            in as it leaves. Visitors who prefer less motion skip the animations.
          </p>
        </DocSection>

        <DocSection id="blog-posts" title="Writing blog posts">
          <p>
            Each blog post is a Markdown file in <Code>{BLOG_FOLDER}</Code>. The file name becomes the address of the
            post: <Code>my-first-post.md</Code> is shown at <Code>/blog/my-first-post</Code>. Use lowercase letters,
            numbers and dashes only.
          </p>
          <SubHeading>Create a post</SubHeading>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Create a new <Code>.md</Code> file in <Code>{BLOG_FOLDER}</Code> (copy an existing post to start).
            </li>
            <li>Fill in the settings between the two --- lines at the top.</li>
            <li>Write the post below them, save, and it appears on the site.</li>
          </ol>
          <CodeBlock>{BLOG_POST_TEMPLATE}</CodeBlock>
          <FieldList fields={blogPostFields} />
          <SubHeading>Formatting the content</SubHeading>
          <CodeBlock>{MARKDOWN_CHEATSHEET}</CodeBlock>
          <ul className="list-disc space-y-2 pl-5">
            <li>Posts are sorted newest first by date.</li>
            <li>
              The home page shows the newest <Code>blog.postsOnHomePage</Code> posts as cards. When there are more, a
              &quot;View all articles&quot; button links to <Code>/blog</Code>.
            </li>
            <li>
              To remove a post, delete the file, or set <Code>draft: true</Code> to hide it without deleting.
            </li>
            <li>
              Wording on the blog pages (read time label, back links, empty message) is in the <Code>blog</Code> block
              of <Code>{CONTENT_FILE}</Code>. <Code>dateLocale</Code> controls the date format, for example{" "}
              <Code>&quot;en-US&quot;</Code> or <Code>&quot;en-GB&quot;</Code>.
            </li>
          </ul>
        </DocSection>

        <DocSection id="images" title="Images & logos">
          <p>
            Put image files in <Code>public/images/</Code> and reference them from the content file starting with{" "}
            <Code>/images/</Code>:
          </p>
          <CodeBlock>{'"image": "/images/my-project.jpg"'}</CodeBlock>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              File names must match exactly, including upper and lower case: the live site on Vercel treats{" "}
              <Code>Team-1.jpg</Code> and <Code>team-1.jpg</Code> as different files. Rename <Code>.jfif</Code> files to{" "}
              <Code>.jpg</Code>.
            </li>
            <li>
              <Code>owner.logo</Code> is the logo in the navbar, footer and loading screen. It sits on both dark and
              light backgrounds, so use a mark with its own background (like the round lime logo) or leave it empty (
              <Code>&quot;&quot;</Code>) to show the initials in a circle.
            </li>
            <li>
              <Code>meta.favicon</Code> is the browser tab icon.
            </li>
            <li>
              Client logos in <Code>clients.logos</Code> are SVG files shown in a single colour that follows the theme,
              so any colours in the file are ignored. Make them about 4 times as wide as they are tall. If a file is
              missing, the client name is shown as text instead.
            </li>
            <li>
              Service images appear next to the cursor when hovering a service row, and inside the opened row on touch
              screens.
            </li>
            <li>
              Suggested sizes: hero 1920×1080, about 1200×1500, services 800×600, projects 1200×1500, team 900×1200,
              avatars 240×240, blog covers 1600×1000, share image 1200×630. The site resizes and optimises images
              automatically.
            </li>
          </ul>
        </DocSection>

        <DocSection id="scroll-video" title="Scroll video">
          <p>
            With <Code>hero.variant</Code> set to <Code>&quot;scrollVideo&quot;</Code>, the top of the page is pinned
            while the visitor scrolls, and the scroll position plays the video forward and backward. The opening screen
            and each chapter in <Code>hero.scrollVideo.chapters</Code> get one screen height of scrolling, and the video
            is spread evenly across all of them.
          </p>
          <FieldList
            fields={[
              { key: "video", description: "The scroll video, e.g. /images/scroll-video.mp4." },
              { key: "poster", description: "Image shown while the video loads, normally the video's first frame." },
              { key: "index / label", description: 'The "00 / Begin" caption in the top right of the opening screen.' },
              { key: "chapters", description: "The screens that follow while the video plays. Numbered automatically." },
            ]}
          />
          <SubHeading>Chapters</SubHeading>
          <CodeBlock>{CHAPTER_TEMPLATE}</CodeBlock>
          <FieldList fields={chapterFields} />
          <SubHeading>Using a different video</SubHeading>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              A short clip with steady, continuous motion works best (5–15 seconds, 16:9, 1920×1080). Sound is never
              played.
            </li>
            <li>
              Use H.264 (<Code>.mp4</Code>). HEVC / H.265 files don&apos;t play in Firefox or in Chrome on many
              computers.
            </li>
            <li>
              Encode it with a keyframe every few frames, or scrolling will be jerky. With{" "}
              <TextLink href="https://ffmpeg.org/download.html">ffmpeg</TextLink> installed, the first command below
              prepares the video and the second saves its first frame as the poster.
            </li>
          </ul>
          <CodeBlock>{SCROLL_VIDEO_ENCODE}</CodeBlock>
          <p>
            Keep the file under about 10 MB; raise <Code>-crf</Code> (for example to 26) for a smaller file.
          </p>
        </DocSection>

        <DocSection id="showreel" title="Showreel">
          <p>
            The marquee hero has a <Code>hero.showreel.label</Code> button that opens the video in a pop-up with sound
            and playback controls. It closes with the <Code>closeLabel</Code> button, the Esc key or a click outside.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <Code>video</Code> can be a file in <Code>public/images/</Code>, a full address of an <Code>.mp4</Code>{" "}
              file hosted elsewhere (for example a CDN or storage bucket), or a YouTube or Vimeo link copied from the
              browser (for example <Code>https://www.youtube.com/watch?v=…</Code>, <Code>https://youtu.be/…</Code> or{" "}
              <Code>https://vimeo.com/…</Code>). YouTube and Vimeo links play in their own embedded player.
            </li>
            <li>
              <Code>poster</Code> is the image shown before playback starts. It only applies to video files; YouTube and
              Vimeo show their own thumbnail.
            </li>
            <li>
              The template uses the scroll video as a placeholder showreel. Replace it with your own reel, encoded as
              H.264 <Code>.mp4</Code> (with sound if you like).
            </li>
          </ul>
        </DocSection>

        <DocSection id="image-credits" title="Image credits">
          <p>
            The placeholder photos are from <TextLink href="https://unsplash.com">Unsplash</TextLink> and free to use
            under the <TextLink href="https://unsplash.com/license">Unsplash License</TextLink> (credit is appreciated
            but not required). The scroll video is from <TextLink href="https://mixkit.co">Mixkit</TextLink> under the{" "}
            <TextLink href="https://mixkit.co/license/#videoFree">Mixkit Free License</TextLink>. Replace them with your
            own work before launch. The client logos, logo, favicon and share
            image are made up for this template.
          </p>
          <div className="overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-raised text-fg">
                <tr>
                  <th className="px-5 py-3 font-medium">File</th>
                  <th className="px-5 py-3 font-medium">Photo by</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface">
                {IMAGE_CREDITS.map((credit) => (
                  <tr key={credit.file}>
                    <td className="px-5 py-3">
                      <Code>{credit.file}</Code>
                    </td>
                    <td className="px-5 py-3">
                      <TextLink href={credit.url}>{credit.photographer}</TextLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocSection>

        <DocSection id="icons" title="Icons">
          <p>
            Use any of these names in an <Code>icon</Code> field (social links, team socials, contact methods). Unknown
            names show a generic link icon.
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {ICON_NAMES.map((name) => {
              const Icon = getIcon(name);
              return (
                <li key={name} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
                  <span className="grid size-9 place-items-center rounded-full bg-accent text-on-accent">
                    <Icon className="size-4" />
                  </span>
                  <code className="text-sm text-fg">{name}</code>
                </li>
              );
            })}
          </ul>
          <p>
            To add more, import an icon from <Code>react-icons</Code> in <Code>src/lib/icons.ts</Code> and add it to the{" "}
            <Code>ICONS</Code> list.
          </p>
        </DocSection>

        <DocSection id="emails" title="Form emails">
          <p>
            Messages from the contact form and newsletter signups are emailed to you. Pick the sender in{" "}
            <Code>contact.notifications</Code>:
          </p>
          <CodeBlock>
            {
              '"notifications": {\n  "provider": "smtp",\n  "sendTo": "hello@loremagency.com",\n  "senderName": "Lorem Agency website",\n  "subjectPrefix": "[Lorem Agency]"\n}'
            }
          </CodeBlock>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <Code>provider</Code> is <Code>&quot;smtp&quot;</Code> or <Code>&quot;resend&quot;</Code>.{" "}
              <Code>sendTo</Code> is the inbox that receives messages. Replying answers the visitor directly.
            </li>
            <li>
              Passwords and API keys never go in the content file, because it is sent to every visitor. Copy{" "}
              <Code>.env.example</Code> to <Code>.env.local</Code>, fill it in and restart <Code>npm run dev</Code>. On
              Vercel, add the same values under Project → Settings → Environment Variables.
            </li>
          </ul>
          <SubHeading>SMTP (Gmail, Outlook, Zoho, any mailbox)</SubHeading>
          <CodeBlock>
            {
              "SMTP_HOST=smtp.gmail.com\nSMTP_PORT=465\nSMTP_USER=you@gmail.com\nSMTP_PASSWORD=your-app-password\nSMTP_FROM=            # optional"
            }
          </CodeBlock>
          <p>
            For Gmail, turn on 2-Step Verification and create an app password at{" "}
            <Code>myaccount.google.com/apppasswords</Code>. Use it instead of your normal password.
          </p>
          <SubHeading>Resend</SubHeading>
          <CodeBlock>{"RESEND_API_KEY=re_xxxxxxxx\nRESEND_FROM=           # optional, on a verified domain"}</CodeBlock>
          <p>
            Without <Code>RESEND_FROM</Code>, Resend&apos;s test sender is used, which only delivers to your Resend
            account&apos;s own email.
          </p>
          <SubHeading>Spam protection</SubHeading>
          <p>
            A hidden field catches bots, and each visitor can send at most 5 contact messages and 5 newsletter signups
            per 10 minutes (counted separately). If sending fails, the visitor sees an error and keeps what they typed.
          </p>
        </DocSection>

        <DocSection id="newsletter" title="Newsletter">
          <p>
            With <Code>footer.newsletter.enabled</Code> on, the footer shows an email signup form. Each signup is sent
            to <Code>contact.notifications.sendTo</Code> using the same email provider as the contact form, with{" "}
            <Code>subjectPrefix</Code> at the start of the subject so you can filter them.
          </p>
          <CodeBlock>{NEWSLETTER_EXAMPLE}</CodeBlock>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Addresses are not stored by the site. Add them to your mailing tool (Mailchimp, Buttondown, ConvertKit…)
              from the notification emails.
            </li>
            <li>The four messages are shown for a successful signup, an invalid email, a failed send and too many tries.</li>
            <li>
              Set <Code>enabled</Code> to <Code>false</Code> to hide the form; signups sent to the server are then
              refused too.
            </li>
          </ul>
        </DocSection>

        <DocSection id="deploy" title="Deploying">
          <SubHeading>Vercel (recommended)</SubHeading>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Push the project to a GitHub, GitLab or Bitbucket repository.</li>
            <li>
              Go to <Code>vercel.com/new</Code>, import the repository and keep the detected Next.js settings.
            </li>
            <li>Click Deploy. Every push to the main branch redeploys the site automatically.</li>
          </ol>
          <p>Or deploy from your computer with the Vercel CLI:</p>
          <CodeBlock>{"npm i -g vercel\nvercel        # preview\nvercel --prod # production"}</CodeBlock>
          <SubHeading>Any Node.js host</SubHeading>
          <CodeBlock>{"npm install\nnpm run build\nnpm run start   # serves on port 3000"}</CodeBlock>
          <p>
            Set the email environment variables from <TextLink href="#emails">Form emails</TextLink> on the host.
            Supabase is installed but disabled.
          </p>
        </DocSection>

        <DocSection id="domain" title="Custom domain">
          <p>
            After deploying, the site lives at an address like <Code>your-project.vercel.app</Code>. To use your own
            domain (for example <Code>loremagency.com</Code>), buy one from any registrar (Namecheap, GoDaddy,
            Cloudflare, Porkbun) or directly in Vercel, then connect it.
          </p>
          <SubHeading>Connect it on Vercel</SubHeading>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Open the project on Vercel and go to <Code>Settings → Domains</Code>.
            </li>
            <li>
              Enter your domain, for example <Code>loremagency.com</Code>, and click Add. Accept the suggestion to also
              add <Code>www.loremagency.com</Code> and redirect it to the main domain.
            </li>
            <li>Vercel shows the DNS records to add. Copy them into your registrar&apos;s DNS settings (next step).</li>
            <li>
              Wait until the domain shows <Code>Valid Configuration</Code>. This usually takes minutes, sometimes up to
              48 hours. HTTPS is set up automatically.
            </li>
          </ol>
          <SubHeading>DNS records at your registrar</SubHeading>
          <p>
            In the registrar&apos;s DNS settings, remove any existing <Code>A</Code> record for <Code>@</Code> and any{" "}
            <Code>CNAME</Code> for <Code>www</Code>, then add the records Vercel shows. They usually look like this:
          </p>
          <CodeBlock>
            {"Type    Name   Value\nA       @      76.76.21.21\nCNAME   www    cname.vercel-dns.com"}
          </CodeBlock>
          <p>
            Always use the exact values from your Vercel dashboard if they differ. Alternatively, switch the
            domain&apos;s nameservers to <Code>ns1.vercel-dns.com</Code> and <Code>ns2.vercel-dns.com</Code> to let
            Vercel manage all DNS records. Domains bought in Vercel need no setup.
          </p>
          <SubHeading>Tell the site its address</SubHeading>
          <p>
            Set <Code>meta.siteUrl</Code> in <Code>{CONTENT_FILE}</Code> to the full address, then push the change so
            the site redeploys. Link previews on social media and search engines use it.
          </p>
          <CodeBlock>{'"meta": {\n  ...\n  "siteUrl": "https://loremagency.com"\n}'}</CodeBlock>
          <SubHeading>Sending email from your domain</SubHeading>
          <p>
            With Resend, add your domain under <Code>Domains</Code> in the Resend dashboard and add the DNS records it
            shows at your registrar. Once verified, set <Code>RESEND_FROM</Code> to an address on it, like{" "}
            <Code>hello@loremagency.com</Code>. See <TextLink href="#emails">Form emails</TextLink>.
          </p>
        </DocSection>

        <DocSection id="seo" title="SEO">
          <p>
            Search and social settings come from <Code>meta</Code> in <Code>{CONTENT_FILE}</Code>. The site builds the
            rest automatically: page titles and descriptions, link previews, <Code>/sitemap.xml</Code>,{" "}
            <Code>/robots.txt</Code> and structured data that tells Google about the studio (name, logo, email, phone
            and social profiles from <Code>contact.methods</Code> and <Code>socialLinks</Code>) and when each post was
            published.
          </p>
          <CodeBlock>
            {
              '"meta": {\n  "title": "Lorem Agency — Digital & Creative Studio",\n  "description": "One or two sentences about the studio, 150 characters or less.",\n  "favicon": "/images/favicon.svg",\n  "siteUrl": "https://loremagency.com",\n  "siteName": "Lorem Agency",\n  "ogImage": "/images/og.jpg"\n}'
            }
          </CodeBlock>
          <FieldList fields={seoFields} />
          <SubHeading>Blog posts</SubHeading>
          <p>
            Each post uses its <Code>title</Code> and <Code>excerpt</Code> for search results and its <Code>cover</Code>{" "}
            as the share image (or <Code>meta.ogImage</Code> without one). Write the excerpt like a search result: one
            clear sentence about what the reader learns.
          </p>
          <SubHeading>After going live</SubHeading>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Open <Code>search.google.com/search-console</Code>, add <Code>loremagency.com</Code> as a Domain property
              and verify it with the TXT record it shows, added at your registrar.
            </li>
            <li>
              Under <Code>Sitemaps</Code>, submit <Code>sitemap.xml</Code>. New blog posts are added to it
              automatically.
            </li>
            <li>
              Check link previews at <Code>developers.facebook.com/tools/debug</Code> and structured data at{" "}
              <Code>search.google.com/test/rich-results</Code>.
            </li>
          </ol>
          <p>
            Pages show up in Google within days to a few weeks. The <Code>/docs</Code> page is always hidden from search
            engines.
          </p>
        </DocSection>

        <footer className="mt-16 border-t border-line pt-8 text-sm">
          <Link href="/" className="text-fg transition-colors hover:text-accent-text">
            ← Back to the site
          </Link>
        </footer>
      </div>
    </div>
  );
}

function DocSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mb-16 space-y-4 leading-relaxed">
      <h2 className="font-heading text-2xl font-bold text-fg md:text-3xl">{title}</h2>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="pt-4 font-heading text-xl font-bold text-fg">{children}</h3>;
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-accent-text underline-offset-4 hover:underline">
      {children}
    </a>
  );
}

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-fg/10 px-1.5 py-0.5 text-sm text-fg">{children}</code>;
}

function FieldList({ fields }: { fields: Field[] }) {
  return (
    <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
      {fields.map((field) => (
        <div key={field.key} className="grid gap-1 bg-surface px-5 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
          <dt>
            <Code>{field.key}</Code>
          </dt>
          <dd>{field.description}</dd>
        </div>
      ))}
    </dl>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-line bg-surface p-5 text-sm text-fg">
      <code>{children}</code>
    </pre>
  );
}
