import type { Metadata } from 'next';
import Script from 'next/script';
import { JetBrains_Mono, Fira_Code } from 'next/font/google';
import { ConditionalFooter, ConditionalHeader } from '@/components/ConditionalHeader';
import { getSiteConfigServer } from '@/lib/config';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = getSiteConfigServer();
  
  return {
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.title}`,
    },
    description: siteConfig.description,
    keywords: ['博客', '技术', '前端', 'Next.js', 'React'],
    authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
    creator: siteConfig.author.name,
    openGraph: {
      type: 'website',
      locale: 'zh_CN',
      url: siteConfig.url,
      title: siteConfig.title,
      description: siteConfig.description,
      siteName: siteConfig.title,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.title,
      description: siteConfig.description,
      creator: siteConfig.social.twitter ? '@' + siteConfig.social.twitter.split('/').pop() : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // google: 'your-google-verification-code',
    },
    alternates: {
      types: {
        'application/rss+xml': '/api/rss',
        'application/atom+xml': '/api/rss?format=atom',
        'application/feed+json': '/api/rss?format=json',
      },
    },
    icons: {
      icon: '/api/images/avatar.png',
      shortcut: '/api/images/avatar.png',
      apple: '/api/images/avatar.png',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} ${firaCode.variable} font-sans antialiased`}>
        <Script
          src="https://cdn.jsdelivr.net/npm/tsparticles@2/tsparticles.bundle.min.js"
          strategy="afterInteractive"
        />
        <Script id="tsparticles-init" strategy="afterInteractive">
          {`
            (function () {
              var attempts = 0;
              var maxAttempts = 40;
              var delay = 100;
              function init() {
                if (window.tsParticles && window.tsParticles.load) {
                  window.tsParticles.load('tsparticles', {
                    fullScreen: { enable: false },
                    background: { color: { value: 'transparent' } },
                    fpsLimit: 60,
                    detectRetina: true,
                    interactivity: {
                      events: {
                        onHover: { enable: true, mode: 'repulse' },
                        resize: true
                      },
                      modes: {
                        repulse: { distance: 100, duration: 0.4 }
                      }
                    },
                    particles: {
                      number: {
                        value: 170,
                        density: { enable: true, area: 950 }
                      },
                      color: {
                        value: ['#f9a8d4', '#a855f7', '#38bdf8']
                      },
                      opacity: {
                        value: 0.3,
                        random: true
                      },
                      size: {
                        value: { min: 2.0, max: 5.0 },
                        animation: {
                          enable: true,
                          speed: 10,
                          minimumValue: 1.8,
                          sync: false
                        }
                      },
                      shape: {
                        type: ['star', 'polygon'],
                        options: {
                          star: {
                            sides: 5
                          },
                          polygon: {
                            sides: 6
                          }
                        }
                      },
                      move: {
                        enable: true,
                        speed: 1.35,
                        direction: 'top',
                        random: true,
                        straight: false,
                        outModes: { default: 'out' }
                      },
                      links: {
                        enable: false
                      }
                    }
                  });
                } else if (attempts < maxAttempts) {
                  attempts += 1;
                  setTimeout(init, delay);
                }
              }
              init();
            })();
          `}
        </Script>
        <div
          id="tsparticles"
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10"
        />
        <div className="min-h-screen flex flex-col">
          <ConditionalHeader />
          <main className="flex-1">
            {children}
          </main>
          <ConditionalFooter />
        </div>
      </body>
    </html>
  );
}
