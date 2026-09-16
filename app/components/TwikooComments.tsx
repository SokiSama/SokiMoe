"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const envId = "https://sweet-moonbeam-d0178d.netlify.app/.netlify/functions/twikoo";

type Twikoo = {
  init: (options: {
    envId: string;
    el: HTMLElement;
    path: string;
    lang: string;
    onCommentLoaded?: () => void;
  }) => Promise<void>;
};

type TwikooCommentsProps = {
  path: string;
  className?: string;
};

const hiddenCommentNotice = "由于违反相关法规，该则留言不予显示";
const hiddenCommentIds = new Set([
  "4d49911db58340cc9b90d6face00fc9a",
  "48e2a54cb83d40e0b432394c2d135d8b",
]);

function redactHiddenComments(element: HTMLElement) {
  element.querySelectorAll<HTMLElement>(".tk-comment").forEach((comment) => {
    const content = comment.querySelector<HTMLElement>(".tk-content");
    if (!hiddenCommentIds.has(comment.id) || !content) return;

    if (content.textContent !== hiddenCommentNotice || content.childElementCount > 0) {
      content.replaceChildren(document.createTextNode(hiddenCommentNotice));
    }
    content.classList.add("comment-redacted");
    comment.querySelectorAll<HTMLElement>("a.tk-nick, .tk-nick a, a.tk-avatar, .tk-avatar a, .tk-avatar.tk-clickable").forEach((link) => {
      const label = document.createElement("span");
      label.className = link.className;
      label.classList.remove("tk-clickable", "tk-nick-link");
      label.append(...link.childNodes);
      link.replaceWith(label);
    });
    comment.querySelector<HTMLElement>(".tk-extras")?.remove();
    comment.querySelector<HTMLElement>(".tk-action")?.remove();
  });
}

export function TwikooComments({ path, className = "" }: TwikooCommentsProps) {
  const commentsRef = useRef<HTMLDivElement>(null);
  const initializing = useRef(false);
  const initialized = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  const initComments = useCallback(async (force = false) => {
    const host = commentsRef.current;
    const twikoo = (window as typeof window & { twikoo?: Twikoo }).twikoo;
    if (!host || !twikoo?.init || initializing.current || (initialized.current && !force)) return;

    initializing.current = true;
    setStatus("loading");
    initialized.current = false;
    const element = document.createElement("div");
    host.replaceChildren(element);

    // Twikoo replaces its mount node, so observe the stable React-owned host.
    observerRef.current?.disconnect();
    observerRef.current = new MutationObserver(() => redactHiddenComments(host));
    observerRef.current.observe(host, { childList: true, subtree: true });

    try {
      await twikoo.init({
        envId,
        el: element,
        path,
        lang: "zh-CN",
        onCommentLoaded: () => {
          redactHiddenComments(host);
          setStatus("ready");
        },
      });
      redactHiddenComments(host);
      initialized.current = true;
      setStatus("ready");
    } catch {
      setStatus("error");
    } finally {
      initializing.current = false;
    }
  }, [path]);

  useEffect(() => {
    observerRef.current?.disconnect();
    initialized.current = false;
    commentsRef.current?.replaceChildren();
    const timer = window.setTimeout(() => {
      setStatus("idle");
      void initComments();
    }, 0);
    return () => {
      window.clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [initComments]);

  return (
    <section id="comments" className={`comments-section motion-rise ${className}`.trim()}>
      <div className="section-title"><span /><h2>评论区</h2></div>
      <Script
        id="twikoo-script"
        src="https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.all.min.js"
        strategy="afterInteractive"
        onLoad={() => { void initComments(); }}
        onError={() => setStatus("error")}
      />
      {status === "loading" && <p className="comment-status">正在加载评论…</p>}
      {status === "error" && (
        <div className="comment-error">
          评论区加载失败。
          <button type="button" onClick={() => void initComments(true)}>重新加载</button>
        </div>
      )}
      <div className="twikoo-host card" ref={commentsRef} />
    </section>
  );
}
