"use client";
import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Props = {
  as?: "div" | "section" | "span" | "p" | "h1" | "h2" | "h3" | "ul" | "li" | "a";
  className?: string;
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
  id?: string;
};

export function Reveal({
  as = "div",
  className,
  children,
  delay = 0,
  style,
  id,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as keyof React.JSX.IntrinsicElements;
  const mergedStyle = delay
    ? { ...style, transitionDelay: `${delay}ms` }
    : style;

  return (
    // @ts-expect-error - dynamic tag
    <Tag ref={ref} id={id} className={cn("reveal", className)} style={mergedStyle}>
      {children}
    </Tag>
  );
}
