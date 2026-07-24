import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { SiteCategoryCard, type SidebarCategory } from "../components/SiteSidebars";
import { localPosts } from "../data/posts";

export default function ArchivePage() {
  const posts = [...localPosts].sort((a, b) => b.date.localeCompare(a.date));
  const latestPosts = posts.slice(0, 4);
  const categoryOrder = ["旅行", "教程", "记录", "心得", "分享"];
  const categories: SidebarCategory[] = categoryOrder.map((name) => ({
    name,
    count: posts.filter((post) => post.tags.includes(name)).length,
    href: "/#posts",
  })).filter((category) => category.count > 0);
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
        <div className="archive-center">
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
                      {post.cover ? (
                        <span className="archive-post-cover" aria-hidden="true">
                          <img src={post.cover} alt="" />
                        </span>
                      ) : null}
                      <span className="archive-post-title">{post.title}</span>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <aside className="archive-meta-sidebar">
          <div className="archive-sidebar-sticky">
            <SiteCategoryCard categories={categories} />
            <section className="card side-card archive-recent-card">
              <h3>最近文章</h3>
              <div className="archive-recent-list">
                {latestPosts.map((post) => (
                  <a href={`/posts/${post.slug}`} key={post.slug}>
                    <time dateTime={post.date}>{post.date}</time>
                    <span>{post.title}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </aside>
      </main>
      <SiteFooter />
      <a className="back-top" href="#top" aria-label="回到顶部">↑</a>
    </div>
  );
}
