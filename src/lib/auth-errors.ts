type AuthFailure = { code?: string | undefined; status?: number | undefined; message?: string | undefined };

export function authErrorMessage(error: AuthFailure, fallback: string): string {
  if (error.code === "weak_password" || /known to be weak|easy to guess/i.test(error.message ?? "")) {
    return "Esta senha foi recusada por ser fraca ou conhecida em vazamentos. Escolha outra senha, mais longa e exclusiva, combinando letras, números e símbolos.";
  }
  if (error.code === "email_not_confirmed") return "Confirme seu e-mail pelo link recebido antes de entrar.";
  if (error.code === "user_already_exists") return "Esta conta já existe. Entre com sua senha ou use Esqueci minha senha.";
  if (error.code === "invalid_credentials") return "E-mail ou senha incorretos. Se ainda não criou a conta, use Primeiro acesso.";
  if (error.status === 429 || error.code === "over_email_send_rate_limit") return "Muitas tentativas em pouco tempo. Aguarde antes de solicitar novamente.";
  if (error.code === "same_password") return "Escolha uma senha diferente da senha atual.";
  return fallback;
}