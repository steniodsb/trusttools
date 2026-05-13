import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "./_components/sidebar";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-bg">
      <Sidebar userEmail={user.email || "admin"} />
      <div className="flex-1 lg:ml-0">
        <div className="lg:pl-0 px-4 lg:px-8 py-8 max-w-6xl mx-auto pt-20 lg:pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
