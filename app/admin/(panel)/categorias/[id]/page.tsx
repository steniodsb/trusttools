import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CategoryForm } from "../_components/category-form";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditarCategoriaPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!category) notFound();

  return (
    <div>
      <Link href="/admin/categorias" className="inline-flex items-center gap-1 text-sm text-ink-3 hover:text-ink mb-4">
        <ChevronLeft className="h-4 w-4" /> Voltar
      </Link>
      <div className="mb-8">
        <h1 className="h-section text-[1.75rem]">{category.name}</h1>
        <p className="text-ink-2 mt-1">Editar categoria</p>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
