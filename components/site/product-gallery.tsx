"use client";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/lib/database.types";

export function ProductGallery({
  images,
  alt,
}: {
  images: ProductImage[];
  alt: string;
}) {
  const [idx, setIdx] = useState(0);
  const current = images[idx];

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-[20px] grid place-items-center text-white/80" style={{ background: "var(--grad-primary)" }}>
        <span className="font-display text-sm">Sem foto</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-[20px] border border-line bg-white">
        <Image
          src={current.url}
          alt={current.alt || alt}
          fill
          className="object-contain"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setIdx(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-[10px] border-2 transition",
                i === idx ? "border-brand-500" : "border-line hover:border-brand-300",
              )}
              aria-label={`Foto ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${alt} - ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
