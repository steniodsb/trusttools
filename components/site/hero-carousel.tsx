"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { whatsappUrl } from "@/lib/utils";

const slides = [
  {
    image: "/hero-home.jpg",
    eyebrow: "IMPORTAÇÃO • DISTRIBUIÇÃO • SUPORTE TÉCNICO",
    title: "A ferramenta certa, no dia certo, com quem entende do seu setor.",
    highlight: "dia certo",
    description:
      "Há mais de uma década abastecendo construção, refratários, pedras e indústria pesada com produtos importados, estoque pronto em SP e atendimento técnico especializado.",
  },
  {
    image: "/banner-1.jpg",
    eyebrow: "IMPORTAÇÃO DIRETA",
    title: "Importação direta, sem intermediários. Qualidade com garantia formal.",
    highlight: "sem intermediários",
    description:
      "Ferramentas industriais trazidas diretamente da fábrica, com estoque físico em Diadema e Jundiaí disponível para retirada no mesmo dia.",
  },
  {
    image: "/banner-2.jpg",
    eyebrow: "SUPORTE TÉCNICO ESPECIALIZADO",
    title: "Suporte técnico de quem conhece cada aplicação.",
    highlight: "conhece cada aplicação",
    description:
      "Nossa equipe indica o produto certo antes de vender. Menos erro, menos retrabalho, mais produtividade na sua obra ou indústria.",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    [],
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = slides[current];

  function renderTitle(title: string, highlight: string) {
    const parts = title.split(highlight);
    return parts.map((part, i) => (
      <span key={i}>
        {part}
        {i < parts.length - 1 && <span className="grad-text">{highlight}</span>}
      </span>
    ));
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "calc(100svh - 76px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide images */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: 0 }}
        >
          <Image
            src={s.image}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(5,15,40,.88) 0%, rgba(5,15,40,.6) 60%, rgba(5,15,40,.35) 100%)",
        }}
      />

      {/* Content */}
      <div className="tt-container relative z-20 flex flex-col justify-center min-h-[calc(100svh-76px)] py-24">
        <div className="max-w-3xl">
          <span
            className="eyebrow"
            style={{ color: "rgba(255,255,255,.65)" }}
          >
            {slide.eyebrow}
          </span>
          <h1 className="h-display mt-4 mb-6 text-white">
            {renderTitle(slide.title, slide.highlight)}
          </h1>
          <p className="text-lead mb-10" style={{ color: "rgba(255,255,255,.78)" }}>
            {slide.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={whatsappUrl("Olá! Quero falar com um especialista.")}
              target="_blank"
              rel="noopener"
              className="btn btn-primary btn-lg"
            >
              Falar com um especialista <span className="arrow">→</span>
            </a>
            <Link href="/produtos" className="btn btn-ghost btn-lg">
              Ver catálogo completo
            </Link>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-14">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="h-[3px] rounded-full transition-all duration-400"
              style={{
                width: i === current ? "2.5rem" : "0.6rem",
                background: i === current ? "#fff" : "rgba(255,255,255,.35)",
              }}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full flex items-center justify-center text-white transition-all"
        style={{ background: "rgba(255,255,255,.15)" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.3)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.15)")
        }
        aria-label="Slide anterior"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full flex items-center justify-center text-white transition-all"
        style={{ background: "rgba(255,255,255,.15)" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.3)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.15)")
        }
        aria-label="Próximo slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </section>
  );
}
