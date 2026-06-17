"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Hero da página Trust Tools (Quem Somos).
 * "Trust Tools" centralizado sobre um carrossel de fotos reais da fábrica,
 * com o fundo bem visível (overlay leve apenas para legibilidade do texto).
 */
const bgImages = [
  "/fabrica/fabrica-1.jpg",
  "/fabrica/fabrica-2.jpg",
  "/fabrica/fabrica-3.jpg",
  "/fabrica/fabrica-4.jpg",
];

const AUTOPLAY_MS = 5000;

export function TrustHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % bgImages.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero-dark relative overflow-hidden">
      {/* Carrossel de imagens da fábrica (fundo) */}
      <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#03060d]">
        {bgImages.map((src, i) => (
          <div
            key={src}
            className="hero-slide absolute inset-0"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
        {/* overlay leve: escurece só o necessário para o texto ficar legível */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(3,6,13,.45) 0%, rgba(3,6,13,.35) 45%, rgba(3,6,13,.6) 100%)",
          }}
        />
        {/* foco radial atrás do título para contraste */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(45% 60% at 50% 50%, rgba(3,6,13,.55), transparent 75%)",
          }}
        />
      </div>

      <div className="relative z-10 tt-container flex min-h-[clamp(380px,56vh,560px)] flex-col items-center justify-center text-center py-24">
        <h1 className="h-display" style={{ textShadow: "0 2px 30px rgba(0,0,0,.5)" }}>
          <span className="grad-text">Trust Tools</span>
        </h1>

        {/* Dots */}
        <div className="mt-10 flex items-center gap-3" role="tablist" aria-label="Selecionar imagem">
          {bgImages.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Imagem ${i + 1}`}
              onClick={() => setIndex(i)}
              className="hero-dot"
              data-active={i === index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
