"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

/** Verifica que há sessão válida antes de qualquer mutação. */
async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autorizado");
  return user;
}

type ProductInput = {
  name: string;
  slug?: string;
  category_id: string;
  short_description?: string;
  long_description?: string;
  applications?: string[];
  specs?: Record<string, string>;
  brand?: string;
  tags?: string[];
  featured?: boolean;
  active?: boolean;
  display_order?: number;
};

export async function createProduct(input: ProductInput) {
  await requireAuth();
  const admin = createAdminClient();
  const slug = input.slug?.trim() || slugify(input.name);

  const { data, error } = await admin
    .from("products")
    .insert({
      slug,
      name: input.name,
      category_id: input.category_id,
      short_description: input.short_description || null,
      long_description: input.long_description || null,
      applications: input.applications || [],
      specs: input.specs || {},
      brand: input.brand || null,
      tags: input.tags || [],
      featured: !!input.featured,
      active: input.active ?? true,
      display_order: input.display_order ?? 0,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  return { success: true, id: data.id };
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  await requireAuth();
  const admin = createAdminClient();

  const payload: any = {};
  if (input.name !== undefined) payload.name = input.name;
  if (input.slug !== undefined) payload.slug = input.slug;
  if (input.category_id !== undefined) payload.category_id = input.category_id;
  if (input.short_description !== undefined) payload.short_description = input.short_description || null;
  if (input.long_description !== undefined) payload.long_description = input.long_description || null;
  if (input.applications !== undefined) payload.applications = input.applications;
  if (input.specs !== undefined) payload.specs = input.specs;
  if (input.brand !== undefined) payload.brand = input.brand || null;
  if (input.tags !== undefined) payload.tags = input.tags;
  if (input.featured !== undefined) payload.featured = input.featured;
  if (input.active !== undefined) payload.active = input.active;
  if (input.display_order !== undefined) payload.display_order = input.display_order;

  const { error } = await admin.from("products").update(payload).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${id}`);
  revalidatePath("/produtos");
  if (payload.slug) revalidatePath(`/produtos/${payload.slug}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAuth();
  const admin = createAdminClient();
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  return { success: true };
}

export async function toggleProductActive(id: string, active: boolean) {
  return updateProduct(id, { active });
}

/** Upload de imagem para Supabase Storage e criação de product_images row. */
export async function uploadProductImage(formData: FormData) {
  await requireAuth();
  const file = formData.get("file") as File | null;
  const productId = formData.get("product_id") as string | null;
  const alt = (formData.get("alt") as string | null) || null;
  const isPrimary = formData.get("is_primary") === "true";

  if (!file || !productId) {
    return { success: false, error: "Arquivo ou produto faltando" };
  }

  const admin = createAdminClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("product-images")
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (uploadError) return { success: false, error: uploadError.message };

  const {
    data: { publicUrl },
  } = admin.storage.from("product-images").getPublicUrl(path);

  // Se for primary, desmarcar outras primárias do mesmo produto
  if (isPrimary) {
    await admin
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);
  }

  // Pegar ordem máxima atual
  const { data: existingImgs } = await admin
    .from("product_images")
    .select("display_order")
    .eq("product_id", productId)
    .order("display_order", { ascending: false })
    .limit(1);
  const nextOrder = (existingImgs?.[0]?.display_order ?? -1) + 1;

  const { data, error } = await admin
    .from("product_images")
    .insert({
      product_id: productId,
      url: publicUrl,
      alt,
      is_primary: isPrimary,
      display_order: nextOrder,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/produtos");
  return { success: true, image: data };
}

export async function deleteProductImage(imageId: string, productId: string) {
  await requireAuth();
  const admin = createAdminClient();

  const { data: img } = await admin
    .from("product_images")
    .select("url")
    .eq("id", imageId)
    .maybeSingle();

  if (img?.url) {
    // Extrair path do bucket da URL pública
    const match = img.url.match(/product-images\/(.+)$/);
    if (match) {
      await admin.storage.from("product-images").remove([match[1]]);
    }
  }

  const { error } = await admin.from("product_images").delete().eq("id", imageId);
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/produtos/${productId}`);
  return { success: true };
}

export async function setPrimaryImage(imageId: string, productId: string) {
  await requireAuth();
  const admin = createAdminClient();

  await admin
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);

  const { error } = await admin
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", imageId);

  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/produtos/${productId}`);
  return { success: true };
}
