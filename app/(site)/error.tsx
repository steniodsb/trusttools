"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[site] runtime error:", error);
  }, [error]);

  return (
    <section className="min-h-[60vh] grid place-items-center px-6 py-20">
      <div className="text-center max-w-md">
        <div
          className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full text-white"
          style={{ background: "var(--grad-primary)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h1 className="h-section text-[1.5rem] mb-3">Ops, algo deu errado.</h1>
        <p className="text-ink-2 mb-6">
          Tivemos um problema ao carregar essa página. Tente recarregar — se persistir, fale com a gente pelo WhatsApp.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={reset} className="btn btn-primary btn-sm">
            Tentar novamente
          </button>
          <Link href="/" className="btn btn-ghost btn-sm">
            Voltar pra home
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-ink-3 mt-6">Código: {error.digest}</p>
        )}
      </div>
    </section>
  );
}
