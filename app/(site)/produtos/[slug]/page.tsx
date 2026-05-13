import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { whatsappUrl, siteConfig } from "@/lib/utils";
import { ProductGallery } from "@/components/site/product-gallery";
import { Reveal } from "@/components/site/reveal";
import type { Category, Product, ProductImage } from "@/lib/database.types";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

type FullProduct = Product & {
  category: Category | null;
  images: ProductImage[];
};

async function getProduct(slug: string): Promise<FullProduct | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(`*, category:categories(*), images:product_images(*)`)
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();
    if (!data) return null;
    return {
      ...data,
      images: (data.images || []).sort(
        (a: ProductImage, b: ProductImage) =>
          Number(b.is_primary) - Number(a.is_primary) || a.display_order - b.display_order,
      ),
    } as FullProduct;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produto não encontrado" };

  const desc =
    product.short_description ||
    product.long_description?.slice(0, 160) ||
    siteConfig.description;
  const primary = product.images.find((i) => i.is_primary) ?? product.images[0];

  return {
    title: product.name,
    description: desc,
    openGraph: {
      title: product.name,
      description: desc,
      type: "website",
      images: primary ? [{ url: primary.url, alt: primary.alt || product.name }] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("slug")
      .eq("active", true);
    return (data || []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const waMsg = `Olá! Tenho interesse no produto "${product.name}". Pode me passar mais informações?`;
  const specsEntries = Object.entries(product.specs || {});

  return (
    <>
      {/* Breadcrumb + sub header */}
      <div className="pt-[100px] pb-6 bg-bg" style={{ background: "linear-gradient(180deg, #F4F7FB 0%, #EAF1FF 100%)" }}>
        <div className="tt-container">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-ink-3 mb-2">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/produtos" className="hover:text-brand-700">Produtos</Link>
            {product.category && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link
                  href={`/produtos?categoria=${product.category.slug}`}
                  className="hover:text-brand-700"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink-2 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="tt-section pt-8">
        <div className="tt-container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <Reveal>
              <ProductGallery images={product.images} alt={product.name} />
            </Reveal>

            <Reveal>
              {product.category && (
                <span className="eyebrow mb-4">{product.category.name}</span>
              )}
              <h1 className="h-display text-[clamp(1.75rem,2.6vw+1rem,3rem)] mt-4 mb-4">
                {product.name}
              </h1>

              {product.brand && (
                <div className="mb-5">
                  <span className="text-sm font-semibold text-ink-3 uppercase tracking-wider">
                    Marca: <span className="text-ink-2">{product.brand}</span>
                  </span>
                </div>
              )}

              {product.short_description && (
                <p className="text-lead mb-6">{product.short_description}</p>
              )}

              <div className="flex flex-wrap gap-3 mb-8">
                <a
                  href={whatsappUrl(waMsg)}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-whatsapp"
                >
                  <MessageCircle className="h-5 w-5" />
                  Solicitar cotação
                </a>
                <Link href="/contato" className="btn btn-ghost">
                  Falar com vendedor
                </Link>
              </div>

              {product.applications.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-base mb-3">Aplicações</h3>
                  <ul className="grid gap-2.5">
                    {product.applications.map((app, i) => (
                      <li key={i} className="flex gap-3 items-start text-sm text-ink-2">
                        <span
                          className="flex-shrink-0 mt-1 h-4 w-4 rounded-full"
                          style={{ background: "var(--grad-primary)" }}
                        />
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {specsEntries.length > 0 && (
                <div>
                  <h3 className="text-base mb-3">Especificações técnicas</h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {specsEntries.map(([key, val]) => (
                      <div
                        key={key}
                        className="bg-white border border-line rounded-md px-4 py-3"
                      >
                        <dt className="text-xs font-semibold uppercase tracking-wider text-ink-3">
                          {key}
                        </dt>
                        <dd className="text-sm text-ink mt-0.5">{val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </Reveal>
          </div>

          {product.long_description && (
            <Reveal className="mt-16 max-w-3xl">
              <h2 className="h-section mb-6 text-[clamp(1.5rem,2vw+.6rem,2rem)]">
                Sobre o produto
              </h2>
              <div className="prose prose-tt max-w-none text-ink-2 whitespace-pre-line leading-relaxed">
                {product.long_description}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.short_description || product.long_description,
            image: product.images.map((i) => i.url),
            brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
            category: product.category?.name,
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              priceCurrency: "BRL",
              seller: {
                "@type": "Organization",
                name: siteConfig.name,
              },
            },
          }),
        }}
      />
    </>
  );
}
