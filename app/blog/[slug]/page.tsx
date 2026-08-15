// Article page. Server component so the slug set can be prerendered at build
// time; the reader UI (language toggle, share, scroll progress) is the client
// component underneath.
import { notFound } from "next/navigation";
import { blogPosts, getPost } from "@/data/blog";
import { PostView } from "@/components/blog/PostView";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found | LogSabha" };
  return {
    title: `${post.en || post.hi} | LogSabha`,
    description: post.noteEn || post.noteHi,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <PostView post={post} />
      <Footer />
    </>
  );
}
