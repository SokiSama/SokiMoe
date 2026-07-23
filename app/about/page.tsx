import {
  Briefcase,
  Code,
  DeviceMobile,
  DeviceTablet,
  Desktop,
  Coffee,
  Flower,
  GameController,
  Headphones,
  MusicNotes,
  Translate,
  Watch,
} from "@phosphor-icons/react/dist/ssr";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

const skills = [
  { icon: Code, title: "AI Coding", text: "本网站基于 Codex 开发" },
  { icon: Code, title: "Next.js & React", text: "所用到的技术栈" },
  { icon: Desktop, title: "PC Gaming", text: "9800X3D 是对的" },
  { icon: GameController, title: "Controller Gaming", text: "抱起手柄，南条一摊" },
  { icon: Briefcase, title: "QA Engineer", text: "混口饭吃，随时被取代" },
  { icon: Translate, title: "zh-CN & en-US", text: <em>日本語を勉強します</em> },
];

const devices = [
  { icon: DeviceTablet, name: "iPad Pro 2024", text: "双层 OLED 就是爽" },
  { icon: DeviceMobile, name: "iPhone 17 Pro", text: "一手掌握，港版还有 eSIM 爽用" },
  { icon: Headphones, name: "AirPods Pro 2", text: "老搭档了，通勤与出门需要音乐陪伴" },
  { icon: DeviceMobile, name: "Samsung S25 Ultra", text: "双持代表着，工作与生活要区分开" },
  { icon: Watch, name: "Apple Watch S10", text: "看时间和记录数据" },
  { icon: GameController, name: "不计其数的洋垃圾…", text: "折腾本身就是乐趣" },
];

export default function AboutPage() {
  return (
    <div className="site">
      <SiteHeader active="about" />
      <div id="top" className="about-page">
        <main className="about-content">
          <section className="card about-hero">
            <div className="about-avatar"><img src="/about-avatar.png" alt="Soki 的头像" /></div>
            <div className="about-hero-copy">
              <span className="eyebrow">ABOUT ME</span>
              <h1>Hi, I&apos;m Soki</h1>
              <p>倾听，感受，思考。愿母水晶能指引我们。</p>
              <div className="interest-chips" aria-label="兴趣标签">
                <span className="interest-chip interest-chip--anime">
                  <Flower size={17} weight="regular" aria-hidden="true" />
                  动漫
                </span>
                <span className="interest-chip interest-chip--music">
                  <MusicNotes size={17} weight="regular" aria-hidden="true" />
                  音乐
                </span>
                <span className="interest-chip interest-chip--game">
                  <GameController size={17} weight="regular" aria-hidden="true" />
                  游戏
                </span>
                <span className="interest-chip interest-chip--life">
                  <Coffee size={17} weight="regular" aria-hidden="true" />
                  生活
                </span>
              </div>
            </div>
          </section>

          <section className="card about-story-section">
            <header className="about-story-heading">
              <span>01</span>
              <div><p>ABOUT ME</p><h2>关于我</h2></div>
            </header>
            <div className="about-prose">
              <p>我是 Soki，一位不爱写代码的业余开发者，也是 ACG 爱好者。习惯了在生活的喧嚣中构筑自己的小世界。</p>
              <p>2022年大学毕业从事软件行业至今，编程全靠爱好，爱好不会成为工作。</p>
              <p>网站创立于 2025 年 10 月，是继 2017 年之后再一次建站。前身「砂糖小站」现已尘封，仅存托管域名用来 Arcade。</p>
              <p>博客主要是以日常为主，没什么技术含量。碎碎念是当空间用的，一些小心思都会丢在那里。</p>
            </div>
          </section>

          <section className="card about-section about-inline-section">
            <header className="about-section-heading">
              <span>02</span>
              <div><h2>技能</h2><p>技能树总会点在一些适合自己的地方</p></div>
            </header>
            <div className="about-skill-grid">
              {skills.map(({ icon: Icon, title, text }) => (
                <article key={title}><Icon size={30} weight="regular" /><div><h3>{title}</h3><p>{text}</p></div></article>
              ))}
            </div>
          </section>

          <section className="card about-section about-inline-section">
            <header className="about-section-heading">
              <span>03</span>
              <div><h2>设备</h2><p>我真的不会再乱换设备了.jpg</p></div>
            </header>
            <div className="about-device-grid">
              {devices.map(({ icon: Icon, name, text }) => (
                <article key={name}><Icon size={30} weight="regular" /><div><h3>{name}</h3><p>{text}</p></div></article>
              ))}
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
      <a className="back-top" href="#top" aria-label="回到顶部">↑</a>
    </div>
  );
}
