"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  ArrowCircleUp, ArrowLeft, CalendarBlank, Clock, Folder, Hash,
  RssSimple,
} from "@phosphor-icons/react";
import { JournalHeader } from "../../components/JournalHeader";
import { TwikooComments } from "../../components/TwikooComments";
import { localPostMap } from "../../data/posts";
import homeStyles from "../../components/HomePage.module.css";
import styles from "./ArticlePage.module.css";

type TocItem = { id: string; level: 1 | 2 | 3; title: string };

const cleanHeading = (heading: string) => heading
  .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
  .replace(/[*_`~]/g, "")
  .trim();

function extractToc(markdown: string): TocItem[] {
  let fence = "";
  return markdown.split(/\r?\n/).flatMap((line, index) => {
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1];
      else if (fenceMatch[1][0] === fence[0] && fenceMatch[1].length >= fence.length) fence = "";
      return [];
    }
    if (fence) return [];
    const match = /^(#{1,3})\s+(.+?)\s*#*$/.exec(line.trim());
    if (!match) return [];
    return [{ id: `article-heading-${index + 1}`, level: match[1].length as 1 | 2 | 3, title: cleanHeading(match[2]) }];
  });
}

function ArticleReadingProgress({ items }: { items: TocItem[] }) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const updateReadingState = () => {
      const article = document.getElementById("article-content");
      if (!article) return;
      const articleTop = article.getBoundingClientRect().top + window.scrollY;
      const readingRange = Math.max(1, article.scrollHeight - window.innerHeight);
      const value = (window.scrollY - articleTop) / readingRange * 100;
      setProgress(Math.min(100, Math.max(0, Math.round(value))));
      const headings = items.map(item => document.getElementById(item.id)).filter((heading): heading is HTMLElement => Boolean(heading));
      const current = [...headings].reverse().find(heading => heading.getBoundingClientRect().top <= 150) ?? headings[0];
      if (current) setActiveId(current.id);
    };
    updateReadingState();
    const resizeObserver = new ResizeObserver(updateReadingState);
    const article = document.getElementById("article-content");
    if (article) resizeObserver.observe(article);
    window.addEventListener("scroll", updateReadingState, { passive: true });
    window.addEventListener("resize", updateReadingState);
    return () => { resizeObserver.disconnect(); window.removeEventListener("scroll", updateReadingState); window.removeEventListener("resize", updateReadingState); };
  }, [items]);

  return (
    <aside className={styles.progressSidebar}>
      <nav className="article-progress" aria-label="文章阅读进度">
        <div className="article-progress-status" aria-label={`阅读进度 ${progress}%`}>
          <i className="article-progress-ring" style={{ "--article-progress-angle": `${progress * 3.6}deg` } as CSSProperties} aria-hidden="true" /><strong>{progress}%</strong>
        </div>
        <section className="article-progress-directory article-toc" aria-label="文章目录">
          {items.length ? <ol>{items.map(item => <li className={`toc-level-${item.level}`} key={item.id}><a className={activeId === item.id ? "active" : ""} href={`#${item.id}`} aria-current={activeId === item.id ? "location" : undefined}>{item.title}</a></li>)}</ol> : <p>这篇文章暂时没有章节标题。</p>}
        </section>
        <a href="#top"><ArrowCircleUp size={24} weight="regular" aria-hidden="true" /><span>回到顶部</span></a>
      </nav>
    </aside>
  );
}

export default function LocalPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const post = localPostMap[slug];
  const [loaded, setLoaded] = useState<{ slug: string; content: string; failed: boolean } | null>(null);
  const content = loaded && loaded.slug === slug ? loaded.content : "";
  const failed = loaded && loaded.slug === slug && loaded.failed;
  const tocItems = useMemo(() => extractToc(content), [content]);
  const reading = useMemo(() => {
    const text = content.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/<[^>]*>/g, "").replace(/https?:\/\/\S+/g, "");
    const count = text.match(/[\p{Script=Han}]|[\p{Script=Latin}\p{N}]+/gu)?.length ?? 0;
    return { count, minutes: Math.max(1, Math.ceil(count / 250)) };
  }, [content]);

  useEffect(() => {
    if (!post) return;
    const controller = new AbortController();
    fetch(post.source, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("Unable to load article"); return response.text(); })
      .then(markdown => { if (!controller.signal.aborted) setLoaded({ slug, content: markdown.replace(/^---[\s\S]*?---\s*/, ""), failed: false }); })
      .catch(() => { if (!controller.signal.aborted) setLoaded({ slug, content: "", failed: true }); });
    return () => controller.abort();
  }, [post, slug]);

  const category = post ? post.category || (post.type === "travel" ? "旅行" : post.tags[0] || "技术") : "";
  return (
    <>
      <div className={`${homeStyles.home} ${styles.page}`} id="top">
        <JournalHeader />
        {!post ? <main className={styles.missing}><h1>没有找到这篇文章</h1><Link href="/">返回首页</Link></main> : (
          <main>
            <header className={styles.articleHeader}>
              <Link className={styles.back} href="/"><ArrowLeft size={16} />返回首页</Link>
              <h1>{post.title}</h1>
              <div className={styles.meta}><span><CalendarBlank size={15} /><time dateTime={post.date}>{post.date}</time></span><span><Folder size={15} />{category}</span>{post.tags[0] && <span><Hash size={15} />{post.tags[0]}</span>}</div>
              <div className={styles.readingStats} aria-live="polite"><span>{content ? reading.count : "—"} 字</span><span><Clock size={15} />{content ? reading.minutes : "—"} 分钟</span></div>
            </header>
            <figure className={styles.hero}><Image src={post.cover || "/home-cover.webp"} alt={`${post.title} 封面`} fill sizes="(max-width: 980px) 100vw, 920px" priority /></figure>
            <div className={styles.readingLayout}>
              <ArticleReadingProgress items={tocItems} />
              <article id="article-content" className={styles.prose}>
                {!content && !failed && <p className={styles.status} role="status">正在展开文章……</p>}
                {failed && <p className={styles.status} role="alert">文章暂时无法读取，请稍后刷新页面。</p>}
                {content && <ReactMarkdown components={{
                  // Markdown contains external images without known intrinsic dimensions.
                  // eslint-disable-next-line @next/next/no-img-element
                  img: ({ alt, ...props }) => <img {...props} alt={alt || "文章插图"} loading="lazy" />,
                  h1: ({ node, children, ...props }) => { const id = `article-heading-${node?.position?.start.line ?? 0}`; return <h2 {...props} id={id}>{children}<a className={styles.headingAnchor} href={`#${id}`} aria-label="链接到此章节">#</a></h2>; },
                  h2: ({ node, children, ...props }) => { const id = `article-heading-${node?.position?.start.line ?? 0}`; return <h2 {...props} id={id}>{children}<a className={styles.headingAnchor} href={`#${id}`} aria-label="链接到此章节">#</a></h2>; },
                  h3: ({ node, children, ...props }) => { const id = `article-heading-${node?.position?.start.line ?? 0}`; return <h3 {...props} id={id}>{children}<a className={styles.headingAnchor} href={`#${id}`} aria-label="链接到此章节">#</a></h3>; },
                  a: ({ href, children, ...props }) => { const external = /^https?:\/\//.test(href || ""); return <a {...props} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{children}</a>; },
                }}>{content}</ReactMarkdown>}
              </article>
            </div>
            <div className={styles.comments}><TwikooComments path={`/posts/${slug}`} /></div>
          </main>
        )}
        <footer className={homeStyles.footer}><p>© 2025–{new Date().getFullYear()} Soki Sugar Life<span>·</span><a href="https://icp.gov.moe/?keyword=20263015" target="_blank" rel="noreferrer">萌ICP备20263015号</a></p><a href="/api/rss"><RssSimple size={15} />RSS 订阅</a></footer>
      </div>
    </>
  );
}
