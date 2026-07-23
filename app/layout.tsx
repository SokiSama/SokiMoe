import type { Metadata } from "next";
import SidebarStickyFollow from "./components/SidebarStickyFollow";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soki Sugar Life",
  description: "一个清爽、响应式的三栏个人博客主题。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var m=localStorage.getItem('soki-theme-mode')||'system';var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})();` }} /></head><body><SidebarStickyFollow />{children}</body></html>;
}
