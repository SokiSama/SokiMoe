import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { PostMeta } from '@/types';
import { formatDate } from '@/lib/utils';
import { TagList } from './TagList';

interface PostCardProps {
  post: PostMeta;
  imageVariant?: 'left' | 'right' | 'tall' | 'inlineTop';
  compact?: boolean;
}

export function PostCard({ post, imageVariant = 'left', compact = false }: PostCardProps) {
  const imageContainerClass =
    imageVariant === 'tall'
      ? 'relative w-full post-card-image-blur post-card-image-fade-bottom h-0 overflow-hidden post-card-image-aspect'
      : imageVariant === 'right'
        ? 'float-right ml-4 mb-3 h-[100px] w-[120px] md:w-[160px] overflow-hidden'
        : imageVariant === 'inlineTop'
          ? 'w-full max-w-[200px] md:max-w-[240px] h-[150px] md:h-[180px] mb-3 overflow-hidden mx-auto'
          : 'float-left mr-4 mb-3 h-[100px] w-[120px] md:w-[160px] overflow-hidden';

  return (
    <article className={['card', 'posts-list__item', imageVariant === 'tall' ? 'no-radius' : '', 'post-card', 'post-card--interactive', compact ? 'post-card--compact' : '', 'transition-all', 'duration-200', 'hover:shadow-md', 'overflow-hidden'].filter(Boolean).join(' ')}>
      <div className={imageVariant === 'tall' ? 'flex flex-col' : 'block'}>
        {imageVariant === 'tall' && post.cover && (
          <div className={imageContainerClass}>
            <Image
              src={post.cover}
              alt={post.title}
              fill
              sizes="100vw"
              unoptimized
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className={`post-card__body ${imageVariant === 'tall' ? 'flex flex-col p-6 md:p-8' : 'p-6'}`}>
          {imageVariant !== 'tall' && post.cover && (
            <div className={imageContainerClass}>
              <Image
                src={post.cover}
                alt={post.title}
                width={imageVariant === 'inlineTop' ? 240 : 160}
                height={imageVariant === 'inlineTop' ? 180 : 100}
                sizes={imageVariant === 'inlineTop' ? '(min-width: 768px) 240px, 200px' : '(min-width: 768px) 160px, 120px'}
                quality={imageVariant === 'inlineTop' ? 100 : 85}
                unoptimized={imageVariant === 'inlineTop'}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="flex-1">
            <h3 className="post-card__title text-xl font-semibold mb-3 leading-snug">
              <Link 
                href={`/posts/${post.slug}`}
                className="text-neutral-900 dark:text-neutral-100"
              >
                {post.title}
              </Link>
            </h3>
            
            {post.excerpt && (
              <p className="post-card__text text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            )}
            
            {imageVariant === 'tall' ? (
              <div className="mb-2 flex items-center justify-between">
                <div>
                  {post.tags.length > 0 && <TagList tags={post.tags} />}
                </div>
                <div className="flex items-center gap-2 md:gap-4 whitespace-nowrap text-neutral-500 dark:text-neutral-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {post.tags.length > 0 && (
                  <div className="mb-4">
                    <TagList tags={post.tags} />
                  </div>
                )}
              </>
            )}
          </div>
          
          {imageVariant !== 'tall' && (
            <div className={`post-card__footer flex flex-col gap-2 text-sm text-neutral-500 dark:text-neutral-500 pt-4 border-t border-neutral-200 dark:border-neutral-700 clear-both`}>
              <div className="flex items-center gap-2 md:gap-4 whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                </div>
              </div>
              
              <Link 
                href={`/posts/${post.slug}`}
                className="text-neutral-600 dark:text-neutral-400 font-medium self-end"
              >
                阅读更多 →
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
