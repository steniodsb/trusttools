"use server";
import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autorizado");
}

export async function updateLeadStatus(id: string, status: string) {
  await requireAuth();
  if (!["new", "contacted", "closed"].includes(status)) {
    return { success: false, error: "Status inválido" };
  }
  const admin = createAdminClient();
  const { error } = await admin.from("inquiries").update({ status }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/leads");
  return { success: true };
}
