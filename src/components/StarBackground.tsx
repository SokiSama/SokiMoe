'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    tsParticles?: any;
  }
}

export function StarBackground() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    let cancelled = false;

    const init = async () => {
      let attempts = 0;
      while (!window.tsParticles && attempts < 40 && !cancelled) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts += 1;
      }
      if (!window.tsParticles || cancelled) return;

      initializedRef.current = true;

      window.tsParticles.load('tsparticles-background', {
        fullScreen: {
          enable: false,
        },
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 60,
        detectRetina: true,
        interactivity: {
          detectsOn: 'canvas',
          events: {
            onHover: {
              enable: true,
              mode: ['repulse'],
            },
            resize: true,
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              area: 800,
            },
          },
          color: {
            value: ['#ffffff', '#a5b4fc'],
          },
          opacity: {
            value: 0.3,
            random: true,
          },
          size: {
            value: { min: 1, max: 2.5 },
          },
          move: {
            enable: true,
            speed: 0.5,
            direction: 'top',
            random: true,
            straight: false,
            outModes: {
              default: 'out',
            },
          },
          links: {
            enable: true,
            distance: 130,
            color: '#ffffff',
            opacity: 0.05,
            width: 0.6,
          },
        },
      });
    };

    init();

    return () => {
      cancelled = true;
      if (window.tsParticles) {
        const container = window.tsParticles.domItem(0);
        if (container) {
          container.destroy();
        }
      }
    };
  }, []);

  return (
    <div
      id="tsparticles-background"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}

