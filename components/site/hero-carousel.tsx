"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/utils";

type Slide = {
  image: string;
  title: string;
};

const slides: Slide[] = [
  { image: "/hero-segmentos.avif", title: "Ferramentas para todo tipo de segmento" },
  { image: "/hero-diversas.avif", title: "Diversas ferramentas para você!" },
  { image: "/hero-construcao.avif", title: "Conheça nossa linha de construção" },
];

const AUTOPLAY_MS = 6000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number) => {
    setIndex((next + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      className="hero-dark hero-carousel relative overflow-hidden"
      aria-roledescription="carrossel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides (background) */}
      {slides.map((slide, i) => (
        <div
          key={slide.image}
          className="hero-slide absolute inset-0"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          {/* máscara escura para legibilidade */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(3,6,13,.62) 0%, rgba(3,6,13,.55) 45%, rgba(3,6,13,.78) 100%)",
            }}
          />
        </div>
      ))}

      {/* glow sutil */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 30%, rgba(30,99,233,.28), transparent 70%), radial-gradient(40% 30% at 82% 78%, rgba(0,209,255,.20), transparent 70%)",
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 tt-container flex min-h-[clamp(540px,82vh,760px)] flex-col items-center justify-center text-center py-24">
        <span className="eyebrow mb-6">IMPORTAÇÃO • DISTRIBUIÇÃO • SUPORTE TÉCNICO</span>

        <div className="hero-carousel-titles relative w-full max-w-4xl">
          {slides.map((slide, i) => (
            <h1
              key={slide.image}
              className={`h-display transition-all duration-700 ${
                i === index
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none absolute inset-0 opacity-0 translate-y-4"
              }`}
              aria-hidden={i !== index}
            >
              {slide.title}
            </h1>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-3.5">
          <Link href="/catalogo" className="btn btn-primary btn-lg">
            Ver catálogo completo <span className="arrow">→</span>
          </Link>
          <a
            href={whatsappUrl("Olá! Quero falar com um especialista.")}
            target="_blank"
            rel="noopener"
            className="btn btn-ghost btn-lg"
          >
            Falar com um especialista
          </a>
        </div>

        {/* Dots */}
        <div className="mt-12 flex items-center gap-3" role="tablist" aria-label="Selecionar slide">
          {slides.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Ir para o slide ${i + 1}`}
              onClick={() => go(i)}
              className="hero-dot"
              data-active={i === index}
            />
          ))}
        </div>
      </div>

      {/* Setas */}
      <button
        type="button"
        aria-label="Slide anterior"
        onClick={() => go(index - 1)}
        className="hero-arrow left-4 md:left-7"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Próximo slide"
        onClick={() => go(index + 1)}
        className="hero-arrow right-4 md:right-7"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </section>
  );
}
