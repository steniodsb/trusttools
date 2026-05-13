import { Reveal } from "./reveal";

export function SubHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
}) {
  return (
    <section
      className="relative overflow-hidden pt-[108px] pb-16 text-center"
      style={{ background: "linear-gradient(180deg, #F4F7FB 0%, #EAF1FF 100%)" }}
    >
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "var(--grad-aurora)" }} />
      <div className="tt-container relative z-10 flex flex-col items-center gap-4">
        <Reveal as="span" className="eyebrow">{eyebrow}</Reveal>
        <Reveal as="h1" className="h-display">{title}</Reveal>
        {description && (
          <Reveal as="p" className="text-lead mx-auto">{description}</Reveal>
        )}
      </div>
    </section>
  );
}
