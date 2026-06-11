import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { Counter } from "@/components/site/counter";
import { TrustHero } from "@/components/site/trust-hero";
import { siteConfig, whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Trust Tools",
  description:
    "A Trust Tools nasceu em 2021 para oferecer um modelo inovador em ferramentas, com matriz em Diadema-SP e filial em Jundiaí-SP especializada em ferramentas diamantadas.",
};

const valores: Array<[string, string]> = [
  ["Qualidade", "Compromisso com produtos e serviços que superem as expectativas dos clientes."],
  ["Inovação", "Busca constante por melhorias e novas tecnologias que agreguem valor ao mercado."],
  ["Sustentabilidade", "Respeito ao meio ambiente em todas as etapas do nosso negócio."],
  ["Ética", "Transparência e integridade em todas as relações."],
  ["Foco no Cliente", "Priorizar as necessidades e o sucesso dos nossos clientes em tudo o que fazemos."],
];

const stats: Array<{ target: number; prefix?: string; suffix?: string; label: string }> = [
  { target: 12, prefix: "+", suffix: " anos", label: "abastecendo a indústria" },
  { target: 5000, prefix: "+", label: "SKUs em estoque pronto" },
  { target: 2, suffix: " CDs", label: "centros de distribuição em SP" },
  { target: 48, suffix: "h", label: "entrega média no Sudeste" },
];

const channels = [
  {
    icon: MessageCircle,
    title: "WhatsApp comercial",
    value: siteConfig.whatsappDisplay,
    href: whatsappUrl("Olá! Quero conhecer a Trust Tools."),
    external: true,
  },
  {
    icon: Phone,
    title: "Telefone",
    value: siteConfig.phone,
    href: "tel:+551126682051",
  },
  {
    icon: Mail,
    title: "E-mail",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
];

export default function SobrePage() {
  return (
    <>
      <TrustHero />

      {/* NOSSA HISTÓRIA — 2 containers (texto + foto) */}
      <section className="tt-section">
        <div className="tt-container">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-start">
            <Reveal>
              <span className="eyebrow">QUEM SOMOS</span>
              <h2 className="h-section mt-4">
                Nossa <span className="grad-text">história</span>
              </h2>

              <div className="text-lead mt-6 space-y-4">
                <p>
                  A Trust Tools nasceu em <strong className="text-ink">2021</strong>, em um
                  momento de transformação, quando dois amigos decidiram unir suas mais de duas
                  décadas de experiência em comércio exterior e ferramentas abrasivas para criar
                  uma nova abordagem de negócios.
                </p>
                <p>
                  Nosso objetivo é oferecer um modelo de trabalho inovador, sempre alinhado às
                  demandas do mercado, com foco em qualidade e eficiência.
                </p>
                <p>
                  Com nossa matriz estrategicamente localizada em <strong className="text-ink">Diadema–SP</strong>,
                  na região do ABCD Paulista, próximo à Mercedes-Benz, temos um amplo estoque de
                  ferramentas prontas para uso imediato, garantindo agilidade no atendimento.
                </p>
                <p>
                  Já nossa filial, situada em <strong className="text-ink">Jundiaí–SP</strong>, no
                  bairro Santa Gertrudes, é onde desenvolvemos e aprimoramos ferramentas
                  diamantadas, com fabricação e manutenção sob medida para entregar performance e
                  qualidade excepcionais. Na Trust Tools, estamos comprometidos em transformar
                  desafios em soluções de alta precisão.
                </p>
              </div>

              {/* Missão / Visão / Valores */}
              <div className="mt-8 grid gap-5">
                <div className="tt-card p-6">
                  <h3 className="text-lg mb-1.5">Missão</h3>
                  <p className="text-sm text-ink-2 m-0">
                    Prover soluções inovadoras e de alta qualidade em ferramentas para diversos
                    segmentos, atendendo às necessidades do mercado com eficiência, confiabilidade e
                    foco na satisfação dos nossos clientes.
                  </p>
                </div>
                <div className="tt-card p-6">
                  <h3 className="text-lg mb-1.5">Visão</h3>
                  <p className="text-sm text-ink-2 m-0">
                    Ser reconhecida como referência em ferramentas no Brasil, destacando-se pela
                    inovação, excelência no atendimento e compromisso com o desenvolvimento
                    sustentável dos setores que atendemos.
                  </p>
                </div>
                <div className="tt-card p-6">
                  <h3 className="text-lg mb-3">Valores</h3>
                  <ul className="grid gap-2.5">
                    {valores.map(([title, desc]) => (
                      <li key={title} className="flex gap-3 items-start text-sm">
                        <span
                          className="flex-shrink-0 mt-1 h-3.5 w-3.5 rounded-full"
                          style={{ background: "var(--grad-primary)" }}
                        />
                        <span className="text-ink-2">
                          <strong className="text-ink">{title}:</strong> {desc}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* Foto (sticky no desktop) */}
            <Reveal className="lg:sticky lg:top-[100px]">
              <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden border border-line shadow-lg">
                <Image
                  src="/trust-fachada.avif"
                  alt="Fachada da Trust Tools"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 55%, rgba(6,30,77,.5) 100%)",
                  }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* NÚMEROS */}
      <section
        className="tt-section pt-0"
        style={{ background: "linear-gradient(180deg, transparent 0%, var(--color-surface-soft) 100%)" }}
      >
        <div className="tt-container">
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-4 p-7 border border-line rounded-[28px] bg-white shadow-sm">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-2">
                <div
                  className="font-display font-bold leading-none grad-text"
                  style={{ fontSize: "clamp(1.5rem, 2.2vw + .8rem, 2.4rem)", letterSpacing: "-.02em" }}
                >
                  <Counter target={s.target} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="text-[13px] text-ink-3 mt-2">{s.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CONTATO */}
      <section className="tt-section pt-0">
        <div className="tt-container">
          <Reveal className="section-head">
            <span className="eyebrow">FALE CONOSCO</span>
            <h2 className="h-section">
              Vamos <span className="grad-text">conversar</span>?
            </h2>
            <p className="text-lead">
              Atendimento técnico de verdade, estoque físico em São Paulo e cotação em até 4h úteis.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4 stagger">
            {channels.map((ch) => {
              const Icon = ch.icon;
              return (
                <Reveal key={ch.title}>
                  <a
                    href={ch.href}
                    target={ch.external ? "_blank" : undefined}
                    rel={ch.external ? "noopener" : undefined}
                    className="tt-card p-5 flex items-center gap-4 h-full"
                  >
                    <span
                      className="flex-shrink-0 grid h-11 w-11 place-items-center rounded-xl text-white shadow-[0_6px_14px_rgba(30,99,233,.35)]"
                      style={{ background: "var(--grad-primary)" }}
                    >
                      <Icon size={20} />
                    </span>
                    <div>
                      <h4 className="text-base font-semibold text-ink">{ch.title}</h4>
                      <p className="text-ink-2 font-medium m-0">{ch.value}</p>
                    </div>
                  </a>
                </Reveal>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6 stagger">
            {siteConfig.addresses.map((addr) => {
              const mapsQuery = encodeURIComponent(`${addr.street} ${addr.city}`);
              return (
                <Reveal key={addr.city}>
                  <article className="tt-card p-7 h-full flex flex-col">
                    <span
                      className="self-start text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full text-white mb-4"
                      style={{ background: "var(--grad-primary)" }}
                    >
                      {addr.tag}
                    </span>
                    <h3 className="text-xl mb-3 flex items-center gap-2">
                      <MapPin size={18} className="text-brand-500" />
                      {addr.city}
                    </h3>
                    <div className="text-ink-2 space-y-1 mb-4 flex-1 text-sm">
                      <p>{addr.street}</p>
                      <p>{addr.cep}</p>
                      {addr.phone && <p className="font-medium text-ink mt-2">{addr.phone}</p>}
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                      target="_blank"
                      rel="noopener"
                      className="btn-link mt-auto"
                    >
                      Ver no mapa <span className="arrow">→</span>
                    </a>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link href="/contato" className="btn btn-primary btn-lg">
              Ir para a página de contato <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
