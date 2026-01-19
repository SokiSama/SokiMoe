import { YearProgressBar } from '@/components/YearProgressBar';
import { TravelFootprint } from '@/components/TravelFootprint';
import { PostCard } from '@/components/PostCard';
import { getPostsByTag, getPostBySlug, markdownToHtml } from '@/lib/posts';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function TripPage() {
  const posts = getPostsByTag('旅行');
  
  const archives = (() => {
    const byYear = new Map<number, typeof posts>();
    for (const p of posts) {
      const d = new Date(p.date);
      const year = Number.isNaN(d.getTime()) ? 0 : d.getFullYear();
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year)!.push(p);
    }
    return Array.from(byYear.entries())
      .filter(([year]) => year > 0)
      .map(([year, list]) => {
        const sorted = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return { year, posts: sorted, count: sorted.length };
      })
      .sort((a, b) => b.year - a.year);
  })();

  const totalChars = (() => {
    if (!posts.length) return 0;
    const counts = posts.map((p) => {
      const full = getPostBySlug(p.slug);
      if (!full || !full.content) return 0;
      const html = (async () => await markdownToHtml(full.content))();
      // 同步环境下无法直接await，这里简化为估算：按摘要长度与阅读时长估计
      // 如果存在 readingTime，粗略按每分钟500字估算
      return typeof full.readingTime === 'number' ? Math.round(full.readingTime * 500) : (full.excerpt?.length || 0);
    });
    return counts.reduce((a, b) => a + b, 0);
  })();
  
  // 年份分隔已移除
  return (
    <div className="trip-section-compact px-6 sm:px-8 lg:px-12 py-12 relative">
      <h1 className="trip-section-compact text-3xl font-bold mb-4 fade-in-up">
        迷途之子，步履不停，即是归处。
      </h1>
      <div className="trip-section-compact">
        <YearProgressBar />
      </div>
      <TravelFootprint />
      <div className="trip-section-compact mt-8">
        <div className="mb-6 fade-in-up">
          <h2 className="text-2xl md:text-3xl font-bold">旅行文章</h2>
        </div>
        {posts.length > 0 ? (
          <div className="mt-10 lg:grid lg:grid-cols-[220px,1fr] lg:gap-10">
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <div className="space-y-4">
                  <div className="relative left-0 ml-0 w-[220px] min-w-[200px] max-w-[260px] card p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 w-12 rounded bg-blue-600 dark:bg-blue-500" />
                      <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        归档
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {archives.map((a) => (
                        <div key={a.year} className="rounded-lg">
                          <div className="w-full flex items-center justify-between gap-4 rounded-lg px-2.5 py-2">
                            <span className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                              {a.year}年
                            </span>
                            <span className="shrink-0 inline-flex min-w-[3.25rem] justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm font-semibold tabular-nums text-neutral-600 dark:text-neutral-200">
                              {a.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative left-0 ml-0 w-[220px] min-w-[200px] max-w-[260px] card p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 w-12 rounded bg-blue-600 dark:bg-blue-500" />
                      <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        统计
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="w-full flex items-center justify-between gap-4 rounded-lg px-2.5 py-2">
                        <span className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                          总字数
                        </span>
                        <span className="shrink-0 inline-flex justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm font-semibold tabular-nums text-neutral-600 dark:text-neutral-200">
                          {typeof totalChars === 'number' ? totalChars.toLocaleString('zh-CN') : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="masonry">
                {posts.map((post) => (
                  <div key={post.slug} className="masonry-item">
                    <PostCard post={post} imageVariant="tall" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            暂时还没有旅行标签的文章。
          </div>
        )}
      </div>
    </div>
  );
}
