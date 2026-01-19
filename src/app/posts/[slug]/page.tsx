'use client';

import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { usePost } from '@/hooks/usePost';
import { usePosts } from '@/hooks/usePosts';
import { useTableOfContents } from '@/hooks/useTableOfContents';
import { formatDate } from '@/lib/utils';
import { TagList } from '@/components/TagList';
import { TableOfContents } from '@/components/TableOfContents';
import { useParams } from 'next/navigation';
import { LoadingTransition } from '@/components/LoadingComponents';
import { CodeBlock } from '@/components/CodeBlock';

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { post, htmlContent, loading, error } = usePost(slug, true);
  const { headings, activeId, isVisible, scrollToHeading } = useTableOfContents({
    htmlContent,
    offsetTop: 100
  });
  const isTech = Array.isArray(post?.tags) && post!.tags.some((t) => t.toLowerCase() === 'tech');
  const isTrip = Array.isArray(post?.tags) && post!.tags.some((t) => t === '旅行' || t.toLowerCase() === 'trip');
  const proseClass = 'post-prose';
  const { posts: allPosts } = usePosts({ excludeTags: isTech ? undefined : ['tech', '旅行'] });
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex >= 0 ? allPosts[currentIndex + 1] : undefined;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScrollTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  if (error) {
    return (
      <article className="trip-section-compact px-6 sm:px-8 lg:px-12 py-12">
        <div className="text-center py-16 fade-in">
          <div className="text-red-500 dark:text-red-400">
            <h2 className="text-2xl font-semibold mb-4">加载失败</h2>
            <p>{error}</p>
            <Link 
              href="/posts" 
              className="inline-flex items-center mt-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回文章列表
            </Link>
          </div>
        </div>
      </article>
    );
  }

  if (!loading && !post) {
    notFound();
  }

  const skeletonContent = (
    <article className="trip-section-compact px-6 sm:px-8 lg:px-12 py-12">
      <div className="mb-8">
        <div className="h-6 w-32 shimmer rounded mb-4"></div>
      </div>

      <header className="mb-8">
        <div className="h-8 w-3/4 shimmer rounded mb-4"></div>
        <div className="h-4 w-48 shimmer rounded mb-2"></div>
        <div className="h-4 w-32 shimmer rounded mb-6"></div>
        <div className="h-20 w-full shimmer rounded mb-8"></div>
      </header>

      <div className="space-y-4 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`shimmer rounded ${
            i === 3 || i === 7 ? 'h-4 w-2/3' : 'h-4 w-full'
          }`}></div>
        ))}
      </div>

      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 w-1/2 shimmer rounded"></div>
            <div className="h-4 w-full shimmer rounded"></div>
            <div className="h-4 w-5/6 shimmer rounded"></div>
            <div className="h-4 w-4/5 shimmer rounded"></div>
          </div>
        ))}
      </div>
    </article>
  );

  const actualContent = (
    <div className="trip-section-compact px-6 sm:px-8 lg:px-12">
      <div className="lg:grid lg:grid-cols-[1fr,260px] lg:gap-6 xl:gap-8">
        <article className="py-12 min-w-0 posts-article">
          

          {/* 文章头部 */}
          <header className="mb-8 fade-in-up">
            {post?.cover && (
              <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {post?.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post?.date}>
                  {post?.date ? formatDate(post.date) : ''}
                </time>
              </div>
              
              {post?.readingTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} 分钟阅读</span>
                </div>
              )}
            </div>
            
            {post?.tags && post.tags.length > 0 && (
              <div className="mb-8">
                <TagList tags={post.tags} linkable showIcon />
              </div>
            )}
            
            {post?.description && (
              <div className="text-lg text-muted-foreground mb-8 p-4 bg-muted rounded-lg">
                {post.description}
              </div>
            )}
          </header>

          {/* 文章内容 */}
          <div className="fade-in-delayed" style={{ animationDelay: '0.2s' }}>
            {htmlContent && (
              <div className="post-content">
                <div className={proseClass}>
                  <CodeBlock html={htmlContent} />
                </div>
              </div>
            )}
          {/* 上一篇 / 下一篇 */}
          {(prevPost || nextPost) && (
            <nav className="post-navigation fade-in-delayed" style={{ animationDelay: '0.3s' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevPost && (
                  <Link
                    href={`/posts/${encodeURIComponent(prevPost.slug)}`}
                    className="post-nav-link group"
                    aria-label={`上一篇：${prevPost.title}`}
                  >
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">上一篇</div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-primary transition-colors">
                        {prevPost.title}
                      </span>
                      <ArrowLeft className="h-4 w-4 text-neutral-400 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                )}
                {nextPost && (
                  <Link
                    href={`/posts/${encodeURIComponent(nextPost.slug)}`}
                    className="post-nav-link group md:text-right"
                    aria-label={`下一篇：${nextPost.title}`}
                  >
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 md:text-right">下一篇</div>
                    <div className="flex items-center justify-between gap-3 md:flex-row-reverse">
                      <span className="truncate font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-primary transition-colors">
                        {nextPost.title}
                      </span>
                      <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                )}
              </div>
            </nav>
          )}

          </div>

          {/* 文章底部 */}
          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 fade-in-delayed" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  如果你觉得这篇文章有用，欢迎分享给更多人。
                </p>
              </div>
            </div>
          </footer>
        </article>

        {(isTech || isTrip) && isVisible && (
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents
                headings={headings}
                activeId={activeId}
                variant="sidebar"
                onItemClick={scrollToHeading}
                showProgress={true}
                className="!relative !right-auto !top-auto !w-full"
              />
            </div>
          </div>
        )}
      </div>

      {(isTech || isTrip) && isVisible && (
        <div className="lg:hidden">
          <TableOfContents
            headings={headings}
            activeId={activeId}
            variant="floating"
            onItemClick={scrollToHeading}
          />
        </div>
      )}

      {showScrollTop && (
        <div className="fixed left-6 bottom-6 z-40">
          <button
            type="button"
            onClick={handleScrollTop}
            aria-label="置顶"
            className="h-12 w-12 rounded-2xl bg-white text-neutral-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center border border-neutral-100 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <LoadingTransition
      loading={loading}
      skeleton={skeletonContent}
      delay={300}
    >
      {actualContent}
    </LoadingTransition>
  );
}
