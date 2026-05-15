import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { whatsappUrl } from "@/lib/utils";
import { Reveal } from "@/components/site/reveal";

type Props = { params: Promise<{ slug: string }> };

const fallbackCategories = [
  {
    slug: "construcao-civil",
    name: "Construção Civil",
    description:
      "Discos diamantados, brocas, serras, bits, fixadores e ferramentas elétricas para construtoras e prestadores de serviço que não podem parar.",
    image_url: "/cat-construcao.jpg",
  },
  {
    slug: "refratarios",
    name: "Refratários",
    description:
      "Brocas, fresas e abrasivos especiais desenvolvidos para suportar as condições extremas de indústrias siderúrgicas, cimenteiras e cerâmicas.",
    image_url: "/cat-refratarios.jpg",
  },
  {
    slug: "pedras-marmore",
    name: "Pedras & Mármore",
    description:
      "Discos, fresas, frankfurts, polidores e abrasivos para marmorarias, graniteiras e beneficiamento de pedras ornamentais.",
    image_url: "/cat-pedras.jpg",
  },
  {
    slug: "segmentos-diamantados",
    name: "Segmentos Diamantados",
    description:
      "Linha completa de segmentos para fios diamantados, serras de fita e discos de grande porte. Recapagem disponível.",
    image_url: "/cat-segmentos.jpg",
  },
  {
    slug: "ferramentaria-geral",
    name: "Ferramentaria Geral",
    description:
      "Alicates, chaves, bits, soquetes, fita isolante, abraçadeiras, lâminas e ferramentas de uso geral para manutenção e obra.",
    image_url: "/cat-diversos.jpg",
  },
  {
    slug: "recapagem",
    name: "Recapagem & Serviços",
    description:
      "Serviço de recapagem de segmentos diamantados e reaproveitamento de ferramentas. Até 40% de economia em relação ao produto novo.",
    image_url: "/cat-recapagem.jpg",
  },
];

async function getCategory(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();
    return data;
  } catch {
    return null;
  }
}

async function getFeaturedProducts(categoryId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("category_id", categoryId)
      .eq("active", true)
      .order("featured", { ascending: false })
      .order("display_order", { ascending: true })
      .limit(3);
    return (data || []).map((p: any) => ({
      ...p,
      primary_image:
        p.images?.find((i: any) => i.is_primary) ?? p.images?.[0] ?? null,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat =
    (await getCategory(slug)) ?? fallbackCategories.find((c) => c.slug === slug);
  if (!cat) return { title: "Categoria" };
  return {
    title: `${cat.name} — Trust Tools`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  let category: any = await getCategory(slug);
  if (!category) {
    category = fallbackCategories.find((c) => c.slug === slug);
  }
  if (!category) notFound();

  const products = category.id ? await getFeaturedProducts(category.id) : [];

  return (
    <>
      {/* HERO DA CATEGORIA */}
      <section className="relative overflow-hidden" style={{ minHeight: "60vh" }}>
        <div className="absolute inset-0">
          {category.image_url && (
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,15,40,.35) 0%, rgba(5,15,40,.82) 70%)",
            }}
          />
        </div>

        <div className="relative z-10 tt-container flex flex-col justify-end pb-16 pt-36">
          <Reveal>
            <span className="eyebrow" style={{ color: "rgba(255,255,255,.65)" }}>
              CATEGORIA
            </span>
            <h1 className="h-display text-white mt-3 mb-4">{category.name}</h1>
            <p
              className="text-lead max-w-2xl"
              style={{ color: "rgba(255,255,255,.78)" }}
            >
              {category.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* BREADCRUMB + CTA PRINCIPAL */}
      <section className="py-10 border-b border-line bg-white">
        <div className="tt-container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <nav className="text-sm text-ink-3 flex items-center gap-2">
              <Link href="/" className="hover:text-brand-500 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-ink">{category.name}</span>
            </nav>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/produtos?categoria=${category.slug}`}
                className="btn btn-primary"
              >
                Ver todos os produtos <span className="arrow">→</span>
              </Link>
              <a
                href={whatsappUrl(
                  `Olá! Tenho interesse em produtos da categoria ${category.name}.`,
                )}
                target="_blank"
                rel="noopener"
                className="btn btn-ghost"
              >
                Falar com especialista
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      {products.length > 0 && (
        <section className="tt-section">
          <div className="tt-container">
            <Reveal className="section-head">
              <span className="eyebrow">PRODUTOS EM DESTAQUE</span>
              <h2 className="h-section">
                Os mais pedidos em{" "}
                <span className="grad-text">{category.name}</span>.
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p: any) => (
                <Reveal key={p.id}>
                  <Link
                    href={`/produtos/${p.slug}`}
                    className="tt-card overflow-hidden flex flex-col h-full group"
                  >
                    <div className="relative aspect-square bg-white">
                      {p.primary_image ? (
                        <Image
                          src={p.primary_image.url}
                          alt={p.primary_image.alt || p.name}
                          fill
                          className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, 50vw"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 grid place-items-center text-white/80"
                          style={{ background: "var(--grad-primary)" }}
                        >
                          <svg
                            width="40"
                            height="40"
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
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-base font-semibold text-ink mb-1.5 leading-snug line-clamp-2">
                        {p.name}
                      </h3>
                      {p.short_description && (
                        <p className="text-sm text-ink-2 mb-4 flex-1 line-clamp-2">
                          {p.short_description}
                        </p>
                      )}
                      <span className="btn-link mt-auto text-sm">
                        Ver detalhes <span className="arrow">→</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-10 text-center">
              <Link
                href={`/produtos?categoria=${category.slug}`}
                className="btn btn-primary btn-lg"
              >
                Ver todos os produtos de {category.name}{" "}
                <span className="arrow">→</span>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="tt-section pt-0">
        <div className="tt-container">
          <Reveal
            className="relative overflow-hidden rounded-[28px] text-white text-center shadow-lg p-12 md:p-16"
            style={{ background: "var(--grad-primary)" }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 20% 30%, rgba(255,255,255,.18), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,209,255,.35), transparent 50%)",
              }}
            />
            <div className="relative">
              <h2 className="h-section text-white mb-4">
                Precisa de {category.name}?
              </h2>
              <p className="text-white/85 max-w-xl mx-auto mb-8">
                Fale com nosso time técnico. Indicamos o produto certo para cada
                aplicação, com entrega rápida de SP para todo o Brasil.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href={whatsappUrl(
                    `Olá! Preciso de produtos para ${category.name}.`,
                  )}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-lg"
                  style={{ background: "#fff", color: "var(--color-brand-700)" }}
                >
                  Falar no WhatsApp
                </a>
                <Link
                  href={`/produtos?categoria=${category.slug}`}
                  className="btn btn-lg"
                  style={{
                    background: "rgba(255,255,255,.15)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,.3)",
                  }}
                >
                  Ver catálogo
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
