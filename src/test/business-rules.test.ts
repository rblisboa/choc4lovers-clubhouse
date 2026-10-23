import { describe, expect, it } from "vitest";
import { ADMIN_EMAIL, COMMERCIAL_WHATSAPP, VISITOR_MESSAGE, isOwnerEmail } from "@/lib/business";
import { leadSchema } from "@/lib/lead-schema";
import { leadWhatsAppMessage, waLink } from "@/lib/whatsapp";

describe("Owner and commercial contact rules", () => {
  it("allows only the owner's email", () => {
    expect(ADMIN_EMAIL).toBe("rblisboa2022@gmail.com");
    expect(isOwnerEmail(" RBLISBOA2022@gmail.com ")).toBe(true);
    expect(isOwnerEmail("other@example.com")).toBe(false);
  });
  it("targets the official commercial WhatsApp and encodes the message", () => {
    expect(COMMERCIAL_WHATSAPP).toBe("+5585998386599");
    const link = new URL(waLink(COMMERCIAL_WHATSAPP, VISITOR_MESSAGE) ?? "");
    expect(link.pathname).toBe("/5585998386599");
    expect(link.searchParams.get("text")).toBe(VISITOR_MESSAGE);
  });
  it("includes the persisted code and plan in the commercial conversation", () => {
    const message = leadWhatsAppMessage({ full_name: "Cliente Teste", preferences: ["Ao leite"], budget: 150, frequency: "mensal", quantity: "10 unidades", city: "Fortaleza", state: "CE", code: "L-12345" });
    expect(message).toContain("L-12345");
    expect(message).toContain("Fortaleza/CE");
    expect(message).toContain("150,00");
  });
  it("requires preferences or surprise on the server schema", () => {
    const input = { submission_key: "12345678-1234-4234-8234-123456789012", full_name: "Cliente Teste", email: "test@example.com", whatsapp: "85999999999", city: "Fortaleza", state: "CE", budget: 150, frequency: "mensal", consent_privacy: true };
    expect(leadSchema.safeParse(input).success).toBe(false);
    expect(leadSchema.safeParse({ ...input, surprise_me: true }).success).toBe(true);
  });
});