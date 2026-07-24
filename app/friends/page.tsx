"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaretDown, Check, Copy } from "@phosphor-icons/react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { FriendList } from "./FriendList";
import { FriendCircleCard } from "./FriendCircleCard";
import { TrainJumpCard } from "./TrainJumpCard";
import friends from "../../data/friends.json";

const envId = "https://sweet-moonbeam-d0178d.netlify.app/.netlify/functions/twikoo";
const friendLinkText = `名称：
Soki Sugar Life
描述：
月下彼岸花
链接：
https://www.soki.moe/
图标：
https://cdn.jsdelivr.net/gh/SokiSama/picked@main/avatar.jpg`;

type Twikoo = {
  init: (options: { envId: string; el: HTMLElement; path: string; lang: string; onCommentLoaded?: () => void }) => Promise<void>;
};

export default function FriendsPage() {
  const commentsRef = useRef<HTMLDivElement>(null);
  const initializing = useRef(false);
  const initialized = useRef(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
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

  const initComments = useCallback(async (force = false) => {
    const element = commentsRef.current;
    const twikoo = (window as typeof window & { twikoo?: Twikoo }).twikoo;
    if (!element || !twikoo?.init || initializing.current || (initialized.current && !force)) return;
    initializing.current = true;
    setStatus("loading");
    if (force) { element.replaceChildren(); initialized.current = false; }
    try {
      await twikoo.init({ envId, el: element, path: "/friends", lang: "zh-CN", onCommentLoaded: () => setStatus("ready") });
      initialized.current = true;
      setStatus("ready");
    } catch { setStatus("error"); }
    finally { initializing.current = false; }
  }, []);

  useEffect(() => {
    if (!(window as typeof window & { twikoo?: Twikoo }).twikoo) return;
    const timer = window.setTimeout(() => {
      void initComments();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initComments]);

  return (
    <div className="site">
      <SiteHeader active="friends" />
      <main id="top" className="page-shell friends-page-shell">
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
        <section id="apply-links" className="site-link-section motion-rise">
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
                  <li>域名可在中国大陆正常访问</li>
                  <li>创作内容符合法律规定</li>
                  <li>贵站已添加友链信息</li>
                </ul>
              </div>
            </div>
          </details>
        </section>
        <section id="comments" className="comments-section motion-rise">
          <div className="section-title"><span /><h2>评论区</h2></div>
          <Script id="twikoo-script" src="https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.all.min.js" strategy="afterInteractive" onLoad={() => { void initComments(); }} onError={() => setStatus("error")} />
          {status === "loading" && <p className="comment-status">正在加载评论…</p>}
          {status === "error" && <div className="comment-error">评论区加载失败。<button type="button" onClick={() => void initComments(true)}>重新加载</button></div>}
          <div className="twikoo-host card"><div ref={commentsRef} id="twikoo-comments" /></div>
        </section>
        </div>
        <aside className="friends-profile-sidebar">
          <div className="friends-profile-sticky">
            <FriendCircleCard />
            <TrainJumpCard friends={friends} />
          </div>
        </aside>
      </main>
      <SiteFooter />
      <a className="back-top" href="#top" aria-label="回到顶部">↑</a>
    </div>
  );
}
