import type { Metadata } from "next";
import { MessageCircle, Phone, Mail, Clock, MapPin } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { SubHero } from "@/components/site/sub-hero";
import { siteConfig, whatsappUrl } from "@/lib/utils";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a Trust Tools. Cotação em até 4h úteis. WhatsApp, telefone, e-mail e unidades em Diadema e Jundiaí.",
};

const channels = [
  {
    icon: MessageCircle,
    title: "WhatsApp comercial",
    value: siteConfig.whatsappDisplay,
    sub: "Resposta em minutos no horário comercial",
    href: whatsappUrl("Olá! Quero fazer uma cotação."),
    external: true,
  },
  {
    icon: Phone,
    title: "Telefone",
    value: siteConfig.phone,
    sub: "Segunda a sexta, 08h às 18h",
    href: `tel:+551126682051`,
  },
  {
    icon: Mail,
    title: "E-mail",
    value: siteConfig.email,
    sub: "Resposta em até 4h úteis",
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: Clock,
    title: "Horário de atendimento",
    value: "Seg a sex — 08h às 18h",
    sub: "Sábado — 08h às 12h • Domingo fechado",
  },
];

export default function ContatoPage() {
  return (
    <>
      <SubHero
        eyebrow="FALE CONOSCO"
        title="Contato"
        description="Cotação em até 4h úteis. Pra urgência, WhatsApp resolve no mesmo minuto."
      />

      <section className="tt-section">
        <div className="tt-container">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10">
            {/* FORM */}
            <Reveal>
              <ContactForm />
            </Reveal>

            {/* CHANNELS */}
            <div className="grid gap-4 stagger">
              {channels.map((ch) => {
                const Icon = ch.icon;
                const inner = (
                  <>
                    <span
                      className="flex-shrink-0 grid h-11 w-11 place-items-center rounded-xl text-white shadow-[0_6px_14px_rgba(30,99,233,.35)]"
                      style={{ background: "var(--grad-primary)" }}
                    >
                      <Icon size={20} />
                    </span>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-ink">{ch.title}</h4>
                      <p className="text-ink-2 font-medium">{ch.value}</p>
                      <small className="text-xs text-ink-3">{ch.sub}</small>
                    </div>
                  </>
                );

                const className =
                  "tt-card p-5 flex items-start gap-4 transition hover:-translate-y-0.5";

                return (
                  <Reveal key={ch.title}>
                    {ch.href ? (
                      <a
                        href={ch.href}
                        target={ch.external ? "_blank" : undefined}
                        rel={ch.external ? "noopener" : undefined}
                        className={className}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className={className}>{inner}</div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* UNIDADES */}
      <section
        className="tt-section pt-0"
        style={{ background: "linear-gradient(180deg, transparent 0%, var(--color-surface-soft) 100%)" }}
      >
        <div className="tt-container">
          <Reveal className="section-head text-center pt-16">
            <span className="eyebrow">NOSSAS UNIDADES</span>
            <h2 className="h-section">
              Estoque físico em <span className="grad-text">São Paulo</span>.
            </h2>
            <p className="text-lead">
              Visite, retire na hora ou agende uma demonstração técnica nos nossos CDs.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 stagger">
            {siteConfig.addresses.map((addr) => {
              const mapsQuery = encodeURIComponent(`${addr.street} ${addr.city}`);
              return (
                <Reveal key={addr.city}>
                  <article className="tt-card p-8 h-full flex flex-col">
                    <span
                      className="self-start text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full text-white mb-4"
                      style={{ background: "var(--grad-primary)" }}
                    >
                      {addr.tag}
                    </span>
                    <h3 className="text-2xl mb-3 flex items-center gap-2">
                      <MapPin size={20} className="text-brand-500" />
                      {addr.city}
                    </h3>
                    <div className="text-ink-2 space-y-1 mb-4 flex-1">
                      <p>{addr.street}</p>
                      <p>{addr.cep}</p>
                      {addr.phone && (
                        <p className="font-medium text-ink mt-2">{addr.phone}</p>
                      )}
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                      target="_blank"
                      rel="noopener"
                      className="btn-link mt-auto"
                    >
                      Ver no mapa <span className="arrow">→</span>
                    </a>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="tt-section">
        <div className="tt-container">
          <Reveal
            className="relative overflow-hidden rounded-[28px] text-white text-center shadow-lg p-12 md:p-16"
            style={{ background: "var(--grad-primary)" }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 20% 30%, rgba(255,255,255,.2), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,209,255,.4), transparent 50%)",
              }}
            />
            <div className="relative">
              <h2 className="h-section text-white mb-4">Prefere resolver agora?</h2>
              <p className="text-white/85 max-w-xl mx-auto mb-7">
                WhatsApp direto com o comercial. Sem bot, sem fila.
              </p>
              <a
                href={whatsappUrl("Olá! Gostaria de fazer uma cotação.")}
                target="_blank"
                rel="noopener"
                className="btn btn-lg"
                style={{ background: "#fff", color: "var(--color-brand-700)" }}
              >
                Falar com a Trust Tools no WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
