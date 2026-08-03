export type Thought = {
  id: string;
  publishedAt: string;
  content: string;
  images?: string[];
  likes?: number;
  comments?: number;
  tags?: string[];
};

// “碎念”没有公开写入接口。站长在这里维护内容，部署后由页面只读展示。
export const thoughts: Thought[] = [
  {
    id: "removed-filler-tutorials",
    publishedAt: "2026-08-03T21:21:31+08:00",
    content: "删除了几篇所谓的教程，都是当时博客水文章用的",
    tags: ["随想", "博客"],
  },
  {
    id: "design-inspired-by-wan",
    publishedAt: "2026-07-26T16:58:26+08:00",
    content: "今天看到了碗大佬的设计，瞬间觉得我的网站也可以借鉴他的设计方式，于是就成了现在这样",
    tags: ["随想", "建站"],
  },
  {
    id: "codex-pro",
    publishedAt: "2026-07-23T18:30:38+08:00",
    content: "Codex 太好用了，重置了三次 Token，最后还是没忍住上了 Pro",
    tags: ["随想", "生活"],
  },
];
