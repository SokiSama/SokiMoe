"use client";

import {
  CalendarBlank,
  CaretRight,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { RandomQuote } from "../components/RandomQuote";
import type { Thought } from "../data/thoughts";
import { ProfileCard } from "./ProfileCard";
import { Timeline, type TimelineItem } from "./Timeline";

const formatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
});
const shanghaiDateFormatter = new Intl.DateTimeFormat("en", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const ONE_DAY = 24 * 60 * 60 * 1000;

function getShanghaiDay(date: Date) {
  const parts = shanghaiDateFormatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  return Date.UTC(year, month - 1, day) / ONE_DAY;
}

export function ThoughtsExperience({ thoughts }: { thoughts: Thought[] }) {
  const [month, setMonth] = useState("全部");
  const [filtering, setFiltering] = useState(false);

  const months = useMemo(() => {
    const counts = new Map<string, number>();
    thoughts.forEach((thought) => {
      const date = new Date(thought.publishedAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return Array.from(counts, ([key, count]) => {
      const [year, monthNumber] = key.split("-");
      return { key, count, label: `${year}年${Number(monthNumber)}月` };
    }).sort((a, b) => b.key.localeCompare(a.key));
  }, [thoughts]);
  const visibleThoughts = thoughts.filter((thought) => {
    const date = new Date(thought.publishedAt);
    const thoughtMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return month === "全部" || month === thoughtMonth;
  });
  const timelineItems: TimelineItem[] = visibleThoughts.map((thought) => {
    const date = new Date(thought.publishedAt);
    const now = new Date();
    return {
      id: thought.id,
      date: `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`,
      year: String(date.getFullYear()),
      week: new Intl.DateTimeFormat("zh-CN", { weekday: "short" }).format(date),
      isToday: date.toDateString() === now.toDateString(),
    };
  });
  const recordDays = useMemo(() => {
    if (thoughts.length === 0) return 0;

    const firstRecordedDay = Math.min(
      ...thoughts.map((thought) => getShanghaiDay(new Date(thought.publishedAt))),
    );

    return Math.max(1, getShanghaiDay(new Date()) - firstRecordedDay + 1);
  }, [thoughts]);

  const chooseMonth = (nextMonth: string) => {
    if (nextMonth === month) return;
    setFiltering(true);
    window.setTimeout(() => {
      setMonth(nextMonth);
      window.setTimeout(() => setFiltering(false), 30);
    }, 120);
  };

  return <div className="thoughts-layout">
    <section className="thoughts-main-column">
      <header className="thoughts-hero">
        <div className="thoughts-hero__copy">
          <span>THOUGHTS IN THE WORLD</span>
          <h1>碎念，是时光的轻声回响</h1>
          <p>生活的点滴想法，记录当下的心情与思考。</p>
          <i aria-hidden="true" />
        </div>
        <Image
          className="thoughts-hero__image"
          src="/thoughts-hero.png"
          alt="蓝天下相对而立的两位少女"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 70vw"
        />
      </header>

      <Timeline
        className={`thought-list thoughts-filterable${filtering ? " is-filtering" : ""}`}
        items={timelineItems}
      >
        {visibleThoughts.map((thought) => <article className="thought-card card" key={thought.id}>
          <header className="thought-card__header">
            <Image className="thought-card__avatar" src="/about-avatar.png" alt="Soki" width={46} height={46} />
            <div><strong>Soki</strong><time dateTime={thought.publishedAt}>{formatter.format(new Date(thought.publishedAt))}</time></div>
          </header>
          <p className="thought-card__content">{thought.content}</p>
          {thought.images?.length ? <div className={`thought-card__media count-${Math.min(thought.images.length, 4)}`}>
            {thought.images.map((image) => <Image src={image} alt="碎念配图" width={1600} height={700} sizes="(max-width: 900px) 100vw, 65vw" key={image} />)}
          </div> : null}
        </article>)}
      </Timeline>
    </section>

    <aside className="thoughts-sidebar">
      <div className="thoughts-sidebar-sticky">
        <ProfileCard thoughtCount={thoughts.length} recordDays={recordDays} />
        <RandomQuote />

        <section className="thought-widget thought-months card">
          <h2><CalendarBlank weight="duotone" />月份归档</h2>
          <div className="thought-month-list">
            {months.map((item) => <button type="button" className={month === item.key ? "active" : ""} onClick={() => chooseMonth(item.key)} key={item.key}><span>{item.label}</span><em>{item.count}</em><CaretRight /></button>)}
          </div>
        </section>
      </div>
    </aside>
  </div>;
}
