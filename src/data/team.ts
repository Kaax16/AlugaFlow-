export type Role = "administrador" | "gestor" | "financeiro" | "manutencao" | "visualizador";
export type PermissionLevel = "total" | "leitura" | "nenhum";
export type MemberStatus = "ativo" | "convite_pendente" | "suspenso";

/** Módulos da plataforma protegidos pelo RBAC. */
export type ModuleKey =
  | "imoveis"
  | "financeiro"
  | "contratos"
  | "documentos"
  | "manutencao"
  | "acessos"
  | "administracao";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  lastAccessAt?: string;
  avatarHue: number;
}

export const roles: Role[] = [
  "administrador",
  "gestor",
  "financeiro",
  "manutencao",
  "visualizador",
];

export const roleLabels: Record<Role, string> = {
  administrador: "Administrador",
  gestor: "Gestor",
  financeiro: "Financeiro",
  manutencao: "Manutenção",
  visualizador: "Visualizador",
};

export const roleDescriptions: Record<Role, string> = {
  administrador: "Acesso total, incluindo gestão de equipe e permissões.",
  gestor: "Opera o dia a dia dos imóveis, contratos e acessos.",
  financeiro: "Gerencia cobranças, repasses e conciliação.",
  manutencao: "Atende chamados e registra visitas técnicas.",
  visualizador: "Apenas leitura — ideal para contadores e auditores.",
};

export const modules: { key: ModuleKey; label: string }[] = [
  { key: "imoveis", label: "Imóveis" },
  { key: "financeiro", label: "Financeiro" },
  { key: "contratos", label: "Contratos" },
  { key: "documentos", label: "Documentos" },
  { key: "manutencao", label: "Manutenção" },
  { key: "acessos", label: "Acessos NFC" },
  { key: "administracao", label: "Administração" },
];

/** Matriz padrão papel × módulo — ponto de partida editável na tela de RBAC. */
export const defaultPermissions: Record<Role, Record<ModuleKey, PermissionLevel>> = {
  administrador: {
    imoveis: "total",
    financeiro: "total",
    contratos: "total",
    documentos: "total",
    manutencao: "total",
    acessos: "total",
    administracao: "total",
  },
  gestor: {
    imoveis: "total",
    financeiro: "leitura",
    contratos: "total",
    documentos: "total",
    manutencao: "total",
    acessos: "total",
    administracao: "nenhum",
  },
  financeiro: {
    imoveis: "leitura",
    financeiro: "total",
    contratos: "leitura",
    documentos: "leitura",
    manutencao: "nenhum",
    acessos: "nenhum",
    administracao: "nenhum",
  },
  manutencao: {
    imoveis: "leitura",
    financeiro: "nenhum",
    contratos: "nenhum",
    documentos: "leitura",
    manutencao: "total",
    acessos: "leitura",
    administracao: "nenhum",
  },
  visualizador: {
    imoveis: "leitura",
    financeiro: "leitura",
    contratos: "leitura",
    documentos: "leitura",
    manutencao: "leitura",
    acessos: "nenhum",
    administracao: "nenhum",
  },
};

export const teamMembers: TeamMember[] = [
  {
    id: "m-ricardo",
    name: "Ricardo Albuquerque",
    email: "ricardo.albuquerque@email.com",
    role: "administrador",
    status: "ativo",
    lastAccessAt: "2026-07-17T19:10:00Z",
    avatarHue: 265,
  },
  {
    id: "m-camila",
    name: "Camila Studart",
    email: "camila.studart@email.com",
    role: "gestor",
    status: "ativo",
    lastAccessAt: "2026-07-17T15:32:00Z",
    avatarHue: 310,
  },
  {
    id: "m-pedro",
    name: "Pedro Holanda",
    email: "pedro.holanda@email.com",
    role: "financeiro",
    status: "ativo",
    lastAccessAt: "2026-07-16T11:47:00Z",
    avatarHue: 200,
  },
  {
    id: "m-luana",
    name: "Luana Castelo",
    email: "luana.castelo@email.com",
    role: "manutencao",
    status: "ativo",
    lastAccessAt: "2026-07-15T09:05:00Z",
    avatarHue: 150,
  },
  {
    id: "m-contab",
    name: "Vasconcelos Contabilidade",
    email: "fiscal@vasconceloscontab.com.br",
    role: "visualizador",
    status: "convite_pendente",
    avatarHue: 40,
  },
];

export function memberStatusLabel(status: MemberStatus): string {
  const labels: Record<MemberStatus, string> = {
    ativo: "Ativo",
    convite_pendente: "Convite pendente",
    suspenso: "Suspenso",
  };
  return labels[status];
}

export function permissionLevelLabel(level: PermissionLevel): string {
  const labels: Record<PermissionLevel, string> = {
    total: "Total",
    leitura: "Leitura",
    nenhum: "Sem acesso",
  };
  return labels[level];
}
