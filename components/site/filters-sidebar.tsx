"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, type ChangeEvent } from "react";
import { Search, X, SlidersHorizontal, FilterX } from "lucide-react";
import type { Category } from "@/lib/database.types";
import { cn } from "@/lib/utils";

type Props = {
  categories: Array<Category & { product_count: number }>;
  diametros: string[];
  origens: string[];
  marcas: string[];
};

export function FiltersSidebar({ categories, diametros, origens, marcas }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [_, startTransition] = useTransition();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCat = searchParams.get("categoria");
  const activeDia = searchParams.get("diametro");
  const activeOrigem = searchParams.get("origem");
  const activeMarca = searchParams.get("marca");

  const activeCount =
    (activeCat ? 1 : 0) +
    (activeDia ? 1 : 0) +
    (activeOrigem ? 1 : 0) +
    (activeMarca ? 1 : 0) +
    (q ? 1 : 0);

  function update(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    // Sempre resetar pra página 1 quando muda filtro
    params.delete("page");
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    startTransition(() => {
      router.push(`/produtos${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  function onSearch(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQ(value);
    clearTimeout((onSearch as any).__t);
    (onSearch as any).__t = setTimeout(() => update({ q: value || null }), 350);
  }

  function clearAll() {
    setQ("");
    startTransition(() => router.push("/produtos"));
  }

  const Inner = (
    <div className="space-y-6">
      {/* Busca */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-ink-3 mb-2">
          Busca
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3" />
          <input
            type="search"
            placeholder="Nome ou código..."
            value={q}
            onChange={onSearch}
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-line-strong rounded-lg text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition"
          />
          {q && (
            <button
              type="button"
              onClick={() => { setQ(""); update({ q: null }); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 grid place-items-center rounded-full text-ink-3 hover:text-ink"
              aria-label="Limpar busca"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categoria */}
      <FilterGroup title="Categoria">
        <FilterOption
          label="Todas as categorias"
          count={categories.reduce((s, c) => s + c.product_count, 0)}
          active={!activeCat}
          onClick={() => update({ categoria: null })}
        />
        {categories.map((c) => (
          <FilterOption
            key={c.id}
            label={c.name}
            count={c.product_count}
            active={activeCat === c.slug}
            onClick={() => update({ categoria: c.slug })}
          />
        ))}
      </FilterGroup>

      {/* Diâmetro */}
      {diametros.length > 0 && (
        <FilterGroup title="Diâmetro">
          <FilterOption
            label="Todos os tamanhos"
            active={!activeDia}
            onClick={() => update({ diametro: null })}
          />
          {diametros.map((d) => (
            <FilterOption
              key={d}
              label={d}
              active={activeDia === d}
              onClick={() => update({ diametro: d })}
            />
          ))}
        </FilterGroup>
      )}

      {/* Origem */}
      {origens.length > 0 && (
        <FilterGroup title="Origem">
          <FilterOption
            label="Todas"
            active={!activeOrigem}
            onClick={() => update({ origem: null })}
          />
          {origens.map((o) => (
            <FilterOption
              key={o}
              label={o}
              active={activeOrigem === o}
              onClick={() => update({ origem: o })}
            />
          ))}
        </FilterGroup>
      )}

      {/* Marca */}
      {marcas.length > 1 && (
        <FilterGroup title="Marca">
          <FilterOption
            label="Todas"
            active={!activeMarca}
            onClick={() => update({ marca: null })}
          />
          {marcas.map((m) => (
            <FilterOption
              key={m}
              label={m}
              active={activeMarca === m}
              onClick={() => update({ marca: m })}
            />
          ))}
        </FilterGroup>
      )}

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-100/40 rounded-lg transition"
        >
          <FilterX className="h-4 w-4" />
          Limpar filtros ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Toggle mobile */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-line-strong rounded-full text-sm font-semibold text-ink"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
        {activeCount > 0 && (
          <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-500 text-white text-xs px-1.5">
            {activeCount}
          </span>
        )}
      </button>

      {/* Sidebar desktop */}
      <aside className="hidden lg:block sticky top-24 w-64 flex-shrink-0">
        <div className="bg-white border border-line rounded-2xl p-5">{Inner}</div>
      </aside>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar filtros"
          />
          <div className="w-80 max-w-[85vw] bg-white h-full overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-line">
              <h3 className="font-bold text-lg">Filtros</h3>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="h-9 w-9 grid place-items-center rounded-lg hover:bg-bg"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {Inner}
          </div>
        </div>
      )}
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-2.5">{title}</h3>
      <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">{children}</div>
    </div>
  );
}

function FilterOption({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg text-sm transition",
        active
          ? "bg-brand-100 text-brand-700 font-semibold"
          : "text-ink-2 hover:bg-bg hover:text-ink",
      )}
    >
      <span className="truncate text-left">{label}</span>
      {typeof count === "number" && (
        <span className={cn("text-xs flex-shrink-0", active ? "text-brand-700" : "text-ink-3")}>
          {count}
        </span>
      )}
    </button>
  );
}
