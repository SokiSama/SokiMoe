'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, MapPin, Route, Plane } from 'lucide-react';

type CityId =
  | 'hongkong'
  | 'kl'
  | 'zunyi'
  | 'xiaogan'
  | 'chongqing'
  | 'macau'
  | 'chengdu';
type NextId = 'thailand' | 'japan';

const cities: {
  id: CityId;
  name: string;
  country: string;
  image: string;
  distanceKm: number;
}[] = [
  {
    id: 'hongkong',
    name: '中国香港',
    country: '中国',
    image: '/images/HongKong.jpeg',
    distanceKm: 700,
  },
  {
    id: 'kl',
    name: '马来西亚 吉隆坡',
    country: '马来西亚',
    image: '/images/square.jpeg',
    distanceKm: 2600,
  },
  {
    id: 'zunyi',
    name: '贵州遵义',
    country: '中国',
    image: '/images/huiyi.jpeg',
    distanceKm: 900,
  },
  {
    id: 'xiaogan',
    name: '湖北孝感',
    country: '中国',
    image: '/images/xiaogan.png',
    distanceKm: 1000,
  },
  {
    id: 'chongqing',
    name: '中国重庆',
    country: '中国',
    image: '/images/lfs.jpeg',
    distanceKm: 700,
  },
  {
    id: 'macau',
    name: '中国澳门',
    country: '中国',
    image: '/images/Macou.jpeg',
    distanceKm: 700,
  },
  {
    id: 'chengdu',
    name: '四川成都',
    country: '中国',
    image: '/images/chengdu.jpeg',
    distanceKm: 900,
  },
];

const nextOptions: {
  id: NextId;
  label: string;
  subtitle: string;
  accent: 'th' | 'jp';
}[] = [
  {
    id: 'thailand',
    label: '泰国',
    subtitle: '曼谷・清迈・海岛',
    accent: 'th',
  },
  {
    id: 'japan',
    label: '日本',
    subtitle: '京都・东京 圣地巡礼',
    accent: 'jp',
  },
];

const CHONGQING_COORD = {
  lat: 29.56301,
  lng: 106.55156,
};

function distanceKmFromChongqing(lat: number, lng: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat - CHONGQING_COORD.lat);
  const dLng = toRad(lng - CHONGQING_COORD.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(CHONGQING_COORD.lat)) *
      Math.cos(toRad(lat)) *
      Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function formatDistanceKm(value: number) {
  const rounded = Math.round(value);
  return rounded.toLocaleString('zh-CN');
}

function useCountUp(target: number, durationMs: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let rafId: number;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [target, durationMs]);

  return value;
}

export function TravelFootprint() {
  const cityCount = cities.length;
  const countryCount = useMemo(
    () => new Set(cities.map((c) => c.country)).size,
    []
  );
  const totalDistance = useMemo(
    () => cities.reduce((sum, c) => sum + c.distanceKm, 0),
    []
  );

  const animatedCities = useCountUp(cityCount, 900);
  const animatedCountries = useCountUp(countryCount, 1200);
  const animatedDistance = useCountUp(totalDistance, 1500);

  const [pathProgress, setPathProgress] = useState(0);
  const [planeOffset, setPlaneOffset] = useState(0);
  const pathRef = useRef<HTMLDivElement | null>(null);
  const [hoverCity, setHoverCity] = useState<CityId | null>(null);
  const [activeCity, setActiveCity] = useState<CityId | null>('hongkong');
  const [selectedNext, setSelectedNext] = useState<NextId>('japan');
  const [showLiveDistance, setShowLiveDistance] = useState(false);
  const [distanceStatus, setDistanceStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [distanceError, setDistanceError] = useState<string | null>(null);
  const [liveDistanceKm, setLiveDistanceKm] = useState<number | null>(null);
  const [geoWatchId, setGeoWatchId] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPathProgress(100);
    }, 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;

    const clamped = Math.min(100, Math.max(0, pathProgress));
    const planeSize = 24;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const width = rect.width;
      const maxTravel = Math.max(0, width - planeSize);
      const nextOffset = (maxTravel * clamped) / 100;
      setPlaneOffset(nextOffset);
    };

    update();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => update());
      ro.observe(el);
      return () => ro.disconnect();
    }

    return;
  }, [pathProgress]);

  useEffect(() => {
    return () => {
      if (geoWatchId !== null && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(geoWatchId);
      }
    };
  }, [geoWatchId]);

  const handlePreviewHeaderClick = () => {
    if (showLiveDistance) {
      return;
    }
    setShowLiveDistance(true);

    if (typeof window === 'undefined') {
      return;
    }

    try {
      const cached = window.localStorage.getItem('travelDistanceFromChongqing');
      if (cached) {
        const parsed = JSON.parse(cached) as {
          value: number;
          timestamp: number;
        };
        if (
          typeof parsed.value === 'number' &&
          typeof parsed.timestamp === 'number' &&
          Date.now() - parsed.timestamp < 5 * 60 * 1000
        ) {
          setLiveDistanceKm(parsed.value);
          setDistanceStatus('success');
          setDistanceError(null);
          return;
        }
      }
    } catch {
    }

    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setDistanceStatus('error');
      setDistanceError('当前浏览器不支持位置获取，暂无法计算距离。');
      return;
    }

    setDistanceStatus('loading');
    setDistanceError(null);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const nextDistanceKm = distanceKmFromChongqing(
          position.coords.latitude,
          position.coords.longitude
        );
        setLiveDistanceKm(nextDistanceKm);
        setDistanceStatus('success');
        setDistanceError(null);
        try {
          window.localStorage.setItem(
            'travelDistanceFromChongqing',
            JSON.stringify({
              value: nextDistanceKm,
              timestamp: Date.now(),
            })
          );
        } catch {
        }
      },
      () => {
        setDistanceStatus('error');
        setDistanceError('无法获取当前位置，请检查浏览器定位权限设置。');
      },
      {
        enableHighAccuracy: false,
        maximumAge: 10000,
        timeout: 10000,
      }
    );

    setGeoWatchId(id);
  };

  const activeCityData = useMemo(
    () => cities.find((c) => c.id === activeCity) ?? cities[0],
    [activeCity]
  );

  const previewCity = useMemo(
    () => cities.find((c) => c.id === (hoverCity ?? activeCityData.id)),
    [hoverCity, activeCityData.id]
  );

  return (
    <section className="trip-section-compact mt-10 mb-12">
      <div className="travel-footprint-card fade-in-up">
        <div className="travel-footprint-header">
          <div className="flex items-center gap-2">
            <span className="travel-footprint-pill">
              <Plane className="h-3.5 w-3.5" />
              <span>旅行足迹</span>
            </span>
            <span className="travel-footprint-subtitle">
              Where is next?
            </span>
          </div>
        </div>

        <div className="travel-footprint-grid">
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <div className="flex items-baseline gap-2">
                <span className="travel-stat-number">
                  {animatedCities}
                </span>
                <span className="travel-stat-label">个城市</span>
              </div>
              <span className="text-neutral-400 dark:text-neutral-500 text-sm">
                已踏足
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-1.5">
                <span className="travel-stat-subnumber">
                  {animatedCountries}
                </span>
                <span className="travel-stat-sublabel">个国家</span>
              </div>
              <div className="travel-distance-chip">
                <Route className="h-3.5 w-3.5" />
                <span>
                  旅行距离
                  {' '}
                  {animatedDistance.toLocaleString()}
                  km
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>从家出发，向着下一段旅程前进中...</span>
              </div>
              <div
                className="travel-path-bar"
                ref={pathRef}
              >
                <div className="travel-path-bar-inner" />
                <div
                  className="travel-path-plane"
                  style={{
                    transform: `translate3d(${planeOffset}px, -50%, 0)`,
                    transition: 'transform 5s linear',
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M2.5 19.5L21 12 2.5 4.5 2.5 10.5 14 12 2.5 13.5z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                已解锁城市
              </div>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => {
                  const active = city.id === activeCityData.id;
                  return (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => setActiveCity(city.id)}
                      onMouseEnter={() => setHoverCity(city.id)}
                      onMouseLeave={() => setHoverCity(null)}
                      className={[
                        'travel-city-chip',
                        active
                          ? 'travel-city-chip-active'
                          : 'travel-city-chip-muted',
                      ].join(' ')}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">{city.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="travel-city-preview">
              {previewCity && (
                <>
                  <div className="travel-city-preview-image">
                    <Image
                      src={previewCity.image}
                      alt={previewCity.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 260px"
                      className="object-cover"
                    />
                  </div>
                  <div
                    className="travel-city-preview-info"
                    onClick={handlePreviewHeaderClick}
                  >
                    <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {showLiveDistance ? (
                        distanceStatus === 'loading' ? (
                          '正在计算从中国重庆到你当前位置的距离…'
                        ) : distanceStatus === 'error' && distanceError ? (
                          distanceError
                        ) : liveDistanceKm != null ? (
                          `从中国重庆到你当前位置约 ${formatDistanceKm(
                            liveDistanceKm
                          )} 公里`
                        ) : null
                      ) : null}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="travel-next-section">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    下一站
                  </span>
                  <span className="travel-next-arrow group">
                    <span>Next</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
                <span className="travel-pilgrimage-chip">
                  <span className="travel-torii" />
                  <span>圣地巡礼</span>
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {nextOptions.map((option) => {
                  const selected = option.id === selectedNext;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={[
                        'travel-next-option',
                        `travel-flag-${option.accent}`,
                        selected ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => setSelectedNext(option.id)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                          {option.label}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-neutral-700 dark:text-neutral-300">
                        {option.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
