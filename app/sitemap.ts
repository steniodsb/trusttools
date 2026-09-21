import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/utils";
import { linhas } from "@/lib/linhas";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  return [
    { url: `${base}/`, lastModified: new Date(), priority: 1.0, changeFrequency: "weekly" },
    { url: `${base}/sobre`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/produtos`, lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/contato`, lastModified: new Date(), priority: 0.6, changeFrequency: "yearly" },
    ...linhas.map((l) => ({
      url: `${base}/linhas/${l.slug}`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
  ];
}
