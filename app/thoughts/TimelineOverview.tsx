"use client";

import { useEffect, useState } from "react";

function readTime() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear() + 1, 0, 1);
  const day = Math.floor((now.getTime() - start.getTime()) / 86_400_000) + 1;
  const year = ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;
  return { day, year };
}

export function TimelineOverview() {
  const [time, setTime] = useState(readTime);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(readTime()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="thought-overview card">
      <h2 className="thought-side-title">时间线</h2>
      <div className="thought-progresses">
        <div><strong>{time.day}</strong><span>今年第几天</span></div>
        <div><strong>{time.year.toFixed(0)}<small>%</small></strong><span>年度进度</span></div>
      </div>
    </section>
  );
}
