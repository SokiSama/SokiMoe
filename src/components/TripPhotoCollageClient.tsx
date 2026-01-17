'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

type Slot = { id: 'a' | 'b' | 'c' | 'd'; src: string; fileName: string };
type Right = { src: string; fileName: string };

function toAltText(fileName: string, slotLabel: string) {
  const base = fileName.replace(/\.[^.]+$/, '');
  return `旅行碎片 ${slotLabel}：${base}`;
}

function toLocationLabel(fileName: string) {
  const base = fileName.replace(/\.[^.]+$/, '').trim();
  const key = base.toLowerCase();
  const map: Record<string, string> = {
    hongkong: '中国香港',
    square: '马来西亚 * 吉隆坡',
    kl: '马来西亚 * 吉隆坡',
    zunyi: '贵州遵义',
    chongqing: '中国重庆',
    macou: '中国澳门',
    chengdu: '中国成都',
    hdl: '海德林咖啡餐厅',
  };
  return map[key] ?? base;
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
      <div className="trip-photos-left-column">
        <div className="trip-photos-left">
          {safeSlots.map((slot) => {
            const effective =
              slot.id === 'b'
                ? { ...slot, src: '/images/zunyi.jpeg', fileName: 'zunyi.jpeg' }
                : slot.id === 'c'
                  ? { ...slot, src: '/images/knd.jpeg', fileName: slot.fileName }
                  : slot;

            return (
              <div
                key={slot.id}
                id={`photo-slot-${slot.id}`}
                data-photo-slot={slot.id}
                className="trip-photo-tile"
              >
                <div className="trip-photo-tile-inner">
                  <Image
                    src={effective.src}
                    alt={toAltText(effective.fileName, `位置${slot.id.toUpperCase()}`)}
                    fill
                    sizes="(max-width: 768px) 50vw, 420px"
                    className="object-cover"
                  />
                  <span className="trip-photo-info">
                    <svg
                      className="trip-photo-info-icon"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                    </svg>
                    <span className="trip-photo-info-text">
                      {toLocationLabel(effective.fileName)}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
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
        <span className="trip-photo-info">
          <svg
            className="trip-photo-info-icon"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          </svg>
          <span className="trip-photo-info-text">{toLocationLabel(right.fileName)}</span>
        </span>
      </div>
    </div>
  );
}
