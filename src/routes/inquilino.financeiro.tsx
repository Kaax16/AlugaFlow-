import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Download,
  DollarSign,
  Receipt,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTenantSession } from "@/data/session";
import { formatBRL, formatDate } from "@/lib/format";

export const Route = createFileRoute("/inquilino/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro · Aluga+" }] }),
  component: InquilinoFinanceiro,
});

function InquilinoFinanceiro() {
  const { property } = getTenantSession();
  const { financial } = property;
  const total = financial.rent + financial.condo + financial.iptu;
  const isLate = financial.status === "atrasado";

  const paymentEvents = property.history
    .filter((h) => h.type === "payment")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const receipts = property.documents.filter((d) => d.type === "comprovante");

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Financeiro"
        description="Boletos, comprovantes e histórico de pagamentos do seu aluguel."
        actions={
          <Button
            className="gap-1.5 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95"
            onClick={() => toast.info("Emissão de boleto em breve.")}
          >
            <Receipt className="h-4 w-4" />
            Gerar boleto do mês
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Aluguel"
          value={formatBRL(financial.rent)}
          icon={DollarSign}
          tone="default"
        />
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

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle>Próxima fatura</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Situação atual do seu pagamento.</p>
          </div>
          <StatusBadge status={financial.status} />
        </CardHeader>
        <CardContent className="space-y-4">
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
                  Envie um comprovante ao proprietário ou combine um novo prazo pelo chat.
                </p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Histórico de pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentEvents.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Sem pagamentos registrados ainda.
              </p>
            ) : (
              <ol className="space-y-4">
                {paymentEvents.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-start justify-between gap-3 border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(event.date)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Comprovantes disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            {receipts.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum comprovante enviado ainda.
              </p>
            ) : (
              <ul className="divide-y">
                {receipts.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(doc.sizeKb / 1024).toFixed(2)} MB · {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Baixar"
                      onClick={() => toast.success(`Download de "${doc.name}" iniciado.`)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
