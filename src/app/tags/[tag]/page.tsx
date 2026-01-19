'use client';

import Link from 'next/link';
import { Hash, ArrowLeft } from 'lucide-react';
import { PostCard } from '@/components/PostCard';
import { useTagPosts } from '@/hooks/useTags';
import { useParams } from 'next/navigation';
import { LoadingTransition } from '@/components/LoadingComponents';
import { useEffect, useMemo, useState } from 'react';

function YearDivider({ year }: { year: number }) {
  return (
    <div className="mt-[15px] mb-[15px]">
      <div className="flex justify-end mb-[5px]">
        <span className="font-semibold leading-snug text-base sm:text-lg md:text-xl text-[#999999]">
          {year}
        </span>
      </div>
      <div className="border-t border-dashed border-[#CCCCCC]" />
    </div>
  );
}

export default function TagPostsPage() {
  const params = useParams();
  const tag = decodeURIComponent(params.tag as string);

  const { posts, count, loading, error } = useTagPosts(tag);

  const [openYear, setOpenYear] = useState<number | null>(null);
  const [totalChars, setTotalChars] = useState<number | null>(null);

  const archives = useMemo(() => {
    const byYear = new Map<number, typeof posts>();
    for (const p of posts) {
      const d = new Date(p.date);
      const year = Number.isNaN(d.getTime()) ? 0 : d.getFullYear();
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year)!.push(p);
    }

    return Array.from(byYear.entries())
      .filter(([year]) => year > 0)
      .map(([year, list]) => {
        const sorted = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return { year, posts: sorted, count: sorted.length };
      })
      .sort((a, b) => b.year - a.year);
  }, [posts]);

  const formatMonthDay = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${m}-${day}`;
  };

  useEffect(() => {
    let cancelled = false;
    const calc = async () => {
      try {
        if (!posts || posts.length === 0) {
          if (!cancelled) setTotalChars(0);
          return;
        }
        const counts = await Promise.all(
          posts.map(async (p) => {
            try {
              const resp = await fetch(`/api/posts/${encodeURIComponent(p.slug)}`, { cache: 'no-cache' });
              if (!resp.ok) return 0;
              const j = await resp.json();
              const html = j?.data?.htmlContent || '';
              const doc = new DOMParser().parseFromString(html, 'text/html');
              const text = doc.body.textContent || '';
              return text.replace(/\s+/g, '').length;
            } catch {
              return 0;
            }
          })
        );
        const sum = counts.reduce((a, b) => a + b, 0);
        if (!cancelled) setTotalChars(sum);
      } catch {
        if (!cancelled) setTotalChars(null);
      }
    };
    calc();
    return () => {
      cancelled = true;
    };
  }, [posts]);

  let lastYear: number | null = null;

  if (error) {
    return (
      <div className="content-wrapper py-12">
        <div className="text-center py-16 fade-in">
          <div className="text-red-500 dark:text-red-400">
            <h2 className="text-2xl font-semibold mb-4">加载失败</h2>
            <p>{error}</p>
            <Link 
              href="/tags" 
              className="inline-flex items-center mt-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回标签列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const skeletonContent = (
    <div className="content-wrapper py-12">
      <div className="mb-8">
        <div className="h-6 w-32 shimmer rounded mb-4"></div>
        <div className="h-8 w-64 shimmer rounded mb-4"></div>
        <div className="h-4 w-48 shimmer rounded"></div>
      </div>

      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-6 card-loading min-h-[200px]">
            <div className="space-y-4">
              <div className="h-6 w-2/3 shimmer rounded"></div>
              <div className="h-4 w-full shimmer rounded"></div>
              <div className="h-4 w-5/6 shimmer rounded"></div>
              <div className="flex space-x-2 pt-2">
                <div className="h-6 w-16 shimmer rounded"></div>
                <div className="h-6 w-20 shimmer rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const actualContent = (
    <div className="content-wrapper py-12">
      {/* 返回按钮 */}
      <div className="mb-8 fade-in">
        <Link 
          href="/tags" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回标签列表
        </Link>
      </div>

      {/* 标签头部 */}
      <div className="mb-8 fade-in-up">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Hash className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{tag}</h1>
            <p className="text-muted-foreground">
              {count} 篇文章
            </p>
          </div>
        </div>
      </div>

      {posts.length > 0 ? (
        <div className="mt-10 lg:grid lg:grid-cols-[220px,1fr] lg:gap-10">
          {tag.toLowerCase() === 'tech' ? (
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <div className="space-y-4">
                  <div className="relative left-0 ml-0 w-[220px] min-w-[200px] max-w-[260px] card p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 w-12 rounded bg-blue-600 dark:bg-blue-500" />
                      <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        归档
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {archives.map((a) => {
                        const expanded = openYear === a.year;
                        const maxHeight = expanded ? `${a.posts.length * 44 + 8}px` : '0px';
                        return (
                          <div key={a.year} className="rounded-lg">
                            <button
                              type="button"
                              onClick={() => setOpenYear((y) => (y === a.year ? null : a.year))}
                              className={[
                                'w-full flex items-center justify-between gap-4 rounded-lg px-2.5 py-2 transition-colors text-left',
                                'hover:bg-neutral-50 dark:hover:bg-neutral-800',
                              ].join(' ')}
                              aria-expanded={expanded}
                            >
                              <span className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                                {a.year}年
                              </span>
                              <span className="shrink-0 inline-flex min-w-[3.25rem] justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm font-semibold tabular-nums text-neutral-600 dark:text-neutral-200">
                                {a.count}
                              </span>
                            </button>

                            <div
                              className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
                              style={{ maxHeight, opacity: expanded ? 1 : 0 }}
                            >
                              <div className="mt-1 space-y-1 pb-2">
                                {a.posts.map((p) => (
                                  <Link
                                    key={p.slug}
                                    href={`/posts/${encodeURIComponent(p.slug)}`}
                                    className={[
                                      'flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 transition-colors',
                                      'hover:bg-neutral-50 dark:hover:bg-neutral-800',
                                    ].join(' ')}
                                  >
                                    <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                                      {p.title}
                                    </span>
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums shrink-0">
                                      {formatMonthDay(p.date)}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="relative left-0 ml-0 w-[220px] min-w-[200px] max-w-[260px] card p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 w-12 rounded bg-blue-600 dark:bg-blue-500" />
                      <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        统计
                      </div>
                    </div>
                    <div className="mt-6 space-y-2">
                      <div className="w-full flex items-center justify-between gap-4 rounded-lg px-2.5 py-2">
                        <span className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                          总字数
                        </span>
                        <span className="shrink-0 inline-flex justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm font-semibold tabular-nums text-neutral-600 dark:text-neutral-200">
                          {typeof totalChars === 'number' ? totalChars.toLocaleString('zh-CN') : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div>
            <div className="stagger-children space-y-6">
              {posts.map((post) => {
                const year = new Date(post.date).getFullYear();
                const showDivider = year !== lastYear;
                lastYear = year;
                return (
                  <div key={post.slug}>
                    {showDivider && <YearDivider year={year} />}
                    <PostCard post={post} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 fade-in-delayed">
          <Hash className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">暂无文章</h2>
          <p className="text-muted-foreground">
            该标签下还没有任何文章。
          </p>
          <Link 
            href="/posts" 
            className="inline-block mt-4 btn-primary"
          >
            浏览所有文章
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <LoadingTransition
      loading={loading}
      skeleton={skeletonContent}
      delay={300}
    >
      {actualContent}
    </LoadingTransition>
  );
}
