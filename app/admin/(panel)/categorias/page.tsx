import Link from "next/link";
import { Plus, Pencil, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CategoryRowActions } from "./_components/category-row-actions";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*, products:products(id)")
    .order("display_order");

  const list = (categories || []).map((c: any) => ({
    ...c,
    product_count: c.products?.length || 0,
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="h-section text-[1.75rem]">Categorias</h1>
          <p className="text-ink-2 mt-1">Linhas de produto do catálogo.</p>
        </div>
        <Link href="/admin/categorias/nova" className="btn btn-primary btn-sm">
          <Plus className="h-4 w-4" /> Nova categoria
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-white border border-line rounded-[20px] p-12 text-center">
          <div className="grid mx-auto h-14 w-14 place-items-center rounded-full text-white mb-4" style={{ background: "var(--grad-primary)" }}>
            <Package className="h-6 w-6" />
          </div>
          <h2 className="text-xl mb-1">Nenhuma categoria ainda</h2>
          <p className="text-ink-2 mb-5">Crie as linhas de produto antes de cadastrar produtos.</p>
          <Link href="/admin/categorias/nova" className="btn btn-primary btn-sm inline-flex">
            Criar primeira categoria
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-line rounded-[20px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-bg border-b border-line text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-3">Nome</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-3 hidden md:table-cell">Produtos</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-3 hidden md:table-cell">Ordem</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c: any) => (
                <tr key={c.id} className="border-b border-line last:border-0 hover:bg-bg/50">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-ink">{c.name}</div>
                    <div className="text-xs text-ink-3">{c.slug}</div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-sm text-ink-2">
                    {c.product_count}
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-sm text-ink-2">
                    {c.display_order}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <CategoryRowActions id={c.id} productCount={c.product_count} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
