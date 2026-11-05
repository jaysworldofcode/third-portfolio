import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { blog } from "@/data/site";
import { formatPostDate, type BlogPostSummary } from "@/lib/blog";

export function BlogPostCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-colors duration-500 hover:border-accent"
    >
      {post.cover && (
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-raised">
          <Image
            src={post.cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-8">
        <div className="flex items-center gap-3 text-label">
          <time dateTime={post.date}>{formatPostDate(post.date, blog.dateLocale)}</time>
          <span aria-hidden className="size-1 rounded-full bg-accent" />
          <span>
            {post.readMinutes} {blog.readTimeLabel}
          </span>
        </div>
        <h3 className="mt-5 font-heading text-2xl leading-tight font-bold text-fg transition-colors duration-300 group-hover:text-accent-text">
          {post.title}
        </h3>
        <p className="mt-3 flex-1 leading-relaxed">{post.excerpt}</p>
        <span
          aria-hidden
          className="mt-8 grid size-12 place-items-center rounded-full border border-line text-fg transition duration-500 ease-out-expo group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent"
        >
          <FaArrowRight className="size-3.5 -rotate-45" />
        </span>
      </div>
    </Link>
  );
}
