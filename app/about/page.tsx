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
              <p>编程全靠爱好，爱好不会成为工作。</p>
              <p>网站创立于 2025 年 10 月，是继 2017 年之后再一次建站。前身「砂糖小站」现已尘封，仅存托管域名用来 Arcade。</p>
              <p>建立网站的目的，是想记录爱好，收藏乐趣，认识朋友。</p>
            </div>
          </section>

          <section className="card about-story-section">
            <header className="about-story-heading">
              <span>02</span>
              <div><p>INTERESTS</p><h2>兴趣爱好</h2></div>
            </header>
            <div className="about-prose">
              <p>喜欢数码、动漫、美食、游戏以及独自旅游。目标是走遍想去的国家。</p>
              <p>INFP-T，或许可以在这里做真实的自己，对自己不喜欢的事会尽力逃避，无法逃避就会陷入内耗。</p>
              <p>FF14 母肥 → 猫4，主职贤者，单绝神兵，绝亚打到 P3 散队了，零式万魔殿边境次月，炼狱首月，阿卡迪亚零式登天斗技场轻量级首月；玩高难默认切白魔。现在是导随摸鱼人，没钱了就去挖宝。</p>
              <p>守望先锋休闲玩家，三种职业都玩，竞技处于黄金水平吧，奶位主要玩雾子和莫姨，DPS 玩小美和死怨，坦位玩奥丽莎和路霸。</p>
              <p>音游已退坑，BanG Dream 日服无判 27 个位数 gr，舞萌 DX 1W4，Arcaea 10.8，被上班和年龄限制住了精力，深知天花板就在这了。</p>
              <p>我个人对游戏平台没有什么依赖性，主要是 PS 接电视玩确实很爽，Steam 主要玩网游，Switch 跳舞和玩马车以及并没什么人跟我一起的合家欢游戏。所以哪个顺手玩哪个。</p>
              <p>VRChat 紫名已退游，没找过砂糖，也没 ERP 过，朋友也没多少，就是觉得社交不行的我在哪里都一样，哪怕我套上了美少女皮。可惜了我为了这游戏买了 Quest 3 + 全追，现在也都卖了。</p>
            </div>
          </section>

          <section className="card about-section about-inline-section">
            <header className="about-section-heading">
              <span>03</span>
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
              <span>04</span>
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
