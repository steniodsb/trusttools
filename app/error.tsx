"use client";
import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[root] runtime error:", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#f4f7fb", margin: 0 }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "1.5rem" }}>
          <div style={{ maxWidth: 480, textAlign: "center" }}>
            <h1 style={{ color: "#0b1b33", fontSize: 24, marginBottom: 12 }}>
              Ops, algo deu errado
            </h1>
            <p style={{ color: "#364b6b", marginBottom: 20 }}>
              Tivemos um problema ao carregar esta página. Tente recarregar.
            </p>
            <button
              onClick={reset}
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg, #0a3a8c, #1e63e9, #00d1ff)",
                color: "white",
                border: 0,
                borderRadius: 999,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Tentar novamente
            </button>
            {error.digest && (
              <p style={{ fontSize: 12, color: "#6b7e9a", marginTop: 16 }}>
                Code: {error.digest}
              </p>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
