import { PageCoverBanner } from "../components/PageCoverBanner";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export default function AboutPage() {
  return (
    <div className="site immersive-route about-route">
      <SiteHeader active="about" floating />
      <PageCoverBanner
        eyebrow="ABOUT ME"
        title="关于我"
        description="倾听，感受，思考。愿母水晶能指引我们。"
        image="/about-cover.jpg"
        imagePosition="center top"
      />
      <div id="top" className="about-page immersive-content">
        <main className="about-content">
          <section className="card about-story-section">
            <header className="about-story-heading">
              <h2>关于我</h2>
            </header>
            <div className="about-prose">
              <p>我是 Soki，一位不爱写代码的业余开发者，也是 ACG 爱好者。</p>
              <p>是 INFP，内心较为敏感，对不感兴趣的事物毫无接触的欲望。</p>
              <p>可以通过主页的联系方式来找到我。</p>
              <p>网站创立于 2025 年 10 月，是继 2017 年之后再一次建站。前身「砂糖小站」现已尘封，仅存托管域名用来 Arcade。</p>
              <p>博客主要是以日常为主，没什么技术含量。碎碎念是当空间用的，一些小心思都会丢在那里。</p>
              <p className="about-credit">
                在此感谢{" "}
                <a href="https://github.com/tcdw/koi" target="_blank" rel="noreferrer">
                  tcdw/koi
                </a>{" "}
                提供的开源代码与页面灵感
              </p>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
      <a className="back-top" href="#top" aria-label="回到顶部">↑</a>
    </div>
  );
}
