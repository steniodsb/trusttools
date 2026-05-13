import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { Counter } from "@/components/site/counter";
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
            <Reveal as="span" className="eyebrow self-center">IMPORTAÇÃO • DISTRIBUIÇÃO • SUPORTE TÉCNICO</Reveal>
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
              <Link href="/catalogos" className="btn btn-ghost btn-lg">Ver catálogo completo</Link>
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

      {/* PHOTO STRIP */}
      <section className="tt-section py-0">
        <div className="tt-container">
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-16">
            {[
              "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
            ].map((src, i) => (
              <div key={i} className="photo-strip-item relative aspect-[3/4] overflow-hidden rounded-[14px]">
                <Image src={src} alt={`Imagem industrial ${i + 1}`} fill className="object-cover" unoptimized />
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
              <Image src="/hero-home.jpg" alt="Centro de distribuição Trust Tools" fill className="object-cover" />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(6,30,77,.45) 100%), linear-gradient(135deg, rgba(10,58,140,.18) 0%, transparent 60%)" }} />
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
