import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Check } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { linhas, getLinha } from "@/lib/linhas";
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
                <Link href="/catalogo" className="btn btn-ghost">Ver catálogo completo</Link>
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

      {/* Linha de produtos da categoria */}
      {(linha.productLine || linha.closing) && (
        <section
          className="tt-section pt-0"
          style={{ background: "linear-gradient(180deg, transparent 0%, var(--color-surface-soft) 100%)" }}
        >
          <div className="tt-container">
            {linha.productLine && (
              <Reveal className="max-w-3xl mx-auto">
                <div className="tt-card p-8 md:p-10 bg-white">
                  <h2 className="text-2xl mb-6">{linha.productLine.title}</h2>
                  <ul className="grid gap-4">
                    {linha.productLine.items.map((item) => (
                      <li key={item} className="flex gap-3.5 items-start">
                        <span
                          className="flex-shrink-0 grid h-7 w-7 place-items-center rounded-lg text-white shadow-[0_6px_14px_rgba(30,99,233,.35)]"
                          style={{ background: "var(--grad-primary)" }}
                        >
                          <Check size={16} strokeWidth={2.5} />
                        </span>
                        <span className="text-ink-2">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {linha.closing && (
              <Reveal className="max-w-3xl mx-auto mt-8 text-center">
                <p className="text-lead mx-auto">{linha.closing}</p>
              </Reveal>
            )}
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
