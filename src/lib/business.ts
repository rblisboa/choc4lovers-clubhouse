export const ADMIN_EMAIL = "rblisboa2022@gmail.com";
export const COMMERCIAL_WHATSAPP = "+5585998386599";
export const VISITOR_MESSAGE = "Olá, Choc4lovers! Conheci o site e gostaria de saber mais sobre o clube de chocolates.";

export function isOwnerEmail(email: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}