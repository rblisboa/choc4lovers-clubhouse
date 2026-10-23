import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizePhoneBR } from "@/lib/lead-schema";

export const Route = createFileRoute("/admin/configuracoes")({ component: Config });

const FIELDS = [
  ["whatsapp_phone", "WhatsApp comercial (com DDD)", true],
  ["contact_email", "E-mail de contato (rodapé)", true],
  ["instagram_url", "Link do Instagram", true],
  ["admin_notification_email", "E-mail que recebe avisos de novos leads", false],
] as const;

function Config() {
  const [v, setV] = useState<Record<string, string>>({});
  const q = useQuery({
    queryKey: ["settings-admin"],
    queryFn: async () => Object.fromEntries(((await supabase.from("app_settings").select("key,value")).data ?? []).map((r) => [r.key, r.value ?? ""])),
  });
  useEffect(() => { if (q.data) setV(q.data); }, [q.data]);
  const pending = useQuery({
    queryKey: ["notif-pending"],
    queryFn: async () => (await supabase.from("notification_logs").select("status,error_detail,created_at").order("created_at", { ascending: false }).limit(1)).data?.[0] ?? null,
  });

  async function save() {
    let phone = v.whatsapp_phone?.trim() ?? "";
    if (phone) { const n = normalizePhoneBR(phone); if (!n) return toast.error("WhatsApp inválido."); phone = n; }
    const rows = FIELDS.map(([key, , pub]) => ({ key, value: key === "whatsapp_phone" ? phone : (v[key] ?? "").trim().slice(0, 300), is_public: pub }));
    const { error } = await supabase.from("app_settings").upsert(rows);
    if (error) return toast.error("Apenas administradores podem alterar configurações.");
    toast.success("Configurações salvas."); q.refetch();
  }

  const last = pending.data;
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Configurações</h1>
      <div className="space-y-4 rounded-2xl bg-card p-6 shadow-soft">
        {FIELDS.map(([k, label]) => (
          <div key={k}><Label htmlFor={k}>{label}</Label><Input id={k} value={v[k] ?? ""} onChange={(e) => setV((p) => ({ ...p, [k]: e.target.value }))} className="mt-1.5" /></div>
        ))}
        <Button onClick={save}>Salvar</Button>
      </div>
      <div className="rounded-2xl bg-card p-6 text-sm shadow-soft">
        <p className="font-semibold">E-mail de novos leads (Resend)</p>
        <p className="mt-1 text-muted-foreground">
          {!last ? "Nenhum envio tentado ainda." : last.status === "enviado" ? "Último envio: realizado com sucesso." : `Último envio: ${last.status === "falhou" ? "falhou" : "pendente"} — ${last.error_detail ?? ""}`}
        </p>
      </div>
    </div>
  );
}
