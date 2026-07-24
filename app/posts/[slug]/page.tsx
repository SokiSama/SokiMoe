"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Article, CalendarBlank, ListBullets, MapPin } from "@phosphor-icons/react";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteLeftSidebar, SiteStatsCard } from "../../components/SiteSidebars";
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
    return [{ id: `article-heading-${index + 1}`, level: match[1].length as 1 | 2 | 3, title: cleanHeading(match[2]) }];
  });
}

function ArticleTableOfContents({ items }: { items: TocItem[] }) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const updateReadingState = () => {
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollRange > 0 ? Math.min(100, Math.max(0, Math.round(window.scrollY / scrollRange * 100))) : 100);

      const headings = items
        .map((item) => document.getElementById(item.id))
        .filter((heading): heading is HTMLElement => Boolean(heading));
      const current = [...headings].reverse().find((heading) => heading.getBoundingClientRect().top <= 150) ?? headings[0];
      if (current) setActiveId(current.id);
    };

    updateReadingState();
    window.addEventListener("scroll", updateReadingState, { passive: true });
    window.addEventListener("resize", updateReadingState);
    return () => {
      window.removeEventListener("scroll", updateReadingState);
      window.removeEventListener("resize", updateReadingState);
    };
  }, [items]);

  return (
    <aside className="right-sidebar article-toc-sidebar">
      <nav className="card article-toc" aria-label="文章目录">
        <h3><ListBullets size={20} weight="duotone" />目录</h3>
        <strong className="toc-progress-value">{progress}%</strong>
        <div className="toc-progress-track" aria-label={`阅读进度 ${progress}%`}><i style={{ width: `${progress}%` }} /></div>
        {items.length ? (
          <ol>
            {items.map((item) => (
              <li className={`toc-level-${item.level}`} key={item.id}>
                <a className={activeId === item.id ? "active" : ""} href={`#${item.id}`}>{item.title}</a>
              </li>
            ))}
          </ol>
        ) : <p>这篇文章暂时没有章节标题。</p>}
      </nav>
    </aside>
  );
}

export default function LocalPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const post = localPostMap[slug];
  const [menuOpen, setMenuOpen] = useState(false);
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
        <SiteHeader onOpenMenu={() => setMenuOpen(true)} />
        <main className="article-missing card">
          <h1>没有找到这篇文章</h1>
          <a href="/">返回首页</a>
        </main>
      </div>
    );
  }

  return (
    <div className="site">
      <SiteHeader onOpenMenu={() => setMenuOpen(true)} />
      <div id="top" className="page-shell article-shell">
        <SiteLeftSidebar open={menuOpen} onClose={() => setMenuOpen(false)}>
          <SiteStatsCard />
        </SiteLeftSidebar>

        <main className="content article-content">
          <article className="travel-article card">
            <a className="article-back" href="/"><ArrowLeft size={18} weight="bold" />返回首页</a>
            <header className="travel-article-header">
              {post.cover && <img src={post.cover} alt={`${post.title}封面`} />}
              <div className="travel-article-title">
                <span className="eyebrow">
                  {post.type === "travel" ? <MapPin size={16} weight="fill" /> : <Article size={16} weight="fill" />}
                  {post.type === "travel" ? "TRAVEL NOTE" : "ARTICLE"}
                </span>
                <h1>{post.title}</h1>
                <p>{post.description}</p>
                <time dateTime={post.date}><CalendarBlank size={18} />{post.date}</time>
              </div>
            </header>

            <div className="travel-markdown">
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
          </article>
        </main>

        <ArticleTableOfContents items={tocItems} />
        {menuOpen && <button className="scrim" onClick={() => setMenuOpen(false)} aria-label="关闭菜单遮罩" />}
      </div>
      <SiteFooter />
      <a className="back-top" href="#top" aria-label="回到顶部">↑</a>
    </div>
  );
}
