"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, type ChangeEvent } from "react";
import { Search, X } from "lucide-react";
import type { Category } from "@/lib/database.types";
import { cn } from "@/lib/utils";

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [_, startTransition] = useTransition();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const activeCat = searchParams.get("categoria");

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "") params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.push(`/produtos${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  function onSearch(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQ(value);
    // Debounce simples
    clearTimeout((onSearch as any).__t);
    (onSearch as any).__t = setTimeout(() => updateParam("q", value), 350);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-3" />
        <input
          type="search"
          placeholder="Buscar produto..."
          value={q}
          onChange={onSearch}
          className="w-full pl-12 pr-12 py-3.5 bg-white border border-line-strong rounded-full text-ink placeholder:text-ink-3 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition"
        />
        {q && (
          <button
            type="button"
            onClick={() => { setQ(""); updateParam("q", null); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 grid place-items-center rounded-full text-ink-3 hover:text-ink hover:bg-bg"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center p-2 bg-white border border-line rounded-full max-w-max mx-auto shadow-sm">
        <button
          type="button"
          onClick={() => updateParam("categoria", null)}
          className={cn(
            "py-2.5 px-4 rounded-full font-display font-semibold text-sm transition-all",
            !activeCat ? "text-white shadow-[var(--shadow-glow)]" : "text-ink-2 hover:text-ink hover:bg-surface-soft",
          )}
          style={!activeCat ? { background: "var(--grad-primary)" } : undefined}
        >
          Todas
        </button>
        {categories.map((cat) => {
          const active = activeCat === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateParam("categoria", cat.slug)}
              className={cn(
                "py-2.5 px-4 rounded-full font-display font-semibold text-sm transition-all",
                active ? "text-white shadow-[var(--shadow-glow)]" : "text-ink-2 hover:text-ink hover:bg-surface-soft",
              )}
              style={active ? { background: "var(--grad-primary)" } : undefined}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
