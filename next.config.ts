import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Wildcard pra qualquer projeto Supabase + Unsplash + WP antigo
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "steniowebdesigner.com" },
    ],
  },
};

export default nextConfig;
