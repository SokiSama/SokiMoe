"use client";

import { useEffect, useMemo, useState } from "react";
import { List, MagnifyingGlass, Moon, RssSimple, Sun } from "@phosphor-icons/react";
import { PrimaryNav } from "./PrimaryNav";
import { localPosts } from "../data/posts";

type ThemeMode = "system" | "dark" | "light";
type Theme = "dark" | "light";

const searchEntries = [
  { type: "页面", title: "首页", text: "文章 设计 日常观察", href: "/" },
  { type: "页面", title: "归档", text: "全部文章 时间线", href: "/archive" },
  { type: "页面", title: "友链", text: "朋友 交换友链 评论区", href: "/friends" },
  { type: "页面", title: "碎念", text: "时间线 短文字 图片", href: "/thoughts" },
  { type: "页面", title: "动漫", text: "Bangumi 追番 在看 想看 看过", href: "/acg" },
  { type: "页面", title: "关于我", text: "Soki 个人信息", href: "/about" },
  { type: "文章", title: "把零散灵感，整理成一间长期营业的数字花园", text: "设计 独立开发", href: "/#posts" },
  { type: "文章", title: "为小型站点设计一套轻量、清晰的内容结构", text: "前端 架构", href: "/#posts" },
  { type: "文章", title: "七月散步：在雨停之后收集城市的颜色", text: "随笔 摄影", href: "/#posts" },
  { type: "文章", title: "最近常用的五个安静工具", text: "工具 效率", href: "/#posts" },
  { type: "游记", title: "马来西亚游记", text: "旅行 马来西亚 吉隆坡", href: "/posts/kl" },
  { type: "游记", title: "两个二次元的成都一日特种兵旅游", text: "旅行 成都", href: "/posts/chengdu" },
  { type: "游记", title: "结束乐队香港澳门游记", text: "旅行 香港 澳门 广州", href: "/posts/hkmacou" },
  ...localPosts
    .filter((post) => post.type === "tech")
    .map((post) => ({ type: "文章", title: post.title, text: `${post.description} ${post.tags.join(" ")}`, href: `/posts/${post.slug}` })),
];

function resolveTheme(mode: ThemeMode): Theme {
  if (mode === "dark" || mode === "light") return mode;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setDocumentTheme(theme: Theme, animate: boolean) {
  const root = document.documentElement;
  if (animate) root.classList.add("theme-changing");
  root.dataset.theme = theme;
  if (animate) window.setTimeout(() => root.classList.remove("theme-changing"), 360);
}

export function SiteHeader({ active, onOpenMenu }: { active?: string; onOpenMenu?: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<ThemeMode>("system");
  const [theme, setTheme] = useState<Theme>("light");
  const [scrolled, setScrolled] = useState(false);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return searchEntries;
    return searchEntries.filter((entry) => `${entry.title} ${entry.text}`.toLowerCase().includes(value));
  }, [query]);

  useEffect(() => {
    const storedMode = localStorage.getItem("soki-theme-mode") as ThemeMode | null;
    if (storedMode === "system" || storedMode === "dark" || storedMode === "light") setMode(storedMode);
    localStorage.removeItem("soki-theme-location");
  }, []);

  useEffect(() => {
    const apply = () => {
      const nextTheme = resolveTheme(mode);
      setTheme(nextTheme);
      setDocumentTheme(nextTheme, false);
    };
    apply();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [mode]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);

  const chooseTheme = (nextMode: ThemeMode) => {
    setMode(nextMode);
    localStorage.setItem("soki-theme-mode", nextMode);
    const nextTheme = resolveTheme(nextMode);
    setTheme(nextTheme);
    setDocumentTheme(nextTheme, true);
  };

  return (
    <>
      <header
        className={`site-header topbar${scrolled ? " scrolled" : ""}${
          onOpenMenu ? " has-mobile-menu" : ""
        }`}
      ><div className="header-inner topbar-inner">
        {onOpenMenu && <button className="round-button menu-button" onClick={onOpenMenu} aria-label="打开菜单"><List weight="regular" /></button>}
        <a className="site-brand brand" href="/">
          <span className="brand-avatar" aria-hidden="true"><img src="/about-avatar.png" alt="" /></span>
          <span className="brand-text">Soki Sugar Life</span>
        </a>
        <PrimaryNav active={active} className="main-nav primary-nav" />
        <div className="header-actions top-actions">
          <a className="header-action rss-action" href="https://www.soki.moe/api/rss" target="_blank" rel="noreferrer" aria-label="RSS 订阅" title="RSS 订阅"><RssSimple weight="bold" /></a>
          <button className="header-action" onClick={() => setSearchOpen(true)} aria-label="搜索网站内容" title="搜索"><MagnifyingGlass weight="bold" /></button>
          <button className="header-action" onClick={() => chooseTheme(theme === "dark" ? "light" : "dark")} aria-pressed={theme === "dark"} aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"} title={theme === "dark" ? "浅色模式" : "深色模式"}>{theme === "dark" ? <Sun weight="bold" /> : <Moon weight="bold" />}</button>
        </div>
      </div></header>

      {searchOpen && <div className="search-overlay" role="dialog" aria-modal="true" aria-label="站内搜索">
        <button className="search-close" onClick={() => { setSearchOpen(false); setQuery(""); }} aria-label="关闭搜索">×</button>
        <div className="search-panel"><label htmlFor="site-search">搜索网站内容</label>
          <input id="site-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入标题、标签或关键词…" />
          <div className="search-results">{results.length ? results.map((entry) => <a href={entry.href} key={`${entry.type}-${entry.title}`}><span>{entry.type}</span>{entry.title}</a>) : <p>没有找到相关内容</p>}</div>
        </div>
      </div>}
    </>
  );
}
