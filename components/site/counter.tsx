"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

export function Counter({ target, prefix = "", suffix = "", duration = 1600 }: Props) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;
    if (!("IntersectionObserver" in window)) {
      setVal(target);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      const start = performance.now();
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setVal(Math.floor(target * easeOut(p)));
        if (p < 1) requestAnimationFrame(tick);
        else setVal(target);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}
