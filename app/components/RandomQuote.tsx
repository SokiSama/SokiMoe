"use client";

import { Quotes } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type QuoteData = {
  hitokoto: string;
  from: string;
};

type QuoteCache = QuoteData & {
  cachedAt: number;
};

const CACHE_KEY = "quote_cache";
const CACHE_TTL = 6 * 60 * 60 * 1000;
const FALLBACK_QUOTE: QuoteData = {
  hitokoto: "愿每一次驻足，都能遇见温柔的风景。",
  from: "Soki Sugar Life",
};

let quoteRequest: Promise<QuoteData> | null = null;

function readCachedQuote(): QuoteData | null {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null") as
      | QuoteCache
      | null;

    if (
      cached &&
      typeof cached.hitokoto === "string" &&
      typeof cached.from === "string" &&
      typeof cached.cachedAt === "number" &&
      Date.now() - cached.cachedAt < CACHE_TTL
    ) {
      return { hitokoto: cached.hitokoto, from: cached.from };
    }
  } catch {
    localStorage.removeItem(CACHE_KEY);
  }

  return null;
}

function cacheQuote(quote: QuoteData) {
  try {
    const payload: QuoteCache = { ...quote, cachedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // The quote still works when storage is unavailable.
  }
}

function requestQuote() {
  if (!quoteRequest) {
    quoteRequest = fetch("https://v1.hitokoto.cn/", {
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Hitokoto returned ${response.status}`);
        const result = (await response.json()) as Partial<QuoteData>;
        if (!result.hitokoto || !result.from) throw new Error("Invalid quote data");
        return { hitokoto: result.hitokoto, from: result.from };
      })
      .catch(() => FALLBACK_QUOTE);
  }

  return quoteRequest;
}

export function RandomQuote() {
  const [quote, setQuote] = useState<QuoteData>(FALLBACK_QUOTE);

  useEffect(() => {
    let active = true;
    const cached = readCachedQuote();
    if (cached) {
      queueMicrotask(() => {
        if (active) setQuote(cached);
      });
    } else {
      void requestQuote().then((nextQuote) => {
        cacheQuote(nextQuote);
        if (active) setQuote(nextQuote);
      });
    }

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      className="random-quote-card card"
      aria-live="polite"
    >
      <h2>
        <Quotes weight="fill" aria-hidden="true" />
        一言
      </h2>
      <blockquote>「{quote.hitokoto}」</blockquote>
      <p>——《{quote.from}》</p>
    </section>
  );
}
