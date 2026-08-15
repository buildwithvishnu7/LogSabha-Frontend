"use client";

// Editorial Insights — the blog index. Content auto-extracted from
// reference/blog-posts.js into src/data/blog.ts. Static-data-first.
import { BlogIndex } from "@/components/blog/BlogSections";
import { Footer } from "@/components/Footer";

export default function BlogPage() {
  return (
    <>
      <BlogIndex />
      <Footer />
    </>
  );
}
