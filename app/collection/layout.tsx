/* eslint-disable @next/next/no-css-tags -- Load only the needed subsets of the vendored CJK fonts. */
import type { Metadata } from "next";

export const metadata: Metadata = { title: "品鉴 · Soki Sugar Life", description: "书籍、漫画与追番，记录那些值得收藏的作品。" };

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return <>
    <link rel="stylesheet" href="/fonts/harmonyos-sans-sc/Regular.css" precedence="default" />
    <link rel="stylesheet" href="/fonts/harmonyos-sans-sc/Semibold.css" precedence="default" />
    {children}
  </>;
}
