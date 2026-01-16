'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { PsnTrophySummary } from '@/lib/psn';

type TabKey = 'anime' | 'comic' | 'game';

const PSN_TROPHY_SUMMARY_CACHE_KEY = 'psn_trophy_summary_v1';
const PSN_TROPHY_SUMMARY_CACHE_TTL_MS = 5 * 60_000;
const PSN_RECENT_TITLES_CACHE_KEY = 'psn_recent_titles_v1';
const PSN_RECENT_TITLES_CACHE_TTL_MS = 5 * 60_000;

type BangumiItem = {
  id: number;
  title: string;
  cover?: string;
  statusText: string;
  progressText: string;
  year: string;
  production: string;
  tags: string[];
};

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? 'h-6 w-6'}
      fill="currentColor"
    >
      <path d="M18 2H6a1 1 0 0 0-1 1v3H3a1 1 0 0 0-1 1c0 4.418 2.239 7.118 6 7.858A6.002 6.002 0 0 0 11 18.917V20H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-1.083A6.002 6.002 0 0 0 16 14.86c3.761-.74 6-3.44 6-7.858a1 1 0 0 0-1-1h-2V3a1 1 0 0 0-1-1Zm-1 2v3a1 1 0 0 0 1 1h1.944c-.321 2.62-1.78 4.14-4.354 4.54A6.02 6.02 0 0 0 17 9.999V4h0ZM7 4v5.999a6.02 6.02 0 0 0 1.41 2.54C5.836 12.14 4.377 10.62 4.056 8H6a1 1 0 0 0 1-1V4h0Z" />
    </svg>
  );
}

function ProgressBar({
  value,
  className,
  showLabel = true,
  showCheckAt100 = true,
}: {
  value: number | null;
  className?: string;
  showLabel?: boolean;
  showCheckAt100?: boolean;
}) {
  const pct =
    typeof value === 'number' && Number.isFinite(value)
      ? Math.min(100, Math.max(0, Math.round(value)))
      : null;

  const label = pct === null ? '—' : pct === 100 && showCheckAt100 ? '100% ✓' : `${pct}%`;

  return (
    <div
      className={['relative h-2 rounded overflow-hidden', className ?? ''].join(' ').trim()}
      style={{ backgroundColor: '#e0e0e0' }}
    >
      <div
        className="h-full"
        style={{
          width: pct === null ? '0%' : `${pct}%`,
          backgroundColor: '#4CAF50',
          transition: 'width 0.3s ease',
        }}
      />
      {showLabel ? (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium tabular-nums text-neutral-700 dark:text-neutral-200">
          {label}
        </div>
      ) : null}
    </div>
  );
}

function Anime() {
  type StatusFilter = '在看' | '看过' | '想看';

  const [items, setItems] = useState<BangumiItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const filterTimerRef = useRef<number | null>(null);

  const fetchList = async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    setIsRefreshing(silent);
    setError(null);

    try {
      const res = await fetch('/api/bangumi/anime?limit=48', {
        cache: 'no-store',
      });
      const json = (await res.json()) as
        | { success: true; data: { items: BangumiItem[] } }
        | { success: false; error?: string; details?: string };

      if (!res.ok || !('success' in json) || !json.success) {
        const message =
          'error' in json && json.error ? json.error : `请求失败(${res.status})`;
        throw new Error(message);
      }

      setItems(json.data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setItems([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchList();

    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') void fetchList({ silent: true });
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (filterTimerRef.current) window.clearTimeout(filterTimerRef.current);
    };
  }, []);

  const visibleItems = useMemo(() => {
    if (!items) return null;
    if (!statusFilter) return items;
    return items.filter((i) => i.statusText === statusFilter);
  }, [items, statusFilter]);

  const applyFilter = (next: StatusFilter | null) => {
    setIsFiltering(true);
    if (filterTimerRef.current) window.clearTimeout(filterTimerRef.current);
    filterTimerRef.current = window.setTimeout(() => {
      setStatusFilter(next);
      setIsFiltering(false);
    }, 140);
  };

  const filterBtnClass = (active: boolean) => {
    const base =
      'h-11 px-4 rounded-full text-sm border transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/40';
    const secondary =
      'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300';
    const primary =
      'border-neutral-900 bg-neutral-900 text-neutral-50 hover:bg-neutral-800 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200';
    return [base, active ? primary : secondary].join(' ');
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          {loading
            ? '加载中…'
            : error
              ? error
              : `共 ${visibleItems?.length ?? 0} 条`}
        </div>

        <div className="flex justify-center sm:flex-1 w-full sm:w-auto">
          <div className="inline-grid grid-cols-3 gap-2">
            {(['在看', '看过', '想看'] as const).map((label) => {
              const active = statusFilter === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => applyFilter(active ? null : label)}
                  className={filterBtnClass(active)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => fetchList()}
            className={[
              'h-11 text-sm px-4 rounded-full border transition-smooth',
              'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700',
              'dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300',
              isRefreshing ? 'opacity-60 pointer-events-none' : '',
            ].join(' ')}
          >
            刷新
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card px-5 py-4">
              <div className="flex gap-4">
                <div className="h-[136px] w-[96px] rounded shimmer" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-3/4 shimmer rounded" />
                  <div className="flex gap-2">
                    <div className="h-7 w-16 shimmer rounded-full" />
                    <div className="h-7 w-20 shimmer rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : visibleItems && visibleItems.length > 0 ? (
        <div
          className={[
            'mt-6 flex flex-col gap-4 transition-opacity duration-200 ease-out will-change-opacity',
            isFiltering ? 'opacity-0' : 'opacity-100',
          ].join(' ')}
        >
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="group card px-5 py-4 transition-smooth hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <div className="flex items-center gap-4 flex-nowrap min-w-0">
                <button
                  type="button"
                  onClick={() => window.open(`https://bgm.tv/subject/${item.id}`, '_blank', 'noopener,noreferrer')}
                  className="relative h-[136px] w-[96px] rounded overflow-hidden bg-neutral-200 dark:bg-neutral-700 transition-smooth hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  aria-label={`打开 ${item.title}`}
                >
                  {item.cover ? (
                    <Image
                      src={item.cover}
                      alt={item.title}
                      width={96}
                      height={136}
                      sizes="96px"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => window.open(`https://bgm.tv/subject/${item.id}`, '_blank', 'noopener,noreferrer')}
                    className="text-left w-full text-sm sm:text-base font-medium text-neutral-900 dark:text-neutral-100 transition-smooth hover:underline focus:outline-none focus:ring-2 focus:ring-primary/40 rounded"
                  >
                    <span className="block break-words">{item.title}</span>
                  </button>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => window.open(`https://bgm.tv/subject/${item.id}`, '_blank', 'noopener,noreferrer')}
                      className="px-3 py-1.5 rounded-full text-xs sm:text-sm border border-neutral-200 bg-white text-neutral-700 transition-smooth hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      {item.statusText}
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open(`https://bgm.tv/subject/${item.id}`, '_blank', 'noopener,noreferrer')}
                      className="px-3 py-1.5 rounded-full text-xs sm:text-sm border border-neutral-200 bg-white text-neutral-700 transition-smooth hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      {item.progressText}
                    </button>
                  </div>
                </div>

                <div className="hidden md:flex flex-col gap-2 w-[320px] shrink-0">
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-neutral-500 dark:text-neutral-400 text-xs shrink-0">
                      年份
                    </span>
                    <span className="text-neutral-700 dark:text-neutral-200 text-xs text-right">
                      {item.year || '未知'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-neutral-500 dark:text-neutral-400 text-xs shrink-0 mt-0.5">
                      制作
                    </span>
                    <span
                      className="text-neutral-700 dark:text-neutral-200 text-xs text-right break-words"
                      title={item.production || '未知'}
                    >
                      {item.production || '未知'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {(item.tags?.length ? item.tags : ['未知']).slice(0, 10).map((tag, idx) => (
                      <span
                        key={`${tag}-${idx}`}
                        className="px-2 py-1 rounded-full text-[11px] leading-none border border-neutral-200 bg-white text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:hidden mt-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-neutral-500 dark:text-neutral-400 shrink-0">
                      年份
                    </span>
                    <span className="text-neutral-700 dark:text-neutral-200 text-right">
                      {item.year || '未知'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-neutral-500 dark:text-neutral-400 shrink-0">
                      制作
                    </span>
                    <span
                      className="text-neutral-700 dark:text-neutral-200 text-right break-words"
                      title={item.production || '未知'}
                    >
                      {item.production || '未知'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(item.tags?.length ? item.tags : ['未知']).slice(0, 10).map((tag, idx) => (
                    <span
                      key={`${tag}-${idx}`}
                      className="px-2 py-1 rounded-full text-[11px] leading-none border border-neutral-200 bg-white text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 flex items-center justify-center min-h-[220px]">
          <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {items && items.length > 0 ? '无匹配内容' : 'NO ANIME'}
          </div>
        </div>
      )}
    </div>
  );
}

function Comic() {
  return (
    <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
      NO COMIC
    </div>
  );
}

function Game() {
  const [summary, setSummary] = useState<PsnTrophySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 8;

  type PsnRecentTitle = {
    npServiceName: 'trophy' | 'trophy2';
    npCommunicationId: string;
    trophyTitleName: string;
    trophyTitleIconUrl: string;
    lastUpdatedDateTime: string;
    progress?: number | null;
    earnedTrophies?: {
      platinum: number;
      gold: number;
      silver: number;
      bronze: number;
    } | null;
  };

  const [recentTitles, setRecentTitles] = useState<PsnRecentTitle[] | null>(null);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSummary = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    setIsRefreshing(silent);
    setError(null);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2_800);

    try {
      const res = await fetch('/api/psn/trophies?mode=summary', {
        cache: 'no-store',
        signal: controller.signal,
      });

      const json = (await res.json()) as
        | { success: true; data: PsnTrophySummary }
        | { success: false; error?: string };

      if (!res.ok || !('success' in json) || !json.success) {
        const message = 'error' in json && json.error ? json.error : `请求失败(${res.status})`;
        throw new Error(message);
      }

      setSummary(json.data);
      try {
        sessionStorage.setItem(
          PSN_TROPHY_SUMMARY_CACHE_KEY,
          JSON.stringify({ savedAt: Date.now(), data: json.data } satisfies { savedAt: number; data: PsnTrophySummary })
        );
      } catch {
        void 0;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSummary(null);
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const fetchRecentTitles = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setRecentLoading(true);
    setIsRefreshing(silent);
    setRecentError(null);

    const clampPercent = (n: number) => Math.min(100, Math.max(0, n));
    const toNumber = (v: unknown) => {
      if (typeof v === 'number') return v;
      if (typeof v === 'string' && v.trim() !== '') return Number(v);
      return Number.NaN;
    };
    const sumTrophies = (v: unknown) => {
      if (!v || typeof v !== 'object') return Number.NaN;
      const o = v as Record<string, unknown>;
      const parts = ['bronze', 'silver', 'gold', 'platinum'] as const;
      const values = parts.map((k) => toNumber(o[k]));
      if (values.some((x) => !Number.isFinite(x))) return Number.NaN;
      return values.reduce((a, b) => a + b, 0);
    };
    const getProgress = (t: Record<string, unknown>) => {
      const p = toNumber(t.progress);
      if (Number.isFinite(p)) return clampPercent(Math.round(p));
      const earned = sumTrophies(t.earnedTrophies);
      const defined = sumTrophies(t.definedTrophies);
      if (Number.isFinite(earned) && Number.isFinite(defined) && defined > 0) {
        return clampPercent(Math.round((earned / defined) * 100));
      }
      return null;
    };

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2_800);

    try {
      const res = await fetch('/api/psn/trophies?mode=titles&limit=200&offset=0', {
        cache: 'no-store',
        signal: controller.signal,
      });

      const json = (await res.json()) as
        | { success: true; data: { trophyTitles: Array<Record<string, unknown>> } }
        | { success: false; error?: string };

      if (!res.ok || !('success' in json) || !json.success) {
        const message = 'error' in json && json.error ? json.error : `请求失败(${res.status})`;
        throw new Error(message);
      }

      const getEarnedTrophies = (t: Record<string, unknown>) => {
        const earned = t.earnedTrophies;
        if (!earned || typeof earned !== 'object') return null;
        const o = earned as Record<string, unknown>;
        const platinum = toNumber(o.platinum);
        const gold = toNumber(o.gold);
        const silver = toNumber(o.silver);
        const bronze = toNumber(o.bronze);
        if (![platinum, gold, silver, bronze].every((x) => Number.isFinite(x))) return null;
        return {
          platinum: Math.max(0, Math.trunc(platinum)),
          gold: Math.max(0, Math.trunc(gold)),
          silver: Math.max(0, Math.trunc(silver)),
          bronze: Math.max(0, Math.trunc(bronze)),
        };
      };

      const list = (json.data.trophyTitles || [])
        .filter((t) => !!t?.npCommunicationId && !!t?.lastUpdatedDateTime)
        .map((t) => ({
          npServiceName: (t.npServiceName as 'trophy' | 'trophy2') ?? 'trophy2',
          npCommunicationId: String(t.npCommunicationId ?? ''),
          trophyTitleName: String(t.trophyTitleName ?? ''),
          trophyTitleIconUrl: String(t.trophyTitleIconUrl ?? ''),
          lastUpdatedDateTime: String(t.lastUpdatedDateTime ?? ''),
          progress: getProgress(t),
          earnedTrophies: getEarnedTrophies(t),
        }))
        .sort((a, b) => new Date(b.lastUpdatedDateTime).getTime() - new Date(a.lastUpdatedDateTime).getTime());

      setRecentTitles(list);
      try {
        sessionStorage.setItem(
          PSN_RECENT_TITLES_CACHE_KEY,
          JSON.stringify({ savedAt: Date.now(), data: list } satisfies { savedAt: number; data: PsnRecentTitle[] })
        );
      } catch {
        void 0;
      }
    } catch (e) {
      setRecentError(e instanceof Error ? e.message : String(e));
      setRecentTitles([]);
    } finally {
      window.clearTimeout(timeout);
      setRecentLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PSN_TROPHY_SUMMARY_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { savedAt?: number; data?: PsnTrophySummary };
        if (
          parsed?.savedAt &&
          parsed?.data &&
          Date.now() - parsed.savedAt < PSN_TROPHY_SUMMARY_CACHE_TTL_MS
        ) {
          setSummary(parsed.data);
          setLoading(false);
        }
      }
    } catch {
      void 0;
    }

    try {
      const raw = sessionStorage.getItem(PSN_RECENT_TITLES_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { savedAt?: number; data?: PsnRecentTitle[] };
        if (
          parsed?.savedAt &&
          Array.isArray(parsed?.data) &&
          Date.now() - parsed.savedAt < PSN_RECENT_TITLES_CACHE_TTL_MS
        ) {
          setRecentTitles(parsed.data);
          setRecentLoading(false);
        }
      }
    } catch {
      void 0;
    }

    void fetchSummary();
    void fetchRecentTitles();

    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void fetchSummary({ silent: true });
        void fetchRecentTitles({ silent: true });
      }
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [fetchRecentTitles, fetchSummary]);

  const counts = summary?.earnedTrophies;
  const totalEarned = useMemo(() => {
    if (!counts) return 0;
    return counts.platinum + counts.gold + counts.silver + counts.bronze;
  }, [counts]);

  const totalPages = useMemo(() => {
    const total = recentTitles?.length ?? 0;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [recentTitles?.length]);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const pagedTitles = useMemo(() => {
    const list = recentTitles || [];
    const start = (page - 1) * pageSize;
    return list.slice(start, start + pageSize);
  }, [page, recentTitles]);

  const formatSyncTime = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {summary?.profile?.onlineId ? (
            <div className="h-10 w-10 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0">
              {summary.profile.avatarUrl ? (
                <Image
                  src={summary.profile.avatarUrl}
                  alt={summary.profile.onlineId}
                  width={40}
                  height={40}
                  sizes="40px"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
          ) : null}
          <div className="min-w-0">
            {summary?.profile?.onlineId ? (
              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {summary.profile.onlineId}
              </div>
            ) : null}
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              {loading
                ? '加载中…'
                : error
                  ? error
                  : summary
                    ? `奖杯等级 ${summary.trophyLevel} · 进度 ${summary.progress}%`
                    : '未同步'}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              void fetchSummary();
              void fetchRecentTitles();
            }}
            className={[
              'h-11 text-sm px-4 rounded-full border transition-smooth',
              'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700',
              'dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300',
              isRefreshing ? 'opacity-60 pointer-events-none' : '',
            ].join(' ')}
          >
            刷新
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-5 card px-5 py-5">
          <div className="space-y-4">
            <div className="h-4 w-32 shimmer rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 shimmer rounded" />
              ))}
            </div>
            <div className="mt-2 h-4 w-2/3 shimmer rounded" />
          </div>
        </div>
      ) : summary ? (
        <>
          <div className="mt-5 card px-5 py-5">
            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              PSN 奖杯概览
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  {
                    key: 'platinum',
                    label: '白金',
                    count: counts?.platinum ?? 0,
                    chipBg: '#e5e7eb',
                    chipFg: '#374151',
                  },
                  {
                    key: 'gold',
                    label: '金',
                    count: counts?.gold ?? 0,
                    chipBg: '#FFD700',
                    chipFg: '#7a5d00',
                  },
                  {
                    key: 'silver',
                    label: '银',
                    count: counts?.silver ?? 0,
                    chipBg: '#C0C0C0',
                    chipFg: '#374151',
                  },
                  {
                    key: 'bronze',
                    label: '铜',
                    count: counts?.bronze ?? 0,
                    chipBg: '#CD7F32',
                    chipFg: '#3b1f00',
                  },
                ] as const
              ).map((t) => {
                const title = `${t.label}：${t.count}`;
                return (
                  <div
                    key={t.key}
                    title={title}
                    className={[
                      'rounded border px-3 py-2 transition-smooth',
                      'border-neutral-200 bg-white hover:bg-neutral-50',
                      'dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="inline-flex h-6 w-6 items-center justify-center rounded"
                          style={{ backgroundColor: t.chipBg, color: t.chipFg }}
                        >
                          <TrophyIcon className="h-6 w-6" />
                        </span>
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {t.label}
                        </div>
                      </div>
                      <div className="text-lg font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
                        {t.count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between items-center gap-2">
                <span className="text-neutral-500 dark:text-neutral-400">Tier</span>
                <span className="text-neutral-700 dark:text-neutral-200 tabular-nums">{summary.tier}</span>
              </div>
              <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                <span className="text-neutral-500 dark:text-neutral-400">更新时间</span>
                <span className="text-neutral-700 dark:text-neutral-200 tabular-nums break-words sm:text-right">
                  {new Date(summary.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 card px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                最后同步奖杯的游戏
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={[
                    'h-11 text-sm px-4 rounded-full border transition-smooth',
                    'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700',
                    'dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300',
                    page <= 1 ? 'opacity-60 pointer-events-none' : '',
                  ].join(' ')}
                >
                  上一页
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={[
                    'h-11 text-sm px-4 rounded-full border transition-smooth',
                    'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700',
                    'dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300',
                    page >= totalPages ? 'opacity-60 pointer-events-none' : '',
                  ].join(' ')}
                >
                  下一页
                </button>
              </div>
            </div>

            <div className="mt-4">
              {recentLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="card w-full px-3 py-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-[66px] w-[66px] rounded shimmer shrink-0" />
                          <div className="min-w-0">
                            <div className="h-3 w-44 shimmer rounded" />
                            <div className="mt-2 h-3 w-28 shimmer rounded" />
                          </div>
                        </div>
                        <div className="w-28 shrink-0">
                          <div className="h-3 w-10 shimmer rounded ml-auto" />
                          <div className="mt-2 h-2 w-full shimmer rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentError ? (
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {recentError}
                </div>
              ) : pagedTitles.length === 0 ? (
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  暂无同步记录
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {pagedTitles.map((t) => (
                      <button
                        key={t.npCommunicationId}
                        type="button"
                        onClick={() =>
                          window.open(
                            `/psn/titles/${t.npCommunicationId}?npServiceName=${t.npServiceName}`,
                            '_blank',
                            'noopener,noreferrer'
                          )
                        }
                        className={[
                          'card w-full px-3 py-3 transition-smooth text-left',
                          'hover:bg-neutral-50 dark:hover:bg-neutral-800',
                        ].join(' ')}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="h-[66px] w-[66px] rounded overflow-hidden bg-neutral-200 dark:bg-neutral-700 shrink-0">
                              <Image
                                src={t.trophyTitleIconUrl}
                                alt={t.trophyTitleName}
                                width={66}
                                height={66}
                                sizes="66px"
                                quality={90}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                {t.trophyTitleName}
                              </div>
                              <div className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400 tabular-nums">
                                {formatSyncTime(t.lastUpdatedDateTime)}
                              </div>
                            </div>
                          </div>

                          <div className="w-28 sm:w-40 md:w-48 shrink-0">
                            <div className="mb-1 flex flex-wrap items-center justify-end gap-1 text-[10px] tabular-nums text-neutral-600 dark:text-neutral-400">
                              {t.earnedTrophies ? (
                                <>
                                  <span
                                    className="inline-flex items-center gap-1 rounded px-1.5 py-0.5"
                                    style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
                                    <span>P</span>
                                    <span>{t.earnedTrophies.platinum}</span>
                                  </span>
                                  <span
                                    className="inline-flex items-center gap-1 rounded px-1.5 py-0.5"
                                    style={{ backgroundColor: '#FFD700', color: '#7a5d00' }}
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#7a5d00' }} />
                                    <span>G</span>
                                    <span>{t.earnedTrophies.gold}</span>
                                  </span>
                                  <span
                                    className="inline-flex items-center gap-1 rounded px-1.5 py-0.5"
                                    style={{ backgroundColor: '#C0C0C0', color: '#374151' }}
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
                                    <span>S</span>
                                    <span>{t.earnedTrophies.silver}</span>
                                  </span>
                                  <span
                                    className="inline-flex items-center gap-1 rounded px-1.5 py-0.5"
                                    style={{ backgroundColor: '#CD7F32', color: '#3b1f00' }}
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#3b1f00' }} />
                                    <span>B</span>
                                    <span>{t.earnedTrophies.bronze}</span>
                                  </span>
                                </>
                              ) : (
                                <span>—</span>
                              )}
                            </div>
                            <ProgressBar
                              value={typeof t.progress === 'number' ? t.progress : null}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-center text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
                    {page} / {totalPages}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-10 flex items-center justify-center min-h-[220px]">
          <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            NO GAME
          </div>
        </div>
      )}
    </div>
  );
}

export default function ACGPage() {
  const tabs = useMemo(
    () =>
      [
        { key: 'anime' as const, label: 'Anime' },
        { key: 'comic' as const, label: 'Comic' },
        { key: 'game' as const, label: 'Game' },
      ] satisfies Array<{ key: TabKey; label: string }>,
    []
  );

  const [activeTab, setActiveTab] = useState<TabKey>('anime');
  const [visibleTab, setVisibleTab] = useState<TabKey>('anime');
  const [isFading, setIsFading] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const setTab = (next: TabKey) => {
    if (next === activeTab) return;

    setActiveTab(next);
    setIsFading(true);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setVisibleTab(next);
      setIsFading(false);
    }, 180);
  };

  const Panel = visibleTab === 'anime' ? Anime : visibleTab === 'comic' ? Comic : Game;

  return (
    <div className="content-wrapper py-12">
      <h1 className="text-3xl font-bold mb-4 fade-in-up">
        你所热爱的，便是你的生活
      </h1>

      <div className="mt-10 flex justify-center fade-in-up" style={{ animationDelay: '0.08s' }}>
        <div
          role="tablist"
          aria-label="ACG Tabs"
          className="inline-grid grid-cols-3 gap-1 rounded-full border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900 w-full max-w-xl"
        >
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="acg-panel"
                onClick={() => setTab(tab.key)}
                className={[
                  'rounded-full px-4 py-2.5 text-sm sm:text-base font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/40',
                  isActive
                    ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
                ].join(' ')}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="acg-panel"
        role="tabpanel"
        className="mt-5 flex items-center justify-center min-h-[320px] sm:min-h-[380px] card px-4 py-7 sm:px-10 sm:py-12 transition-smooth"
      >
        <div
          className={[
            'w-full min-w-0 transition-opacity duration-200 ease-out will-change-opacity',
            isFading ? 'opacity-0' : 'opacity-100',
          ].join(' ')}
        >
          <Panel />
        </div>
      </div>
    </div>
  );
}
