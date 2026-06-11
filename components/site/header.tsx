"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn, whatsappUrl } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/sobre", label: "Trust Tools" },
  { href: "/produtos", label: "Produtos" },
  { href: "/catalogos", label: "Catálogos" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[76px] backdrop-blur-md transition-all",
        scrolled ? "bg-white/85 border-b border-line" : "bg-bg/80 border-b border-transparent",
      )}
    >
      <div className="tt-container flex h-full items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 font-display font-bold text-ink">
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

        <nav
          aria-label="Principal"
          className={cn(
            "items-center gap-1",
            open
              ? "flex absolute top-[76px] left-0 right-0 flex-col gap-1 bg-white p-4 border-b border-line shadow-md"
              : "hidden md:flex",
          )}
        >
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "inline-block rounded-[10px] px-3.5 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-brand-100 text-brand-700"
                    : "text-ink-2 hover:bg-surface hover:text-ink",
                  open && "w-full",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener"
            className="btn btn-primary btn-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 3.5C18.3 1.2 15.3 0 12.1 0 5.5 0 .1 5.4.1 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.4 5.7 1.4 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.4-8.3zm-8.4 18.4c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.6-1.5-3.4-1.5-5.3 0-5.5 4.5-9.9 9.9-9.9 2.7 0 5.1 1 7 2.9s2.9 4.4 2.9 7c0 5.5-4.4 9.9-9.9 9.9z" />
            </svg>
            WhatsApp
          </a>
          <button
            type="button"
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-[10px] border border-line bg-white text-ink"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
