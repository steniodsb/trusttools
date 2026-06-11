import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { getLinha } from "@/lib/linhas";
import { whatsappUrl } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/server";
import type { Product, ProductImage } from "@/lib/database.types";

// Pure dynamic — busca produtos do banco com service_role (sem cookies)
export const dynamic = "force-dynamic";

const PREVIEW_LIMIT = 12;

type Params = Promise<{ slug: string }>;

type ProductWithImage = Product & { primary_image: ProductImage | null };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const linha = getLinha(slug);
  if (!linha) return { title: "Categoria não encontrada" };
  return {
    title: linha.name,
    description: linha.cardDescription,
  };
}

/** Busca a categoria do banco e seus produtos (preview + total). */
async function getCategoryProducts(categorySlug: string) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return { products: [] as ProductWithImage[], total: 0 };

    const supabase = createAdminClient();

    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();

    if (!cat) return { products: [] as ProductWithImage[], total: 0 };

    const { data, count } = await supabase
      .from("products")
      .select(`*, images:product_images(*)`, { count: "exact" })
      .eq("category_id", cat.id)
      .eq("active", true)
      .order("featured", { ascending: false })
      .order("display_order", { ascending: true })
      .order("name", { ascending: true })
      .range(0, PREVIEW_LIMIT - 1);

    const products: ProductWithImage[] = ((data as ProductWithImage[]) || []).map((p) => ({
      ...p,
      primary_image:
        (p as any).images?.find((i: ProductImage) => i.is_primary) ??
        (p as any).images?.[0] ??
        null,
    }));

    return { products, total: count || 0 };
  } catch {
    return { products: [] as ProductWithImage[], total: 0 };
  }
}

export default async function LinhaPage({ params }: { params: Params }) {
  const { slug } = await params;
  const linha = getLinha(slug);
  if (!linha) notFound();

  const { products, total } = await getCategoryProducts(linha.categorySlug);
  const waMsg = `Olá! Tenho interesse na linha de ${linha.name}. Pode me passar mais informações?`;

  return (
    <>
      {/* Breadcrumb */}
      <div
        className="pt-[100px] pb-6"
        style={{ background: "linear-gradient(180deg, #F4F7FB 0%, #EAF1FF 100%)" }}
      >
        <div className="tt-container">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-ink-3 flex-wrap">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/produtos" className="hover:text-brand-700">Produtos</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink-2">{linha.name}</span>
          </nav>
        </div>
      </div>

      {/* Título + descrição + imagem */}
      <section className="tt-section pt-10">
        <div className="tt-container">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal>
              <span className="eyebrow">Trust Tools</span>
              <h1 className="h-display text-[clamp(2rem,3vw+1rem,3.25rem)] mt-4">
                <span className="grad-text">{linha.name}</span>
              </h1>
              {linha.subtitle && (
                <p className="text-xl font-display font-semibold text-ink mt-3">{linha.subtitle}</p>
              )}
              <div className="text-lead mt-5 space-y-4">
                {linha.intro.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={whatsappUrl(waMsg)} target="_blank" rel="noopener" className="btn btn-primary">
                  Solicitar cotação <span className="arrow">→</span>
                </a>
                <Link href={`/catalogo?categoria=${linha.categorySlug}`} className="btn btn-ghost">
                  Ver no catálogo
                </Link>
              </div>
            </Reveal>

            <Reveal className="relative aspect-[4/3] rounded-[28px] overflow-hidden border border-line shadow-lg">
              <Image
                src={linha.image}
                alt={linha.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(180deg, transparent 55%, rgba(6,30,77,.4) 100%)" }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Catálogo de produtos da categoria */}
      <section
        className="tt-section pt-0"
        style={{ background: "linear-gradient(180deg, transparent 0%, var(--color-surface-soft) 100%)" }}
      >
        <div className="tt-container">
          <Reveal className="section-head">
            <span className="eyebrow">Produtos</span>
            <h2 className="h-section">
              Linha de <span className="grad-text">{linha.name}</span>
            </h2>
            {total > 0 && (
              <p className="text-lead">
                {total} {total === 1 ? "produto disponível" : "produtos disponíveis"} nesta categoria.
              </p>
            )}
          </Reveal>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger">
                {products.map((p) => (
                  <Reveal key={p.id}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
              </div>

              {total > products.length && (
                <div className="mt-10 text-center">
                  <Link href={`/catalogo?categoria=${linha.categorySlug}`} className="btn btn-primary btn-lg">
                    Ver todos os {total} produtos <span className="arrow">→</span>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 px-6 bg-white border border-line rounded-[20px] max-w-2xl mx-auto">
              <h3 className="text-2xl mb-2">Linha sob consulta</h3>
              <p className="text-ink-2 max-w-md mx-auto mb-6">
                Os produtos desta categoria são fornecidos sob consulta. Fale com a gente pelo
                WhatsApp e nossa equipe técnica indica a solução certa para a sua aplicação.
              </p>
              <a href={whatsappUrl(waMsg)} target="_blank" rel="noopener" className="btn btn-primary">
                Falar no WhatsApp <span className="arrow">→</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="tt-section pt-0">
        <div className="tt-container">
          <Reveal
            className="relative overflow-hidden rounded-[28px] text-white text-center shadow-lg p-12 md:p-16"
            style={{ background: "var(--grad-primary)" }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 20% 30%, rgba(255,255,255,.2), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,209,255,.4), transparent 50%)",
              }}
            />
            <div className="relative">
              <h2 className="h-section text-white mb-4">Precisa de uma solução em {linha.name.toLowerCase()}?</h2>
              <p className="text-white/85 max-w-xl mx-auto mb-7">
                Fale com nossa equipe técnica e receba a recomendação certa para a sua aplicação.
              </p>
              <a
                href={whatsappUrl(waMsg)}
                target="_blank"
                rel="noopener"
                className="btn btn-lg"
                style={{ background: "#fff", color: "var(--color-brand-700)" }}
              >
                Falar com a Trust Tools no WhatsApp
              </a>
            </div>
          </Reveal>
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
            sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw"
          />
        ) : (
          <div
            className="absolute inset-0 grid place-items-center text-white/80"
            style={{ background: "var(--grad-primary)" }}
          >
            Sem foto
          </div>
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
