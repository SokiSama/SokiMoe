/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'cdn.atao.cyou',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'lain.bgm.tv',
      },
      {
        protocol: 'https',
        hostname: 'image.api.playstation.com',
      },
      {
        protocol: 'https',
        hostname: 'image.api.np.km.playstation.net',
      },
      {
        protocol: 'https',
        hostname: 'avatar.api.playstation.com',
      },
      {
        protocol: 'https',
        hostname: 'static-resource.np.community.playstation.net',
      },
      {
        protocol: 'https',
        hostname: 'store.playstation.com',
      },
      {
        protocol: 'https',
        hostname: 'psnobj.prod.dl.playstation.net',
      },
      {
        protocol: 'http',
        hostname: 'psn-rsc.prod.dl.playstation.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'psn-rsc.prod.dl.playstation.net',
        pathname: '/**',
      },
      // Friends avatars
      {
        protocol: 'https',
        hostname: 'q2.qlogo.cn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gravatar.loli.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cynosura.one',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hoyue.fun',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'friends.ichr.me',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shiyina.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dn-qiniu-avatar.qbox.me',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'montrong-1300089193.cos.ap-beijing.myqcloud.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  async redirects() {
    return [
      {
        source: '/post/:slug',
        destination: '/posts/:slug',
        permanent: true,
      },
    ];
  },
  // Docker 部署时启用 standalone，开发环境禁用以避免错误
  output: process.env.NODE_ENV === 'production' && process.env.BUILD_STANDALONE ? 'standalone' : undefined,
  // 优化构建
  swcMinify: true,
  // 压缩配置
  compress: true,
};

module.exports = nextConfig;
