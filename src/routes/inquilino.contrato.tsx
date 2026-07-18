import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { CalendarDays, Download, FileSignature, Mail, Phone } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTenantSession } from "@/data/session";
import { daysBetween, formatBRL, formatDate, initialsFromName } from "@/lib/format";

export const Route = createFileRoute("/inquilino/contrato")({
  head: () => ({ meta: [{ title: "Meu contrato · Aluga+" }] }),
  component: InquilinoContrato,
});

function InquilinoContrato() {
  const { property } = getTenantSession();
  const { contract, owner } = property;

  if (!contract) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Meu contrato" description="Detalhes da sua locação atual." />
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center text-sm text-muted-foreground">
            <FileSignature className="h-10 w-10 text-primary/60" />
            <div>
              <p className="font-medium text-foreground">Nenhum contrato vinculado</p>
              <p>Assim que o proprietário formalizar, ele aparece aqui.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const now = new Date().toISOString();
  const daysLeft = daysBetween(now, contract.endDate);
  const totalDays = daysBetween(contract.startDate, contract.endDate);
  const elapsed = Math.max(0, totalDays - daysLeft);
  const percent = Math.max(0, Math.min(100, (elapsed / totalDays) * 100));

  const contratoDoc = property.documents.find((d) => d.type === "contrato");

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Meu contrato"
        description={`Detalhes da locação de ${property.name}.`}
        actions={
          contratoDoc ? (
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => toast.success(`Download de "${contratoDoc.name}" iniciado.`)}
            >
              <Download className="h-4 w-4" />
              Baixar contrato
            </Button>
          ) : undefined
        }
      />

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle>Contrato ativo</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Vínculo formal com o proprietário do imóvel.
            </p>
          </div>
          <Badge
            variant="secondary"
            className="border border-success/30 bg-success/15 text-success"
          >
            Ativo
          </Badge>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-3 rounded-xl border bg-muted/20 p-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarFallback
                className="text-sm font-semibold text-primary-foreground"
                style={{ background: `oklch(0.6 0.2 ${owner.avatarHue})` }}
              >
                {initialsFromName(owner.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{owner.name}</p>
              <p className="text-xs text-muted-foreground">Proprietário</p>
            </div>
            <div className="hidden gap-2 sm:flex">
              <Button asChild size="icon" variant="outline" aria-label="Ligar">
                <a href={`tel:${owner.phone.replace(/\D/g, "")}`}>
                  <Phone className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="icon" variant="outline" aria-label="E-mail">
                <a href={`mailto:${owner.email}`}>
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoBlock
              label="Início"
              value={formatDate(contract.startDate)}
              icon={<CalendarDays className="h-3.5 w-3.5" />}
            />
            <InfoBlock
              label="Término"
              value={formatDate(contract.endDate)}
              icon={<CalendarDays className="h-3.5 w-3.5" />}
            />
            <InfoBlock label="Valor mensal" value={formatBRL(contract.monthlyValue)} />
            <InfoBlock label="Tempo restante" value={`${daysLeft} dias`} />
            <InfoBlock
              label="Telefone"
              value={owner.phone}
              icon={<Phone className="h-3.5 w-3.5" />}
            />
            <InfoBlock label="E-mail" value={owner.email} icon={<Mail className="h-3.5 w-3.5" />} />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progresso do contrato</span>
              <span>{Math.round(percent)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-primary"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-info/40 bg-info/5 shadow-card">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5 text-sm">
          <div>
            <p className="font-medium">Quer prorrogar ou revisar o contrato?</p>
            <p className="text-muted-foreground">
              Envie uma solicitação ao proprietário pelo chat do imóvel.
            </p>
          </div>
          <Button
            onClick={() => toast.info("Solicitação registrada. O proprietário será avisado.")}
            className="bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95"
          >
            Solicitar revisão
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-muted/20 p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  );
}
