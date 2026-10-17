import { readFile } from "node:fs/promises";
import path from "node:path";
import { HomePageClient, type HomePost } from "./components/HomePageClient";
import { localPosts } from "./data/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts: HomePost[] = await Promise.all(localPosts.map(async (post) => {
    try {
      const markdown = await readFile(path.join(process.cwd(), "public", post.source.replace(/^\/+/, "")), "utf8");
      const text = markdown
        .replace(/^---[\s\S]*?---\s*/, "")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/<[^>]*>/g, "")
        .replace(/https?:\/\/\S+/g, "");
      const wordCount = text.match(/[\p{Script=Han}]|[\p{Script=Latin}\p{N}]+/gu)?.length ?? 0;
      return { ...post, wordCount, readingMinutes: Math.max(1, Math.ceil(wordCount / 250)) };
    } catch {
      return { ...post, wordCount: null, readingMinutes: null };
    }
  }));
  return <>
    <link rel="stylesheet" href="/fonts/harmonyos-sans-sc/Regular.css" precedence="default" />
    <link rel="stylesheet" href="/fonts/harmonyos-sans-sc/Semibold.css" precedence="default" />
    <HomePageClient posts={posts} />
  </>;
}
