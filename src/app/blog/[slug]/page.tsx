import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaArrowLeft } from "react-icons/fa6";
import { absoluteUrl, blog, isSectionEnabled, meta } from "@/data/site";
import { formatPostDate, getAllPosts, getPost, type BlogPost } from "@/lib/blog";
import { JsonLd } from "@/components/seo/JsonLd";

type BlogPostPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  if (!isSectionEnabled("blog")) return [];
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const postPath = `/blog/${post.slug}`;
  const image = post.cover || meta.ogImage;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: postPath },
    openGraph: {
      type: "article",
      url: postPath,
      siteName: meta.siteName,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [meta.siteName],
      images: image ? [image] : undefined,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

const blogPostingSchema = (post: BlogPost) => {
  const image = post.cover || meta.ogImage;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: absoluteUrl(`/blog/${post.slug}`),
    image: image ? absoluteUrl(image) : undefined,
    author: { "@type": "Organization", name: meta.siteName, url: absoluteUrl("/") },
  };
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPost((await params).slug);
  if (!post || !isSectionEnabled("blog")) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 text-muted">
      <JsonLd data={blogPostingSchema(post)} />
      <Link
        href="/blog"
        className="group inline-flex items-center gap-3 rounded-full border border-line px-5 py-2.5 text-label text-fg transition-colors hover:border-accent hover:text-accent-text"
      >
        <FaArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" />
        {blog.backToBlogLabel}
      </Link>

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-3 text-label">
          <time dateTime={post.date} className="text-fg">
            {formatPostDate(post.date, blog.dateLocale)}
          </time>
          <span aria-hidden className="size-1 rounded-full bg-accent" />
          <span>
            {post.readMinutes} {blog.readTimeLabel}
          </span>
        </div>
        <h1 className="mt-6 font-heading text-4xl leading-[1.05] font-bold tracking-tight text-fg md:text-6xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-relaxed">{post.excerpt}</p>
      </header>

      {post.cover && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl bg-surface">
          <Image
            src={post.cover}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* prose-invert only applies in the dark theme; the `dark` variant follows data-theme (globals.css). */}
      <div className="prose prose-lg mt-12 max-w-none dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-headings:text-fg prose-a:text-accent-text prose-blockquote:border-accent prose-strong:text-fg prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-line prose-pre:bg-surface prose-pre:text-fg prose-th:text-fg">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
