import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_EMAIL, COMMERCIAL_WHATSAPP } from "@/lib/business";
import { useServerFn } from "@tanstack/react-start";
import { retryLeadNotification } from "@/lib/notifications.functions";

export const Route = createFileRoute("/admin/configuracoes")({ head: () => ({ meta: [{ title: "Configurações — Choc4lovers" }, { name: "description", content: "Contatos e estado das notificações Choc4lovers." }, { property: "og:title", content: "Configurações — Choc4lovers" }, { property: "og:description", content: "Contatos e estado das notificações Choc4lovers." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }), component: Config });

const FIELDS = [
  ["whatsapp_phone", "WhatsApp comercial (com DDD)", true],
  ["contact_email", "E-mail de contato (rodapé)", true],
  ["instagram_url", "Link do Instagram", true],
  ["admin_notification_email", "E-mail que recebe avisos de novos leads", false],
] as const;

function Config() {
  const retry = useServerFn(retryLeadNotification);
  const [retrying, setRetrying] = useState(false);
  const [v, setV] = useState<Record<string, string>>({});
  const q = useQuery({
    queryKey: ["settings-admin"],
    queryFn: async () => Object.fromEntries(((await supabase.from("app_settings").select("key,value")).data ?? []).map((r) => [r.key, r.value ?? ""])),
  });
  useEffect(() => { if (q.data) setV(q.data); }, [q.data]);
  const pending = useQuery({
    queryKey: ["notif-pending"],
    queryFn: async () => (await supabase.from("notification_logs").select("status,error_detail,created_at,related_id").order("created_at", { ascending: false }).limit(1)).data?.[0] ?? null,
  });

  async function save() {
    const phone = COMMERCIAL_WHATSAPP;
    const rows = FIELDS.map(([key, , pub]) => ({ key, value: key === "whatsapp_phone" ? phone : key === "admin_notification_email" ? ADMIN_EMAIL : (v[key] ?? "").trim().slice(0, 300), is_public: pub }));
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
          <div key={k}><Label htmlFor={k}>{label}</Label><Input id={k} readOnly={k === "whatsapp_phone" || k === "admin_notification_email"} value={k === "whatsapp_phone" ? COMMERCIAL_WHATSAPP : k === "admin_notification_email" ? ADMIN_EMAIL : v[k] ?? ""} onChange={(e) => setV((p) => ({ ...p, [k]: e.target.value }))} className="mt-1.5" /></div>
        ))}
        <Button onClick={save}>Salvar</Button>
      </div>
      <div className="rounded-2xl bg-card p-6 text-sm shadow-soft">
        <p className="font-semibold">E-mail de novos leads</p>
        <p className="mt-1 text-muted-foreground">
          {!last ? "Nenhum envio tentado ainda." : last.status === "enviado" ? "Último envio: aceito pelo serviço; entrega não confirmada." : `Último envio: ${last.status === "falhou" ? "falhou" : "pendente"} — ${last.error_detail ?? ""}`}
        </p>
        <p className="mt-3 text-muted-foreground">Sem Resend. Os avisos aguardam um domínio próprio verificado e a ativação do envio de e-mails.</p>
        {last?.related_id && last.status !== "enviado" && <Button variant="outline" className="mt-4" disabled={retrying} onClick={async () => {
          if (!last.related_id) return;
          setRetrying(true);
          try { const result = await retry({ data: { leadId: last.related_id } }); toast.info(result.status === "enviado" ? "Envio aceito pelo serviço." : "Aviso pendente: configure o envio de e-mails primeiro."); await pending.refetch(); }
          catch { toast.error("Não foi possível tentar novamente. O lead permanece salvo."); }
          finally { setRetrying(false); }
        }}>Tentar notificação novamente</Button>}
      </div>
    </div>
  );
}
