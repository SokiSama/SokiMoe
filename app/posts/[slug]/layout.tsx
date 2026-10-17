/* eslint-disable @next/next/no-css-tags -- Vendored CJK font CSS uses unicode ranges to load only the required WOFF2 subsets. */
import type { ReactNode } from "react";

export default function ArticleLayout({ children }: { children: ReactNode }) {
  return <>
    <link rel="stylesheet" href="/fonts/harmonyos-sans-sc/Regular.css" precedence="default" />
    <link rel="stylesheet" href="/fonts/harmonyos-sans-sc/Semibold.css" precedence="default" />
    {children}
  </>;
}
