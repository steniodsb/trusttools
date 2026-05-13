import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Download } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { SubHero } from "@/components/site/sub-hero";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Catálogos",
  description:
    "Baixe os catálogos técnicos da Trust Tools em PDF. Especificação, códigos, dimensões e aplicação por linha de produto.",
};

const catalogs = [
  {
    number: "01",
    name: "Catálogo Geral de Produtos",
    description: "Catálogo completo com todas as linhas: construção, refratários, pedras, segmentos e ferramentas diversas.",
    size: "PDF",
    href: "https://www.trusttools.com.br/_files/ugd/651430_02be861619b2420799a3eb7013367562.pdf",
  },
  {
    number: "02",
    name: "Ferramentas Importadas",
    description: "Linha completa de ferramentas importadas com especificações técnicas e códigos.",
    size: "PDF",
    href: "https://www.trusttools.com.br/_files/ugd/651430_ee4fee6e428042418d461d2f272cbdf2.pdf",
  },
  {
    number: "03",
    name: "Catálogo Pedras & Mármore",
    description: "Discos, frankfurts, polidores, fresas e brocas diamantadas para marmorarias e beneficiamento.",
    size: "PDF",
    href: "https://www.trusttools.com.br/_files/ugd/651430_4311144dcefc493ea797aca90216f806.pdf",
  },
];

export default function CatalogosPage() {
  return (
    <>
      <SubHero
        eyebrow="DOWNLOAD"
        title={
          <>
            Catálogos completos
            <br />
            por <span className="grad-text">linha de produto</span>.
          </>
        }
        description="Especificação técnica, códigos, dimensões e aplicação. Baixe em PDF e compartilhe com seu time."
      />

      <section className="tt-section">
        <div className="tt-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {catalogs.map((cat) => (
              <Reveal key={cat.number}>
                <article className="tt-card p-7 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div
                      className="grid h-12 w-12 place-items-center rounded-xl text-white shadow-[0_6px_14px_rgba(30,99,233,.35)]"
                      style={{ background: "var(--grad-primary)" }}
                    >
                      <FileText size={22} strokeWidth={2} />
                    </div>
                    <span className="text-xs font-medium text-ink-3 px-2.5 py-1 rounded-full bg-surface-soft border border-line">
                      PDF • {cat.size}
                    </span>
                  </div>

                  <h3 className="text-xl mb-2">
                    <span className="text-ink-3 font-medium">{cat.number} — </span>
                    {cat.name}
                  </h3>
                  <p className="text-sm text-ink-2 mb-6 flex-1">{cat.description}</p>

                  <a
                    href={cat.href}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-primary justify-center w-full"
                  >
                    <Download size={16} />
                    Baixar PDF
                  </a>
                </article>
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
              <h2 className="h-section text-white mb-4">Precisa de ficha técnica específica?</h2>
              <p className="text-white/85 max-w-xl mx-auto mb-7">
                Datasheet por SKU, certificado de origem, laudo de lote — disponíveis sob solicitação para clientes ativos.
              </p>
              <div className="flex flex-wrap gap-3.5 justify-center">
                <Link
                  href="/contato"
                  className="btn btn-lg"
                  style={{ background: "#fff", color: "var(--color-brand-700)" }}
                >
                  Solicitar material técnico <span className="arrow">→</span>
                </Link>
                <a
                  href={whatsappUrl("Olá! Preciso de ficha técnica de um produto.")}
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
