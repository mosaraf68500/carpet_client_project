/** @type {import('next').NextConfig} */
const nextConfig = {
  // Every real asset was downloaded into /public. images.unsplash.com is the
  // one exception, used for stock photography where no real photo exists yet
  // (blog placeholder posts in data/blogContent.js; several rows on the
  // /services/* pages in data/servicesContent.js) — swap in real assets as
  // they're provided and this entry can shrink accordingly.
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
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
