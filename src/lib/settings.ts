import { supabase } from "@/integrations/supabase/client";

export type PublicSettings = Record<string, string>;

export async function fetchPublicSettings(): Promise<PublicSettings> {
  const { data } = await supabase.from("app_settings").select("key,value").eq("is_public", true);
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""]));
}

export const ORDER_STATUS_MVP: Record<string, string> = {
  confirmado: "Confirmado",
  em_preparacao: "Preparando",
  entregue: "Entregue",
  cancelado: "Cancelado",
};
