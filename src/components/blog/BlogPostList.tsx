import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { blog } from "@/data/site";
import { formatPostDate, type BlogPostSummary } from "@/lib/blog";
import { Reveal } from "@/components/ui/Reveal";

const ROW_STAGGER_MS = 100;

export function BlogPostList({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) {
    return <p className="rounded-3xl border border-line px-6 py-10 text-center">{blog.emptyMessage}</p>;
  }

  return (
    <div className="border-t border-line">
      {posts.map((post, index) => (
        <Reveal key={post.slug} delayMs={index * ROW_STAGGER_MS}>
          <article className="border-b border-line">
            <Link
              href={`/blog/${post.slug}`}
              className="group grid items-center gap-4 py-10 md:grid-cols-[180px_1fr_auto] md:gap-10"
            >
              <div className="text-label">
                <time dateTime={post.date} className="block text-fg">
                  {formatPostDate(post.date, blog.dateLocale)}
                </time>
                <span className="mt-2 block">
                  {post.readMinutes} {blog.readTimeLabel}
                </span>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-fg transition duration-500 ease-out-expo group-hover:translate-x-2 group-hover:text-accent-text md:text-3xl">
                  {post.title}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed">{post.excerpt}</p>
              </div>
              <span
                aria-hidden
                className="hidden size-12 place-items-center rounded-full border border-line text-fg transition duration-500 ease-out-expo group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent md:grid"
              >
                <FaArrowRight className="size-3.5 -rotate-45" />
              </span>
            </Link>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
