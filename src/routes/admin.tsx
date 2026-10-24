import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Users, ShoppingBag, Settings, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { isOwnerEmail } from "@/lib/business";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user || !isOwnerEmail(data.user.email ?? "")) throw redirect({ to: "/admin/login" });
    const { data: staff, error } = await supabase.rpc("is_staff", { _user_id: data.user.id });
    if (error || !staff) throw redirect({ to: "/admin/login" });
    return { userEmail: data.user.email ?? "" };
  },
  head: () => ({ meta: [{ title: "Painel — Choc4lovers" }, { name: "description", content: "Administração restrita Choc4lovers." }, { property: "og:title", content: "Painel — Choc4lovers" }, { property: "og:description", content: "Administração restrita Choc4lovers." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
] as const;

function AdminLayout() {
  const { userEmail } = Route.useRouteContext();
  const qc = useQueryClient();
  const nav = useNavigate();
  async function logout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/admin/login", replace: true });
  }
  return (
    <div className="min-h-screen bg-admin-bg md:flex">
      <aside className="bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0">
        <div className="flex items-center justify-between p-4 md:block md:p-6"><Logo light className="text-xl" /></div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:px-3">
          {NAV.map(({ to, label, icon: I }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/admin" }}
              className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent"
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}>
              <I className="size-4" />{label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-end gap-3 border-b border-border bg-card px-6 py-3 text-sm">
          <span className="truncate text-muted-foreground">{userEmail}</span>
          <Button variant="ghost" size="sm" onClick={logout}><LogOut className="size-4" />Sair</Button>
        </header>
        <main className="p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
