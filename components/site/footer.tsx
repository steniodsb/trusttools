import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/utils";

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden pt-20 pb-8 text-white/70"
      style={{ background: "linear-gradient(180deg, #061E4D 0%, #04122F 100%)" }}
    >
      <div className="absolute left-0 right-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,209,255,.5), transparent)" }} />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[200px] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(30,99,233,.18), transparent 60%)" }}
      />

      <div className="tt-container relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 lg:gap-12 mb-14">
          <div>
            <Link href="/" className="flex items-center gap-3 text-white font-display font-bold text-[1.1rem] mb-3.5">
              <Image
                src="/logo-tt.png"
                alt="Trust Tools"
                width={42}
                height={42}
                className="h-[42px] w-[42px] object-contain brightness-0 invert opacity-90"
              />
              <span>Trust Tools</span>
            </Link>
            <p className="max-w-xs text-sm text-white/65 leading-relaxed">
              Trust Tools Importação e Exportação Ltda. Ferramentas industriais que sustentam a sua produção.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm uppercase tracking-[.14em] font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-white/65">
              <li>{siteConfig.phone}</li>
              <li>{siteConfig.whatsappDisplay} — WhatsApp</li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm uppercase tracking-[.14em] font-semibold mb-4">Unidades</h4>
            <ul className="space-y-2 text-sm text-white/65">
              {siteConfig.addresses.map((a) => (
                <li key={a.tag}>{a.city} — {a.tag}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm uppercase tracking-[.14em] font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm text-white/65">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/sobre" className="hover:text-white">Sobre</Link></li>
              <li><Link href="/produtos" className="hover:text-white">Produtos</Link></li>
              <li><Link href="/catalogos" className="hover:text-white">Catálogos</Link></li>
              <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-3 text-[13px] text-white/50">
          <span>© {new Date().getFullYear()} Trust Tools Importação e Exportação Ltda. Todos os direitos reservados.</span>
          <div className="flex gap-2.5">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-[10px] border border-white/10 bg-white/[.06] text-white/70 transition-all hover:-translate-y-0.5 hover:border-transparent hover:text-white hover:bg-brand-500"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
              className="grid h-9 w-9 place-items-center rounded-[10px] border border-white/10 bg-white/[.06] text-white/70 transition-all hover:-translate-y-0.5 hover:border-transparent hover:text-white hover:bg-brand-500"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn"
              className="grid h-9 w-9 place-items-center rounded-[10px] border border-white/10 bg-white/[.06] text-white/70 transition-all hover:-translate-y-0.5 hover:border-transparent hover:text-white hover:bg-brand-500"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
