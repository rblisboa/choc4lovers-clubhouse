import type { Database } from "@/integrations/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ADMIN_EMAIL, COMMERCIAL_WHATSAPP } from "./business";
import { brl, dateTimeBR, formatPhoneBR } from "./format";
import { FREQUENCY } from "./labels";
import { leadWhatsAppMessage, waLink } from "./whatsapp";

type Lead = Database["public"]["Tables"]["leads"]["Row"];
type Admin = SupabaseClient<Database>;
export type EmailStatus = "pendente" | "enviado" | "falhou";

const RESEND_GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const RESEND_FROM = "Choc4lovers <onboarding@resend.dev>";
// Test mode (no verified domain): Resend only delivers to the account owner's email.
// Flip to false once a sending domain is verified, so clients receive their own copy.
export const EMAIL_TEST_MODE = true;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Sends through the Resend connector gateway. Throws with a safe code on failure. */
async function sendResendEmail(input: { to: string; subject: string; html: string }): Promise<{ id: string | null }> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const resendKey = process.env["RESEND_API_KEY"];
  if (!lovableKey || !resendKey) throw new Error("email_not_configured");
  const response = await fetch(`${RESEND_GATEWAY_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify({ from: RESEND_FROM, to: [input.to], subject: input.subject, html: input.html }),
  });
  if (!response.ok) {
    const body = await response.text();
    console.error(`resend_send_failed [${response.status}]: ${body}`);
    throw new Error(`resend_http_${response.status}`);
  }
  const data = (await response.json()) as { id?: string };
  return { id: data.id ?? null };
}

/** Safe payload for the admin notification once an owned sending domain is verified. */
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

/** No provider is configured for the admin notice: persist an honest pending state, never simulate sending. */
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
    error_detail: "Envio não configurado: falta verificar um domínio próprio de envio.",
  };
  const { error } = existing
    ? await admin.from("notification_logs").update(row).eq("id", existing.id)
    : await admin.from("notification_logs").upsert(row, { onConflict: "dedupe_key", ignoreDuplicates: true });
  if (error) throw new Error("notification_write_failed");
  return "pendente";
}

/** Client confirmation email content, built only from the saved lead's real data. */
export function leadConfirmationEmail(lead: Lead) {
  const prefs = [...lead.preferences, ...(lead.surprise_me ? ["Quero ser surpreendido"] : [])];
  const waMessage = leadWhatsAppMessage({
    full_name: lead.full_name, preferences: lead.preferences, surprise_me: lead.surprise_me,
    budget: lead.budget, frequency: lead.frequency, quantity: lead.quantity,
    city: lead.city, state: lead.state, code: lead.code,
  });
  const waUrl = waLink(COMMERCIAL_WHATSAPP, waMessage);
  const to = EMAIL_TEST_MODE ? ADMIN_EMAIL : lead.email;
  const subject = "Recebemos sua solicitação de plano! — Choc4lovers 🍫";
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px;color:#6b5b57;font-size:14px;vertical-align:top">${label}</td><td style="padding:6px 12px;font-size:14px;color:#2D1714"><strong>${value}</strong></td></tr>`;
  const testNote = EMAIL_TEST_MODE
    ? `<p style="font-size:12px;color:#8a7a75;border-top:1px solid #eee;padding-top:12px">Modo de teste: esta confirmação seria enviada ao cliente ${escapeHtml(lead.email)}. Enquanto não houver um domínio de envio verificado, ela é entregue apenas ao endereço da equipe.</p>`
    : "";
  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;background:#FFF7F0;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px;border:1px solid #f0e4de">
    <h1 style="font-size:20px;color:#4A241B;margin:0 0 4px">Recebemos sua solicitação de plano! 🍫</h1>
    <p style="font-size:14px;color:#6b5b57;margin:0 0 16px">Olá, ${escapeHtml(lead.full_name)}! Sua solicitação foi registrada na Choc4lovers com o código <strong>${escapeHtml(lead.code)}</strong>.</p>
    <table style="border-collapse:collapse;width:100%;background:#FFF7F0;border-radius:12px">
      ${row("Preferências", escapeHtml(prefs.length ? prefs.join(", ") : "A definir"))}
      ${row("Orçamento pretendido", escapeHtml(brl(lead.budget)))}
      ${row("Frequência", escapeHtml(FREQUENCY[lead.frequency ?? ""] ?? lead.frequency ?? "A definir"))}
      ${row("Quantidade", escapeHtml(lead.quantity || "A definir com a equipe"))}
    </table>
    <p style="font-size:14px;color:#2D1714;line-height:1.5;margin:16px 0 0">Esta solicitação <strong>não representa nenhuma cobrança automática</strong>. Nossa equipe vai entrar em contato pelo WhatsApp oficial <strong>${escapeHtml(formatPhoneBR(COMMERCIAL_WHATSAPP))}</strong> para confirmar a disponibilidade, o valor final e o endereço de entrega antes de qualquer contratação.</p>
    ${waUrl ? `<p style="margin:20px 0 0;text-align:center"><a href="${waUrl}" style="display:inline-block;background:#F52D83;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;padding:12px 24px;border-radius:999px">Conversar pelo WhatsApp</a></p>` : ""}
    ${testNote}
  </div>
</div>`;
  return { to, subject, html };
}

/** Sends the client confirmation via Resend and records the real result in notification_logs. */
export async function sendLeadConfirmationEmail(admin: Admin, lead: Lead, retry = false): Promise<EmailStatus> {
  const dedupe = `lead_confirmation:${lead.id}`;
  const { data: existing, error: readError } = await admin.from("notification_logs")
    .select("id,status,attempts").eq("dedupe_key", dedupe).maybeSingle();
  if (readError) throw new Error("notification_read_failed");
  if (existing?.status === "enviado") return "enviado";
  if (existing && !retry) return existing.status === "falhou" ? "falhou" : "pendente";
  const payload = leadConfirmationEmail(lead);
  const attempts = (existing?.attempts ?? 0) + 1;
  let status: EmailStatus = "enviado";
  let providerId: string | null = null;
  let errorDetail: string | null = null;
  try {
    providerId = (await sendResendEmail(payload)).id;
  } catch (err) {
    status = "falhou";
    errorDetail = err instanceof Error ? err.message : "send_failed";
  }
  const row = {
    kind: "lead_confirmation", recipient: payload.to, related_table: "leads", related_id: lead.id,
    dedupe_key: dedupe, status, attempts, provider_message_id: providerId, error_detail: errorDetail,
  };
  const { error } = existing
    ? await admin.from("notification_logs").update(row).eq("id", existing.id)
    : await admin.from("notification_logs").upsert(row, { onConflict: "dedupe_key", ignoreDuplicates: true });
  if (error) throw new Error("notification_write_failed");
  return status;
}
