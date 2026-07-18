import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Barcode,
  CreditCard,
  Percent,
  PiggyBank,
  QrCode,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { Switch } from "@/components/ui/switch";
import { AnalyticsChart } from "@/components/analytics-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  monthlyVolumeByMethod,
  paymentChannelLabel,
  paymentMethodLabel,
  paymentPlatforms as initialPlatforms,
  paymentTransactions,
  splitRules,
  transactionStatusLabel,
  type PaymentMethod,
  type PaymentPlatform,
  type TransactionStatus,
} from "@/data/payments";
import { getPropertyById } from "@/data/properties";
import { formatBRL, formatBRLShort, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dono/pagamentos")({
  head: () => ({ meta: [{ title: "Pagamentos · Aluga+" }] }),
  component: Pagamentos,
});

const methodIcons: Record<PaymentMethod, typeof QrCode> = {
  pix: QrCode,
  boleto: Barcode,
  cartao: CreditCard,
  carteira: Smartphone,
};

const txStatusStyles: Record<TransactionStatus, string> = {
  aprovado: "bg-success/15 text-success border border-success/25",
  processando: "bg-info/15 text-info border border-info/25",
  estornado: "bg-warning/20 text-warning-foreground border border-warning/40 dark:text-warning",
  falhou: "bg-destructive/15 text-destructive border border-destructive/25",
};

const splitTones = ["bg-primary", "bg-info", "bg-warning"];

function Pagamentos() {
  const [platforms, setPlatforms] = useState<PaymentPlatform[]>(initialPlatforms);

  // Volume e taxa média do mês corrente (última coluna do gráfico).
  const monthVolume = useMemo(
    () => monthlyVolumeByMethod.series.reduce((sum, s) => sum + (s.data.at(-1) ?? 0), 0),
    [],
  );
  const avgFee = useMemo(() => {
    const connected = platforms.filter((p) => p.connected);
    if (connected.length === 0) return 0;
    const weighted = connected.reduce((sum, p) => sum + p.feePct * p.monthShare, 0);
    const totalShare = connected.reduce((sum, p) => sum + p.monthShare, 0);
    return weighted / totalShare;
  }, [platforms]);

  const togglePlatform = (id: string) => {
    setPlatforms((prev) => prev.map((p) => (p.id === id ? { ...p, connected: !p.connected } : p)));
    const platform = platforms.find((p) => p.id === id);
    if (platform) {
      toast.success(
        platform.connected
          ? `${platform.name} desativado para novas cobranças`
          : `${platform.name} conectado — já disponível no checkout`,
      );
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pagamentos"
        description="Serviço financeiro multiplataforma: Pix, boleto, cartão e carteiras digitais com split automático."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Volume do mês"
          value={formatBRLShort(monthVolume)}
          hint="Todos os métodos"
          icon={ArrowLeftRight}
          tone="success"
          trend={{ value: "+8,2% vs. junho", positive: true }}
        />
        <KpiCard
          label="Taxa média"
          value={`${avgFee.toFixed(2).replace(".", ",")}%`}
          hint="Ponderada pelo volume"
          icon={Percent}
          tone="info"
        />
        <KpiCard
          label="Repasse ao proprietário"
          value="92%"
          hint="Split automático em D+0"
          icon={PiggyBank}
        />
        <KpiCard
          label="Conversão de cobrança"
          value="96,4%"
          hint="Pagas até o vencimento + retentativas"
          icon={CreditCard}
          tone="warning"
        />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Plataformas de recebimento</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ative ou desative um método e o checkout do inquilino se ajusta em todas as plataformas
            — web, app e WhatsApp.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {platforms.map((p) => {
            const Icon = methodIcons[p.method];
            return (
              <div
                key={p.id}
                className={cn(
                  "flex flex-col gap-3 rounded-xl border p-4 transition-colors",
                  p.connected ? "border-primary/30 bg-primary/5" : "border-border opacity-75",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-xl",
                      p.connected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <Switch
                    checked={p.connected}
                    onCheckedChange={() => togglePlatform(p.id)}
                    aria-label={`${p.connected ? "Desativar" : "Ativar"} ${p.name}`}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-medium">{p.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between text-xs">
                  <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
                    {p.settlement}
                  </span>
                  <span className="text-muted-foreground">
                    taxa {p.feePct.toFixed(2).replace(".", ",")}%
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Volume por método</CardTitle>
            <p className="text-sm text-muted-foreground">
              O Pix já responde pela maior parte dos recebimentos.
            </p>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              categories={monthlyVolumeByMethod.months}
              series={monthlyVolumeByMethod.series}
              types={["column", "area"]}
              stacked
              axisFormat={formatBRLShort}
            />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Split automático</CardTitle>
            <p className="text-sm text-muted-foreground">
              Cada recebimento é dividido na liquidação — sem transferência manual.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {splitRules.map((rule, i) => (
              <div key={rule.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{rule.label}</span>
                  <span className="text-muted-foreground">{rule.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", splitTones[i % splitTones.length])}
                    style={{ width: `${rule.pct}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
              Exemplo com o aluguel do Apto Beira-Mar ({formatBRL(5200)}): {formatBRL(5200 * 0.92)}{" "}
              para o proprietário, {formatBRL(5200 * 0.05)} de taxa e {formatBRL(5200 * 0.03)} para
              o fundo de reserva.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Transações recentes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Recebimentos de todos os canais em um só extrato.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pagador</TableHead>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentTransactions.map((tx) => {
                  const Icon = methodIcons[tx.method];
                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.payerName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {getPropertyById(tx.propertyId)?.name ?? tx.propertyId}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {paymentMethodLabel(tx.method)}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {paymentChannelLabel(tx.channel)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {formatBRL(tx.amount)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(tx.at)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                            txStatusStyles[tx.status],
                          )}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {transactionStatusLabel(tx.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
