"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";

const inquirySchema = z.object({
  name: z.string().min(2, "Informe seu nome completo."),
  email: z.string().email("E-mail inválido."),
  phone: z.string().min(8, "Telefone inválido."),
  company: z.string().optional().default(""),
  message: z.string().min(5, "Descreva o que você precisa."),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export type SubmitResult = {
  success: boolean;
  error?: string;
};

export async function submitInquiry(input: InquiryInput): Promise<SubmitResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Dados inválidos.";
    return { success: false, error: first };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("inquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company || null,
      message: parsed.data.message,
    });

    if (error) {
      console.error("[submitInquiry] supabase error:", error);
      return { success: false, error: "Não foi possível registrar sua mensagem. Tente novamente." };
    }

    return { success: true };
  } catch (err) {
    console.error("[submitInquiry] unexpected error:", err);
    return { success: false, error: "Erro inesperado. Tente novamente em instantes." };
  }
}
