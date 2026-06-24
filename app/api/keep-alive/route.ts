import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// Sempre dinâmico — nunca cacheia o ping.
export const dynamic = "force-dynamic";

/**
 * Keep-alive do Supabase.
 * Faz uma consulta leve para manter o projeto ativo (o plano free do
 * Supabase pausa após ~7 dias sem atividade). Acionado pelo Vercel Cron
 * a cada 2 dias (ver vercel.json).
 *
 * Se a env CRON_SECRET estiver definida, exige o header
 * `Authorization: Bearer <CRON_SECRET>` (o Vercel Cron envia automaticamente).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const supabase = createAdminClient();
    const { count, error } = await supabase
      .from("categories")
      .select("id", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      ping: "supabase",
      categories: count ?? 0,
      at: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "erro" },
      { status: 500 },
    );
  }
}
