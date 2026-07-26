"use client";

import { useState } from "react";
import { CaretDown, Check, Copy } from "@phosphor-icons/react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageCoverBanner } from "../components/PageCoverBanner";
import { TwikooComments } from "../components/TwikooComments";
import { FriendList } from "./FriendList";
import { FriendCircleCard } from "./FriendCircleCard";
import { TrainJumpCard } from "./TrainJumpCard";
import friends from "../../data/friends.json";

const friendLinkText = `名称：Soki Sugar Life
描述：月下彼岸花
链接：https://www.soki.moe/
图标：https://cdn.jsdelivr.net/gh/SokiSama/picked@main/avatar.jpg`;

export default function FriendsPage() {
  const [linkCopied, setLinkCopied] = useState(false);

  const copyFriendLink = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(friendLinkText);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = friendLinkText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 1600);
  };

  return (
    <div className="site immersive-route">
      <SiteHeader active="friends" floating />
      <PageCoverBanner
        eyebrow="FRIENDS CONNECT! RE:DIVE"
        title="相遇，是一场温柔的邂逅"
        description="记录那些值得访问的小站。"
        image="/friends-cover.jpg"
        imagePosition="center 62%"
      />
      <main id="top" className="page-shell friends-page-shell immersive-content">
        <div className="friends-main-grid">
        <div className="content friends-content">
        <section className="card friends-hero motion-rise">
          <div className="friends-hero-copy">
            <strong className="friends-eyebrow">Friends Connect! Re:Dive</strong>
            <h1>相遇，是一场温柔的邂逅</h1>
            <p>记录那些值得访问的小站</p>
          </div>
          <div className="friends-hero-art" aria-hidden="true"><img src="/friends-hero.png" alt="" /></div>
        </section>
        <FriendList friends={friends} />
        </div>
        <aside className="friends-profile-sidebar">
          <div className="friends-profile-sticky">
            <FriendCircleCard />
            <TrainJumpCard friends={friends} />
          </div>
        </aside>
        </div>
        <section id="apply-links" className="site-link-section friends-apply-wide motion-rise">
          <details className="site-link-panel card" open>
            <summary>
              <span className="terminal-window-title">
                <i className="terminal-dot terminal-dot--red" />
                <i className="terminal-dot terminal-dot--yellow" />
                <i className="terminal-dot terminal-dot--green" />
                <strong>友链申请</strong>
              </span>
              <span className="site-link-panel__actions">
                <button
                  type="button"
                  className="site-link-copy"
                  onClick={copyFriendLink}
                  aria-label="复制友链信息"
                >
                  {linkCopied ? <Check weight="bold" /> : <Copy weight="duotone" />}
                  <span>{linkCopied ? "已复制" : "复制"}</span>
                </button>
                <CaretDown className="site-link-panel__caret" aria-hidden="true" />
              </span>
            </summary>
            <div className="site-link-panel__body">
              <ul>
                <li><strong>名称：</strong><span>Soki Sugar Life</span></li>
                <li><strong>描述：</strong><span>月下彼岸花</span></li>
                <li><strong>链接：</strong><a href="https://www.soki.moe" target="_blank" rel="noreferrer">https://www.soki.moe</a></li>
                <li><strong>图标：</strong><a href="https://cdn.jsdelivr.net/gh/SokiSama/picked@main/avatar.jpg" target="_blank" rel="noreferrer">https://cdn.jsdelivr.net/gh/SokiSama/picked@main/avatar.jpg</a></li>
              </ul>
              <div className="site-link-requirements">
                <h3>友链要求：</h3>
                <ul>
                  <li>申请前请务必确保贵站有我站的友链，若后续检测到贵站移除本站链接，本站也将相应移除。</li>
                  <li>本站基于主观审美偏好，优先结交 UI 风格简洁现代、调性相近的个人小站。</li>
                  <li>拒绝排版混乱、自动播放音频、特效过载或阻塞加载等严重影响浏览体验的站点。</li>
                  <li>若站点长时间无法访问，我会删除您的友链，恢复后可再次申请。</li>
                  <li>确保站点无政治敏感/违法内容，无明显广告，无恶意脚本。</li>
                  <li>确保站点全局启用 HTTPS，中国大陆可以正常访问。</li>
                  <li>暂时不接受商业及非个人的网站的友链申请。</li>
                </ul>
              </div>
            </div>
          </details>
        </section>
        <TwikooComments path="/friends" className="friends-comments-wide" />
      </main>
      <SiteFooter />
      <a className="back-top" href="#top" aria-label="回到顶部">↑</a>
    </div>
  );
}
