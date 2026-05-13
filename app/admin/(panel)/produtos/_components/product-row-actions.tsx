"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Pencil, ExternalLink, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProduct, toggleProductActive } from "../actions";

export function ProductRowActions({
  id,
  active,
  slug,
}: {
  id: string;
  active: boolean;
  slug: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onDelete() {
    if (!confirm("Excluir este produto? Esta ação não pode ser desfeita.")) return;
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success("Produto excluído");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao excluir");
      }
    });
  }

  function onToggleActive() {
    startTransition(async () => {
      const result = await toggleProductActive(id, !active);
      if (result.success) {
        toast.success(active ? "Produto desativado" : "Produto ativado");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao atualizar");
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/produtos/${slug}`}
        target="_blank"
        className="h-8 w-8 grid place-items-center rounded-lg text-ink-3 hover:bg-bg hover:text-ink"
        aria-label="Ver no site"
      >
        <ExternalLink className="h-4 w-4" />
      </Link>
      <button
        type="button"
        onClick={onToggleActive}
        disabled={pending}
        className="h-8 px-2.5 grid place-items-center rounded-lg text-xs font-medium text-ink-3 hover:bg-bg hover:text-ink disabled:opacity-50"
      >
        {active ? "Desativar" : "Ativar"}
      </button>
      <Link
        href={`/admin/produtos/${id}`}
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
