"use client";

import { useState } from "react";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { SiteLeftSidebar, SiteRightSidebar, SiteStatsCard, type SidebarCategory } from "./components/SiteSidebars";
import { localPosts } from "./data/posts";

type HomePost = {
  category: string;
  title: string;
  excerpt: string;
  tags: string[];
  views?: string;
  comments?: number;
  date: string;
  cover: string;
  coverImage?: string;
  href: string;
};

const featuredPosts: HomePost[] = [
  {
    category: "旅行",
    title: "临时起意，再赴香港的一场小旅行",
    excerpt: "一次内陆金融圈的冲击，加速了我赴港的行程",
    tags: ["旅行"],
    date: "2026-07-23",
    cover: "cover-violet",
    coverImage: "/images/hong-kong-trip-2026-cover.png",
    href: "/posts/hong-kong-trip-2026",
  },
  {
    category: "旅行",
    title: "马来西亚游记",
    excerpt: "记录人生第一次出国：从重庆出发，在吉隆坡度过一次带着新鲜感的跨年旅行。",
    tags: ["旅行", "马来西亚"],
    date: "2026-01-28",
    cover: "cover-cyan",
    coverImage: "/travel/kl.jpg",
    href: "/posts/kl",
  },
  {
    category: "旅行",
    title: "两个二次元的成都一日特种兵旅游",
    excerpt: "为主题餐厅与剧场版电影临时出发，在成都完成一趟真正早出晚归的一日行程。",
    tags: ["旅行", "成都"],
    date: "2025-10-27",
    cover: "cover-sunset",
    coverImage: "/images/chengdu-cover.png",
    href: "/posts/chengdu",
  },
  {
    category: "旅行",
    title: "结束乐队香港澳门游记",
    excerpt: "一次临时决定的毕业旅行，也是三位朋友的初次见面，沿着香港与澳门留下旅途记录。",
    tags: ["旅行", "香港澳门"],
    date: "2025-08-16",
    cover: "cover-violet",
    coverImage: "/travel/hkmacou.jpg",
    href: "/posts/hkmacou",
  },
];

const migratedPosts: HomePost[] = localPosts
  .filter((post) => post.type === "tech")
  .map((post, index) => ({
    category: post.tags[post.tags.length - 1] || "文章",
    title: post.title,
    excerpt: post.description,
    tags: post.tags,
    date: post.date,
    cover: ["cover-violet", "cover-cyan", "cover-sunset", "cover-green"][index % 4],
    coverImage: post.cover,
    href: `/posts/${post.slug}`,
  }));

const posts: HomePost[] = [...featuredPosts, ...migratedPosts];

const PAGE_SIZE = 10;
const feedItems = [...posts].sort((a, b) => b.date.localeCompare(a.date));

function getPaginationItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 3) return [1, 2, 3, "ellipsis", total];
  if (current >= total - 2) return [1, "ellipsis", total - 2, total - 1, total];
  return [1, "ellipsis", current, "ellipsis", total];
}

const categoryOrder = ["旅行", "教程", "记录", "心得", "分享", "生活", "作品", "设计"];
const sidebarCategories: SidebarCategory[] = categoryOrder
  .map((name) => ({
    name,
    count: posts.filter((post) => post.category === name || post.tags.includes(name)).length,
    href: "/#posts",
  }))
  .filter((category) => category.count > 0);

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filteredItems = selectedCategory
    ? feedItems.filter((post) => post.category === selectedCategory || post.tags.includes(selectedCategory))
    : feedItems;
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pageItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectCategory = (name: string) => {
    setSelectedCategory((current) => current === name ? null : name);
    setPage(1);
    setMenuOpen(false);
    window.requestAnimationFrame(() => {
      document.getElementById("posts")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const changePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > pageCount || nextPage === page) return;
    setPage(nextPage);
    window.requestAnimationFrame(() => {
      document.getElementById("posts")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="site">
      <SiteHeader active="home" onOpenMenu={() => setMenuOpen(true)} />

      <div id="top" className="page-shell home-page-shell">
        <SiteLeftSidebar
          active="home"
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          showCategories={false}
          categories={sidebarCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={selectCategory}
        >
          <SiteStatsCard />
        </SiteLeftSidebar>

        <main id="posts" className="content">
          <section className="intro-card home-hero card">
            <div className="home-hero-copy">
              <span className="eyebrow">HERE, THE WORLD!</span>
              <h1>未来は明るいよ</h1>
              <p>Ver Sumimi ——《Here, the world!》</p>
            </div>
            <div className="home-hero-art" aria-hidden="true"><img src="/home-hero-sumimi.png" alt="" /></div>
          </section>

          {pageItems.map((item, index) => (
            <article
              className={`post-card card${item.coverImage
                ? ` post-card--split post-card--cover-${index % 2 === 0 ? "left" : "right"}`
                : " post-card--text"}`}
              key={item.title}
            >
              {item.coverImage && <a
                className={`post-cover ${item.cover} post-cover--image`}
                href={item.href}
                aria-label={`阅读：${item.title}`}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              >
                <img src={item.coverImage} alt="" loading="lazy" />
                <span className="cover-label">FIELD NOTE · {item.date.slice(0, 4)}</span>
              </a>}
              <div className="post-body">
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                ><h2>{item.title}</h2><p>{item.excerpt}</p></a>
                <footer>
                  <div className="tags">{item.tags.slice(0, 1).map((tag) => <span key={tag}>#{tag}</span>)}</div>
                  <div className="meta">
                    {item.views && <span>◉ {item.views}</span>}
                    {typeof item.comments === "number" && <span>◇ {item.comments}</span>}
                    <time>{item.date}</time>
                  </div>
                </footer>
              </div>
            </article>
          ))}

          {pageCount > 1 && (
            <nav className="home-pagination" aria-label="首页内容分页">
              {getPaginationItems(page, pageCount).map((item, index) => item === "ellipsis" ? (
                <span className="pagination-ellipsis" aria-hidden="true" key={`ellipsis-${index}`}>…</span>
              ) : (
                <button
                  type="button"
                  className={item === page ? "active" : undefined}
                  aria-current={item === page ? "page" : undefined}
                  onClick={() => changePage(item)}
                  key={item}
                >{item}</button>
              ))}
              <button type="button" className="pagination-next" onClick={() => changePage(page + 1)} disabled={page === pageCount} aria-label="下一页">»</button>
            </nav>
          )}
        </main>

        <SiteRightSidebar />
        {menuOpen && <button className="scrim" onClick={() => setMenuOpen(false)} aria-label="关闭菜单遮罩" />}
      </div>

      <SiteFooter />
      <a className="back-top" href="#top" aria-label="回到顶部">↑</a>

    </div>
  );
}
