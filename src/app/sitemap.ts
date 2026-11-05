import type { MetadataRoute } from "next";
import { absoluteUrl, isSectionEnabled } from "@/data/site";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap[number] = { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 };
  if (!isSectionEnabled("blog")) return [home];

  const posts = getAllPosts();
  const blogIndex: MetadataRoute.Sitemap[number] = {
    url: absoluteUrl("/blog"),
    lastModified: posts[0]?.date,
    changeFrequency: "weekly",
    priority: 0.8,
  };
  const postEntries = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.date,
    priority: 0.6,
  }));

  return [home, blogIndex, ...postEntries];
}
