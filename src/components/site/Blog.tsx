import Link from "next/link";
import { blog } from "@/data/site";
import { getAllPosts } from "@/lib/blog";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { BUTTON_STYLES } from "@/components/ui/buttonStyles";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const CARD_STAGGER_MS = 100;

export function Blog() {
  const allPosts = getAllPosts();
  const homePosts = allPosts.slice(0, blog.postsOnHomePage);
  const hasMorePosts = allPosts.length > homePosts.length;

  return (
    <section id="blog" className="relative border-t border-line bg-bg py-28 text-muted md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8 md:mb-20">
          <SectionHeading
            eyebrow={blog.eyebrow}
            title={blog.title}
            titleHighlight={blog.titleHighlight}
            description={blog.description}
            className=""
          />
          {hasMorePosts && (
            <Reveal>
              <Link href="/blog" className={BUTTON_STYLES.outline}>
                {blog.viewAllLabel}
              </Link>
            </Reveal>
          )}
        </div>

        {homePosts.length === 0 ? (
          <p className="rounded-3xl border border-line px-6 py-10 text-center">{blog.emptyMessage}</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {homePosts.map((post, index) => (
              <li key={post.slug}>
                <Reveal delayMs={index * CARD_STAGGER_MS} className="h-full">
                  <BlogPostCard post={post} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
