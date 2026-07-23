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
    id: "codex-pro",
    publishedAt: "2026-07-23T18:30:38+08:00",
    content: "Codex 太好用了，重置了三次 Token，最后还是没忍住上了 Pro",
    tags: ["随想", "生活"],
  },
];
