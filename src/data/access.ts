export type TagStatus = "ativa" | "suspensa" | "revogada";
export type AccessResult = "liberado" | "negado";
export type AccessMethod = "nfc" | "remoto";
export type HolderRole = "inquilino" | "prestador" | "proprietario";

/** Tag NFC vinculada a uma pessoa e a um imóvel (fechadura conectada). */
export interface NfcTag {
  id: string;
  /** UID físico da tag, como lido pelo leitor NFC. */
  uid: string;
  holderName: string;
  holderRole: HolderRole;
  propertyId: string;
  status: TagStatus;
  issuedAt: string;
  /** Tags de prestadores expiram; de inquilinos acompanham o contrato. */
  expiresAt?: string;
}

/** Evento de acionamento de fechadura — por tag NFC ou liberação remota. */
export interface AccessEvent {
  id: string;
  tagUid?: string;
  holderName: string;
  propertyId: string;
  door: string;
  method: AccessMethod;
  result: AccessResult;
  reason?: string;
  at: string;
}

export const nfcTags: NfcTag[] = [
  {
    id: "tag-marina",
    uid: "04:A3:2F:1B:6C:80:99",
    holderName: "Marina Nogueira",
    holderRole: "inquilino",
    propertyId: "apto-beira-mar",
    status: "ativa",
    issuedAt: "2025-02-01",
    expiresAt: "2027-01-31",
  },
  {
    id: "tag-rafael",
    uid: "04:7D:E1:0A:22:5B:C4",
    holderName: "Rafael Bezerra",
    holderRole: "inquilino",
    propertyId: "casa-coco",
    status: "ativa",
    issuedAt: "2024-11-15",
    expiresAt: "2026-11-14",
  },
  {
    id: "tag-juliana",
    uid: "04:C9:88:3E:71:0F:12",
    holderName: "Juliana Sampaio",
    holderRole: "inquilino",
    propertyId: "studio-iracema",
    status: "ativa",
    issuedAt: "2025-06-01",
    expiresAt: "2026-05-31",
  },
  {
    id: "tag-thiago",
    uid: "04:15:BD:9C:44:A7:E0",
    holderName: "Thiago Frota",
    holderRole: "inquilino",
    propertyId: "apto-coco-parque",
    status: "ativa",
    issuedAt: "2025-03-10",
    expiresAt: "2027-03-09",
  },
  {
    id: "tag-ricardo",
    uid: "04:F0:52:6D:18:33:AB",
    holderName: "Ricardo Albuquerque",
    holderRole: "proprietario",
    propertyId: "edificio-atlantico",
    status: "ativa",
    issuedAt: "2024-08-01",
  },
  {
    id: "tag-eletricista",
    uid: "04:66:04:D2:8F:5A:21",
    holderName: "José Arimateia (eletricista)",
    holderRole: "prestador",
    propertyId: "flat-mucuripe",
    status: "ativa",
    issuedAt: "2026-07-10",
    expiresAt: "2026-07-25",
  },
  {
    id: "tag-diarista",
    uid: "04:2B:C7:90:E3:16:7D",
    holderName: "Francisca Lima (diarista)",
    holderRole: "prestador",
    propertyId: "cobertura-aldeota",
    status: "suspensa",
    issuedAt: "2026-01-05",
    expiresAt: "2026-12-31",
  },
  {
    id: "tag-ex-inquilino",
    uid: "04:9E:11:F4:0B:C8:36",
    holderName: "Carlos Dummar",
    holderRole: "inquilino",
    propertyId: "cobertura-aldeota",
    status: "revogada",
    issuedAt: "2024-04-01",
    expiresAt: "2026-03-31",
  },
];

export const accessEvents: AccessEvent[] = [
  {
    id: "ev-1",
    tagUid: "04:A3:2F:1B:6C:80:99",
    holderName: "Marina Nogueira",
    propertyId: "apto-beira-mar",
    door: "Porta principal",
    method: "nfc",
    result: "liberado",
    at: "2026-07-17T18:42:00Z",
  },
  {
    id: "ev-2",
    tagUid: "04:66:04:D2:8F:5A:21",
    holderName: "José Arimateia (eletricista)",
    propertyId: "flat-mucuripe",
    door: "Entrada de serviço",
    method: "nfc",
    result: "liberado",
    at: "2026-07-17T14:05:00Z",
  },
  {
    id: "ev-3",
    tagUid: "04:9E:11:F4:0B:C8:36",
    holderName: "Carlos Dummar",
    propertyId: "cobertura-aldeota",
    door: "Porta principal",
    method: "nfc",
    result: "negado",
    reason: "Tag revogada em 31/03/2026",
    at: "2026-07-17T11:20:00Z",
  },
  {
    id: "ev-4",
    holderName: "Ricardo Albuquerque",
    propertyId: "studio-iracema",
    door: "Porta principal",
    method: "remoto",
    result: "liberado",
    reason: "Liberação remota para visita de corretor",
    at: "2026-07-17T09:30:00Z",
  },
  {
    id: "ev-5",
    tagUid: "04:7D:E1:0A:22:5B:C4",
    holderName: "Rafael Bezerra",
    propertyId: "casa-coco",
    door: "Portão da garagem",
    method: "nfc",
    result: "liberado",
    at: "2026-07-16T22:12:00Z",
  },
  {
    id: "ev-6",
    tagUid: "04:2B:C7:90:E3:16:7D",
    holderName: "Francisca Lima (diarista)",
    propertyId: "cobertura-aldeota",
    door: "Porta principal",
    method: "nfc",
    result: "negado",
    reason: "Tag suspensa pelo proprietário",
    at: "2026-07-16T08:55:00Z",
  },
  {
    id: "ev-7",
    tagUid: "04:15:BD:9C:44:A7:E0",
    holderName: "Thiago Frota",
    propertyId: "apto-coco-parque",
    door: "Porta principal",
    method: "nfc",
    result: "liberado",
    at: "2026-07-16T07:40:00Z",
  },
  {
    id: "ev-8",
    tagUid: "04:C9:88:3E:71:0F:12",
    holderName: "Juliana Sampaio",
    propertyId: "studio-iracema",
    door: "Porta principal",
    method: "nfc",
    result: "liberado",
    at: "2026-07-15T19:58:00Z",
  },
];

export function tagStatusLabel(status: TagStatus): string {
  const labels: Record<TagStatus, string> = {
    ativa: "Ativa",
    suspensa: "Suspensa",
    revogada: "Revogada",
  };
  return labels[status];
}

export function holderRoleLabel(role: HolderRole): string {
  const labels: Record<HolderRole, string> = {
    inquilino: "Inquilino",
    prestador: "Prestador",
    proprietario: "Proprietário",
  };
  return labels[role];
}

export function accessMethodLabel(method: AccessMethod): string {
  return method === "nfc" ? "Tag NFC" : "Liberação remota";
}
