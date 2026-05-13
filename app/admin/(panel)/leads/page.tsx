import { MessageSquare, Mail, Phone, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LeadStatusToggle } from "./_components/lead-status-toggle";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("inquiries")
    .select("*, product:products(name, slug)")
    .order("created_at", { ascending: false });

  const list = leads || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="h-section text-[1.75rem]">Leads</h1>
        <p className="text-ink-2 mt-1">{list.length} mensagens recebidas.</p>
      </div>

      {list.length === 0 ? (
        <div className="bg-white border border-line rounded-[20px] p-12 text-center">
          <div className="grid mx-auto h-14 w-14 place-items-center rounded-full text-white mb-4" style={{ background: "var(--grad-primary)" }}>
            <MessageSquare className="h-6 w-6" />
          </div>
          <h2 className="text-xl mb-1">Nenhum lead ainda</h2>
          <p className="text-ink-2">As mensagens do formulário de contato aparecem aqui.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((lead: any) => (
            <article key={lead.id} className="bg-white border border-line rounded-[16px] p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{lead.name}</h3>
                  <div className="text-xs text-ink-3 mt-0.5">
                    {new Date(lead.created_at).toLocaleString("pt-BR")}
                  </div>
                </div>
                <LeadStatusToggle id={lead.id} status={lead.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                {lead.email && (
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-ink-2 hover:text-brand-700">
                    <Mail className="h-4 w-4 text-ink-3" /> {lead.email}
                  </a>
                )}
                {lead.phone && (
                  <a href={`tel:${lead.phone.replace(/\D/g, "")}`} className="flex items-center gap-2 text-ink-2 hover:text-brand-700">
                    <Phone className="h-4 w-4 text-ink-3" /> {lead.phone}
                  </a>
                )}
                {lead.company && (
                  <span className="flex items-center gap-2 text-ink-2">
                    <Building2 className="h-4 w-4 text-ink-3" /> {lead.company}
                  </span>
                )}
                {lead.product && (
                  <span className="flex items-center gap-2 text-ink-2">
                    <span className="text-ink-3">Produto:</span> {lead.product.name}
                  </span>
                )}
              </div>

              <div className="bg-bg rounded-lg p-4 text-sm text-ink-2 whitespace-pre-line border border-line">
                {lead.message}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
