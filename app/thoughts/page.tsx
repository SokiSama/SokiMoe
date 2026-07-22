import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { thoughts } from "../data/thoughts";
import { ThoughtsExperience } from "./ThoughtsExperience";

export default function ThoughtsPage() {
  return (
    <div className="site">
      <SiteHeader active="thoughts" />
      <main id="top" className="thoughts-page">
        <ThoughtsExperience thoughts={thoughts} />
      </main>
      <SiteFooter />
      <a className="back-top" href="#top" aria-label="回到顶部">↑</a>
    </div>
  );
}
