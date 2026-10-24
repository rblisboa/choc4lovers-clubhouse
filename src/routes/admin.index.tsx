import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MessageCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LEAD_STATUS } from "@/lib/labels";
import { brl, dateBR, formatPhoneBR } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/admin/")({ head: () => ({ meta: [{ title: "Dashboard — Choc4lovers" }, { name: "description", content: "Leads e indicadores da operação Choc4lovers." }, { property: "og:title", content: "Dashboard — Choc4lovers" }, { property: "og:description", content: "Leads e indicadores da operação Choc4lovers." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }), component: Dashboard });

type Lead = { id: string; code: string; full_name: string; email: string; whatsapp: string; city: string; state: string; budget: number | null; created_at: string; status: string; customer_id: string | null; preferences: string[]; consent_privacy: boolean; consent_marketing: boolean; source: string };

const PAGE = 20;

function Dashboard() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);

  const stats = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const c = (p: PromiseLike<{ count: number | null }>) => p.then((r) => r.count ?? 0);
      const [total, novos, clientes, pedidos] = await Promise.all([
        c(supabase.from("leads").select("id", { count: "exact", head: true })),
        c(supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "novo")),
        c(supabase.from("customers").select("id", { count: "exact", head: true })),
        c(supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "confirmado")),
      ]);
      return { total, novos, clientes, pedidos };
    },
  });

  const leads = useQuery({
    queryKey: ["leads", q, status, page],
    queryFn: async () => {
      let qb = supabase.from("leads").select("id,code,full_name,email,whatsapp,city,state,budget,created_at,status,customer_id,preferences,consent_privacy,consent_marketing,source", { count: "exact" })
        .order("created_at", { ascending: false }).range(page * PAGE, page * PAGE + PAGE - 1);
      if (status) qb = qb.eq("status", status);
      if (q.trim()) { const t = q.trim().replace(/[%,()]/g, ""); qb = qb.or(`full_name.ilike.%${t}%,email.ilike.%${t}%,city.ilike.%${t}%,code.ilike.%${t}%`); }
      const { data, error, count } = await qb;
      if (error) throw error;
      return { rows: data as Lead[], count: count ?? 0 };
    },
  });

  const refresh = () => { qc.invalidateQueries({ queryKey: ["leads"] }); qc.invalidateQueries({ queryKey: ["stats"] }); };

  async function changeStatus(l: Lead, s: string) {
    const { error } = await supabase.from("leads").update({ status: s }).eq("id", l.id);
    if (error) return toast.error("Não foi possível atualizar.");
    toast.success("Status atualizado."); refresh();
  }

  async function convert(l: Lead) {
    if (l.customer_id) return toast.info("Este lead já está vinculado a um cliente.");
    const { data: found } = await supabase.from("customers").select("id,full_name").or(`email.ilike.${l.email},whatsapp.eq.${l.whatsapp}`).limit(1);
    const existing = found?.[0];
    if (!confirm(existing ? `Já existe o cliente "${existing.full_name}" com este e-mail/WhatsApp. Vincular o lead a ele?` : `Criar cliente para ${l.full_name}?`)) return;
    let customerId = existing?.id;
    if (!customerId) {
      const { data, error } = await supabase.from("customers").insert({
        full_name: l.full_name, email: l.email, whatsapp: l.whatsapp, city: l.city, state: l.state,
        preferences: l.preferences, source: l.source, consent_privacy: l.consent_privacy, consent_marketing: l.consent_marketing,
      }).select("id").single();
      if (error || !data) return toast.error("Erro ao criar cliente.");
      customerId = data.id;
    }
    const { error } = await supabase.from("leads").update({ customer_id: customerId, status: "convertido", converted_at: new Date().toISOString() }).eq("id", l.id);
    if (error) return toast.error("Erro ao vincular lead.");
    toast.success(existing ? "Lead vinculado ao cliente existente." : "Cliente criado."); refresh();
  }

  const cards = [["Total de leads", stats.data?.total], ["Leads novos", stats.data?.novos], ["Clientes cadastrados", stats.data?.clientes], ["Pedidos confirmados", stats.data?.pedidos]] as const;
  const pages = Math.max(1, Math.ceil((leads.data?.count ?? 0) / PAGE));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(([label, v]) => (
          <div key={label} className="rounded-2xl bg-card p-5 shadow-soft">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-3xl font-semibold">{v ?? "…"}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl bg-card p-4 shadow-soft md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Leads</h2>
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Buscar nome, e-mail, cidade, código" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} className="w-64" />
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Todos os status</option>
              {Object.entries(LEAD_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="text-left text-muted-foreground"><tr className="border-b">
              <th className="py-2 pr-3">Nome</th><th className="pr-3">Contato</th><th className="pr-3">Cidade</th><th className="pr-3">Orçamento</th><th className="pr-3">Data</th><th className="pr-3">Status</th><th className="text-right">Ações</th>
            </tr></thead>
            <tbody>
              {leads.isLoading && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Carregando…</td></tr>}
              {leads.data?.rows.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Nenhum lead encontrado.</td></tr>}
              {leads.data?.rows.map((l) => {
                const wa = waLink(l.whatsapp, `Olá, ${l.full_name.split(" ")[0]}! Aqui é da Choc4lovers, sobre sua solicitação ${l.code}.`);
                return (
                  <tr key={l.id} className="border-b last:border-0">
                    <td className="py-3 pr-3"><p className="font-medium">{l.full_name}</p><p className="text-xs text-muted-foreground">{l.code}</p></td>
                    <td className="pr-3"><p>{formatPhoneBR(l.whatsapp)}</p><p className="text-xs text-muted-foreground">{l.email}</p></td>
                    <td className="pr-3">{l.city}/{l.state}</td>
                    <td className="pr-3">{brl(l.budget)}</td>
                    <td className="pr-3">{dateBR(l.created_at)}</td>
                    <td className="pr-3">
                      <select aria-label="Status" value={l.status} onChange={(e) => changeStatus(l, e.target.value)} className="h-8 rounded-md border border-input bg-background px-2 text-xs">
                        {Object.entries(LEAD_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </td>
                    <td className="space-x-1 whitespace-nowrap text-right">
                      {wa && <Button asChild size="sm" variant="outline"><a href={wa} target="_blank" rel="noreferrer"><MessageCircle />WhatsApp</a></Button>}
                      <Button size="sm" variant={l.customer_id ? "ghost" : "cta"} disabled={!!l.customer_id} onClick={() => convert(l)}><UserPlus />{l.customer_id ? "Cliente" : "Converter"}</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
          <span>{page + 1} / {pages}</span>
          <Button size="sm" variant="outline" disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
        </div>
      </section>
    </div>
  );
}
