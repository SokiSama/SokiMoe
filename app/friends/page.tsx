"use client";

import { useState } from "react";
import { ArrowUp, CaretDown, Check, Copy, RssSimple } from "@phosphor-icons/react";
import { JournalHeader } from "../components/JournalHeader";
import { TwikooComments } from "../components/TwikooComments";
import { FriendList } from "./FriendList";
import friends from "../../data/friends.json";
import homeStyles from "../components/HomePage.module.css";
import styles from "./FriendsPage.module.css";

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
    <div className={`${homeStyles.home} ${styles.page}`} id="top">
      <JournalHeader active="friends" />
      <main className={styles.main}>
        <header data-reveal className={styles.intro}>
          <span>FRIENDS</span>
          <h1>友链</h1>
        </header>
        <FriendList friends={friends} />
        <section id="apply-links" className={styles.apply}>
          <details className={styles.applyPanel} open>
            <summary>
              <strong>想要交换友链？</strong>
              <span className={styles.applyActions}>
                <button
                  type="button"
                  className={styles.copyButton}
                  onClick={copyFriendLink}
                  aria-label="复制友链信息"
                >
                  {linkCopied ? <Check weight="bold" /> : <Copy weight="duotone" />}
                  <span>{linkCopied ? "已复制" : "复制"}</span>
                </button>
                <CaretDown className={styles.caret} aria-hidden="true" />
              </span>
            </summary>
            <div className={styles.applyBody}>
              <p>欢迎在下方留言申请，这是本站的信息：</p>
              <ul className={styles.siteInfo}>
                <li><strong>名称：</strong><span>Soki Sugar Life</span></li>
                <li><strong>描述：</strong><span>月下彼岸花</span></li>
                <li><strong>链接：</strong><a href="https://www.soki.moe" target="_blank" rel="noreferrer">https://www.soki.moe</a></li>
                <li><strong>图标：</strong><a href="https://cdn.jsdelivr.net/gh/SokiSama/picked@main/avatar.jpg" target="_blank" rel="noreferrer">https://cdn.jsdelivr.net/gh/SokiSama/picked@main/avatar.jpg</a></li>
              </ul>
              <div className={styles.requirements}>
                <h3>友链要求：</h3>
                <ul>
                  <li>尽量可在中国大陆正常访问。</li>
                  <li>允许使用 AI 辅助写作，但不能全盘接管。</li>
                  <li>文章数量 ≥ 5 篇，无商业化及广告内容。</li>
                  <li>域名非免费（纯托管）域名，且域名注册时间超过三个月。</li>
                </ul>
              </div>
            </div>
          </details>
        </section>
        <TwikooComments path="/friends" className={styles.comments} />
      </main>
      <footer className={homeStyles.footer}>
        <p>© 2025–{new Date().getFullYear()} Soki Sugar Life<span>·</span><a href="https://icp.gov.moe/?keyword=20263015" target="_blank" rel="noreferrer">萌ICP备20263015号</a></p>
        <a href="/api/rss"><RssSimple size={15} />RSS 订阅</a>
      </footer>
      <a className={styles.backTop} href="#top" aria-label="回到顶部"><ArrowUp size={20} /></a>
    </div>
  );
}
