"use client";

import { useEffect, type ReactNode } from "react";
import { Article, FolderSimple, HeartStraight, Tag, X } from "@phosphor-icons/react";
import { localPosts } from "../data/posts";
import { PrimaryNav } from "./PrimaryNav";
import { OnThisDayCard } from "./OnThisDayCard";
import { MusicPlayerCard } from "./MusicPlayerCard";

export type SidebarCategory = { name: string; count: number; href: string };

const categoryOrder = ["旅行", "教程", "记录", "心得", "分享"];
const categories: SidebarCategory[] = categoryOrder
  .map((name) => ({
    name,
    count: localPosts.filter((post) => post.tags.includes(name)).length,
    href: "/#posts",
  }))
  .filter((category) => category.count > 0);

const day = 86_400_000;
const daysSince = (date: string) => Math.max(0, Math.floor((Date.now() - new Date(`${date}T00:00:00+08:00`).getTime()) / day));

export function SiteLeftSidebar({ active, open = false, onClose, showCategories = true, categories: categoryItems = categories, selectedCategory, onCategorySelect, children }: { active?: string; open?: boolean; onClose?: () => void; showCategories?: boolean; categories?: SidebarCategory[]; selectedCategory?: string | null; onCategorySelect?: (name: string) => void; children?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  return (
    <aside className={open ? "left-sidebar open" : "left-sidebar"}>
      <div className="sidebar-sticky">
        {onClose && <div className="drawer-head"><button className="round-button" onClick={onClose} aria-label="关闭菜单"><X weight="regular" /></button></div>}
        <PrimaryNav active={active} className="drawer-nav" onNavigate={onClose} />
        <section className="card profile-card">
          <div className="avatar"><img src="/profile-avatar.webp" alt="Soki 的头像" /></div>
          <h2>Soki</h2>
          <span className="profile-divider" aria-hidden="true" />
          <p>彼女の愛は、甘くて痛い</p>
          <div className="socials" aria-label="个人主页链接">
            <a href="https://github.com/SokiSama" target="_blank" rel="noreferrer" title="GitHub" aria-label="GitHub"><img src="/icons/github.svg" alt="" /></a>
            <a href="https://steamcommunity.com/id/SokiSama/" target="_blank" rel="noreferrer" title="Steam" aria-label="Steam"><img src="/icons/steam.svg" alt="" /></a>
            <a href="https://bsky.app/profile/matsusatou.bsky.social" target="_blank" rel="noreferrer" title="Bluesky" aria-label="Bluesky"><img src="/icons/bluesky.svg" alt="" /></a>
          </div>
        </section>
        {children}
        {showCategories && <section className="card side-card">
          <h3>文章分类</h3>
          <ul className="category-list">
            {categoryItems.map(({ name, count, href }) => (
              <li key={name}>
                <a
                  href={href}
                  className={selectedCategory === name ? "active" : undefined}
                  aria-pressed={onCategorySelect ? selectedCategory === name : undefined}
                  onClick={onCategorySelect ? (event) => {
                    event.preventDefault();
                    onCategorySelect(name);
                  } : undefined}
                ><span>{name}</span><em>{count}</em></a>
              </li>
            ))}
          </ul>
        </section>}
      </div>
    </aside>
  );
}

export function SiteStatsCard() {
  const lastActiveDays = daysSince("2026-07-18");
  const statistics = [
    { icon: Article, label: "文章", value: "16" },
    { icon: FolderSimple, label: "分类", value: String(categories.length) },
    { icon: Tag, label: "标签", value: "17" },
    { icon: HeartStraight, label: "最后活动", value: lastActiveDays === 0 ? "今天" : `${lastActiveDays} 天前` },
  ];

  return (
    <section className="card side-card site-stat-card">
      <h3>站点统计</h3>
      <dl>
        {statistics.map(({ icon: Icon, label, value }) => <div key={label}><dt><Icon size={21} weight="regular" aria-hidden="true" />{label}</dt><dd>{value}</dd></div>)}
      </dl>
    </section>
  );
}

export function SiteRightSidebar() {
  return (
    <aside className="right-sidebar">
      <div className="sidebar-sticky">
        <section className="card side-card whisper-card">
          <h3>心语</h3>
          <p>如同月下彼岸花，在这里，它承载着“我”存在的证明。</p>
        </section>
        <OnThisDayCard />
        <MusicPlayerCard />
      </div>
    </aside>
  );
}
