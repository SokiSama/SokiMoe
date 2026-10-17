/* eslint-disable @next/next/no-css-tags -- Vendored CJK fonts load only the Unicode subsets needed on the page. */
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUp, DeviceMobile, DeviceTablet, EnvelopeSimple, GameController, GithubLogo, MapPin, RssSimple, SteamLogo, TelegramLogo, TwitterLogo, Watch } from "@phosphor-icons/react/dist/ssr";
import { JournalHeader } from "../components/JournalHeader";
import { techStack, toolGroups } from "./data";
import homeStyles from "../components/HomePage.module.css";
import styles from "./AboutPage.module.css";

export const metadata: Metadata = { title: "关于 · Soki Sugar Life", description: "你好，我叫 Soki，也可以叫我露比或砂糖。定居重庆的软件测试工程师，喜欢游戏、动漫与新技术。" };

const devices = [
  { name: "iPad Pro 2024", description: "平板电脑", icon: DeviceTablet },
  { name: "iPhone 17 Pro", description: "iOS 手机", icon: DeviceMobile },
  { name: "AirPods Pro 2", description: "无线耳机", icon: null },
  { name: "Samsung S25 Ultra", description: "Android 手机", icon: DeviceMobile },
  { name: "Apple Watch S10", description: "智能手表", icon: Watch },
  { name: "不计其数的洋垃圾…", description: "游戏设备与收藏", icon: GameController },
];
const socials = [
  { name: "X / Twitter", icon: TwitterLogo, href: "https://x.com/soki_ruby" },
  { name: "Telegram", icon: TelegramLogo, href: "https://t.me/MatsuzaSatou" },
  { name: "Steam", icon: SteamLogo, href: "https://steamcommunity.com/id/SokiSama/" },
  { name: "GitHub", icon: GithubLogo, href: "https://github.com/SokiSama" },
  { name: "Email", icon: EnvelopeSimple, href: "mailto:mashiroamane@outlook.com" },
];

export default function AboutPage() {
  return <>
    <link rel="stylesheet" href="/fonts/harmonyos-sans-sc/Regular.css" precedence="default" />
    <link rel="stylesheet" href="/fonts/harmonyos-sans-sc/Semibold.css" precedence="default" />
    <div className={`${homeStyles.home} ${styles.page}`} id="top">
      <JournalHeader active="about" />
      <main className={styles.main}>
        <article className={styles.content}>
          <header className={styles.intro} id="about-me" aria-labelledby="about-title">
            <Image className={styles.profileAvatar} src="/profile-avatar.webp" width={144} height={144} alt="Soki 的头像" priority />
            <div className={styles.profileInfo}>
              <h1 id="about-title">关于我</h1>
              <p className={styles.location}><MapPin size={16} aria-hidden="true" /><span>柔风海湾　九号解决方案</span></p>
              <div className={styles.profileSocials} aria-label="Soki 的社交链接">{socials.map(({ name, href, icon: Icon }) => <a key={name} href={href} aria-label={name} title={name} target={href.startsWith("https:") ? "_blank" : undefined} rel={href.startsWith("https:") ? "noreferrer" : undefined}><Icon size={21} aria-hidden="true" /></a>)}</div>
            </div>
          </header>
          <section className={`${styles.section} ${styles.biography}`} id="biography" aria-label="个人介绍">
            <p>你好，我叫 Soki，也可以叫我 露比 或 砂糖。</p>
            <p>一个定居在重庆的西北人，2023 年有了属于自己的小窝。</p>
            <p>性格大概是 INFP-T 吧。现实中内向慢热，到了互联网上却意外地活泼，或许这才是我更自在的样子。</p>
            <p>与计算机的缘分，要从小时候说起。那时父母给家里买了一台电脑，我便一头扎进了这个奇妙的世界。最初只是好奇地更换系统主题、练习打字，直到后来哥哥带来了几张游戏光盘，带着我安装游戏，才算正式打开了新世界的大门。</p>
            <p>从《极品飞车》《三角洲特种部队》《红色警戒》，再到《GTA》系列，游戏几乎贯穿了我的整个童年。那些假期里，我常常玩得废寝忘食。现在回想起来，与其说是沉迷游戏，不如说是在那个缺少朋友的现实世界之外，为自己寻找了一处可以自由呼吸的角落。</p>
            <p>偶尔也会想，如果没有 2009 年的那次骨折，没有 2016 年的那场集训，如今的我又会过着怎样的生活？</p>
            <p>可惜人生没有存档，也无法读取过去的某个检查点。</p>
            <p>如今，我是一名为了生计而工作的软件测试工程师。</p>
            <p>其实我并不讨厌写代码，也不讨厌技术本身。我只是没有那么喜欢把兴趣变成工作，更不喜欢为了工作而工作。比起那些不得不完成的任务，我更享受在闲暇时研究新技术、折腾自己的博客，或者窝在家里打打主机游戏。</p>
            <p>高中时期，我又逐渐走进了动漫的世界。从此，游戏、动画与互联网便成了生活里不可或缺的一部分。也正因如此，我对人工智能，尤其是 AGI 的未来，总有着一些不切实际却又令人期待的幻想。</p>
            <p>也许有一天，那些只存在于屏幕里的角色真的能够跨越次元，与我们生活在同一个世界。曾经只能在幻想中实现的事情，或许也会逐渐成为现实。</p>
            <p>当然，也可能迎来一场智械危机。不过，未来的事情，谁知道呢？</p>
            <p className={styles.interestsTitle} id="hobbies-title">个人兴趣：</p>
            <ul className={styles.hobbies} id="hobbies" aria-labelledby="hobbies-title">
              <li>PS + NS 双机党</li>
              <li>被 7.0 伤透了心的光之战士</li>
              <li>京阿尼与芳文社是我追番的首选</li>
              <li>μ&apos;sic Forever!</li>
              <li>幻想有一墙喜欢的漫画与轻小说</li>
            </ul>
          </section>
          <section className={styles.section} id="tools" aria-labelledby="tools-title">
            <h2 id="tools-title">工具</h2>
            <p>创作、记录与开发。</p>
            <div className={styles.toolGroups}>{toolGroups.map(group => <section className={styles.toolGroup} key={group.name} aria-label={group.name}>
              <h3>{group.name}</h3>
              <div className={styles.tools}>{group.tools.map(tool => <a className={styles.tool} href={tool.url} key={tool.name} target="_blank" rel="noreferrer">
                <span className={styles.toolIcon}><Image src={`/icons/tools/${tool.icon}`} width={32} height={32} alt={`${tool.name} 图标`} unoptimized /></span>
                <span className={styles.toolText}><strong>{tool.name}</strong><small>{tool.description}</small></span>
              </a>)}</div>
            </section>)}</div>
          </section>
          <section className={styles.section} id="tech-stack" aria-labelledby="tech-stack-title">
            <h2 id="tech-stack-title">技术栈</h2>
            <p>支撑这个网站的技术与服务。</p>
            <div className={styles.toolGroup}>
              <div className={styles.tools}>{techStack.map(technology => <a className={styles.tool} key={technology.name} href={technology.url} target="_blank" rel="noreferrer">
                <span className={styles.toolIcon}><Image src={`/icons/tools/${technology.icon}`} width={32} height={32} alt={`${technology.name} 图标`} unoptimized /></span>
                <span className={styles.toolText}><strong>{technology.name}</strong><small>{technology.description}</small></span>
              </a>)}</div>
            </div>
          </section>
          <section className={styles.section} id="devices" aria-labelledby="devices-title">
            <h2 id="devices-title">设备</h2>
            <div className={styles.toolGroup}>
              <h3>Devices</h3>
              <ul className={styles.devices}>{devices.map(({ name, description, icon: Icon }) => <li key={name}>
                <span className={styles.deviceIcon} aria-hidden="true">{Icon ? <Icon size={29} weight="regular" /> : <Image src="/icons/tools/airpods.svg" width={29} height={29} alt="" unoptimized />}</span>
                <span className={styles.toolText}><strong>{name}</strong><small>{description}</small></span>
              </li>)}</ul>
            </div>
            <p className={styles.deviceNote}>我真的不会再乱换设备了.jpg</p>
          </section>
          <section className={styles.section} id="website-history" aria-labelledby="history-title">
            <h2 id="history-title">迭代</h2>
            <ol className={styles.history}>
              <li><time dateTime="2026-10-17">2026-10-17</time><p>集百家之长，主要采用 <a href="https://github.com/Lapis0x0/VermilionVoid" target="_blank" rel="noreferrer"><strong>VermilionVoid</strong></a> + <a href="https://github.com/cworld1/astro-theme-pure" target="_blank" rel="noreferrer">astro-theme-pure</a>。</p></li>
              <li><time dateTime="2026-03-15">2026-03-15</time><p>换用 <a href="https://github.com/tcdw/koi" target="_blank" rel="noreferrer">Astro + Koi</a> 主题，感觉更像是一个个人网站便拿去用了。</p></li>
              <li><time dateTime="2026-01-20">2026-01-20</time><p>放弃 icarus 主题，使用了 GitHub 开源的一个主题，开始依赖 Vibe Coding。</p></li>
              <li><time dateTime="2025-11-05">2025-11-05</time><p>改用 <a href="https://github.com/ppoffice/hexo-theme-icarus" target="_blank" rel="noreferrer">Hexo + icarus</a> 主题，主题走向轻量化。</p></li>
              <li><time dateTime="2025-10-07">2025-10-07</time><p>使用基于 <a href="https://github.com/saicaca/fuwari" target="_blank" rel="noreferrer">Fuwari</a> 主题魔改的 Mizuki 创建博客，开始学习构建。</p></li>
            </ol>
          </section>
        </article>
      </main>
      <footer className={homeStyles.footer}><p>© 2025–{new Date().getFullYear()} Soki Sugar Life<span>·</span><a href="https://icp.gov.moe/?keyword=20263015" target="_blank" rel="noreferrer">萌ICP备20263015号</a></p><a href="/api/rss"><RssSimple size={18} />RSS 订阅</a></footer>
      <a className={styles.backTop} href="#top" aria-label="回到顶部"><ArrowUp size={20} /></a>
    </div>
  </>;
}
