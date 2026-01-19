import { YearProgressBar } from '@/components/YearProgressBar';
import { TravelFootprint } from '@/components/TravelFootprint';
import { PostCard } from '@/components/PostCard';
import { getPostsByTag } from '@/lib/posts';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function TripPage() {
  const posts = getPostsByTag('旅行');
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
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} imageVariant="tall" />
            ))}
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
