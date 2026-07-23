"use client";

import { useEffect, useState } from "react";
import { List, Moon, RssSimple, Sun } from "@phosphor-icons/react";
import { PrimaryNav } from "./PrimaryNav";

type ThemeMode = "system" | "dark" | "light";
type Theme = "dark" | "light";

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
  const [mode, setMode] = useState<ThemeMode>("system");
  const [theme, setTheme] = useState<Theme>("light");
  const [scrolled, setScrolled] = useState(false);

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
          <button className="header-action" onClick={() => chooseTheme(theme === "dark" ? "light" : "dark")} aria-pressed={theme === "dark"} aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"} title={theme === "dark" ? "浅色模式" : "深色模式"}>{theme === "dark" ? <Sun weight="bold" /> : <Moon weight="bold" />}</button>
        </div>
      </div></header>
    </>
  );
}
