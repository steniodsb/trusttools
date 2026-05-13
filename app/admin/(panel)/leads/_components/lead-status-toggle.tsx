"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { updateLeadStatus } from "../actions";
import { cn } from "@/lib/utils";

const STATUSES = [
  { key: "new", label: "Novo", color: "bg-red-100 text-red-700" },
  { key: "contacted", label: "Em contato", color: "bg-amber-100 text-amber-700" },
  { key: "closed", label: "Fechado", color: "bg-green-100 text-green-700" },
] as const;

export function LeadStatusToggle({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setStatus(s: string) {
    if (s === status) return;
    startTransition(async () => {
      const r = await updateLeadStatus(id, s);
      if (r.success) {
        toast.success("Status atualizado");
        router.refresh();
      } else toast.error(r.error || "Erro");
    });
  }

  return (
    <div className="flex gap-1.5">
      {STATUSES.map((s) => (
        <button
          key={s.key}
          type="button"
          onClick={() => setStatus(s.key)}
          disabled={pending}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-semibold transition disabled:opacity-50",
            status === s.key ? s.color : "bg-gray-100 text-gray-500 hover:bg-gray-200",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
