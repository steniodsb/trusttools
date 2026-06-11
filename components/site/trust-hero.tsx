import Image from "next/image";

/**
 * Hero escuro da página Trust Tools (Quem Somos).
 * "Trust Tools" centralizado, com imagens em baixa opacidade fazendo
 * crossfade ao fundo.
 */
const bgImages = [
  "/trust-tools-hero.avif",
  "/cat-construcao.avif",
  "/cat-pedras.avif",
  "/cat-segmentos.avif",
];

const FADE_DUR = 28; // segundos (ciclo completo)

export function TrustHero() {
  return (
    <section
      className="hero-dark relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #03060d 100%)" }}
    >
      {/* Fundo: imagens em crossfade, baixa opacidade */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {bgImages.map((src, i) => (
          <div
            key={src}
            className="tt-bg-fade absolute inset-0"
            style={{
              animationDuration: `${FADE_DUR}s`,
              animationDelay: `${(i * FADE_DUR) / bgImages.length}s`,
            }}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="100vw" />
          </div>
        ))}
        {/* máscara escura por cima das imagens */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(3,6,13,.78) 0%, rgba(3,6,13,.72) 100%)",
          }}
        />
      </div>

      {/* glow sutil */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 50% at 50% 35%, rgba(30,99,233,.22), transparent 70%)",
        }}
      />

      <div className="relative z-10 tt-container flex min-h-[clamp(360px,52vh,520px)] flex-col items-center justify-center text-center py-24">
        <h1 className="h-display">
          <span className="grad-text">Trust Tools</span>
        </h1>
      </div>
    </section>
  );
}
