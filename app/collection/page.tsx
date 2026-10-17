"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Book, Books, FilmSlate, GameController, MagnifyingGlass, RssSimple, Television, X } from "@phosphor-icons/react";
import { JournalHeader } from "../components/JournalHeader";
import homeStyles from "../components/HomePage.module.css";
import { collection, toCollectionEntry, type AnimeResponseItem, type CollectionEntry, type CollectionKind, type GamePlatform } from "./data";
import styles from "./CollectionPage.module.css";

const sections = [
  { key: "books", label: "书籍", icon: Book, number: "01", description: "读过的文字，留下的回响。", placeholder: "搜索书名或作者…" },
  { key: "manga", label: "漫画", icon: FilmSlate, number: "02", description: "在画格之间，遇见另一个世界。", placeholder: "搜索漫画…" },
  { key: "anime", label: "追番", icon: Television, number: "03", description: "那些陪伴生活的故事与角色。", placeholder: "搜索番剧名称…" },
  { key: "games", label: "游戏", icon: GameController, number: "04", description: "存档里的冒险，手柄上的时光。", placeholder: "搜索游戏名称…" },
] as const;
const groupLabel = (entry: CollectionEntry) => entry.kind === "games" ? (entry.category === "视觉小说" ? "视觉小说" : "其他游戏") : entry.kind === "anime" ? entry.status : entry.category;

function CollectionCard({ entry, onSelect }: { entry: CollectionEntry; onSelect: (entry: CollectionEntry) => void }) {
  return <button className={styles.entry} type="button" onClick={() => onSelect(entry)} aria-label={`查看 ${entry.title} 详情`}>
    <span className={`${styles.cover} ${entry.kind === "games" ? styles.gameCover : ""}`}>
      <Image src={entry.cover} alt={`${entry.title} 封面`} width={240} height={entry.kind === "games" ? 360 : 336} sizes="(max-width: 680px) 42vw, (max-width: 1100px) 20vw, 156px" unoptimized />
      {(entry.kind === "books" || entry.kind === "manga") && <span className={styles.badge} title={entry.status}><Books size={13} /></span>}
    </span>
    <strong>{entry.title}</strong>
    {entry.kind === "anime" ? <span className={styles.progress}>{entry.status}</span> : entry.kind !== "games" && <span className={styles.progress}>{entry.progress}</span>}
  </button>;
}

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
      <div className={styles.detailText}>
        <span>{entry.kind === "anime" ? entry.status : `${groupLabel(entry)} · ${entry.status}`}</span>
        <h2 id="collection-detail-title">{entry.title}</h2>
        {(entry.kind === "books" || entry.kind === "manga") && <p>{entry.progress}</p>}
        <section className={styles.summary} aria-labelledby="collection-summary-title">
          <h3 id="collection-summary-title">{entry.kind === "games" ? "游戏简介" : "作品简介"}</h3>
          <p>{entry.summary || (entry.summaryUnavailable ? "简介暂时无法读取，请稍后重试。" : "暂未提供这部作品的简介。")}</p>
        </section>
        <a href={entry.url} target="_blank" rel="noreferrer">{entry.kind === "anime" ? "Bangumi 作品页面" : entry.kind === "games" ? (entry.steamAppId ? "Steam 商店页面" : "在 PlayStation 商店查找") : "作品页面"}<ArrowUpRight size={16} /></a>
      </div>
    </div>}
  </dialog>;
}

export default function CollectionPage() {
  const [kind, setKind] = useState<CollectionKind>("anime");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [status, setStatus] = useState("全部");
  const [platform, setPlatform] = useState("全部");
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
  const categories = kind === "anime" ? ["看过", "未看"] : [...new Set(entries.map(groupLabel))];
  const statusOptions = kind === "anime" ? ["全部", "看过", "未看"] : ["全部", ...new Set(entries.map(item => item.status))];
  const platforms = [...new Set(entries.flatMap(item => item.platforms ?? []))].sort();
  const visible = entries.filter(item => (category === "全部" || category === groupLabel(item)) && (status === "全部" || status === item.status) && (platform === "全部" || item.platforms?.includes(platform as GamePlatform)) && [item.title, item.originalTitle, item.progress, groupLabel(item), ...(item.platforms ?? [])].join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const groups = categories.map(label => ({ label, entries: visible.filter(item => groupLabel(item) === label) })).filter(group => group.entries.length > 0);
  const animePending = kind === "anime" && (loading || error);

  return <div className={`${homeStyles.home} ${styles.page}`} id="top">
    <JournalHeader active="collection" />
    <main className={styles.main}>
      <aside className={styles.sidebar} aria-label="品鉴分类">
        <div className={styles.sideTitle}><h1>品鉴</h1><span>COLLECTION</span></div>
        <p className={styles.sideLabel}>馆藏</p>
        <nav className={styles.tabs} aria-label="馆藏分类">{sections.map(({ key, label, icon: Icon }) => <button type="button" key={key} aria-pressed={kind === key} onClick={() => { setKind(key); setQuery(""); setCategory("全部"); setStatus("全部"); setPlatform("全部"); }}><Icon size={18} /><span>{label}</span><small>{key === "anime" && loading ? "…" : allEntries.filter(item => item.kind === key).length}</small></button>)}</nav>
      </aside>
      <div className={styles.content}>
        <header className={styles.intro} data-reveal><span>COLLECTION · {section.number}</span><h2>{section.label}</h2><p>{section.description}</p></header>
        <div className={styles.stats}><span><strong>{animePending ? "—" : entries.length}</strong>{kind === "anime" ? "部收藏" : kind === "games" ? "款收藏" : "本收藏"}</span>{kind === "anime" ? ["看过", "未看"].map(label => <span key={label}><strong>{animePending ? "—" : entries.filter(item => item.status === label).length}</strong>部{label}</span>) : <span><strong>{categories.length}</strong>个类型</span>}</div>
        <label className={styles.search}><MagnifyingGlass size={18} aria-hidden="true" /><input type="search" aria-label={`搜索${section.label}`} placeholder={section.placeholder} value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" onClick={() => setQuery("")} aria-label="清空搜索"><X size={16} /></button>}</label>
        {entries.length > 0 && <div className={styles.filters}>
          {kind !== "anime" && <div className={styles.filterGroup} role="group" aria-label="类型筛选"><span>类型</span>{["全部", ...categories].map(label => <button type="button" key={label} aria-pressed={category === label} onClick={() => setCategory(label)}>{label}</button>)}</div>}
          {kind !== "games" && <div className={styles.filterGroup} role="group" aria-label="状态筛选"><span>状态</span>{statusOptions.map(label => <button type="button" key={label} aria-pressed={status === label} onClick={() => setStatus(label)}>{label}</button>)}</div>}
          {kind === "games" && <div className={styles.filterGroup} role="group" aria-label="平台筛选"><span>平台</span>{["全部", ...platforms].map(label => <button type="button" key={label} aria-pressed={platform === label} onClick={() => setPlatform(label)}>{label}</button>)}</div>}
        </div>}
        <div className={styles.shelf} aria-label={`${section.label}${kind === "anime" ? "观看状态" : "类型"}分组`} aria-live="polite">
          {animePending ? <div className={styles.empty} role="status"><Books size={34} weight="light" /><h3>{loading ? "正在读取 Bangumi 全部收藏…" : error}</h3>{!loading && <button type="button" onClick={() => { setLoading(true); setError(""); setRetry(value => value + 1); }}>重新加载</button>}</div> : visible.length ? groups.map((group, index) => <section className={styles.shelfGroup} key={group.label} aria-labelledby={`collection-group-${index}`}>
            <header className={styles.groupTitle}><h3 id={`collection-group-${index}`}>{group.label}</h3><span>（{group.entries.length}）</span><i aria-hidden="true" /></header>
            <div className={styles.grid} data-reveal-group>{group.entries.map(item => <CollectionCard key={item.id} entry={item} onSelect={setSelected} />)}</div>
          </section>) : <div className={styles.empty}><Books size={34} weight="light" /><h3>{entries.length ? "没有找到匹配的作品" : `还没有收录${section.label}`}</h3><p>{entries.length ? "试试其他关键词，或调整筛选条件。" : "慢慢收集，慢慢记录。"}</p>{entries.length > 0 && <button type="button" onClick={() => { setQuery(""); setCategory("全部"); setStatus("全部"); setPlatform("全部"); }}>重置筛选</button>}</div>}
        </div>
      </div>
    </main>
    <footer className={homeStyles.footer}><p>© 2025–{new Date().getFullYear()} Soki Sugar Life<span>·</span><a href="https://icp.gov.moe/?keyword=20263015" target="_blank" rel="noreferrer">萌ICP备20263015号</a></p><a href="/api/rss"><RssSimple size={18} />RSS 订阅</a></footer>
    <EntryDetails entry={selected} onClose={() => setSelected(null)} />
  </div>;
}
