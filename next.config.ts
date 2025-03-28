import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
   output: `standalone`,
   reactStrictMode: false,
   images: {
      domains: ["tmdt.vulebaolong.com", "down-vn.img.susercontent.com"],
   },
};

export default withNextIntl(nextConfig);
