import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product, ProductImage } from "@/lib/database.types";
import { SubHero } from "@/components/site/sub-hero";
import { ProductFilters } from "@/components/site/product-filters";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Catálogo completo de ferramentas industriais Trust Tools. Discos diamantados, brocas, segmentos, abrasivos para construção, refratários, pedras e indústria pesada.",
};

type SearchParams = Promise<{ categoria?: string; q?: string }>;

type ProductWithImage = Product & {
  category: Pick<Category, "name" | "slug"> | null;
  primary_image: ProductImage | null;
};

async function getData(params: { categoria?: string; q?: string }) {
  try {
    const supabase = await createClient();
    const [{ data: categories }, productsQuery] = await Promise.all([
      supabase.from("categories").select("*").order("display_order"),
      buildProductsQuery(supabase, params),
    ]);

    return {
      categories: (categories || []) as Category[],
      products: ((productsQuery as any).data || []) as ProductWithImage[],
    };
  } catch {
    return { categories: [], products: [] };
  }
}

async function buildProductsQuery(
  supabase: Awaited<ReturnType<typeof createClient>>,
  params: { categoria?: string; q?: string },
) {
  let q = supabase
    .from("products")
    .select(
      `*, category:categories(name, slug), images:product_images(*)`,
    )
    .eq("active", true)
    .order("display_order");

  if (params.categoria) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.categoria)
      .maybeSingle();
    if (cat) q = q.eq("category_id", cat.id);
  }
  if (params.q) {
    q = q.or(
      `name.ilike.%${params.q}%,short_description.ilike.%${params.q}%,long_description.ilike.%${params.q}%`,
    );
  }
  const result = await q;
  // Pegar primary image
  const products = (result.data || []).map((p: any) => ({
    ...p,
    primary_image:
      p.images?.find((i: ProductImage) => i.is_primary) ?? p.images?.[0] ?? null,
  }));
  return { ...result, data: products };
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { categories, products } = await getData(params);

  return (
    <>
      <SubHero
        eyebrow="CATÁLOGO COMPLETO"
        title={
          <>
            Encontre a ferramenta <span className="grad-text">para sua obra</span>.
          </>
        }
        description="Filtre por categoria ou busque pelo nome. Cotação rápida pelo WhatsApp."
      />

      <section className="tt-section">
        <div className="tt-container">
          <ProductFilters categories={categories} />

          <div className="mt-12">
            {products.length === 0 ? (
              <EmptyState hasFilters={!!(params.categoria || params.q)} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
                {products.map((p) => (
                  <Reveal key={p.id}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function ProductCard({ product }: { product: ProductWithImage }) {
  return (
    <Link href={`/produtos/${product.slug}`} className="tt-card overflow-hidden flex flex-col h-full group">
      <div className="relative aspect-[4/3] bg-surface-soft">
        {product.primary_image ? (
          <Image
            src={product.primary_image.url}
            alt={product.primary_image.alt || product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-ink-3 text-sm" style={{ background: "var(--grad-primary)" }}>
            <span className="text-white/80">Sem foto</span>
          </div>
        )}
        {product.category && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[11px] font-semibold tracking-[.12em] uppercase rounded-full bg-white/85 backdrop-blur text-brand-700">
            {product.category.name}
          </span>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg mb-1.5">{product.name}</h3>
        {product.short_description && (
          <p className="text-sm text-ink-2 mb-4 flex-1 line-clamp-3">{product.short_description}</p>
        )}
        <span className="btn-link mt-auto">Ver detalhes <span className="arrow">→</span></span>
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
      <h2 className="text-2xl mb-2">{hasFilters ? "Nenhum produto encontrado" : "Catálogo em construção"}</h2>
      <p className="text-ink-2 max-w-md mx-auto mb-6">
        {hasFilters
          ? "Tente ajustar os filtros ou nos chame no WhatsApp — temos muito mais em estoque do que aqui."
          : "Em breve, todo nosso catálogo aqui. Enquanto isso, fale com a gente pelo WhatsApp."}
      </p>
      <Link href="/produtos" className="btn-link">Limpar filtros</Link>
    </div>
  );
}
