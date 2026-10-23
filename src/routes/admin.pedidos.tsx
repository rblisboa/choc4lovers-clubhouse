import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PAYMENT_STATUS } from "@/lib/labels";
import { ORDER_STATUS_MVP } from "@/lib/settings";
import { brl, dateBR, todaySP } from "@/lib/format";

export const Route = createFileRoute("/admin/pedidos")({ component: Pedidos });

type O = { id: string; code: string; customer_id: string; order_date: string; products_amount: number; total_amount: number; payment_status: string; status: string; next_renewal_date: string | null; notes: string | null; customers: { full_name: string } | null };
const empty = { id: "", customer_id: "", order_date: todaySP(), amount: "", payment_status: "pendente", status: "confirmado", next_renewal_date: "", notes: "" };

function Pedidos() {
  const qc = useQueryClient();
  const [status, setStatus] = useState("");
  const [edit, setEdit] = useState<typeof empty | null>(null);
  const customers = useQuery({
    queryKey: ["customers-min"],
    queryFn: async () => (await supabase.from("customers").select("id,full_name,code").order("full_name")).data ?? [],
  });
  const list = useQuery({
    queryKey: ["orders", status],
    queryFn: async () => {
      let qb = supabase.from("orders").select("id,code,customer_id,order_date,products_amount,total_amount,payment_status,status,next_renewal_date,notes,customers(full_name)").order("order_date", { ascending: false }).limit(200);
      if (status) qb = qb.eq("status", status);
      const { data, error } = await qb; if (error) throw error; return data as unknown as O[];
    },
  });

  async function save() {
    if (!edit) return;
    const amount = Number(edit.amount.replace(",", "."));
    if (!edit.customer_id) return toast.error("Selecione o cliente.");
    if (!Number.isFinite(amount) || amount < 0 || amount > 100000) return toast.error("Valor inválido.");
    if (!ORDER_STATUS_MVP[edit.status] || !PAYMENT_STATUS[edit.payment_status]) return toast.error("Status inválido.");
    const row = { customer_id: edit.customer_id, order_date: edit.order_date, products_amount: amount, payment_status: edit.payment_status, status: edit.status, next_renewal_date: edit.next_renewal_date || null, notes: edit.notes.trim().slice(0, 1000) || null };
    const { error } = edit.id ? await supabase.from("orders").update(row).eq("id", edit.id) : await supabase.from("orders").insert(row);
    if (error) return toast.error("Erro ao salvar pedido.");
    toast.success("Pedido salvo."); setEdit(null);
    qc.invalidateQueries({ queryKey: ["orders"] }); qc.invalidateQueries({ queryKey: ["stats"] });
  }
  const set = (k: keyof typeof empty, v: string) => setEdit((e) => (e ? { ...e, [k]: v } : e));
  const sel = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <div className="flex gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">Todos</option>{Object.entries(ORDER_STATUS_MVP).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <Button onClick={() => setEdit(empty)} disabled={!customers.data?.length}><Plus />Novo pedido</Button>
        </div>
      </div>
      {customers.data?.length === 0 && <p className="text-sm text-muted-foreground">Cadastre um cliente antes de registrar pedidos.</p>}
      <div className="overflow-x-auto rounded-2xl bg-card p-4 shadow-soft">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="text-left text-muted-foreground"><tr className="border-b"><th className="py-2 pr-3">Pedido</th><th className="pr-3">Cliente</th><th className="pr-3">Data</th><th className="pr-3">Valor</th><th className="pr-3">Pagamento</th><th className="pr-3">Status</th><th className="pr-3">Renovação</th><th /></tr></thead>
          <tbody>
            {list.data?.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">Nenhum pedido registrado.</td></tr>}
            {list.data?.map((o) => (
              <tr key={o.id} className="border-b last:border-0">
                <td className="py-3 pr-3 font-medium">{o.code}</td>
                <td className="pr-3">{o.customers?.full_name ?? "—"}</td>
                <td className="pr-3">{dateBR(o.order_date)}</td>
                <td className="pr-3">{brl(o.total_amount)}</td>
                <td className="pr-3">{PAYMENT_STATUS[o.payment_status]?.label ?? o.payment_status}</td>
                <td className="pr-3">{ORDER_STATUS_MVP[o.status] ?? o.status}</td>
                <td className="pr-3">{dateBR(o.next_renewal_date)}</td>
                <td className="text-right"><Button size="sm" variant="ghost" onClick={() => setEdit({ id: o.id, customer_id: o.customer_id, order_date: o.order_date, amount: String(o.products_amount), payment_status: o.payment_status, status: ORDER_STATUS_MVP[o.status] ? o.status : "confirmado", next_renewal_date: o.next_renewal_date ?? "", notes: o.notes ?? "" })}>Editar</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit?.id ? "Editar pedido" : "Novo pedido"}</DialogTitle></DialogHeader>
          {edit && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label>Cliente *</Label><select value={edit.customer_id} onChange={(e) => set("customer_id", e.target.value)} className={sel}><option value="">Selecione</option>{customers.data?.map((c) => <option key={c.id} value={c.id}>{c.full_name} ({c.code})</option>)}</select></div>
              <div><Label>Data</Label><Input type="date" value={edit.order_date} onChange={(e) => set("order_date", e.target.value)} /></div>
              <div><Label>Valor (R$) *</Label><Input inputMode="decimal" value={edit.amount} onChange={(e) => set("amount", e.target.value)} /></div>
              <div><Label>Pagamento</Label><select value={edit.payment_status} onChange={(e) => set("payment_status", e.target.value)} className={sel}>{Object.entries(PAYMENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
              <div><Label>Status do pedido</Label><select value={edit.status} onChange={(e) => set("status", e.target.value)} className={sel}>{Object.entries(ORDER_STATUS_MVP).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div className="sm:col-span-2"><Label>Próxima data de renovação</Label><Input type="date" value={edit.next_renewal_date} onChange={(e) => set("next_renewal_date", e.target.value)} /></div>
              <div className="sm:col-span-2"><Label>Observações</Label><Textarea value={edit.notes} onChange={(e) => set("notes", e.target.value)} /></div>
              <Button className="sm:col-span-2" onClick={save}>Salvar</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
