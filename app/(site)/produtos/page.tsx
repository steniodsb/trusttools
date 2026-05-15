import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product, ProductImage } from "@/lib/database.types";
import { Pagination } from "@/components/site/pagination";
import { SortSelect } from "@/components/site/sort-select";
import { Reveal } from "@/components/site/reveal";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Catálogo de Produtos — Trust Tools",
  description:
    "Catálogo completo de ferramentas industriais Trust Tools. Ferramentas fabricadas e importadas para construção, refratários, pedras e indústria pesada.",
};

const PER_PAGE = 24;

type SearchParams = Promise<{
  categoria?: string;
  q?: string;
  linha?: string;
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

    const { data: cats } = await supabase
      .from("categories")
      .select(`*, products:products(count)`)
      .order("display_order");

    const categories: Array<Category & { product_count: number }> = (
      cats || []
    ).map((c: any) => ({
      ...c,
      product_count: c.products?.[0]?.count || 0,
    }));

    let query = supabase
      .from("products")
      .select(`*, category:categories(name, slug), images:product_images(*)`, {
        count: "exact",
      })
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

    if (params.linha === "fabricadas") {
      query = query.or(
        `specs->>Origem.eq.Produzido no Brasil,specs->>Origem.eq.Nacional`,
      );
    } else if (params.linha === "importadas") {
      query = query.eq("specs->>Origem", "Importado");
    }

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
        p.images?.find((i: ProductImage) => i.is_primary) ??
        p.images?.[0] ??
        null,
    }));

    return { categories, products, total: count || 0, page };
  } catch (err) {
    console.error("[produtos] erro:", err);
    return { categories: [], products: [], total: 0, page };
  }
}

function buildHref(
  params: Awaited<SearchParams>,
  overrides: Record<string, string | null>,
): string {
  const search = new URLSearchParams();
  const merged = { ...params, ...overrides };
  for (const [k, v] of Object.entries(merged)) {
    if (v) search.set(k, String(v));
  }
  const qs = search.toString();
  return `/produtos${qs ? `?${qs}` : ""}`;
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { categories, products, total, page } = await getData(params);

  const from = (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, total);
  const hasFilters = !!(params.categoria || params.q || params.linha);

  const linhaAtiva = params.linha || "todas";

  return (
    <>
      {/* SUB-HERO */}
      <section
        className="relative py-20 pt-28 overflow-hidden text-white"
        style={{
          background:
            "linear-gradient(135deg, #060f28 0%, #0a2060 50%, #051530 100%)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 80% at 80% 20%, rgba(30,99,233,.22), transparent 70%)",
          }}
        />
        <div className="tt-container relative z-10">
          <Reveal>
            <span
              className="eyebrow"
              style={{ color: "rgba(255,255,255,.6)" }}
            >
              CATÁLOGO COMPLETO
            </span>
            <h1 className="h-section text-white mt-3 mb-4">
              Ferramentas para quem{" "}
              <span className="grad-text">não pode parar</span>.
            </h1>
            <p className="text-lead" style={{ color: "rgba(255,255,255,.72)" }}>
              {total > 0
                ? `${total} produtos em estoque. Fabricadas e importadas para cada aplicação.`
                : "Catálogo completo de ferramentas industriais Trust Tools."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-container">
          {/* TABS: LINHA */}
          <div className="mb-8">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold tracking-[.15em] uppercase text-ink-3">
                Linha de produtos
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  {
                    key: "todas",
                    label: "Todas as linhas",
                    desc: "Fabricadas + Importadas",
                  },
                  {
                    key: "fabricadas",
                    label: "Ferramentas Fabricadas",
                    desc: "Produzidas no Brasil",
                  },
                  {
                    key: "importadas",
                    label: "Ferramentas Importadas",
                    desc: "Importação direta",
                  },
                ].map(({ key, label, desc }) => {
                  const active = linhaAtiva === key;
                  const href =
                    key === "todas"
                      ? buildHref(params, { linha: null, page: null })
                      : buildHref(params, {
                          linha: key,
                          page: null,
                        });
                  return (
                    <Link
                      key={key}
                      href={href}
                      className="flex flex-col px-5 py-3.5 rounded-[14px] border transition-all text-left"
                      style={
                        active
                          ? {
                              background: "var(--grad-primary)",
                              borderColor: "transparent",
                              color: "#fff",
                            }
                          : {
                              background: "#fff",
                              borderColor: "var(--color-line)",
                              color: "var(--color-ink-2)",
                            }
                      }
                    >
                      <span
                        className="text-sm font-semibold"
                        style={{ color: active ? "#fff" : "var(--color-ink)" }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-xs mt-0.5"
                        style={{
                          color: active
                            ? "rgba(255,255,255,.75)"
                            : "var(--color-ink-3)",
                        }}
                      >
                        {desc}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FILTROS: CATEGORIAS (pills) */}
          <div className="mb-8 overflow-x-auto">
            <p className="text-xs font-bold tracking-[.15em] uppercase text-ink-3 mb-3">
              Categoria
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link
                href={buildHref(params, { categoria: null, page: null })}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap"
                style={
                  !params.categoria
                    ? {
                        background: "var(--color-brand-500)",
                        borderColor: "transparent",
                        color: "#fff",
                      }
                    : {
                        background: "#fff",
                        borderColor: "var(--color-line)",
                        color: "var(--color-ink-2)",
                      }
                }
              >
                Todas
              </Link>
              {categories.map((cat) => {
                const active = params.categoria === cat.slug;
                return (
                  <Link
                    key={cat.slug}
                    href={buildHref(params, {
                      categoria: cat.slug,
                      page: null,
                    })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap"
                    style={
                      active
                        ? {
                            background: "var(--color-brand-500)",
                            borderColor: "transparent",
                            color: "#fff",
                          }
                        : {
                            background: "#fff",
                            borderColor: "var(--color-line)",
                            color: "var(--color-ink-2)",
                          }
                    }
                  >
                    {cat.name}
                    {cat.product_count > 0 && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={
                          active
                            ? {
                                background: "rgba(255,255,255,.25)",
                                color: "#fff",
                              }
                            : {
                                background: "var(--color-surface)",
                                color: "var(--color-ink-3)",
                              }
                        }
                      >
                        {cat.product_count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* TOOLBAR: count + sort + clear */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-line">
            <div className="text-sm text-ink-2">
              {total > 0 ? (
                <>
                  Mostrando{" "}
                  <strong className="text-ink">
                    {from}–{to}
                  </strong>{" "}
                  de <strong className="text-ink">{total}</strong> produtos
                  {params.linha === "fabricadas" && (
                    <span className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-100 text-green-700 uppercase tracking-wider">
                      Fabricadas
                    </span>
                  )}
                  {params.linha === "importadas" && (
                    <span className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 uppercase tracking-wider">
                      Importadas
                    </span>
                  )}
                </>
              ) : (
                "Nenhum produto encontrado"
              )}
            </div>
            <div className="flex items-center gap-3">
              {hasFilters && (
                <Link
                  href="/produtos"
                  className="text-sm text-ink-3 hover:text-ink transition-colors"
                >
                  Limpar filtros ×
                </Link>
              )}
              <SortSelect />
            </div>
          </div>

          {/* GRID DE PRODUTOS */}
          {products.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger">
              {products.map((p) => (
                <Reveal key={p.id}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}

          <Pagination
            total={total}
            page={page}
            perPage={PER_PAGE}
            buildHref={(p) =>
              buildHref(params, { page: p === 1 ? null : String(p) })
            }
          />
        </div>
      </section>

      {/* CTA FALE CONOSCO */}
      <section className="tt-section pt-0">
        <div className="tt-container">
          <div className="tt-card p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-display font-bold text-ink mb-1">
                Não encontrou o que precisa?
              </h3>
              <p className="text-ink-2 text-sm">
                Temos muito mais em estoque. Fale com a gente no WhatsApp.
              </p>
            </div>
            <a
              href={whatsappUrl(
                "Olá! Estou buscando um produto e não encontrei no catálogo.",
              )}
              target="_blank"
              rel="noopener"
              className="btn btn-primary shrink-0"
            >
              Falar com especialista
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductCard({ product }: { product: ProductWithImage }) {
  const diameter = (product.specs as any)?.["Diâmetro"];
  const origem = (product.specs as any)?.["Origem"];
  const isFabricada =
    origem === "Produzido no Brasil" || origem === "Nacional";
  const isImportada = origem === "Importado";

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
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        ) : (
          <div
            className="absolute inset-0 grid place-items-center text-white/80"
            style={{ background: "var(--grad-primary)" }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        {/* Badge linha */}
        {isFabricada && (
          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full bg-green-600 text-white shadow-sm">
            Fabricada
          </span>
        )}
        {isImportada && (
          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full bg-blue-600 text-white shadow-sm">
            Importada
          </span>
        )}
        {diameter && (
          <span className="absolute top-2 right-2 z-10 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full bg-brand-500 text-white shadow-sm">
            Ø {diameter}
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        {product.category && (
          <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider mb-1">
            {product.category.name}
          </span>
        )}
        <h3 className="text-sm font-semibold text-ink mb-1 leading-snug line-clamp-2">
          {product.name}
        </h3>
        {product.short_description && (
          <p className="text-xs text-ink-2 mb-3 flex-1 line-clamp-2">
            {product.short_description}
          </p>
        )}
        <span className="btn-link mt-auto text-xs">
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
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <h2 className="text-2xl mb-2">
        {hasFilters ? "Nenhum produto encontrado" : "Catálogo em construção"}
      </h2>
      <p className="text-ink-2 max-w-md mx-auto mb-6">
        {hasFilters
          ? "Tente ajustar os filtros ou fale com a gente pelo WhatsApp — temos muito mais em estoque."
          : "Em breve, todo nosso catálogo aqui. Enquanto isso, fale com a gente."}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/produtos" className="btn btn-ghost">
          Limpar filtros
        </Link>
        <a
          href={whatsappUrl("Olá! Estou buscando um produto.")}
          target="_blank"
          rel="noopener"
          className="btn btn-primary"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
