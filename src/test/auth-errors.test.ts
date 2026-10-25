import { describe, expect, it } from "vitest";
import { authErrorMessage } from "@/lib/auth-errors";

describe("Authentication failure classification", () => {
  it("identifies the reported compromised password refusal", () => {
    expect(authErrorMessage({ message: "Password is known to be weak and easy to guess, please choose a different one." }, "fallback")).toContain("recusada por ser fraca");
  });
  it("does not expose an unrecognized provider error", () => {
    expect(authErrorMessage({ message: "private provider detail" }, "Não foi possível concluir.")).toBe("Não foi possível concluir.");
  });
  it("distinguishes email confirmation from wrong credentials", () => {
    expect(authErrorMessage({ code: "email_not_confirmed" }, "fallback")).toContain("Confirme seu e-mail");
    expect(authErrorMessage({ code: "invalid_credentials" }, "fallback")).toContain("incorretos");
  });
});