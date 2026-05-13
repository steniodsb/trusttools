import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function whatsappUrl(message?: string): string {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511978311084";
  const base = `https://wa.me/${num}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const siteConfig = {
  name: "Trust Tools",
  description:
    "Importação direta, estoque imediato em SP e suporte técnico real. Ferramentas industriais para construção, refratários, pedras e indústria pesada.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://trusttools.com.br",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511978311084",
  email: "comercial@trusttools.com.br",
  phone: "(11) 2668-2051",
  whatsappDisplay: "(11) 97831-1084",
  addresses: [
    {
      tag: "Matriz",
      city: "Diadema / SP",
      street: "R. Martins Fontes, 164 — Taboão",
      cep: "CEP 09940-330",
      phone: "(11) 2668-2051",
    },
    {
      tag: "Filial",
      city: "Jundiaí / SP",
      street: "Rod. Pres. Tancredo de Almeida Neves, 59400",
      cep: "Jardim Santa Gertrudes — CEP 13205-005",
    },
  ],
  social: {
    instagram: "https://www.instagram.com/trusttoolsbr/",
    facebook: "https://www.facebook.com/Trusttoolscomercial",
    linkedin: "https://br.linkedin.com/company/trust-tools-importacao-e-exportacao-ltda",
  },
};
