import { z } from "zod";
import { BR_STATES } from "./labels";

/** Normalizes a Brazilian phone to E.164 (+55DDXXXXXXXXX). Returns null if invalid. */
export function normalizePhoneBR(input: string): string | null {
  let d = (input || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 12 || d.length === 13) {
    if (!d.startsWith("55")) return null;
    d = d.slice(2);
  }
  if (d.startsWith("0")) d = d.slice(1);
  if (d.length !== 10 && d.length !== 11) return null;
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || ddd > 99) return null;
  if (d.length === 11 && d[2] !== "9") return null;
  return `+55${d}`;
}

export const leadSchema = z.object({
  submission_key: z.string().uuid(),
  website: z.string().max(0).optional().default(""), // honeypot
  preferences: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  surprise_me: z.boolean().default(false),
  preference_notes: z.string().trim().max(1000).optional().default(""),
  budget: z.coerce
    .number({ invalid_type_error: "Informe um valor em reais" })
    .min(1, "Informe um orçamento válido")
    .max(100000, "Valor muito alto"),
  frequency: z.enum(["mensal", "quinzenal", "pontual"], {
    errorMap: () => ({ message: "Escolha uma frequência" }),
  }),
  quantity: z.string().trim().max(60).optional().default(""),
  presentation: z.enum(["presenteavel", "consumo_proprio"]).optional(),
  plan_notes: z.string().trim().max(1000).optional().default(""),
  full_name: z.string().trim().min(3, "Informe seu nome completo").max(120),
  email: z.string().trim().toLowerCase().email("E-mail inválido").max(160),
  whatsapp: z
    .string()
    .trim()
    .refine((v) => normalizePhoneBR(v) !== null, "WhatsApp inválido. Use DDD + número"),
  city: z.string().trim().min(2, "Informe a cidade").max(80),
  state: z.enum(BR_STATES as [string, ...string[]], {
    errorMap: () => ({ message: "Selecione o estado" }),
  }),
  cep: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((v) => !v || /^\d{5}-?\d{3}$/.test(v), "CEP inválido"),
  neighborhood: z.string().trim().max(80).optional().default(""),
  address: z.string().trim().max(200).optional().default(""),
  contact_notes: z.string().trim().max(1000).optional().default(""),
  consent_privacy: z.literal(true, {
    errorMap: () => ({ message: "É necessário concordar com a política de privacidade" }),
  }),
  consent_marketing: z.boolean().default(false),
}).superRefine((data, ctx) => {
  if (!data.preferences.length && !data.surprise_me) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["preferences"], message: "Escolha ao menos uma preferência" });
  }
});

export type LeadInput = z.input<typeof leadSchema>;
