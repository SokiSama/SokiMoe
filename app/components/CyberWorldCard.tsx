"use client";

import { useEffect, useState } from "react";
import { ArrowsOut, X } from "@phosphor-icons/react";

const photos = [
  {
    src: "/images/vrc/cyber-world-01.webp",
    alt: "在木质空间里与三位 VRChat 朋友的合影",
  },
  {
    src: "/images/vrc/cyber-world-02.webp",
    alt: "在栖鸦居所与朋友坐在一起的 VRChat 合影",
  },
  {
    src: "/images/vrc/cyber-world-03.webp",
    alt: "在栖鸦居所与朋友的 VRChat 合影",
  },
  {
    src: "/images/vrc/cyber-world-04.webp",
    alt: "洞穴场景中三位 VRChat 朋友的合影",
  },
  {
    src: "/images/vrc/cyber-world-05.webp",
    alt: "夕阳城市水岸前的 VRChat 多人合影",
  },
  {
    src: "/images/vrc/cyber-world-06.webp",
    alt: "神社夜景中的 VRChat 角色近照",
  },
  {
    src: "/images/vrc/cyber-world-07.webp",
    alt: "神社夜景中两位 VRChat 朋友的合影",
  },
  {
    src: "/images/vrc/cyber-world-08.webp",
    alt: "蓝色紫藤花廊中的 VRChat 角色留影",
  },
  {
    src: "/images/vrc/cyber-world-09.webp",
    alt: "星空花海中两位 VRChat 朋友的合影",
  },
  {
    src: "/images/vrc/cyber-world-10.webp",
    alt: "明亮房间中捧着茶杯阅读的 VRChat 角色留影",
  },
  {
    src: "/images/vrc/cyber-world-11.webp",
    alt: "暖色木屋中两位 VRChat 朋友的合影",
  },
] as const;

export function CyberWorldCard() {
  const [activePhoto, setActivePhoto] = useState<number | null>(null);

  useEffect(() => {
    if (activePhoto === null) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivePhoto(null);
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activePhoto]);

  return (
    <>
      <section className="card cyber-world-card" aria-labelledby="cyber-world-title">
        <header className="cyber-world-heading">
          <div>
            <span>CYBER WORLD</span>
            <h2 id="cyber-world-title">VRChat 记录</h2>
          </div>
          <p>感谢那段时间大家的陪伴，我想我要回到现实了</p>
        </header>

        <div className="cyber-world-wall">
          {photos.map((photo, index) => (
            <button
              className="cyber-world-photo"
              type="button"
              key={photo.src}
              onClick={() => setActivePhoto(index)}
              aria-label={`放大查看：${photo.alt}`}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
              <span className="cyber-world-photo__zoom" aria-hidden="true">
                <ArrowsOut weight="bold" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {activePhoto !== null && (
        <div
          className="cyber-world-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="照片大图预览"
          onClick={() => setActivePhoto(null)}
        >
          <button
            type="button"
            className="cyber-world-lightbox__close"
            onClick={() => setActivePhoto(null)}
            aria-label="关闭大图"
            autoFocus
          >
            <X weight="bold" />
          </button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={photos[activePhoto].src} alt={photos[activePhoto].alt} />
          </figure>
        </div>
      )}
    </>
  );
}
