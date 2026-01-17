import { YearProgressBar } from '@/components/YearProgressBar';
import { TripPhotoCollageClient } from '@/components/TripPhotoCollageClient';
import { TravelFootprint } from '@/components/TravelFootprint';
import path from 'path';
import { readdir } from 'fs/promises';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const RIGHT_FILE_CANDIDATES = ['hdl.jpeg', 'hdl.jpg', 'hdl.png'] as const;

function isImageFile(fileName: string) {
  return /\.(avif|gif|jpe?g|png|webp)$/i.test(fileName);
}

function toAltText(fileName: string, slotLabel: string) {
  const base = fileName.replace(/\.[^.]+$/, '');
  return `旅行碎片 ${slotLabel}：${base}`;
}

async function getTripImageSlots() {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  const files = (await readdir(imagesDir).catch(() => []))
    .filter((f) => isImageFile(f))
    .sort((a, b) => a.localeCompare(b));

  const rightFile =
    RIGHT_FILE_CANDIDATES.map((name) =>
      files.find((f) => f.toLowerCase() === name.toLowerCase())
    ).find((f): f is string => typeof f === 'string') ?? files[0] ?? 'hdl.jpeg';
  const remaining = files.filter((f) => f.toLowerCase() !== rightFile.toLowerCase());

  const preferredOrder = ['square.jpeg', 'KL.jpeg', 'HongKong.jpeg', 'Chongqing.jpeg', 'Macou.jpeg', 'chengdu.jpeg'];
  const pickByName = (name: string) =>
    remaining.find((f) => f.toLowerCase() === name.toLowerCase());
  const ordered = preferredOrder
    .map((n) => pickByName(n))
    .filter((v): v is string => typeof v === 'string');
  const rest = remaining.filter((f) => !ordered.includes(f));
  const finalList = [...ordered, ...rest];
  const fallback = finalList.length > 0 ? finalList[0] : rightFile;
  const pick = (idx: number) => finalList[idx] ?? fallback;

  return {
    right: { src: `/images/${rightFile}`, fileName: rightFile },
    slots: [
      { id: 'a' as const, fileName: pick(0), src: `/images/${pick(0)}` },
      { id: 'b' as const, fileName: pick(1), src: `/images/${pick(1)}` },
      { id: 'c' as const, fileName: pick(2), src: `/images/${pick(2)}` },
      { id: 'd' as const, fileName: pick(3), src: `/images/${pick(3)}` },
    ],
  };
}

export default async function TripPage() {
  const { right, slots } = await getTripImageSlots();

  return (
    <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <h1 className="trip-section-compact text-3xl font-bold mb-4 fade-in-up">
        在此，打破次元隔阂
      </h1>
      <div className="trip-section-compact">
        <YearProgressBar />
      </div>
      <TravelFootprint />
      <TripPhotoCollageClient className="trip-section-compact mt-5" slots={slots} right={right} />
    </div>
  );
}
