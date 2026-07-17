import { AlertTriangle, CalendarClock, CheckCircle2, DollarSign, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { KpiCard } from "@/components/kpi-card";
import type { Property } from "@/data/properties";
import { formatBRL, formatDate } from "@/lib/format";

interface Props {
  property: Property;
}

export function PropertyFinancial({ property }: Props) {
  const { financial } = property;
  const total = financial.rent + financial.condo + financial.iptu;
  const isLate = financial.status === "atrasado";

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle>Financeiro</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Resumo mensal e situação de pagamentos.
          </p>
        </div>
        <StatusBadge status={financial.status} />
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Aluguel" value={formatBRL(financial.rent)} icon={DollarSign} tone="default" />
          <KpiCard label="Condomínio" value={formatBRL(financial.condo)} icon={Receipt} tone="info" />
          <KpiCard label="IPTU" value={formatBRL(financial.iptu)} icon={Receipt} tone="warning" />
          <KpiCard
            label="Total mensal"
            value={formatBRL(total)}
            icon={CheckCircle2}
            tone="success"
            hint="Aluguel + encargos"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              Último pagamento
            </p>
            <p className="mt-1 text-lg font-semibold">{formatDate(financial.lastPayment)}</p>
          </div>
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              Próximo vencimento
            </p>
            <p className="mt-1 text-lg font-semibold">{formatDate(financial.nextDueDate)}</p>
          </div>
        </div>

        {isLate ? (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="text-sm">
              <p className="font-semibold text-destructive">Aluguel em atraso</p>
              <p className="text-muted-foreground">
                Vencimento em {formatDate(financial.nextDueDate)}. Envie um lembrete pelo chat do imóvel.
              </p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
