import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/database.types";

export const SETTINGS_TAG = "site-settings";

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  gtm_id: null,
  ga4_id: null,
  google_ads_id: null,
  meta_pixel_id: null,
  tiktok_pixel_id: null,
  head_scripts: null,
  body_scripts: null,
  updated_at: "",
};

/**
 * Lê as configurações do site (pixels/tags). Resiliente: se a tabela ainda
 * não existir ou as envs faltarem, retorna os defaults (site não quebra).
 * Cacheado e invalidado via revalidateTag(SETTINGS_TAG) ao salvar.
 */
export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url || !key) return DEFAULT_SETTINGS;

      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error || !data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...data };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },
  ["site-settings"],
  { tags: [SETTINGS_TAG], revalidate: 300 },
);
