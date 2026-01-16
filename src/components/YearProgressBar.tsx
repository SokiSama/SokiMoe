'use client';

import { useEffect, useMemo, useState } from 'react';

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const dateUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((dateUtc - startUtc) / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

function getNextLocalMidnight(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0);
}

export function YearProgressBar() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const nextMidnight = getNextLocalMidnight(new Date());
    const msUntilNextMidnight = Math.max(0, nextMidnight.getTime() - Date.now()) + 25;

    const timer = window.setTimeout(() => {
      setNow(new Date());
    }, msUntilNextMidnight);

    return () => window.clearTimeout(timer);
  }, [now]);

  const percent = useMemo(() => {
    const year = now.getFullYear();
    const totalDays = isLeapYear(year) ? 366 : 365;
    const dayOfYear = getDayOfYear(now);
    const elapsedDays = Math.min(totalDays, Math.max(0, dayOfYear - 1));
    return (elapsedDays / totalDays) * 100;
  }, [now]);

  const displayPercent = Number.isFinite(percent) ? percent.toFixed(1) : '0.0';

  return (
    <div className="mt-8 w-full">
      <div className="mb-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
        今年已过了...
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-[width] duration-700 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          />
        </div>

        <div className="shrink-0 tabular-nums font-mono text-sm text-neutral-700 dark:text-neutral-200 min-w-[4.5rem] text-right">
          {displayPercent}%
        </div>
      </div>
    </div>
  );
}
