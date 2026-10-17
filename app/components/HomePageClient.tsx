"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, ArrowUp, CalendarBlank, CaretLeft, CaretRight,
  EnvelopeSimple, Folder, GithubLogo,
  List, MapPin, RssSimple, TwitterLogo, X,
} from "@phosphor-icons/react";
import type { LocalPost } from "../data/posts";
import { ThemeModeControl } from "./ThemeModeControl";
import styles from "./HomePage.module.css";

export type HomePost = LocalPost & { wordCount: number | null; readingMinutes: number | null };

const socialLinks = [
  { icon: GithubLogo, weight: "fill", name: "GitHub", href: "https://github.com/SokiSama" },
  { icon: TwitterLogo, weight: "fill", name: "Twitter", href: "https://x.com/soki_ruby" },
  { icon: EnvelopeSimple, weight: "bold", name: "邮件", href: "mailto:mashiroamane@outlook.com" },
  { icon: RssSimple, weight: "bold", name: "RSS 订阅", href: "/api/rss" },
] as const;
const navigation = [
  { label: "首页", href: "/" }, { label: "拾光", href: "/serendipity" }, { label: "品鉴", href: "/collection" },
  { label: "友链", href: "/friends" }, { label: "归档", href: "/archive" },
  { label: "关于", href: "/about" },
];
const pageSize = 6;
const getCategory = (post: LocalPost) => post.category || (post.type === "travel" ? "旅行" : post.tags[0] || "技术");

export function HomePageClient({ posts }: { posts: HomePost[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const hero = useRef<HTMLElement>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { rootMargin: "-80px 0px 0px 0px" });
    if (hero.current) observer.observe(hero.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeMenu);
    return () => {
      window.removeEventListener("keydown", closeMenu);
    };
  }, []);

  const sortedPosts = useMemo(() => [...posts].sort((a, b) => {
    if (a.slug === "start") return -1;
    if (b.slug === "start") return 1;
    return b.date.localeCompare(a.date);
  }), [posts]);
  const pageCount = Math.max(1, Math.ceil(sortedPosts.length / pageSize));
  const pagePosts = sortedPosts.slice((page - 1) * pageSize, page * pageSize);
  const changePage = (next: number) => {
    setPage(next);
    document.getElementById("home-feed")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`${styles.home} ${styles.homePage}`} id="top">
      <header className={`${styles.header} ${heroVisible ? styles.heroHeader : ""}`}>
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

      <section ref={hero} className={styles.hero} aria-labelledby="home-hero-title">
        <div className={styles.heroContent} data-reveal>
          <h1 className={styles.heroTitle} id="home-hero-title" aria-label="Hear…Feel…Think…"><span aria-hidden="true">Hear…Feel…Think…</span></h1>
          <p className={styles.heroSignature}>ACG · 旅行 · 虚拟世界</p>
          <div className={styles.heroActions}>
            <a className={styles.heroPrimary} href="#home-articles">浏览文章 <ArrowRight size={18} aria-hidden="true" /></a>
            <Link className={styles.heroSecondary} href="/about">关于我</Link>
          </div>
        </div>
        <span className={styles.heroRule} aria-hidden="true" />
      </section>

      <main className={styles.main} id="home-articles">
        <section className={styles.profile} aria-label="个人资料" data-reveal>
          <Image className={styles.avatar} src="/profile-avatar.webp" width={104} height={104} alt="Soki 的头像" priority />
          <h2 className={styles.profileName}>Soki</h2>
          <p className={styles.profileMotto}>月下彼岸花</p>
          <div className={styles.socials} id="home-socials" aria-label="个人主页链接">
            {socialLinks.map(({ icon: Icon, weight, name, href }) => <a key={name} className={styles.socialLink} href={href} aria-label={name} title={name} target={href.startsWith("https:") ? "_blank" : undefined} rel={href.startsWith("https:") ? "noreferrer" : undefined}>
              <Icon size={24} weight={weight} aria-hidden="true" />
            </a>)}
          </div>
          <div className={styles.profileStatus}><MapPin size={15} aria-hidden="true" /><span>柔风海湾 * 九号解决方案</span></div>
          <p className={styles.profileQuote} lang="ja">この部屋だけは<br />自分になれる</p>
        </section>

        <section className={styles.feed} id="home-feed" aria-label="文章列表">
          <div className={styles.postList} data-reveal-group>
            {pagePosts.map(post => {
              return (
                <article className={styles.postCard} key={post.slug}>
                  <Link className={styles.postLink} href={`/posts/${post.slug}`}>
                    <div className={styles.postText}>
                      <h2>{post.title}</h2>
                      <div className={styles.postMeta}>
                        <span><CalendarBlank size={15} aria-hidden="true" /><time dateTime={post.date}>{post.date}</time></span>
                        <span><Folder size={15} aria-hidden="true" />{getCategory(post)}</span>
                      </div>
                      <p className={styles.description}>{post.description}</p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
          {pageCount > 1 && <nav className={styles.pagination} aria-label="首页文章分页"><button className={styles.paginationDirection} onClick={() => changePage(page - 1)} disabled={page === 1}><CaretLeft size={17} aria-hidden="true" />上一页</button>{Array.from({ length: pageCount }, (_, index) => index + 1).map(number => <button className={page === number ? styles.currentPage : ""} aria-current={page === number ? "page" : undefined} aria-label={`第 ${number} 页`} key={number} onClick={() => changePage(number)}>{number}</button>)}<button className={styles.paginationDirection} onClick={() => changePage(page + 1)} disabled={page === pageCount}>下一页<CaretRight size={17} aria-hidden="true" /></button></nav>}
        </section>
      </main>

      <footer className={styles.footer}><p>© 2025–{new Date().getFullYear()} Soki Sugar Life<span>·</span><a href="https://icp.gov.moe/?keyword=20263015" target="_blank" rel="noreferrer">萌ICP备20263015号</a></p><a href="/api/rss"><RssSimple size={15} />RSS 订阅</a></footer>
      <a className={styles.backTop} href="#top" aria-label="回到顶部"><ArrowUp size={18} /></a>
    </div>
  );
}
