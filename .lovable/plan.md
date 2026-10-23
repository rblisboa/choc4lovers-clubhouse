# Correções do MVP Choc4lovers

- Preservar as páginas, os dados e a identidade visual existentes.
- Adicionar primeiro acesso com senha escolhida por você, exclusivo para rblisboa2022@gmail.com, sem substituir uma conta existente. Proteger a atribuição de acesso contra solicitações simultâneas e manter recuperação de senha.
- Restaurar os botões comerciais de WhatsApp com +5585998386599 no cabeçalho, apresentação e confirmação, com as mensagens solicitadas.
- Reproduzir o problema de envio e corrigir gravação, validação, prevenção de duplicidade e confirmação verdadeira.
- Retirar Resend. Manter notificações registradas e permitir nova tentativa pelo painel. O envio de e-mails personalizados precisa de um domínio próprio verificado ou serviço externo configurado; o banco e a autenticação não enviam esses avisos automaticamente.
- Testar formulário, links, bloqueios administrativos e permissões sem criar uma senha ou conta em seu nome.

## Detalhes técnicos
- Reutilizar tabelas, componentes e funções existentes; mudanças de banco somente aditivas.
- A implementação usa funções de backend do projeto TanStack, não Edge Functions, conforme a arquitetura disponível.
- Papéis ficam separados dos perfis, com autorização verificada no backend e RLS preservado.
- E-mails ficam pendentes quando faltar configuração real, sem impedir a gravação de leads.