"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/utils";

type Slide = {
  image: string;
  title: string;
  highlight: string;
};

const slides: Slide[] = [
  {
    image: "/hero-segmentos.avif",
    title: "Corte, perfuração e desbaste com performance diamantada",
    highlight: "performance diamantada",
  },
  {
    image: "/hero-diversas.avif",
    title: "Ferramentas profissionais para cada aplicação",
    highlight: "cada aplicação",
  },
  {
    image: "/hero-construcao.avif",
    title: "Soluções para construção civil, pré-fabricados e indústria",
    highlight: "construção civil",
  },
];

const segmentos = [
  "Construção Civil",
  "Pré-Fabricados",
  "Refratários",
  "Rochas Ornamentais",
  "Indústria",
];

const diferenciais = [
  "Fabricação própria",
  "Desenvolvimento técnico",
  "Repastilhamento",
  "Pronta entrega",
];

const AUTOPLAY_MS = 6000;

function renderTitle(title: string, highlight: string) {
  const parts = title.split(highlight);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <span className="grad-text">{highlight}</span>}
    </Fragment>
  ));
}

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
          aria-hidden
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(3,6,13,.66) 0%, rgba(3,6,13,.58) 45%, rgba(3,6,13,.8) 100%)",
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
      <div className="relative z-10 tt-container flex min-h-[clamp(560px,84vh,780px)] flex-col items-center justify-center text-center py-24">
        {/* Título por slide (animado) */}
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
              {renderTitle(slide.title, slide.highlight)}
            </h1>
          ))}
        </div>

        <p className="mt-6 text-base md:text-lg font-display font-medium text-white/85 max-w-3xl">
          {segmentos.join("  •  ")}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {diferenciais.map((d) => (
            <span
              key={d}
              className="rounded-full border border-white/20 bg-white/[.07] px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur"
            >
              {d}
            </span>
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
