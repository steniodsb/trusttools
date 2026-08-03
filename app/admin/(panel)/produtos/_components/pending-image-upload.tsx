"use client";
import { useId, type DragEvent } from "react";
import { ImagePlus, Star, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MAX_MB = 5;

export type StagedImage = { id: string; file: File; preview: string };

/** Seleção de fotos antes do produto existir. Sobem para o Storage após salvar. */
export function PendingImageUpload({
  items,
  onChange,
  disabled,
}: {
  items: StagedImage[];
  onChange: (next: StagedImage[]) => void;
  disabled?: boolean;
}) {
  const inputId = useId();

  function add(files: FileList | null) {
    if (!files || files.length === 0) return;
    const accepted: StagedImage[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name}: não é uma imagem`);
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        toast.error(`${file.name}: acima de ${MAX_MB}MB`);
        continue;
      }
      accepted.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      });
    }

    if (accepted.length) onChange([...items, ...accepted]);
  }

  function remove(id: string) {
    const target = items.find((i) => i.id === id);
    if (target) URL.revokeObjectURL(target.preview);
    onChange(items.filter((i) => i.id !== id));
  }

  function makePrimary(id: string) {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    onChange([target, ...items.filter((i) => i.id !== id)]);
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    if (disabled) return;
    add(e.dataTransfer.files);
  }

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((img, i) => (
            <div
              key={img.id}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 group bg-bg",
                i === 0 ? "border-brand-500" : "border-line",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.preview} alt={img.file.name} className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-brand-500 text-white text-[10px] font-bold uppercase rounded-full">
                  Principal
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-1.5 flex gap-1 justify-end bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(img.id)}
                    disabled={disabled}
                    className="h-7 w-7 grid place-items-center rounded-md bg-white/90 hover:bg-white text-ink-2 disabled:opacity-50"
                    title="Marcar como principal"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(img.id)}
                  disabled={disabled}
                  className="h-7 w-7 grid place-items-center rounded-md bg-white/90 hover:bg-red-50 text-red-700 disabled:opacity-50"
                  title="Remover"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        multiple
        disabled={disabled}
        onChange={(e) => {
          add(e.target.files);
          e.target.value = "";
        }}
        className="sr-only"
      />
      <label
        htmlFor={inputId}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 py-8 px-6 text-center border-2 border-dashed border-line-strong rounded-xl cursor-pointer hover:border-brand-500 hover:bg-brand-100/20 transition",
          disabled && "opacity-60 pointer-events-none",
        )}
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-100 text-brand-700">
          {items.length ? <UploadCloud className="h-5 w-5" /> : <ImagePlus className="h-5 w-5" />}
        </span>
        <span className="text-sm font-semibold text-ink">
          Arraste as fotos ou <span className="text-brand-700">clique para selecionar</span>
        </span>
        <span className="text-xs text-ink-3">
          JPG, PNG, WebP ou AVIF · até {MAX_MB}MB cada · a primeira vira a foto principal
        </span>
      </label>
    </div>
  );
}
