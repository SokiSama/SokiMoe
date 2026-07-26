const milestones = [
  {
    date: "2017.9",
    title: "Hello World",
    description: "学习 WordPress 尝试自主搭建",
  },
  {
    date: "2025.8",
    title: "Hello World Again",
    description: "从有希日记，成功复刻出第一个博客",
  },
  {
    date: "2025.11",
    title: "星铁小站",
    description: "本站雏形，使用Hexo + Icarus，因个人原因搁置",
  },
  {
    date: "2026.1",
    title: "进度迁移",
    description: "买下了 soki.moe 域名，从旧网站迁移数据过来",
  },
  {
    date: "2026.7",
    title: "奠基",
    description: "学习各路大佬的前端页面，搓出了现在的网站",
  },
] as const;

export function HomeOnThisDay() {
  return (
    <section className="card home-site-timeline" aria-labelledby="home-site-timeline-title">
      <header className="home-site-timeline__heading">
        <div>
          <span>时间轨迹</span>
          <h2 id="home-site-timeline-title">记录网站开发的进程</h2>
        </div>
      </header>

      <div className="home-site-timeline__list">
        {milestones.map((milestone) => (
          <article key={milestone.date}>
            <i aria-hidden="true" />
            <time>{milestone.date}</time>
            <h3>{milestone.title}</h3>
            <p>{milestone.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
