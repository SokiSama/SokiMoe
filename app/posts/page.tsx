"use client";

import { useState } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { PageCoverBanner } from "../components/PageCoverBanner";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { localPosts, type LocalPost } from "../data/posts";

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
        image="/posts-cover-sunflower.png"
        imagePosition="center top"
      />

      <main id="top" className="posts-index immersive-content">
        <h1 className="posts-index-sr-title">文章</h1>
        <section id="posts-list-start" className="posts-index-list" aria-label="全部文章">
          {pageItems.map((post) => {
            const category = getPostCategory(post);

            return (
              <article className="posts-index-card posts-index-card--reference" key={post.slug}>
                <a className="posts-index-card-link" href={`/posts/${post.slug}`} aria-label={`阅读：${post.title}`}>
                  <div className="posts-index-cover" aria-hidden="true">
                    <img src={post.cover || "/home-cover.webp"} alt="" />
                  </div>
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
                  <CaretRight className="posts-index-arrow" weight="bold" aria-hidden="true" />
                </a>
              </article>
            );
          })}
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
