import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { leadSchema, normalizePhoneBR } from "./lead-schema";
import { COMMERCIAL_WHATSAPP } from "./business";

export type SubmitLeadResult = {
  code: string;
  whatsappPhone: string;
  emailStatus: "enviado" | "pendente" | "falhou";
};

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const parsed = leadSchema.safeParse(input);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
    return parsed.data;
  })
  .handler(async ({ data }): Promise<SubmitLeadResult> => {
    const phone = normalizePhoneBR(data.whatsapp);
    if (!phone || data.website) throw new Error("Dados inválidos.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const request = getRequest();
    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const hash = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)))).map(v => v.toString(16).padStart(2, "0")).join("");
    // Persistent, atomic limits also apply to replay attempts; no private data in rate keys.
    for (const [key, max] of [[`lead-email:${await hash(data.email)}`, 10], [`lead-ip:${await hash(ip)}`, ip === "unknown" ? 100 : 30]] as const) {
      const { data: allowed, error } = await supabaseAdmin.rpc("consume_submission_limit", { _bucket: key, _max: max });
      if (error || !allowed) throw new Error("Muitas tentativas. Aguarde antes de tentar novamente.");
    }
    const existing = await supabaseAdmin.from("leads").select("*").eq("submission_key", data.submission_key).maybeSingle();
    if (existing.error) throw new Error("Não foi possível salvar sua solicitação. Tente novamente.");
    let lead = existing.data;
    if (!lead) {
      const { data: inserted, error } = await supabaseAdmin.from("leads").insert({
        submission_key: data.submission_key, full_name: data.full_name, email: data.email, whatsapp: phone,
        city: data.city, state: data.state, preferences: data.preferences, surprise_me: data.surprise_me,
        budget: data.budget, frequency: data.frequency, quantity: data.quantity || null,
        plan_notes: data.plan_notes || null, preference_notes: data.preference_notes || null,
        presentation: data.presentation ?? null, cep: data.cep || null, neighborhood: data.neighborhood || null,
        address: data.address || null, contact_notes: data.contact_notes || null,
        consent_privacy: true, consent_marketing: data.consent_marketing, source: "site", status: "novo",
      }).select("*").single();
      lead = inserted;
      if (error?.code === "23505") {
        lead = (await supabaseAdmin.from("leads").select("*").eq("submission_key", data.submission_key).single()).data;
      }
      if (!lead) {
        console.error("lead_save_failed", { code: error?.code });
        throw new Error("Não foi possível salvar sua solicitação. Tente novamente.");
      }
    }
    let emailStatus: SubmitLeadResult["emailStatus"] = "pendente";
    // A notification failure must never turn a committed lead into a failed submission.
    try {
      const { notifySavedLead } = await import("./notification.server");
      emailStatus = await notifySavedLead(supabaseAdmin, lead);
    } catch { console.error("lead_notification_failed", { leadId: lead.id }); }
    return { code: lead.code, whatsappPhone: COMMERCIAL_WHATSAPP, emailStatus };
  });
