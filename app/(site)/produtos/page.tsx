import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SubHero } from "@/components/site/sub-hero";
import { Reveal } from "@/components/site/reveal";
import { linhas } from "@/lib/linhas";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Linha completa de ferramentas diamantadas de alta performance: construção, refratários, pedras, segmentos, ferramentas diversas e repastilhamento.",
};

export default function ProdutosPage() {
  return (
    <>
      <SubHero
        eyebrow="NOSSOS PRODUTOS"
        title="Produtos"
        description="Na Trust Tools, você encontra uma linha completa de ferramentas diamantadas de alta performance, desenvolvidas para oferecer precisão, durabilidade e eficiência em cada corte e perfuração. Nossos produtos são projetados para atender às necessidades de quem busca qualidade e confiabilidade em obras e processos industriais. Explore nossa categoria de produtos e descubra soluções que elevam o padrão do seu trabalho."
      />

      <section className="tt-section">
        <div className="tt-container">
          <div className="grid gap-16 lg:gap-24">
            {linhas.map((linha, i) => {
              const imageFirst = i % 2 === 1; // alterna o lado da imagem
              return (
                <Reveal key={linha.slug}>
                  <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
                    {/* Imagem */}
                    <div
                      className={`relative aspect-[4/3] rounded-[28px] overflow-hidden border border-line shadow-lg ${
                        imageFirst ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <Image
                        src={linha.image}
                        alt={linha.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(180deg, transparent 55%, rgba(6,30,77,.4) 100%)" }}
                      />
                    </div>

                    {/* Texto */}
                    <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
                      <h2 className="h-section">
                        <span className="grad-text">{linha.name}</span>
                      </h2>
                      <p className="text-lead mt-5">{linha.cardDescription}</p>
                      <div className="mt-7">
                        <Link href={`/linhas/${linha.slug}`} className="btn btn-primary">
                          Saiba mais <span className="arrow">→</span>
                        </Link>
                      </div>
                    </div>
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
