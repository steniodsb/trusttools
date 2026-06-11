import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { ClientLogos } from "@/components/site/client-logos";
import { whatsappUrl, factoryPhoto } from "@/lib/utils";
import { linhas } from "@/lib/linhas";

export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      {/* HERO — carrossel com 3 slides */}
      <HeroCarousel />

      {/* CLIENTES — carrossel contínuo full-width */}
      <ClientLogos />

      {/* NOSSAS CATEGORIAS */}
      <section className="tt-section" id="produtos">
        <div className="tt-container">
          <Reveal className="section-head">
            <span className="eyebrow">NOSSAS CATEGORIAS</span>
            <h2 className="h-section">
              Ferramentas para cada <span className="grad-text">segmento industrial</span>.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {linhas.map((cat) => (
              <Reveal key={cat.slug}>
                <Link
                  href={`/linhas/${cat.slug}`}
                  className="tt-card group overflow-hidden flex flex-col h-full"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(180deg, rgba(11,27,51,0) 40%, rgba(11,27,51,.35) 100%)" }}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl mb-1.5">{cat.name}</h3>
                    <p className="text-sm text-ink-2 mb-4 flex-1 line-clamp-3">{cat.cardDescription}</p>
                    <span className="btn-link mt-auto">
                      Saiba mais <span className="arrow">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ESPECIALIDADE: LAJES ALVEOLARES PROTENDIDAS */}
      <section className="tt-section pt-0">
        <div className="tt-container">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
            <Reveal className="relative aspect-[4/3] lg:aspect-[5/6] rounded-[28px] overflow-hidden border border-line shadow-lg order-2 lg:order-1">
              <Image
                src={factoryPhoto(7)}
                alt="Disco diamantado de grande porte para corte de lajes alveolares protendidas"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(6,30,77,.55) 100%)" }} />
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <span className="inline-block px-3 py-1.5 rounded-full bg-accent/95 text-brand-900 text-xs font-bold tracking-wider uppercase">
                  Especialidade Trust Tools
                </span>
              </div>
            </Reveal>

            <Reveal className="order-1 lg:order-2">
              <span className="eyebrow">CORTE PESADO</span>
              <h2 className="h-section mt-4">
                <span className="grad-text">Lajes alveolares protendidas</span> — onde a Trust Tools é referência.
              </h2>
              <p className="text-lead mt-5">
                Discos diamantados de grande diâmetro (<strong className="text-ink">600mm a 1200mm</strong>) projetados pra cortar lajes alveolares protendidas, vigas e pilares de concreto pré-fabricado com precisão e durabilidade.
              </p>

              <div className="mt-7 grid gap-4">
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 grid h-11 w-11 place-items-center rounded-xl text-white font-display font-bold" style={{ background: "var(--grad-primary)" }}>1</span>
                  <div>
                    <h3 className="text-base text-ink mb-1">Linha completa TR-760</h3>
                    <p className="text-sm text-ink-2 m-0">Disco de corte Ø600 a 1200mm para concreto curado, alta durabilidade e baixo custo por metro cortado.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 grid h-11 w-11 place-items-center rounded-xl text-white font-display font-bold" style={{ background: "var(--grad-primary)" }}>2</span>
                  <div>
                    <h3 className="text-base text-ink mb-1">Repastilhamento de segmentos</h3>
                    <p className="text-sm text-ink-2 m-0">Devolve a vida útil do disco com até <strong className="text-ink">40% de economia</strong> versus comprar novo. Lead-time curto, devolução do mesmo casco.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 grid h-11 w-11 place-items-center rounded-xl text-white font-display font-bold" style={{ background: "var(--grad-primary)" }}>3</span>
                  <div>
                    <h3 className="text-base text-ink mb-1">Atendimento técnico de fábrica</h3>
                    <p className="text-sm text-ink-2 m-0">Recomendação por tipo de concreto, máquina e produtividade desejada — direto de quem fabrica.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/catalogo?categoria=lajes-alveolares-protendidas" className="btn btn-primary">
                  Ver linha completa <span className="arrow">→</span>
                </Link>
                <a href={whatsappUrl("Olá! Tenho interesse em discos pra lajes alveolares protendidas.")} target="_blank" rel="noopener" className="btn btn-ghost">
                  Falar com especialista
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="tt-section pt-0">
        <div className="tt-container">
          <Reveal
            className="relative overflow-hidden rounded-[28px] text-white text-center shadow-lg p-12 md:p-16"
            style={{ background: "var(--grad-primary)" }}
          >
            <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(circle at 20% 30%, rgba(255,255,255,.2), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,209,255,.4), transparent 50%)" }} />
            <div className="relative">
              <h2 className="h-section text-white mb-4">Resolva seu fornecimento de ferramenta de uma vez por todas.</h2>
              <p className="text-white/85 max-w-xl mx-auto mb-7">
                Cotação em até 4h úteis. Sem compromisso, sem cadastro chato.
              </p>
              <a
                href={whatsappUrl("Olá! Gostaria de fazer uma cotação.")}
                target="_blank"
                rel="noopener"
                className="btn btn-lg"
                style={{ background: "#fff", color: "var(--color-brand-700)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 3.5C18.3 1.2 15.3 0 12.1 0 5.5 0 .1 5.4.1 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.4 5.7 1.4 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.4-8.3zm-8.4 18.4c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.6-1.5-3.4-1.5-5.3 0-5.5 4.5-9.9 9.9-9.9 2.7 0 5.1 1 7 2.9s2.9 4.4 2.9 7c0 5.5-4.4 9.9-9.9 9.9z" />
                </svg>
                Falar com a Trust Tools no WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
