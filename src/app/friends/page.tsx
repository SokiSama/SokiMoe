'use client';

import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';

type TwikooGlobal = {
  init: (options: {
    envId: string;
    el: string | HTMLElement;
    path?: string;
    lang?: string;
    onCommentLoaded?: () => void;
  }) => Promise<void>;
  getCommentsCount?: (options: {
    envId: string;
    urls: string[];
    includeReply?: boolean;
  }) => Promise<Array<{ url: string; count: number }>>;
};

const TwikooContainer = memo(
  forwardRef<HTMLDivElement, { id: string; className?: string }>(function TwikooContainer(
    { id, className },
    ref
  ) {
    return (
      <div
        id={id}
        ref={ref}
        className={className}
      />
    );
  }),
  () => true
);

export default function FriendsPage() {
  const friends = useMemo(
    () => [
      {
        title: '鈴奈咲桜のBlog',
        avatar: 'https://q2.qlogo.cn/headimg_dl?dst_uin=2731443459&spec=5',
        description: '愛することを忘れないで',
        url: 'https://blog.sakura.ink',
      },
      {
        title: '小三月',
        avatar: 'https://gravatar.loli.net/avatar/1741ba4d7382ef4f8a556fdf3d88a4cf?s=300',
        description: '喵！这里是三月七',
        url: 'https://blog.nanoka.moe/links',
      },
      {
        title: '熊熊',
        avatar: 'https://cynosura.one/img/profile-avatar.webp',
        description: 'Trying to light up the dark.',
        url: 'https://cynosura.one/',
      },
      {
        title: 'Hoyue の 自留地',
        avatar: 'https://hoyue.fun/assets/icons/avatar.jpg',
        description: '这里的一切都有始有终，却能容纳所有的不期而遇和久别重逢。',
        url: 'https://hoyue.fun',
      },
      {
        title: 'Clementine (aka Clem)',
        avatar: 'https://friends.ichr.me/img/blog.hly0928.com.png',
        description: '悟已往之不諫，知來者之可追',
        url: 'https://blog.hly0928.com/',
      },
      {
        title: 'Saneko',
        avatar: 'https://cdn.blog.saneko.me/Web/Avatar.png',
        description: 'Do the things that I like.',
        url: 'https://saneko.me',
      },
      {
        title: '时隐重工',
        avatar: 'https://shiyina.com:233/favicon.ico',
        description: '兴趣使然的未来主义建造者',
        url: 'https://shiyin.cafe/',
      },
      {
        title: '云海花瑶',
        avatar: 'https://dn-qiniu-avatar.qbox.me/avatar/d00de9fbffe50946b950a3fd0cd1bfdb',
        description: '白头并非雪可替,相遇已是上上签',
        url: 'https://www.moeyao.cn/',
      },
      {
        title: 'Astral Reverie',
        avatar: 'https://montrong-1300089193.cos.ap-beijing.myqcloud.com/montrong/2025/12/20251222025856537.png',
        description: '如梦幻，如初遇。',
        url: 'https://montrong.cn',
      },
      {
        title: 'Betsy Blog',
        avatar: 'https://img.micostar.cc/images/avatar.webp',
        description: '爱我所爱，我们是彼此永远的动力',
        url: 'https://www.micostar.cc',
      },
      {
        title: 'J的个人博客',
        avatar: 'https://blog.jsoftstudio.top/css/all/favicon.ico',
        description: 'hi，欢迎来到我的个人博客，我会在这里分享教程，经验与生活',
        url: 'https://blog.jsoftstudio.top/',
      },
      
    ],
    []
  );

  const envId = 'https://sweet-moonbeam-d0178d.netlify.app/.netlify/functions/twikoo';
  const twikooPath = '/friends';
  const twikooElId = 'twikoo-comments';
  const twikooElRef = useRef<HTMLDivElement | null>(null);
  const initRunningRef = useRef(false);
  const initializedRef = useRef(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [initStatus, setInitStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [loadingComments, setLoadingComments] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [safetyWarning, setSafetyWarning] = useState<string | null>(null);
  const [hasNewComments, setHasNewComments] = useState(false);

  const getTwikoo = useCallback(
    () => (window as unknown as { twikoo?: TwikooGlobal }).twikoo ?? null,
    []
  );

  const initTwikoo = useCallback(async (options?: { force?: boolean }) => {
    const el = twikooElRef.current;
    const twikoo = getTwikoo();
    if (!el) {
      return;
    }
    if (!twikoo?.init) return;

    if (initRunningRef.current) {
      return;
    }

    if (initializedRef.current && !options?.force) {
      return;
    }

    const maxAttempts = 3;
    initRunningRef.current = true;

    try {
      setInitStatus('loading');
      setLoadingComments(true);
      setErrorMessage(null);

      if (options?.force) {
        el.replaceChildren();
        initializedRef.current = false;
      }

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
          await twikoo.init({
            envId,
            el,
            path: twikooPath,
            lang: 'zh-CN',
            onCommentLoaded: () => {
              setLoadingComments(false);
            },
          });
          initializedRef.current = true;
          setHasNewComments(false);
          setInitStatus('ready');
          return;
        } catch (err) {
          if (attempt < maxAttempts) {
            await new Promise<void>((resolve) => {
              window.setTimeout(resolve, 700 * attempt);
            });
            continue;
          }
          setLoadingComments(false);
          setInitStatus('error');
          setErrorMessage(err instanceof Error ? err.message : String(err));
        }
      }
    } finally {
      initRunningRef.current = false;
    }
  }, [envId, getTwikoo, twikooPath]);

  useEffect(() => {
    // 若脚本已加载或全局对象已存在，则初始化
    if (!scriptReady && !getTwikoo()) return;
    void initTwikoo();
  }, [initTwikoo, scriptReady, getTwikoo]);

  // 预检测 window.twikoo，防止在客户端路由下脚本已存在但 onLoad 不再触发
  useEffect(() => {
    if (getTwikoo()) {
      setScriptReady(true);
    }
  }, [getTwikoo]);

  useEffect(() => {
    if (!scriptReady || initStatus !== 'ready') return;
    const el = twikooElRef.current;
    if (!el) return;

    const shouldBlock = (value: string) => {
      const trimmed = value.trim();
      if (trimmed.length === 0) return null;
      if (trimmed.length > 2000) return '评论内容过长，请控制在 2000 字以内。';
      const lowered = trimmed.toLowerCase();
      const risky = ['<script', 'javascript:', 'data:text/html', 'onerror=', 'onload='];
      if (risky.some((k) => lowered.includes(k))) return '检测到可能不安全的内容，请移除可疑代码后再发布。';
      return null;
    };

    const applyGuardToSendButton = (blocked: boolean) => {
      const candidates = Array.from(el.querySelectorAll('button')) as HTMLButtonElement[];
      const sendButton =
        candidates.find((b) => b.className.includes('tk-send')) ??
        candidates.find((b) => /发送|提交|send/i.test(b.textContent ?? '')) ??
        null;
      if (!sendButton) return;
      sendButton.disabled = blocked;
    };

    let currentTextarea: HTMLTextAreaElement | null = null;
    let detach = () => {};

    const attach = () => {
      const textarea = el.querySelector('textarea') as HTMLTextAreaElement | null;
      if (!textarea || textarea === currentTextarea) return;

      detach();
      currentTextarea = textarea;

      const onInput = () => {
        const warning = shouldBlock(textarea.value);
        setSafetyWarning(warning);
        applyGuardToSendButton(Boolean(warning));
      };

      textarea.addEventListener('input', onInput);
      onInput();
      detach = () => textarea.removeEventListener('input', onInput);
    };

    attach();
    const observer = new MutationObserver(() => attach());
    observer.observe(el, { childList: true, subtree: true });

    return () => {
      detach();
      observer.disconnect();
    };
  }, [initStatus, scriptReady]);

  // 将 Twikoo 输入组的 label div 转换为 span，保证结构为 span + input
  useEffect(() => {
    if (!scriptReady || initStatus !== 'ready') return;
    const el = twikooElRef.current;
    if (!el) return;
    
    const obs = new MutationObserver(() => {});
    obs.observe(el, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, [initStatus, scriptReady]);

  useEffect(() => {
    if (!scriptReady || initStatus !== 'ready') return;
    const twikoo = getTwikoo();
    if (!twikoo?.getCommentsCount) return;

    let stopped = false;
    let lastCount: number | null = null;

    const tick = async () => {
      try {
        const res = await twikoo.getCommentsCount?.({
          envId,
          urls: [twikooPath],
          includeReply: true,
        });
        if (stopped) return;
        const nextCount = res?.[0]?.count;
        if (typeof nextCount !== 'number') return;
        if (lastCount !== null && nextCount > lastCount) setHasNewComments(true);
        lastCount = nextCount;
      } catch {
      }
    };

    const id = window.setInterval(() => {
      if (stopped) return;
      if (document.visibilityState !== 'visible') return;
      void tick();
    }, 20000);

    void tick();

    return () => {
      stopped = true;
      window.clearInterval(id);
    };
  }, [envId, getTwikoo, initStatus, initTwikoo, scriptReady, twikooPath]);

  return (
    <div className="trip-section-compact px-6 sm:px-8 lg:px-12 py-12 relative">
      <div className="trip-section-compact">
        <h1 className="text-3xl font-bold mb-4 fade-in-up">Friends</h1>
        <p
          className="text-muted-foreground mb-4 fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          友链
        </p>

        <div className="mb-4 card px-6 py-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          <p>相识便是友人，欢迎交换友链</p>
          <p className="mt-2">
            只需要将你的友链，按照下方格式在评论区申请即可，我看到后会尽快审核并添加。
          </p>
        </div>

        <div className="mb-8 card px-6 py-4 text-xs md:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          <p>在添加友链前，请确保：</p>
          <p className="mt-1">
            有一个固定的域名，不能是托管的域名（e.g.：.github.io、.vercel.app、netlify.app.）
          </p>
          <p className="mt-1">
            仅支持个人博客，恕不接受商业类 &amp; 无任何原创内容的博客
          </p>
            <p className="mt-1">
            内容输出，符合行为规范，无不良内容
          </p>

          <p className="mt-4 text-neutral-500 dark:text-neutral-400">
            以下是我的友链信息，你也可以参考此格式添加友链：
          </p>

          <div className="mt-2 font-mono space-y-1 break-words">
            <div>标题: SokiのBlog</div>
            <div>头像: https://cdn.jsdelivr.net/gh/SokiSama/picked@main/avatar.jpg</div>
            <div>描述: 月下彼岸花</div>
            <div>地址: https://www.soki.moe</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {friends.map((friend) => (
            <a
              key={friend.url}
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group card bg-none shadow-none p-10 min-h-[260px] block transform-gpu transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-[0_14px_45px_-12px_rgba(0,0,0,0.16)] focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <div className="mb-6">
                <div className="relative w-24 h-24">
                  <div className="absolute -inset-3 rounded-full bg-pink-200 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70 dark:bg-pink-500/40" />
                  <div className="absolute -inset-1 rounded-full bg-pink-100 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-80 dark:bg-pink-500/30" />
                  {friend.avatar.startsWith('http') ? (
                    <Image
                      src={friend.avatar}
                      alt={friend.title}
                      width={96}
                      height={96}
                      className="h-24 w-24 rounded-full object-cover ring-2 ring-primary/30 bg-pink-50 dark:bg-pink-500/20 transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-pink-50 dark:bg-pink-500/20 flex items-center justify-center ring-2 ring-primary/30 text-4xl transition-transform duration-500 ease-out group-hover:scale-[1.08]">
                      🌸
                    </div>
                  )}
                </div>
              </div>

              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 transition-colors duration-300 ease-in-out group-hover:text-rose-500">
                {friend.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-neutral-600">
                {friend.description}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-1.5 w-12 rounded bg-blue-600 dark:bg-blue-500" />
            <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              评论区
            </div>
          </div>

          <div>
            <Script
              id="twikoo"
              src="https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.all.min.js"
              strategy="afterInteractive"
              onLoad={() => {
                setScriptReady(true);
                void initTwikoo();
              }}
            />

            {initStatus === 'error' && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
                <div className="font-semibold mb-1">评论区加载失败</div>
                <div className="break-words">{errorMessage || '未知错误'}</div>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors"
                  onClick={() => void initTwikoo({ force: true })}
                >
                  重试
                </button>
              </div>
            )}

            {hasNewComments && initStatus === 'ready' && (
              <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-200">
                <div className="font-medium">发现新评论</div>
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
                  onClick={() => void initTwikoo({ force: true })}
                >
                  刷新
                </button>
              </div>
            )}

            {safetyWarning && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
                {safetyWarning}
              </div>
            )}

            {loadingComments && (
              <div className="mb-4 flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-transparent dark:border-neutral-700 dark:border-t-transparent" />
                <span>正在加载评论…</span>
              </div>
            )}

            <div className="twikoo-host">
              <TwikooContainer
                ref={twikooElRef}
                id={twikooElId}
                className="twikoo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
