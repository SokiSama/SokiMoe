'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState, type WheelEvent } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

type Photo = {
  src: string;
  alt: string;
};

export function TripPhotoStream({
  photos,
  className,
}: {
  photos: Photo[];
  className?: string;
}) {
  const safePhotos = useMemo(() => photos.slice(0, 20), [photos]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  const open = (index: number) => {
    setOpenIndex(index);
    setZoom(1);
  };

  const close = useCallback(() => {
    setOpenIndex(null);
    setZoom(1);
  }, []);

  const goPrev = useCallback(() => {
    if (openIndex === null) return;
    setOpenIndex((v) => (v === null ? null : (v - 1 + safePhotos.length) % safePhotos.length));
    setZoom(1);
  }, [openIndex, safePhotos.length]);

  const goNext = useCallback(() => {
    if (openIndex === null) return;
    setOpenIndex((v) => (v === null ? null : (v + 1) % safePhotos.length));
    setZoom(1);
  }, [openIndex, safePhotos.length]);

  useEffect(() => {
    if (openIndex === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(3, Number((z + 0.2).toFixed(2))));
      if (e.key === '-' || e.key === '_') setZoom((z) => Math.max(1, Number((z - 0.2).toFixed(2))));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [close, goNext, goPrev, openIndex]);

  const onWheelZoom = (e: WheelEvent) => {
    if (openIndex === null) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.12 : 0.12;
    setZoom((z) => Math.min(3, Math.max(1, Number((z + delta).toFixed(2)))));
  };

  return (
    <>
      <section
        className={cn(
          'w-full bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm',
          className
        )}
      >
        <div className="px-4 pt-4">
          <div className="text-[18px] font-bold text-neutral-900 dark:text-neutral-100">
            旅行碎片
          </div>
        </div>

        <div className="mt-3 pb-4">
          <div className="flex overflow-x-auto gap-[10px] px-[15px] scrollbar-thin">
            {safePhotos.map((p, idx) => {
              const isLoaded = loaded[idx] === true;
              return (
                <button
                  key={`${p.src}-${idx}`}
                  type="button"
                  onClick={() => open(idx)}
                  className="group relative w-[120px] h-[120px] shrink-0 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/40"
                  aria-label={`查看大图：${p.alt}`}
                >
                  <div className={cn('absolute inset-0', isLoaded ? 'opacity-0' : 'opacity-100')}>
                    <div className="h-full w-full shimmer" />
                  </div>

                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="120px"
                    className={cn(
                      'object-cover transition-transform duration-300 ease-out',
                      'group-hover:scale-110',
                      isLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                    onLoad={() => setLoaded((m) => ({ ...m, [idx]: true }))}
                  />

                  <div className="absolute inset-0 bg-black/25 transition-all duration-300 ease-out group-hover:bg-black/10" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {openIndex !== null ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />

          <div className="absolute inset-0 flex items-center justify-center px-4 py-6">
            <div className="relative w-full max-w-5xl">
              <button
                type="button"
                onClick={close}
                className="absolute -top-12 right-0 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors"
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute -top-12 left-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, Number((z - 0.2).toFixed(2))))}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors"
                  aria-label="缩小"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, Number((z + 0.2).toFixed(2))))}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors"
                  aria-label="放大"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>

                <div className="ml-2 text-white/80 text-xs tabular-nums font-mono">
                  {openIndex + 1}/{safePhotos.length} · {Math.round(zoom * 100)}%
                </div>
              </div>

              <button
                type="button"
                onClick={goPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors"
                aria-label="上一张"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors"
                aria-label="下一张"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div
                className="relative w-full aspect-video bg-black/20 rounded-lg overflow-hidden border border-white/10"
                onWheel={onWheelZoom}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: `scale(${zoom})`,
                    transition: 'transform 180ms ease-out',
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={safePhotos[openIndex].src}
                      alt={safePhotos[openIndex].alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 1024px"
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 text-center text-sm text-white/85">
                {safePhotos[openIndex].alt}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
