import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de privacidade — Choc4lovers" },
      { name: "description", content: "Como a Choc4lovers trata os dados pessoais enviados pelo formulário." },
      { property: "og:title", content: "Política de privacidade — Choc4lovers" },
      { property: "og:description", content: "Como tratamos seus dados pessoais, conforme a LGPD." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link to="/"><Logo /></Link>
      <h1 className="mt-10 text-3xl font-semibold">Política de privacidade</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>Coletamos apenas os dados informados no formulário (nome, e-mail, WhatsApp, cidade, estado, preferências e observações) para entrar em contato e elaborar sua proposta de caixa de chocolates.</p>
        <p>Seus dados não são vendidos nem compartilhados com terceiros para fins comerciais. Comunicações promocionais só são enviadas com sua autorização, que pode ser revogada a qualquer momento.</p>
        <p>Conforme a LGPD, você pode solicitar acesso, correção ou exclusão dos seus dados entrando em contato com a nossa equipe pelos canais informados no rodapé do site.</p>
      </div>
    </main>
  );
}
