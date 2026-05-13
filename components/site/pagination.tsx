import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  total: number;
  page: number;
  perPage: number;
  buildHref: (page: number) => string;
};

export function Pagination({ total, page, perPage, buildHref }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;

  // Janela de páginas: sempre mostra 1, current-1, current, current+1, last
  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (let p = page - 1; p <= page + 1; p++) {
    if (p > 0 && p <= totalPages) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);

  // Inserir "..." onde houver gap
  const items: (number | "ellipsis")[] = [];
  let prev: number | null = null;
  for (const p of sorted) {
    if (prev !== null && p - prev > 1) items.push("ellipsis");
    items.push(p);
    prev = p;
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Paginação">
      <PageLink
        href={buildHref(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </PageLink>

      {items.map((it, i) =>
        it === "ellipsis" ? (
          <span key={`e${i}`} className="px-2 text-ink-3 select-none">…</span>
        ) : (
          <PageLink
            key={it}
            href={buildHref(it)}
            active={it === page}
            aria-label={`Página ${it}`}
            aria-current={it === page ? "page" : undefined}
          >
            {it}
          </PageLink>
        ),
      )}

      <PageLink
        href={buildHref(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
  "aria-current"?: "page";
}) {
  const cls = cn(
    "min-w-[40px] h-10 px-3 grid place-items-center rounded-lg text-sm font-semibold transition",
    active
      ? "text-white shadow-[var(--shadow-glow)]"
      : "text-ink-2 hover:bg-surface-soft hover:text-ink border border-line bg-white",
    disabled && "opacity-40 pointer-events-none",
  );
  if (disabled || active) {
    return (
      <span
        className={cls}
        style={active ? { background: "var(--grad-primary)" } : undefined}
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
      >
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
