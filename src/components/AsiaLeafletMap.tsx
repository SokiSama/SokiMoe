'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type City = {
  name: string;
  lat: number;
  lng: number;
};

const cities: City[] = [
  { name: '成都', lat: 30.5728, lng: 104.0668 },
  { name: '香港', lat: 22.3193, lng: 114.1694 },
  { name: '澳门', lat: 22.1987, lng: 113.5439 },
  { name: '广州', lat: 23.1291, lng: 113.2644 },
  { name: '重庆', lat: 29.4316, lng: 106.9123 },
  { name: '吉隆坡', lat: 3.139, lng: 101.6869 },
];

export function AsiaLeafletMap({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    (async () => {
      const L = await import('leaflet');
      if (cancelled || !containerRef.current) return;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const maxBounds = L.latLngBounds([1, 50], [55, 145]);

      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true,
        maxBounds,
        maxBoundsViscosity: 1.0,
      });

      mapRef.current = map;

      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      });
      osm.addTo(map);

      L.control.layers({ OpenStreetMap: osm }).addTo(map);

      const points = cities.map((c) => L.latLng(c.lat, c.lng));
      const pointsBounds = L.latLngBounds(points);

      cities.forEach((city) => {
        L.marker([city.lat, city.lng]).addTo(map).bindPopup(city.name);
      });

      map.fitBounds(pointsBounds, { padding: [28, 28], maxZoom: 6 });
      map.setMaxBounds(maxBounds);

      requestAnimationFrame(() => map.invalidateSize());
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      className={cn(
        'w-full rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden',
        className
      )}
    >
      <div ref={containerRef} className="w-full h-[260px] sm:h-[360px] md:h-[460px]" />
    </div>
  );
}
