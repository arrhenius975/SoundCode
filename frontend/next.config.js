/** @type {import('next').NextConfig} */
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: ['javascript', 'typescript'],
          filename: 'static/[name].worker.js',
        })
      );
    }
    return config;
  },
}

module.exports = nextConfig