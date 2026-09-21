import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { ClientLogos } from "@/components/site/client-logos";
import { whatsappUrl } from "@/lib/utils";
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
