export type Tone = "neutral" | "pink" | "red" | "green" | "amber" | "brown";

type LabelMap = Record<string, { label: string; tone: Tone }>;

export const LEAD_STATUS: LabelMap = {
  novo: { label: "Novo lead", tone: "pink" },
  contato_pendente: { label: "Contato pendente", tone: "amber" },
  contato_realizado: { label: "Contato realizado", tone: "brown" },
  em_negociacao: { label: "Em negociação", tone: "brown" },
  proposta_enviada: { label: "Proposta enviada", tone: "brown" },
  aguardando_pagamento: { label: "Aguardando pagamento", tone: "amber" },
  convertido: { label: "Convertido", tone: "green" },
  perdido: { label: "Perdido", tone: "red" },
  sem_resposta: { label: "Sem resposta", tone: "neutral" },
};

export const SUB_STATUS: LabelMap = {
  aguardando_confirmacao: { label: "Aguardando confirmação", tone: "amber" },
  aguardando_pagamento: { label: "Aguardando pagamento", tone: "amber" },
  ativa: { label: "Ativa", tone: "green" },
  pausada: { label: "Pausada", tone: "neutral" },
  cancelada: { label: "Cancelada", tone: "red" },
  encerrada: { label: "Encerrada", tone: "neutral" },
};

export const ORDER_STATUS: LabelMap = {
  em_negociacao: { label: "Em negociação", tone: "neutral" },
  aguardando_pagamento: { label: "Aguardando pagamento", tone: "amber" },
  confirmado: { label: "Confirmado", tone: "pink" },
  em_preparacao: { label: "Em preparação", tone: "brown" },
  pronto_envio: { label: "Pronto para envio", tone: "brown" },
  enviado: { label: "Enviado", tone: "brown" },
  entregue: { label: "Entregue", tone: "green" },
  cancelado: { label: "Cancelado", tone: "red" },
};

export const PAYMENT_STATUS: LabelMap = {
  nao_informado: { label: "Não informado", tone: "neutral" },
  pendente: { label: "Pendente", tone: "amber" },
  parcial: { label: "Parcial", tone: "amber" },
  pago: { label: "Pago", tone: "green" },
  reembolsado: { label: "Reembolsado", tone: "red" },
};

export const DELIVERY_STATUS: LabelMap = {
  aguardando_preparacao: { label: "Aguardando preparação", tone: "amber" },
  em_preparacao: { label: "Em preparação", tone: "brown" },
  pronto_envio: { label: "Pronto para envio", tone: "brown" },
  em_transito: { label: "Em trânsito", tone: "pink" },
  entregue: { label: "Entregue", tone: "green" },
  tentativa_sem_sucesso: { label: "Tentativa sem sucesso", tone: "red" },
  reagendada: { label: "Reagendada", tone: "amber" },
  ocorrencia: { label: "Ocorrência registrada", tone: "red" },
};

export const RENEWAL_STATUS: LabelMap = {
  nao_contatado: { label: "Ainda não contatado", tone: "amber" },
  lembrete_programado: { label: "Lembrete programado", tone: "pink" },
  contato_realizado: { label: "Contato realizado", tone: "brown" },
  aguardando_resposta: { label: "Aguardando resposta", tone: "amber" },
  confirmada: { label: "Renovação confirmada", tone: "green" },
  recusada: { label: "Renovação recusada", tone: "red" },
  sem_resposta: { label: "Sem resposta", tone: "neutral" },
};

export const NOTIF_STATUS: LabelMap = {
  pendente: { label: "Pendente", tone: "amber" },
  enviado: { label: "Enviado", tone: "green" },
  falhou: { label: "Falhou", tone: "red" },
  ignorado: { label: "Ignorado", tone: "neutral" },
};

export const FREQUENCY: Record<string, string> = {
  mensal: "Mensal",
  quinzenal: "Quinzenal",
  pontual: "Pontual",
};

export const PRESENTATION: Record<string, string> = {
  presenteavel: "Presenteável",
  consumo_proprio: "Consumo próprio",
};

export const INTERACTION_KIND: Record<string, string> = {
  nota: "Nota",
  whatsapp: "WhatsApp",
  email: "E-mail",
  ligacao: "Ligação",
  status: "Status",
  lembrete: "Lembrete",
  sistema: "Sistema",
};

export const BR_STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export const NOTIFICATION_KIND: Record<string, string> = {
  admin_new_lead: "Novo lead (admin)",
  customer_lead_received: "Recebimento da solicitação",
  customer_order_confirmed: "Pedido confirmado",
  customer_order_update: "Atualização do pedido",
  customer_shipped: "Aviso de envio",
  customer_delivered: "Entrega concluída",
  customer_renewal: "Lembrete de renovação",
  admin_renewal: "Renovação próxima (admin)",
  customer_review: "Agradecimento e avaliação",
};
