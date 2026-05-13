"use server";
import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autorizado");
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
  const { error } = await admin.from("categories").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/categorias");
  return { success: true };
}
