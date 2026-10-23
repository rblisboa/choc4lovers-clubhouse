import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const retryLeadNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ leadId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: allowed, error } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (error || !allowed) throw new Error("Acesso não autorizado.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: lead, error: leadError } = await context.supabase.from("leads").select("*").eq("id", data.leadId).single();
    if (leadError || !lead) throw new Error("Solicitação não encontrada.");
    const { notifySavedLead } = await import("./notification.server");
    try { return { status: await notifySavedLead(supabaseAdmin, lead, true) }; }
    catch { throw new Error("Não foi possível atualizar a notificação. O plano permanece salvo."); }
  });