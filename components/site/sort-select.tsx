"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ArrowUpDown } from "lucide-react";

const OPTIONS = [
  { value: "relevance", label: "Mais relevantes" },
  { value: "name-asc", label: "Nome (A-Z)" },
  { value: "name-desc", label: "Nome (Z-A)" },
  { value: "recent", label: "Mais recentes" },
];

export function SortSelect() {
  const router = useRouter();
  const params = useSearchParams();
  const [_, startTransition] = useTransition();
  const value = params.get("sort") || "relevance";

  function onChange(v: string) {
    const next = new URLSearchParams(params.toString());
    next.delete("page");
    if (v === "relevance") next.delete("sort");
    else next.set("sort", v);
    startTransition(() => {
      router.push(`/produtos${next.toString() ? `?${next.toString()}` : ""}`);
    });
  }

  return (
    <div className="relative">
      <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-9 pr-9 py-2.5 bg-white border border-line-strong rounded-full text-sm font-semibold text-ink cursor-pointer hover:border-brand-300 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-ink-3 pointer-events-none"
        viewBox="0 0 12 12" fill="currentColor"
      >
        <path d="M6 8L2 4h8z" />
      </svg>
    </div>
  );
}
