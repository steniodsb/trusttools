"use client";
import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCategory, updateCategory } from "../actions";
import type { Category } from "@/lib/database.types";
import { slugify } from "@/lib/utils";

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!category);
  const [description, setDescription] = useState(category?.description || "");
  const [imageUrl, setImageUrl] = useState(category?.image_url || "");
  const [displayOrder, setDisplayOrder] = useState(category?.display_order ?? 0);

  function onName(v: string) {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Nome obrigatório");

    const payload = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description: description.trim() || undefined,
      image_url: imageUrl.trim() || undefined,
      display_order: displayOrder,
    };

    startTransition(async () => {
      const r = category
        ? await updateCategory(category.id, payload)
        : await createCategory(payload);

      if (r.success) {
        toast.success(category ? "Categoria atualizada" : "Categoria criada");
        router.push("/admin/categorias");
        router.refresh();
      } else {
        toast.error(r.error || "Erro ao salvar");
      }
    });
  }

  const input = "w-full px-3.5 py-2.5 bg-white border border-line-strong rounded-lg text-ink placeholder:text-ink-3 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:opacity-60 transition";

  return (
    <form onSubmit={onSubmit} className="bg-white border border-line rounded-[16px] p-6 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Nome *</label>
        <input type="text" required value={name} onChange={(e) => onName(e.target.value)} disabled={pending} className={input} placeholder="Ex.: Construção Civil" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Slug (URL)</label>
        <input type="text" required value={slug} onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }} disabled={pending} className={input} placeholder="construcao-civil" />
        <p className="text-xs text-ink-3 mt-1">URL: /produtos?categoria={slug || "..."}</p>
      </div>
      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Descrição</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={pending} rows={3} className={input} placeholder="Descrição curta da linha de produtos..." />
      </div>
      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">URL da imagem</label>
        <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} disabled={pending} className={input} placeholder="https://... (opcional)" />
        <p className="text-xs text-ink-3 mt-1">Pode ser uma URL externa ou do Supabase Storage.</p>
      </div>
      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Ordem de exibição</label>
        <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value || "0", 10))} disabled={pending} className={input + " max-w-[120px]"} />
      </div>
      <div className="flex justify-end gap-3 pt-3 border-t border-line">
        <button type="button" onClick={() => router.push("/admin/categorias")} disabled={pending} className="btn btn-ghost btn-sm">Cancelar</button>
        <button type="submit" disabled={pending} className="btn btn-primary btn-sm">
          {pending ? <><Loader2 className="h-4 w-4 animate-spin" />Salvando...</> : (category ? "Salvar" : "Criar")}
        </button>
      </div>
    </form>
  );
}
