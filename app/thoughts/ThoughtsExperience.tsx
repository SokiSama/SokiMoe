"use client";

import {
  CalendarBlank,
  CaretRight,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { Thought } from "../data/thoughts";

const formatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
});

const tagPalette = ["pink", "purple", "blue", "green", "yellow"];

export function ThoughtsExperience({ thoughts }: { thoughts: Thought[] }) {
  const [tag, setTag] = useState("全部");
  const [month, setMonth] = useState("全部");
  const [filtering, setFiltering] = useState(false);

  const tags = useMemo(() => ["全部", ...Array.from(new Set(thoughts.flatMap((thought) => thought.tags ?? [])))], [thoughts]);
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
    return (tag === "全部" || thought.tags?.includes(tag)) && (month === "全部" || month === thoughtMonth);
  });

  const chooseTag = (nextTag: string) => {
    if (nextTag === tag) return;
    setFiltering(true);
    window.setTimeout(() => {
      setTag(nextTag);
      window.setTimeout(() => setFiltering(false), 30);
    }, 120);
  };

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
          alt="阳光下经过街角的少女与猫"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 70vw"
        />
      </header>

      <div className={`thought-list thoughts-filterable${filtering ? " is-filtering" : ""}`}>
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
      </div>
    </section>

    <aside className="thoughts-sidebar">
      <div className="thoughts-sidebar-sticky">
        <section className="thought-widget thought-months card">
          <h2><CalendarBlank weight="duotone" />月份归档</h2>
          <div className="thought-month-list">
            {months.map((item) => <button type="button" className={month === item.key ? "active" : ""} onClick={() => chooseMonth(item.key)} key={item.key}><span>{item.label}</span><em>{item.count}</em><CaretRight /></button>)}
          </div>
        </section>

        <section className="thought-widget thought-tags card">
          <h2>碎念标签</h2><p>那些小小的关键词</p>
          <div>{tags.map((item, index) => <button type="button" className={`${tagPalette[index % tagPalette.length]}${tag === item ? " active" : ""}`} onClick={() => chooseTag(item)} key={item}>{item}</button>)}</div>
        </section>
      </div>
    </aside>
  </div>;
}
