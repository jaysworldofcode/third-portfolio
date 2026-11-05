import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blog, isSectionEnabled, meta } from "@/data/site";
import { getAllPosts } from "@/lib/blog";
import { BlogPostList } from "@/components/blog/BlogPostList";
import { SectionHeading } from "@/components/ui/SectionHeading";

const BLOG_PATH = "/blog";

export const metadata: Metadata = {
  title: blog.eyebrow,
  description: blog.description,
  alternates: { canonical: BLOG_PATH },
  openGraph: {
    type: "website",
    url: BLOG_PATH,
    siteName: meta.siteName,
    title: `${blog.eyebrow} | ${meta.siteName}`,
    description: blog.description,
    images: meta.ogImage ? [meta.ogImage] : undefined,
  },
};

export default function BlogIndexPage() {
  if (!isSectionEnabled("blog")) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 text-muted md:px-10">
      <SectionHeading
        eyebrow={blog.eyebrow}
        title={blog.title}
        titleHighlight={blog.titleHighlight}
        description={blog.description}
      />
      <BlogPostList posts={getAllPosts()} />
    </div>
  );
}
