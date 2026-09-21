import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, FileText, Clock } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { getLinha, linhas, type Linha, type Subcategoria } from "@/lib/linhas";
import { whatsappUrl } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return linhas.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const linha = getLinha(slug);
  if (!linha) return { title: "Categoria não encontrada" };
  return {
    title: linha.name,
    description: linha.cardDescription,
  };
}

export default async function LinhaPage({ params }: { params: Params }) {
  const { slug } = await params;
  const linha = getLinha(slug);
  if (!linha) notFound();

  const waMsg = `Olá! Tenho interesse na linha de ${linha.name}. Pode me passar mais informações?`;
  const sectionTitle = linha.subcategoriasTitle ?? "Catálogos";
  const hasAnyPdf = linha.subcategorias.some((s) => s.pdf);

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
                <a href="#catalogos" className="btn btn-ghost">
                  {hasAnyPdf ? "Ver catálogos" : `Ver ${sectionTitle.toLowerCase()}`}
                </a>
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

      {/* Subcategorias → catálogos em PDF */}
      <section
        id="catalogos"
        className="tt-section pt-0 scroll-mt-24"
        style={{ background: "linear-gradient(180deg, transparent 0%, var(--color-surface-soft) 100%)" }}
      >
        <div className="tt-container">
          <Reveal className="section-head">
            <span className="eyebrow">{sectionTitle}</span>
            <h2 className="h-section">
              Linha de <span className="grad-text">{linha.name}</span>
            </h2>
            <p className="text-lead">
              {hasAnyPdf
                ? "Clique em uma categoria para abrir o catálogo com todas as especificações."
                : "Fale com a nossa equipe técnica para receber as especificações desta linha."}
            </p>
          </Reveal>

          <div
            className={`grid gap-6 stagger ${
              linha.subcategorias.length === 1
                ? "max-w-xl mx-auto"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {linha.subcategorias.map((sub) => (
              <Reveal key={sub.slug}>
                <SubcategoriaCard sub={sub} linha={linha} />
              </Reveal>
            ))}
          </div>
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

function SubcategoriaCard({ sub, linha }: { sub: Subcategoria; linha: Linha }) {
  const waMsg = `Olá! Gostaria de informações sobre ${sub.name} (linha ${linha.name}).`;

  const media = (
    <div className="relative aspect-[16/10] bg-surface-soft">
      {sub.image ? (
        <Image
          src={sub.image}
          alt={sub.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center text-white/85"
          style={{ background: "var(--grad-primary)" }}
        >
          <FileText size={44} strokeWidth={1.4} />
        </div>
      )}
      <span
        className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full shadow-sm ${
          sub.pdf ? "bg-brand-500 text-white" : "bg-white/90 text-ink-2"
        }`}
      >
        {sub.pdf ? (
          <>
            <FileText size={11} /> Catálogo PDF
          </>
        ) : (
          <>
            <Clock size={11} /> Catálogo em breve
          </>
        )}
      </span>
    </div>
  );

  const body = (
    <div className="p-6 flex-1 flex flex-col">
      <h3 className="text-xl mb-1.5">{sub.name}</h3>
      {sub.description && (
        <p className="text-sm text-ink-2 mb-4 flex-1 line-clamp-3">{sub.description}</p>
      )}
      {sub.pdf ? (
        <span className="btn-link mt-auto">
          Ver catálogo <span className="arrow">→</span>
        </span>
      ) : (
        <a
          href={whatsappUrl(waMsg)}
          target="_blank"
          rel="noopener"
          className="btn-link mt-auto"
        >
          Solicitar informações <span className="arrow">→</span>
        </a>
      )}
    </div>
  );

  if (sub.pdf) {
    return (
      <a
        href={sub.pdf}
        target="_blank"
        rel="noopener"
        className="tt-card group overflow-hidden flex flex-col h-full"
        aria-label={`Abrir catálogo em PDF: ${sub.name}`}
      >
        {media}
        {body}
      </a>
    );
  }

  return (
    <div className="tt-card group overflow-hidden flex flex-col h-full">
      {media}
      {body}
    </div>
  );
}
