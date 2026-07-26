"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  AppleLogo,
  CaretLeft,
  CaretRight,
  MusicNotes,
  Pause,
  Play,
} from "@phosphor-icons/react";

const playlistUrl = "https://music.apple.com/jp/playlist/pl.u-gxblk30u5P5EL2A";

const tracks = [
  {
    id: 1531215984,
    title: "Passing Through (Original)",
    artist: "Erick McNerney",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/aa/be/eb/aabeeb03-7c09-7a4a-a9d4-63cdf8533338/artwork.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/6b/a2/bb/6ba2bb76-c267-0e30-edb8-12f38858721b/mzaf_11691457903969753669.plus.aac.p.m4a",
  },
  {
    id: 1741235789,
    title: "Precious Moments",
    artist: "Celestial Alignment & Glacier Kid",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/93/a1/31/93a131c0-7f04-0f23-89bd-0d071f6b747c/7944bd75-4f44-4b3e-ae34-99c5a414d8c0.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3b/f8/94/3bf89451-3dd3-61e5-3b21-d5f33c2abc1b/mzaf_12794376343719461816.plus.aac.p.m4a",
  },
  {
    id: 1710124202,
    title: "Building a New Life",
    artist: "Celestial Alignment",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a7/03/81/a7038197-bf62-8b39-2d7c-0f3794ef60f0/2c785136-65ba-43af-808d-5bdf727e030b.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/52/8b/ed/528bed60-cd90-ac24-c4bb-8ecea1c2879f/mzaf_12728908193055374887.plus.aac.p.m4a",
  },
  {
    id: 1710108542,
    title: "Old Friend",
    artist: "Hoogway",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/fc/02/df/fc02dfc1-67bc-1516-4eb1-9305d655899b/627e5ba1-ce0e-4cbe-8503-9b5f795c293f.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/08/ff/fe/08fffe5c-7f2a-b3da-1e95-e6092a2e95d3/mzaf_2242120441891162127.plus.aac.p.m4a",
  },
  {
    id: 1599846650,
    title: "Until You're Home",
    artist: "chief.",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/9f/16/40/9f16404d-a779-06eb-e7dd-1a15051acbc9/1963620452507_cover.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/db/c4/2d/dbc42d51-6ef3-90b8-ecd7-eb02635243a4/mzaf_13364026702603902667.plus.aac.p.m4a",
  },
  {
    id: 1524601612,
    title: "Better, Together, Forever",
    artist: "Team Astro",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/0b/c6/4e/0bc64e88-85b0-f593-4bc5-f875fb16cfe6/0745051297794.png/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/30/8f/16/308f16ba-65d2-0a10-aa1c-d724f8a6529d/mzaf_10149924733592852365.plus.aac.p.m4a",
  },
  {
    id: 1739799515,
    title: "Hiraeth",
    artist: "bcalm & Banks",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/81/40/f4/8140f444-0d65-0708-8f34-d353920839f2/f4a91200-dfb1-4333-af62-3fde23c917b2.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3b/43/4c/3b434c83-f105-b859-1e8e-45a62a4eed4e/mzaf_12777248473349301014.plus.aac.p.m4a",
  },
  {
    id: 1710108543,
    title: "Left Unsaid",
    artist: "Hoogway",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/fc/02/df/fc02dfc1-67bc-1516-4eb1-9305d655899b/627e5ba1-ce0e-4cbe-8503-9b5f795c293f.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/09/b9/cd/09b9cd72-0923-17b9-8b74-9b0565317a0c/mzaf_9614147437582552908.plus.aac.p.m4a",
  },
] as const;

const homePlaylistTracks = [
  { title: "KiLLKiSS", artist: "Ave Mujica", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/62/dd/e4/62dde4e9-701b-3331-9c78-f5449b6a96ae/198704270253_Cover.jpg/160x160bb.jpg" },
  { title: "顔", artist: "Ave Mujica", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d8/2f/e9/d82fe9a7-cf92-fa6f-5e74-5eb463647b78/198704454127_Cover.jpg/160x160bb.jpg" },
  { title: "影色舞", artist: "MyGO!!!!!", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/24/97/8d/24978da1-c9f2-b252-b3d9-0fb9f8346fa7/198704278938_Cover.jpg/160x160bb.jpg" },
  { title: "壱雫空", artist: "MyGO!!!!!", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f4/c7/f7/f4c7f7d9-504b-1350-85a8-4b02ae30ab96/198704226816_Cover.jpg/160x160bb.jpg" },
  { title: "雑踏、僕らの街", artist: "トゲナシトゲアリ", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/42/4f/b2/424fb29f-e511-839c-c31f-23d48ecf68a3/24UMGIM21411.rgb.jpg/160x160bb.jpg" },
  { title: "空の箱 (井芹仁菜、河原木桃香)", artist: "トゲナシトゲアリ", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/36/d4/39/36d4394c-995c-7195-2345-47fe55e30774/24UMGIM25049.rgb.jpg/160x160bb.jpg" },
  { title: "Holiday∞Holiday", artist: "スリーズブーケ", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3b/09/e0/3b09e0d2-0f9e-c57b-c512-b5b79caa78a2/4540774243914.png/160x160bb.jpg" },
  { title: "Time To Make History", artist: "平田志穂子", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a9/22/52/a9225213-486e-4820-89b8-0c02c1247b6e/049648_J.jpg/160x160bb.jpg" },
  { title: "Life Will Change", artist: "Lyn", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c2/0d/00/c20d0058-b916-df41-bfdb-d7a5534aa02e/LNCM-1175_PERSONA5-OST_h1_new.jpg/160x160bb.jpg" },
  { title: "So Cynical (Badum)", artist: "LE SSERAFIM", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a2/27/4c/a2274cd8-8ca4-5fea-32b1-5495347eaf9e/25UMGIM41823.rgb.jpg/160x160bb.jpg" },
  { title: "No Celestial", artist: "LE SSERAFIM", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/71/c9/7d/71c97dc9-b279-c3df-6369-d04d9ec1529c/22UM1IM18218.rgb.jpg/160x160bb.jpg" },
  { title: "Virtual to LIVE", artist: "にじさんじ", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/82/9f/c3/829fc3d8-033e-d3eb-500b-28cf55a727b3/859755220214_cover.jpg/160x160bb.jpg" },
  { title: "Tiny Stars", artist: "澁谷かのん (CV.伊達さゆり) & 唐 可可 (CV.Liyuu)", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a5/c2/85/a5c28545-96b7-8f7d-2fb5-ad0f3c705803/4540774241415.png/160x160bb.jpg" },
  { title: "LOVE 2000", artist: "八奈見杏菜(CV: 遠野ひかる)", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/95/cf/d1/95cfd185-ffee-1acd-a3ac-d77308e498fd/4534530152909.jpg/160x160bb.jpg" },
  { title: "Color Your Night", artist: "Lotus Juice / 高橋あず美 / アトラスサウンドチーム / ATLUS GAME MUSIC", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/b3/49/78/b34978b0-7320-7e3e-f3ec-22c5e1c03fce/PA00136839_0_184480_jacket.jpg/160x160bb.jpg" },
  { title: "SWEET HURT", artist: "ReoNa", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/57/31/e7/5731e712-713d-4e73-634d-b4b221cdd9ab/jacket_VVCL01287B00Z_550.jpg/160x160bb.jpg" },
  { title: "健やかDE居たい", artist: "八木海莉", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/6c/9e/fb/6c9efb75-2973-a633-bcf9-64e4d1c6c9ff/4547366603736.jpg/160x160bb.jpg" },
  { title: "ファタール - Fatal", artist: "GEMN, 中島健人 & キタニタツヤ", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f6/50/0e/f6500ed2-3b50-b4ba-37c6-5632fabba148/4547366693607.jpg/160x160bb.jpg" },
  { title: "Ready to", artist: "影森みちる(CV:諸星すみれ)", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1c/3b/5d/1c3b5dab-3de1-b68f-d7eb-a361f167045a/085750_J.jpg/160x160bb.jpg" },
  { title: "Y.M.C.A.", artist: "ヴィレッジ・ピープル", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/a7/70/df/a770dff5-0b2c-b260-0c10-eea7997d36eb/00731453217126.rgb.jpg/160x160bb.jpg" },
  { title: "Lemonade", artist: "ミア・テイラー (CV.内田 秀)", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ce/ac/17/ceac1746-b101-b0c7-c9f2-852099311a71/4540774250707.png/160x160bb.jpg" },
  { title: "Here, the world!", artist: "sumimi", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9f/16/16/9f161692-cfa3-19a0-fd44-cf8215d310b1/198704363160_Cover.jpg/160x160bb.jpg" },
  { title: "天球(そら)のMúsica", artist: "Ave Mujica", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d2/a7/60/d2a760b1-6952-6830-2dcd-1dfdd44f003f/198704414107_Cover.jpg/160x160bb.jpg" },
] as const;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function syncPlaylistFade(element: HTMLOListElement) {
  const threshold = 2;
  element.classList.toggle("can-scroll-up", element.scrollTop > threshold);
  element.classList.toggle(
    "can-scroll-down",
    element.scrollTop + element.clientHeight < element.scrollHeight - threshold,
  );
}

async function findPlayableTrackIndexes(signal: AbortSignal) {
  const playableIndexes: number[] = [];
  const concurrency = 4;

  for (let start = 0; start < homePlaylistTracks.length; start += concurrency) {
    const batch = homePlaylistTracks.slice(start, start + concurrency);
    const results = await Promise.all(batch.map(async (track, offset) => {
      const params = new URLSearchParams({ title: track.title, artist: track.artist });
      const response = await fetch(`/api/music-preview?${params.toString()}`, { signal });
      const payload = await response.json() as { ok: boolean; previewUrl?: string | null };
      return payload.ok && payload.previewUrl ? start + offset : null;
    }));
    playableIndexes.push(...results.filter((index): index is number => index !== null));
  }

  return playableIndexes;
}

export function MusicPlayerCard({ variant = "sidebar" }: { variant?: "sidebar" | "home" }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const homeAudioRef = useRef<HTMLAudioElement>(null);
  const homePlaylistRef = useRef<HTMLOListElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [homeTrackIndex, setHomeTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [homeIsPlaying, setHomeIsPlaying] = useState(false);
  const [homePreview, setHomePreview] = useState<{ key: string; url: string | null } | null>(null);
  const [playableHomeTrackIndexes, setPlayableHomeTrackIndexes] = useState<number[] | null>(null);
  const [homeCurrentTime, setHomeCurrentTime] = useState(0);
  const [homeDuration, setHomeDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const current = tracks[trackIndex];
  const homeCurrent = homePlaylistTracks[homeTrackIndex];
  const homeTrackKey = `${homeCurrent.title}\u0000${homeCurrent.artist}`;
  const homePreviewUrl = homePreview?.key === homeTrackKey ? homePreview.url : null;
  const homePreviewLoading = homePreview?.key !== homeTrackKey;
  const homeProgress = homeDuration ? (homeCurrentTime / homeDuration) * 100 : 0;
  const queue = useMemo(() => {
    const queueLength = variant === "home" ? tracks.length - 1 : 3;
    return Array.from({ length: queueLength }, (_, offset) => tracks[(trackIndex + offset + 1) % tracks.length]);
  }, [trackIndex, variant]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (variant === "home") {
        setHomeTrackIndex(Math.floor(Math.random() * homePlaylistTracks.length));
      } else {
        setTrackIndex(Math.floor(Math.random() * tracks.length));
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [variant]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (isPlaying) void audio.play().catch(() => setIsPlaying(false));
  }, [trackIndex]);

  useEffect(() => {
    if (variant !== "home") return;

    const controller = new AbortController();
    const audio = homeAudioRef.current;
    audio?.pause();

    const params = new URLSearchParams({
      title: homeCurrent.title,
      artist: homeCurrent.artist,
    });
    fetch(`/api/music-preview?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => response.json() as Promise<{ ok: boolean; previewUrl?: string | null }>)
      .then((payload) => {
        setHomePreview({
          key: homeTrackKey,
          url: payload.ok && payload.previewUrl ? payload.previewUrl : null,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setHomePreview({ key: homeTrackKey, url: null });
      })

    return () => controller.abort();
  }, [homeCurrent.artist, homeCurrent.title, homeTrackKey, variant]);

  useEffect(() => {
    if (variant !== "home") return;

    const controller = new AbortController();
    void findPlayableTrackIndexes(controller.signal)
      .then((indexes) => {
        setPlayableHomeTrackIndexes(indexes);
        setHomeTrackIndex((currentIndex) => (
          indexes.includes(currentIndex) ? currentIndex : (indexes[0] ?? 0)
        ));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setPlayableHomeTrackIndexes([]);
      });

    return () => controller.abort();
  }, [variant]);

  useEffect(() => {
    if (variant !== "home" || !homePlaylistRef.current) return;

    const list = homePlaylistRef.current;
    const frame = window.requestAnimationFrame(() => syncPlaylistFade(list));
    const observer = new ResizeObserver(() => syncPlaylistFade(list));
    observer.observe(list);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [playableHomeTrackIndexes, variant]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const selectTrack = (nextIndex: number) => setTrackIndex((nextIndex + tracks.length) % tracks.length);

  const toggleHomePlayback = async () => {
    const audio = homeAudioRef.current;
    if (!audio || !homePreviewUrl) return;

    if (audio.paused) {
      try {
        await audio.play();
        setHomeIsPlaying(true);
      } catch {
        setHomeIsPlaying(false);
      }
    } else {
      audio.pause();
      setHomeIsPlaying(false);
    }
  };

  const selectHomeTrack = (nextIndex: number) => {
    homeAudioRef.current?.pause();
    setHomeCurrentTime(0);
    setHomeDuration(0);
    setHomeTrackIndex((nextIndex + homePlaylistTracks.length) % homePlaylistTracks.length);
  };

  const moveHomeTrack = (offset: number) => {
    const indexes = playableHomeTrackIndexes?.length
      ? playableHomeTrackIndexes
      : homePlaylistTracks.map((_, index) => index);
    const currentPosition = indexes.indexOf(homeTrackIndex);
    const nextPosition = (Math.max(currentPosition, 0) + offset + indexes.length) % indexes.length;
    selectHomeTrack(indexes[nextPosition]);
  };

  if (variant === "home") {
    return (
      <section className="card side-card home-music-card">
        <header className="home-music-heading">
          <div>
            <span>音乐</span>
            <h3>那些值得循环的歌曲</h3>
          </div>
        </header>

        <div className="home-playlist-summary">
          <div className="home-playlist-brand"><AppleLogo weight="fill" aria-hidden="true" />Music</div>
          <audio
            ref={homeAudioRef}
            src={homePreviewUrl ?? undefined}
            preload="metadata"
            onLoadedMetadata={(event) => {
              setHomeCurrentTime(0);
              setHomeDuration(event.currentTarget.duration);
            }}
            onTimeUpdate={(event) => setHomeCurrentTime(event.currentTarget.currentTime)}
            onPlay={() => setHomeIsPlaying(true)}
            onPause={() => setHomeIsPlaying(false)}
            onEnded={() => moveHomeTrack(1)}
          />
          <div className="home-playlist-cover">
            <img
              key={homeCurrent.artwork}
              src={homeCurrent.artwork.replace("/160x160bb.jpg", "/600x600bb.jpg")}
              alt={`${homeCurrent.title} 歌曲封面`}
              loading="eager"
              decoding="async"
            />
          </div>
          <p className="home-playlist-kicker">NOW PLAYING</p>
          <div className="home-playlist-current" aria-live="polite">
            <strong>{homeCurrent.title}</strong>
            <span>{homeCurrent.artist}</span>
          </div>

          <div className="home-playlist-progress">
            <input
              type="range"
              min="0"
              max={homeDuration || 30}
              step="0.1"
              value={Math.min(homeCurrentTime, homeDuration || 30)}
              disabled={!homePreviewUrl}
              aria-label="试听播放进度"
              style={{ "--home-music-progress": `${homeProgress}%` } as CSSProperties}
              onChange={(event) => {
                const nextTime = Number(event.target.value);
                if (homeAudioRef.current) homeAudioRef.current.currentTime = nextTime;
                setHomeCurrentTime(nextTime);
              }}
            />
            <div>
              <span>{formatTime(homeCurrentTime)}</span>
              <span>{formatTime(homeDuration || 30)}</span>
            </div>
          </div>

          <div className="home-playlist-controls">
            <button type="button" onClick={() => moveHomeTrack(-1)} aria-label="上一首">
              <CaretLeft weight="bold" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="home-playlist-play"
              onClick={() => void toggleHomePlayback()}
              disabled={homePreviewLoading || !homePreviewUrl}
              aria-label={`${homeIsPlaying ? "暂停" : "播放"} ${homeCurrent.title} 的 30 秒试听`}
            >
              {homeIsPlaying
                ? <Pause weight="fill" aria-hidden="true" />
                : <Play weight="fill" aria-hidden="true" />}
            </button>
            <button type="button" onClick={() => moveHomeTrack(1)} aria-label="下一首">
              <CaretRight weight="bold" aria-hidden="true" />
            </button>
          </div>

          {(homePreviewLoading || !homePreviewUrl) && (
            <p className="home-playlist-status" role="status">
              {homePreviewLoading ? "正在加载试听…" : "当前曲目暂无试听"}
            </p>
          )}
        </div>

        <div className="home-playlist-track-panel">
          <div className="home-playlist-track-heading">
            <span>歌单曲目</span>
            <small>
              {playableHomeTrackIndexes === null ? "筛选中…" : `${playableHomeTrackIndexes.length} 首`}
            </small>
          </div>
          <ol
            ref={homePlaylistRef}
            aria-busy={playableHomeTrackIndexes === null}
            onScroll={(event) => syncPlaylistFade(event.currentTarget)}
          >
            {playableHomeTrackIndexes === null ? (
              <li className="home-playlist-filter-status">正在检查可试听曲目…</li>
            ) : playableHomeTrackIndexes.length === 0 ? (
              <li className="home-playlist-filter-status">暂时没有可试听曲目</li>
            ) : playableHomeTrackIndexes.map((index) => {
              const track = homePlaylistTracks[index];
              return (
              <li
                className={index === homeTrackIndex ? "is-active" : ""}
                key={`${track.title}-${track.artist}`}
              >
                <button
                  type="button"
                  onClick={() => selectHomeTrack(index)}
                  aria-current={index === homeTrackIndex ? "true" : undefined}
                  aria-label={`切换到 ${track.title}，${track.artist}`}
                >
                  <em>{String(index + 1).padStart(2, "0")}</em>
                  <img src={track.artwork} alt="" loading="lazy" decoding="async" />
                  <span><strong>{track.title}</strong><small>{track.artist}</small></span>
                </button>
              </li>
              );
            })}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section className="card side-card music-player-card">
      <div className="music-card-heading">
        <div>
          <h3>音乐播放</h3>
        </div>
        <a href={playlistUrl} target="_blank" rel="noreferrer" aria-label="在 Apple Music 打开 Soki 的歌单">
          <AppleLogo aria-hidden="true" weight="fill" />Apple Music
        </a>
      </div>

      <audio
        ref={audioRef}
        src={current.preview}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => selectTrack(trackIndex + 1)}
      />

      <div className="music-now-playing">
        <div className={isPlaying ? "music-cover playing" : "music-cover"}>
          <img src={current.artwork} alt={`${current.title} 封面`} loading="lazy" decoding="async" />
          <span aria-hidden="true"><MusicNotes weight="fill" /></span>
        </div>
        <p className="music-kicker">NOW PLAYING</p>
        <strong>{current.title}</strong>
        <span>{current.artist}</span>
      </div>

      <div className="music-progress">
        <input
          type="range"
          min="0"
          max={duration || 30}
          step="0.1"
          value={Math.min(currentTime, duration || 30)}
          aria-label="播放进度"
          style={{ "--music-progress": `${duration ? (currentTime / duration) * 100 : 0}%` } as CSSProperties}
          onChange={(event) => {
            const nextTime = Number(event.target.value);
            if (audioRef.current) audioRef.current.currentTime = nextTime;
            setCurrentTime(nextTime);
          }}
        />
        <div><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
      </div>

      <div className="music-controls">
        <button type="button" onClick={() => selectTrack(trackIndex - 1)} aria-label="上一首"><CaretLeft weight="bold" /></button>
        <button type="button" className="music-play-button" onClick={() => void togglePlayback()} aria-label={isPlaying ? "暂停" : "播放"}>
          {isPlaying ? <Pause weight="fill" /> : <Play weight="fill" />}
        </button>
        <button type="button" onClick={() => selectTrack(trackIndex + 1)} aria-label="下一首"><CaretRight weight="bold" /></button>
      </div>

      <div className="music-queue">
        <p>接下来播放</p>
        {queue.map((track, offset) => {
          const nextIndex = (trackIndex + offset + 1) % tracks.length;
          return (
            <button type="button" onClick={() => selectTrack(nextIndex)} key={track.id}>
              <img src={track.artwork} alt="" loading="lazy" decoding="async" />
              <span><strong>{track.title}</strong><small>{track.artist}</small></span>
              <em>{String(offset + 1).padStart(2, "0")}</em>
            </button>
          );
        })}
      </div>

    </section>
  );
}
