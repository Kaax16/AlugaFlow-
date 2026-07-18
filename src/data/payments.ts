export type PaymentMethod = "pix" | "boleto" | "cartao" | "carteira";
export type PaymentChannel = "web" | "app" | "whatsapp";
export type TransactionStatus = "aprovado" | "processando" | "estornado" | "falhou";

/** Meio de pagamento integrado à plataforma (multicanal e multiadquirente). */
export interface PaymentPlatform {
  id: string;
  name: string;
  method: PaymentMethod;
  description: string;
  /** Prazo de liquidação, ex.: "D+0". */
  settlement: string;
  feePct: number;
  connected: boolean;
  /** Participação no volume do mês (0–1). */
  monthShare: number;
}

export interface PaymentTransaction {
  id: string;
  propertyId: string;
  payerName: string;
  method: PaymentMethod;
  channel: PaymentChannel;
  amount: number;
  status: TransactionStatus;
  at: string;
}

export const paymentPlatforms: PaymentPlatform[] = [
  {
    id: "pf-pix",
    name: "Pix",
    method: "pix",
    description: "Cobrança instantânea com QR Code dinâmico e conciliação automática.",
    settlement: "D+0",
    feePct: 0.99,
    connected: true,
    monthShare: 0.58,
  },
  {
    id: "pf-boleto",
    name: "Boleto registrado",
    method: "boleto",
    description: "Boleto com registro, juros e multa configuráveis por contrato.",
    settlement: "D+1",
    feePct: 1.79,
    connected: true,
    monthShare: 0.22,
  },
  {
    id: "pf-cartao",
    name: "Cartão de crédito",
    method: "cartao",
    description: "Recorrência no cartão com retentativa inteligente em caso de falha.",
    settlement: "D+30",
    feePct: 3.49,
    connected: true,
    monthShare: 0.14,
  },
  {
    id: "pf-carteira",
    name: "Carteiras digitais",
    method: "carteira",
    description: "Apple Pay e Google Pay no app do inquilino, com um toque.",
    settlement: "D+2",
    feePct: 2.39,
    connected: false,
    monthShare: 0.06,
  },
];

/** Divisão automática de cada recebimento (split). */
export const splitRules: { label: string; pct: number }[] = [
  { label: "Repasse ao proprietário", pct: 92 },
  { label: "Taxa Aluga+", pct: 5 },
  { label: "Fundo de reserva", pct: 3 },
];

export const paymentTransactions: PaymentTransaction[] = [
  {
    id: "tx-1",
    propertyId: "apto-beira-mar",
    payerName: "Marina Nogueira",
    method: "pix",
    channel: "app",
    amount: 5200,
    status: "aprovado",
    at: "2026-07-17T08:14:00Z",
  },
  {
    id: "tx-2",
    propertyId: "casa-coco",
    payerName: "Rafael Bezerra",
    method: "boleto",
    channel: "web",
    amount: 4300,
    status: "processando",
    at: "2026-07-16T16:40:00Z",
  },
  {
    id: "tx-3",
    propertyId: "apto-coco-parque",
    payerName: "Thiago Frota",
    method: "cartao",
    channel: "app",
    amount: 2650,
    status: "aprovado",
    at: "2026-07-15T10:02:00Z",
  },
  {
    id: "tx-4",
    propertyId: "studio-iracema",
    payerName: "Juliana Sampaio",
    method: "pix",
    channel: "whatsapp",
    amount: 1900,
    status: "aprovado",
    at: "2026-07-12T21:33:00Z",
  },
  {
    id: "tx-5",
    propertyId: "studio-iracema",
    payerName: "Juliana Sampaio",
    method: "cartao",
    channel: "app",
    amount: 1900,
    status: "falhou",
    at: "2026-07-10T07:15:00Z",
  },
  {
    id: "tx-6",
    propertyId: "edificio-atlantico",
    payerName: "Condomínio Atlântico",
    method: "boleto",
    channel: "web",
    amount: 7350,
    status: "aprovado",
    at: "2026-07-08T12:20:00Z",
  },
  {
    id: "tx-7",
    propertyId: "apto-beira-mar",
    payerName: "Marina Nogueira",
    method: "pix",
    channel: "app",
    amount: 180,
    status: "estornado",
    at: "2026-07-05T18:47:00Z",
  },
];

/** Volume recebido por método nos últimos 6 meses (para o gráfico). */
export const monthlyVolumeByMethod: {
  months: string[];
  series: { name: string; data: number[] }[];
} = {
  months: ["Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
  series: [
    { name: "Pix", data: [9800, 10400, 11150, 11900, 12600, 13300] },
    { name: "Boleto", data: [6900, 6400, 6100, 5700, 5400, 5050] },
    { name: "Cartão", data: [2100, 2450, 2700, 2950, 3150, 3300] },
    { name: "Carteiras", data: [0, 0, 450, 780, 1150, 1400] },
  ],
};

export function paymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    pix: "Pix",
    boleto: "Boleto",
    cartao: "Cartão",
    carteira: "Carteira digital",
  };
  return labels[method];
}

export function paymentChannelLabel(channel: PaymentChannel): string {
  const labels: Record<PaymentChannel, string> = {
    web: "Web",
    app: "App",
    whatsapp: "WhatsApp",
  };
  return labels[channel];
}

export function transactionStatusLabel(status: TransactionStatus): string {
  const labels: Record<TransactionStatus, string> = {
    aprovado: "Aprovado",
    processando: "Processando",
    estornado: "Estornado",
    falhou: "Falhou",
  };
  return labels[status];
}
