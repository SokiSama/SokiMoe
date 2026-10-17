export const toolGroups = [
  { name: "Productivity", tools: [
    { name: "Chrome", description: "浏览器", icon: "chrome.svg", url: "https://www.google.com/chrome/" },
    { name: "Obsidian", description: "Markdown 笔记与写作", icon: "obsidian.svg", url: "https://obsidian.md/" },
  ] },
  { name: "Development", tools: [
    { name: "Codex", description: "AI 编程助手", icon: "codex.svg", url: "https://openai.com/codex/" },
    { name: "VS Code", description: "代码编辑器", icon: "vscode.svg", url: "https://code.visualstudio.com/" },
  ] },
] as const;

// Listed from the active application, build configuration and comment integration.
export const techStack = [
  { name: "Next.js", description: "网站框架与服务端路由", icon: "nextjs.svg", url: "https://nextjs.org/" },
  { name: "React", description: "页面组件与交互", icon: "react.svg", url: "https://react.dev/" },
  { name: "TypeScript", description: "类型检查与开发语言", icon: "typescript.svg", url: "https://www.typescriptlang.org/" },
  { name: "Tailwind CSS", description: "样式工具与构建", icon: "tailwindcss.svg", url: "https://tailwindcss.com/" },
  { name: "Node.js", description: "开发与服务端运行环境", icon: "nodejs.svg", url: "https://nodejs.org/" },
  { name: "React Markdown", description: "Markdown 文章渲染", icon: "markdown.svg", url: "https://github.com/remarkjs/react-markdown" },
  { name: "Twikoo", description: "文章与友链评论系统", icon: "twikoo.png", url: "https://twikoo.js.org/" },
] as const;
