"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { ThemeModeControl } from "./ThemeModeControl";
import homeStyles from "./HomePage.module.css";

export function JournalHeader({ active = "posts" }: { active?: "posts" | "archive" | "friends" | "collection" | "about" | "serendipity" }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  const navigation = [
    { label: "首页", href: "/" }, { label: "拾光", href: "/serendipity" }, { label: "品鉴", href: "/collection" },
    { label: "友链", href: "/friends" }, { label: "归档", href: "/archive" }, { label: "关于", href: "/about" },
  ];
  return (
    <header className={homeStyles.header}>
      <div className={homeStyles.headerInner}>
        <Link className={homeStyles.brand} href="/"><Image src="/profile-avatar.webp" width={32} height={32} alt="" /><span>Soki Sugar Life</span></Link>
        <nav className={`${homeStyles.navigation} ${menuOpen ? homeStyles.navigationOpen : ""}`} id="journal-navigation" aria-label="主导航">
          {navigation.map(({ label, href }) => <Link href={href} key={href} aria-current={href === `/${active}` ? "location" : undefined} onClick={() => setMenuOpen(false)}>{label}</Link>)}
        </nav>
        <div className={homeStyles.headerActions}>
          <ThemeModeControl />
          <button className={`${homeStyles.iconButton} ${homeStyles.menuButton}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "关闭菜单" : "打开菜单"} aria-expanded={menuOpen} aria-controls="journal-navigation">{menuOpen ? <X size={23} /> : <List size={23} />}</button>
        </div>
      </div>
    </header>
  );
}
