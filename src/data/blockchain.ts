export type ChainContractStatus = "ativo" | "escrow" | "aguardando_assinatura" | "encerrado";
export type OnchainEventType =
  | "deploy"
  | "assinatura"
  | "caucao"
  | "pagamento"
  | "liberacao"
  | "encerramento";

/** Contrato de locação registrado como smart contract na blockchain. */
export interface SmartContract {
  id: string;
  propertyId: string;
  /** Endereço do contrato na rede. */
  hash: string;
  network: string;
  block: number;
  status: ChainContractStatus;
  /** Caução depositada em escrow, em reais (referência off-chain). */
  escrowBRL: number;
  signers: number;
  totalSigners: number;
  deployedAt: string;
}

export interface OnchainEvent {
  id: string;
  contractId: string;
  type: OnchainEventType;
  description: string;
  txHash: string;
  at: string;
}

/** Carteira da plataforma usada para registrar os contratos. */
export const platformWallet = {
  address: "0x7Fa9385bE102ac3EAc297483Dd6233D62b3e1496",
  network: "Polygon (testnet Amoy)",
  balancePol: 42.8,
};

export const smartContracts: SmartContract[] = [
  {
    id: "sc-beira-mar",
    propertyId: "apto-beira-mar",
    hash: "0x3F1c8A9d02b45E7a91C6f0aD54B3e82c11d97A60",
    network: "Polygon Amoy",
    block: 8412907,
    status: "ativo",
    escrowBRL: 10400,
    signers: 2,
    totalSigners: 2,
    deployedAt: "2025-02-01T14:22:00Z",
  },
  {
    id: "sc-coco",
    propertyId: "casa-coco",
    hash: "0xB82d5C11eF09a34D6b70E2c8A91f4B3D5a6C0e77",
    network: "Polygon Amoy",
    block: 7903341,
    status: "ativo",
    escrowBRL: 8600,
    signers: 2,
    totalSigners: 2,
    deployedAt: "2024-11-15T10:05:00Z",
  },
  {
    id: "sc-iracema",
    propertyId: "studio-iracema",
    hash: "0x91Ee04Fb7C25a80D3f6B1c9E45d2A7803Cb6F514",
    network: "Polygon Amoy",
    block: 8720466,
    status: "escrow",
    escrowBRL: 3800,
    signers: 2,
    totalSigners: 2,
    deployedAt: "2025-06-01T09:41:00Z",
  },
  {
    id: "sc-coco-parque",
    propertyId: "apto-coco-parque",
    hash: "0x5D30bA76E14c9F2a8Bd05E6c37f1D4A902e8C1b3",
    network: "Polygon Amoy",
    block: 8501173,
    status: "ativo",
    escrowBRL: 5300,
    signers: 2,
    totalSigners: 2,
    deployedAt: "2025-03-10T16:58:00Z",
  },
  {
    id: "sc-aldeota",
    propertyId: "cobertura-aldeota",
    hash: "0xE47a2C90b58D1f6A3c4B7d05F92e8A1B60c3D5f8",
    network: "Polygon Amoy",
    block: 8931022,
    status: "aguardando_assinatura",
    escrowBRL: 0,
    signers: 1,
    totalSigners: 2,
    deployedAt: "2026-07-14T11:30:00Z",
  },
];

export const onchainEvents: OnchainEvent[] = [
  {
    id: "oe-1",
    contractId: "sc-aldeota",
    type: "deploy",
    description: "Contrato da Cobertura Aldeota publicado — aguardando assinatura do inquilino.",
    txHash: "0xa1f09c3d84e2b7605d1c8f3a92b4e6d07c5183fa2e9b04d6c71a85f3e02d9b46",
    at: "2026-07-14T11:30:00Z",
  },
  {
    id: "oe-2",
    contractId: "sc-beira-mar",
    type: "pagamento",
    description: "Aluguel de julho do Apto Beira-Mar registrado e validado on-chain.",
    txHash: "0x5b82e4a1c96d30f7a8d2b5c1e04f9637d2a80b45c1f6e9d3072a4b8c5e1f0d36",
    at: "2026-07-05T08:16:00Z",
  },
  {
    id: "oe-3",
    contractId: "sc-iracema",
    type: "caucao",
    description: "Caução de R$ 3.800 do Studio Iracema depositada em escrow.",
    txHash: "0xd90c7b3f51a8e2469cb04d6f8a1e3572b09c4d81f6a2e5b30c7d94f1a68e02c5",
    at: "2026-06-01T10:02:00Z",
  },
  {
    id: "oe-4",
    contractId: "sc-coco",
    type: "assinatura",
    description: "Renovação da Casa Cocó assinada digitalmente pelas duas partes.",
    txHash: "0x27e5a90d4c1b8f36a0d5e78c2b41f9068d3a5c17e0b92f4d61c8a35b7e04f2d9",
    at: "2026-05-20T15:44:00Z",
  },
  {
    id: "oe-5",
    contractId: "sc-coco-parque",
    type: "liberacao",
    description: "Parcela da caução liberada após vistoria aprovada no Apto Cocó Parque.",
    txHash: "0x93b0d6f2a75c1e48b3d90a2c5f81e647a0c2d5b91f38e60d4a7c1b52e98f03a7",
    at: "2026-04-11T13:27:00Z",
  },
];

export function chainStatusLabel(status: ChainContractStatus): string {
  const labels: Record<ChainContractStatus, string> = {
    ativo: "Ativo on-chain",
    escrow: "Caução em escrow",
    aguardando_assinatura: "Aguardando assinatura",
    encerrado: "Encerrado",
  };
  return labels[status];
}

export function onchainEventLabel(type: OnchainEventType): string {
  const labels: Record<OnchainEventType, string> = {
    deploy: "Publicação",
    assinatura: "Assinatura",
    caucao: "Caução",
    pagamento: "Pagamento",
    liberacao: "Liberação",
    encerramento: "Encerramento",
  };
  return labels[type];
}

/** Encurta um hash/endereço para exibição: 0x3F1c…A60. */
export function shortHash(hash: string, chars = 4): string {
  return `${hash.slice(0, chars + 2)}…${hash.slice(-chars)}`;
}
