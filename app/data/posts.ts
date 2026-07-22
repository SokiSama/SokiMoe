export type LocalPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  cover: string;
  source: string;
  type: "travel" | "tech";
  tags: string[];
};

export const localPosts: LocalPost[] = [
  {
    slug: "mi",
    title: "2026 小米解锁 & root 后优化指北",
    date: "2026-03-12",
    description: "已不知有多久未解锁小米的 bootloader 了",
    cover: "/images/unlock.jpg",
    source: "/posts/mi.md",
    type: "tech",
    tags: ["小米", "解锁", "root", "优化", "教程"],
  },
  {
    slug: "web",
    title: "怎么从零搭建一个网站并绑定域名",
    date: "2026-01-14",
    description: "面向不知道谁的一个搭站教程。",
    cover: "/images/123.png",
    source: "/posts/web.md",
    type: "tech",
    tags: ["教程"],
  },
  {
    slug: "newyear",
    title: "2025年度总结",
    date: "2026-01-06",
    description: "动荡的一年。",
    cover: "/images/cyber.jpeg",
    source: "/posts/newyear.md",
    type: "tech",
    tags: ["心得"],
  },
  {
    slug: "wifeff14",
    title: "构思了一场基于 FF14 主题的婚礼",
    date: "2025-12-24",
    description: "任务已开启：永结同心绝境战",
    cover: "/images/f.jpg",
    source: "/posts/wifeff14.md",
    type: "tech",
    tags: ["分享"],
  },
  {
    slug: "steamff14",
    title: "用 Steam 套壳启动 FF14 国服",
    date: "2025-11-15",
    description: "替换文件，在启动 Steam 启动 FF14 国服，能记录时长和上传截图。",
    cover: "/images/1.jpg",
    source: "/posts/steamff14.md",
    type: "tech",
    tags: ["教程"],
  },
  {
    slug: "HSBCHK",
    title: "记一次汇丰香港开户历程",
    date: "2025-10-14",
    description: "肉身赴港开户 HSBC HK",
    cover: "/images/images.png",
    source: "/posts/HSBCHK.md",
    type: "tech",
    tags: ["心得"],
  },
  {
    slug: "start",
    title: "欢迎进入轨道",
    date: "2025-10-08",
    description: "也许是本网站的第一篇文章。",
    cover: "/images/start.jpg",
    source: "/posts/start.md",
    type: "tech",
    tags: ["记录"],
  },
  {
    slug: "kl",
    title: "马来西亚游记",
    date: "2026-01-28",
    description: "记录人生第一次出国",
    cover: "/travel/kl.jpg",
    source: "/travel/kl.md",
    type: "travel",
    tags: ["旅行", "马来西亚"],
  },
  {
    slug: "chengdu",
    title: "两个二次元的成都一日特种兵旅游",
    date: "2025-10-27",
    description: "和业火美少女的一日",
    cover: "/travel/chengdustation.jpg",
    source: "/travel/chengdu.md",
    type: "travel",
    tags: ["旅行", "成都"],
  },
  {
    slug: "hkmacou",
    title: "结束乐队香港澳门游记",
    date: "2025-08-16",
    description: "被裁员后，我临时计划了一场旅行……",
    cover: "/travel/hkmacou.jpg",
    source: "/travel/hkmacou.md",
    type: "travel",
    tags: ["旅行", "香港澳门"],
  },
];

export const localPostMap = Object.fromEntries(localPosts.map((post) => [post.slug, post])) as Record<string, LocalPost>;
