import { brl } from "./format";
import { FREQUENCY } from "./labels";

export function waLink(phoneE164: string, text?: string): string | null {
  const digits = (phoneE164 || "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function leadWhatsAppMessage(l: {
  full_name: string;
  preferences: string[];
  surprise_me?: boolean;
  budget: number | string | null;
  frequency: string | null;
  quantity: string | null;
  city: string;
  state: string;
  code: string;
}): string {
  const prefs = [...l.preferences, ...(l.surprise_me ? ["Quero ser surpreendido"] : [])];
  return [
    "Olá, Choc4lovers! Acabei de montar meu plano pelo site e gostaria de conversar sobre minha caixa de chocolates.",
    "",
    `Nome: ${l.full_name}`,
    `Preferências: ${prefs.length ? prefs.join(", ") : "A definir"}`,
    `Orçamento desejado: ${brl(l.budget)}`,
    `Frequência: ${l.frequency ? FREQUENCY[l.frequency] ?? l.frequency : "A definir"}`,
    `Quantidade: ${l.quantity || "A definir com a equipe"}`,
    `Cidade/UF: ${l.city}/${l.state}`,
    `Código da solicitação: ${l.code}`,
    "",
    "Podemos conversar sobre as opções disponíveis?",
  ].join("\n");
}
