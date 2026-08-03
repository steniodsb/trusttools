"use client";
import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { createProduct, updateProduct, uploadProductImage } from "../actions";
import { PendingImageUpload, type StagedImage } from "./pending-image-upload";
import type { Category, Product } from "@/lib/database.types";
import { slugify } from "@/lib/utils";

type Props = {
  categories: Category[];
  product?: Product;
};

export function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!product);
  const [categoryId, setCategoryId] = useState(product?.category_id || categories[0]?.id || "");
  const [shortDesc, setShortDesc] = useState(product?.short_description || "");
  const [longDesc, setLongDesc] = useState(product?.long_description || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [applications, setApplications] = useState<string[]>(product?.applications || []);
  const [newApp, setNewApp] = useState("");
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
    Object.entries((product?.specs as Record<string, string>) || {}).map(([key, value]) => ({ key, value })),
  );
  const [active, setActive] = useState(product?.active ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [displayOrder, setDisplayOrder] = useState(product?.display_order ?? 0);
  // Fotos escolhidas antes do produto existir — sobem depois de criar.
  const [staged, setStaged] = useState<StagedImage[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const busy = pending || uploadingPhotos;

  function handleNameChange(v: string) {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  function addApp() {
    const t = newApp.trim();
    if (t && !applications.includes(t)) {
      setApplications([...applications, t]);
      setNewApp("");
    }
  }
  function addTag() {
    const t = newTag.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setNewTag("");
    }
  }

  /** Envia as fotos escolhidas antes do produto existir. A primeira vira a principal. */
  async function uploadStaged(productId: string) {
    setUploadingPhotos(true);
    let failed = 0;

    for (const [i, img] of staged.entries()) {
      const fd = new FormData();
      fd.append("file", img.file);
      fd.append("product_id", productId);
      fd.append("alt", img.file.name.replace(/\.[^.]+$/, ""));
      fd.append("is_primary", String(i === 0));

      const r = await uploadProductImage(fd);
      if (!r.success) {
        failed++;
        toast.error(`${img.file.name}: ${r.error}`);
      }
    }

    const sent = staged.length - failed;
    if (sent > 0) toast.success(sent === 1 ? "Foto enviada" : `${sent} fotos enviadas`);
    staged.forEach((img) => URL.revokeObjectURL(img.preview));
    setStaged([]);
    setUploadingPhotos(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !categoryId) {
      toast.error("Preencha nome e categoria");
      return;
    }
    const specsObj: Record<string, string> = {};
    for (const { key, value } of specs) {
      if (key.trim()) specsObj[key.trim()] = value.trim();
    }
    const payload = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      category_id: categoryId,
      short_description: shortDesc.trim() || undefined,
      long_description: longDesc.trim() || undefined,
      brand: brand.trim() || undefined,
      applications,
      specs: specsObj,
      tags,
      active,
      featured,
      display_order: displayOrder,
    };

    startTransition(async () => {
      if (product) {
        const result = await updateProduct(product.id, payload);
        if (!result.success) {
          toast.error(result.error || "Erro ao salvar");
          return;
        }
        toast.success("Produto atualizado");
        router.refresh();
        return;
      }

      const result = await createProduct(payload);
      if (!result.success) {
        toast.error(result.error || "Erro ao salvar");
        return;
      }

      toast.success("Produto criado");
      if (staged.length) await uploadStaged(result.id);
      router.push(`/admin/produtos/${result.id}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Básico */}
      <Section title="Informações básicas">
        <Field label="Nome do produto" required>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            disabled={busy}
            className={inputCls}
            placeholder="Ex.: Disco diamantado 350mm"
          />
        </Field>
        <Field label="Slug (URL)" required hint={`URL: /produtos/${slug || "..."}`}>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
            disabled={busy}
            className={inputCls}
            placeholder="disco-diamantado-350mm"
          />
        </Field>
        <Field label="Categoria" required>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={busy}
            className={inputCls}
          >
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Marca / Fabricante">
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            disabled={busy}
            className={inputCls}
            placeholder="Ex.: Bosch, Norton..."
          />
        </Field>
      </Section>

      {/* Descrição */}
      <Section title="Descrição">
        <Field label="Resumo curto" hint="Aparece em cards e busca. Até ~180 caracteres.">
          <textarea
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            disabled={busy}
            rows={3}
            maxLength={200}
            className={inputCls}
            placeholder="Descrição curta e direta..."
          />
        </Field>
        <Field label="Descrição completa" hint="Aparece na página do produto. Pode usar quebras de linha.">
          <textarea
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
            disabled={busy}
            rows={8}
            className={inputCls}
            placeholder="Detalhes técnicos, diferenciais, instruções..."
          />
        </Field>
      </Section>

      {/* Fotos — só no cadastro; na edição o painel lateral cuida disso */}
      {!product && (
        <Section title="Fotos do produto">
          <PendingImageUpload items={staged} onChange={setStaged} disabled={busy} />
        </Section>
      )}

      {/* Aplicações */}
      <Section title="Aplicações">
        <ChipInput
          items={applications}
          onAdd={addApp}
          onRemove={(i) => setApplications(applications.filter((_, idx) => idx !== i))}
          inputValue={newApp}
          onInputChange={setNewApp}
          placeholder="Ex.: Corte de granito"
          disabled={busy}
        />
      </Section>

      {/* Especificações */}
      <Section title="Especificações técnicas">
        <div className="space-y-2">
          {specs.map((spec, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => {
                  const next = [...specs];
                  next[i].key = e.target.value;
                  setSpecs(next);
                }}
                disabled={busy}
                className={inputCls}
                placeholder="Característica"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => {
                  const next = [...specs];
                  next[i].value = e.target.value;
                  setSpecs(next);
                }}
                disabled={busy}
                className={inputCls}
                placeholder="Valor"
              />
              <button
                type="button"
                onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
                disabled={busy}
                className="h-11 w-11 grid place-items-center rounded-lg text-ink-3 hover:bg-red-50 hover:text-red-700 transition"
                aria-label="Remover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSpecs([...specs, { key: "", value: "" }])}
            disabled={busy}
            className="btn-link text-sm"
          >
            <Plus className="h-4 w-4" /> Adicionar especificação
          </button>
        </div>
      </Section>

      {/* Tags */}
      <Section title="Tags (para busca)">
        <ChipInput
          items={tags}
          onAdd={addTag}
          onRemove={(i) => setTags(tags.filter((_, idx) => idx !== i))}
          inputValue={newTag}
          onInputChange={setNewTag}
          placeholder="Ex.: diamante, profissional"
          disabled={busy}
        />
      </Section>

      {/* Visibilidade */}
      <Section title="Visibilidade">
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              disabled={busy}
              className="h-4 w-4 accent-brand-500"
            />
            <span>
              <span className="font-semibold text-ink">Ativo</span>
              <span className="block text-xs text-ink-3">Aparece no catálogo público.</span>
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              disabled={busy}
              className="h-4 w-4 accent-brand-500"
            />
            <span>
              <span className="font-semibold text-ink">Destaque</span>
              <span className="block text-xs text-ink-3">Aparece em primeiro lugar.</span>
            </span>
          </label>
          <Field label="Ordem de exibição">
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value || "0", 10))}
              disabled={busy}
              className={inputCls + " max-w-[120px]"}
            />
          </Field>
        </div>
      </Section>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
        <button
          type="button"
          onClick={() => router.push("/admin/produtos")}
          disabled={busy}
          className="btn btn-ghost btn-sm"
        >
          Cancelar
        </button>
        <button type="submit" disabled={busy} className="btn btn-primary btn-sm">
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {uploadingPhotos ? "Enviando fotos..." : "Salvando..."}
            </>
          ) : product ? (
            "Salvar alterações"
          ) : (
            "Criar produto"
          )}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 bg-white border border-line-strong rounded-lg text-ink placeholder:text-ink-3 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:opacity-60 transition";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-line rounded-[16px] p-6">
      <h3 className="text-base font-semibold text-ink mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
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

function ChipInput({
  items,
  onAdd,
  onRemove,
  inputValue,
  onInputChange,
  placeholder,
  disabled,
}: {
  items: string[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  inputValue: string;
  onInputChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(i)}
              disabled={disabled}
              className="h-4 w-4 grid place-items-center rounded-full hover:bg-brand-300/40"
              aria-label="Remover"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          disabled={disabled}
          className={inputCls}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled || !inputValue.trim()}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-700 transition"
        >
          Adicionar
        </button>
      </div>
    </>
  );
}
