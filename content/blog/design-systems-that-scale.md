---
title: "Design systems that grow with your product"
date: 2026-10-14
excerpt: Tokens, components and a little documentation go a long way. How we build design systems that stay useful after the agency leaves.
cover: /images/blog-design-system.jpg
---

A design system is a promise: every new page will look like it belongs, and nobody will have to reinvent a button again. Keeping that promise is harder than it sounds, especially once the original designers have moved on.

Here's how we build systems that are still in use years later.

## Start with tokens

Tokens are the named values everything else is built from: colours, type sizes, spacing and radii.

| Token | Value | Used for |
| --- | --- | --- |
| `color.accent` | `#C6F432` | Buttons, highlights |
| `space.4` | `16px` | Default gap |
| `radius.lg` | `24px` | Cards and panels |

Naming tokens by *purpose* (`accent`) rather than *appearance* (`lime`) means you can change the look later without renaming anything.

## Build fewer, better components

It's tempting to design every variant up front. We do the opposite: build the ten components the product actually uses, ship them, and add more only when a real screen needs them.

Each component gets:

- clear states (default, hover, focus, disabled, error)
- accessible colours in both light and dark themes
- one short usage note: when to use it, and when not to

## Write the docs nobody wants to write

A design system without documentation is just a file. A single page per component, with a screenshot, a do and a don't, is enough. The goal is that a new hire can build a screen without asking anyone.

## Plan for change

Products evolve. We set up a simple process (a monthly review and a changelog) so the system changes on purpose rather than drifting one exception at a time.
