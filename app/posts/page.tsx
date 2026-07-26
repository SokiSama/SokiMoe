"use client";

import { useState } from "react";
import { CalendarBlank, Flag, Tag } from "@phosphor-icons/react";
import { PageCoverBanner } from "../components/PageCoverBanner";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { localPosts } from "../data/posts";

function formatPostDate(date: string) {
  return date;
}

export default function PostsPage() {
  const posts = [...localPosts].sort((a, b) => b.date.localeCompare(a.date));
  const pageSize = 4;
  const pageCount = Math.ceil(posts.length / pageSize);
  const [page, setPage] = useState(1);
  const pageItems = posts.slice((page - 1) * pageSize, page * pageSize);

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    window.requestAnimationFrame(() => {
      document.getElementById("posts-list-start")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="site immersive-route posts-index-route">
      <SiteHeader active="posts" floating />
      <PageCoverBanner
        eyebrow="ALL JOURNALS"
        title="文章，是生活留下的注脚"
        description={`这里收录了 ${posts.length} 篇旅行、技术与生活记录。`}
        image="/posts-cover-sunflower.png"
        imagePosition="center top"
      />

      <main id="top" className="posts-index immersive-content">
        <section id="posts-list-start" className="posts-index-list" aria-label="全部文章">
          {pageItems.map((post) => (
            <article className="posts-index-card" key={post.slug}>
              <a className="posts-index-cover" href={`/posts/${post.slug}`} aria-label={`阅读：${post.title}`}>
                <img src={post.cover || "/home-cover.webp"} alt={`${post.title}封面`} />
              </a>

              <div className="posts-index-copy">
                <div className="posts-index-meta">
                  <span><Flag weight="duotone" />{post.category || post.tags[0] || "文章"}</span>
                  <time dateTime={post.date}><CalendarBlank weight="fill" />{formatPostDate(post.date)}</time>
                </div>
                <h2><a href={`/posts/${post.slug}`}>{post.title}</a></h2>
                <p>{post.description}</p>
                <div className="posts-index-tags">
                  {post.tags.map((tag) => <span key={tag}><Tag weight="fill" />{tag}</span>)}
                </div>
                <a className="posts-index-more" href={`/posts/${post.slug}`}>阅读</a>
              </div>
            </article>
          ))}
        </section>

        <nav className="posts-pagination" aria-label="文章分页">
          <button type="button" onClick={() => changePage(page - 1)} disabled={page === 1} aria-label="上一页">‹</button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              type="button"
              className={pageNumber === page ? "active" : undefined}
              aria-current={pageNumber === page ? "page" : undefined}
              onClick={() => changePage(pageNumber)}
              key={pageNumber}
            >
              {pageNumber}
            </button>
          ))}
          <button type="button" onClick={() => changePage(page + 1)} disabled={page === pageCount} aria-label="下一页">›</button>
        </nav>
      </main>

      <SiteFooter />
      <a className="back-top" href="#top" aria-label="回到顶部">↑</a>
    </div>
  );
}
