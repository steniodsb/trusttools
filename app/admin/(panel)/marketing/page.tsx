import { createAdminClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import type { SiteSettings } from "@/lib/database.types";
import { MarketingForm } from "./marketing-form";

export const dynamic = "force-dynamic";

async function getSettingsFresh(): Promise<SiteSettings> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    return data ? { ...DEFAULT_SETTINGS, ...data } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default async function MarketingPage() {
  const settings = await getSettingsFresh();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-ink">Marketing & Rastreamento</h1>
        <p className="text-ink-2 mt-1">
          Configure os pixels e tags de campanha. As alterações entram no ar em todo o site
          automaticamente após salvar.
        </p>
      </div>

      <MarketingForm settings={settings} />
    </div>
  );
}
