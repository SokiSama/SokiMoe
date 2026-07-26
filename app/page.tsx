import { BangumiAnimeCard } from "./components/BangumiAnimeCard";
import { HomePageClient } from "./components/HomePageClient";

export const dynamic = "force-dynamic";

export default function Home() {
  return <HomePageClient animeCard={<BangumiAnimeCard />} />;
}
