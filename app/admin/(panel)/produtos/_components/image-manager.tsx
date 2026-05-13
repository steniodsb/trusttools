"use client";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Star, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadProductImage, deleteProductImage, setPrimaryImage } from "../actions";
import type { ProductImage } from "@/lib/database.types";
import { cn } from "@/lib/utils";

export function ImageManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  async function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("product_id", productId);
      formData.append("alt", file.name.replace(/\.[^.]+$/, ""));
      // Primeira imagem se nenhuma existir = primary
      formData.append("is_primary", String(images.length === 0 && i === 0));

      const result = await uploadProductImage(formData);
      if (!result.success) {
        toast.error(`${file.name}: ${result.error}`);
      }
    }

    toast.success(files.length === 1 ? "Foto enviada" : `${files.length} fotos enviadas`);
    setUploading(false);
    router.refresh();
    if (fileInput.current) fileInput.current.value = "";
  }

  function onDelete(imageId: string) {
    if (!confirm("Excluir esta foto?")) return;
    startTransition(async () => {
      const r = await deleteProductImage(imageId, productId);
      if (r.success) {
        toast.success("Foto excluída");
        router.refresh();
      } else {
        toast.error(r.error || "Erro ao excluir");
      }
    });
  }

  function onSetPrimary(imageId: string) {
    startTransition(async () => {
      const r = await setPrimaryImage(imageId, productId);
      if (r.success) {
        toast.success("Foto principal atualizada");
        router.refresh();
      } else {
        toast.error(r.error || "Erro");
      }
    });
  }

  return (
    <div className="space-y-4">
      {images.length === 0 ? (
        <div className="text-center py-6 text-sm text-ink-3 border-2 border-dashed border-line rounded-lg">
          Nenhuma foto ainda
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {images.map((img) => (
            <div
              key={img.id}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 group",
                img.is_primary ? "border-brand-500" : "border-line",
              )}
            >
              <Image src={img.url} alt={img.alt || ""} fill className="object-cover" sizes="180px" />
              {img.is_primary && (
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-brand-500 text-white text-[10px] font-bold uppercase rounded-full">
                  Principal
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-1.5 flex gap-1 justify-end bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition">
                {!img.is_primary && (
                  <button
                    type="button"
                    onClick={() => onSetPrimary(img.id)}
                    disabled={pending}
                    className="h-7 w-7 grid place-items-center rounded-md bg-white/90 hover:bg-white text-ink-2 disabled:opacity-50"
                    title="Marcar como principal"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDelete(img.id)}
                  disabled={pending}
                  className="h-7 w-7 grid place-items-center rounded-md bg-white/90 hover:bg-red-50 text-red-700 disabled:opacity-50"
                  title="Excluir"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        onChange={onFileSelect}
        disabled={uploading || pending}
        className="hidden"
        id="img-upload"
      />
      <label
        htmlFor="img-upload"
        className={cn(
          "flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-line-strong rounded-lg cursor-pointer text-sm font-medium text-ink-2 hover:border-brand-500 hover:text-brand-700 hover:bg-brand-100/30 transition",
          (uploading || pending) && "opacity-60 pointer-events-none",
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Adicionar fotos
          </>
        )}
      </label>
      <p className="text-xs text-ink-3 text-center">
        JPG, PNG ou WebP até 5MB. Selecione múltiplas de uma vez.
      </p>
    </div>
  );
}
