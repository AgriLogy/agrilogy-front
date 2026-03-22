/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors
  },
  // ESLint is no longer configured here (Next.js 16+). Run `npm run lint` in CI, or
  // `next build --no-lint` if you need to skip lint during a build.
  reactStrictMode: false, // Disable React Strict Mode (optional)
};

export default nextConfig;
