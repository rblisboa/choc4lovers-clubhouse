import type { Database } from "@/integrations/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ADMIN_EMAIL } from "./business";
import { brl, dateTimeBR } from "./format";
import { FREQUENCY } from "./labels";

type Lead = Database["public"]["Tables"]["leads"]["Row"];
type Admin = SupabaseClient<Database>;
export type EmailStatus = "pendente" | "enviado" | "falhou";

/** Safe payload for the managed sender once an owned sending domain is verified. */
export function leadNotificationData(lead: Lead) {
  return {
    to: ADMIN_EMAIL,
    subject: "Novo lead recebido — Choc4lovers",
    name: lead.full_name, email: lead.email, whatsapp: lead.whatsapp,
    city: `${lead.city}/${lead.state}`,
    preferences: [...lead.preferences, ...(lead.surprise_me ? ["Quero ser surpreendido"] : [])].join(", "),
    budget: brl(lead.budget), frequency: FREQUENCY[lead.frequency ?? ""] ?? lead.frequency ?? "A definir",
    quantity: lead.quantity || "A definir com a equipe", notes: lead.plan_notes || "—",
    date: dateTimeBR(lead.created_at), code: lead.code,
  };
}

/** No provider is configured: persist an honest pending state, never simulate sending. */
export async function notifySavedLead(admin: Admin, lead: Lead, retry = false): Promise<EmailStatus> {
  const dedupe = `admin_new_lead:${lead.id}`;
  const { data: existing, error: readError } = await admin.from("notification_logs")
    .select("id,status,attempts").eq("dedupe_key", dedupe).maybeSingle();
  if (readError) throw new Error("notification_read_failed");
  if (existing?.status === "enviado") return "enviado";
  if (existing && !retry) return existing.status === "falhou" ? "falhou" : "pendente";
  const payload = leadNotificationData(lead);
  const row = {
    kind: "admin_new_lead", recipient: payload.to, related_table: "leads", related_id: lead.id,
    dedupe_key: dedupe, status: "pendente", attempts: (existing?.attempts ?? 0) + 1,
    error_detail: "Envio não configurado: falta verificar um domínio próprio de envio. Resend não é utilizado.",
  };
  const { error } = existing
    ? await admin.from("notification_logs").update(row).eq("id", existing.id)
    : await admin.from("notification_logs").upsert(row, { onConflict: "dedupe_key", ignoreDuplicates: true });
  if (error) throw new Error("notification_write_failed");
  return "pendente";
}