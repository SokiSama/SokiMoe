"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, ArrowUp, CalendarBlank, CaretLeft, CaretRight,
  EnvelopeSimple, Folder, GithubLogo, Hash,
  List, MagnifyingGlass, MapPin, RssSimple, SteamLogo,
  TelegramLogo, TwitterLogo, X,
} from "@phosphor-icons/react";
import type { LocalPost } from "../data/posts";
import { coverAccent, type CoverAccent } from "../lib/coverAccent";
import { ThemeModeControl } from "./ThemeModeControl";
import styles from "./HomePage.module.css";

export type HomePost = LocalPost & { wordCount: number | null; readingMinutes: number | null };

const socials = [
  { icon: TwitterLogo, name: "X / Twitter", href: "https://x.com/soki_ruby" },
  { icon: TelegramLogo, name: "Telegram", href: "https://t.me/MatsuzaSatou" },
  { icon: SteamLogo, name: "Steam", href: "https://steamcommunity.com/id/SokiSama/" },
  { icon: GithubLogo, name: "GitHub", href: "https://github.com/SokiSama" },
  { icon: EnvelopeSimple, name: "Email", href: "mailto:mashiroamane@outlook.com" },
] as const;
const socialLinks = socials.map(social => {
  const url = new URL(social.href);
  const username = url.protocol === "mailto:" ? url.pathname : `@${url.pathname.split("/").filter(Boolean).at(-1)}`;
  return { ...social, username };
});
const navigation = [
  { label: "首页", href: "/" }, { label: "拾光", href: "/serendipity" }, { label: "品鉴", href: "/collection" },
  { label: "友链", href: "/friends" }, { label: "归档", href: "/archive" },
  { label: "关于", href: "/about" },
];
const pageSize = 6;
const getCategory = (post: LocalPost) => post.category || (post.type === "travel" ? "旅行" : post.tags[0] || "技术");

export function HomePageClient({ posts }: { posts: HomePost[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [allCategories, setAllCategories] = useState(false);
  const [allTags, setAllTags] = useState(false);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [coverAccents, setCoverAccents] = useState<Record<string, CoverAccent>>({});

  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeMenu);
    return () => {
      window.removeEventListener("keydown", closeMenu);
    };
  }, []);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach(post => counts.set(getCategory(post), (counts.get(getCategory(post)) || 0) + 1));
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"));
  }, [posts]);
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach(post => [...new Set(post.tags)].forEach(value => counts.set(value, (counts.get(value) || 0) + 1)));
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"));
  }, [posts]);
  const filteredPosts = useMemo(() => {
    return posts.filter(post => (!category || getCategory(post) === category)
      && (!tag || post.tags.includes(tag)))
      .sort((a, b) => {
        if (!category && !tag) {
          if (a.slug === "start") return -1;
          if (b.slug === "start") return 1;
        }
        return b.date.localeCompare(a.date);
      });
  }, [posts, category, tag]);
  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const pagePosts = filteredPosts.slice((page - 1) * pageSize, page * pageSize);
  const hasFilter = Boolean(category || tag);
  const resetFilters = () => { setCategory(""); setTag(""); setPage(1); };
  const changePage = (next: number) => {
    setPage(next);
    document.getElementById("home-feed")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.home} id="top">
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/" aria-current="page">
            <Image src="/profile-avatar.webp" width={32} height={32} alt="" />
            <span>Soki Sugar Life</span>
          </Link>
          <nav className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`} id="home-navigation" aria-label="主导航">
            {navigation.map(({ label, href }) => <Link href={href} key={href} aria-current={href === "/" ? "page" : undefined} onClick={() => setMenuOpen(false)}>{label}</Link>)}
          </nav>
          <div className={styles.headerActions}>
            <ThemeModeControl />
            <button className={`${styles.iconButton} ${styles.menuButton}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "关闭菜单" : "打开菜单"} aria-expanded={menuOpen} aria-controls="home-navigation">{menuOpen ? <X size={23} /> : <List size={23} />}</button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <aside className={styles.sidebar} aria-label="个人资料与文章筛选">
          <section className={`${styles.panel} ${styles.profile}`} aria-labelledby="home-name">
            <Image className={styles.avatar} src="/profile-avatar.webp" width={100} height={100} alt="Soki 的头像" priority />
            <h1 id="home-name">Soki</h1>
            <span className={styles.profileLine} aria-hidden="true" />
            <p>在重庆当社畜。<br />喜欢 ACG、旅行与虚拟世界。</p>
            <div className={styles.socials} id="home-socials" aria-label="个人主页链接">
              {socialLinks.map(({ icon: Icon, name, href, username }) => <a key={name} className={styles.socialLink} href={href} aria-label={`${name}：${username}`} title={`${name}：${username}`} target={href.startsWith("https:") ? "_blank" : undefined} rel={href.startsWith("https:") ? "noreferrer" : undefined}>
                <Icon size={22} weight="regular" aria-hidden="true" />
              </a>)}
            </div>
            <div className={styles.profileStatus}><MapPin size={17} aria-hidden="true" /><span>柔风海湾　九号解决方案</span></div>
          </section>

          <section className={`${styles.panel} ${styles.sideSection}`} aria-labelledby="home-categories">
            <h2 id="home-categories">分类</h2>
            <div className={styles.categoryList}>
              <button className={!category && !tag ? styles.selectedCategory : ""} onClick={resetFilters} aria-pressed={!category && !tag}>全部<span>{posts.length}</span></button>
              {(allCategories ? categories : categories.slice(0, 2)).map(([name, count]) => <button className={category === name ? styles.selectedCategory : ""} key={name} onClick={() => { setCategory(category === name ? "" : name); setTag(""); setPage(1); }} aria-pressed={category === name}>{name}<span>{count}</span></button>)}
            </div>
            {categories.length > 2 && <button className={styles.moreButton} onClick={() => setAllCategories(!allCategories)} aria-expanded={allCategories}><span aria-hidden="true">···</span>{allCategories ? "收起" : "更多"}</button>}
          </section>

          <section className={`${styles.panel} ${styles.sideSection}`} aria-labelledby="home-tags">
            <h2 id="home-tags">标签</h2>
            <div className={styles.tagCloud}>
              {(allTags ? tags : tags.slice(0, 12)).map(([name, count]) => <button className={tag === name ? styles.selectedTag : ""} key={name} onClick={() => { setTag(tag === name ? "" : name); setPage(1); }} aria-pressed={tag === name} title={`${count} 篇文章`}>{name}</button>)}
            </div>
            {tags.length > 12 && <button className={styles.moreButton} onClick={() => setAllTags(!allTags)} aria-expanded={allTags}>{allTags ? "收起" : "更多标签"}</button>}
          </section>

        </aside>

        <section className={styles.feed} id="home-feed" aria-label="文章列表">
          {hasFilter && <div className={styles.filterStatus} role="status"><span>{category || "全部文章"}{tag ? ` / ${tag}` : ""}<small>共 {filteredPosts.length} 篇</small></span><button onClick={resetFilters}>清除筛选<X size={14} /></button></div>}
          <div className={styles.postList}>
            {pagePosts.map(post => {
              return (
                <article className={styles.postCard} key={post.slug} style={coverAccents[post.slug] ? { "--post-hue": coverAccents[post.slug].hue, "--post-saturation": `${coverAccents[post.slug].saturation}%` } as CSSProperties : undefined}>
                  <Link className={styles.postLink} href={`/posts/${post.slug}`}>
                    <div className={styles.postCover} aria-hidden="true"><Image src={post.cover || "/home-cover.webp"} alt="" fill sizes="(max-width: 680px) 70vw, (max-width: 1180px) 45vw, 570px" onLoad={event => { const accent = coverAccent(event.currentTarget); if (accent) setCoverAccents(previous => ({ ...previous, [post.slug]: accent })); }} /></div>
                    <div className={styles.postText}>
                      <h2>{post.title}</h2>
                      <div className={styles.postMeta}>
                        <span><CalendarBlank size={15} aria-hidden="true" /><time dateTime={post.date}>{post.date}</time></span>
                        <span><Folder size={15} aria-hidden="true" />{getCategory(post)}</span>
                        <span><Hash size={15} aria-hidden="true" />{post.tags[0] || "未标签"}</span>
                      </div>
                      <p className={styles.description}>{post.description}</p>
                      {post.wordCount !== null && <div className={styles.reading}><span>{post.wordCount} 字</span><i aria-hidden="true" /><span>{post.readingMinutes} 分钟</span></div>}
                    </div>
                    <span className={styles.postArrow} aria-hidden="true"><CaretRight className={styles.defaultArrow} /><ArrowRight className={styles.hoverArrow} /></span>
                  </Link>
                </article>
              );
            })}
          </div>
          {!pagePosts.length && <div className={`${styles.panel} ${styles.empty}`}><MagnifyingGlass size={32} /><h2>没有找到相关文章</h2><p>调整分类和标签，或清除筛选条件。</p><button onClick={resetFilters}>查看全部文章</button></div>}
          {pageCount > 1 && <nav className={styles.pagination} aria-label="首页文章分页"><button onClick={() => changePage(page - 1)} disabled={page === 1} aria-label="上一页"><CaretLeft size={16} /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map(number => <button className={page === number ? styles.currentPage : ""} aria-current={page === number ? "page" : undefined} key={number} onClick={() => changePage(number)}>{number}</button>)}<button onClick={() => changePage(page + 1)} disabled={page === pageCount} aria-label="下一页"><CaretRight size={16} /></button></nav>}
        </section>
      </main>

      <footer className={styles.footer}><p>© 2025–{new Date().getFullYear()} Soki Sugar Life<span>·</span><a href="https://icp.gov.moe/?keyword=20263015" target="_blank" rel="noreferrer">萌ICP备20263015号</a></p><a href="/api/rss"><RssSimple size={15} />RSS 订阅</a></footer>
      <a className={styles.backTop} href="#top" aria-label="回到顶部"><ArrowUp size={18} /></a>
    </div>
  );
}
