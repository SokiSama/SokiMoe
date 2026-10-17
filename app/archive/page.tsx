/* eslint-disable @next/next/no-css-tags -- Vendored CJK font stylesheets load only the required Unicode subsets. */
import Link from "next/link";
import { RssSimple } from "@phosphor-icons/react/dist/ssr";
import { JournalHeader } from "../components/JournalHeader";
import { localPosts } from "../data/posts";
import homeStyles from "../components/HomePage.module.css";
import styles from "./ArchivePage.module.css";

export default function ArchivePage() {
  const posts = [...localPosts].sort((a, b) => b.date.localeCompare(a.date));
  const years = Array.from(posts.reduce((groups, post) => {
    const year = post.date.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), post]);
    return groups;
  }, new Map<string, typeof posts>()));

  return (
    <>
      <link rel="stylesheet" href="/fonts/harmonyos-sans-sc/Regular.css" precedence="default" />
      <link rel="stylesheet" href="/fonts/harmonyos-sans-sc/Semibold.css" precedence="default" />
      <div className={`${homeStyles.home} ${styles.page}`} id="top">
        <JournalHeader active="archive" />
        <main className={styles.main}>
          <header data-reveal className={styles.intro}>
            <span className={styles.eyebrow}>TIMELINE</span>
            <h1>文章归档</h1>
            <p>共 {posts.length} 篇文章</p>
          </header>
          <div className={styles.years} data-reveal-group>
            {years.map(([year, yearPosts]) => (
              <section className={styles.year} key={year} aria-labelledby={`archive-${year}`}>
                <header className={styles.yearHeading}>
                  <h2 id={`archive-${year}`}>{year}</h2>
                  <span>{yearPosts.length} 篇</span>
                  <i aria-hidden="true" />
                </header>
                <ol className={styles.list}>
                  {yearPosts.map(post => (
                    <li key={post.slug}>
                      <Link href={`/posts/${post.slug}`}>
                        <time dateTime={post.date}>{post.date.slice(5)}</time>
                        <span>{post.title}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </main>
        <footer className={homeStyles.footer}>
          <p>© 2025–{new Date().getFullYear()} Soki Sugar Life<span>·</span><a href="https://icp.gov.moe/?keyword=20263015" target="_blank" rel="noreferrer">萌ICP备20263015号</a></p>
          <a href="/api/rss"><RssSimple size={15} />RSS 订阅</a>
        </footer>
      </div>
    </>
  );
}
