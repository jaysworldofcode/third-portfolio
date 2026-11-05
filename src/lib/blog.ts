import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");
const MARKDOWN_EXTENSION = ".md";
const WORDS_PER_MINUTE = 200;

export type BlogPostSummary = {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD), used for sorting. */
  date: string;
  excerpt: string;
  cover?: string;
  readMinutes: number;
};

export type BlogPost = BlogPostSummary & { content: string };

const toIsoDate = (value: unknown, file: string): string => {
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Blog post "${file}" has an invalid "date". Use the format YYYY-MM-DD.`);
  }
  return date.toISOString().slice(0, 10);
};

const requireText = (value: unknown, field: string, file: string): string => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Blog post "${file}" is missing "${field}".`);
  }
  return value.trim();
};

const estimateReadMinutes = (content: string) =>
  Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE));

/** Returns null for drafts, so they never appear on the site. */
function readPost(fileName: string): BlogPost | null {
  const filePath = path.join(BLOG_DIRECTORY, fileName);
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  if (data.draft === true) return null;

  return {
    slug: path.basename(fileName, MARKDOWN_EXTENSION),
    title: requireText(data.title, "title", fileName),
    date: toIsoDate(data.date, fileName),
    excerpt: requireText(data.excerpt, "excerpt", fileName),
    cover: typeof data.cover === "string" && data.cover ? data.cover : undefined,
    readMinutes: typeof data.readMinutes === "number" ? data.readMinutes : estimateReadMinutes(content),
    content,
  };
}

function readPublishedPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIRECTORY)) return [];

  return fs
    .readdirSync(BLOG_DIRECTORY)
    .filter((fileName) => fileName.endsWith(MARKDOWN_EXTENSION))
    .map(readPost)
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllPosts(): BlogPostSummary[] {
  return readPublishedPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    cover: post.cover,
    readMinutes: post.readMinutes,
  }));
}

export function getPost(slug: string): BlogPost | undefined {
  return readPublishedPosts().find((post) => post.slug === slug);
}

export function formatPostDate(isoDate: string, locale: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });
}
