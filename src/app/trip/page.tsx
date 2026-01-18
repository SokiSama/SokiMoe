import { YearProgressBar } from '@/components/YearProgressBar';
import { TravelFootprint } from '@/components/TravelFootprint';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function TripPage() {
  return (
    <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <h1 className="trip-section-compact text-3xl font-bold mb-4 fade-in-up">
        迷途之子，步履不停，即是归处。
      </h1>
      <div className="trip-section-compact">
        <YearProgressBar />
      </div>
      <TravelFootprint />
    </div>
  );
}
