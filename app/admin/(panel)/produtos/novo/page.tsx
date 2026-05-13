import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../_components/product-form";

export const dynamic = "force-dynamic";

export default async function NovoProdutoPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  return (
    <div>
      <Link href="/admin/produtos" className="inline-flex items-center gap-1 text-sm text-ink-3 hover:text-ink mb-4">
        <ChevronLeft className="h-4 w-4" />
        Voltar para produtos
      </Link>
      <div className="mb-8">
        <h1 className="h-section text-[1.75rem]">Novo produto</h1>
        <p className="text-ink-2 mt-1">
          Crie o produto agora. As fotos podem ser adicionadas depois de salvar.
        </p>
      </div>

      {!categories || categories.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-[16px] p-6">
          <h3 className="text-base font-semibold text-yellow-900 mb-1">
            Crie uma categoria primeiro
          </h3>
          <p className="text-sm text-yellow-800 mb-3">
            Você precisa de pelo menos uma categoria antes de cadastrar produtos.
          </p>
          <Link href="/admin/categorias/nova" className="btn btn-primary btn-sm inline-flex">
            Criar categoria
          </Link>
        </div>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
