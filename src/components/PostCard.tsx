import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { PostMeta } from '@/types';
import { formatDate } from '@/lib/utils';
import { TagList } from './TagList';

interface PostCardProps {
  post: PostMeta;
  imageVariant?: 'left' | 'right' | 'tall';
}

export function PostCard({ post, imageVariant = 'left' }: PostCardProps) {
  const imageContainerClass =
    imageVariant === 'tall'
      ? 'relative w-full h-0 pb-[56.25%] overflow-hidden rounded'
      : imageVariant === 'right'
        ? 'float-right ml-4 mb-3 h-[100px] w-[120px] md:w-[160px] overflow-hidden rounded'
        : 'float-left mr-4 mb-3 h-[100px] w-[120px] md:w-[160px] overflow-hidden rounded';

  return (
    <article className="card posts-list__item post-card post-card--interactive transition-all duration-200 hover:shadow-md overflow-hidden">
      <div className={imageVariant === 'tall' ? 'flex flex-col' : 'block'}>
        {imageVariant === 'tall' && post.cover && (
          <div className={imageContainerClass}>
            <Image
              src={post.cover}
              alt={post.title}
              fill
              sizes="100vw"
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        <div className={`post-card__body ${imageVariant === 'tall' ? 'flex flex-col p-6 md:p-8' : 'p-6'}`}>
          {imageVariant !== 'tall' && post.cover && (
            <div className={imageContainerClass}>
              <Image
                src={post.cover}
                alt={post.title}
                width={192}
                height={100}
                sizes="(min-width: 768px) 192px, 160px"
                quality={85}
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
            
            {post.tags.length > 0 && (
              <div className="mb-4">
                <TagList tags={post.tags} />
              </div>
            )}
          </div>
          
          <div className={`post-card__footer flex flex-col gap-2 text-sm text-neutral-500 dark:text-neutral-500 pt-4 border-t border-neutral-200 dark:border-neutral-700 ${imageVariant === 'tall' ? '' : 'clear-both'}`}>
            <div className="flex items-center gap-2 md:gap-4 whitespace-nowrap">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
              
              {post.readingTime && (
                <div className="flex items-center space-x-1 shrink-0">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} 分钟阅读</span>
                </div>
              )}
            </div>
            
            <Link 
              href={`/posts/${post.slug}`}
              className="text-neutral-600 dark:text-neutral-400 font-medium self-end"
            >
              阅读更多 →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
