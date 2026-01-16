import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeAccessCodeForAuthTokens,
  exchangeNpssoForAccessCode,
  exchangeRefreshTokenForAuthTokens,
  getProfileFromAccountId,
  getUserTitles,
  getUserTrophyProfileSummary,
  getTitleTrophyGroups,
  getUserTrophyGroupEarningsForTitle,
  type AuthTokensResponse,
} from 'psn-api';

import { mapUserTrophyProfileSummary, type PsnTrophySummary } from '@/lib/psn';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type AuthCache = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
};

type SummaryCache = {
  data: PsnTrophySummary;
  expiresAt: number;
};

type GlobalPsnCache = {
  __psnAuthCache?: AuthCache;
  __psnSummaryCache?: SummaryCache;
  __psnTitlesCache?: Record<string, { data: unknown; expiresAt: number }>;
  __psnTitleDetailCache?: Record<string, { data: unknown; expiresAt: number }>;
};

function getGlobalCache() {
  return globalThis as unknown as GlobalPsnCache;
}

function saveAuth(cache: AuthTokensResponse) {
  const now = Date.now();
  const accessTokenExpiresAt = now + Math.max(0, cache.expiresIn - 30) * 1000;
  const refreshTokenExpiresAt = now + Math.max(0, cache.refreshTokenExpiresIn - 60) * 1000;
  getGlobalCache().__psnAuthCache = {
    accessToken: cache.accessToken,
    refreshToken: cache.refreshToken,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
  };
}

async function getAuthTokens() {
  const now = Date.now();
  const cached = getGlobalCache().__psnAuthCache;
  if (cached && cached.accessTokenExpiresAt > now) return cached;

  if (cached && cached.refreshTokenExpiresAt > now) {
    const refreshed = await exchangeRefreshTokenForAuthTokens(cached.refreshToken);
    saveAuth(refreshed);
    return getGlobalCache().__psnAuthCache as AuthCache;
  }

  const npsso = process.env.PSN_NPSSO || process.env.PSN_TOKEN;
  if (!npsso) {
    throw new Error('PSN_TOKEN_MISSING');
  }

  const accessCode = await exchangeNpssoForAccessCode(npsso);
  const tokens = await exchangeAccessCodeForAuthTokens(accessCode);
  saveAuth(tokens);
  return getGlobalCache().__psnAuthCache as AuthCache;
}

function toInt(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = (searchParams.get('mode') || 'summary').toLowerCase();

  try {
    const auth = await getAuthTokens();

    if (mode === 'titles') {
      const limit = clamp(toInt(searchParams.get('limit'), 50), 1, 800);
      const offset = clamp(toInt(searchParams.get('offset'), 0), 0, 10_000);
      const cacheKey = `${limit}:${offset}`;
      const now = Date.now();
      const cache = getGlobalCache().__psnTitlesCache || (getGlobalCache().__psnTitlesCache = {});
      const cached = cache[cacheKey];
      if (cached && cached.expiresAt > now) {
        const response = NextResponse.json({ success: true, data: cached.data });
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        return response;
      }

      const data = await getUserTitles({ accessToken: auth.accessToken }, 'me', { limit, offset });
      cache[cacheKey] = { data, expiresAt: now + 60_000 };

      const response = NextResponse.json({ success: true, data });
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return response;
    }

    if (mode === 'title') {
      const npCommunicationId = searchParams.get('npCommunicationId') || '';
      const npServiceName = searchParams.get('npServiceName') || '';
      if (!npCommunicationId || (npServiceName !== 'trophy' && npServiceName !== 'trophy2')) {
        return NextResponse.json({ success: false, error: '参数错误' }, { status: 400 });
      }

      const now = Date.now();
      const cache = getGlobalCache().__psnTitleDetailCache || (getGlobalCache().__psnTitleDetailCache = {});
      const cacheKey = `${npServiceName}:${npCommunicationId}`;
      const cached = cache[cacheKey];
      if (cached && cached.expiresAt > now) {
        const response = NextResponse.json({ success: true, data: cached.data });
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        return response;
      }

      const [groups, earnings] = await Promise.all([
        getTitleTrophyGroups({ accessToken: auth.accessToken }, npCommunicationId, {
          npServiceName: npServiceName as 'trophy' | 'trophy2',
        }),
        getUserTrophyGroupEarningsForTitle({ accessToken: auth.accessToken }, 'me', npCommunicationId, {
          npServiceName: npServiceName as 'trophy' | 'trophy2',
        }),
      ]);

      const merged = groups.trophyGroups.map((g) => {
        const e = earnings.trophyGroups.find((x) => x.trophyGroupId === g.trophyGroupId);
        return {
          trophyGroupId: g.trophyGroupId,
          trophyGroupName: g.trophyGroupName,
          trophyGroupIconUrl: g.trophyGroupIconUrl,
          definedTrophies: g.definedTrophies,
          progress: e?.progress ?? 0,
          earnedTrophies: e?.earnedTrophies ?? { bronze: 0, silver: 0, gold: 0, platinum: 0 },
          lastUpdatedDateTime: e?.lastUpdatedDateTime ?? null,
        };
      });

      const data = {
        trophyTitleName: groups.trophyTitleName,
        trophyTitleIconUrl: groups.trophyTitleIconUrl,
        trophyTitlePlatform: groups.trophyTitlePlatform,
        trophySetVersion: groups.trophySetVersion,
        progress: earnings.progress,
        earnedTrophies: earnings.earnedTrophies,
        lastUpdatedDateTime: earnings.lastUpdatedDateTime,
        trophyGroups: merged,
      };

      cache[cacheKey] = { data, expiresAt: now + 60_000 };
      const response = NextResponse.json({ success: true, data });
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return response;
    }

    const summaryCache = getGlobalCache().__psnSummaryCache;
    const now = Date.now();
    if (summaryCache && summaryCache.expiresAt > now) {
      const response = NextResponse.json({ success: true, data: summaryCache.data });
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return response;
    }

    const raw = await getUserTrophyProfileSummary({ accessToken: auth.accessToken }, 'me');
    const mapped = mapUserTrophyProfileSummary(raw);
    const profile = await getProfileFromAccountId({ accessToken: auth.accessToken }, raw.accountId);
    const avatarUrl =
      (profile?.avatars || []).find((a) => a.size === '40x40')?.url ??
      (profile?.avatars || [])[0]?.url ??
      null;

    const data: PsnTrophySummary = {
      ...mapped,
      profile: profile?.onlineId
        ? {
            onlineId: profile.onlineId,
            avatarUrl,
          }
        : undefined,
    };

    getGlobalCache().__psnSummaryCache = { data, expiresAt: now + 60_000 };

    const response = NextResponse.json({ success: true, data });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const code =
      message === 'PSN_TOKEN_MISSING'
        ? 500
        : message.toLowerCase().includes('unauthorized') || message.includes('401')
          ? 401
          : 500;

    if (code !== 500) getGlobalCache().__psnAuthCache = undefined;
    console.error('[psn] sync failed:', message);

    return NextResponse.json(
      {
        success: false,
        error:
          message === 'PSN_TOKEN_MISSING'
            ? 'PSN Token 未配置：请在 .env.local 设置 PSN_NPSSO 或 PSN_TOKEN 后重启服务'
            : code === 401
              ? 'PSN Token 失效或无权限'
              : 'PSN 同步失败',
      },
      { status: code }
    );
  }
}
