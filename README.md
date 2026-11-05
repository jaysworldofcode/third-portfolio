# Lorem Agency — Landing page

A one-page digital and creative agency site built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com) and TypeScript. It has a dark theme with a light theme toggle, a lime accent colour, a counting page loader, three hero styles (big type with a scrolling word band, a full-screen photo or video, or a scroll-driven video), stat counters, sliders, a hover image reveal on the services, a blog and a newsletter signup. All text, links, images, videos and icons come from a single JSON file, so the site can be updated without touching code.

A visual version of this guide, including a preview of every icon and the image credits, is available at [`/docs`](http://localhost:3000/docs) when the site is running. That page is not linked from the site and is hidden from search engines.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Edits to the content file appear after saving.

| Command         | What it does                                 |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the local development server           |
| `npm run build` | Build for production and check content types |
| `npm run start` | Serve the production build on port 3000      |
| `npm run lint`  | Check the code for problems                  |

## Editing content

Everything on the site lives in [`content/site.json`](content/site.json).

| Key            | Controls                                                                                      |
| -------------- | --------------------------------------------------------------------------------------------- |
| `meta`         | Browser tab title, search description, favicon, site address and [SEO](#seo)                 |
| `owner`        | Studio name, initials and logo (navbar, footer and loading screen)                            |
| `theme`        | Default light/dark theme, the theme button and the accent colour ([Theme](#theme-and-colours)) |
| `sections`     | Turn landing page sections on (`true`) or off (`false`)                                       |
| `navigation`   | Section labels, which sections are in the menus (`menuItems`), Start a Project button         |
| `socialLinks`  | Social icons in the mobile menu, contact section and footer                                   |
| `hero`         | The opening section in one of three [styles](#hero-styles)                                    |
| `clients`      | Label and scrolling strip of client logos                                                     |
| `about`        | Heading, paragraphs, image, counting stats, timeline and awards                               |
| `services`     | Heading and numbered, expandable service rows (description, tags, hover image)                |
| `process`      | Heading and numbered process steps                                                            |
| `work`         | Heading, slider button labels and project cards                                               |
| `team`         | Heading and team cards with social links                                                      |
| `testimonials` | Heading, slider button labels and client quotes                                               |
| `pricing`      | Heading, plan cards (one can be `featured`, with a `badge`) and a note                        |
| `blog`         | Blog heading, posts shown on the home page and blog page labels                               |
| `contact`      | Heading, the scrolling "Let's talk" band, contact methods, form labels and messages, emails   |
| `footer`       | Description, column titles, Services list, copyright, tagline and the [newsletter](#newsletter) |

Rules:

- Keep the file valid JSON: double quotes around text, commas between items and no comma after the last item.
- Section titles have a `title` and an optional `titleHighlight`, which is shown in the accent colour.
- Use `"#"` as a placeholder link. An empty `href` on a contact method shows it as plain text and leaves it out of the mobile menu and footer.
- Items can be added to or removed from any list (services, steps, projects, stats, team, plans, quotes). Numbers like 01 are added automatically. Section order and ids are fixed.
- Everything is entered once: section labels in `navigation.labels` feed the navbar, mobile menu and footer, and `contact.methods` also feeds the mobile menu and footer.
- The file is sent to every visitor, so never put passwords or API keys in it.
- Run `npm run build` after big edits. It reports any missing or misspelled field, and values that aren't allowed (like an unknown `hero.variant`).

### Theme and colours

```json
"theme": {
  "defaultMode": "dark",
  "showToggle": true,
  "accentColor": "#C6F432",
  "accentTextColor": "#0A0A0A",
  "switchToLightLabel": "Switch to light theme",
  "switchToDarkLabel": "Switch to dark theme"
}
```

- `defaultMode` is `"dark"` or `"light"`. With `showToggle` on, visitors can switch and their choice is remembered on their device; with it off, everyone sees `defaultMode`.
- `accentColor` is used for buttons, badges, the loader and highlighted words. `accentTextColor` is the text colour on top of it.
- In the light theme, accent-coloured text is darkened automatically so it stays readable. The photo and video hero styles always use dark colours over the footage.

### Turning sections on or off

```json
"sections": {
  "home": true,
  "clients": true,
  "about": true,
  "services": true,
  "process": true,
  "work": true,
  "team": true,
  "testimonials": true,
  "pricing": true,
  "blog": true,
  "contact": true
}
```

- Sections always appear in the order above.
- A hidden section also disappears from the navbar, mobile menu and footer, and buttons that link to it are hidden.
- The hero (`home`) can be turned off too; the navbar logo then links to `/`.
- Turning `blog` off also turns off the `/blog` pages (they return "not found").
- `navigation.menuItems` picks which sections are linked from the navbar, mobile menu and footer, and in what order.

### Hero styles

Set `hero.variant` to one of:

| Variant         | What it shows                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| `"marquee"`     | Big headline, a scrolling band of `hero.marquee` words, the `highlights` list and a showreel button    |
| `"media"`       | Headline over a full-screen photo or looping muted video from `hero.media` (`type`: `"image"` or `"video"`) |
| `"scrollVideo"` | A pinned video that plays as the visitor scrolls, with one screen of text per chapter                  |

The headline (`title` + `titleHighlight`), `summary` and buttons are shared by all three. A loading screen counts to 100 before the page appears; visitors who prefer reduced motion skip the animations.

**Showreel.** `hero.showreel` sets the button label, the close button label, the `video` and its `poster`. The video can be a file in `public/images/`, the full address of an `.mp4` hosted elsewhere, or a YouTube or Vimeo link (`youtube.com/watch?v=…`, `youtu.be/…`, `youtube.com/shorts/…`, `vimeo.com/…`), which plays in an embedded player (the `poster` is then ignored). The template uses the scroll video as a placeholder reel.

**Scroll video.** The opening screen and each item in `hero.scrollVideo.chapters` get one screen height of scrolling, and `hero.scrollVideo.video` is spread evenly across them. Use an H.264 `.mp4` with a keyframe every few frames; HEVC files don't play in every browser, and normal keyframe spacing makes scrolling jerky. With [ffmpeg](https://ffmpeg.org/download.html):

```bash
ffmpeg -i my-video.mp4 -an -vf "fps=30,scale=1920:-2" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart public/images/scroll-video.mp4
ffmpeg -i public/images/scroll-video.mp4 -frames:v 1 -q:v 3 public/images/scroll-video-poster.jpg
```

## Writing blog posts

Each post is a Markdown file in [`content/blog/`](content/blog). The file name is the post's address: `my-first-post.md` is shown at `/blog/my-first-post`. Use lowercase letters, numbers and dashes.

```markdown
---
title: My first post
date: 2026-11-03
excerpt: A one or two sentence summary shown on the post cards.
cover: /images/blog-my-first-post.jpg
---

Write your post here using Markdown: ## headings, **bold**, [links](https://example.com), lists, > quotes, images and tables.
```

| Setting       | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| `title`       | Required. The post title                                          |
| `date`        | Required. Publish date as `YYYY-MM-DD`; posts are sorted by it    |
| `excerpt`     | Required. Short summary for the post cards and search results     |
| `cover`       | Optional. Image on the post card and at the top of the post       |
| `readMinutes` | Optional. Reading time; calculated automatically if left out      |
| `draft`       | Optional. `true` hides the post without deleting it               |

- The home page shows the newest `blog.postsOnHomePage` posts as cards. If there are more, a "View all articles" button links to `/blog`.
- Delete a file to remove a post.
- Blog page wording (read time label, back links, empty message) and the date format (`dateLocale`, e.g. `"en-GB"`) are in the `blog` block of `content/site.json`.

### Images and logos

Put image files in `public/images/` and reference them with a path starting with `/images/`:

```json
"image": "/images/my-project.jpg"
```

- Match the file name's upper and lower case exactly (Vercel is case-sensitive), and rename `.jfif` files to `.jpg`.
- `owner.logo` is the logo in the navbar, footer and loading screen. It sits on dark and light backgrounds, so use a mark with its own background (like the round lime logo), or leave it empty (`""`) to show the initials in a circle.
- Client logos (`clients.logos`) are SVGs shown in one colour that follows the theme; make them about 4:1. A missing file falls back to the client name as text.
- Service images follow the cursor when hovering a service row on desktop, and show inside the opened row on touch screens.
- Suggested sizes: hero 1920×1080, about 1200×1500, services 800×600, projects 1200×1500, team 900×1200, avatars 240×240, blog covers 1600×1000, share image 1200×630.
- The placeholder photos are free [Unsplash](https://unsplash.com/license) photos; the photographers are credited on the [`/docs`](http://localhost:3000/docs#image-credits) page. The client logos, logo, favicon and share image are made up for this template.

## Icons

Use these names in any `icon` field (social links, team socials and contact methods). Unknown names show a generic link icon.

| Name        | Icon             | Name       | Icon              |
| ----------- | ---------------- | ---------- | ----------------- |
| `behance`   | Behance          | `location` | Map pin           |
| `camera`    | Camera           | `mobile`   | Mobile phone      |
| `chart`     | Line chart       | `palette`  | Paint palette     |
| `code`      | Code brackets    | `pen`      | Pen nib           |
| `discord`   | Discord          | `phone`    | Phone             |
| `dribbble`  | Dribbble         | `rocket`   | Rocket            |
| `email`     | Envelope         | `telegram` | Telegram          |
| `facebook`  | Facebook         | `tiktok`   | TikTok            |
| `github`    | GitHub           | `whatsapp` | WhatsApp          |
| `globe`     | Globe (website)  | `x`        | X (Twitter)       |
| `instagram` | Instagram        | `youtube`  | YouTube           |
| `linkedin`  | LinkedIn         |            |                   |

To add more, import an icon from [react-icons](https://react-icons.github.io/react-icons/) in [`src/lib/icons.ts`](src/lib/icons.ts) and add it to the `ICONS` list. It then also appears on the `/docs` page.

## Form emails

Messages from the contact form and newsletter signups are emailed to you. Choose how they are sent in `content/site.json`:

```json
"notifications": {
  "provider": "smtp",
  "sendTo": "hello@loremagency.com",
  "senderName": "Lorem Agency website",
  "subjectPrefix": "[Lorem Agency]"
}
```

- `provider`: `"smtp"` or `"resend"`.
- `sendTo`: the inbox that receives the messages.
- Hitting **Reply** in your inbox answers the visitor directly.

Passwords and API keys never go in `content/site.json`, because that file is sent to every visitor. Copy `.env.example` to `.env.local` and fill in the values for your provider, then restart `npm run dev`. On Vercel, add the same values under **Project → Settings → Environment Variables**.

### SMTP (Gmail, Outlook, Zoho or any mailbox)

| Variable        | Example                                   |
| --------------- | ----------------------------------------- |
| `SMTP_HOST`     | `smtp.gmail.com`                          |
| `SMTP_PORT`     | `465` (or `587`)                          |
| `SMTP_USER`     | `you@gmail.com`                           |
| `SMTP_PASSWORD` | An app password, not your normal password |
| `SMTP_FROM`     | Optional sender address; defaults to `SMTP_USER` |

For Gmail: turn on 2-Step Verification, then create an app password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).

### Resend

| Variable         | Example                                                        |
| ---------------- | -------------------------------------------------------------- |
| `RESEND_API_KEY` | From [resend.com/api-keys](https://resend.com/api-keys)        |
| `RESEND_FROM`    | Optional; an address on a domain verified in Resend            |

Without `RESEND_FROM`, Resend's test sender is used, which can only deliver to the email address of your Resend account.

### Spam protection

Both forms include a hidden field that only bots fill in, and each visitor can send at most 5 contact messages and 5 newsletter signups per 10 minutes (counted separately). If sending fails, the visitor sees an error and what they typed stays in the form.

## Newsletter

With `footer.newsletter.enabled` set to `true`, the footer shows an email signup form. Each signup is emailed to `contact.notifications.sendTo` with the provider above, and the subject starts with `footer.newsletter.subjectPrefix` so you can filter them. Addresses are not stored by the site; add them to your mailing tool from those emails. The form's labels and its success, invalid, failed and rate-limit messages are all in `footer.newsletter`. Setting `enabled` to `false` hides the form and refuses signups sent to the server.

## Deploying

### Vercel (recommended)

1. Push the project to a GitHub, GitLab or Bitbucket repository.
2. Go to [vercel.com/new](https://vercel.com/new), import the repository and keep the detected Next.js settings.
3. Click **Deploy**. Every push to the main branch redeploys automatically.

Or deploy from the command line:

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

### Any Node.js host

```bash
npm install
npm run build
npm run start   # serves on port 3000
```

Set the email environment variables from [Form emails](#form-emails) on the host. Supabase is installed but currently disabled.

## Custom domain

Buy a domain from any registrar (Namecheap, GoDaddy, Cloudflare, Porkbun) or directly in Vercel, then connect it:

1. On Vercel, open the project and go to **Settings → Domains**.
2. Add your domain (for example `loremagency.com`) and accept adding `www.loremagency.com` as a redirect.
3. At your registrar, remove any existing `A` record for `@` and `CNAME` for `www`, then add the records Vercel shows. They usually look like:

   | Type  | Name  | Value                  |
   | ----- | ----- | ---------------------- |
   | A     | `@`   | `76.76.21.21`          |
   | CNAME | `www` | `cname.vercel-dns.com` |

   Always use the exact values from your Vercel dashboard if they differ. Alternatively, point the nameservers to `ns1.vercel-dns.com` and `ns2.vercel-dns.com`. Domains bought in Vercel need no setup.

4. Wait for **Valid Configuration** (minutes, up to 48 hours). HTTPS is set up automatically.
5. Set `meta.siteUrl` in `content/site.json` to the full address, for example `"https://loremagency.com"`, and push. Link previews on social media and search engines use it.

To send form emails from your domain with Resend, add the domain in the Resend dashboard, add its DNS records at your registrar, and set `RESEND_FROM` to an address on it (for example `hello@loremagency.com`).

## SEO

Search and social settings live in `meta` in `content/site.json`:

| Field         | Purpose                                                                         |
| ------------- | ------------------------------------------------------------------------------- |
| `title`       | Search result and browser tab title (under ~60 characters)                      |
| `description` | Text under the title in search results (under ~150 characters)                  |
| `siteUrl`     | Live address, e.g. `https://loremagency.com`. Used for the sitemap and previews |
| `siteName`    | Studio name as search engines show it; added to page titles as `Page \| Name`   |
| `ogImage`     | Image shown when the site is shared, best at 1200×630 (e.g. `/images/og.jpg`)   |

Built automatically from that: page titles and descriptions, Open Graph and X link previews, canonical links, `/sitemap.xml` (including every blog post), `/robots.txt` (hides `/docs`) and schema.org structured data (`Organization` on the home page, with email, phone and social profiles; `BlogPosting` on posts). Blog posts use their `title`, `excerpt` and `cover`.

After going live:

1. Add the domain in [Google Search Console](https://search.google.com/search-console) as a Domain property and verify it with the TXT record it shows.
2. Submit `sitemap.xml` under **Sitemaps**.
3. Check link previews with the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and structured data with the [Rich Results Test](https://search.google.com/test/rich-results).

## Project structure

```
content/site.json          All site content
content/blog/              Blog posts (one Markdown file per post)
public/images/             Images, logo, favicon, share image and videos
public/images/clients/     Client logo SVGs
src/app/page.tsx           Page layout (section order)
src/app/blog/              Blog list and post pages
src/app/docs/              Hidden guide page and image credits
src/app/actions/           Contact form and newsletter server actions
src/components/site/       Page sections (hero styles in site/hero/)
src/components/ui/         Shared building blocks (buttons, marquee, slider controls…)
src/data/site.ts           Loads and type-checks the content file
src/lib/email/             SMTP and Resend senders
src/lib/theme.ts           Light/dark theme storage and the before-paint script
src/lib/icons.ts           Icon names available to the content file
```
