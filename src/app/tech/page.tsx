import { PostCard } from '@/components/PostCard';
import { getPostsByTag } from '@/lib/posts';

export default async function TechPage() {
  const posts = getPostsByTag('tech');

  return (
    <div className="content-wrapper py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            Tech
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            这里记录一些教程。
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-neutral-500 dark:text-neutral-400">
            暂时还没有 tech 标签的文章。
          </div>
        )}
      </div>
    </div>
  );
}
