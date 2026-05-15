"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn, whatsappUrl } from "@/lib/utils";

const navCategories = [
  { slug: "construcao-civil", name: "Construção Civil" },
  { slug: "refratarios", name: "Refratários" },
  { slug: "pedras-marmore", name: "Pedras & Mármore" },
  { slug: "segmentos-diamantados", name: "Segmentos Diamantados" },
  { slug: "ferramentaria-geral", name: "Ferramentaria Geral" },
  { slug: "recapagem", name: "Recapagem & Serviços" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const linkCls = (active: boolean, extra?: string) =>
    cn(
      "inline-block rounded-[10px] px-3.5 py-2.5 text-sm font-medium transition-all",
      active ? "bg-brand-100 text-brand-700" : "text-ink-2 hover:bg-surface hover:text-ink",
      extra,
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[76px] backdrop-blur-md transition-all",
        scrolled
          ? "bg-white/85 border-b border-line shadow-sm"
          : "bg-bg/80 border-b border-transparent",
      )}
    >
      <div className="tt-container flex h-full items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-display font-bold text-ink shrink-0">
          <Image
            src="/logo-tt.png"
            alt="Trust Tools"
            width={42}
            height={42}
            className="h-[42px] w-[42px] object-contain"
            priority
          />
          <span className="text-[1.1rem]">Trust Tools</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Principal" className="hidden md:flex items-center gap-0.5">
          <Link href="/" className={linkCls(pathname === "/")}>
            Home
          </Link>

          <Link href="/sobre" className={linkCls(pathname.startsWith("/sobre"))}>
            Quem somos
          </Link>

          {/* Dropdown Produtos */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className={cn(
                "inline-flex items-center gap-1 rounded-[10px] px-3.5 py-2.5 text-sm font-medium transition-all",
                pathname.startsWith("/categorias")
                  ? "bg-brand-100 text-brand-700"
                  : "text-ink-2 hover:bg-surface hover:text-ink",
              )}
            >
              Produtos
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={cn("transition-transform duration-200", dropdownOpen && "rotate-180")}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div
              className={cn(
                "absolute top-full left-0 mt-1 w-56 bg-white rounded-[14px] border border-line shadow-xl py-2 z-50 transition-all duration-200",
                dropdownOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none",
              )}
            >
              {navCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categorias/${cat.slug}`}
                  className="block px-4 py-2.5 text-sm text-ink-2 hover:bg-surface hover:text-ink transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <div className="my-1.5 border-t border-line" />
              <Link
                href="/produtos"
                className="block px-4 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
              >
                Ver catálogo completo →
              </Link>
            </div>
          </div>

          <Link href="/produtos" className={linkCls(pathname === "/produtos")}>
            Catálogo
          </Link>

          <Link href="/contato" className={linkCls(pathname.startsWith("/contato"))}>
            Contato
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={whatsappUrl("Olá! Quero falar com a Trust Tools.")}
            target="_blank"
            rel="noopener"
            className="hidden md:inline-flex btn btn-primary btn-sm"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 3.5C18.3 1.2 15.3 0 12.1 0 5.5 0 .1 5.4.1 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.4 5.7 1.4 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.4-8.3zm-8.4 18.4c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.6-1.5-3.4-1.5-5.3 0-5.5 4.5-9.9 9.9-9.9 2.7 0 5.1 1 7 2.9s2.9 4.4 2.9 7c0 5.5-4.4 9.9-9.9 9.9z" />
            </svg>
            Fale Conosco
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-[10px] border border-line bg-white text-ink"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-[76px] left-0 right-0 bg-white border-b border-line shadow-lg z-50 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col p-4 gap-1">
            <Link href="/" onClick={() => setOpen(false)} className="block rounded-[10px] px-4 py-3 text-sm font-medium text-ink-2 hover:bg-surface hover:text-ink">
              Home
            </Link>
            <Link href="/sobre" onClick={() => setOpen(false)} className="block rounded-[10px] px-4 py-3 text-sm font-medium text-ink-2 hover:bg-surface hover:text-ink">
              Quem somos
            </Link>

            <div className="px-4 pt-3 pb-1 text-[10px] font-bold text-ink-3 uppercase tracking-[.15em]">
              Produtos por categoria
            </div>
            {navCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorias/${cat.slug}`}
                onClick={() => setOpen(false)}
                className="block rounded-[10px] px-6 py-2.5 text-sm font-medium text-ink-2 hover:bg-surface hover:text-ink"
              >
                {cat.name}
              </Link>
            ))}

            <div className="my-2 border-t border-line" />
            <Link href="/produtos" onClick={() => setOpen(false)} className="block rounded-[10px] px-4 py-3 text-sm font-medium text-ink-2 hover:bg-surface hover:text-ink">
              Catálogo completo
            </Link>
            <Link href="/contato" onClick={() => setOpen(false)} className="block rounded-[10px] px-4 py-3 text-sm font-medium text-ink-2 hover:bg-surface hover:text-ink">
              Contato
            </Link>
            <a
              href={whatsappUrl("Olá! Quero falar com a Trust Tools.")}
              target="_blank"
              rel="noopener"
              className="btn btn-primary btn-sm mt-2"
              onClick={() => setOpen(false)}
            >
              Fale Conosco no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
