import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { Counter } from "@/components/site/counter";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { createClient } from "@/lib/supabase/server";
import { siteConfig, whatsappUrl } from "@/lib/utils";
import type { Category } from "@/lib/database.types";

export const revalidate = 300;

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");
    return data || [];
  } catch {
    return [];
  }
}

const fallbackCategories = [
  {
    slug: "construcao-civil",
    name: "Construção Civil",
    description:
      "Discos diamantados, brocas, serras, fixadores e ferramenta elétrica para construtoras que tocam obra pesada.",
    image_url: "/cat-construcao.jpg",
  },
  {
    slug: "refratarios",
    name: "Refratários",
    description:
      "Brocas, fresas e abrasivos especiais para indústrias siderúrgicas, cimenteiras e cerâmicas.",
    image_url: "/cat-refratarios.jpg",
  },
  {
    slug: "pedras-marmore",
    name: "Pedras & Mármore",
    description:
      "Discos, fresas, frankfurts, polidores e abrasivos para marmorarias e beneficiamento.",
    image_url: "/cat-pedras.jpg",
  },
  {
    slug: "segmentos-diamantados",
    name: "Segmentos Diamantados",
    description:
      "Linha completa de segmentos para fios, serras e discos de grande porte.",
    image_url: "/cat-segmentos.jpg",
  },
  {
    slug: "ferramentaria-geral",
    name: "Ferramentaria Geral",
    description: "EPIs, manuais, medição, fixação, abrasivos convencionais.",
    image_url: "/cat-diversos.jpg",
  },
  {
    slug: "recapagem",
    name: "Recapagem & Serviços",
    description:
      "Recapagem de segmentos diamantados e reaproveitamento de ferramentas.",
    image_url: "/cat-recapagem.jpg",
  },
];

const clientLogos = [
  { src: "/logo-estivar.png", alt: "Estivar" },
  { src: "/logo-gran.png", alt: "Gran Construções" },
  { src: "/logo-bpm.png", alt: "BPM" },
  { src: "/logo-leonardi.png", alt: "Leonardi" },
  { src: "/logo-ta.png", alt: "TA" },
];

const stats = [
  { target: 12, prefix: "+", suffix: " anos", label: "abastecendo a indústria" },
  { target: 5000, prefix: "+", suffix: "", label: "SKUs em estoque pronto" },
  { target: 2, prefix: "", suffix: " CDs", label: "centros de distribuição em SP" },
  { target: 48, prefix: "", suffix: "h", label: "entrega média no Sudeste" },
];

export default async function HomePage() {
  const dbCategories = await getCategories();
  const categories = dbCategories.length > 0 ? dbCategories : fallbackCategories;

  return (
    <>
      {/* 1. HERO CARROSSEL */}
      <HeroCarousel />

      {/* 2. EMPRESAS QUE CONFIAM */}
      <section className="py-12 bg-white border-b border-line">
        <div className="tt-container">
          <p className="text-center text-[11px] font-bold tracking-[.18em] uppercase text-ink-3 mb-8">
            Empresas que confiam na Trust Tools
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {clientLogos.map((logo) => (
              <div
                key={logo.alt}
                className="relative h-10 w-28 grayscale opacity-55 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              >
                <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. QUEM SOMOS */}
      <section className="tt-section">
        <div className="tt-container">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <Reveal>
              <span className="eyebrow">QUEM SOMOS</span>
              <h2 className="h-section mt-4">
                O elo entre a <span className="grad-text">fábrica e o seu canteiro</span>.
              </h2>
              <p className="text-lead mt-5">
                Somos uma importadora e distribuidora de ferramentas industriais nascida para
                resolver um problema simples: o Brasil precisa de produto importado de
                qualidade, disponível agora, com quem saiba indicar a aplicação correta.
              </p>
              <p className="text-ink-2 mt-4">
                Atuamos com importação direta, estoque físico em Diadema e Jundiaí, equipe
                técnica especializada e garantia formal em todos os produtos.
              </p>
              <div className="mt-8">
                <Link href="/sobre" className="btn btn-primary btn-lg">
                  Conheça nossa história <span className="arrow">→</span>
                </Link>
              </div>
            </Reveal>

            <Reveal className="relative aspect-[4/3] rounded-[28px] overflow-hidden border border-line shadow-lg">
              <Image
                src="/hero-sobre.jpg"
                alt="Trust Tools — equipe e instalações"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(6,30,77,.4) 100%)",
                }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. FAIXA DE NÚMEROS */}
      <section
        className="py-16 text-white"
        style={{ background: "var(--grad-primary)" }}
      >
        <div className="tt-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ target, prefix, suffix, label }) => (
              <Reveal key={label} className="flex flex-col gap-2">
                <div className="font-display font-bold text-white" style={{ fontSize: "clamp(2rem, 3vw + 1rem, 3.2rem)" }}>
                  <Counter target={target} prefix={prefix} suffix={suffix} />
                </div>
                <div className="text-sm text-white/70">{label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CATEGORIAS */}
      <section className="tt-section" id="categorias">
        <div className="tt-container">
          <Reveal className="section-head">
            <span className="eyebrow">NOSSAS CATEGORIAS</span>
            <h2 className="h-section">
              Ferramentas para cada <span className="grad-text">segmento industrial</span>.
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.slice(0, 6).map((cat) => (
              <Reveal key={cat.slug}>
                <Link
                  href={`/categorias/${cat.slug}`}
                  className="group block relative overflow-hidden rounded-[14px]"
                  style={{ aspectRatio: "3/4" }}
                >
                  {cat.image_url && (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-106"
                      sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                    />
                  )}
                  <div
                    className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-80"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(6,20,50,.08) 0%, rgba(6,20,50,.72) 100%)",
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span
                      className="block px-2 py-1.5 text-[11px] font-bold tracking-[.08em] uppercase text-white text-center rounded-md"
                      style={{ background: "rgba(10,58,140,.88)" }}
                    >
                      {cat.name}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center">
            <Link href="/produtos" className="btn btn-ghost btn-lg">
              Ver catálogo completo <span className="arrow">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 6. CTA */}
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
                  "radial-gradient(circle at 20% 30%, rgba(255,255,255,.18), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,209,255,.38), transparent 50%)",
              }}
            />
            <div className="relative">
              <h2 className="h-section text-white mb-4">
                Resolva seu fornecimento de ferramenta de uma vez por todas.
              </h2>
              <p className="text-white/85 max-w-xl mx-auto mb-8">
                Cotação em até 4h úteis. Sem compromisso, sem cadastro chato.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
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
                  Falar no WhatsApp
                </a>
                <Link
                  href="/produtos"
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

      {/* 7. CONTATO RÁPIDO */}
      <section className="tt-section" style={{ background: "var(--color-bg)" }}>
        <div className="tt-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <span className="eyebrow">CONTATO</span>
              <h2 className="h-section mt-4">
                Fale com quem <span className="grad-text">entende do assunto</span>.
              </h2>
              <p className="text-lead mt-4">
                Nossa equipe técnica está disponível para indicar o produto certo para cada
                aplicação. Sem enrolação, sem bot.
              </p>

              <div className="mt-8 grid gap-4">
                <a
                  href={whatsappUrl("Olá! Quero falar com um especialista.")}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-4 group"
                >
                  <span
                    className="flex-shrink-0 h-12 w-12 rounded-xl grid place-items-center text-white shadow-md"
                    style={{ background: "#25D366" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.5 3.5C18.3 1.2 15.3 0 12.1 0 5.5 0 .1 5.4.1 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.4 5.7 1.4 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.4-8.3zm-8.4 18.4c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.6-1.5-3.4-1.5-5.3 0-5.5 4.5-9.9 9.9-9.9 2.7 0 5.1 1 7 2.9s2.9 4.4 2.9 7c0 5.5-4.4 9.9-9.9 9.9z" />
                    </svg>
                  </span>
                  <div>
                    <div className="text-xs text-ink-3 uppercase tracking-wider font-bold">WhatsApp</div>
                    <div className="text-ink font-semibold group-hover:text-brand-500 transition-colors">
                      {siteConfig.whatsappDisplay}
                    </div>
                  </div>
                </a>

                <a href={`tel:+551126682051`} className="flex items-center gap-4 group">
                  <span
                    className="flex-shrink-0 h-12 w-12 rounded-xl grid place-items-center text-white shadow-md"
                    style={{ background: "var(--grad-primary)" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68 2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 6.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </span>
                  <div>
                    <div className="text-xs text-ink-3 uppercase tracking-wider font-bold">Telefone</div>
                    <div className="text-ink font-semibold group-hover:text-brand-500 transition-colors">
                      {siteConfig.phone}
                    </div>
                  </div>
                </a>

                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-4 group">
                  <span
                    className="flex-shrink-0 h-12 w-12 rounded-xl grid place-items-center text-white shadow-md"
                    style={{ background: "var(--grad-primary)" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <div>
                    <div className="text-xs text-ink-3 uppercase tracking-wider font-bold">E-mail</div>
                    <div className="text-ink font-semibold group-hover:text-brand-500 transition-colors">
                      {siteConfig.email}
                    </div>
                  </div>
                </a>
              </div>
            </Reveal>

            <Reveal className="flex flex-col gap-5">
              <div className="tt-card p-8">
                <h3 className="text-xl mb-1">Precisa de uma cotação?</h3>
                <p className="text-ink-2 text-sm mb-6">
                  Envie sua lista de produtos e receba retorno em até 4h úteis.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={whatsappUrl("Olá! Gostaria de fazer uma cotação.")}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-primary"
                  >
                    Cotação pelo WhatsApp
                  </a>
                  <Link href="/contato" className="btn btn-ghost">
                    Formulário de contato
                  </Link>
                </div>
              </div>

              <div className="tt-card p-6">
                <div className="flex items-start gap-4">
                  <span
                    className="flex-shrink-0 h-10 w-10 rounded-lg grid place-items-center text-white"
                    style={{ background: "var(--grad-primary)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-ink text-sm mb-0.5">Matriz — Diadema / SP</div>
                    <div className="text-xs text-ink-3">R. Martins Fontes, 164 — Taboão</div>
                    <div className="text-xs text-ink-3">CEP 09940-330</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
