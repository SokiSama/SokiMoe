"use client";

import type { ReactNode } from "react";
import {
  Briefcase,
  Code,
  DeviceMobile,
  DeviceTablet,
  Desktop,
  GameController,
  Headphones,
  Translate,
  TwitterLogo,
  Watch,
} from "@phosphor-icons/react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { MusicPlayerCard } from "./MusicPlayerCard";
import { HomeOnThisDay } from "./HomeOnThisDay";
import { GitHubContributionsCard } from "./GitHubContributionsCard";
import { CyberWorldCard } from "./CyberWorldCard";

const skills = [
  { icon: Code, title: "AI Coding", text: "本网站基于 Codex 开发" },
  { icon: Code, title: "Next.js & React", text: "所用到的技术栈" },
  { icon: Desktop, title: "PC Gaming", text: "9800X3D 是对的" },
  { icon: GameController, title: "Controller Gaming", text: "抱起手柄，南条一摊" },
  { icon: Briefcase, title: "QA Engineer", text: "混口饭吃，随时被取代" },
  { icon: Translate, title: "zh-CN & en-US", text: <em>日本語を勉強します</em> },
];

const devices = [
  { icon: DeviceTablet, name: "iPad Pro 2024", text: "双层 OLED 就是爽" },
  { icon: DeviceMobile, name: "iPhone 17 Pro", text: "一手掌握，港版还有 eSIM 爽用" },
  { icon: Headphones, name: "AirPods Pro 2", text: "老搭档了，通勤与出门需要音乐陪伴" },
  { icon: DeviceMobile, name: "Samsung S25 Ultra", text: "双持代表着，工作与生活要区分开" },
  { icon: Watch, name: "Apple Watch S10", text: "看时间和记录数据" },
  { icon: GameController, name: "不计其数的洋垃圾…", text: "折腾本身就是乐趣" },
];

export function HomePageClient({ animeCard }: { animeCard: ReactNode }) {
  return (
    <div className="site home-site">
      <SiteHeader active="home" floating />

      <section id="top" className="home-cover-stage" aria-label="Soki Sugar Life 首页封面">
        <div className="home-cover-vignette" aria-hidden="true" />
        <div className="home-profile-panel card">
          <section className="home-profile-intro" aria-labelledby="home-profile-name">
            <div className="home-profile-avatar-frame">
              <img className="home-profile-avatar" src="/profile-avatar.webp" alt="Soki 的头像" />
            </div>
            <h1 id="home-profile-name">Soki</h1>
            <div className="home-profile-copy">
              <p>测试工程师，自研 Vibe Coding 中。</p>
              <p>在重庆当社畜。</p>
              <p>喜欢 ACG、旅行与虚拟世界。</p>
              <p>欢迎交换友链。</p>
            </div>
            <div className="home-profile-socials" aria-label="个人主页链接">
              <a href="https://github.com/SokiSama" target="_blank" rel="noreferrer" title="GitHub" aria-label="GitHub"><img src="/icons/github.svg" alt="" /></a>
              <a href="https://steamcommunity.com/id/SokiSama/" target="_blank" rel="noreferrer" title="Steam" aria-label="Steam"><img src="/icons/steam.svg" alt="" /></a>
              <a href="https://t.me/MatsuzaSatou" target="_blank" rel="noreferrer" title="Telegram" aria-label="Telegram"><img src="/icons/telegram.svg" alt="" /></a>
              <a href="https://x.com/soki_ruby" target="_blank" rel="noreferrer" title="Twitter" aria-label="Twitter"><TwitterLogo weight="fill" aria-hidden="true" /></a>
              <a href="mailto:mashiroamane@outlook.com" title="发送邮件" aria-label="发送邮件"><img src="/icons/email.svg" alt="" /></a>
            </div>
          </section>
          <GitHubContributionsCard />
        </div>
      </section>

      <div className="page-shell home-page-shell home-reimagined-shell">

        <main id="profile" className="content home-feed home-about-sections">
          <HomeOnThisDay />

          <section className="card about-section about-inline-section">
            <header className="about-section-heading">
              <div><h2>技能</h2><p>技能树总会点在一些适合自己的地方</p></div>
            </header>
            <div className="about-skill-grid">
              {skills.map(({ icon: Icon, title, text }) => (
                <article key={title}><Icon size={30} weight="regular" /><div><h3>{title}</h3><p>{text}</p></div></article>
              ))}
            </div>
          </section>

          <section className="card about-section about-inline-section">
            <header className="about-section-heading">
              <div><h2>设备</h2><p>我真的不会再乱换设备了.jpg</p></div>
            </header>
            <div className="about-device-grid">
              {devices.map(({ icon: Icon, name, text }) => (
                <article key={name}><Icon size={30} weight="regular" /><div><h3>{name}</h3><p>{text}</p></div></article>
              ))}
            </div>
          </section>

          {animeCard}
          <MusicPlayerCard variant="home" />
          <CyberWorldCard />
        </main>

      </div>

      <SiteFooter />
      <a className="back-top" href="#top" aria-label="回到顶部">↑</a>

    </div>
  );
}
