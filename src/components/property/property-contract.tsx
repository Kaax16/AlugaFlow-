import { CalendarDays, FileSignature, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Property } from "@/data/properties";
import { formatBRL, formatDate, daysBetween, initialsFromName } from "@/lib/format";

interface Props {
  property: Property;
}

export function PropertyContract({ property }: Props) {
  const { contract, tenant } = property;

  if (!contract || !tenant) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Contrato</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-3 rounded-b-xl bg-muted/20 py-8 text-sm text-muted-foreground">
          <FileSignature className="h-8 w-8 text-primary/60" />
          <div>
            <p className="font-medium text-foreground">Nenhum contrato ativo</p>
            <p>O imóvel está disponível para locação.</p>
          </div>
          <Button
            size="sm"
            onClick={() => toast.info("Criação de contrato em breve.")}
            className="bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95"
          >
            Criar contrato
          </Button>
        </CardContent>
      </Card>
    );
  }

  const now = new Date().toISOString();
  const daysLeft = daysBetween(now, contract.endDate);
  const totalDays = daysBetween(contract.startDate, contract.endDate);
  const elapsed = totalDays - daysLeft;
  const percent = Math.max(0, Math.min(100, (elapsed / totalDays) * 100));

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle>Contrato ativo</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Detalhes do vínculo com o inquilino.</p>
        </div>
        <Badge variant="secondary" className="border border-success/30 bg-success/15 text-success">
          Ativo
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-3 rounded-xl border bg-muted/20 p-4">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
            <AvatarFallback
              className="text-sm font-semibold text-primary-foreground"
              style={{ background: `oklch(0.6 0.2 ${tenant.avatarHue})` }}
            >
              {initialsFromName(tenant.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{tenant.name}</p>
            <p className="text-xs text-muted-foreground">Inquilino</p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <Button asChild size="icon" variant="outline" aria-label="Ligar">
              <a href={`tel:${tenant.phone.replace(/\D/g, "")}`}>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="icon" variant="outline" aria-label="E-mail">
              <a href={`mailto:${tenant.email}`}>
                <Mail className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBlock
            label="Telefone"
            value={tenant.phone}
            icon={<Phone className="h-3.5 w-3.5" />}
          />
          <InfoBlock label="E-mail" value={tenant.email} icon={<Mail className="h-3.5 w-3.5" />} />
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
