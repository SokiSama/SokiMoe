'use client';

import { useConfig } from '@/hooks/useConfig';
import { LoadingTransition } from '@/components/LoadingComponents';
import Image from 'next/image';
import { useState } from 'react';
import {
  Bot,
  Bug,
  Code2,
  Gamepad2,
  Github,
  Send,
  Sparkles,
  Headphones,
  Laptop,
  Languages,
  MoreHorizontal,
  Monitor,
  Smartphone,
  Tablet,
  Watch
} from 'lucide-react';

export default function HomePage() {
  const { data: config, loading, error } = useConfig();
  const [avatarSrc, setAvatarSrc] = useState('/api/images/avatar.png');

  if (error) {
    return (
      <div className="home-wrapper py-16 pb-24">
        <section className="trip-section-compact text-center py-20 md:py-32 fade-in">
          <div className="text-red-500 dark:text-red-400">
            <h2 className="text-2xl font-bold mb-4">加载失败</h2>
            <p>{error}</p>
          </div>
        </section>
      </div>
    );
  }

  const skeletonContent = (
    <div className="home-wrapper py-16 pb-24">
      <section className="trip-section-compact text-center py-20 md:py-32">
        <div className="mb-12">
          <div className="h-16 w-96 mx-auto mb-4 shimmer rounded" />
        </div>
        
        <div className="h-6 w-2/3 mx-auto mb-12 shimmer rounded" />
        
        <div className="max-w-3xl mx-auto">
          <div className="h-4 w-full mb-2 shimmer rounded" />
          <div className="h-4 w-5/6 mx-auto shimmer rounded" />
        </div>
      </section>
    </div>
  );

  const actualContent = (
    <div className="home-wrapper py-16 pb-24">
      {/* Hero + Introduction Section */}
      <section className="trip-section-compact pt-12 pb-20 md:pt-20 md:pb-32 fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="text-left order-2 md:order-1">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neutral-900 dark:text-neutral-100 mb-6 text-left fade-in-up opacity-0 whitespace-normal md:whitespace-nowrap"
              style={{ animationDelay: '0.1s' }}
            >
              Hi, I&apos;m Soki
            </h1>

            <p
              className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl leading-relaxed fade-in-delayed"
              style={{ animationDelay: '0.2s' }}
            >
              {config?.description || ''}
            </p>

            <p
              className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg max-w-2xl whitespace-pre-line fade-in-delayed"
              style={{ animationDelay: '0.35s' }}
            >
              {config?.introduction || ''}
            </p>

            <div className="mt-6 flex gap-6">
              <a
                href="https://github.com/SokiSama"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group -m-2 p-2 fade-in-up opacity-0 flex flex-col items-center gap-2"
                style={{ animationDelay: '0.55s' }}
              >
                <Github className="h-5 w-5 text-zinc-500 transition group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200" />
              </a>

              <a
                href="https://steamcommunity.com/id/SokiSama/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Steam"
                className="group -m-2 p-2 fade-in-up opacity-0 flex flex-col items-center gap-2"
                style={{ animationDelay: '0.65s' }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="h-5 w-5 text-zinc-500 transition group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200"
                >
                  <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
                </svg>
              </a>

              <a
                href="https://space.bilibili.com/4686881"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bilibili"
                className="group -m-2 p-2 fade-in-up opacity-0 flex flex-col items-center gap-2"
                style={{ animationDelay: '0.75s' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="h-5 w-5 text-zinc-500 transition group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z" fill="currentColor"></path>
                </svg>
              </a>

              <a
                href="https://t.me/satoushiro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="group -m-2 p-2 fade-in-up opacity-0 flex flex-col items-center gap-2"
                style={{ animationDelay: '0.85s' }}
              >
                <Send className="h-5 w-5 text-zinc-500 transition group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200" />
              </a>

              <a
                href="https://bsky.app/profile/matsusatou.bsky.social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bluesky"
                className="group -m-2 p-2 fade-in-up opacity-0 flex flex-col items-center gap-2"
                style={{ animationDelay: '0.95s' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" role="img" className="h-5 w-5 text-zinc-500 transition group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200">
                  <path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <div
              className="group relative w-56 h-56 md:w-80 md:h-80 fade-in-up opacity-0"
              style={{ animationDelay: '0.45s' }}
            >
              <div className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 opacity-0 blur-xl transition-all duration-300 group-hover:opacity-80 dark:from-pink-500/30 dark:via-purple-500/30 dark:to-blue-500/30 z-0" />
              <div className="pointer-events-none absolute inset-0 rounded-full bg-white/70 opacity-0 blur-md transition-all duration-300 group-hover:opacity-60 dark:bg-white/10 z-0" />
              <div className="relative z-10 w-full h-full rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 transition-transform duration-300 group-hover:scale-[1.03]">
                <Image
                  src={avatarSrc}
                  alt="Avatar"
                  fill
                  sizes="(min-width: 768px) 320px, 224px"
                  className="object-cover"
                  onError={() => {
                    if (avatarSrc.endsWith('/api/images/avatar.png')) {
                      setAvatarSrc('/api/images/avatar.jpg');
                      return;
                    }
                    setAvatarSrc('/images/hello-world.webp');
                  }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="trip-section-compact mt-16 space-y-12 fade-in-delayed" style={{ animationDelay: '0.55s' }}>
        <section className="space-y-6">
          <div className="flex items-start gap-4 mt-6">
            <div className="h-8 w-1 rounded bg-blue-600 dark:bg-blue-500 mt-1" />
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                技能
              </h2>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                全靠爱好，喜欢的自然就会做得好
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 auto-rows-fr">
            {[
              { name: 'AI Codeing', Icon: Bot },
              { name: 'Astro & Next.js', Icon: Code2 },
              { name: 'PC Gaming', Icon: Monitor },
              { name: 'Controler Gaming', Icon: Gamepad2 },
              { name: 'QA Engineer', Icon: Bug },
              { name: 'zh—CN & en-US', Icon: Languages },
            ].map(({ name, Icon }) => (
              <div
                key={name}
                className="card p-5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors h-full flex flex-col items-center text-center"
              >
                <Icon className="h-7 w-7 text-neutral-800 dark:text-neutral-200" />
                <div className="mt-5 text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-snug min-h-[2.5rem] flex items-center">
                  {name}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-8 w-1 rounded bg-blue-600 dark:bg-blue-500 mt-1" />
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                设备
              </h2>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                包括但不限于下列
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
            {[
              { name: 'MacBook Air 13', Icon: Laptop },
              { name: 'iPad Pro 2024', Icon: Tablet },
              { name: 'iPhone 17 Pro Max', Icon: Smartphone },
              { name: 'Xiaomi 17 Pro Max', Icon: Smartphone },
              { name: 'AirPods Pro', Icon: Headphones },
              { name: 'Apple Watch S10', Icon: Watch },
              { name: 'Meta Quest 3', Icon: Sparkles },
              { name: '不计其数的洋垃圾...', Icon: MoreHorizontal },
            ].map(({ name, Icon }) => (
              <div
                key={name}
                className="card p-5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors h-full flex flex-col items-center text-center"
              >
                <Icon className="h-7 w-7 text-neutral-800 dark:text-neutral-200" />
                <div className="mt-5 text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-snug min-h-[2.5rem] flex items-center">
                  {name}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
  
  return (
    <LoadingTransition
      loading={loading || !config}
      skeleton={skeletonContent}
      delay={300}
    >
      {actualContent}
    </LoadingTransition>
  );
}
