import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_EMAIL, isOwnerEmail } from "@/lib/business";
import { firstAccessStatus } from "@/lib/admin-access.functions";

export const Route = createFileRoute("/admin_/login")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Entrar — Painel Choc4lovers" },
    { name: "description", content: "Acesso seguro e exclusivo à administração Choc4lovers." },
    { name: "robots", content: "noindex" },
    { property: "og:title", content: "Entrar — Painel Choc4lovers" },
    { property: "og:description", content: "Acesso seguro e exclusivo à administração Choc4lovers." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const status = useServerFn(firstAccessStatus);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => { status().then(r => setAvailable(r.available)).catch(() => setAvailable(false)); }, [status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!isOwnerEmail(email)) return toast.error("Este e-mail não está autorizado para acesso administrativo.");
    if (creating && password.length < 8) return toast.error("Use uma senha com pelo menos 8 caracteres.");
    if (creating && password !== confirmPassword) return toast.error("As senhas não coincidem.");
    setBusy(true); setNotice("");
    try {
      if (creating) {
        const current = await status();
        if (!current.available) { setAvailable(false); setCreating(false); throw new Error("A conta já existe. Entre com sua senha ou use a recuperação."); }
        const { data, error } = await supabase.auth.signUp({ email: ADMIN_EMAIL, password, options: { emailRedirectTo: `${window.location.origin}/admin/login` } });
        if (error) throw new Error("Não foi possível criar o acesso. Se a conta já existe, entre ou recupere sua senha. Confira também os requisitos de segurança da senha.");
        setPassword(""); setConfirmPassword(""); setCreating(false); setAvailable(false);
        if (!data.session) { setNotice("Acesso criado. Confira seu e-mail e confirme o endereço antes de entrar com a senha escolhida."); return; }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
        if (error) throw new Error("Não foi possível entrar. Confira e-mail e senha e confirme seu endereço pelo link recebido.");
      }
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user || !isOwnerEmail(userData.user.email ?? "")) throw new Error("Acesso não autorizado.");
      const { data: staff, error: staffError } = await supabase.rpc("is_staff", { _user_id: userData.user.id });
      if (staffError || !staff) { await supabase.auth.signOut(); throw new Error("Esta conta não tem acesso ao painel."); }
      await nav({ to: "/admin", replace: true });
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível concluir. Tente novamente."); }
    finally { setBusy(false); }
  }

  async function forgot() {
    if (!isOwnerEmail(email)) return toast.error("Informe o e-mail administrativo autorizado.");
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, { redirectTo: `${window.location.origin}/admin/redefinir-senha` });
      if (error) throw error;
      toast.success("Se a conta estiver cadastrada, você receberá um link de recuperação.");
    } catch { toast.error("Não foi possível solicitar a recuperação agora. Tente novamente mais tarde."); }
    finally { setBusy(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-admin-bg px-4 py-8">
      <div className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-lift">
        <Link to="/"><Logo /></Link>
        <h1 className="mt-6 text-xl font-semibold">{creating ? "Primeiro acesso administrativo" : "Painel administrativo"}</h1>
        {notice && <p role="status" className="mt-4 text-sm text-muted-foreground">{notice}</p>}
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1.5" /></div>
          <div><Label htmlFor="pw">Senha</Label><Input id="pw" type="password" autoComplete={creating ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={creating ? 8 : undefined} className="mt-1.5" /></div>
          {creating && <div><Label htmlFor="confirm-pw">Confirmar senha</Label><Input id="confirm-pw" type="password" autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1.5" /></div>}
          <Button type="submit" disabled={busy} className="w-full">{busy && <Loader2 className="animate-spin" />}{creating ? "Criar acesso administrativo" : "Entrar"}</Button>
          {!creating && <Button type="button" variant="ghost" onClick={forgot} disabled={busy} className="w-full">Esqueci minha senha</Button>}
        </form>
        {creating ? <Button variant="link" onClick={() => { setCreating(false); setPassword(""); setConfirmPassword(""); }} disabled={busy} className="mt-4 w-full">Voltar para entrar</Button> :
          available === true ? <Button variant="link" className="mt-4 h-auto w-full whitespace-normal" onClick={() => { setCreating(true); setEmail(ADMIN_EMAIL); setPassword(""); }}>Primeiro acesso? Criar conta de administrador</Button> :
          available === false && <p className="mt-4 text-sm text-muted-foreground">O primeiro cadastro não está disponível. Se já possui conta, entre ou recupere sua senha.</p>}
      </div>
    </main>
  );
}
