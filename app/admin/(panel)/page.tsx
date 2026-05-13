import Link from "next/link";
import { Package, Tags, MessageSquare, Plus, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const supabase = await createClient();
    const [products, categories, leads] = await Promise.all([
      supabase.from("products").select("id, active", { count: "exact", head: false }),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase.from("inquiries").select("id, status", { count: "exact", head: false }),
    ]);
    return {
      products: products.count || 0,
      activeProducts: (products.data || []).filter((p) => p.active).length,
      categories: categories.count || 0,
      leads: leads.count || 0,
      newLeads: (leads.data || []).filter((l) => l.status === "new").length,
    };
  } catch {
    return { products: 0, activeProducts: 0, categories: 0, leads: 0, newLeads: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="h-section text-[1.75rem]">Dashboard</h1>
        <p className="text-ink-2 mt-1">Visão geral do catálogo e leads.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          icon={Package}
          label="Produtos"
          value={stats.products}
          hint={`${stats.activeProducts} ativos`}
          href="/admin/produtos"
        />
        <StatCard
          icon={Tags}
          label="Categorias"
          value={stats.categories}
          hint="Linhas de produto"
          href="/admin/categorias"
        />
        <StatCard
          icon={MessageSquare}
          label="Leads"
          value={stats.leads}
          hint={stats.newLeads > 0 ? `${stats.newLeads} novos` : "Tudo em dia"}
          highlight={stats.newLeads > 0}
          href="/admin/leads"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <QuickAction
          title="Novo produto"
          description="Adicione um produto ao catálogo com fotos e especificações."
          href="/admin/produtos/novo"
          icon={Plus}
        />
        <QuickAction
          title="Nova categoria"
          description="Crie uma nova linha de produtos."
          href="/admin/categorias/nova"
          icon={Plus}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  highlight,
  href,
}: {
  icon: typeof Package;
  label: string;
  value: number;
  hint: string;
  highlight?: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white border border-line rounded-[20px] p-6 hover:border-brand-300 hover:shadow-md transition group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="grid h-10 w-10 place-items-center rounded-lg text-white" style={{ background: "var(--grad-primary)" }}>
          <Icon className="h-5 w-5" />
        </div>
        {highlight && (
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
            !
          </span>
        )}
      </div>
      <div className="text-3xl font-display font-bold text-ink leading-none mb-1">
        {value}
      </div>
      <div className="text-sm text-ink-2">{label}</div>
      <div className="text-xs text-ink-3 mt-2 flex items-center gap-1">
        <TrendingUp className="h-3 w-3" />
        {hint}
      </div>
    </Link>
  );
}

function QuickAction({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: typeof Plus;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 bg-white border border-line rounded-[20px] p-5 hover:border-brand-300 hover:shadow-md transition"
    >
      <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-lg text-white" style={{ background: "var(--grad-primary)" }}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <p className="text-sm text-ink-2 mt-0.5">{description}</p>
      </div>
    </Link>
  );
}
