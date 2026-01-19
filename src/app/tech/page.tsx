import Link from 'next/link';
import { PostCard } from '@/components/PostCard';
import { getAllPosts, getPostBySlug, markdownToHtml } from '@/lib/posts';

export default async function TechPage() {
  const allowed = new Set(['教程', '思考', '图文'].map((t) => t.toLowerCase()));
  const posts = getAllPosts().filter((p) =>
    p.tags.some((t) => allowed.has(t.toLowerCase()))
  );
  
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
        return { year, count: sorted.length };
      })
      .sort((a, b) => b.year - a.year);
  })();

  const tagCounts = (() => {
    const counts = new Map<string, number>();
    for (const p of posts) {
      for (const t of p.tags || []) {
        const lower = t.toLowerCase();
        if (!allowed.has(lower)) continue;
        counts.set(t, (counts.get(t) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  })();

  const totalChars = await (async () => {
    if (!posts.length) return 0;
    const counts = await Promise.all(
      posts.map(async (p) => {
        const full = getPostBySlug(p.slug);
        if (!full || !full.content) return 0;
        const html = await markdownToHtml(full.content);
        const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, '');
        return text.length;
      })
    );
    return counts.reduce((a, b) => a + b, 0);
  })();

  // 年份分隔已移除

  return (
    <div className="content-wrapper py-12">
        <div className="mb-8 fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            文章
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            记录一些 教程 / 思考 / 图文
          </p>
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
                        分类
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {tagCounts.length > 0 ? (
                        tagCounts.map(({ tag, count }) => (
                          <div key={tag} className="flex items-center justify-between gap-4 rounded-lg px-2.5 py-2">
                            <Link
                              href={`/tags/${encodeURIComponent(tag)}`}
                              className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 truncate hover:text-primary transition-colors"
                            >
                              {tag}
                            </Link>
                            <span className="shrink-0 inline-flex min-w-[3.25rem] justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm font-semibold tabular-nums text-neutral-600 dark:text-neutral-200">
                              {count}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">暂无分类</div>
                      )}
                    </div>
                  </div>

                  <div className="relative left-0 ml-0 w-[220px] min-w-[200px] max-w-[260px] card p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 w-12 rounded bg-blue-600 dark:bg-blue-500" />
                      <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        归档
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {archives.length > 0 ? (
                        archives.map((a) => (
                          <div key={a.year} className="flex items-center justify-between gap-4 rounded-lg px-2.5 py-2">
                            <span className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                              {a.year}年
                            </span>
                            <span className="shrink-0 inline-flex min-w-[3.25rem] justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm font-semibold tabular-nums text-neutral-600 dark:text-neutral-200">
                              {a.count}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">暂无归档</div>
                      )}
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
              <div className="stagger-children space-y-6">
                {posts.map((post, index) => (
                  <div key={post.slug}>
                    <PostCard post={post} imageVariant={index % 2 === 0 ? 'left' : 'right'} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-neutral-500 dark:text-neutral-400">
            暂时还没有 tech 标签的文章。
          </div>
        )}
    </div>
  );
}
