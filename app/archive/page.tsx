import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { localPosts } from "../data/posts";

export default function ArchivePage() {
  const posts = [...localPosts].sort((a, b) => b.date.localeCompare(a.date));
  const years = Array.from(
    posts.reduce((groups, post) => {
      const year = post.date.slice(0, 4);
      groups.set(year, [...(groups.get(year) ?? []), post]);
      return groups;
    }, new Map<string, typeof posts>()),
  );

  return (
    <div className="site">
      <SiteHeader active="archive" />
      <main id="top" className="archive-page">
        <section className="card archive-hero">
          <div>
            <span>Archives of time</span>
            <h1>归档，是时光的书签</h1>
            <p>{posts.length} 篇文章，沿着时间慢慢读。</p>
            <i />
          </div>
          <img src="/archive-hero.png" alt="" aria-hidden="true" />
        </section>
        <div className="archive-years">
          {years.map(([year, yearPosts]) => (
            <section className="archive-year" key={year}>
              <header><strong>{year}</strong><span>{yearPosts.length} 篇</span></header>
              <div className="archive-list">
                {yearPosts.map((post) => (
                  <a href={`/posts/${post.slug}`} key={post.slug}>
                    <time dateTime={post.date}>{post.date.slice(5).replace("-", ".")}</time>
                    <span>{post.title}</span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
      <a className="back-top" href="#top" aria-label="回到顶部">↑</a>
    </div>
  );
}
