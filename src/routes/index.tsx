import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Settings, Heart, Wallet, MessageCircle, RefreshCw, Sparkles, CheckCircle2, Loader2, Mail, Instagram, Copy } from "lucide-react";
import { toast } from "sonner";
import heroImg from "@/assets/hero-chocolates.jpg";
import boxImg from "@/assets/box-gift.jpg";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { leadSchema } from "@/lib/lead-schema";
import { submitLead, type SubmitLeadResult } from "@/lib/leads.functions";
import { fetchPublicSettings } from "@/lib/settings";
import { BR_STATES } from "@/lib/labels";
import { waLink, leadWhatsAppMessage } from "@/lib/whatsapp";
import { formatPhoneBR } from "@/lib/format";
import { COMMERCIAL_WHATSAPP, VISITOR_MESSAGE } from "@/lib/business";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Choc4lovers — Monte sua caixa de chocolates" },
      { name: "description", content: "Clube de assinatura de chocolates: escolha seus sabores, orçamento e frequência e combine tudo com a equipe pelo WhatsApp." },
      { property: "og:title", content: "Choc4lovers — Monte sua caixa de chocolates" },
      { property: "og:description", content: "Seu amor por chocolate merece uma caixa só sua." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PREFS = ["Ao leite", "Amargo", "Branco", "Bombons e trufas", "Barras", "Recheados", "Especiais", "Surpresas do mês"];

function Index() {
  const settings = useQuery({ queryKey: ["public-settings"], queryFn: fetchPublicSettings });
  const s = settings.data ?? {};
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <a href="#inicio" aria-label="Choc4lovers — início"><Logo /></a>
          <nav className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#como-funciona" className="hover:text-foreground">Como funciona</a>
            <a href="#beneficios" className="hover:text-foreground">Benefícios</a>
            <a href="#duvidas" className="hover:text-foreground">Dúvidas</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden lg:inline-flex"><a href={waLink(COMMERCIAL_WHATSAPP, VISITOR_MESSAGE) ?? undefined} target="_blank" rel="noreferrer"><MessageCircle />Falar pelo WhatsApp</a></Button>
            <Button asChild variant="cta" size="sm" className="h-9 px-4"><a href="#plano">Monte seu plano</a></Button>
            <Link to="/admin/login" aria-label="Área administrativa" className="rounded-full p-2 text-muted-foreground/60 hover:text-foreground">
              <Settings className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <section id="inicio" className="relative overflow-hidden bg-chocolate-deep">
        <img src={heroImg} alt="Chocolates artesanais variados" className="absolute inset-0 h-full w-full object-cover opacity-45" width={1600} height={900} />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-36">
          <div className="max-w-xl animate-rise text-cream">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-pink">Clube de chocolates</p>
            <h1 className="text-balance text-4xl font-semibold leading-tight md:text-6xl">Seu amor por chocolate merece uma caixa só sua.</h1>
            <p className="mt-5 text-lg text-cream/85">Conte o que você gosta, quanto quer investir e com que frequência. A equipe Choc4lovers monta a proposta e combina tudo com você pelo WhatsApp.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="cta" size="lg"><a href="#plano">Monte seu plano</a></Button>
              <Button asChild variant="cream" size="lg"><a href={waLink(COMMERCIAL_WHATSAPP, VISITOR_MESSAGE) ?? undefined} target="_blank" rel="noreferrer"><MessageCircle />Falar pelo WhatsApp</a></Button>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-semibold md:text-4xl">Como funciona</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["Conte suas preferências", "Escolha os tipos de chocolate, orçamento e frequência no formulário."],
            ["Converse com a equipe", "Entramos em contato pelo WhatsApp para confirmar disponibilidade, valor final e entrega."],
            ["Receba sua caixa", "Com tudo combinado e o pagamento confirmado, preparamos sua caixa com carinho."],
          ].map(([t, d], i) => (
            <div key={t} className="rounded-2xl bg-card p-6 shadow-soft">
              <span className="font-display text-4xl font-semibold text-pink">{i + 1}</span>
              <h3 className="mt-3 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">Disponibilidade, valor final, entrega e contratação são sempre confirmados pela nossa equipe.</p>
      </section>

      <section id="beneficios" className="bg-secondary/60">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2">
          <img src={boxImg} alt="Caixa de presente com chocolates" loading="lazy" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift" />
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">Por que a Choc4lovers?</h2>
            <ul className="mt-8 space-y-5">
              {[
                [Heart, "Caixa personalizada", "Montada a partir do que você realmente gosta."],
                [Wallet, "No seu orçamento", "Você define quanto quer investir e a frequência."],
                [Sparkles, "Descobertas", "Sabores novos para surpreender a cada caixa."],
                [MessageCircle, "Atendimento humano", "Tudo combinado diretamente pelo WhatsApp."],
                [RefreshCw, "Flexível", "Renove ou ajuste seu plano conversando com a equipe."],
              ].map(([Icon, t, d]) => {
                const I = Icon as typeof Heart;
                return (
                  <li key={t as string} className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-pink"><I className="size-5" /></span>
                    <div><p className="font-semibold">{t as string}</p><p className="text-muted-foreground">{d as string}</p></div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section id="plano" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20">
        <h2 className="text-3xl font-semibold md:text-4xl">Monte seu plano</h2>
        <p className="mt-2 text-muted-foreground">Leva menos de 2 minutos. Não é uma compra: nossa equipe entra em contato para combinar os detalhes.</p>
        <LeadForm />
      </section>

      <section id="duvidas" className="bg-secondary/60">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-3xl font-semibold md:text-4xl">Perguntas frequentes</h2>
          <Accordion type="single" collapsible className="mt-8">
            {[
              ["Como funciona a assinatura?", "Você envia suas preferências pelo formulário. Nossa equipe conversa com você pelo WhatsApp, apresenta uma proposta e, com tudo confirmado, organiza sua caixa."],
              ["Como é feito o pagamento?", "Não há pagamento pelo site. Forma e valor são combinados diretamente com a equipe, e o plano só é ativado após a confirmação do pagamento."],
              ["Quanto custa a entrega?", "O valor da entrega depende da sua região e é informado pela equipe antes da confirmação."],
              ["Posso alterar ou renovar meu plano?", "Sim. Basta conversar com a equipe para ajustar preferências, orçamento ou frequência e combinar a próxima caixa."],
              ["Tenho alergia ou restrição alimentar. E agora?", "Informe nas observações e confirme ingredientes e possíveis traços com a equipe antes de fechar o pedido."],
            ].map(([q = "", a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="text-left text-base font-semibold">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <footer className="bg-chocolate-deep text-cream/80">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
          <div><Logo light /><p className="mt-3 text-sm">Clube de assinatura de chocolates.</p></div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-cream">Contato</p>
            <a className="flex items-center gap-2 hover:text-cream" href={waLink(COMMERCIAL_WHATSAPP, VISITOR_MESSAGE) ?? undefined} target="_blank" rel="noreferrer"><MessageCircle className="size-4" />{formatPhoneBR(COMMERCIAL_WHATSAPP)}</a>
            {s.contact_email && <a className="flex items-center gap-2 hover:text-cream" href={`mailto:${s.contact_email}`}><Mail className="size-4" />{s.contact_email}</a>}
            {s.instagram_url && <a className="flex items-center gap-2 hover:text-cream" href={s.instagram_url} target="_blank" rel="noreferrer"><Instagram className="size-4" />Instagram</a>}
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-cream">Informações</p>
            <Link to="/privacidade" className="block hover:text-cream">Política de privacidade</Link>
            <p className="text-cream/60">© {new Date().getFullYear()} Choc4lovers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

type Errors = Partial<Record<string, string>>;

function LeadForm() {
  const [key, setKey] = useState("");
  const inFlight = useRef(false);
  const sendLead = useServerFn(submitLead);
  useEffect(() => { setKey(crypto.randomUUID()); }, []);
  const [f, setF] = useState({
    full_name: "", email: "", whatsapp: "", city: "", state: "", budget: "", frequency: "", quantity: "",
    plan_notes: "", website: "", consent_privacy: false, consent_marketing: false,
  });
  const [prefs, setPrefs] = useState<string[]>([]);
  const [surprise, setSurprise] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<(SubmitLeadResult & { msg: string }) | null>(null);
  const set = (k: keyof typeof f, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inFlight.current || !key) return;
    const payload = { ...f, submission_key: key, preferences: prefs, surprise_me: surprise };
    const parsed = leadSchema.safeParse(payload);
    const errs: Errors = {};
    if (!prefs.length && !surprise) errs.preferences = "Escolha ao menos uma preferência";
    if (!parsed.success) parsed.error.issues.forEach((i) => { const k = String(i.path[0]); errs[k] ??= i.message; });
    setErrors(errs);
    if (Object.keys(errs).length || !parsed.success) { toast.error("Confira os campos destacados."); return; }
    inFlight.current = true;
    setSending(true);
    try {
      const res = await sendLead({ data: payload });
      const msg = leadWhatsAppMessage({ ...parsed.data, quantity: f.quantity, code: res.code });
      setDone({ ...res, msg });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar. Tente novamente.");
    } finally {
      setSending(false);
      inFlight.current = false;
    }
  }

  if (done) {
    const link = waLink(COMMERCIAL_WHATSAPP, done.msg);
    return (
      <div className="mt-8 rounded-3xl bg-card p-8 text-center shadow-lift">
        <CheckCircle2 className="mx-auto size-12 text-success" />
        <h3 className="mt-4 text-2xl font-semibold">Recebemos seu plano!</h3>
        <p className="mt-2 text-muted-foreground">Código da solicitação: <strong className="text-foreground">{done.code}</strong></p>
        <p className="mt-2 text-sm text-muted-foreground">Isto ainda não é uma contratação. Nossa equipe vai confirmar disponibilidade, valor e entrega com você.</p>
        {done.clientEmailStatus === "enviado" && !done.clientEmailTestMode && (
          <p className="mt-3 text-sm text-muted-foreground">Enviamos uma confirmação para o seu e-mail com o resumo da solicitação.</p>
        )}
        {done.clientEmailStatus === "falhou" && (
          <p className="mt-3 text-sm text-muted-foreground">Não foi possível enviar o e-mail de confirmação agora, mas sua solicitação está salva com o código acima.</p>
        )}
        {done.emailStatus !== "enviado" && <p className="mt-3 text-sm text-muted-foreground">Seu plano está salvo. O aviso por e-mail à equipe está pendente; você pode continuar pelo WhatsApp.</p>}
        {link ? (
          <Button asChild variant="cta" size="lg" className="mt-6"><a href={link} target="_blank" rel="noreferrer"><MessageCircle />Continuar pelo WhatsApp</a></Button>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">Em breve nossa equipe entrará em contato pelo WhatsApp informado.</p>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline"><a href={`https://api.whatsapp.com/send?phone=5585998386599&text=${encodeURIComponent(done.msg)}`} target="_blank" rel="noopener noreferrer"><MessageCircle />Abrir WhatsApp Web/app</a></Button>
          <Button type="button" variant="ghost" onClick={async () => {
            try { await navigator.clipboard.writeText(done.msg); toast.success("Mensagem copiada."); }
            catch { toast.error("Não foi possível copiar. Abra o WhatsApp pelo botão de contato."); }
          }}><Copy />Copiar mensagem</Button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Contato: {formatPhoneBR(COMMERCIAL_WHATSAPP)}. A mensagem só será enviada quando você confirmar no WhatsApp.</p>
      </div>
    );
  }

  const err = (k: string) => errors[k] && <p className="mt-1 text-sm text-destructive">{errors[k]}</p>;
  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-8 rounded-3xl bg-card p-6 shadow-soft md:p-8">
      <fieldset>
        <legend className="font-display text-xl font-semibold">Preferências de chocolate</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {PREFS.map((p) => {
            const on = prefs.includes(p);
            return (
              <button type="button" key={p} aria-pressed={on} onClick={() => setPrefs((x) => (on ? x.filter((y) => y !== p) : [...x, p]))}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${on ? "border-pink bg-pink text-pink-foreground" : "border-input bg-background hover:border-pink"}`}>
                {p}
              </button>
            );
          })}
          <button type="button" aria-pressed={surprise} onClick={() => setSurprise((v) => !v)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${surprise ? "border-primary bg-primary text-primary-foreground" : "border-dashed border-input hover:border-primary"}`}>
            Quero ser surpreendido
          </button>
        </div>
        {err("preferences")}
      </fieldset>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <Label htmlFor="budget">Orçamento por caixa (R$) *</Label>
          <Input id="budget" inputMode="decimal" placeholder="Ex.: 150" value={f.budget} onChange={(e) => set("budget", e.target.value.replace(",", "."))} className="mt-1.5" />
          {err("budget")}
        </div>
        <div>
          <Label htmlFor="frequency">Frequência *</Label>
          <select id="frequency" value={f.frequency} onChange={(e) => set("frequency", e.target.value)} className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="">Selecione</option><option value="mensal">Mensal</option><option value="quinzenal">Quinzenal</option><option value="pontual">Pontual</option>
          </select>
          {err("frequency")}
        </div>
        <div>
          <Label htmlFor="quantity">Quantidade aproximada</Label>
          <select id="quantity" value={f.quantity} onChange={(e) => set("quantity", e.target.value)} className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="">A definir com a equipe</option><option>Até 10 unidades</option><option>10 a 20 unidades</option><option>Mais de 20 unidades</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="full_name">Nome completo *</Label>
          <Input id="full_name" autoComplete="name" value={f.full_name} onChange={(e) => set("full_name", e.target.value)} className="mt-1.5" />
          {err("full_name")}
        </div>
        <div>
          <Label htmlFor="email">E-mail *</Label>
          <Input id="email" type="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} className="mt-1.5" />
          {err("email")}
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp com DDD *</Label>
          <Input id="whatsapp" type="tel" autoComplete="tel" placeholder="(11) 91234-5678" value={f.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className="mt-1.5" />
          {err("whatsapp")}
        </div>
        <div>
          <Label htmlFor="city">Cidade *</Label>
          <Input id="city" autoComplete="address-level2" value={f.city} onChange={(e) => set("city", e.target.value)} className="mt-1.5" />
          {err("city")}
        </div>
        <div>
          <Label htmlFor="state">Estado *</Label>
          <select id="state" value={f.state} onChange={(e) => set("state", e.target.value)} className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="">UF</option>{BR_STATES.map((u) => <option key={u}>{u}</option>)}
          </select>
          {err("state")}
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="plan_notes">Observações (opcional)</Label>
          <Textarea id="plan_notes" placeholder="Restrições, sabores que não gosta, ocasião especial..." value={f.plan_notes} onChange={(e) => set("plan_notes", e.target.value)} className="mt-1.5" />
          <p className="mt-1 text-xs text-muted-foreground">Em caso de alergias, confirme ingredientes e traços com a equipe.</p>
        </div>
      </div>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={f.website} onChange={(e) => set("website", e.target.value)} />

      <div className="space-y-3">
        <label className="flex items-start gap-3 text-sm">
          <Checkbox checked={f.consent_privacy} onCheckedChange={(v) => set("consent_privacy", v === true)} className="mt-0.5" />
          <span>Li e concordo com a <Link to="/privacidade" target="_blank" className="font-medium text-pink underline">política de privacidade</Link>. *</span>
        </label>
        {err("consent_privacy")}
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <Checkbox checked={f.consent_marketing} onCheckedChange={(v) => set("consent_marketing", v === true)} className="mt-0.5" />
          <span>Quero receber novidades e promoções da Choc4lovers (opcional).</span>
        </label>
      </div>

      <Button type="submit" variant="cta" size="lg" className="w-full" disabled={sending || !key}>
        {sending && <Loader2 className="animate-spin" />}Enviar meu plano
      </Button>
    </form>
  );
}
