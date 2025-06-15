import { withGlobalCss } from "next-global-css";
import path from 'path';

// Import environment variables if necessary
await import("./src/env.mjs");

const withConfig = withGlobalCss();

/**
 * @type {import('next').NextConfig}
 */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src/styles')],
  },
  experimental: {
    // Ensure runtime is not set to 'experimental-edge'
    // runtime: 'experimental-edge',
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.fallback = {
      crypto: require.resolve('crypto-browserify'),
    };
    return webpackConfig;
  },
  // Explicitly set runtime to Node.js for API routes
  // (Note: This might be in next.config.js or in individual API route files)
  // If not in individual routes, this can be a global configuration.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default withConfig(config);
