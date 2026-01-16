'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { useConfig } from '@/hooks/useConfig';

export function ConditionalHeader() {
  const pathname = usePathname();
  const { data: config, loading } = useConfig();

  if (loading || !config) {
    return null;
  }

  const isAdminLoginPage = pathname === `/${config.secureEntrance}`;
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminLoginPage || isAdminPage) {
    return null;
  }

  return <Header />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  const { data: config, loading } = useConfig();
  const [runningDays, setRunningDays] = useState<number | null>(null);

  useEffect(() => {
    const startUtc = Date.UTC(2025, 9, 8);
    const now = new Date();
    const nowUtc = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );
    const diffDays = Math.floor(
      (nowUtc - startUtc) / (1000 * 60 * 60 * 24)
    );
    setRunningDays(diffDays > 0 ? diffDays : 0);
  }, []);

  if (loading || !config) {
    return null;
  }

  const isAdminLoginPage = pathname === `/${config.secureEntrance}`;
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminLoginPage || isAdminPage) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6">
      <div className="content-wrapper">
        <div className="mb-2 space-y-1 text-center text-sm text-neutral-500 dark:text-neutral-500">
          <p>
            网站已运行：
            {runningDays !== null
              ? `${runningDays}天｜Stay hungry. Stay foolish.`
              : '计算中...'}
          </p>
        </div>
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-500">
          © {currentYear} Soki. All Rights Reserved.｜
          <a
            href="https://icp.gov.moe/?keyword=20263015"
            target="_blank"
            rel="noopener noreferrer"
          >
            萌ICP备20263015号
          </a>
        </p>
      </div>
    </footer>
  );
}
