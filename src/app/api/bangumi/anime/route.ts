import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SubjectImages = {
  large?: string;
  common?: string;
  medium?: string;
  small?: string;
  grid?: string;
};

type CollectionRes = {
  data?: Array<{
    type?: number;
    ep_status?: number;
    subject?: {
      id?: number;
      name?: string;
      name_cn?: string;
      eps?: number;
      images?: SubjectImages;
    };
  }>;
};

type SubjectRes = {
  date?: string;
  tags?: Array<{ name?: string }>;
  infobox?: Array<{ key?: string; value?: unknown }>;
};

type AnimeItem = {
  id: number;
  title: string;
  cover?: string;
  statusText: string;
  progressText: string;
  year: string;
  production: string;
  tags: string[];
};

function toInt(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function collectionStatusText(type: number | undefined) {
  switch (type) {
    case 1:
      return '想看';
    case 2:
      return '看过';
    case 3:
      return '在看';
    case 4:
      return '搁置';
    case 5:
      return '抛弃';
    default:
      return '未知';
  }
}

function getCoverUrl(images: SubjectImages | undefined): string | undefined {
  return images?.medium || images?.common || images?.large || images?.small || images?.grid;
}

function parseYear(date: string | undefined) {
  const m = (date || '').match(/^(\d{4})/);
  return m?.[1] || '未知';
}

function valueToText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    const parts = value
      .map((v) => {
        if (typeof v === 'string') return v;
        if (typeof v === 'number') return String(v);
        if (v && typeof v === 'object') {
          const anyV = v as any;
          if (typeof anyV.v === 'string') return anyV.v;
          if (typeof anyV.value === 'string') return anyV.value;
          if (typeof anyV.name === 'string') return anyV.name;
        }
        return '';
      })
      .filter(Boolean);
    return parts.join(' / ');
  }
  if (value && typeof value === 'object') {
    const anyV = value as any;
    if (typeof anyV.v === 'string') return anyV.v;
    if (typeof anyV.value === 'string') return anyV.value;
    if (typeof anyV.name === 'string') return anyV.name;
  }
  return '';
}

function parseProduction(infobox: SubjectRes['infobox'] | undefined) {
  const keys = ['动画制作', '制作', '製作'];
  for (const k of keys) {
    const row = infobox?.find((i) => i.key === k);
    if (!row) continue;
    const text = valueToText(row.value).trim();
    if (text) return text;
  }
  return '未知';
}

const subjectCache = new Map<number, { expiresAt: number; data: SubjectRes }>();

async function fetchJson(url: string, headers: HeadersInit) {
  const res = await fetch(url, { headers, cache: 'no-store' });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text.slice(0, 500) || `HTTP ${res.status}`);
  }
  return JSON.parse(text) as any;
}

async function fetchSubject(id: number, headers: HeadersInit): Promise<SubjectRes> {
  const cached = subjectCache.get(id);
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.data;

  const data = (await fetchJson(`https://api.bgm.tv/v0/subjects/${id}`, headers)) as SubjectRes;
  subjectCache.set(id, { expiresAt: now + 10 * 60_000, data });
  return data;
}

async function withConcurrency<T, R>(
  items: readonly T[],
  concurrency: number,
  worker: (item: T) => Promise<R>
) {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const current = nextIndex;
      nextIndex += 1;
      if (current >= items.length) break;
      results[current] = await worker(items[current]);
    }
  });

  await Promise.all(runners);
  return results;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user =
      searchParams.get('user') ||
      searchParams.get('user_id') ||
      process.env.BANGUMI_USER_ID ||
      process.env.BANGUMI_USERNAME ||
      '1165424';

    const offset = clamp(toInt(searchParams.get('offset'), 0), 0, 5000);
    const limit = clamp(toInt(searchParams.get('limit'), 48), 1, 100);
    const subjectType = 2;

    const headers: HeadersInit = {
      'User-Agent': 'SokiMoe (Next.js)',
      Accept: 'application/json',
    };

    const token = process.env.BANGUMI_ACCESS_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const collectionsUrl = new URL(
      `https://api.bgm.tv/v0/users/${encodeURIComponent(user)}/collections`
    );
    collectionsUrl.searchParams.set('subject_type', String(subjectType));
    collectionsUrl.searchParams.set('limit', String(limit));
    collectionsUrl.searchParams.set('offset', String(offset));

    const collections = (await fetchJson(collectionsUrl.toString(), headers)) as CollectionRes;
    const entries = collections.data ?? [];

    const subjectIds = entries
      .map((e) => e.subject?.id)
      .filter((id): id is number => typeof id === 'number');

    const subjects = await withConcurrency(subjectIds, 6, (id) => fetchSubject(id, headers));
    const subjectById = new Map<number, SubjectRes>();
    for (let i = 0; i < subjectIds.length; i += 1) {
      subjectById.set(subjectIds[i], subjects[i]);
    }

    const items: AnimeItem[] = entries.flatMap((entry) => {
      const id = entry.subject?.id;
      if (!id) return [];

      const title =
        (entry.subject?.name_cn && entry.subject.name_cn.trim() !== ''
          ? entry.subject.name_cn
          : entry.subject?.name) || `#${id}`;

      const epStatus = entry.ep_status ?? 0;
      const eps = entry.subject?.eps;
      const progressText = eps ? `${epStatus}/${eps}` : `${epStatus}`;

      const subject = subjectById.get(id);
      const cover = getCoverUrl(entry.subject?.images);

      const base: Omit<AnimeItem, 'cover'> = {
        id,
        title,
        statusText: collectionStatusText(entry.type),
        progressText,
        year: parseYear(subject?.date),
        production: parseProduction(subject?.infobox),
        tags: (subject?.tags ?? [])
          .map((t) => t.name)
          .filter((t): t is string => Boolean(t && t.trim() !== '')),
      };

      return cover ? [{ ...base, cover }] : [base];
    });

    const response = NextResponse.json({ success: true, data: { items } });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Bangumi Anime 聚合接口错误', details: String(error) },
      { status: 500 }
    );
  }
}
