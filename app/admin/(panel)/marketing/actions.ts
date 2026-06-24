"use server";
import { updateTag, revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { SETTINGS_TAG } from "@/lib/settings";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autorizado");
}

export type SettingsInput = {
  gtm_id?: string;
  ga4_id?: string;
  google_ads_id?: string;
  meta_pixel_id?: string;
  tiktok_pixel_id?: string;
  head_scripts?: string;
  body_scripts?: string;
};

export async function updateSettings(input: SettingsInput) {
  await requireAuth();
  const admin = createAdminClient();

  const clean = (v?: string) => (v && v.trim() ? v.trim() : null);

  const payload = {
    id: 1,
    gtm_id: clean(input.gtm_id),
    ga4_id: clean(input.ga4_id),
    google_ads_id: clean(input.google_ads_id),
    meta_pixel_id: clean(input.meta_pixel_id),
    tiktok_pixel_id: clean(input.tiktok_pixel_id),
    head_scripts: input.head_scripts && input.head_scripts.trim() ? input.head_scripts : null,
    body_scripts: input.body_scripts && input.body_scripts.trim() ? input.body_scripts : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin
    .from("site_settings")
    .upsert(payload, { onConflict: "id" });

  if (error) return { success: false, error: error.message };

  // Invalida o cache de leitura e o layout do site
  updateTag(SETTINGS_TAG);
  revalidatePath("/", "layout");

  return { success: true };
}
