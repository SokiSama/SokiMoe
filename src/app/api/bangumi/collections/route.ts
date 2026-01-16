import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function toInt(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
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
    const limit = clamp(toInt(searchParams.get('limit'), 24), 1, 100);
    const subjectType = clamp(toInt(searchParams.get('subject_type'), 2), 1, 6);

    const endpoint = new URL(
      `https://api.bgm.tv/v0/users/${encodeURIComponent(user)}/collections`
    );
    endpoint.searchParams.set('subject_type', String(subjectType));
    endpoint.searchParams.set('limit', String(limit));
    endpoint.searchParams.set('offset', String(offset));

    const headers: HeadersInit = {
      'User-Agent': 'SokiMoe (Next.js)',
      Accept: 'application/json',
    };

    const token = process.env.BANGUMI_ACCESS_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(endpoint.toString(), {
      headers,
      cache: 'no-store',
    });

    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bangumi API 请求失败',
          status: res.status,
          details: text.slice(0, 500),
        },
        { status: 502 }
      );
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Bangumi API 返回非 JSON' },
        { status: 502 }
      );
    }

    const response = NextResponse.json({ success: true, data });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Bangumi API 代理错误', details: String(error) },
      { status: 500 }
    );
  }
}
