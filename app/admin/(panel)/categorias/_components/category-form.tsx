"use client";
import { useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCategory, updateCategory, deleteCategoryImage } from "../actions";
import { CategoryImageUpload } from "./category-image-upload";
import type { Category } from "@/lib/database.types";
import { slugify } from "@/lib/utils";

const DESC_MAX = 200;

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!category);
  const [description, setDescription] = useState(category?.description || "");
  const [imageUrl, setImageUrl] = useState(category?.image_url || "");
  const [displayOrder, setDisplayOrder] = useState(category?.display_order ?? 0);

  const initialImage = category?.image_url || "";
  /** Uploads feitos nesta sessão — os que não forem salvos viram órfãos. */
  const uploaded = useRef<string[]>([]);

  function onName(v: string) {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  /** Apaga do Storage o que não ficou em uso. Falha aqui não bloqueia o salvamento. */
  function discard(urls: string[]) {
    return Promise.all(urls.map((u) => deleteCategoryImage(u).catch(() => null)));
  }

  async function cleanup(keep: string) {
    const orphans = uploaded.current.filter((u) => u !== keep);
    if (initialImage && initialImage !== keep) orphans.push(initialImage);
    await discard(orphans);
    uploaded.current = keep ? [keep] : [];
  }

  function onCancel() {
    const orphans = uploaded.current;
    uploaded.current = [];
    void discard(orphans);
    router.push("/admin/categorias");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Nome obrigatório");

    const payload = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description: description.trim(),
      image_url: imageUrl.trim(),
      display_order: displayOrder,
    };

    startTransition(async () => {
      const r = category
        ? await updateCategory(category.id, payload)
        : await createCategory(payload);

      if (r.success) {
        await cleanup(payload.image_url);
        toast.success(category ? "Categoria atualizada" : "Categoria criada");
        router.push("/admin/categorias");
        router.refresh();
      } else {
        toast.error(r.error || "Erro ao salvar");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Section
        title="Identificação"
        description="Como a linha de produtos aparece no catálogo e na URL."
      >
        <Field label="Nome" required>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => onName(e.target.value)}
            disabled={pending}
            className={input}
            placeholder="Ex.: Construção Civil"
          />
        </Field>

        <Field label="Slug (URL)" hint="Gerado a partir do nome. Mudar o slug quebra links já compartilhados.">
          <div className="flex items-stretch rounded-lg border border-line-strong bg-white focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 transition overflow-hidden">
            <span className="hidden sm:grid place-items-center px-3 bg-bg border-r border-line text-sm text-ink-3 whitespace-nowrap">
              /catalogo?categoria=
            </span>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugTouched(true);
              }}
              disabled={pending}
              className="flex-1 min-w-0 px-3.5 py-2.5 text-ink placeholder:text-ink-3 focus:outline-none disabled:opacity-60"
              placeholder="construcao-civil"
            />
          </div>
        </Field>

        <Field
          label="Descrição"
          hint={`Aparece abaixo do título da categoria. ${description.length}/${DESC_MAX}`}
        >
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={pending}
            rows={3}
            maxLength={DESC_MAX}
            className={input}
            placeholder="Descrição curta da linha de produtos..."
          />
        </Field>
      </Section>

      <Section
        title="Imagem da categoria"
        description="Usada nos cards e no cabeçalho da linha. Prefira uma foto horizontal e nítida."
      >
        <CategoryImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          onUploaded={(url) => uploaded.current.push(url)}
          disabled={pending}
        />
      </Section>

      <Section title="Exibição" description="Controla a posição da categoria nas listagens.">
        <Field label="Ordem de exibição" hint="Menor número aparece primeiro.">
          <input
            type="number"
            min={0}
            value={displayOrder}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value || "0", 10))}
            disabled={pending}
            className={input + " max-w-[120px]"}
          />
        </Field>
      </Section>

      <div className="sticky bottom-0 flex items-center justify-end gap-3 py-4 bg-bg/85 backdrop-blur border-t border-line">
        <button type="button" onClick={onCancel} disabled={pending} className="btn btn-ghost btn-sm">
          Cancelar
        </button>
        <button type="submit" disabled={pending} className="btn btn-primary btn-sm">
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
            </>
          ) : category ? (
            "Salvar alterações"
          ) : (
            "Criar categoria"
          )}
        </button>
      </div>
    </form>
  );
}

const input =
  "w-full px-3.5 py-2.5 bg-white border border-line-strong rounded-lg text-ink placeholder:text-ink-3 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:opacity-60 transition";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-line rounded-[16px] p-6">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="text-sm text-ink-3 mt-0.5">{description}</p>}
      <div className="space-y-4 mt-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink mb-1.5">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-3 mt-1">{hint}</p>}
    </div>
  );
}
