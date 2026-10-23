import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin_/redefinir-senha")({
  ssr: false,
  head: () => ({ meta: [{ title: "Redefinir senha — Choc4lovers" }, { name: "robots", content: "noindex" }] }),
  component: Reset,
});

function Reset() {
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) return toast.error("Use ao menos 8 caracteres.");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return toast.error("Link inválido ou expirado.");
    toast.success("Senha atualizada.");
    nav({ to: "/admin" });
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-admin-bg px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-3xl bg-card p-8 shadow-lift">
        <h1 className="text-xl font-semibold">Nova senha</h1>
        <div><Label htmlFor="pw">Senha</Label><Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1.5" /></div>
        <Button type="submit" className="w-full">Salvar</Button>
      </form>
    </main>
  );
}
