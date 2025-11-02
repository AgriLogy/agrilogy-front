/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
	  ignoreBuildErrors: true, // Ignore TypeScript errors
	},
	eslint: {
	  ignoreDuringBuilds: true, // Ignore ESLint errors
	},
	reactStrictMode: false, // Disable React Strict Mode (optional)
  };
  
  export default nextConfig;
  