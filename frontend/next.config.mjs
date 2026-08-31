/** @type {import('next').NextConfig} */
const nextConfig = {
  // No component currently references an external image URL — every asset was
  // downloaded into /public. This stays as a safety net in case a future page
  // hotlinks something from the original site before it's been copied locally.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.carpetcellar.com",
      },
      {
        protocol: "https",
        hostname: "carpetcellar.com",
      },
    ],
  },
};

export default nextConfig;
