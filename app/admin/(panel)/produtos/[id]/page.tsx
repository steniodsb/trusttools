import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../_components/product-form";
import { ImageManager } from "../_components/image-manager";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditarProdutoPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }, { data: images }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("display_order"),
    supabase
      .from("product_images")
      .select("*")
      .eq("product_id", id)
      .order("is_primary", { ascending: false })
      .order("display_order"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/produtos" className="inline-flex items-center gap-1 text-sm text-ink-3 hover:text-ink mb-4">
        <ChevronLeft className="h-4 w-4" />
        Voltar para produtos
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="h-section text-[1.75rem]">{product.name}</h1>
          <p className="text-ink-2 mt-1">Editar produto</p>
        </div>
        <Link
          href={`/produtos/${product.slug}`}
          target="_blank"
          className="btn btn-ghost btn-sm"
        >
          <ExternalLink className="h-4 w-4" />
          Ver no site
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="space-y-6">
          <ProductForm categories={categories || []} product={product} />
        </div>
        <div className="lg:sticky lg:top-8">
          <div className="bg-white border border-line rounded-[16px] p-6">
            <h3 className="text-base font-semibold text-ink mb-4">Fotos</h3>
            <ImageManager productId={product.id} images={images || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
