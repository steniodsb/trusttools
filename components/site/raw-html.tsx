"use client";

import { useEffect, useRef } from "react";

/**
 * Injeta um trecho de HTML/JS arbitrário (campos "código personalizado" do
 * admin) e re-executa as tags <script> — necessário porque navegadores não
 * executam scripts inseridos via innerHTML.
 */
export function RawHtml({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !html) return;
    el.innerHTML = html;
    el.querySelectorAll("script").forEach((old) => {
      const s = document.createElement("script");
      for (const attr of Array.from(old.attributes)) {
        s.setAttribute(attr.name, attr.value);
      }
      s.text = old.textContent || "";
      old.replaceWith(s);
    });
  }, [html]);

  return <div ref={ref} hidden />;
}
