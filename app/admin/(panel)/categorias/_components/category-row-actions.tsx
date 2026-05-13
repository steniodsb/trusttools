"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteCategory } from "../actions";

export function CategoryRowActions({ id, productCount }: { id: string; productCount: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onDelete() {
    if (productCount > 0) {
      toast.error(`Mova os ${productCount} produtos antes de excluir.`);
      return;
    }
    if (!confirm("Excluir esta categoria?")) return;
    startTransition(async () => {
      const r = await deleteCategory(id);
      if (r.success) {
        toast.success("Categoria excluída");
        router.refresh();
      } else {
        toast.error(r.error || "Erro");
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/admin/categorias/${id}`}
        className="h-8 w-8 grid place-items-center rounded-lg text-ink-3 hover:bg-bg hover:text-ink"
        aria-label="Editar"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className="h-8 w-8 grid place-items-center rounded-lg text-ink-3 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
        aria-label="Excluir"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
