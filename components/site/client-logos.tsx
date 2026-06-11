import Image from "next/image";

/**
 * Carrossel contínuo de logos de clientes (largura total).
 *
 * COMO TROCAR PELOS LOGOS REAIS:
 * 1. Coloque os arquivos em /public/clientes/ (ex.: cliente-1.png, cliente-2.png...)
 * 2. Preencha o array `logos` abaixo com { src, alt }.
 * Enquanto o array estiver vazio, são exibidos chips de texto como placeholder.
 */
type Logo = { src: string; alt: string };

const logos: Logo[] = [
  { src: "/clientes/estivar.avif", alt: "Estivar" },
  { src: "/clientes/gran.avif", alt: "Gran" },
  { src: "/clientes/bpm.avif", alt: "BPM" },
  { src: "/clientes/leonardi.avif", alt: "Leonardi" },
  { src: "/clientes/ta.avif", alt: "TA" },
];

// Placeholders enquanto os logos reais não chegam
const placeholders = [
  "Cliente 01",
  "Cliente 02",
  "Cliente 03",
  "Cliente 04",
  "Cliente 05",
  "Cliente 06",
  "Cliente 07",
  "Cliente 08",
];

export function ClientLogos() {
  const useImages = logos.length > 0;
  const items = useImages ? logos : placeholders;
  // Repete o conjunto para preencher a largura; duas metades iguais
  // garantem o loop contínuo sem emendas (animação translateX(-50%)).
  const half = [...items, ...items, ...items];
  const loop = [...half, ...half];

  return (
    <section className="py-14 border-y border-line bg-white/60">
      <div className="tt-container mb-8 text-center">
        <span className="eyebrow">QUEM CONFIA NA TRUST TOOLS</span>
      </div>

      <div className="marquee w-full">
        <div className="marquee-inner">
          {loop.map((item, i) =>
            useImages ? (
              <div
                key={i}
                className="logo-chip flex items-center justify-center !px-8 !py-4"
              >
                <Image
                  src={(item as Logo).src}
                  alt={(item as Logo).alt}
                  width={140}
                  height={56}
                  className="h-12 w-auto object-contain opacity-70 transition hover:opacity-100"
                />
              </div>
            ) : (
              <span key={i} className="logo-chip">
                {item as string}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
