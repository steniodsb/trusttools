import type { Metadata } from "next";
import { Download, Factory, Ship } from "lucide-react";
import { SubHero } from "@/components/site/sub-hero";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Catálogos",
  description:
    "Baixe os catálogos da Trust Tools e confira toda a nossa linha de produtos — ferramentas fabricadas e ferramentas importadas.",
};

/**
 * Os arquivos PDF devem ser colocados em /public com estes nomes:
 *   - catalogo-ferramentas-fabricadas.pdf
 *   - catalogo-ferramentas-importadas.pdf
 */
const catalogos = [
  {
    icon: Factory,
    title: "Ferramentas Fabricadas",
    description:
      "Nossa linha de ferramentas diamantadas desenvolvidas e fabricadas pela Trust Tools.",
    file: "/catalogo-ferramentas-fabricadas.pdf",
  },
  {
    icon: Ship,
    title: "Ferramentas Importadas",
    description:
      "Linha completa de ferramentas e acessórios importados para uso profissional e industrial.",
    file: "/catalogo-ferramentas-importadas.pdf",
  },
];

export default function CatalogosPage() {
  return (
    <>
      <SubHero
        eyebrow="DOWNLOADS"
        title="Catálogos"
        description="Baixe os nossos catálogos e confira agora mesmo toda a nossa linha de produtos."
      />

      <section className="tt-section">
        <div className="tt-container">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto stagger">
            {catalogos.map((cat) => {
              const Icon = cat.icon;
              return (
                <Reveal key={cat.title}>
                  <div className="tt-card p-8 h-full flex flex-col items-start">
                    <span
                      className="grid h-14 w-14 place-items-center rounded-2xl text-white mb-5 shadow-[0_8px_20px_rgba(30,99,233,.35)]"
                      style={{ background: "var(--grad-primary)" }}
                    >
                      <Icon size={26} />
                    </span>
                    <h2 className="text-2xl mb-2">{cat.title}</h2>
                    <p className="text-ink-2 mb-7 flex-1">{cat.description}</p>
                    <a
                      href={cat.file}
                      download
                      target="_blank"
                      rel="noopener"
                      className="btn btn-primary"
                    >
                      <Download size={18} />
                      Baixar catálogo
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
