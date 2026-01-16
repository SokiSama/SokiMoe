'use client';

import { Suspense, useMemo, useState } from 'react';
import { PostCard } from '@/components/PostCard';
import { Pagination } from '@/components/Pagination';
import { usePosts } from '@/hooks/usePosts';
import { useConfig } from '@/hooks/useConfig';
import { useSearchParams } from 'next/navigation';
import { LoadingTransition } from '@/components/LoadingComponents';
import Link from 'next/link';
import { useTags } from '@/hooks/useTags';

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

function PostsPageContent() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  
  const { data: config } = useConfig();
  const postsPerPage = config?.postsPerPage || 6;
  
  const { posts, pagination, loading, error } = usePosts({
    page: currentPage,
    limit: postsPerPage,
    paginated: true
  });

  const { posts: allPosts } = usePosts();
  const { tags } = useTags();
  const [openYear, setOpenYear] = useState<number | null>(null);
  const [mobileArchiveOpen, setMobileArchiveOpen] = useState(false);
  const [openTag, setOpenTag] = useState<string | null>(null);

  const archives = useMemo(() => {
    const byYear = new Map<number, typeof allPosts>();
    for (const p of allPosts) {
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
  }, [allPosts]);

  const tagPostsMap = useMemo(() => {
    const map = new Map<string, typeof allPosts>();
    for (const post of allPosts) {
      for (const t of post.tags || []) {
        const key = t.toLowerCase();
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(post);
      }
    }
    map.forEach((list, key) => {
      map.set(key, [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });
    return map;
  }, [allPosts]);

  const mobileArchiveMaxHeight = useMemo(() => {
    if (!mobileArchiveOpen) return '0px';
    const expanded = openYear == null ? null : archives.find((a) => a.year === openYear);
    const base = archives.length * 44 + 16;
    const extra = expanded ? expanded.posts.length * 44 + 16 : 0;
    return `${base + extra}px`;
  }, [archives, mobileArchiveOpen, openYear]);

  const formatMonthDay = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${m}-${day}`;
  };

  let lastYear: number | null = null;

  if (error) {
    return (
      <div className="home-wrapper py-12">
        <div className="text-center py-16 fade-in">
          <div className="text-red-500 dark:text-red-400">
            <h2 className="text-2xl font-semibold mb-4">加载失败</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const skeletonContent = (
    <div className="home-wrapper py-12">
      <div className="mb-8">
        <div className="h-8 w-32 shimmer rounded mb-4"></div>
        <div className="h-4 w-48 shimmer rounded"></div>
      </div>

      <div className="mt-10 lg:grid lg:grid-cols-[220px,1fr] lg:gap-10">
        <div className="hidden lg:block">
          <div className="space-y-4">
            <div className="relative left-0 ml-0 w-[220px] min-w-[200px] max-w-[260px] card p-6 card-loading">
              <div className="flex items-center gap-4">
                <div className="h-1.5 w-12 shimmer rounded" />
                <div className="h-6 w-28 shimmer rounded" />
              </div>
              <div className="mt-6 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <div className="h-5 w-20 shimmer rounded" />
                    <div className="h-8 w-14 shimmer rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
            <div className="relative left-0 ml-0 w-[220px] min-w-[200px] max-w-[260px] card p-6 card-loading">
              <div className="h-4 w-16 shimmer rounded" />
              <div className="mt-6 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <div className="h-5 w-20 shimmer rounded" />
                    <div className="h-8 w-14 shimmer rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-6 card-loading">
              <div className="h-6 w-24 shimmer rounded" />
              <div className="mt-6 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <div className="h-5 w-20 shimmer rounded" />
                    <div className="h-8 w-14 shimmer rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6 card-loading">
              <div className="h-4 w-16 shimmer rounded" />
              <div className="mt-6 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <div className="h-5 w-20 shimmer rounded" />
                    <div className="h-8 w-14 shimmer rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
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
    </div>
  );

  const actualContent = (
    <div className="home-wrapper py-12">
      <div className="mb-8 fade-in-up">
        <h1 className="text-3xl font-bold mb-4">所有文章</h1>
        <p className="text-muted-foreground">
          共 {pagination?.totalPosts || posts.length} 篇文章
        </p>
      </div>

      {posts.length > 0 ? (
        <>
          <div className="mt-8 lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-6">
              <div className="flex items-center gap-4">
                <div className="h-1.5 w-12 rounded bg-blue-600 dark:bg-blue-500" />
                <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  文章分类
                </div>
              </div>
              <div className="mt-6 space-y-2">
                {tags.map(({ tag, count }) => {
                  const key = tag.toLowerCase();
                  const expanded = openTag === key;
                  const list = tagPostsMap.get(key) || [];
                  const maxHeight = expanded ? `${list.length * 44 + 8}px` : '0px';
                  return (
                    <div key={tag} className="rounded-lg">
                      <button
                        type="button"
                        onClick={() => setOpenTag((t) => (t === key ? null : key))}
                        className={[
                          'w-full group flex items-center justify-between gap-4 rounded-lg px-2.5 py-2 transition-colors text-left',
                          'hover:bg-neutral-50 dark:hover:bg-neutral-800',
                        ].join(' ')}
                        aria-expanded={expanded}
                      >
                        <span className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 transition-colors group-hover:text-primary truncate">
                          {tag}
                        </span>
                        <span className="shrink-0 inline-flex min-w-[3.25rem] justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm font-semibold tabular-nums text-neutral-600 dark:text-neutral-200">
                          {count}
                        </span>
                      </button>

                      <div
                        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
                        style={{ maxHeight, opacity: expanded ? 1 : 0 }}
                      >
                        <div className="mt-1 space-y-1 pb-2">
                          {list.map((p) => (
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

            <div className="card p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">归档</div>
                <button
                  type="button"
                  onClick={() =>
                    setMobileArchiveOpen((v) => {
                      const next = !v;
                      if (!next) setOpenYear(null);
                      return next;
                    })
                  }
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
                  aria-expanded={mobileArchiveOpen}
                  aria-controls="mobile-archives"
                >
                  {mobileArchiveOpen ? '收起' : '展开'}
                </button>
              </div>

              <div
                id="mobile-archives"
                className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
                style={{ maxHeight: mobileArchiveMaxHeight, opacity: mobileArchiveOpen ? 1 : 0 }}
              >
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
            </div>
          </div>

          <div className="mt-10 lg:grid lg:grid-cols-[220px,1fr] lg:gap-10">
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <div className="space-y-4">
                  <div className="relative left-0 ml-0 w-[220px] min-w-[200px] max-w-[260px] card p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 w-12 rounded bg-blue-600 dark:bg-blue-500" />
                      <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        文章分类
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      {tags.map(({ tag, count }) => {
                        const key = tag.toLowerCase();
                        const expanded = openTag === key;
                        const list = tagPostsMap.get(key) || [];
                        const maxHeight = expanded ? `${list.length * 44 + 8}px` : '0px';
                        return (
                          <div key={tag} className="rounded-lg">
                            <button
                              type="button"
                              onClick={() => setOpenTag((t) => (t === key ? null : key))}
                              className={[
                                'w-full group flex items-center justify-between gap-4 rounded-lg px-2.5 py-2 transition-colors text-left',
                                'hover:bg-neutral-50 dark:hover:bg-neutral-800',
                              ].join(' ')}
                              aria-expanded={expanded}
                            >
                              <span className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 transition-colors group-hover:text-primary truncate">
                                {tag}
                              </span>
                              <span className="shrink-0 inline-flex min-w-[3.25rem] justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm font-semibold tabular-nums text-neutral-600 dark:text-neutral-200">
                                {count}
                              </span>
                            </button>

                            <div
                              className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
                              style={{ maxHeight, opacity: expanded ? 1 : 0 }}
                            >
                              <div className="mt-1 space-y-1 pb-2">
                                {list.map((p) => (
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
                    <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">归档</div>
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
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-6 stagger-children">
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
              
              {pagination && pagination.totalPages > 1 && (
                <div className="fade-in-delayed">
                  <Pagination pagination={pagination} basePath="/posts" />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16 fade-in">
          <h2 className="text-2xl font-semibold mb-4">暂无文章</h2>
          <p className="text-muted-foreground">
            还没有发布任何文章，请稍后再来查看。
          </p>
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

export default function PostsPage() {
  return (
    <Suspense fallback={
      <div className="home-wrapper py-12">
        <div className="mb-8">
          <div className="h-8 w-32 shimmer rounded mb-4"></div>
          <div className="h-4 w-48 shimmer rounded"></div>
        </div>
        <div className="mt-10 lg:grid lg:grid-cols-[220px,1fr] lg:gap-10">
          <div className="hidden lg:block">
            <div className="space-y-4">
              <div className="relative left-0 ml-0 w-[220px] min-w-[200px] max-w-[260px] card p-6 card-loading">
                <div className="flex items-center gap-4">
                  <div className="h-1.5 w-12 shimmer rounded" />
                  <div className="h-6 w-28 shimmer rounded" />
                </div>
                <div className="mt-6 space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                      <div className="h-5 w-20 shimmer rounded" />
                      <div className="h-8 w-14 shimmer rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative left-0 ml-0 w-[220px] min-w-[200px] max-w-[260px] card p-6 card-loading">
                <div className="h-4 w-16 shimmer rounded" />
                <div className="mt-6 space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                      <div className="h-5 w-20 shimmer rounded" />
                      <div className="h-8 w-14 shimmer rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card p-6 card-loading">
                <div className="h-6 w-24 shimmer rounded" />
                <div className="mt-6 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                      <div className="h-5 w-20 shimmer rounded" />
                      <div className="h-8 w-14 shimmer rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6 card-loading">
                <div className="h-4 w-16 shimmer rounded" />
                <div className="mt-6 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                      <div className="h-5 w-20 shimmer rounded" />
                      <div className="h-8 w-14 shimmer rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-6 card-loading min-h-[200px]">
                <div className="space-y-4">
                  <div className="h-6 w-2/3 shimmer rounded"></div>
                  <div className="h-4 w-full shimmer rounded"></div>
                  <div className="h-4 w-5/6 shimmer rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <PostsPageContent />
    </Suspense>
  );
}
