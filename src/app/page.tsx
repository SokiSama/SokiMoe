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
  Home,
  Send,
  Sparkles,
  Headphones,
  Laptop,
  Languages,
  MoreHorizontal,
  Monitor,
  Smartphone,
  Tablet,
  Twitter,
  Watch
} from 'lucide-react';

export default function HomePage() {
  const { data: config, loading, error } = useConfig();
  const [avatarSrc, setAvatarSrc] = useState('/api/images/avatar.png');

  if (error) {
    return (
      <div className="home-wrapper py-16 pb-24">
        <section className="text-center py-20 md:py-32 fade-in">
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
      <section className="text-center py-20 md:py-32">
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
      <section className="pt-12 pb-20 md:pt-20 md:pb-32 fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neutral-900 dark:text-neutral-100 mb-6 text-left fade-in-up opacity-0 whitespace-normal md:whitespace-nowrap"
              style={{ animationDelay: '0.1s' }}
            >
              Hi, I&apos;m Soki❤
            </h1>

            <p
              className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl leading-relaxed fade-in-delayed"
              style={{ animationDelay: '0.2s' }}
            >
              {config?.description || ''}
            </p>

            <p
              className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-base max-w-2xl fade-in-delayed"
              style={{ animationDelay: '0.35s' }}
            >
              {config?.introduction || ''}
            </p>

            <div className="mt-12 flex justify-start gap-6">
              <a
                href="https://github.com/SokiSama"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="h-14 w-14 rounded-full bg-neutral-900 text-white flex items-center justify-center transition-colors hover:bg-neutral-800 fade-in-up opacity-0"
                style={{ animationDelay: '0.55s' }}
              >
                <Github className="h-6 w-6" />
              </a>

              <a
                href="https://steamcommunity.com/id/SokiSama/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Steam"
                className="h-14 w-14 rounded-full bg-[#1b2838] text-white flex items-center justify-center transition-colors hover:bg-[#223447] fade-in-up opacity-0"
                style={{ animationDelay: '0.65s' }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
                </svg>
              </a>

              <a
                href="https://matsusatou.top"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
                className="h-14 w-14 rounded-full bg-emerald-600 text-white flex items-center justify-center transition-colors hover:bg-emerald-500 fade-in-up opacity-0"
                style={{ animationDelay: '0.75s' }}
              >
                <Home className="h-6 w-6" />
              </a>

              <a
                href="https://t.me/satoushiro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="h-14 w-14 rounded-full bg-sky-600 text-white flex items-center justify-center transition-colors hover:bg-sky-500 fade-in-up opacity-0"
                style={{ animationDelay: '0.85s' }}
              >
                <Send className="h-6 w-6" />
              </a>

              <a
                href="https://x.com/soki_ruby"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="h-14 w-14 rounded-full bg-[#1D9BF0] text-white flex items-center justify-center transition-colors hover:bg-[#1A8CD8] fade-in-up opacity-0"
                style={{ animationDelay: '0.95s' }}
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div
              className="group relative w-56 h-56 md:w-80 md:h-80 fade-in-up opacity-0"
              style={{ animationDelay: '0.45s' }}
            >
              <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-80 dark:from-pink-500/30 dark:via-purple-500/30 dark:to-blue-500/30" />
              <div className="absolute -inset-3 rounded-full bg-white/70 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60 dark:bg-white/10" />
              <div className="relative w-full h-full rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 transition-transform duration-500 group-hover:scale-[1.03]">
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

      <div className="mt-16 space-y-12 fade-in-delayed" style={{ animationDelay: '0.55s' }}>
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
              { name: '和不计其数的洋垃圾...', Icon: MoreHorizontal },
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
