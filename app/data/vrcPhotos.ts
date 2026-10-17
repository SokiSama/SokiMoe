export type VrcPhoto = { src: string; alt: string; capturedAt?: string };

// Add capturedAt only when the original shooting date is known.
export const vrcPhotos: readonly VrcPhoto[] = [
  {
    src: "/images/vrc/cyber-world-01.webp",
    alt: "暖色室内三位 VRChat 朋友的合影",
  },
  {
    src: "/images/vrc/cyber-world-02.webp",
    alt: "明亮咖啡店里四位 VRChat 朋友的合影",
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
    alt: "夜色湖畔四位 VRChat 朋友的合影",
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
