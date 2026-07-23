"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaretDown, PencilSimple } from "@phosphor-icons/react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { FriendList } from "./FriendList";
import type { Friend } from "./FriendCard";
import friends from "../../data/friends.json";

const envId = "https://sweet-moonbeam-d0178d.netlify.app/.netlify/functions/twikoo";

type RecentComment = { nick?: string; link?: string; commentText?: string; url?: string };
type Twikoo = {
  init: (options: { envId: string; el: HTMLElement; path: string; lang: string; onCommentLoaded?: () => void }) => Promise<void>;
  getRecentComments?: (options: { envId: string; urls?: string[]; pageSize?: number; includeReply?: boolean }) => Promise<RecentComment[]>;
};

function recentFriendsFromComments(comments: RecentComment[], allFriends: Friend[]) {
  const matched: Friend[] = [];
  for (const comment of comments) {
    const source = `${comment.nick ?? ""} ${comment.link ?? ""} ${comment.commentText ?? ""}`.toLocaleLowerCase();
    const friend = allFriends.find((item) => {
      const host = (() => { try { return new URL(item.url).hostname.replace(/^www\./, ""); } catch { return item.url; } })().toLocaleLowerCase();
      return source.includes(host) || source.includes(item.title.toLocaleLowerCase());
    });
    if (friend && !matched.some((item) => item.url === friend.url)) matched.push(friend);
    if (matched.length === 3) break;
  }
  return matched;
}

export default function FriendsPage() {
  const commentsRef = useRef<HTMLDivElement>(null);
  const initializing = useRef(false);
  const initialized = useRef(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [recentFriends, setRecentFriends] = useState<Friend[]>([]);
  const [recentStatus, setRecentStatus] = useState<"loading" | "ready" | "empty">("loading");

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

  const loadRecentFriends = useCallback(async () => {
    const twikoo = (window as typeof window & { twikoo?: Twikoo }).twikoo;
    if (!twikoo?.getRecentComments) return;
    try {
      const comments = await twikoo.getRecentComments({ envId, urls: ["/friends", "/friends/"], pageSize: 100, includeReply: false });
      const matched = recentFriendsFromComments(comments, friends as Friend[]);
      setRecentFriends(matched);
      setRecentStatus(matched.length ? "ready" : "empty");
    } catch {
      setRecentStatus("empty");
    }
  }, []);

  useEffect(() => {
    if (!(window as typeof window & { twikoo?: Twikoo }).twikoo) return;
    const timer = window.setTimeout(() => {
      void initComments();
      void loadRecentFriends();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initComments, loadRecentFriends]);

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
        <section className="site-link-section motion-rise">
          <details className="site-link-panel card" open>
            <summary><span><PencilSimple aria-hidden="true" weight="bold" />本站信息</span><CaretDown aria-hidden="true" /></summary>
            <div className="site-link-panel__body">
              <ul>
                <li><strong>名称：</strong><span>Soki Sugar Life</span></li>
                <li><strong>描述：</strong><span>彼女の愛は、甘くて痛い</span></li>
                <li><strong>链接：</strong><a href="https://www.soki.moe" target="_blank" rel="noreferrer">https://www.soki.moe</a></li>
                <li><strong>图标：</strong><a href="https://cdn.jsdelivr.net/gh/SokiSama/picked@main/avatar.jpg" target="_blank" rel="noreferrer">https://cdn.jsdelivr.net/gh/SokiSama/picked@main/avatar.jpg</a></li>
              </ul>
            </div>
          </details>
        </section>
        <section className="comments-section motion-rise">
          <div className="section-title"><span /><h2>评论区</h2></div>
          <Script id="twikoo-script" src="https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.all.min.js" strategy="afterInteractive" onLoad={() => { void initComments(); void loadRecentFriends(); }} onError={() => setStatus("error")} />
          {status === "loading" && <p className="comment-status">正在加载评论…</p>}
          {status === "error" && <div className="comment-error">评论区加载失败。<button type="button" onClick={() => void initComments(true)}>重新加载</button></div>}
          <div className="twikoo-host card"><div ref={commentsRef} id="twikoo-comments" /></div>
        </section>
        </div>
        <aside className="right-sidebar friends-right-sidebar">
          <section className="card side-card friend-latest-card">
            <h3>最近收录</h3>
            {recentStatus === "loading" && <p className="recent-note">正在读取最新评论…</p>}
            {recentStatus === "empty" && <p className="recent-note">最新评论中暂无可匹配的已收录友链。</p>}
            {recentFriends.map((friend) => <a href={friend.url} target="_blank" rel="noreferrer" key={friend.url}><img src={friend.avatar} alt="" referrerPolicy="no-referrer" loading="lazy" decoding="async" /><span><b>{friend.title}</b></span></a>)}
          </section>
        </aside>
      </main>
      <SiteFooter />
      <a className="back-top" href="#top" aria-label="回到顶部">↑</a>
    </div>
  );
}
