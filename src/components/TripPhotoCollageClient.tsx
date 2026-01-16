'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

type Slot = { id: 'a' | 'b' | 'c' | 'd'; src: string; fileName: string };
type Right = { src: string; fileName: string };

function toAltText(fileName: string, slotLabel: string) {
  const base = fileName.replace(/\.[^.]+$/, '');
  return `旅行碎片 ${slotLabel}：${base}`;
}

export function TripPhotoCollageClient({
  slots,
  right,
  className = '',
}: {
  slots: Slot[];
  right: Right;
  className?: string;
}) {
  const rightRef = useRef<HTMLDivElement | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const [rightHeight, setRightHeight] = useState<number | null>(null);

  const safeSlots = useMemo(() => slots.slice(0, 4), [slots]);

  useEffect(() => {
    const el = rightRef.current;
    if (!el || ratio === null) return;

    const update = () => {
      const w = el.getBoundingClientRect().width;
      const h = Math.max(1, Math.round(w * ratio));
      setRightHeight(h);
    };

    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, [ratio]);

  return (
    <div className={["trip-photos-layout", className].filter(Boolean).join(' ')}>
      <div className="trip-photos-left">
        {safeSlots.map((slot) => (
          <div
            key={slot.id}
            id={`photo-slot-${slot.id}`}
            data-photo-slot={slot.id}
            className="trip-photo-tile"
          >
            <div className="trip-photo-tile-inner">
              <Image
                src={slot.src}
                alt={toAltText(slot.fileName, `位置${slot.id.toUpperCase()}`)}
                fill
                sizes="(max-width: 768px) 50vw, 420px"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      <div
        ref={rightRef}
        id="photo-slot-hdl"
        data-photo-slot="hdl"
        className="trip-photo-right-wrap"
        style={{ height: rightHeight ? `${rightHeight}px` : undefined }}
      >
        <Image
          src={right.src}
          alt={toAltText(right.fileName, '最右侧')}
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-contain"
          priority
          onLoadingComplete={(img) => {
            const w = img.naturalWidth;
            const h = img.naturalHeight;
            if (w > 0 && h > 0) setRatio(h / w);
          }}
        />
      </div>
    </div>
  );
}
