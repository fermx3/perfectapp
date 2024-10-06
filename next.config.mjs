/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oh1tguwhubnomp7e.public.blob.vercel-storage.com',
        port: '',
      },
    ],
  },
};

export default nextConfig;
