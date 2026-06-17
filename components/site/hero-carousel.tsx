"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/utils";

const slides = [
  "/hero-segmentos.avif",
  "/hero-diversas.avif",
  "/hero-construcao.avif",
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
      {slides.map((src, i) => (
        <div
          key={src}
          className="hero-slide absolute inset-0"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden
        >
          <Image
            src={src}
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

      {/* Conteúdo (fixo) */}
      <div className="relative z-10 tt-container flex min-h-[clamp(560px,84vh,780px)] flex-col items-center justify-center text-center py-24">
        <h1 className="h-display max-w-4xl">
          Soluções Diamantadas para <span className="grad-text">Corte, Perfuração e Desbaste</span> Industrial
        </h1>

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
        <div className="mt-12 flex items-center gap-3" role="tablist" aria-label="Selecionar imagem de fundo">
          {slides.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Imagem ${i + 1}`}
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
        aria-label="Imagem anterior"
        onClick={() => go(index - 1)}
        className="hero-arrow left-4 md:left-7"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Próxima imagem"
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
