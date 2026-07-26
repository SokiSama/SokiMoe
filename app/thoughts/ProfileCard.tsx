import { MapPin } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

type ProfileCardProps = {
  thoughtCount: number;
  recordDays: number;
};

export function ProfileCard({
  thoughtCount,
  recordDays,
}: ProfileCardProps) {
  return (
    <section className="thought-profile-card card">
      <div className="thought-profile-card__body">
        <Image
          className="thought-profile-card__avatar"
          src="/about-avatar.png"
          alt="Soki"
          width={74}
          height={74}
        />
        <h2>Soki</h2>
        <p>ACG / INFP / 社畜 / 光呆 / 平成死宅</p>
        <div className="thought-profile-card__location">
          <MapPin weight="fill" aria-hidden="true" />
          <span>29.56°N / 106.55°E</span>
        </div>

        <div className="thought-profile-card__stats">
          <div>
            <span>碎念</span>
            <strong>{thoughtCount}</strong>
          </div>
          <div>
            <span>记录天数</span>
            <strong>{recordDays}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
