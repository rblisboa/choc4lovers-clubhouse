import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin_/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar — Painel Choc4lovers" },
      { name: "description", content: "Acesso restrito à equipe Choc4lovers." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel Choc4lovers" },
      { property: "og:description", content: "Acesso restrito." },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [canClaim, setCanClaim] = useState(false);

  async function afterAuth() {
    const { data: staff } = await supabase.rpc("is_staff", { _user_id: (await supabase.auth.getUser()).data.user!.id });
    if (staff) return nav({ to: "/admin", replace: true });
    const { data: exists } = await supabase.rpc("admin_exists");
    if (!exists) { setCanClaim(true); return; }
    await supabase.auth.signOut();
    toast.error("Esta conta não tem acesso ao painel.");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error("E-mail ou senha inválidos.");
    else await afterAuth();
    setBusy(false);
  }

  async function claim() {
    setBusy(true);
    const { data } = await supabase.rpc("claim_first_admin");
    setBusy(false);
    if (data) nav({ to: "/admin", replace: true });
    else toast.error("Já existe um administrador.");
  }

  async function forgot() {
    if (!email) return toast.error("Informe seu e-mail primeiro.");
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin/redefinir-senha` });
    toast.success("Se o e-mail estiver cadastrado, você receberá um link.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-admin-bg px-4">
      <div className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-lift">
        <Link to="/"><Logo /></Link>
        <h1 className="mt-6 text-xl font-semibold">Painel administrativo</h1>
        {canClaim ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">Ainda não existe administrador. Deseja tornar esta conta a administradora principal?</p>
            <Button onClick={claim} disabled={busy} className="w-full">Tornar-me administrador</Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" /></div>
            <div><Label htmlFor="pw">Senha</Label><Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1.5" /></div>
            <Button type="submit" disabled={busy} className="w-full">{busy && <Loader2 className="animate-spin" />}Entrar</Button>
            <button type="button" onClick={forgot} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">Esqueci minha senha</button>
          </form>
        )}
      </div>
    </main>
  );
}
