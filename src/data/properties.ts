export type PropertyStatus = "ocupado" | "disponivel" | "manutencao";
export type PaymentStatus = "em_dia" | "atrasado" | "pendente";

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarHue: number;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarHue: number;
}

export interface Contract {
  id: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyValue: number;
  status: "ativo" | "encerrado" | "pendente";
}

export interface FinancialSnapshot {
  rent: number;
  condo: number;
  iptu: number;
  status: PaymentStatus;
  lastPayment: string;
  nextDueDate: string;
}

export interface HistoryEvent {
  id: string;
  type:
    | "created"
    | "updated"
    | "status"
    | "tenant_in"
    | "tenant_out"
    | "maintenance"
    | "payment"
    | "document";
  title: string;
  description: string;
  date: string;
}

export interface PropertyDocument {
  id: string;
  name: string;
  type: "contrato" | "vistoria" | "iptu" | "comprovante" | "outro";
  sizeKb: number;
  uploadedAt: string;
}

export interface ChatMessage {
  id: string;
  authorId: string;
  authorRole: "owner" | "tenant";
  text: string;
  sentAt: string;
  read: boolean;
}

/** Coordenadas geográficas usadas nos mapas (MapLibre + OpenStreetMap). */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Foto da galeria. `src` é a imagem real; `hue` é o gradiente de fallback. */
export interface GalleryPhoto {
  id: string;
  label: string;
  src: string;
  hue: number;
}

export interface Address {
  street: string;
  /** Número do imóvel na via (ex.: 2450). */
  number: string;
  /** Apto, bloco, casa, cobertura — a "unidade" dentro do endereço. */
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  /** CEP no formato 00000-000. */
  zip: string;
}

/** Unidade de um edifício (um mesmo endereço com vários apartamentos). */
export interface PropertyUnit {
  id: string;
  label: string; // ex.: "Apto 301"
  status: PropertyStatus;
  bedrooms: number;
  rent: number;
  tenantName?: string;
}

export interface Property {
  id: string;
  name: string;
  type: string;
  status: PropertyStatus;
  address: Address;
  coordinates: GeoPoint;
  description: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  createdAt: string;
  updatedAt: string;
  gallery: GalleryPhoto[];
  financial: FinancialSnapshot;
  contract?: Contract;
  history: HistoryEvent[];
  documents: PropertyDocument[];
  chat: ChatMessage[];
  owner: Owner;
  tenant?: Tenant;
  /** Preenchido quando o imóvel é um edifício com várias unidades. */
  units?: PropertyUnit[];
}

// Fotos hospedadas no Unsplash. Caso alguma falhe ao carregar, os componentes
// caem no gradiente definido em `hue` — então a UI nunca fica "quebrada".
const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1280&q=70`;

const owner: Owner = {
  id: "owner-1",
  name: "Ricardo Albuquerque",
  email: "ricardo@alugaflow.app",
  phone: "(85) 99876-1122",
  avatarHue: 295,
};

const tenants: Record<string, Tenant> = {
  marina: {
    id: "t-marina",
    name: "Marina Nogueira",
    email: "marina.nogueira@email.com",
    phone: "(85) 98123-4567",
    avatarHue: 305,
  },
  rafael: {
    id: "t-rafael",
    name: "Rafael Bezerra",
    email: "rafael.bezerra@email.com",
    phone: "(85) 97654-3210",
    avatarHue: 245,
  },
  juliana: {
    id: "t-juliana",
    name: "Juliana Sampaio",
    email: "juliana.sampaio@email.com",
    phone: "(85) 99123-4488",
    avatarHue: 320,
  },
  thiago: {
    id: "t-thiago",
    name: "Thiago Frota",
    email: "thiago.frota@email.com",
    phone: "(85) 98555-7788",
    avatarHue: 200,
  },
};

export const properties: Property[] = [
  {
    id: "apto-beira-mar",
    name: "Apto Beira-Mar",
    type: "Apartamento · 3 quartos",
    status: "ocupado",
    address: {
      street: "Av. Beira Mar",
      number: "2450",
      complement: "Apto 1302",
      neighborhood: "Meireles",
      city: "Fortaleza",
      state: "CE",
      zip: "60165-121",
    },
    coordinates: { lat: -3.7223, lng: -38.4889 },
    description:
      "Apartamento de alto padrão na orla do Meireles, com vista frontal para o mar e brisa o dia inteiro. Prédio com portaria 24h, piscina, academia e lazer completo, a poucos passos do calçadão da Beira-Mar.",
    area: 118,
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    createdAt: "2024-02-11T10:00:00Z",
    updatedAt: "2026-07-05T14:30:00Z",
    gallery: [
      {
        id: "g1",
        label: "Sala com vista mar",
        src: img("photo-1522708323590-d24dbb6b0267"),
        hue: 295,
      },
      { id: "g2", label: "Cozinha gourmet", src: img("photo-1556911220-bff31c812dba"), hue: 310 },
      { id: "g3", label: "Suíte master", src: img("photo-1616594039964-ae9021a400a0"), hue: 280 },
      { id: "g4", label: "Varanda", src: img("photo-1502005229762-cf1b2da7c5d6"), hue: 320 },
      { id: "g5", label: "Fachada", src: img("photo-1545324418-cc1a3fa10c00"), hue: 265 },
    ],
    financial: {
      rent: 5200,
      condo: 1250,
      iptu: 240,
      status: "em_dia",
      lastPayment: "2026-07-05T00:00:00Z",
      nextDueDate: "2026-08-05T00:00:00Z",
    },
    contract: {
      id: "ct-beira-mar",
      tenantId: tenants.marina.id,
      startDate: "2025-03-01T00:00:00Z",
      endDate: "2027-03-01T00:00:00Z",
      monthlyValue: 5200,
      status: "ativo",
    },
    history: [
      {
        id: "h1",
        type: "created",
        title: "Imóvel cadastrado",
        description: "Cadastro inicial na plataforma Aluga+.",
        date: "2024-02-11T10:00:00Z",
      },
      {
        id: "h2",
        type: "tenant_in",
        title: "Nova locação",
        description: "Marina Nogueira assinou contrato de 24 meses.",
        date: "2025-03-01T09:15:00Z",
      },
      {
        id: "h3",
        type: "maintenance",
        title: "Manutenção preventiva",
        description: "Revisão do ar-condicionado e pintura da sala.",
        date: "2025-11-20T14:00:00Z",
      },
      {
        id: "h4",
        type: "payment",
        title: "Aluguel recebido",
        description: "Referente a julho/2026.",
        date: "2026-07-05T09:32:00Z",
      },
      {
        id: "h5",
        type: "updated",
        title: "Informações atualizadas",
        description: "Reajuste anual aplicado ao contrato.",
        date: "2026-07-05T14:30:00Z",
      },
    ],
    documents: [
      {
        id: "d1",
        name: "Contrato de locação 2025.pdf",
        type: "contrato",
        sizeKb: 842,
        uploadedAt: "2025-03-01T09:20:00Z",
      },
      {
        id: "d2",
        name: "Vistoria de entrada.pdf",
        type: "vistoria",
        sizeKb: 1204,
        uploadedAt: "2025-03-01T09:25:00Z",
      },
      {
        id: "d3",
        name: "IPTU 2026.pdf",
        type: "iptu",
        sizeKb: 312,
        uploadedAt: "2026-01-15T10:12:00Z",
      },
      {
        id: "d4",
        name: "Comprovante Julho.pdf",
        type: "comprovante",
        sizeKb: 128,
        uploadedAt: "2026-07-05T09:40:00Z",
      },
    ],
    chat: [
      {
        id: "m1",
        authorId: owner.id,
        authorRole: "owner",
        text: "Oi Marina! Passando para lembrar que a manutenção preventiva do ar-condicionado será na sexta às 14h.",
        sentAt: "2026-07-14T09:12:00Z",
        read: true,
      },
      {
        id: "m2",
        authorId: tenants.marina.id,
        authorRole: "tenant",
        text: "Perfeito, Ricardo! Estarei em casa. Obrigada por avisar 🙌",
        sentAt: "2026-07-14T09:20:00Z",
        read: true,
      },
      {
        id: "m3",
        authorId: owner.id,
        authorRole: "owner",
        text: "Ótimo. Qualquer coisa é só chamar por aqui.",
        sentAt: "2026-07-14T09:22:00Z",
        read: true,
      },
      {
        id: "m4",
        authorId: tenants.marina.id,
        authorRole: "tenant",
        text: "Aproveitando: recebi a nota do condomínio de julho, te envio por e-mail hoje ainda.",
        sentAt: "2026-07-16T18:04:00Z",
        read: false,
      },
    ],
    owner,
    tenant: tenants.marina,
  },
  {
    id: "casa-coco",
    name: "Casa Cocó",
    type: "Casa · 3 quartos",
    status: "ocupado",
    address: {
      street: "Rua Tibúrcio Cavalcante",
      number: "1820",
      complement: "Casa",
      neighborhood: "Cocó",
      city: "Fortaleza",
      state: "CE",
      zip: "60125-101",
    },
    coordinates: { lat: -3.7466, lng: -38.4869 },
    description:
      "Casa térrea espaçosa em rua arborizada e tranquila, ao lado do Parque do Cocó. Ideal para famílias: quintal amplo, churrasqueira e garagem coberta para dois carros.",
    area: 165,
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    createdAt: "2023-09-08T10:00:00Z",
    updatedAt: "2026-07-10T18:10:00Z",
    gallery: [
      { id: "g1", label: "Fachada", src: img("photo-1568605114967-8130f3a36994"), hue: 260 },
      { id: "g2", label: "Sala de estar", src: img("photo-1600210492493-0946911123ea"), hue: 295 },
      { id: "g3", label: "Cozinha", src: img("photo-1556909212-d5b604d0c90d"), hue: 315 },
      { id: "g4", label: "Quintal", src: img("photo-1600607687920-4e2a09cf159d"), hue: 155 },
    ],
    financial: {
      rent: 4300,
      condo: 0,
      iptu: 310,
      status: "em_dia",
      lastPayment: "2026-07-10T00:00:00Z",
      nextDueDate: "2026-08-10T00:00:00Z",
    },
    contract: {
      id: "ct-coco",
      tenantId: tenants.rafael.id,
      startDate: "2024-08-01T00:00:00Z",
      endDate: "2026-08-01T00:00:00Z",
      monthlyValue: 4300,
      status: "ativo",
    },
    history: [
      {
        id: "h1",
        type: "created",
        title: "Imóvel cadastrado",
        description: "Cadastro inicial na plataforma.",
        date: "2023-09-08T10:00:00Z",
      },
      {
        id: "h2",
        type: "tenant_in",
        title: "Nova locação",
        description: "Rafael Bezerra iniciou contrato.",
        date: "2024-08-01T00:00:00Z",
      },
      {
        id: "h3",
        type: "payment",
        title: "Aluguel recebido",
        description: "Referente a julho/2026.",
        date: "2026-07-10T00:00:00Z",
      },
    ],
    documents: [
      {
        id: "d1",
        name: "Contrato Casa Cocó.pdf",
        type: "contrato",
        sizeKb: 780,
        uploadedAt: "2024-08-01T10:00:00Z",
      },
      {
        id: "d2",
        name: "IPTU 2026.pdf",
        type: "iptu",
        sizeKb: 298,
        uploadedAt: "2026-01-20T09:00:00Z",
      },
    ],
    chat: [
      {
        id: "m1",
        authorId: tenants.rafael.id,
        authorRole: "tenant",
        text: "Bom dia! O portão eletrônico está com um ruído estranho. Consegue abrir um chamado?",
        sentAt: "2026-07-12T08:20:00Z",
        read: true,
      },
      {
        id: "m2",
        authorId: owner.id,
        authorRole: "owner",
        text: "Bom dia Rafael! Já acionei o técnico, ele passa amanhã de manhã.",
        sentAt: "2026-07-12T08:32:00Z",
        read: true,
      },
    ],
    owner,
    tenant: tenants.rafael,
  },
  {
    id: "studio-iracema",
    name: "Studio Praia de Iracema",
    type: "Studio",
    status: "ocupado",
    address: {
      street: "Rua dos Tabajaras",
      number: "220",
      complement: "Apto 08",
      neighborhood: "Praia de Iracema",
      city: "Fortaleza",
      state: "CE",
      zip: "60060-510",
    },
    coordinates: { lat: -3.7186, lng: -38.5121 },
    description:
      "Studio compacto e moderno em prédio novo na boêmia Praia de Iracema, a um quarteirão do mar e do Centro Cultural Dragão do Mar. Ideal para jovens profissionais.",
    area: 34,
    bedrooms: 1,
    bathrooms: 1,
    parking: 0,
    createdAt: "2024-06-15T10:00:00Z",
    updatedAt: "2026-06-30T12:00:00Z",
    gallery: [
      {
        id: "g1",
        label: "Ambiente integrado",
        src: img("photo-1554995207-c18c203602cb"),
        hue: 305,
      },
      {
        id: "g2",
        label: "Cozinha compacta",
        src: img("photo-1484154218962-a197022b5858"),
        hue: 285,
      },
      { id: "g3", label: "Banheiro", src: img("photo-1620626011761-996317b8d101"), hue: 320 },
    ],
    financial: {
      rent: 1900,
      condo: 480,
      iptu: 85,
      status: "atrasado",
      lastPayment: "2026-06-05T00:00:00Z",
      nextDueDate: "2026-07-05T00:00:00Z",
    },
    contract: {
      id: "ct-iracema",
      tenantId: tenants.juliana.id,
      startDate: "2025-01-10T00:00:00Z",
      endDate: "2027-01-10T00:00:00Z",
      monthlyValue: 1900,
      status: "ativo",
    },
    history: [
      {
        id: "h1",
        type: "created",
        title: "Imóvel cadastrado",
        description: "Cadastro inicial.",
        date: "2024-06-15T10:00:00Z",
      },
      {
        id: "h2",
        type: "tenant_in",
        title: "Nova locação",
        description: "Juliana Sampaio iniciou o contrato.",
        date: "2025-01-10T00:00:00Z",
      },
      {
        id: "h3",
        type: "payment",
        title: "Pagamento em atraso",
        description: "Aluguel de julho/2026 pendente.",
        date: "2026-07-06T00:00:00Z",
      },
    ],
    documents: [
      {
        id: "d1",
        name: "Contrato Studio.pdf",
        type: "contrato",
        sizeKb: 640,
        uploadedAt: "2025-01-10T10:00:00Z",
      },
    ],
    chat: [
      {
        id: "m1",
        authorId: owner.id,
        authorRole: "owner",
        text: "Oi Juliana, o aluguel de julho está pendente. Está tudo bem por aí?",
        sentAt: "2026-07-08T10:00:00Z",
        read: true,
      },
      {
        id: "m2",
        authorId: tenants.juliana.id,
        authorRole: "tenant",
        text: "Oi Ricardo! Peço desculpas, tive um imprevisto. Regularizo até sexta, pode ser?",
        sentAt: "2026-07-08T10:12:00Z",
        read: true,
      },
    ],
    owner,
    tenant: tenants.juliana,
  },
  {
    id: "cobertura-aldeota",
    name: "Cobertura Aldeota",
    type: "Cobertura · 3 suítes",
    status: "disponivel",
    address: {
      street: "Av. Dom Luís",
      number: "1200",
      complement: "Cobertura 2001",
      neighborhood: "Aldeota",
      city: "Fortaleza",
      state: "CE",
      zip: "60160-230",
    },
    coordinates: { lat: -3.7345, lng: -38.4931 },
    description:
      "Cobertura duplex na Av. Dom Luís, coração da Aldeota, com terraço panorâmico, piscina privativa e vista para a cidade e o mar. Acabamentos de altíssimo padrão, ao lado de shoppings e restaurantes.",
    area: 245,
    bedrooms: 3,
    bathrooms: 4,
    parking: 3,
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2026-07-01T09:00:00Z",
    gallery: [
      {
        id: "g1",
        label: "Terraço com piscina",
        src: img("photo-1512917774080-9991f1c4c750"),
        hue: 300,
      },
      {
        id: "g2",
        label: "Living integrado",
        src: img("photo-1600566753086-00f18fb6b3ea"),
        hue: 245,
      },
      { id: "g3", label: "Sala de jantar", src: img("photo-1600607687939-ce8a6c25118c"), hue: 295 },
      { id: "g4", label: "Suíte master", src: img("photo-1616486338812-3dadae4b4ace"), hue: 320 },
    ],
    financial: {
      rent: 9800,
      condo: 2100,
      iptu: 680,
      status: "pendente",
      lastPayment: "2026-05-01T00:00:00Z",
      nextDueDate: "2026-08-01T00:00:00Z",
    },
    history: [
      {
        id: "h1",
        type: "created",
        title: "Imóvel cadastrado",
        description: "Cadastro inicial.",
        date: "2025-09-01T10:00:00Z",
      },
      {
        id: "h2",
        type: "tenant_out",
        title: "Encerramento de contrato",
        description: "Inquilino anterior devolveu o imóvel.",
        date: "2026-05-15T00:00:00Z",
      },
      {
        id: "h3",
        type: "status",
        title: "Disponível para locação",
        description: "Imóvel liberado no marketplace.",
        date: "2026-06-01T00:00:00Z",
      },
    ],
    documents: [
      {
        id: "d1",
        name: "IPTU 2026.pdf",
        type: "iptu",
        sizeKb: 410,
        uploadedAt: "2026-01-25T10:00:00Z",
      },
    ],
    chat: [],
    owner,
  },
  {
    id: "apto-coco-parque",
    name: "Apto Cocó Parque",
    type: "Apartamento · 2 quartos",
    status: "ocupado",
    address: {
      street: "Rua Vicente Leite",
      number: "2000",
      complement: "Apto 704",
      neighborhood: "Aldeota",
      city: "Fortaleza",
      state: "CE",
      zip: "60150-230",
    },
    coordinates: { lat: -3.7404, lng: -38.4977 },
    description:
      "Apartamento aconchegante próximo ao Parque do Cocó e ao Shopping Del Paseo, com dois quartos, varanda e lazer completo no condomínio. Excelente para quem quer mobilidade na Aldeota.",
    area: 68,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    createdAt: "2024-11-02T10:00:00Z",
    updatedAt: "2026-07-08T11:00:00Z",
    gallery: [
      { id: "g1", label: "Sala de estar", src: img("photo-1493809842364-78817add7ffb"), hue: 290 },
      {
        id: "g2",
        label: "Cozinha americana",
        src: img("photo-1600489000022-c2086d79f9d4"),
        hue: 310,
      },
      { id: "g3", label: "Quarto", src: img("photo-1522771739844-6a9f6d5f14af"), hue: 250 },
    ],
    financial: {
      rent: 2650,
      condo: 720,
      iptu: 140,
      status: "em_dia",
      lastPayment: "2026-07-08T00:00:00Z",
      nextDueDate: "2026-08-08T00:00:00Z",
    },
    contract: {
      id: "ct-coco-parque",
      tenantId: tenants.thiago.id,
      startDate: "2025-02-01T00:00:00Z",
      endDate: "2027-02-01T00:00:00Z",
      monthlyValue: 2650,
      status: "ativo",
    },
    history: [
      {
        id: "h1",
        type: "created",
        title: "Imóvel cadastrado",
        description: "Cadastro inicial.",
        date: "2024-11-02T10:00:00Z",
      },
      {
        id: "h2",
        type: "tenant_in",
        title: "Nova locação",
        description: "Thiago Frota iniciou o contrato.",
        date: "2025-02-01T00:00:00Z",
      },
      {
        id: "h3",
        type: "payment",
        title: "Aluguel recebido",
        description: "Referente a julho/2026.",
        date: "2026-07-08T00:00:00Z",
      },
    ],
    documents: [
      {
        id: "d1",
        name: "Contrato Cocó Parque.pdf",
        type: "contrato",
        sizeKb: 705,
        uploadedAt: "2025-02-01T10:00:00Z",
      },
      {
        id: "d2",
        name: "Vistoria de entrada.pdf",
        type: "vistoria",
        sizeKb: 980,
        uploadedAt: "2025-02-01T10:15:00Z",
      },
    ],
    chat: [
      {
        id: "m1",
        authorId: tenants.thiago.id,
        authorRole: "tenant",
        text: "Boa tarde! Poderia me enviar o boleto do condomínio deste mês?",
        sentAt: "2026-07-09T14:00:00Z",
        read: true,
      },
      {
        id: "m2",
        authorId: owner.id,
        authorRole: "owner",
        text: "Claro, Thiago! Já te encaminho pelo e-mail.",
        sentAt: "2026-07-09T14:10:00Z",
        read: true,
      },
    ],
    owner,
    tenant: tenants.thiago,
  },
  {
    id: "flat-mucuripe",
    name: "Flat Mucuripe",
    type: "Flat · 1 quarto",
    status: "manutencao",
    address: {
      street: "Av. Vicente de Castro",
      number: "980",
      complement: "Apto 512",
      neighborhood: "Mucuripe",
      city: "Fortaleza",
      state: "CE",
      zip: "60180-410",
    },
    coordinates: { lat: -3.7198, lng: -38.4747 },
    description:
      "Flat mobiliado no Mucuripe, próximo ao mercado dos peixes e à orla, com serviço de recepção e piscina. No momento em reforma da cozinha e troca do piso.",
    area: 42,
    bedrooms: 1,
    bathrooms: 1,
    parking: 1,
    createdAt: "2024-04-18T10:00:00Z",
    updatedAt: "2026-07-12T16:00:00Z",
    gallery: [
      { id: "g1", label: "Sala/quarto", src: img("photo-1502672260266-1c1ef2d93688"), hue: 300 },
      { id: "g2", label: "Cozinha em reforma", src: img("photo-1556912173-3bb406ef7e77"), hue: 40 },
    ],
    financial: {
      rent: 2200,
      condo: 650,
      iptu: 110,
      status: "pendente",
      lastPayment: "2026-06-01T00:00:00Z",
      nextDueDate: "2026-08-01T00:00:00Z",
    },
    history: [
      {
        id: "h1",
        type: "created",
        title: "Imóvel cadastrado",
        description: "Cadastro inicial.",
        date: "2024-04-18T10:00:00Z",
      },
      {
        id: "h2",
        type: "tenant_out",
        title: "Encerramento de contrato",
        description: "Inquilino anterior devolveu o imóvel.",
        date: "2026-06-20T00:00:00Z",
      },
      {
        id: "h3",
        type: "maintenance",
        title: "Reforma iniciada",
        description: "Troca de piso e reforma da cozinha.",
        date: "2026-07-01T00:00:00Z",
      },
    ],
    documents: [
      {
        id: "d1",
        name: "Orçamento reforma.pdf",
        type: "outro",
        sizeKb: 220,
        uploadedAt: "2026-06-28T10:00:00Z",
      },
    ],
    chat: [],
    owner,
  },
  {
    id: "edificio-atlantico",
    name: "Edifício Atlântico",
    type: "Edifício · 5 unidades",
    status: "ocupado",
    address: {
      street: "Av. da Abolição",
      number: "3000",
      complement: "Edifício (5 apartamentos)",
      neighborhood: "Meireles",
      city: "Fortaleza",
      state: "CE",
      zip: "60165-082",
    },
    coordinates: { lat: -3.7248, lng: -38.4985 },
    description:
      "Prédio residencial na orla do Meireles administrado por completo: cinco apartamentos em um mesmo endereço, com portaria 24h e lazer. Cada unidade tem seu próprio contrato e inquilino.",
    area: 640,
    bedrooms: 13,
    bathrooms: 10,
    parking: 5,
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2026-07-14T10:00:00Z",
    gallery: [
      { id: "g1", label: "Fachada", src: img("photo-1545324418-cc1a3fa10c00"), hue: 265 },
      { id: "g2", label: "Hall de entrada", src: img("photo-1560448204-e02f11c3d0e2"), hue: 295 },
      { id: "g3", label: "Área de lazer", src: img("photo-1512917774080-9991f1c4c750"), hue: 300 },
    ],
    financial: {
      rent: 15100,
      condo: 3200,
      iptu: 720,
      status: "pendente",
      lastPayment: "2026-07-05T00:00:00Z",
      nextDueDate: "2026-08-05T00:00:00Z",
    },
    history: [
      {
        id: "h1",
        type: "created",
        title: "Edifício cadastrado",
        description: "Cinco unidades cadastradas na plataforma.",
        date: "2024-03-20T10:00:00Z",
      },
      {
        id: "h2",
        type: "maintenance",
        title: "Manutenção na unidade 501",
        description: "Revisão hidráulica do apartamento 501.",
        date: "2026-07-10T00:00:00Z",
      },
    ],
    documents: [
      {
        id: "d1",
        name: "Convenção do condomínio.pdf",
        type: "outro",
        sizeKb: 540,
        uploadedAt: "2024-03-20T10:30:00Z",
      },
    ],
    chat: [],
    owner,
    units: [
      {
        id: "u-301",
        label: "Apto 301",
        status: "ocupado",
        bedrooms: 2,
        rent: 3200,
        tenantName: "Ana Rocha",
      },
      {
        id: "u-302",
        label: "Apto 302",
        status: "ocupado",
        bedrooms: 2,
        rent: 3200,
        tenantName: "Bruno Lima",
      },
      { id: "u-401", label: "Apto 401", status: "disponivel", bedrooms: 3, rent: 4200 },
      {
        id: "u-402",
        label: "Apto 402",
        status: "ocupado",
        bedrooms: 3,
        rent: 4200,
        tenantName: "Célia Matos",
      },
      { id: "u-501", label: "Apto 501", status: "manutencao", bedrooms: 3, rent: 4500 },
    ],
  },
];

/**
 * Receita líquida consolidada do portfólio nos últimos meses.
 * Usado no gráfico de evolução (Highcharts) da visão geral.
 */
export const monthlyRevenue: { month: string; receitas: number; custos: number }[] = [
  { month: "Fev", receitas: 16800, custos: 5100 },
  { month: "Mar", receitas: 17250, custos: 5200 },
  { month: "Abr", receitas: 17250, custos: 5320 },
  { month: "Mai", receitas: 18100, custos: 5480 },
  { month: "Jun", receitas: 18450, custos: 5510 },
  { month: "Jul", receitas: 19000, custos: 5630 },
];

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

// --- Store mockado com listeners --------------------------------------------
// A demo não tem back-end, então mantemos as mutações em memória e emitimos
// eventos para os componentes reagirem (via `usePropertiesList`).
const listeners = new Set<() => void>();
let version = 0;

function emit() {
  version += 1;
  listeners.forEach((cb) => cb());
}

export function subscribeProperties(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getPropertiesVersion(): number {
  return version;
}

export function addProperty(property: Property): void {
  properties.unshift(property);
  emit();
}

export function removeProperty(id: string): boolean {
  const idx = properties.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  properties.splice(idx, 1);
  emit();
  return true;
}

export function statusLabel(status: PropertyStatus): string {
  switch (status) {
    case "ocupado":
      return "Ocupado";
    case "disponivel":
      return "Disponível";
    case "manutencao":
      return "Em manutenção";
  }
}

export function paymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case "em_dia":
      return "Em dia";
    case "atrasado":
      return "Atrasado";
    case "pendente":
      return "Pendente";
  }
}
