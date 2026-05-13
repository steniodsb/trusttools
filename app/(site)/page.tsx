import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { Counter } from "@/components/site/counter";
import { createClient } from "@/lib/supabase/server";
import { siteConfig, whatsappUrl, factoryPhoto } from "@/lib/utils";
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

// Fallback estático caso o banco ainda não tenha categorias
const fallbackCategories = [
  { slug: "construcao-civil", name: "Construção Civil", description: "Discos diamantados, brocas, serras, fixadores e ferramenta elétrica para construtoras que tocam obra pesada.", image_url: "/cat-construcao.jpg" },
  { slug: "refratarios", name: "Refratários", description: "Brocas, fresas e abrasivos especiais para indústrias siderúrgicas, cimenteiras e cerâmicas.", image_url: "/cat-refratarios.jpg" },
  { slug: "pedras-marmore", name: "Pedras & Mármore", description: "Discos, fresas, frankfurts, polidores e abrasivos para marmorarias e beneficiamento.", image_url: "/cat-pedras.jpg" },
  { slug: "segmentos-diamantados", name: "Segmentos Diamantados", description: "Linha completa de segmentos para fios, serras e discos de grande porte.", image_url: "/cat-segmentos.jpg" },
  { slug: "ferramentaria-geral", name: "Ferramentaria Geral", description: "EPIs, manuais, medição, fixação, abrasivos convencionais.", image_url: "/cat-diversos.jpg" },
  { slug: "recapagem", name: "Recapagem & Serviços", description: "Recapagem de segmentos diamantados e reaproveitamento de ferramentas.", image_url: "/cat-recapagem.jpg" },
];

export default async function HomePage() {
  const dbCategories = await getCategories();
  const categories = dbCategories.length > 0 ? dbCategories : fallbackCategories;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-[116px] pb-20" style={{ background: "linear-gradient(180deg, #F4F7FB 0%, #EAF1FF 100%)" }}>
        <div className="hero-orb" style={{ width: 420, height: 420, background: "rgba(30,99,233,.18)", right: -80, top: -80, "--orb-dur": "13s" } as React.CSSProperties} />
        <div className="hero-orb" style={{ width: 280, height: 280, background: "rgba(0,209,255,.14)", left: "4%", bottom: "10%", "--orb-dur": "9s", "--orb-delay": "-4s" } as React.CSSProperties} />
        <div className="hero-orb" style={{ width: 180, height: 180, background: "rgba(90,169,255,.12)", left: "38%", top: "22%", "--orb-dur": "16s", "--orb-delay": "-7s" } as React.CSSProperties} />
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "var(--grad-aurora)" }} />

        <div className="tt-container relative z-10">
          <div className="grid gap-6 text-center items-center">
            <Reveal as="span" className="eyebrow place-self-center">IMPORTAÇÃO • DISTRIBUIÇÃO • SUPORTE TÉCNICO</Reveal>
            <Reveal as="h1" className="h-display my-2">
              A ferramenta certa, no <span className="grad-text">dia certo</span>,<br />
              com quem entende do seu setor.
            </Reveal>
            <Reveal as="p" className="text-lead mx-auto">
              Há mais de uma década abastecendo construção, refratários, pedras e indústria pesada com produtos importados, estoque pronto em SP e atendimento técnico especializado.
            </Reveal>
            <Reveal className="flex flex-wrap gap-3.5 justify-center mt-8">
              <a href={whatsappUrl("Olá! Quero falar com um especialista.")} target="_blank" rel="noopener" className="btn btn-primary btn-lg">
                Falar com um especialista <span className="arrow">→</span>
              </a>
              <Link href="/produtos" className="btn btn-ghost btn-lg">Ver catálogo completo</Link>
            </Reveal>
          </div>

          <Reveal className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-7 backdrop-blur-xl bg-white/70 border border-line rounded-[28px] shadow-md">
            <div className="text-center p-2">
              <div className="font-display font-bold leading-none grad-text" style={{ fontSize: "clamp(1.5rem, 2.2vw + .8rem, 2.4rem)", letterSpacing: "-.02em" }}>
                <Counter target={12} prefix="+" suffix=" anos" />
              </div>
              <div className="text-[13px] text-ink-3 mt-2">abastecendo a indústria brasileira</div>
            </div>
            <div className="text-center p-2">
              <div className="font-display font-bold leading-none grad-text" style={{ fontSize: "clamp(1.5rem, 2.2vw + .8rem, 2.4rem)", letterSpacing: "-.02em" }}>
                <Counter target={5000} prefix="+" />
              </div>
              <div className="text-[13px] text-ink-3 mt-2">SKUs em estoque pronto</div>
            </div>
            <div className="text-center p-2">
              <div className="font-display font-bold leading-none grad-text" style={{ fontSize: "clamp(1.5rem, 2.2vw + .8rem, 2.4rem)", letterSpacing: "-.02em" }}>
                <Counter target={2} suffix=" CDs" />
              </div>
              <div className="text-[13px] text-ink-3 mt-2">centros de distribuição em SP</div>
            </div>
            <div className="text-center p-2">
              <div className="font-display font-bold leading-none grad-text" style={{ fontSize: "clamp(1.5rem, 2.2vw + .8rem, 2.4rem)", letterSpacing: "-.02em" }}>
                <Counter target={48} suffix="h" />
              </div>
              <div className="text-[13px] text-ink-3 mt-2">entrega média no Sudeste</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PHOTO STRIP — fotos reais da fábrica */}
      <section className="tt-section py-0">
        <div className="tt-container">
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-16">
            {[3, 5, 8, 16].map((n, i) => (
              <div key={n} className="photo-strip-item relative aspect-[3/4] overflow-hidden rounded-[14px]">
                <Image
                  src={factoryPhoto(n)}
                  alt={`Fábrica Trust Tools - foto ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(6,30,77,.45) 100%)" }} />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* SOBRE RESUMO */}
      <section className="tt-section">
        <div className="tt-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <span className="eyebrow">QUEM SOMOS</span>
              <h2 className="h-section mt-4">A Trust Tools é o elo entre a <span className="grad-text">fábrica e o seu canteiro</span>.</h2>
              <p className="text-lead">
                Somos uma importadora e distribuidora de ferramentas industriais nascida pra resolver um problema simples: o Brasil precisa de produto importado de qualidade, disponível agora, com quem saiba indicar a aplicação correta.
              </p>
              <div className="mt-6 grid gap-3.5">
                {[
                  ["Importação direta", ", sem atravessador encarecendo o produto"],
                  ["Estoque físico", " em Diadema e Jundiaí, com retirada no mesmo dia"],
                  ["Equipe técnica", " que conhece a sua aplicação antes de vender"],
                  ["Garantia formal", " e troca rápida em caso de defeito de fábrica"],
                ].map(([strong, rest]) => (
                  <div key={strong} className="flex gap-3.5 items-start">
                    <span className="flex-shrink-0 grid h-7 w-7 place-items-center rounded-lg text-white shadow-[0_6px_14px_rgba(30,99,233,.35)]" style={{ background: "var(--grad-primary)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <p className="m-0 text-ink-2"><strong className="text-ink">{strong}</strong>{rest}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/sobre" className="btn-link">Conheça nossa história <span className="arrow">→</span></Link>
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
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(6,30,77,.45) 100%), linear-gradient(135deg, rgba(10,58,140,.18) 0%, transparent 60%)" }} />
            </Reveal>
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
                    <h3 className="text-base text-ink mb-1">Recapagem de segmentos</h3>
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
                <Link href="/produtos?categoria=lajes-alveolares-protendidas" className="btn btn-primary">
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

      {/* LINHAS DE PRODUTO */}
      <section className="tt-section" id="produtos">
        <div className="tt-container">
          <Reveal className="section-head">
            <span className="eyebrow">LINHAS DE PRODUTO</span>
            <h2 className="h-section">Ferramentas industriais para quem <span className="grad-text">não pode parar</span>.</h2>
            <p className="text-lead">Seis linhas que cobrem da escavação ao acabamento.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {categories.slice(0, 6).map((cat) => (
              <Reveal key={cat.slug}>
                <Link href={`/produtos?categoria=${cat.slug}`} className="tt-card overflow-hidden flex flex-col h-full">
                  <div className="relative aspect-[16/10]">
                    {cat.image_url && (
                      <Image src={cat.image_url} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                    <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,27,51,0) 40%, rgba(11,27,51,.35) 100%)" }} />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl mb-1.5">{cat.name}</h3>
                    <p className="text-sm text-ink-2 mb-4 flex-1">{cat.description}</p>
                    <span className="btn-link mt-auto">Ver produtos <span className="arrow">→</span></span>
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
