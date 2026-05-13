import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { SubHero } from "@/components/site/sub-hero";
import { whatsappUrl, factoryPhoto } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça a Trust Tools, importadora de ferramentas industriais com mais de 12 anos abastecendo a indústria brasileira com prazo, estoque e suporte técnico real.",
};

const missao = [
  "Prover soluções inovadoras e de alta qualidade em ferramentas.",
  "Atender diversos segmentos com eficiência e confiabilidade.",
  "Focar na satisfação real do cliente em cada entrega.",
];

const visao = [
  "Ser referência principal em ferramentas no Brasil.",
  "Distinguir-se pela inovação e excelência no atendimento.",
  "Compromisso com o desenvolvimento sustentável do setor.",
];

const valores = [
  "Qualidade — produtos que excedem expectativas.",
  "Inovação — melhoria contínua e novas tecnologias.",
  "Sustentabilidade — respeito ambiental nas operações.",
  "Ética — transparência e integridade em todas as relações.",
  "Foco no cliente — priorizar necessidades e sucesso do cliente.",
];

function CheckIcon() {
  return (
    <span
      className="flex-shrink-0 grid h-7 w-7 place-items-center rounded-lg text-white shadow-[0_6px_14px_rgba(30,99,233,.35)]"
      style={{ background: "var(--grad-primary)" }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="16"
        height="16"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

export default function SobrePage() {
  return (
    <>
      <SubHero
        eyebrow="QUEM SOMOS"
        title={
          <>
            Importação séria pra indústria
            <br />
            que <span className="grad-text">não pode parar</span>.
          </>
        }
        description="Conheça a empresa, o time e os valores que fizeram da Trust Tools fornecedor de referência em ferramentas industriais no Sudeste."
      />

      {/* HISTÓRIA */}
      <section className="tt-section">
        <div className="tt-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <span className="eyebrow">NOSSA HISTÓRIA</span>
              <h2 className="h-section mt-4">
                Nascemos pra resolver um <span className="grad-text">gargalo brasileiro</span>.
              </h2>
              <div className="text-lead mt-6 space-y-4">
                <p>
                  A Trust Tools foi fundada em <strong className="text-ink">2021</strong>, quando dois empreendedores com mais de duas décadas de experiência em comércio internacional e ferramentas abrasivas decidiram criar uma abordagem de negócio inovadora.
                </p>
                <p>
                  A empresa opera uma <strong className="text-ink">matriz em Diadema-SP</strong> (região do ABCD Paulista) com amplo estoque de ferramentas prontas para uso, além de uma <strong className="text-ink">filial em Jundiaí-SP</strong> especializada no desenvolvimento e manutenção customizada de ferramentas diamantadas.
                </p>
                <p>
                  Atendemos construção pesada, refratários, beneficiamento de pedras, mineração e indústria geral — com o compromisso de{" "}
                  <strong className="text-ink">
                    estoque honesto, prazo cumprido e suporte técnico antes e depois da venda.
                  </strong>
                </p>
              </div>
            </Reveal>

            <Reveal className="relative aspect-[4/3] rounded-[28px] overflow-hidden border border-line shadow-lg">
              <Image
                src={factoryPhoto(2)}
                alt="Fábrica Trust Tools em Jundiaí"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(6,30,77,.45) 100%), linear-gradient(135deg, rgba(10,58,140,.18) 0%, transparent 60%)",
                }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* MVV */}
      <section
        className="tt-section"
        style={{ background: "linear-gradient(180deg, transparent 0%, var(--color-surface-soft) 100%)" }}
      >
        <div className="tt-container">
          <Reveal className="section-head text-center">
            <span className="eyebrow">MISSÃO • VISÃO • VALORES</span>
            <h2 className="h-section">
              O que <span className="grad-text">guia</span> nossa operação.
            </h2>
            <p className="text-lead">
              Princípios curtos, decisão rápida — e o time inteiro alinhado no mesmo padrão.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 stagger">
            {[
              { title: "Missão", items: missao },
              { title: "Visão", items: visao },
              { title: "Valores", items: valores },
            ].map((card) => (
              <Reveal key={card.title}>
                <div className="tt-card p-8 h-full flex flex-col">
                  <h3 className="text-2xl mb-5">{card.title}</h3>
                  <ul className="grid gap-3.5 flex-1">
                    {card.items.map((item) => (
                      <li key={item} className="flex gap-3.5 items-start">
                        <CheckIcon />
                        <span className="text-ink-2">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
              <h2 className="h-section text-white mb-4">Quer conhecer a operação de perto?</h2>
              <p className="text-white/85 max-w-xl mx-auto mb-7">
                Agende uma visita aos nossos centros de distribuição em Diadema ou Jundiaí.
              </p>
              <div className="flex flex-wrap gap-3.5 justify-center">
                <Link
                  href="/contato"
                  className="btn btn-lg"
                  style={{ background: "#fff", color: "var(--color-brand-700)" }}
                >
                  Agendar visita <span className="arrow">→</span>
                </Link>
                <a
                  href={whatsappUrl("Olá! Quero conhecer a Trust Tools.")}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-lg btn-ghost"
                  style={{ borderColor: "rgba(255,255,255,.5)", color: "#fff" }}
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
