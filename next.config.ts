import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel está retornando 402 (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED):
    // a cota de Otimização de Imagens do plano foi atingida. Servimos as
    // imagens originais direto (sem o endpoint /_next/image) para não quebrar.
    unoptimized: true,
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
