"use client";

const SITE_STARTED_AT = new Date("2025-10-06T00:00:00+08:00").getTime();
const ONE_DAY = 24 * 60 * 60 * 1000;

export function SiteFooter() {
  const runningDays = Math.max(1, Math.floor((Date.now() - SITE_STARTED_AT) / ONE_DAY));
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer site-footer">
      <p>网站已运行：<strong>{runningDays}天</strong><span aria-hidden="true">|</span>Stay hungry. Stay foolish.</p>
      <p>© <span suppressHydrationWarning>{currentYear}</span> Soki. All Rights Reserved.<span aria-hidden="true">|</span><a href="https://icp.gov.moe/?keyword=20263015" target="_blank" rel="noreferrer">萌ICP备20263015号</a></p>
    </footer>
  );
}
