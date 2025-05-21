import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
   output: `standalone`,
   reactStrictMode: false,
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "bizweb.dktcdn.net",
          },
         {
            protocol: "https",
            hostname: "res.cloudinary.com",
          },
         {
            protocol: "https",
            hostname: "tmdt.vulebaolong.com",
         },
         {
            protocol: "http",
            hostname: "localhost",
         },
      ],
   },
};

export default withNextIntl(nextConfig);
