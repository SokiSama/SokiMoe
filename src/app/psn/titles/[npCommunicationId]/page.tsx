'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';

type TrophyCounts = {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
};

type TrophyGroupRow = {
  trophyGroupId: string;
  trophyGroupName: string;
  trophyGroupIconUrl: string;
  definedTrophies: TrophyCounts;
  progress: number;
  earnedTrophies: TrophyCounts;
  lastUpdatedDateTime: string | null;
};

type TitleDetail = {
  trophyTitleName: string;
  trophyTitleIconUrl: string;
  trophyTitlePlatform: string;
  trophySetVersion: string;
  progress: number;
  earnedTrophies: TrophyCounts;
  lastUpdatedDateTime: string;
  trophyGroups: TrophyGroupRow[];
};

export default function PsnTitlePage({
  params,
  searchParams,
}: {
  params: { npCommunicationId: string };
  searchParams?: { npServiceName?: string };
}) {
  const npServiceName = searchParams?.npServiceName === 'trophy2' ? 'trophy2' : 'trophy';
  const { npCommunicationId } = params;

  const [data, setData] = useState<TitleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2_800);
    try {
      const res = await fetch(
        `/api/psn/trophies?mode=title&npCommunicationId=${encodeURIComponent(npCommunicationId)}&npServiceName=${npServiceName}`,
        { cache: 'no-store', signal: controller.signal }
      );
      const json = (await res.json()) as
        | { success: true; data: TitleDetail }
        | { success: false; error?: string };
      if (!res.ok || !json.success) {
        throw new Error(('error' in json && json.error) || `请求失败(${res.status})`);
      }
      setData(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setData(null);
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  }, [npCommunicationId, npServiceName]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  const maxGroupProgress = useMemo(() => {
    const list = data?.trophyGroups || [];
    return Math.max(...list.map((g) => g.progress), 100);
  }, [data?.trophyGroups]);

  return (
    <div className="content-wrapper py-12">
      {loading ? (
        <div className="card px-6 py-10">
          <div className="h-6 w-1/2 shimmer rounded" />
          <div className="mt-4 h-4 w-2/3 shimmer rounded" />
          <div className="mt-8 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 shimmer rounded" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="card px-6 py-10">
          <div className="text-neutral-900 dark:text-neutral-100 font-medium">加载失败</div>
          <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{error}</div>
          <button
            type="button"
            onClick={() => fetchDetail()}
            className="mt-6 text-xs sm:text-sm px-3 py-1.5 rounded-full border transition-smooth border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            重试
          </button>
        </div>
      ) : data ? (
        <div className="card px-6 py-8">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0">
              <Image
                src={data.trophyTitleIconUrl}
                alt={data.trophyTitleName}
                width={64}
                height={64}
                sizes="64px"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 break-words">
                {data.trophyTitleName}
              </div>
              <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {data.trophyTitlePlatform} · 版本 {data.trophySetVersion} · 完成 {data.progress}%
              </div>
              <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
                最后同步：{new Date(data.lastUpdatedDateTime).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">奖杯组</div>
            <div className="mt-4 space-y-3">
              {data.trophyGroups.map((g) => (
                <div key={g.trophyGroupId} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0">
                    <Image
                      src={g.trophyGroupIconUrl}
                      alt={g.trophyGroupName}
                      width={40}
                      height={40}
                      sizes="40px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm text-neutral-900 dark:text-neutral-100 truncate">
                        {g.trophyGroupName}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums shrink-0">
                        {g.progress}%
                      </div>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-300 ease-out"
                        style={{ width: `${Math.round((g.progress / maxGroupProgress) * 100)}%` }}
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400 tabular-nums">
                      白金 {g.earnedTrophies.platinum} · 金 {g.earnedTrophies.gold} · 银 {g.earnedTrophies.silver} ·
                      铜 {g.earnedTrophies.bronze}
                      {g.lastUpdatedDateTime ? ` · 更新 ${new Date(g.lastUpdatedDateTime).toLocaleString()}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card px-6 py-10">
          <div className="text-neutral-900 dark:text-neutral-100 font-medium">无数据</div>
        </div>
      )}
    </div>
  );
}
