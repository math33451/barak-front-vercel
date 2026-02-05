import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ========================================
   * PERFORMANCE OPTIMIZATIONS
   * ======================================== */

  // Habilita compressão gzip para reduzir tamanho dos assets
  compress: true,

  // Remove header X-Powered-By por segurança
  poweredByHeader: false,

  // Strict mode para melhor debugging
  reactStrictMode: true,

  /* ========================================
   * IMAGE OPTIMIZATIONS
   * ======================================== */
  images: {
    // Formatos modernos de imagem (AVIF é mais eficiente que WebP)
    formats: ["image/avif", "image/webp"],

    // Tamanhos de dispositivos comuns
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],

    // Tamanhos de imagens para ícones/thumbnails
    imageSizes: [16, 32, 48, 64, 96, 128, 256],

    // Cache de imagens otimizadas por 60 segundos
    minimumCacheTTL: 60,

    // Domínios externos permitidos para otimização de imagem (se necessário)
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'example.com',
    //   },
    // ],
  },

  /* ========================================
   * COMPILER OPTIMIZATIONS
   * ======================================== */
  compiler: {
    // Remove console.logs em produção (exceto error e warn)
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  /* ========================================
   * EXPERIMENTAL FEATURES
   * ======================================== */
  experimental: {
    // Otimiza imports de pacotes grandes
    optimizePackageImports: ["lucide-react", "chart.js", "react-chartjs-2"],

    // Otimiza CSS (experimental)
    optimizeCss: false,
  },

  /* ========================================
   * HEADERS DE SEGURANÇA E CACHE
   * ======================================== */
  async headers() {
    return [
      {
        // Headers aplicados a todas as rotas
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Cache agressivo para assets estáticos
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache para imagens otimizadas
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache para chunks do Next.js
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  /* ========================================
   * WEBPACK CUSTOMIZATION
   * ======================================== */
  webpack: (config, { isServer, dev }) => {
    // Otimizações apenas para produção
    if (!dev && !isServer) {
      // Code splitting otimizado
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk (node_modules)
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
            },
            // React e React-DOM em chunk separado
            react: {
              name: "react",
              chunks: "all",
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              priority: 30,
            },
            // Chart.js em chunk separado (biblioteca pesada)
            charts: {
              name: "charts",
              chunks: "all",
              test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
              priority: 25,
            },
            // Código comum compartilhado
            common: {
              name: "common",
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
        // Minimize chunk IDs para reduzir tamanho
        minimize: true,
      };
    }

    return config;
  },

  /* ========================================
   * OUTPUT & BUILD
   * ======================================== */

  // Output standalone para Docker/deployment otimizado (descomente se usar Docker)
  // output: 'standalone',

  // Gerar source maps em produção para debugging (opcional)
  // productionBrowserSourceMaps: true,

  /* ========================================
   * TYPESCRIPT
   * ======================================== */

  // Ignorar erros de TypeScript durante build (NÃO RECOMENDADO - apenas para desenvolvimento rápido)
  // typescript: {
  //   ignoreBuildErrors: false,
  // },

  /* ========================================
   * ESLINT
   * ======================================== */

  // Ignorar erros de ESLint durante build (NÃO RECOMENDADO)
  // eslint: {
  //   ignoreDuringBuilds: false,
  // },

  /* ========================================
   * REDIRECTS & REWRITES
   * ======================================== */

  // Redirects para rotas antigas ou SEO
  // async redirects() {
  //   return [
  //     {
  //       source: '/old-route',
  //       destination: '/new-route',
  //       permanent: true,
  //     },
  //   ];
  // },

  // Rewrites para proxy de API (se necessário)
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:8089/:path*',
  //     },
  //   ];
  // },
};

export default nextConfig;
