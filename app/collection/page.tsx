"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Book, Books, Check, FilmSlate, MagnifyingGlass, RssSimple, Television, X } from "@phosphor-icons/react";
import { JournalHeader } from "../components/JournalHeader";
import homeStyles from "../components/HomePage.module.css";
import { collection, toCollectionEntry, type AnimeResponseItem, type CollectionEntry, type CollectionKind } from "./data";
import styles from "./CollectionPage.module.css";

const sections = [
  { key: "books", label: "书籍", icon: Book, number: "01", description: "读过的文字，留下的回响。", placeholder: "搜索书名或作者…" },
  { key: "manga", label: "漫画", icon: FilmSlate, number: "02", description: "在画格之间，遇见另一个世界。", placeholder: "搜索漫画…" },
  { key: "anime", label: "追番", icon: Television, number: "03", description: "那些陪伴生活的故事与角色。", placeholder: "搜索番剧名称…" },
] as const;
const statuses = ["全部", "在看", "想看", "看过", "搁置", "抛弃"] as const;

function EntryDetails({ entry, onClose }: { entry: CollectionEntry | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (entry) dialog.current?.showModal();
    else dialog.current?.close();
  }, [entry]);

  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="collection-detail-title" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    {entry && <div className={styles.detail}>
      <button type="button" className={styles.closeButton} onClick={onClose} aria-label="关闭作品详情"><X size={22} /></button>
      <Image src={entry.cover} alt={`${entry.title} 封面`} width={320} height={448} className={styles.detailCover} unoptimized />
      <div className={styles.detailText}><span>{entry.category} · {entry.status}</span><h2 id="collection-detail-title">{entry.title}</h2><p>{entry.progress}</p><section className={styles.summary} aria-labelledby="collection-summary-title"><h3 id="collection-summary-title">作品简介</h3><p>{entry.summary || (entry.summaryUnavailable ? "简介暂时无法读取，请稍后重试。" : "暂未提供这部作品的简介。")}</p></section><a href={entry.url} target="_blank" rel="noreferrer">{entry.kind === "anime" ? "Bangumi 作品页面" : "作品页面"}<ArrowUpRight size={16} /></a></div>
    </div>}
  </dialog>;
}

export default function CollectionPage() {
  const [kind, setKind] = useState<CollectionKind>("anime");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [status, setStatus] = useState("全部");
  const [selected, setSelected] = useState<CollectionEntry | null>(null);
  const [anime, setAnime] = useState<CollectionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/bangumi/anime", { signal: controller.signal, cache: "no-store" })
      .then(async response => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error("追番收藏暂时无法读取");
        return result.data.items as AnimeResponseItem[];
      })
      .then(items => { setAnime(items.map(toCollectionEntry)); setError(""); setLoading(false); })
      .catch(reason => { if (!controller.signal.aborted) { setError(reason instanceof Error ? reason.message : "追番收藏暂时无法读取"); setLoading(false); } });
    return () => controller.abort();
  }, [retry]);
  const allEntries = [...collection, ...anime];
  const section = sections.find(item => item.key === kind)!;
  const entries = allEntries.filter(item => item.kind === kind);
  const categories = [...new Set(entries.map(item => item.category))];
  const statusOptions = kind === "anime" ? statuses : ["全部", ...new Set(entries.map(item => item.status))];
  const visible = entries.filter(item => (category === "全部" || category === item.category) && (status === "全部" || status === item.status) && [item.title, item.originalTitle, item.progress].join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const animePending = kind === "anime" && (loading || error);

  return <div className={`${homeStyles.home} ${styles.page}`} id="top">
    <JournalHeader active="collection" />
    <main className={styles.main}>
      <aside className={styles.sidebar} aria-label="品鉴分类">
        <div className={styles.sideTitle}><h1>品鉴</h1><span>COLLECTION</span></div>
        <p className={styles.sideLabel}>馆藏</p>
        <nav className={styles.tabs} aria-label="馆藏分类">{sections.map(({ key, label, icon: Icon }) => <button type="button" key={key} aria-pressed={kind === key} onClick={() => { setKind(key); setQuery(""); setCategory("全部"); setStatus("全部"); }}><Icon size={18} /><span>{label}</span><small>{key === "anime" && loading ? "…" : allEntries.filter(item => item.kind === key).length}</small></button>)}</nav>
      </aside>
      <div className={styles.content}>
        <header className={styles.intro}><span>COLLECTION · {section.number}</span><h2>{section.label}</h2><p>{section.description}</p></header>
        <div className={styles.stats}><span><strong>{animePending ? "—" : entries.length}</strong>{kind === "anime" ? "部收藏" : "本收藏"}</span>{kind === "anime" && <span><strong>{animePending ? "—" : entries.filter(item => item.status === "在看").length}</strong>部在看</span>}<span><strong>{animePending ? "—" : categories.length}</strong>个类型</span></div>
        <label className={styles.search}><MagnifyingGlass size={18} aria-hidden="true" /><input type="search" aria-label={`搜索${section.label}`} placeholder={section.placeholder} value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" onClick={() => setQuery("")} aria-label="清空搜索"><X size={16} /></button>}</label>
        {entries.length > 0 && <div className={styles.filters}>
          <div className={styles.filterGroup} role="group" aria-label="类型筛选"><span>类型</span>{["全部", ...categories].map(label => <button type="button" key={label} aria-pressed={category === label} onClick={() => setCategory(label)}>{label}</button>)}</div>
          <div className={styles.filterGroup} role="group" aria-label="状态筛选"><span>状态</span>{statusOptions.map(label => <button type="button" key={label} aria-pressed={status === label} onClick={() => setStatus(label)}>{label}</button>)}</div>
        </div>}
        <section className={styles.shelf} aria-labelledby="collection-group-title" aria-live="polite">
          <header className={styles.groupTitle}><h3 id="collection-group-title">{category === "全部" ? `全部${section.label}` : category}</h3><span>（{animePending ? "…" : visible.length}）</span><i aria-hidden="true" /></header>
          {animePending ? <div className={styles.empty} role="status"><Books size={34} weight="light" /><h3>{loading ? "正在读取 Bangumi 全部收藏…" : error}</h3>{!loading && <button type="button" onClick={() => { setLoading(true); setError(""); setRetry(value => value + 1); }}>重新加载</button>}</div> : visible.length ? <div className={styles.grid}>{visible.map(item => <button className={styles.entry} key={item.id} type="button" onClick={() => setSelected(item)} aria-label={`查看 ${item.title} 详情`}>
            <span className={styles.cover}><Image src={item.cover} alt={`${item.title} 封面`} width={240} height={336} sizes="(max-width: 680px) 42vw, (max-width: 1100px) 20vw, 156px" unoptimized /><span className={styles.badge} title={item.status}>{item.status === "看过" ? <Check size={13} weight="bold" /> : item.status === "在看" ? <Television size={13} weight="bold" /> : <Books size={13} />}</span></span>
            <strong>{item.title}</strong><span className={styles.progress}>{item.progress}</span>
          </button>)}</div> : <div className={styles.empty}><Books size={34} weight="light" /><h3>{entries.length ? "没有找到匹配的作品" : `还没有收录${section.label}`}</h3><p>{entries.length ? "试试其他关键词，或调整筛选条件。" : "慢慢收集，慢慢记录。"}</p>{entries.length > 0 && <button type="button" onClick={() => { setQuery(""); setCategory("全部"); setStatus("全部"); }}>重置筛选</button>}</div>}
        </section>
      </div>
    </main>
    <footer className={homeStyles.footer}><p>© 2025–{new Date().getFullYear()} Soki Sugar Life<span>·</span><a href="https://icp.gov.moe/?keyword=20263015" target="_blank" rel="noreferrer">萌ICP备20263015号</a></p><a href="/api/rss"><RssSimple size={18} />RSS 订阅</a></footer>
    <EntryDetails entry={selected} onClose={() => setSelected(null)} />
  </div>;
}
