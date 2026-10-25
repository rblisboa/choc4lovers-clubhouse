import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authErrorMessage } from "@/lib/auth-errors";

export const Route = createFileRoute("/admin_/redefinir-senha")({
  ssr: false,
  head: () => ({ meta: [{ title: "Redefinir senha — Choc4lovers" }, { name: "description", content: "Recuperação segura da senha administrativa Choc4lovers." }, { property: "og:title", content: "Redefinir senha — Choc4lovers" }, { property: "og:description", content: "Recuperação segura da senha administrativa Choc4lovers." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: Reset,
});

function Reset() {
  const nav = useNavigate();
  const [valid, setValid] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const recovery = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";
    if (recovery) sessionStorage.setItem("choc-recovery", "true");
    const validate = () => { void supabase.auth.getUser().then(({ data }) => setValid(Boolean(data.user) && (recovery || sessionStorage.getItem("choc-recovery") === "true"))); };
    window.addEventListener("choc-password-recovery", validate);
    validate();
    return () => window.removeEventListener("choc-password-recovery", validate);
  }, []);
  const [pw, setPw] = useState("");
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || busy) return;
    if (pw.length < 8) return toast.error("Use ao menos 8 caracteres.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(authErrorMessage(error, "Não foi possível atualizar. Solicite outro link se ele estiver inválido ou expirado."));
    sessionStorage.removeItem("choc-recovery");
    toast.success("Senha atualizada.");
    nav({ to: "/admin" });
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-admin-bg px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-3xl bg-card p-8 shadow-lift">
        <h1 className="text-xl font-semibold">Nova senha</h1>
        <div><Label htmlFor="pw">Senha</Label><Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1.5" /></div>
        {!valid && <p role="alert" className="text-sm text-muted-foreground">Abra o link de recuperação recebido por e-mail. Se expirou, solicite outro na página de entrada.</p>}
        <Button type="submit" disabled={!valid || busy} className="w-full">Salvar</Button>
      </form>
    </main>
  );
}
