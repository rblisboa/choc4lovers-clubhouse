import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BR_STATES } from "@/lib/labels";
import { dateBR, formatPhoneBR } from "@/lib/format";
import { normalizePhoneBR } from "@/lib/lead-schema";
import { waLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/admin/clientes")({ head: () => ({ meta: [{ title: "Clientes — Choc4lovers" }, { name: "description", content: "Cadastro e consulta de clientes Choc4lovers." }, { property: "og:title", content: "Clientes — Choc4lovers" }, { property: "og:description", content: "Cadastro e consulta de clientes Choc4lovers." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }), component: Clientes });

type C = { id: string; code: string; full_name: string; email: string | null; whatsapp: string | null; city: string | null; state: string | null; notes: string | null; created_at: string };
const empty = { id: "", full_name: "", email: "", whatsapp: "", city: "", state: "", notes: "" };
const schema = z.object({
  full_name: z.string().trim().min(3, "Informe o nome").max(120),
  email: z.string().trim().toLowerCase().email("E-mail inválido").max(160).or(z.literal("")),
  whatsapp: z.string().trim().refine((v) => !v || normalizePhoneBR(v), "WhatsApp inválido"),
  city: z.string().trim().max(80), state: z.string(), notes: z.string().trim().max(1000),
});

function Clientes() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<typeof empty | null>(null);
  const list = useQuery({
    queryKey: ["customers", q],
    queryFn: async () => {
      let qb = supabase.from("customers").select("id,code,full_name,email,whatsapp,city,state,notes,created_at").order("created_at", { ascending: false }).limit(200);
      if (q.trim()) { const t = q.trim().replace(/[%,()]/g, ""); qb = qb.or(`full_name.ilike.%${t}%,email.ilike.%${t}%,code.ilike.%${t}%`); }
      const { data, error } = await qb; if (error) throw error; return data as C[];
    },
  });

  async function save() {
    if (!edit) return;
    const p = schema.safeParse(edit);
    if (!p.success) return toast.error(p.error.issues[0]!.message);
    const row = { ...p.data, email: p.data.email || null, whatsapp: p.data.whatsapp ? normalizePhoneBR(p.data.whatsapp) : null, state: p.data.state || null, city: p.data.city || null, notes: p.data.notes || null };
    if (!edit.id) {
      const ors = [row.email && `email.ilike.${row.email}`, row.whatsapp && `whatsapp.eq.${row.whatsapp}`].filter(Boolean).join(",");
      if (ors) {
        const { data: dup } = await supabase.from("customers").select("full_name").or(ors).limit(1);
        if (dup?.length) return toast.error(`Já existe o cliente "${dup[0]!.full_name}" com este e-mail ou WhatsApp.`);
      }
    }
    const { error } = edit.id ? await supabase.from("customers").update(row).eq("id", edit.id) : await supabase.from("customers").insert({ ...row, source: "manual" });
    if (error) return toast.error("Erro ao salvar.");
    toast.success("Cliente salvo."); setEdit(null);
    qc.invalidateQueries({ queryKey: ["customers"] }); qc.invalidateQueries({ queryKey: ["stats"] });
  }

  const set = (k: keyof typeof empty, v: string) => setEdit((e) => (e ? { ...e, [k]: v } : e));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <div className="flex gap-2">
          <Input placeholder="Buscar" value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
          <Button onClick={() => setEdit(empty)}><Plus />Novo cliente</Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-card p-4 shadow-soft">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="text-left text-muted-foreground"><tr className="border-b"><th className="py-2 pr-3">Nome</th><th className="pr-3">Contato</th><th className="pr-3">Cidade</th><th className="pr-3">Cadastro</th><th /></tr></thead>
          <tbody>
            {list.data?.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Nenhum cliente ainda. Converta um lead ou cadastre manualmente.</td></tr>}
            {list.data?.map((c) => {
              const wa = c.whatsapp ? waLink(c.whatsapp) : null;
              return (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-3 pr-3"><p className="font-medium">{c.full_name}</p><p className="text-xs text-muted-foreground">{c.code}</p></td>
                  <td className="pr-3"><p>{formatPhoneBR(c.whatsapp)}</p><p className="text-xs text-muted-foreground">{c.email ?? "—"}</p></td>
                  <td className="pr-3">{c.city ? `${c.city}/${c.state ?? ""}` : "—"}</td>
                  <td className="pr-3">{dateBR(c.created_at)}</td>
                  <td className="space-x-1 whitespace-nowrap text-right">
                    {wa && <Button asChild size="sm" variant="outline"><a href={wa} target="_blank" rel="noreferrer"><MessageCircle /></a></Button>}
                    <Button size="sm" variant="ghost" onClick={() => setEdit({ id: c.id, full_name: c.full_name, email: c.email ?? "", whatsapp: c.whatsapp ?? "", city: c.city ?? "", state: c.state ?? "", notes: c.notes ?? "" })}>Editar</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit?.id ? "Editar cliente" : "Novo cliente"}</DialogTitle></DialogHeader>
          {edit && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label>Nome completo *</Label><Input value={edit.full_name} onChange={(e) => set("full_name", e.target.value)} /></div>
              <div><Label>E-mail</Label><Input value={edit.email} onChange={(e) => set("email", e.target.value)} /></div>
              <div><Label>WhatsApp</Label><Input value={edit.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} /></div>
              <div><Label>Cidade</Label><Input value={edit.city} onChange={(e) => set("city", e.target.value)} /></div>
              <div><Label>Estado</Label><select value={edit.state} onChange={(e) => set("state", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">—</option>{BR_STATES.map((u) => <option key={u}>{u}</option>)}</select></div>
              <div className="sm:col-span-2"><Label>Observações</Label><Textarea value={edit.notes} onChange={(e) => set("notes", e.target.value)} /></div>
              <Button className="sm:col-span-2" onClick={save}>Salvar</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
