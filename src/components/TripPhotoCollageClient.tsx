'use client';

import Image from 'next/image';

export function TripPhotoCollageClient({ className = '' }: { className?: string }) {
  return (
    <div className={['trip-photos-layout', className].filter(Boolean).join(' ')}>
      <div className="trip-photos-left-column">
        <div className="trip-photos-cyber">
          <div className="trip-photos-cyber-inner">
            <Image
              src="/images/cyber.jpeg"
              alt="探索世界、认识自我、体验文化"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
            <div className="trip-photos-cyber-caption">未完待续...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
