"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowCircleUp, ArrowLeft, Article, CalendarBlank, MapPin } from "@phosphor-icons/react";
import { PageCoverBanner } from "../../components/PageCoverBanner";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { TwikooComments } from "../../components/TwikooComments";
import { localPostMap } from "../../data/posts";

type TocItem = { id: string; level: 1 | 2 | 3; title: string };

const cleanHeading = (heading: string) => heading
  .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
  .replace(/[*_`~]/g, "")
  .trim();

function extractToc(markdown: string): TocItem[] {
  return markdown.split(/\r?\n/).flatMap((line, index) => {
    const match = /^(#{1,3})\s+(.+?)\s*#*$/.exec(line.trim());
    if (!match) return [];
    return [{
      id: `article-heading-${index + 1}`,
      level: match[1].length as 1 | 2 | 3,
      title: cleanHeading(match[2]),
    }];
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

      const headings = items
        .map((item) => document.getElementById(item.id))
        .filter((heading): heading is HTMLElement => Boolean(heading));
      const current = [...headings].reverse()
        .find((heading) => heading.getBoundingClientRect().top <= 150) ?? headings[0];
      if (current) setActiveId(current.id);
    };

    updateReadingState();
    const resizeObserver = new ResizeObserver(updateReadingState);
    const article = document.getElementById("article-content");
    if (article) resizeObserver.observe(article);
    window.addEventListener("scroll", updateReadingState, { passive: true });
    window.addEventListener("resize", updateReadingState);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateReadingState);
      window.removeEventListener("resize", updateReadingState);
    };
  }, [items]);

  return (
    <aside className="right-sidebar article-toc-sidebar article-progress-sidebar">
      <nav className="article-progress" aria-label="文章阅读进度">
        <div className="article-progress-status" aria-label={`阅读进度 ${progress}%`}>
          <i
            className="article-progress-ring"
            style={{ "--article-progress-angle": `${progress * 3.6}deg` } as CSSProperties}
            aria-hidden="true"
          />
          <strong>{progress}%</strong>
        </div>
        <section className="article-progress-directory article-toc" aria-label="文章目录">
          {items.length ? (
            <ol>
              {items.map((item) => (
                <li className={`toc-level-${item.level}`} key={item.id}>
                  <a className={activeId === item.id ? "active" : ""} href={`#${item.id}`}>{item.title}</a>
                </li>
              ))}
            </ol>
          ) : <p>这篇文章暂时没有章节标题。</p>}
        </section>
        <a href="#top">
          <ArrowCircleUp size={24} weight="regular" aria-hidden="true" />
          <span>回到顶部</span>
        </a>
      </nav>
    </aside>
  );
}

export default function LocalPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const post = localPostMap[slug];
  const [content, setContent] = useState("");
  const [failed, setFailed] = useState(false);
  const tocItems = useMemo(() => extractToc(content), [content]);

  useEffect(() => {
    if (!post) return;
    let active = true;
    fetch(post.source)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load article");
        return response.text();
      })
      .then((markdown) => {
        if (active) setContent(markdown.replace(/^---[\s\S]*?---\s*/, ""));
      })
      .catch(() => active && setFailed(true));
    return () => { active = false; };
  }, [post]);

  if (!post) {
    return (
      <div className="site">
        <SiteHeader />
        <main className="article-missing card">
          <h1>没有找到这篇文章</h1>
          <a href="/">返回首页</a>
        </main>
      </div>
    );
  }

  return (
    <div className="site immersive-route article-immersive">
      <SiteHeader active="posts" floating />
      <PageCoverBanner
        eyebrow={post.type === "travel" ? "TRAVEL NOTE" : "ARTICLE"}
        title={post.type === "travel" ? "沿途拾光" : "Soki 的文章手记"}
        description={post.type === "travel" ? "把旅途与相遇，留在这里。" : "记录折腾、思考与解决问题的过程。"}
        image={post.cover || "/posts-cover-sunflower.png"}
        imagePosition="center top"
      />

      <main id="top" className="article-reading-shell">
        <article className="article-reading-card card">
          <a className="article-back" href="/posts"><ArrowLeft size={18} weight="bold" />返回文章列表</a>
          <header className="article-reading-header">
            <span className="eyebrow">
              {post.type === "travel" ? <MapPin size={16} weight="fill" /> : <Article size={16} weight="fill" />}
              {post.type === "travel" ? "TRAVEL NOTE" : "ARTICLE"}
            </span>
            <h1>{post.title}</h1>
            <time dateTime={post.date}><CalendarBlank size={18} />{post.date}</time>
            <p>{post.description}</p>
          </header>

          <div className="article-reading-grid">
            <div id="article-content" className="travel-markdown article-reading-body">
                {!content && !failed && <p className="article-loading">正在展开文章……</p>}
                {failed && <p className="article-error">文章暂时无法读取，请稍后再试。</p>}
                {content && (
                  <ReactMarkdown
                    components={{
                      img: ({ alt, ...props }) => <img {...props} alt={alt || "文章插图"} loading="lazy" />,
                      h1: ({ node, children, ...props }) => <h1 {...props} id={`article-heading-${node?.position?.start.line ?? 0}`}>{children}</h1>,
                      h2: ({ node, children, ...props }) => <h2 {...props} id={`article-heading-${node?.position?.start.line ?? 0}`}>{children}</h2>,
                      h3: ({ node, children, ...props }) => <h3 {...props} id={`article-heading-${node?.position?.start.line ?? 0}`}>{children}</h3>,
                      a: ({ href, children, ...props }) => {
                        const external = href?.startsWith("http");
                        return <a {...props} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{children}</a>;
                      },
                    }}
                  >{content}</ReactMarkdown>
                )}
            </div>

            <ArticleReadingProgress items={tocItems} />
          </div>
        </article>
        <TwikooComments path={`/posts/${slug}`} />
      </main>
      <SiteFooter />
    </div>
  );
}
