import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductRowActions } from "./_components/product-row-actions";

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(`*, category:categories(name, slug), images:product_images(url, is_primary)`)
      .order("created_at", { ascending: false });
    return (data || []).map((p: any) => ({
      ...p,
      primary_image: p.images?.find((i: any) => i.is_primary) ?? p.images?.[0] ?? null,
    }));
  } catch {
    return [];
  }
}

export default async function AdminProdutosPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="h-section text-[1.75rem]">Produtos</h1>
          <p className="text-ink-2 mt-1">
            {products.length} {products.length === 1 ? "produto" : "produtos"} cadastrados.
          </p>
        </div>
        <Link href="/admin/produtos/novo" className="btn btn-primary btn-sm">
          <Plus className="h-4 w-4" /> Novo produto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-line rounded-[20px] p-12 text-center">
          <div className="grid mx-auto h-14 w-14 place-items-center rounded-full text-white mb-4" style={{ background: "var(--grad-primary)" }}>
            <Plus className="h-6 w-6" />
          </div>
          <h2 className="text-xl mb-1">Nenhum produto ainda</h2>
          <p className="text-ink-2 mb-5">Comece criando o primeiro produto do catálogo.</p>
          <Link href="/admin/produtos/novo" className="btn btn-primary btn-sm inline-flex">
            Criar primeiro produto
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-line rounded-[20px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-bg border-b border-line text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-3">Produto</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-3 hidden md:table-cell">Categoria</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-3 hidden md:table-cell">Status</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-bg/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-surface-soft border border-line">
                        {p.primary_image ? (
                          <Image src={p.primary_image.url} alt={p.name} fill className="object-cover" sizes="48px" />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center text-ink-3 text-xs">—</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-ink truncate">{p.name}</div>
                        <div className="text-xs text-ink-3 truncate">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-sm text-ink-2">
                    {p.category?.name || "—"}
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span
                      className={
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold " +
                        (p.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600")
                      }
                    >
                      {p.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {p.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ProductRowActions id={p.id} active={p.active} slug={p.slug} />
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
