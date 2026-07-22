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

const playlistUrl = "https://music.apple.com/jp/playlist/vrchat/pl.u-2aoqXx6tNdNz1jX";

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

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export function MusicPlayerCard() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const current = tracks[trackIndex];
  const queue = useMemo(
    () => Array.from({ length: 3 }, (_, offset) => tracks[(trackIndex + offset + 1) % tracks.length]),
    [trackIndex],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (isPlaying) void audio.play().catch(() => setIsPlaying(false));
  }, [trackIndex]);

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

  return (
    <section className="card side-card music-player-card">
      <div className="music-card-heading">
        <h3>音乐播放</h3>
        <a href={playlistUrl} target="_blank" rel="noreferrer" aria-label="在 Apple Music 打开 VRChat 歌单">
          <AppleLogo aria-hidden="true" weight="fill" />歌单
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

      <p className="music-preview-note">Apple Music 官方试听</p>
    </section>
  );
}
