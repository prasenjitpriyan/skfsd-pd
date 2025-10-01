// next.config.ts
import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Configuration } from 'webpack';

// __dirname polyfill for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';
const isAnalyze = process.env.ANALYZE === 'true';

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  typedRoutes: true,
  serverExternalPackages: ['mongodb', 'bcryptjs', 'jsonwebtoken'],
  images: {
    domains: ['localhost', 'skfsd.gov.in'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: isProd ? 'https://skfsd.gov.in' : 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      { source: '/admin', destination: '/admin/users', permanent: true },
      {
        source: '/dashboard',
        destination: '/dashboard/overview',
        permanent: false,
      },
      { source: '/login', destination: '/auth/login', permanent: true },
      { source: '/register', destination: '/auth/register', permanent: true },
    ];
  },

  // Rewrites
  async rewrites() {
    return [
      { source: '/healthz', destination: '/api/health' },
      { source: '/docs', destination: '/api/docs' },
    ];
  },

  // Webpack customization
  webpack: async (
    config: Configuration,
    { dev }: { dev: boolean }
  ): Promise<Configuration> => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }

    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        assert: false,
        http: false,
        https: false,
        url: false,
        zlib: false,
      },
      alias: {
        ...config.resolve?.alias,
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@lib': path.resolve(__dirname, 'src/lib'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@types': path.resolve(__dirname, 'src/types'),
        '@context': path.resolve(__dirname, 'src/context'),
      },
    };

    config.ignoreWarnings = [
      { module: /node_modules\/punycode/ },
      { module: /node_modules\/mongodb/ },
      { module: /critical dependency:/i },
    ];

    // Bundle analyzer (dynamic import → no require)
    if (isAnalyze) {
      const { BundleAnalyzerPlugin } = await import('webpack-bundle-analyzer');
      config.plugins?.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
          analyzerPort: 8888,
        })
      );
    }

    return config;
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'SKFSD Portal',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
  },

  // Compiler settings
  compiler: {
    removeConsole: isProd ? { exclude: ['error', 'warn'] } : false,
  },

  // Logging
  logging: {
    fetches: { fullUrl: !isProd },
  },
};

export default nextConfig;
