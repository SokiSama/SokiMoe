/* eslint-disable @next/next/no-css-tags -- Load the vendored font subsets for this page. */
import type { Metadata } from "next";
import { SerendipityGallery } from "./SerendipityGallery";

export const metadata: Metadata = { title: "拾光 · Soki Sugar Life", description: "VRChat 影像记录。" };

export default function SerendipityPage() {
  return <>
    <link rel="stylesheet" href="/fonts/harmonyos-sans-sc/Regular.css" precedence="default" />
    <link rel="stylesheet" href="/fonts/harmonyos-sans-sc/Semibold.css" precedence="default" />
    <SerendipityGallery />
  </>;
}
