import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CategoryForm } from "../_components/category-form";

export default function NovaCategoriaPage() {
  return (
    <div>
      <Link href="/admin/categorias" className="inline-flex items-center gap-1 text-sm text-ink-3 hover:text-ink mb-4">
        <ChevronLeft className="h-4 w-4" /> Voltar
      </Link>
      <div className="mb-8">
        <h1 className="h-section text-[1.75rem]">Nova categoria</h1>
      </div>
      <CategoryForm />
    </div>
  );
}
