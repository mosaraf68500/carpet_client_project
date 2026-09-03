/** @type {import('next').NextConfig} */
const nextConfig = {
  // Every real asset was downloaded into /public. images.unsplash.com is
  // used for stock photography where no real photo exists yet (blog
  // placeholder posts in data/blogContent.js; several rows on the
  // /services/* pages in data/servicesContent.js) — swap in real assets as
  // they're provided and this entry can shrink accordingly. res.cloudinary.com
  // is where the backend actually stores every real category/product image
  // uploaded via the dashboard (see backend/src/common/config/cloudinary.ts) —
  // required for any real (non-mock) image to render at all.
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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
