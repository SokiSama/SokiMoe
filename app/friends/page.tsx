"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Image as ImageIcon, LinkSimple, PencilSimple, UserCircle } from "@phosphor-icons/react";
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
  const [copied, setCopied] = useState(false);
  const [recentFriends, setRecentFriends] = useState<Friend[]>([]);
  const [recentStatus, setRecentStatus] = useState<"loading" | "ready" | "empty">("loading");

  const copyFriendInfo = useCallback(async () => {
    const text = [
      "名称：Soki Sugar Life",
      "描述：彼女の愛は、甘くて痛い",
      "链接：https://www.soki.moe",
      "头像：https://cdn.jsdelivr.net/gh/SokiSama/picked@main/avatar.jpg",
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }, []);

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
        <section className="comments-section motion-rise">
          <div className="section-title"><span /><h2>评论区</h2></div>
          <Script id="twikoo-script" src="https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.all.min.js" strategy="afterInteractive" onLoad={() => { void initComments(); void loadRecentFriends(); }} onError={() => setStatus("error")} />
          {status === "loading" && <p className="comment-status">正在加载评论…</p>}
          {status === "error" && <div className="comment-error">评论区加载失败。<button type="button" onClick={() => void initComments(true)}>重新加载</button></div>}
          <div className="twikoo-host card"><div ref={commentsRef} id="twikoo-comments" /></div>
        </section>
        </div>
        <aside className="right-sidebar friends-right-sidebar">
          <section className="friend-info friend-info--sidebar card">
            <div className="friend-info-header">
              <div className="friend-info-title"><LinkSimple aria-hidden="true" weight="bold" /><h3>我的友链</h3></div>
              <button className="copy-btn" type="button" onClick={copyFriendInfo}><Copy aria-hidden="true" weight="bold" />{copied ? "已复制" : "一键复制"}</button>
            </div>
            <div className="friend-info-body" aria-label="本站友链信息">
              <div className="friend-row"><span className="friend-label"><UserCircle aria-hidden="true" weight="duotone" />名称</span><strong className="friend-value">Soki Sugar Life</strong></div>
              <div className="friend-row"><span className="friend-label"><PencilSimple aria-hidden="true" weight="duotone" />描述</span><strong className="friend-value">彼女の愛は、甘くて痛い</strong></div>
              <div className="friend-row"><span className="friend-label"><LinkSimple aria-hidden="true" weight="duotone" />链接</span><strong className="friend-value">https://www.soki.moe</strong></div>
              <div className="friend-row"><span className="friend-label"><ImageIcon aria-hidden="true" weight="duotone" />头像</span><strong className="friend-value">https://cdn.jsdelivr.net/gh/SokiSama/picked@main/avatar.jpg</strong></div>
            </div>
          </section>
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
