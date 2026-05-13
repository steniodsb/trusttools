import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product, ProductImage } from "@/lib/database.types";
import { SubHero } from "@/components/site/sub-hero";
import { FiltersSidebar } from "@/components/site/filters-sidebar";
import { Pagination } from "@/components/site/pagination";
import { SortSelect } from "@/components/site/sort-select";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Catálogo completo de ferramentas industriais Trust Tools — discos diamantados, brocas, segmentos, cálices, coroas e abrasivos para construção, refratários, pedras e indústria pesada.",
};

const PER_PAGE = 24;

// Diâmetros comuns na linha (extraídos dos specs)
const COMMON_DIAMETERS = [
  "100mm", "110mm", "115mm", "125mm", "150mm", "180mm",
  "230mm", "250mm", "300mm", "350mm", "400mm", "450mm",
  "500mm", "600mm", "700mm", "800mm", "900mm", "1000mm", "1200mm",
];

const COMMON_ORIGINS = ["Importado", "Produzido no Brasil", "Nacional"];
const COMMON_BRANDS = ["Trust"];

type SearchParams = Promise<{
  categoria?: string;
  q?: string;
  diametro?: string;
  origem?: string;
  marca?: string;
  sort?: string;
  page?: string;
}>;

type ProductWithImage = Product & {
  category: Pick<Category, "name" | "slug"> | null;
  primary_image: ProductImage | null;
};

async function getData(params: Awaited<SearchParams>) {
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  try {
    const supabase = await createClient();

    // 1. Categorias com contagem
    const { data: cats } = await supabase
      .from("categories")
      .select(`*, products:products(count)`)
      .order("display_order");

    const categories: Array<Category & { product_count: number }> = (cats || []).map(
      (c: any) => ({
        ...c,
        product_count: c.products?.[0]?.count || 0,
      }),
    );

    // 2. Query produtos com filtros
    let query = supabase
      .from("products")
      .select(
        `*, category:categories(name, slug), images:product_images(*)`,
        { count: "exact" },
      )
      .eq("active", true);

    if (params.categoria) {
      const cat = categories.find((c) => c.slug === params.categoria);
      if (cat) query = query.eq("category_id", cat.id);
    }

    if (params.q) {
      query = query.or(
        `name.ilike.%${params.q}%,short_description.ilike.%${params.q}%`,
      );
    }

    if (params.diametro) {
      query = query.eq("specs->>Diâmetro", params.diametro);
    }

    if (params.origem) {
      query = query.eq("specs->>Origem", params.origem);
    }

    if (params.marca) {
      query = query.eq("brand", params.marca);
    }

    // Ordenação
    switch (params.sort) {
      case "name-asc":
        query = query.order("name", { ascending: true });
        break;
      case "name-desc":
        query = query.order("name", { ascending: false });
        break;
      case "recent":
        query = query.order("created_at", { ascending: false });
        break;
      default:
        query = query
          .order("featured", { ascending: false })
          .order("display_order", { ascending: true })
          .order("name", { ascending: true });
    }

    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) console.error("[produtos] query error:", error);

    const products: ProductWithImage[] = ((data as any[]) || []).map((p) => ({
      ...p,
      primary_image:
        p.images?.find((i: ProductImage) => i.is_primary) ?? p.images?.[0] ?? null,
    }));

    return {
      categories,
      products,
      total: count || 0,
      page,
    };
  } catch (err) {
    console.error("[produtos] erro:", err);
    return { categories: [], products: [], total: 0, page };
  }
}

function buildHref(params: Awaited<SearchParams>, overrides: Record<string, string | null>): string {
  const search = new URLSearchParams();
  const merged = { ...params, ...overrides };
  for (const [k, v] of Object.entries(merged)) {
    if (v) search.set(k, String(v));
  }
  const qs = search.toString();
  return `/produtos${qs ? `?${qs}` : ""}`;
}

export default async function ProdutosPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { categories, products, total, page } = await getData(params);

  const hasFilters = !!(
    params.categoria || params.q || params.diametro || params.origem || params.marca
  );

  const from = (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, total);

  return (
    <>
      <SubHero
        eyebrow="CATÁLOGO COMPLETO"
        title={
          <>
            Encontre a ferramenta <span className="grad-text">para sua obra</span>.
          </>
        }
        description={`${total} produtos em estoque. Filtre por categoria, diâmetro, origem ou busque pelo nome.`}
      />

      <section className="tt-section">
        <div className="tt-container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar de filtros */}
            <FiltersSidebar
              categories={categories}
              diametros={COMMON_DIAMETERS}
              origens={COMMON_ORIGINS}
              marcas={COMMON_BRANDS}
            />

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-line">
                <div className="text-sm text-ink-2">
                  {total > 0 ? (
                    <>
                      Mostrando <strong className="text-ink">{from}–{to}</strong> de{" "}
                      <strong className="text-ink">{total}</strong> produtos
                    </>
                  ) : (
                    "Nenhum produto encontrado"
                  )}
                </div>
                <SortSelect />
              </div>

              {/* Grid */}
              {products.length === 0 ? (
                <EmptyState hasFilters={hasFilters} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
                  {products.map((p) => (
                    <Reveal key={p.id}>
                      <ProductCard product={p} />
                    </Reveal>
                  ))}
                </div>
              )}

              {/* Paginação */}
              <Pagination
                total={total}
                page={page}
                perPage={PER_PAGE}
                buildHref={(p) => buildHref(params, { page: p === 1 ? null : String(p) })}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductCard({ product }: { product: ProductWithImage }) {
  const diameter = (product.specs as any)?.["Diâmetro"];
  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="tt-card overflow-hidden flex flex-col h-full group"
    >
      <div className="relative aspect-square bg-white">
        {product.primary_image ? (
          <Image
            src={product.primary_image.url}
            alt={product.primary_image.alt || product.name}
            fill
            className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
            sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 100vw"
          />
        ) : (
          <div
            className="absolute inset-0 grid place-items-center text-white/80"
            style={{ background: "var(--grad-primary)" }}
          >
            Sem foto
          </div>
        )}
        {product.category && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-bold tracking-[.12em] uppercase rounded-full bg-white/95 backdrop-blur text-brand-700 shadow-sm">
            {product.category.name}
          </span>
        )}
        {diameter && (
          <span className="absolute top-3 right-3 z-10 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full bg-brand-500 text-white shadow-sm">
            Ø {diameter}
          </span>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-semibold text-ink mb-1.5 leading-snug line-clamp-2">
          {product.name}
        </h3>
        {product.short_description && (
          <p className="text-sm text-ink-2 mb-4 flex-1 line-clamp-2">
            {product.short_description}
          </p>
        )}
        <span className="btn-link mt-auto text-sm">
          Ver detalhes <span className="arrow">→</span>
        </span>
      </div>
    </Link>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="text-center py-20 px-6 bg-white border border-line rounded-[20px]">
      <div
        className="mx-auto h-16 w-16 rounded-full grid place-items-center text-white mb-6"
        style={{ background: "var(--grad-primary)" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <h2 className="text-2xl mb-2">
        {hasFilters ? "Nenhum produto encontrado" : "Catálogo em construção"}
      </h2>
      <p className="text-ink-2 max-w-md mx-auto mb-6">
        {hasFilters
          ? "Tente ajustar os filtros ou nos chame no WhatsApp — temos muito mais em estoque do que aqui."
          : "Em breve, todo nosso catálogo aqui. Enquanto isso, fale com a gente pelo WhatsApp."}
      </p>
      <Link href="/produtos" className="btn-link">
        Limpar filtros
      </Link>
    </div>
  );
}
