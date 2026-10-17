"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Aperture, ArrowsOut, CaretLeft, CaretRight, SquaresFour, X } from "@phosphor-icons/react";
import { JournalHeader } from "../components/JournalHeader";
import { photoThumbnail, vrcPhotos } from "../data/vrcPhotos";
import homeStyles from "../components/HomePage.module.css";
import styles from "./SerendipityPage.module.css";

const number = (index: number) => String(index + 1).padStart(2, "0");
const views = [
  { key: "wall", label: "照片墙", icon: SquaresFour },
  { key: "focus", label: "专注", icon: Aperture },
] as const;

export function SerendipityGallery() {
  const [view, setView] = useState<(typeof views)[number]["key"]>("wall");
  const [index, setIndex] = useState(0);
  const [enlarged, setEnlarged] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const photo = vrcPhotos[index];
  const previous = index > 0;
  const next = index < vrcPhotos.length - 1;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (view !== "focus" && !enlarged) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof Element && event.target.closest("header, input, textarea, select, [contenteditable=true]")) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const direction = event.key === "ArrowLeft" ? -1 : 1;
        setIndex(current => Math.max(0, Math.min(vrcPhotos.length - 1, current + direction)));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [view, enlarged]);

  useEffect(() => {
    if (!enlarged || !dialog.current) return;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = overflow; };
  }, [enlarged]);

  const openPhoto = (position: number) => { setIndex(position); setEnlarged(true); };
  const renderThumbnail = (position: number) => {
    const item = vrcPhotos[position];
    return <button className={styles.wallPhoto} type="button" key={item.src} onClick={() => openPhoto(position)} aria-label={`查看照片：${item.alt}`}>
      <Image src={photoThumbnail(item)} alt={item.alt} width={item.width ?? 3840} height={item.height ?? 2160} sizes="(max-width: 680px) 45vw, (max-width: 1100px) 45vw, 30vw" unoptimized />
      <span className={styles.wallCaption}>{item.capturedAt ? <time dateTime={item.capturedAt}>{item.capturedAt.replaceAll("-", " · ")}</time> : "VRChat"}<ArrowsOut size={16} aria-hidden="true" /></span>
    </button>;
  };

  return <div className={`${homeStyles.home} ${styles.page}`}>
    <JournalHeader active="serendipity" />
    <main className={styles.main} id="top">
      <h1 className={styles.srOnly}>拾光</h1>
      <nav className={styles.viewSwitch} aria-label="拾光视图">{views.map(({ key, label, icon: Icon }) => <button key={key} type="button" aria-pressed={view === key} onClick={() => setView(key)}><Icon size={15} aria-hidden="true" />{label}</button>)}</nav>
      {view === "focus" ? <>
      <div className={styles.meta} data-reveal>
        <p className={styles.eyebrow}>拾光 · № {number(index)} OF {vrcPhotos.length}</p>
        {photo.capturedAt && <time dateTime={photo.capturedAt}>{photo.capturedAt.replaceAll("-", " · ")}</time>}
        <nav className={styles.dots} aria-label="选择截图">{vrcPhotos.map((item, position) => <button key={item.src} type="button" aria-label={`查看第 ${position + 1} 张截图`} aria-current={index === position ? "true" : undefined} onClick={() => setIndex(position)}><span /></button>)}</nav>
      </div>
      <div className={styles.stage}>
        <button className={`${styles.sideNav} ${styles.sidePrevious}`} type="button" onClick={() => setIndex(index - 1)} disabled={!previous} aria-label="上一张截图"><CaretLeft size={20} /><span>前一则</span></button>
        <figure className={styles.photo} key={photo.src}>
          <button className={styles.imageButton} type="button" onClick={() => setEnlarged(true)} aria-label={`放大第 ${index + 1} 张截图`}>
            <Image src={photo.src} alt={photo.alt} width={photo.width ?? 3840} height={photo.height ?? 2160} sizes="(max-width: 680px) calc(100vw - 32px), (max-width: 1200px) 80vw, 1000px" priority unoptimized />
            <span className={styles.expand} aria-hidden="true"><ArrowsOut size={19} /></span>
          </button>
        </figure>
        <button className={`${styles.sideNav} ${styles.sideNext}`} type="button" onClick={() => setIndex(index + 1)} disabled={!next} aria-label="下一张截图"><CaretRight size={20} /><span>后一则</span></button>
      </div>
      <nav className={styles.bottomNav} aria-label="截图翻页">
        <button type="button" disabled={!previous} onClick={() => setIndex(index - 1)}><kbd aria-hidden="true">←</kbd>前一则</button>
        <span aria-hidden="true">·</span>
        <button type="button" disabled={!next} onClick={() => setIndex(index + 1)}>后一则<kbd aria-hidden="true">→</kbd></button>
      </nav>
      <p className={styles.srOnly} role="status">第 {index + 1} 张，共 {vrcPhotos.length} 张。{photo.alt}</p>
      </> : <>
        <header className={styles.galleryHeading} data-reveal><p className={styles.eyebrow}>SERENDIPITY · 拾光</p><h2>光影之间</h2><p>{vrcPhotos.length} 张照片，收藏虚拟世界里的相聚与片刻。</p></header>
        <div className={styles.wallGrid} aria-label="拾光照片墙" data-reveal-group>{vrcPhotos.map((_, position) => renderThumbnail(position))}</div>
      </>}
    </main>
    <dialog ref={dialog} className={styles.lightbox} aria-label="VRChat 截图大图" onClose={() => setEnlarged(false)} onCancel={() => setEnlarged(false)} onClick={event => { if (event.target === event.currentTarget) setEnlarged(false); }}>
      <button className={styles.close} type="button" aria-label="关闭大图" onClick={() => setEnlarged(false)}><X size={25} /></button>
      {enlarged && <>
        <Image src={photo.src} alt={photo.alt} width={photo.width ?? 3840} height={photo.height ?? 2160} unoptimized />
        <div className={styles.lightboxControls}><button type="button" disabled={!previous} onClick={() => setIndex(index - 1)} aria-label="上一张大图"><CaretLeft size={20} /></button><span aria-live="polite">{index + 1} / {vrcPhotos.length}{photo.capturedAt && ` · ${photo.capturedAt}`}</span><button type="button" disabled={!next} onClick={() => setIndex(index + 1)} aria-label="下一张大图"><CaretRight size={20} /></button></div>
      </>}
    </dialog>
  </div>;
}
