"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import type { SiteSettings } from "@/lib/database.types";
import { updateSettings, type SettingsInput } from "./actions";

const inputClass =
  "w-full px-3.5 py-2.5 bg-bg border border-line-strong rounded-lg text-ink text-sm focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:opacity-60 transition";

function Field({
  label,
  hint,
  placeholder,
  name,
  defaultValue,
}: {
  label: string;
  hint?: string;
  placeholder?: string;
  name: keyof SettingsInput;
  defaultValue: string | null;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink mb-1.5">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={inputClass}
        autoComplete="off"
        spellCheck={false}
      />
      {hint && <p className="text-xs text-ink-3 mt-1">{hint}</p>}
    </div>
  );
}

export function MarketingForm({ settings }: { settings: SiteSettings }) {
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const input: SettingsInput = {
      gtm_id: String(fd.get("gtm_id") || ""),
      ga4_id: String(fd.get("ga4_id") || ""),
      google_ads_id: String(fd.get("google_ads_id") || ""),
      meta_pixel_id: String(fd.get("meta_pixel_id") || ""),
      tiktok_pixel_id: String(fd.get("tiktok_pixel_id") || ""),
      head_scripts: String(fd.get("head_scripts") || ""),
      body_scripts: String(fd.get("body_scripts") || ""),
    };
    try {
      const res = await updateSettings(input);
      if (res.success) toast.success("Configurações salvas! As tags já estão no ar.");
      else toast.error(res.error || "Erro ao salvar.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-2xl">
      {/* Google */}
      <section className="bg-white border border-line rounded-2xl p-6">
        <h2 className="text-lg font-display font-bold text-ink mb-1">Google</h2>
        <p className="text-sm text-ink-3 mb-5">Tag Manager, Analytics (GA4) e Google Ads.</p>
        <div className="grid gap-4">
          <Field
            label="Google Tag Manager"
            name="gtm_id"
            placeholder="GTM-XXXXXXX"
            hint="ID do container do GTM. Se usar GTM, gerencie os demais pixels por dentro dele."
            defaultValue={settings.gtm_id}
          />
          <Field
            label="Google Analytics 4"
            name="ga4_id"
            placeholder="G-XXXXXXXXXX"
            hint="ID de métrica do GA4."
            defaultValue={settings.ga4_id}
          />
          <Field
            label="Google Ads"
            name="google_ads_id"
            placeholder="AW-XXXXXXXXX"
            hint="ID de conversão do Google Ads."
            defaultValue={settings.google_ads_id}
          />
        </div>
      </section>

      {/* Meta / TikTok */}
      <section className="bg-white border border-line rounded-2xl p-6">
        <h2 className="text-lg font-display font-bold text-ink mb-1">Redes sociais</h2>
        <p className="text-sm text-ink-3 mb-5">Pixels de Meta (Facebook/Instagram) e TikTok.</p>
        <div className="grid gap-4">
          <Field
            label="Meta Pixel (Facebook/Instagram)"
            name="meta_pixel_id"
            placeholder="123456789012345"
            hint="ID numérico do Pixel da Meta."
            defaultValue={settings.meta_pixel_id}
          />
          <Field
            label="TikTok Pixel"
            name="tiktok_pixel_id"
            placeholder="XXXXXXXXXXXXXXXXXXXX"
            hint="ID do Pixel do TikTok."
            defaultValue={settings.tiktok_pixel_id}
          />
        </div>
      </section>

      {/* Código personalizado */}
      <section className="bg-white border border-line rounded-2xl p-6">
        <h2 className="text-lg font-display font-bold text-ink mb-1">Código personalizado</h2>
        <p className="text-sm text-ink-3 mb-5">
          Para qualquer outra tag/script de campanha. Cole o código completo (incluindo as tags{" "}
          <code className="text-xs">&lt;script&gt;</code>).
        </p>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Código no &lt;head&gt;
            </label>
            <textarea
              name="head_scripts"
              defaultValue={settings.head_scripts ?? ""}
              rows={5}
              spellCheck={false}
              className={`${inputClass} font-mono text-xs`}
              placeholder="<!-- scripts adicionais carregados no topo da página -->"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Código no fim do &lt;body&gt;
            </label>
            <textarea
              name="body_scripts"
              defaultValue={settings.body_scripts ?? ""}
              rows={5}
              spellCheck={false}
              className={`${inputClass} font-mono text-xs`}
              placeholder="<!-- scripts adicionais carregados no fim da página -->"
            />
          </div>
        </div>
      </section>

      <button type="submit" disabled={saving} className="btn btn-primary">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? "Salvando..." : "Salvar configurações"}
      </button>
    </form>
  );
}
