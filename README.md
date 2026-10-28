# Choc4lovers Clubhouse

# PROJETO MVP — CHOC4LOVERS
## Plataforma de clube de assinatura de chocolates

Atue como um desenvolvedor full-stack sênior, especialista em UX/UI, SaaS, sistemas de assinatura, CRM e automações de negócio.

Crie uma aplicação web funcional, responsiva e profissional chamada **Choc4lovers**, um clube de assinatura de chocolates que permite ao visitante montar seu plano e solicitar uma assinatura. No MVP, a venda, a ativação da assinatura e a cobrança serão realizadas manualmente pelo administrador, principalmente por WhatsApp.

**IMPORTANTE:** não crie somente um protótipo visual. Implemente a estrutura funcional da aplicação, utilizando os recursos de backend e cloud do Lovable, com banco de dados persistente, autenticação, autorização, operações CRUD, funções de backend, integrações e tratamento de erros.

Antes de implementar, analise os requisitos, defina a arquitetura e organize o desenvolvimento em etapas. Preserve os requisitos deste documento ao longo de toda a implementação.

---

# 1. OBJETIVO DO NEGÓCIO

Validar três hipóteses principais:

1. Visitantes se interessam pela proposta e preenchem o formulário para montar seu plano.
2. Os leads se transformam em clientes pagantes após negociação manual pelo WhatsApp.
3. Os clientes renovam suas assinaturas e geram novas vendas recorrentes.

O MVP precisa conectar a experiência pública do cliente à operação administrativa.

## Modelo operacional inicial

- O visitante conhece o clube pela landing page.
- Monta seu plano de chocolates.
- Envia seus dados e preferências.
- O sistema registra o lead no banco de dados.
- O administrador recebe um e-mail de novo lead.
- O cliente pode iniciar uma conversa no WhatsApp com uma mensagem pré-preenchida.
- O administrador negocia preço, disponibilidade, frete, entrega e pagamento.
- Após a confirmação, o administrador converte o lead em cliente e registra manualmente a venda.
- O administrador ativa a assinatura, registra os pedidos e acompanha as entregas.
- O sistema organiza o pós-venda e os lembretes de renovação.

**Não implementar pagamento online obrigatório, checkout financeiro, cobrança automática ou ativação automática de assinatura nesta fase.** Deixar a arquitetura preparada para futuras integrações de pagamento e recorrência.

---

# 2. IDENTIDADE VISUAL E EXPERIÊNCIA

Criar uma identidade visual sofisticada, divertida, acolhedora e contemporânea, com foco em chocolate, presente, descoberta e prazer.

## Paleta de cores

Utilizar as seguintes cores como base:

- Marrom chocolate: `#4A241B`
- Marrom profundo: `#2D1714`
- Rosa pink: `#F52D83`
- Vermelho chocolate/framboesa: `#D62839`
- Creme claro: `#FFF7F0`
- Branco: `#FFFFFF`
- Cinza suave para fundos administrativos: `#F4F1EF`

Usar o marrom para identidade e textos principais, pink para CTAs e destaques, vermelho para promoções e estados relevantes, e creme para fundos e áreas de leitura.

Evitar excesso de cores simultâneas, aparência infantil, excesso de gradientes e componentes genéricos.

## Tipografia e componentes

- Títulos marcantes, modernos e apetitosos.
- Textos legíveis e com hierarquia visual clara.
- Botões com cantos arredondados.
- Cards com sombras discretas e espaçamento consistente.
- Ícones simples e elegantes.
- Fotografias de alta qualidade de chocolates, caixas e experiências de presente.
- Animações sutis, sem comprometer o desempenho.
- Layout adaptado a celular, tablet e desktop.
- Acessibilidade, contraste adequado e estados de foco visíveis.

O nome deve aparecer sempre como **Choc4lovers**, respeitando exatamente essa grafia.

Criar um logotipo tipográfico inicial que destaque o número 4 de maneira criativa. Organizar os componentes visuais para facilitar a futura substituição por um logotipo definitivo.

Toda a interface pública e administrativa deve estar em português brasileiro, utilizando moeda BRL (R$), datas no padrão brasileiro e fuso horário `America/Sao_Paulo`.

---

# 3. ARQUITETURA E LOVABLE CLOUD

Utilizar os recursos nativos de backend e cloud disponíveis no Lovable para construir uma aplicação de verdade.

Priorizar:

- Banco de dados persistente.
- Autenticação administrativa.
- Controle de acesso e autorização no backend.
- Funções de backend para operações privilegiadas e integrações.
- Armazenamento de imagens e arquivos quando necessário.
- Gestão segura de variáveis e secrets.
- Integração com Resend para e-mails transacionais.
- Logs e tratamento de falhas.
- Validação dos dados tanto no frontend quanto no backend.
- Estrutura modular, organizada e preparada para expansão.

Usar os recursos nativos do Lovable Cloud quando disponíveis. Se algum recurso exigir uma integração externa, explicar a dependência e configurar a integração sem simular que ela já está funcionando.

Nunca colocar chaves de API, credenciais administrativas ou secrets no frontend.

Não criar dados fictícios como se fossem vendas reais. Se forem necessários dados de demonstração, identificá-los claramente como exemplos e permitir sua remoção.

---

# 4. ÁREA PÚBLICA — LANDING PAGE

Criar uma página inicial atraente, com foco em conversão.

## 4.1 Cabeçalho

Incluir:

- Logotipo Choc4lovers.
- Navegação: Início, Como funciona, Monte seu plano e Dúvidas frequentes.
- CTA destacado: "Montar meu plano".
- Ícone de engrenagem no canto superior direito, discreto e visualmente separado da navegação principal, para acesso à área administrativa.

A engrenagem deve abrir a rota `/admin/login`. Ela não concede acesso ao painel por si só. Todas as rotas e operações administrativas devem exigir autenticação e autorização no backend.

## 4.2 Hero principal

Criar uma seção visual impactante com fotografia de chocolates, caixas e embalagens.

Sugestão de texto:

**Seu amor por chocolate merece uma caixa só sua.**

Descubra uma experiência de chocolates pensada para o seu gosto, seu orçamento e o seu momento.

CTA principal: "Monte sua caixa".

CTA secundário: "Descubra como funciona".

## 4.3 Como funciona

Apresentar quatro etapas visuais:

1. Escolha seus chocolates favoritos.
2. Monte seu plano conforme seu orçamento.
3. Converse com a Choc4lovers e confirme seu pedido.
4. Receba sua caixa e prepare-se para a próxima experiência.

Deixar explícito que a disponibilidade, o valor final, a entrega e a contratação são confirmados pela equipe.

## 4.4 Benefícios

Destacar:

- Personalização da caixa.
- Escolha de orçamento e frequência.
- Experiência de descoberta de chocolates.
- Atendimento humano pelo WhatsApp.
- Possibilidade de renovar ou ajustar o plano.

## 4.5 Depoimentos e avaliações

Criar uma estrutura preparada para exibir depoimentos reais futuramente.

Não inventar avaliações, nomes de clientes ou notas. Se não houver avaliações cadastradas, ocultar a seção ou exibir uma chamada para futuras avaliações.

## 4.6 Perguntas frequentes

Incluir perguntas sobre:

- Como funciona a assinatura?
- Posso escolher os chocolates?
- Como funciona o pagamento?
- Qual é o valor da entrega?
- Posso alterar meu plano?
- Como funciona a renovação?
- Como entro em contato com a equipe?

As respostas devem refletir o modelo manual do MVP, sem prometer pagamentos automáticos ou entregas ainda não configuradas.

## 4.7 Rodapé

Incluir contatos configuráveis, links para políticas de privacidade e termos, informações da marca e redes sociais.

Não inventar endereço comercial, CNPJ, telefone ou perfis sociais.

---

# 5. FORMULÁRIO — MONTE SEU PLANO

Criar uma experiência de formulário agradável, dividida em etapas, com indicador de progresso e resumo das escolhas.

O formulário deve funcionar bem em dispositivos móveis.

## Etapa 1 — Preferências de chocolates

Permitir selecionar categorias e preferências, tais como:

- Chocolate ao leite.
- Chocolate amargo.
- Chocolate branco.
- Bombons e trufas.
- Barras de chocolate.
- Recheados.
- Chocolates especiais.
- Surpresas do mês.

Permitir múltiplas escolhas e opção "Quero ser surpreendido".

Essas opções devem ser administráveis no painel. Não assumir que todos os produtos estão disponíveis em estoque.

Incluir campo opcional para informar preferências, restrições alimentares ou observações.

Não prometer que um produto é seguro para pessoas com alergias. Exibir uma orientação para confirmar ingredientes e possíveis traços diretamente com a equipe.

## Etapa 2 — Plano desejado

Solicitar:

- Orçamento pretendido por caixa ou ciclo, em reais.
- Frequência desejada: mensal, quinzenal ou pontual.
- Quantidade desejada de itens, com opção de informar uma faixa ou deixar a definição para a equipe.
- Preferência de apresentação: presenteável ou consumo próprio.
- Observações adicionais.

A frequência quinzenal e os pedidos pontuais são preferências comerciais, não garantias de disponibilidade.

Não calcular um preço definitivo com base em regras fictícias. O orçamento informado representa a preferência do cliente. O valor final será definido e confirmado pelo administrador.

## Etapa 3 — Dados de contato

Campos:

- Nome completo — obrigatório.
- E-mail — obrigatório.
- WhatsApp com DDD — obrigatório.
- Cidade — obrigatória.
- Estado — obrigatório.
- CEP — opcional nesta etapa.
- Bairro e endereço — opcionais nesta etapa, para coleta posterior quando necessário.
- Observações — opcionais.

Incluir checkbox obrigatório de ciência da política de privacidade e tratamento dos dados para responder à solicitação.

Separar a autorização para comunicações promocionais futuras, que deve ser opcional, específica e desmarcada por padrão.

Implementar validação de campos, normalização do telefone e mensagens de erro claras.

## Etapa 4 — Revisão e envio

Exibir resumo de:

- Preferências de chocolates.
- Orçamento.
- Frequência.
- Quantidade.
- Dados de contato.

Permitir voltar e editar qualquer etapa.

Botão final: "Enviar meu plano".

Ao enviar:

1. Validar os dados no backend.
2. Criar um registro persistente de lead.
3. Gerar identificador único.
4. Registrar data, origem e status inicial.
5. Acionar o envio de notificação por e-mail ao administrador.
6. Apresentar confirmação de recebimento ao cliente.
7. Disponibilizar botão para continuar no WhatsApp com uma mensagem pronta.

Evitar duplicidade causada por cliques repetidos ou reenvio da mesma solicitação. Se houver falha de e-mail, o lead deverá continuar salvo e a notificação poderá ser reenviada.

---

# 6. INTEGRAÇÃO COM WHATSAPP

Após o envio do formulário, apresentar o botão:

**"Continuar pelo WhatsApp"**

Gerar uma mensagem pré-preenchida com os dados relevantes do plano, por exemplo:

"Olá, Choc4lovers! Acabei de montar meu plano pelo site e gostaria de conversar sobre minha caixa de chocolates.

Nome: [nome]
Preferências: [preferências]
Orçamento desejado: [orçamento]
Frequência: [frequência]
Quantidade: [quantidade]
Cidade/UF: [cidade e estado]
Código da solicitação: [identificador]

Podemos conversar sobre as opções disponíveis?"

Codificar corretamente a mensagem para uma URL do WhatsApp.

O telefone comercial de destino deve ser configurável nas configurações administrativas, armazenado em formato internacional e sem estar espalhado pelo código.

Não inventar o telefone da empresa.

O WhatsApp será aberto pelo navegador ou aplicativo do cliente. Não afirmar que a mensagem foi enviada ou lida automaticamente.

O lead deverá estar salvo antes da abertura do WhatsApp.

---

# 7. NOTIFICAÇÕES POR E-MAIL — RESEND

Integrar o Resend para envio de e-mails transacionais por funções de backend.

Configurar os secrets necessários, como a chave de API do Resend e os endereços de remetente e destinatário autorizados.

Não expor secrets ao navegador.

## 7.1 Alerta de novo lead para o administrador

Sempre que um novo lead for registrado, enviar um e-mail com:

Assunto: Novo lead recebido — Choc4lovers

Conteúdo:

- Nome do cliente.
- E-mail.
- WhatsApp.
- Cidade e estado.
- Preferências de chocolates.
- Orçamento.
- Frequência.
- Quantidade.
- Data de entrada.
- Identificador do lead.
- Link para abrir o lead no painel administrativo.

## 7.2 E-mails para o cliente

Preparar modelos transacionais para:

- Confirmação de recebimento da solicitação.
- Confirmação do pedido, após registro administrativo.
- Atualização relevante do pedido ou entrega.
- Aviso de envio, quando aplicável.
- Entrega concluída.
- Lembrete de renovação.
- Agradecimento e solicitação de avaliação.

Enviar somente quando o evento correspondente ocorrer e houver os dados necessários.

A confirmação do formulário não deve ser confundida com a confirmação da contratação.

Os e-mails de renovação e marketing devem respeitar a finalidade do contato, a autorização aplicável e as opções de descadastro.

## 7.3 Controle de envios

Registrar no banco de dados:

- Tipo de notificação.
- Destinatário.
- Registro relacionado.
- Data e hora.
- Status: pendente, enviado ou falhou.
- Identificador da mensagem do provedor, quando disponível.
- Detalhe técnico seguro em caso de erro.

Implementar tratamento de falhas e prevenção de envios duplicados.

Não considerar um e-mail enviado com sucesso apenas porque o botão foi clicado. Registrar o resultado real retornado pela integração.

Criar estrutura que permita adicionar futuramente webhooks do Resend para acompanhamento de entregas e falhas.

---

# 8. PAINEL ADMINISTRATIVO

Criar um dashboard profissional, funcional e independente da área pública.

Acesso pela engrenagem do cabeçalho e pela rota `/admin/login`.

Criar área administrativa com navegação lateral, cabeçalho com usuário autenticado, notificações e opção de sair.

## Menu administrativo

1. Dashboard.
2. Leads.
3. Acompanhamento comercial.
4. Clientes.
5. Assinaturas.
6. Pedidos e vendas.
7. Entregas.
8. Renovações e pós-venda.
9. Catálogo de chocolates.
10. Relatórios.
11. Configurações.

## 8.1 Dashboard inicial

Exibir indicadores calculados a partir dos registros reais:

- Leads recebidos no período.
- Leads novos sem contato.
- Negociações em andamento.
- Clientes ativos.
- Assinaturas ativas.
- Pedidos confirmados.
- Receita registrada no período.
- Pedidos aguardando preparação.
- Entregas pendentes.
- Renovações próximas.
- Leads convertidos.
- Taxa de conversão de lead em cliente.

Disponibilizar filtros por período e status.

Cada indicador deve permitir abrir a listagem correspondente.

Não preencher indicadores com números fictícios. Mostrar zero ou um estado vazio quando não houver registros.

A receita deve considerar somente vendas efetivamente registradas como confirmadas, identificando separadamente os valores pagos e pendentes.

## 8.2 Engrenagem e acesso seguro

O acesso administrativo deve ser restrito a usuários autorizados.

Implementar autenticação real, logout e recuperação segura de acesso, conforme os recursos disponíveis no Lovable Cloud.

Não criar uma senha fixa no frontend nem permitir que qualquer pessoa se cadastre livremente como administrador.

O primeiro administrador deve ser provisionado por um processo seguro, documentado e compatível com a plataforma.

Proteger todas as rotas, operações e dados administrativos no backend. Ocultar os links na interface não é uma medida suficiente de segurança.

---

# 9. GESTÃO DE LEADS E CRM

Criar uma tabela funcional de leads com:

- Código.
- Data de entrada.
- Nome.
- WhatsApp.
- E-mail.
- Cidade/UF.
- Orçamento.
- Preferências.
- Frequência.
- Status comercial.
- Responsável.
- Próxima ação.
- Data do próximo contato.
- Origem.

Permitir pesquisa, filtros, ordenação e paginação.

Criar os seguintes status comerciais:

- Novo lead.
- Contato pendente.
- Contato realizado.
- Em negociação.
- Proposta enviada.
- Aguardando pagamento.
- Convertido.
- Perdido.
- Sem resposta.

Permitir editar o status, registrar notas, agendar retornos e consultar o histórico de interações.

Incluir botões:

- Abrir WhatsApp.
- Enviar e-mail, quando configurado.
- Registrar contato.
- Criar lembrete.
- Marcar como perdido.
- Converter em cliente.

Ao converter um lead, abrir uma tela para revisar os dados e confirmar a criação do cliente, da assinatura e do pedido, conforme aplicável.

Evitar criar clientes duplicados durante a conversão. Permitir associar um lead a um cliente existente.

Registrar histórico de mudanças importantes, incluindo data e usuário responsável.

---

# 10. CLIENTES

Criar cadastro centralizado de clientes.

Campos:

- Nome completo.
- E-mail.
- WhatsApp.
- Cidade e estado.
- CEP e endereço, quando coletados.
- Data de cadastro.
- Origem do lead.
- Preferências de chocolates.
- Observações.
- Status do relacionamento.
- Autorizações de comunicação pertinentes.

A página individual do cliente deve apresentar:

- Dados cadastrais.
- Leads relacionados.
- Histórico de contatos.
- Assinaturas.
- Pedidos.
- Pagamentos registrados.
- Entregas.
- Renovações.
- Observações internas.

Permitir editar dados, consultar histórico e criar novos pedidos.

Evitar excluir clientes com histórico comercial sem uma ação deliberada e controles apropriados. Preferir desativação ou arquivamento quando possível.

---

# 11. ASSINATURAS E ATIVAÇÃO MANUAL

Criar um módulo de assinaturas separado dos pedidos.

Campos:

- Cliente.
- Plano.
- Preferências.
- Frequência.
- Quantidade.
- Valor acordado.
- Data de início.
- Próxima data prevista do ciclo.
- Data de término, quando aplicável.
- Status.
- Observações comerciais.
- Condições de entrega.

Status possíveis:

- Aguardando confirmação.
- Aguardando pagamento.
- Ativa.
- Pausada.
- Cancelada.
- Encerrada.

**A ativação deve ser exclusivamente manual neste MVP.**

O administrador só poderá marcar uma assinatura como ativa depois de confirmar as condições comerciais e registrar a situação do pagamento de acordo com o processo real da empresa.

Não presumir que o cliente pagou porque enviou o formulário, abriu o WhatsApp ou recebeu um e-mail.

Permitir:

- Criar assinatura manualmente.
- Editar plano e valor.
- Ativar ou pausar.
- Cancelar ou encerrar.
- Registrar motivo.
- Definir próxima renovação.
- Consultar histórico de alterações.

Preparar a arquitetura para futuras integrações com gateways de pagamento, sem ativar cobrança automática.

---

# 12. PEDIDOS, VENDAS E PAGAMENTOS

Criar um módulo de pedidos que permita registrar vendas confirmadas manualmente.

Cada pedido deverá ter:

- Número único.
- Cliente.
- Assinatura relacionada, quando aplicável.
- Data do pedido.
- Itens e quantidades.
- Valor dos produtos.
- Valor do frete.
- Desconto, quando houver.
- Valor total.
- Forma de pagamento.
- Status do pagamento.
- Data do pagamento, quando confirmado.
- Status do pedido.
- Observações.

Status do pedido:

- Em negociação.
- Aguardando pagamento.
- Confirmado.
- Em preparação.
- Pronto para envio.
- Enviado.
- Entregue.
- Cancelado.

Status do pagamento:

- Não informado.
- Pendente.
- Parcial, quando aplicável.
- Pago.
- Reembolsado, quando aplicável.

Separar claramente o status do pedido do status do pagamento.

Não processar pagamentos neste MVP. O administrador registra manualmente as informações e confirmações reais.

Implementar histórico de alterações e regras para evitar que pedidos cancelados ou não pagos sejam tratados automaticamente como vendas concluídas.

---

# 13. ENTREGAS E OCORRÊNCIAS

Criar uma tela operacional para acompanhar a preparação e a entrega das caixas.

Cada entrega deve estar relacionada a um pedido.

Campos:

- Cliente.
- Pedido.
- Endereço de entrega.
- Data prevista.
- Data efetiva.
- Responsável pela preparação.
- Responsável pela entrega, quando aplicável.
- Método de entrega.
- Código de rastreio, quando houver.
- Status.
- Observações.
- Ocorrências.

Status de entrega:

- Aguardando preparação.
- Em preparação.
- Pronto para envio.
- Em trânsito.
- Entregue.
- Tentativa sem sucesso.
- Reagendada.
- Ocorrência registrada.

Permitir atualizar o status, registrar ocorrências, alterar a previsão e consultar o histórico.

Quando um status relevante mudar, disponibilizar o envio de e-mail ao cliente, conforme a configuração da notificação e a existência de dados válidos.

Não afirmar que a entrega foi realizada sem confirmação administrativa ou integração real com o operador logístico.

Criar uma visão operacional com filtros por data, status e responsável.

---

# 14. PÓS-VENDA, AVALIAÇÕES E RENOVAÇÕES

Criar um módulo de acompanhamento pós-venda.

Para cada pedido entregue, permitir programar:

- Agradecimento.
- Solicitação de avaliação.
- Lembrete de renovação.
- Contato comercial para o próximo ciclo.

Criar uma tela de renovações com:

- Cliente.
- Assinatura.
- Último pedido.
- Próxima data prevista.
- Data do último contato.
- Próxima ação.
- Status da renovação.

Status possíveis:

- Ainda não contatado.
- Lembrete programado.
- Contato realizado.
- Aguardando resposta.
- Renovação confirmada.
- Renovação recusada.
- Sem resposta.

## Automação de lembretes

Implementar uma rotina de backend agendada, utilizando os recursos disponíveis no Lovable Cloud, para identificar renovações próximas e processar os lembretes conforme a configuração.

Permitir configurar quantos dias antes da próxima data prevista o lembrete deve ser criado ou enviado.

O fluxo deve:

1. Localizar assinaturas ativas com renovação próxima.
2. Verificar se o lembrete correspondente já foi processado.
3. Criar um lembrete administrativo.
4. Enviar e-mail ao cliente quando aplicável.
5. Enviar notificação administrativa por e-mail.
6. Registrar o resultado.
7. Evitar duplicidade.

A mensagem ao cliente deve explicar que chegou o momento de conversar sobre a próxima caixa, sem cobrar automaticamente nem afirmar que a renovação foi concluída.

Exemplo:

"Oi, [nome]! Está chegando a hora da sua próxima experiência Choc4lovers! 🍫 Queremos conversar com você para confirmar suas preferências e organizar sua próxima caixa. Responda a este e-mail ou fale conosco pelo WhatsApp: [link configurado]."

O dashboard deve destacar as renovações próximas e permitir abrir a ficha do cliente.

Se o agendamento automático não estiver disponível na configuração atual, implementar a rotina de forma segura, documentar a limitação e disponibilizar uma ação administrativa para executar o processamento manualmente. Não simular uma automação ativa.

---

# 15. CATÁLOGO DE CHOCOLATES E PLANOS

Criar um catálogo administrativo para gerenciar:

- Nome do produto.
- Categoria.
- Descrição.
- Imagem.
- Marca, quando aplicável.
- Disponibilidade.
- Observações sobre ingredientes, quando fornecidas.
- Status ativo/inativo.

Permitir configurar categorias e preferências que aparecem no formulário público.

Criar cadastro de modelos de plano com:

- Nome.
- Descrição.
- Frequência sugerida.
- Quantidade sugerida.
- Faixa de orçamento sugerida.
- Status ativo/inativo.

Os planos sugeridos são referências para o cliente, não preços garantidos.

Não inventar produtos, preços, estoque ou disponibilidade. O catálogo deve iniciar vazio ou com exemplos claramente identificados como demonstração, que possam ser removidos.

---

# 16. CONFIGURAÇÕES ADMINISTRATIVAS

Criar uma tela para configurar:

- Nome da marca.
- E-mail administrativo de notificação.
- Telefone comercial do WhatsApp.
- Remetente dos e-mails.
- Logotipo.
- Links de redes sociais.
- Prazo padrão para lembrete de renovação.
- Preferências de notificação.
- Textos institucionais.
- Fuso horário.
- Parâmetros operacionais.

Segredos técnicos, como chaves do Resend, devem ser gerenciados pelo mecanismo seguro de secrets da plataforma, nunca exibidos nessa tela.

Exibir o estado das integrações de forma honesta: configurada, pendente ou com falha, conforme verificações reais.

---

# 17. RELATÓRIOS E INDICADORES

Criar relatórios com filtros por período.

Indicadores desejados:

- Leads por período e origem.
- Taxa de conversão.
- Tempo médio entre entrada do lead e conversão.
- Vendas confirmadas.
- Receita registrada.
- Pagamentos pendentes.
- Clientes ativos.
- Assinaturas ativas, pausadas e canceladas.
- Taxa de renovação.
- Pedidos por status.
- Entregas no prazo, quando houver dados suficientes.

Apresentar gráficos simples, tabelas e filtros.

Distinguir claramente:

- Valor negociado.
- Valor de vendas confirmadas.
- Valor efetivamente pago.
- Valor pendente.

Não considerar estimativas ou propostas como receita realizada.

Permitir exportar dados operacionais em CSV, respeitando as permissões do usuário.

---

# 18. MODELAGEM DO BANCO DE DADOS

Projetar tabelas relacionais com chaves, índices, restrições e relacionamentos adequados.

A estrutura inicial deverá contemplar entidades equivalentes a:

1. `profiles` — perfis administrativos e permissões.
2. `leads` — solicitações recebidas.
3. `lead_preferences` — preferências e detalhes do plano, se a normalização exigir.
4. `lead_interactions` — contatos e histórico comercial.
5. `customers` — clientes cadastrados.
6. `products` — catálogo de chocolates.
7. `product_categories` — categorias.
8. `plan_templates` — modelos de planos.
9. `subscriptions` — assinaturas.
10. `orders` — pedidos.
11. `order_items` — itens dos pedidos.
12. `payments` — registros manuais de pagamentos.
13. `deliveries` — entregas.
14. `delivery_events` — histórico de entrega e ocorrências.
15. `renewal_tasks` — lembretes e renovações.
16. `notification_logs` — histórico de e-mails e notificações.
17. `app_settings` — configurações não secretas.
18. `audit_logs` — histórico de ações administrativas relevantes.

Ajustar a modelagem quando necessário para manter consistência, integridade e facilidade de manutenção.

Utilizar identificadores únicos, datas de criação e atualização e relacionamentos adequados.

Definir regras de exclusão e atualização para preservar histórico financeiro e operacional.

Não armazenar dados de cartão, senhas em texto puro ou secrets nas tabelas da aplicação.

---

# 19. SEGURANÇA E PRIVACIDADE

Implementar segurança desde o início.

Requisitos obrigatórios:

- Autenticação administrativa real.
- Autorização verificada no backend.
- Políticas de acesso por linha, como RLS, quando suportadas pelo banco utilizado.
- Permissões mínimas necessárias.
- Nenhum acesso público irrestrito a dados de leads, clientes, pedidos, pagamentos ou entregas.
- Nenhuma operação administrativa protegida apenas por regras da interface.
- Validação de entrada no backend.
- Proteção contra abuso e envios automatizados de formulários.
- Proteção contra duplicidade de operações.
- Tratamento seguro de erros.
- Segredos exclusivamente no ambiente seguro de backend.
- Registro de ações administrativas críticas.
- Coleta mínima de dados pessoais.
- Política de privacidade e tratamento compatível com a LGPD.
- Processos adequados para solicitações de acesso, correção e exclusão de dados quando aplicáveis.

O formulário público só deve permitir a criação de leads pelos campos autorizados. Ele não pode permitir consultar outros leads, alterar clientes, criar pedidos, modificar configurações ou acessar o painel.

Criar e verificar as políticas de acesso para todas as tabelas relevantes, inclusive tabelas auxiliares e logs.

Não usar permissões públicas amplas para facilitar a implementação.

---

# 20. EXPERIÊNCIA E QUALIDADE DE USO

Implementar:

- Estados de carregamento.
- Mensagens de sucesso e erro.
- Confirmação antes de ações críticas.
- Formulários com validação.
- Tabelas responsivas.
- Filtros funcionais.
- Paginação.
- Pesquisa.
- Ordenação.
- Estados vazios úteis.
- Navegação clara entre registros relacionados.
- Formatação brasileira de moeda e data.
- Acessibilidade básica.
- Tratamento de erros de rede e integração.
- Proteção contra múltiplos envios.

Todos os botões e links devem executar a ação anunciada.

Não deixar botões decorativos que aparentem funcionar sem implementar seu comportamento.

---

# 21. CRITÉRIOS DE ACEITAÇÃO DO MVP

Considerar o MVP funcional somente quando os fluxos a seguir forem testados.

## Fluxo A — Aquisição

1. Visitante abre a landing page.
2. Clica em "Montar meu plano".
3. Preenche as etapas.
4. Revisa e envia.
5. O lead é salvo no banco.
6. O sistema apresenta a confirmação.
7. O botão do WhatsApp abre a conversa com os dados corretos.
8. O administrador recebe o e-mail, se a integração estiver configurada.

## Fluxo B — Conversão

1. Administrador entra no painel.
2. Localiza o lead.
3. Registra contatos e negociação.
4. Atualiza o status comercial.
5. Converte o lead em cliente.
6. Registra as condições acordadas.
7. Cria o pedido e a assinatura, conforme aplicável.
8. Registra o pagamento após confirmação real.
9. Ativa manualmente a assinatura.

## Fluxo C — Operação

1. O pedido confirmado aparece na operação.
2. O administrador acompanha a preparação.
3. Registra a entrega e eventuais ocorrências.
4. Atualiza o status.
5. O histórico fica disponível na ficha do cliente.
6. As notificações são enviadas conforme os eventos configurados.

## Fluxo D — Renovação

1. A assinatura ativa tem uma próxima data prevista.
2. A rotina identifica a renovação próxima.
3. O lembrete aparece no dashboard.
4. O sistema registra os envios e seus resultados.
5. O cliente é contatado.
6. O administrador registra a resposta.
7. Uma nova compra pode gerar um novo pedido sem perder o histórico anterior.

## Fluxo E — Segurança

1. Um visitante não autenticado não acessa o painel.
2. Um usuário não autorizado não consegue acessar os dados administrativos diretamente pelo backend.
3. Os dados de um lead não ficam acessíveis publicamente.
4. As chaves de integração não aparecem no navegador.
5. As operações administrativas respeitam as permissões configuradas.

---

# 22. ORDEM DE IMPLEMENTAÇÃO

Construir em etapas, mantendo o projeto executável após cada uma.

**Fase 1 — Fundação**
- Estrutura visual e identidade.
- Landing page responsiva.
- Banco de dados.
- Autenticação administrativa.
- Autorização e políticas de acesso.

**Fase 2 — Aquisição**
- Formulário de montagem de plano.
- Persistência dos leads.
- Confirmação de envio.
- Integração com WhatsApp.
- Notificação por Resend.

**Fase 3 — Operação comercial**
- Dashboard.
- CRM de leads.
- Clientes.
- Conversão de leads.
- Assinaturas e pedidos.
- Registro manual de pagamentos.

**Fase 4 — Logística**
- Preparação.
- Entregas.
- Ocorrências.
- Histórico operacional.

**Fase 5 — Retenção**
- Pós-venda.
- Renovação.
- E-mails transacionais.
- Rotinas agendadas.
- Logs e prevenção de duplicidade.

**Fase 6 — Validação**
- Testar todos os critérios de aceitação.
- Corrigir falhas de integração.
- Revisar permissões e segurança.
- Testar experiência mobile.
- Validar formulários, filtros e relatórios.

---

# 23. INSTRUÇÕES FINAIS PARA O LOVABLE

Antes de concluir, apresentar uma lista das integrações configuradas e pendentes, incluindo Resend, domínio de envio, secrets, rotina agendada e provisionamento do primeiro administrador.

Não afirmar que um e-mail, agendamento ou integração funciona sem testar ou confirmar sua configuração real.

Não implementar pagamentos automáticos nesta versão.

Não inventar telefone comercial, endereço, preços, produtos disponíveis, avaliações ou dados reais de clientes.

Priorizar uma aplicação funcional, consistente e segura em vez de adicionar funcionalidades decorativas.

Se houver uma decisão técnica que dependa de configuração externa, implementar o que for possível com segurança, documentar a dependência e informar claramente o que precisa ser configurado.

**Resultado esperado:** uma plataforma Choc4lovers que conecta a landing page a um painel administrativo real e permite acompanhar o ciclo completo: visitante → lead → negociação → cliente → assinatura ativa → pedido → entrega → pós-venda → renovação.

O MVP deve ser simples o suficiente para operar manualmente desde o primeiro dia e ter uma arquitetura preparada para evoluir para pagamentos recorrentes e automações mais avançadas no futuro.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://choc4lovers-clubhouse.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1a5b1f4d-c47b-4214-b34f-d2d9788c65d0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
