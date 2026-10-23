import { createServerFn } from "@tanstack/react-start";
import { leadSchema, normalizePhoneBR } from "./lead-schema";
import { brl } from "./format";
import { FREQUENCY } from "./labels";

export type SubmitLeadResult = {
  code: string;
  whatsappPhone: string;
  emailStatus: "enviado" | "pendente" | "falhou";
};

function esc(s: unknown) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** Public endpoint: validates input on the server and creates a lead with the privileged client. */
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const parsed = leadSchema.safeParse(input);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
    return parsed.data;
  })
  .handler(async ({ data }): Promise<SubmitLeadResult> => {
    if (data.website) throw new Error("Envio bloqueado");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const settingsRes = await supabaseAdmin
      .from("app_settings")
      .select("key,value")
      .in("key", ["whatsapp_phone", "admin_notification_email"]);
    const settings = Object.fromEntries((settingsRes.data ?? []).map((r) => [r.key, r.value ?? ""]));
    const whatsappPhone = settings.whatsapp_phone ?? "";

    // Idempotency: repeated clicks reuse the same submission_key
    const existing = await supabaseAdmin
      .from("leads")
      .select("id,code")
      .eq("submission_key", data.submission_key)
      .maybeSingle();
    if (existing.data) {
      const log = await supabaseAdmin
        .from("notification_logs")
        .select("status")
        .eq("dedupe_key", `admin_new_lead:${existing.data.id}`)
        .maybeSingle();
      return {
        code: existing.data.code,
        whatsappPhone,
        emailStatus: log.data?.status === "enviado" ? "enviado" : log.data?.status === "falhou" ? "falhou" : "pendente",
      };
    }

    const { data: lead, error } = await supabaseAdmin
      .from("leads")
      .insert({
        submission_key: data.submission_key,
        full_name: data.full_name,
        email: data.email,
        whatsapp: normalizePhoneBR(data.whatsapp)!,
        city: data.city,
        state: data.state,
        preferences: data.preferences,
        surprise_me: data.surprise_me,
        budget: data.budget,
        frequency: data.frequency,
        quantity: data.quantity || null,
        plan_notes: data.plan_notes || null,
        consent_privacy: true,
        consent_marketing: data.consent_marketing,
        source: "site",
      })
      .select("id,code,created_at")
      .single();
    if (error || !lead) {
      console.error("lead insert failed", error);
      throw new Error("Não foi possível salvar sua solicitação. Tente novamente.");
    }

    const emailStatus = await notifyAdmin(supabaseAdmin, lead, data, settings.admin_notification_email ?? "");
    return { code: lead.code, whatsappPhone, emailStatus };
  });

async function notifyAdmin(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: any,
  lead: { id: string; code: string; created_at: string },
  d: { full_name: string; email: string; whatsapp: string; city: string; state: string; preferences: string[]; surprise_me: boolean; budget: number; frequency: string; quantity?: string; plan_notes?: string },
  to: string,
): Promise<SubmitLeadResult["emailStatus"]> {
  const resendKey = process.env.RESEND_API_KEY;
  const lovableKey = process.env.LOVABLE_API_KEY;
  const from = process.env.RESEND_FROM || "Choc4lovers <onboarding@resend.dev>";
  const dedupe = `admin_new_lead:${lead.id}`;

  if (!resendKey || !to) {
    await admin.from("notification_logs").insert({
      kind: "admin_new_lead", recipient: to || "(não configurado)", related_table: "leads", related_id: lead.id,
      dedupe_key: dedupe, status: "pendente",
      error_detail: !resendKey ? "Resend não configurado" : "E-mail do administrador não configurado",
    });
    return "pendente";
  }

  const prefs = [...d.preferences, ...(d.surprise_me ? ["Quero ser surpreendido"] : [])].join(", ") || "—";
  const rows: [string, string][] = [
    ["Código", lead.code], ["Nome", d.full_name], ["E-mail", d.email], ["WhatsApp", d.whatsapp],
    ["Cidade/UF", `${d.city}/${d.state}`], ["Preferências", prefs], ["Orçamento", brl(d.budget)],
    ["Frequência", FREQUENCY[d.frequency] ?? d.frequency], ["Quantidade", d.quantity || "A definir"],
    ["Observações", d.plan_notes || "—"],
  ];
  const html = `<h2>Novo lead recebido</h2><table>${rows.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join("")}</table>`;

  const useGateway = !!lovableKey;
  const url = useGateway ? "https://connector-gateway.lovable.dev/resend/emails" : "https://api.resend.com/emails";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (useGateway) { headers.Authorization = `Bearer ${lovableKey}`; headers["X-Connection-Api-Key"] = resendKey; }
  else headers.Authorization = `Bearer ${resendKey}`;

  let status: "enviado" | "falhou" = "falhou";
  let providerId: string | null = null;
  let detail: string | null = null;
  try {
    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ from, to: [to], subject: "Novo lead recebido — Choc4lovers", html }) });
    const body = await res.text();
    if (res.ok) { status = "enviado"; providerId = (JSON.parse(body) as { id?: string }).id ?? null; }
    else { detail = `[${res.status}] ${body.slice(0, 300)}`; console.error("Resend failed", detail); }
  } catch (e) {
    detail = String(e).slice(0, 300);
  }
  await admin.from("notification_logs").insert({
    kind: "admin_new_lead", recipient: to, related_table: "leads", related_id: lead.id, dedupe_key: dedupe,
    status, provider_message_id: providerId, error_detail: detail, attempts: 1,
  });
  return status;
}
