"use client";
import { useId, useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { uploadCategoryImage } from "../actions";
import { cn } from "@/lib/utils";

const MAX_MB = 5;

export function CategoryImageUpload({
  value,
  onChange,
  onUploaded,
  disabled,
}: {
  value: string;
  onChange: (url: string) => void;
  /** Chamado a cada upload concluído, para limpar órfãos depois. */
  onUploaded?: (url: string) => void;
  disabled?: boolean;
}) {
  const inputId = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const busy = uploading || disabled;

  async function send(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Imagem acima de ${MAX_MB}MB`);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadCategoryImage(formData);
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";

    if (!result.success || !result.url) {
      toast.error(result.error || "Erro ao enviar imagem");
      return;
    }
    onUploaded?.(result.url);
    onChange(result.url);
    toast.success("Imagem enviada");
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    if (busy) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void send(file);
  }

  return (
    <div>
      <input
        ref={fileInput}
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void send(file);
        }}
        className="sr-only"
      />

      {value ? (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-56 aspect-[4/3] shrink-0 rounded-xl overflow-hidden border border-line bg-bg">
            <Image src={value} alt="Imagem da categoria" fill className="object-cover" sizes="224px" />
            {uploading && (
              <div className="absolute inset-0 grid place-items-center bg-white/70">
                <Loader2 className="h-5 w-5 animate-spin text-brand-700" />
              </div>
            )}
          </div>
          <div className="flex sm:flex-col gap-2 sm:justify-center">
            <label
              htmlFor={inputId}
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-line-strong text-sm font-semibold text-ink-2 cursor-pointer hover:border-brand-500 hover:text-brand-700 transition",
                busy && "opacity-60 pointer-events-none",
              )}
            >
              <RefreshCw className="h-4 w-4" /> Trocar imagem
            </label>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={busy}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-line-strong text-sm font-semibold text-ink-2 hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-60 transition"
            >
              <Trash2 className="h-4 w-4" /> Remover
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            if (!busy) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2 py-10 px-6 text-center border-2 border-dashed rounded-xl cursor-pointer transition",
            dragging
              ? "border-brand-500 bg-brand-100/40"
              : "border-line-strong hover:border-brand-500 hover:bg-brand-100/20",
            busy && "opacity-60 pointer-events-none",
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-7 w-7 animate-spin text-brand-700" />
              <span className="text-sm font-semibold text-ink-2">Enviando...</span>
            </>
          ) : (
            <>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-100 text-brand-700">
                {dragging ? <UploadCloud className="h-5 w-5" /> : <ImagePlus className="h-5 w-5" />}
              </span>
              <span className="text-sm font-semibold text-ink">
                Arraste uma imagem ou <span className="text-brand-700">clique para selecionar</span>
              </span>
              <span className="text-xs text-ink-3">JPG, PNG, WebP ou AVIF · até {MAX_MB}MB · ideal 800×600</span>
            </>
          )}
        </label>
      )}
    </div>
  );
}
