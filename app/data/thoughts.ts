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
    id: "welcome",
    publishedAt: "2026-07-22T10:32:00+08:00",
    content: "把偶尔闪过的念头留在这里。短一点，也更接近当时的心情。",
    tags: ["随想", "心情"],
  },
  {
    id: "small-things",
    publishedAt: "2026-05-17T22:48:00+08:00",
    content: "最近的一些小快乐：平凡的日子里，也藏着闪闪发光的瞬间。",
    tags: ["日常", "生活"],
  },
];
