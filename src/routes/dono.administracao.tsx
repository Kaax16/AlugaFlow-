import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Minus, RotateCcw, ShieldCheck, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  defaultPermissions,
  memberStatusLabel,
  modules,
  permissionLevelLabel,
  roleDescriptions,
  roleLabels,
  roles,
  teamMembers as initialMembers,
  type MemberStatus,
  type ModuleKey,
  type PermissionLevel,
  type Role,
  type TeamMember,
} from "@/data/team";
import { formatDateTime, initialsFromName } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dono/administracao")({
  head: () => ({ meta: [{ title: "Administração · Aluga+" }] }),
  component: Administracao,
});

const statusStyles: Record<MemberStatus, string> = {
  ativo: "bg-success/15 text-success border border-success/25",
  convite_pendente:
    "bg-warning/20 text-warning-foreground border border-warning/40 dark:text-warning",
  suspenso: "bg-destructive/15 text-destructive border border-destructive/25",
};

/** Próximo nível ao clicar na célula da matriz: total → leitura → nenhum → total. */
const nextLevel: Record<PermissionLevel, PermissionLevel> = {
  total: "leitura",
  leitura: "nenhum",
  nenhum: "total",
};

const levelMeta: Record<PermissionLevel, { icon: typeof Eye; className: string }> = {
  total: { icon: ShieldCheck, className: "bg-success/15 text-success" },
  leitura: { icon: Eye, className: "bg-info/15 text-info" },
  nenhum: { icon: Minus, className: "bg-muted text-muted-foreground" },
};

function clonePermissions(): Record<Role, Record<ModuleKey, PermissionLevel>> {
  return {
    administrador: { ...defaultPermissions.administrador },
    gestor: { ...defaultPermissions.gestor },
    financeiro: { ...defaultPermissions.financeiro },
    manutencao: { ...defaultPermissions.manutencao },
    visualizador: { ...defaultPermissions.visualizador },
  };
}

function Administracao() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [permissions, setPermissions] = useState(clonePermissions);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("visualizador");

  const activeCount = members.filter((m) => m.status === "ativo").length;
  const pendingCount = members.filter((m) => m.status === "convite_pendente").length;

  const changedFromDefault = useMemo(
    () =>
      roles.some((r) =>
        modules.some((m) => permissions[r][m.key] !== defaultPermissions[r][m.key]),
      ),
    [permissions],
  );

  const changeRole = (id: string, role: Role) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    const member = members.find((m) => m.id === id);
    if (member) toast.success(`${member.name} agora é ${roleLabels[role]}`);
  };

  const toggleSuspend = (member: TeamMember) => {
    const status: MemberStatus = member.status === "suspenso" ? "ativo" : "suspenso";
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, status } : m)));
    toast.success(
      status === "suspenso" ? `Acesso de ${member.name} suspenso` : `${member.name} reativado`,
    );
  };

  const sendInvite = () => {
    if (!inviteName.trim() || !inviteEmail.includes("@")) {
      toast.error("Preencha nome e um e-mail válido.");
      return;
    }
    const member: TeamMember = {
      id: `m-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "convite_pendente",
      avatarHue: Math.floor(Math.random() * 360),
    };
    setMembers((prev) => [...prev, member]);
    setInviteOpen(false);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("visualizador");
    toast.success("Convite enviado", {
      description: `${member.email} entrará como ${roleLabels[member.role]}.`,
    });
  };

  const cyclePermission = (role: Role, moduleKey: ModuleKey) => {
    if (role === "administrador") {
      toast.info("O papel Administrador sempre tem acesso total.");
      return;
    }
    setPermissions((prev) => ({
      ...prev,
      [role]: { ...prev[role], [moduleKey]: nextLevel[prev[role][moduleKey]] },
    }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Administração"
        description="Gestão da equipe e controle de acesso por papel (RBAC) em todos os módulos."
        actions={
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Convidar membro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Convidar membro da equipe</DialogTitle>
                <DialogDescription>
                  A pessoa recebe um e-mail e já entra com o papel escolhido.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-name">Nome</Label>
                  <Input
                    id="invite-name"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Maria Fontenele"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-email">E-mail</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="maria@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Papel</Label>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as Role)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r} value={r}>
                          {roleLabels[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{roleDescriptions[inviteRole]}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setInviteOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={sendInvite}>Enviar convite</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Membros ativos" value={String(activeCount)} icon={Users} tone="success" />
        <KpiCard label="Papéis definidos" value={String(roles.length)} icon={ShieldCheck} />
        <KpiCard
          label="Convites pendentes"
          value={String(pendingCount)}
          icon={UserPlus}
          tone="warning"
        />
        <KpiCard label="Módulos protegidos" value={String(modules.length)} icon={Eye} tone="info" />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Equipe</CardTitle>
          <p className="text-sm text-muted-foreground">
            Troque o papel direto na tabela — as permissões seguem a matriz abaixo.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membro</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último acesso</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback
                            className="text-xs font-semibold text-primary-foreground"
                            style={{ background: `oklch(0.6 0.2 ${m.avatarHue})` }}
                          >
                            {initialsFromName(m.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{m.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={m.role} onValueChange={(v) => changeRole(m.id, v as Role)}>
                        <SelectTrigger className="h-8 w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((r) => (
                            <SelectItem key={r} value={r}>
                              {roleLabels[r]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          statusStyles[m.status],
                        )}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {memberStatusLabel(m.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {m.lastAccessAt ? formatDateTime(m.lastAccessAt) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {m.role === "administrador" ? (
                        <span className="text-xs text-muted-foreground">Titular da conta</span>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => toggleSuspend(m)}>
                          {m.status === "suspenso" ? "Reativar" : "Suspender"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Matriz de permissões (RBAC)</CardTitle>
            {changedFromDefault ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setPermissions(clonePermissions());
                  toast.success("Matriz restaurada para o padrão.");
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restaurar padrão
              </Button>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            Clique em uma célula para alternar o nível de acesso do papel naquele módulo.
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {(Object.keys(levelMeta) as PermissionLevel[]).map((level) => {
              const Meta = levelMeta[level];
              return (
                <span key={level} className="inline-flex items-center gap-1.5">
                  <span
                    className={cn("grid h-5 w-5 place-items-center rounded-md", Meta.className)}
                  >
                    <Meta.icon className="h-3 w-3" />
                  </span>
                  {permissionLevelLabel(level)}
                </span>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Módulo</TableHead>
                  {roles.map((r) => (
                    <TableHead key={r} className="text-center">
                      <Tooltip>
                        <TooltipTrigger className="cursor-help underline-offset-4 hover:underline">
                          {roleLabels[r]}
                        </TooltipTrigger>
                        <TooltipContent className="max-w-56">{roleDescriptions[r]}</TooltipContent>
                      </Tooltip>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((mod) => (
                  <TableRow key={mod.key}>
                    <TableCell className="font-medium">{mod.label}</TableCell>
                    {roles.map((r) => {
                      const level = permissions[r][mod.key];
                      const Meta = levelMeta[level];
                      return (
                        <TableCell key={r} className="text-center">
                          <button
                            type="button"
                            onClick={() => cyclePermission(r, mod.key)}
                            aria-label={`${roleLabels[r]} em ${mod.label}: ${permissionLevelLabel(level)}. Clique para alterar.`}
                            className={cn(
                              "mx-auto grid h-8 w-8 place-items-center rounded-lg transition-transform hover:scale-110",
                              Meta.className,
                              r === "administrador" && "cursor-not-allowed opacity-80",
                            )}
                          >
                            <Meta.icon className="h-4 w-4" />
                          </button>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
