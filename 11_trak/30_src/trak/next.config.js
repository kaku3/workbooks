/** @type {import('next').NextConfig} */
const nextConfig = {
  // mdファイルを扱えるようにwebpackの設定を追加
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },

  // その他のNext.js設定
  experimental: {
    // APIの静的ファイル読み込みを許可
    serverComponentsExternalPackages: ['fs', 'path']
  },

  // 静的アセットの設定
  images: {
    domains: ['localhost'],
  },

  // 環境変数の設定
  env: {
    APP_NAME: 'Trak',
    APP_VERSION: '0.1.0'
  },

  // TypeScript Pathsの設定
  typescript: {
    baseUrl: '.',
    paths: {
      '@/*': ['src/*'],
      '@/lib/*': ['src/lib/*']
    }
  }
}

module.exports = nextConfig;
