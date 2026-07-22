import { NextRequest, NextResponse } from "next/server";

export const revalidate = 86_400;

type WikimediaPage = {
  thumbnail?: { source?: string };
  titles?: { canonical?: string; normalized?: string; display?: string };
  content_urls?: { desktop?: { page?: string } };
};

type WikimediaEvent = {
  year?: number;
  text?: string;
  pages?: WikimediaPage[];
};

type WikimediaResponse = { events?: WikimediaEvent[] };

const cacheHeaders = {
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
};

function dateHash(value: string) {
  let hash = 2_166_136_261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
}

function textLength(value: string) {
  return Array.from(value.replace(/\s+/g, "")).length;
}

function pageUrl(page?: WikimediaPage) {
  if (page?.content_urls?.desktop?.page) return page.content_urls.desktop.page;
  const title = page?.titles?.canonical || page?.titles?.normalized;
  return title ? `https://zh.wikipedia.org/wiki/${encodeURIComponent(title)}` : "https://zh.wikipedia.org/";
}

export async function GET(request: NextRequest) {
  const requestedDate = request.nextUrl.searchParams.get("date") ?? "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(requestedDate);
  const fallback = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const date = match ? requestedDate : fallback;
  const [, month, day] = date.split("-");

  try {
    const response = await fetch(`https://zh.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`, {
      headers: {
        Accept: "application/json",
        "Api-User-Agent": "SokiSugarLife/1.0 (https://https-blog-skk-moe.vercel.app)",
      },
      next: { revalidate: 86_400 },
    });
    if (!response.ok) throw new Error(`Wikimedia API returned ${response.status}`);

    const payload = await response.json() as WikimediaResponse;
    const events = (payload.events ?? []).filter((event) => event.text?.trim() && event.pages?.length);
    const ideal = events.filter((event) => {
      const length = textLength(event.text ?? "");
      return length >= 25 && length <= 100 && event.pages?.some((page) => page.thumbnail?.source);
    });
    const withImages = events.filter((event) => event.pages?.some((page) => page.thumbnail?.source));
    const lengthMatched = events.filter((event) => {
      const length = textLength(event.text ?? "");
      return length >= 25 && length <= 100;
    });
    const candidates = ideal.length ? ideal : withImages.length ? withImages : lengthMatched.length ? lengthMatched : events;
    const modern = candidates.filter((event) => (event.year ?? 0) >= 1800);
    const pool = modern.length ? modern : candidates;
    if (!pool.length) throw new Error("No events available");

    const selected = pool[dateHash(date) % pool.length];
    const page = selected.pages?.find((item) => item.thumbnail?.source) ?? selected.pages?.[0];
    return NextResponse.json({
      ok: true,
      event: {
        year: selected.year ?? null,
        text: selected.text?.trim(),
        thumbnail: page?.thumbnail?.source ?? null,
        url: pageUrl(page),
      },
    }, { headers: cacheHeaders });
  } catch {
    return NextResponse.json({ ok: false, event: null }, { status: 200, headers: cacheHeaders });
  }
}
