import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { PageCoverBanner } from "../components/PageCoverBanner";
import { thoughts } from "../data/thoughts";
import { ThoughtsExperience } from "./ThoughtsExperience";

export default function ThoughtsPage() {
  return (
    <div className="site immersive-route thoughts-route">
      <SiteHeader active="thoughts" floating />
      <PageCoverBanner
        eyebrow="THOUGHTS IN THE WORLD"
        title="碎念，是时光的轻声回响"
        description="生活的点滴想法，记录当下的心情与思考。"
        image="/thoughts-hero.png"
        imagePosition="center 74%"
      />
      <main id="top" className="thoughts-page immersive-content">
        <ThoughtsExperience thoughts={thoughts} />
      </main>
      <SiteFooter />
      <a className="back-top" href="#top" aria-label="回到顶部">↑</a>
    </div>
  );
}
