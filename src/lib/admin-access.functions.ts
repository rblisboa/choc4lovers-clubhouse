import { createServerFn } from "@tanstack/react-start";

export const firstAccessStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("admin_exists");
  if (error) throw new Error("Não foi possível verificar o primeiro acesso.");
  return { available: !data };
});