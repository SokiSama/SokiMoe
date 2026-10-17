"use client";

import { useState, type CSSProperties } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { PageCoverBanner } from "../components/PageCoverBanner";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { localPosts, type LocalPost } from "../data/posts";
import homeStyles from "../components/HomePage.module.css";

const postDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatPostDate(date: string) {
  return postDateFormatter.format(new Date(`${date}T00:00:00Z`));
}

function getPostCategory(post: LocalPost) {
  return post.category || post.tags[0] || (post.type === "travel" ? "旅行" : "技术");
}

export default function PostsPage() {
  const posts = [...localPosts].sort((a, b) => b.date.localeCompare(a.date));
  const pageSize = 5;
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
        image="/posts-cover-ocean.png"
        imagePosition="center center"
      />

      <main id="top" className="posts-index immersive-content">
        <h1 className="posts-index-sr-title">文章</h1>
        <section id="posts-list-start" className="posts-index-list" aria-label="全部文章" data-reveal-group>
          {pageItems.map((post) => {
            const category = getPostCategory(post);

            return (
              <article
                className="posts-index-card posts-index-card--reference posts-index-card--text"
                key={post.slug}
              >
                <a className="posts-index-card-link" href={`/posts/${post.slug}`} aria-label={`阅读：${post.title}`}>
                  <div className="posts-index-copy">
                    <time className="posts-index-date-line" dateTime={post.date}>
                      {formatPostDate(post.date)}
                    </time>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <div className="posts-index-tags" aria-label="文章分类">
                      <span>{category}</span>
                    </div>
                  </div>
                  <span className="posts-index-arrow" aria-hidden="true">
                    <CaretRight weight="bold" />
                  </span>
                </a>
              </article>
            );
          })}
        </section>

        <nav className={homeStyles.pagination} aria-label="文章分页" style={{ "--home-accent": "#3b82f6", "--home-accent-soft": "#eaf3ff", "--home-text": "var(--text)", "--home-card": "var(--card)", "--home-line": "var(--line)" } as CSSProperties}>
          <button type="button" className={homeStyles.paginationDirection} onClick={() => changePage(page - 1)} disabled={page === 1}><CaretLeft size={17} aria-hidden="true" />上一页</button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              type="button"
              className={pageNumber === page ? homeStyles.currentPage : undefined}
              aria-current={pageNumber === page ? "page" : undefined}
              onClick={() => changePage(pageNumber)}
              key={pageNumber}
            >
              {pageNumber}
            </button>
          ))}
          <button type="button" className={homeStyles.paginationDirection} onClick={() => changePage(page + 1)} disabled={page === pageCount}>下一页<CaretRight size={17} aria-hidden="true" /></button>
        </nav>
      </main>

      <SiteFooter />
      <a className="back-top" href="#top" aria-label="回到顶部">↑</a>
    </div>
  );
}
