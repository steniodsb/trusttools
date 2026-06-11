import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/utils";
import { linhas } from "@/lib/linhas";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), priority: 1.0, changeFrequency: "weekly" },
    { url: `${base}/sobre`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/produtos`, lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/catalogo`, lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/catalogos`, lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
    { url: `${base}/contato`, lastModified: new Date(), priority: 0.6, changeFrequency: "yearly" },
    ...linhas.map((l) => ({
      url: `${base}/linhas/${l.slug}`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
  ];

  try {
    const supabase = await createClient();
    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("active", true);

    const productRoutes: MetadataRoute.Sitemap = (products || []).map((p) => ({
      url: `${base}/produtos/${p.slug}`,
      lastModified: new Date(p.updated_at),
      priority: 0.7,
      changeFrequency: "weekly" as const,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
