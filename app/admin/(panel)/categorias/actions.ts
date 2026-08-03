"use server";
import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autorizado");
}

const BUCKET = "product-images";
const FOLDER = "categories";
const MAX_BYTES = 5 * 1024 * 1024;

/** Path dentro do bucket a partir da URL pública. Null se a URL não for nossa. */
function storagePath(url: string): string | null {
  const match = url.match(new RegExp(`/${BUCKET}/(${FOLDER}/[^?#]+)`));
  return match ? match[1] : null;
}

type CategoryInput = {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  image_url?: string;
  display_order?: number;
};

export async function createCategory(input: CategoryInput) {
  await requireAuth();
  const admin = createAdminClient();
  const slug = input.slug?.trim() || slugify(input.name);
  const { data, error } = await admin
    .from("categories")
    .insert({
      name: input.name,
      slug,
      description: input.description || null,
      icon: input.icon || null,
      image_url: input.image_url || null,
      display_order: input.display_order ?? 0,
    })
    .select("id")
    .single();
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/produtos");
  return { success: true, id: data.id };
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  await requireAuth();
  const admin = createAdminClient();
  const payload: any = {};
  if (input.name !== undefined) payload.name = input.name;
  if (input.slug !== undefined) payload.slug = input.slug;
  if (input.description !== undefined) payload.description = input.description || null;
  if (input.icon !== undefined) payload.icon = input.icon || null;
  if (input.image_url !== undefined) payload.image_url = input.image_url || null;
  if (input.display_order !== undefined) payload.display_order = input.display_order;
  const { error } = await admin.from("categories").update(payload).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/produtos");
  return { success: true };
}

/** Upload da imagem da categoria para o Supabase Storage. Retorna a URL pública. */
export async function uploadCategoryImage(formData: FormData) {
  await requireAuth();
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) return { success: false, error: "Nenhum arquivo enviado" };
  if (!file.type.startsWith("image/")) return { success: false, error: "O arquivo precisa ser uma imagem" };
  if (file.size > MAX_BYTES) return { success: false, error: "Imagem acima de 5MB" };

  const admin = createAdminClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${FOLDER}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await admin.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) return { success: false, error: error.message };

  const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(path);
  return { success: true, url: publicUrl };
}

/** Remove um arquivo do Storage. No-op para URLs externas (legado). */
export async function deleteCategoryImage(url: string) {
  await requireAuth();
  const path = storagePath(url);
  if (!path) return { success: true };
  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKET).remove([path]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAuth();
  const admin = createAdminClient();
  const { count } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);
  if ((count ?? 0) > 0) {
    return { success: false, error: `Esta categoria tem ${count} produtos. Mova-os antes de excluir.` };
  }
  const { data: cat } = await admin
    .from("categories")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await admin.from("categories").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  const path = cat?.image_url ? storagePath(cat.image_url) : null;
  if (path) await admin.storage.from(BUCKET).remove([path]);

  revalidatePath("/admin/categorias");
  return { success: true };
}
