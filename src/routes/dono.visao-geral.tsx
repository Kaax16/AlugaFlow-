import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, DollarSign, Home, TrendingUp, Wallet } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { KpiCard } from "@/components/kpi-card";
import { AnalyticsChart } from "@/components/analytics-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { properties, monthlyRevenue, statusLabel } from "@/data/properties";
import { formatBRL, formatBRLShort } from "@/lib/format";

export const Route = createFileRoute("/dono/visao-geral")({
  head: () => ({
    meta: [
      { title: "Visão geral · Aluga+" },
      { name: "description", content: "Resumo financeiro e operacional dos seus imóveis." },
    ],
  }),
  component: VisaoGeral,
});

const shortName = (name: string) => name.replace(/^(Apto|Casa|Studio|Cobertura|Flat)\s?/, "");

function VisaoGeral() {
  const navigate = useNavigate();
  const openProperty = (i: number) =>
    navigate({ to: "/dono/imoveis/$id", params: { id: properties[i].id } });

  const totalRent = properties
    .filter((p) => p.status === "ocupado")
    .reduce((sum, p) => sum + p.financial.rent, 0);
  const totalCosts = properties.reduce((sum, p) => sum + p.financial.condo + p.financial.iptu, 0);
  const netProfit = totalRent - totalCosts;
  const lateCount = properties.filter((p) => p.financial.status === "atrasado").length;
  const occupied = properties.filter((p) => p.status === "ocupado").length;
  const overdue = properties.filter((p) => p.financial.status === "atrasado");

  const names = properties.map((p) => shortName(p.name));
  const occupancy = (["ocupado", "disponivel", "manutencao"] as const).map(statusLabel);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Visão geral"
        description="Resumo financeiro e operacional dos seus imóveis em Fortaleza."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Receita do mês"
          value={formatBRL(totalRent)}
          hint="Julho / 2026"
          icon={Wallet}
          tone="default"
        />
        <KpiCard
          label="Aluguéis atrasados"
          value={String(lateCount)}
          hint={lateCount > 0 ? "Requer atenção" : "Tudo em dia"}
          icon={AlertTriangle}
          tone={lateCount > 0 ? "destructive" : "success"}
        />
        <KpiCard
          label="Lucro líquido"
          value={formatBRL(netProfit)}
          hint="Acumulado no mês"
          icon={TrendingUp}
          tone="success"
        />
        <KpiCard
          label="Imóveis ocupados"
          value={`${occupied}/${properties.length}`}
          hint="Taxa de ocupação"
          icon={Home}
          tone="info"
        />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Evolução da receita</CardTitle>
          <p className="text-sm text-muted-foreground">
            Receitas e custos do portfólio nos últimos 6 meses.
          </p>
        </CardHeader>
        <CardContent>
          <AnalyticsChart
            categories={monthlyRevenue.map((m) => m.month)}
            series={[
              { name: "Receitas", data: monthlyRevenue.map((m) => m.receitas) },
              { name: "Custos", data: monthlyRevenue.map((m) => m.custos) },
            ]}
            types={["area", "line", "column"]}
            axisFormat={formatBRLShort}
            height={300}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Receitas × Custos por imóvel</CardTitle>
            <p className="text-sm text-muted-foreground">
              Clique em uma barra para abrir o imóvel.
            </p>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              categories={names}
              series={[
                {
                  name: "Receitas",
                  data: properties.map((p) => (p.status === "ocupado" ? p.financial.rent : 0)),
                },
                {
                  name: "Custos",
                  data: properties.map((p) => p.financial.condo + p.financial.iptu),
                },
              ]}
              types={["column", "bar", "line"]}
              axisFormat={formatBRLShort}
              onSelectIndex={openProperty}
            />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Ocupação do portfólio</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              categories={occupancy}
              series={[
                {
                  name: "Imóveis",
                  data: (["ocupado", "disponivel", "manutencao"] as const).map(
                    (s) => properties.filter((p) => p.status === s).length,
                  ),
                },
              ]}
              types={["pie", "column", "bar"]}
              format={(n) => `${n} imóvel${n !== 1 ? "s" : ""}`}
            />
          </CardContent>
        </Card>
      </div>

      {overdue.length > 0 ? (
        <Card className="border-destructive/40 bg-destructive/5 shadow-card">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Alertas de aluguel atrasado</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-destructive/20">
              {overdue.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      Inquilino: {p.tenant?.name ?? "—"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-semibold text-destructive">
                      {formatBRL(p.financial.rent)}
                    </span>
                    <StatusBadge status={p.financial.status} />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Próximos vencimentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {properties
              .filter((p) => p.contract)
              .slice(0, 3)
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Venc. {new Date(p.financial.nextDueDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold text-primary">
                    {formatBRL(p.financial.rent)}
                  </span>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Lucro por imóvel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {properties.map((p) => {
              const profit =
                p.status === "ocupado"
                  ? p.financial.rent - p.financial.condo - p.financial.iptu
                  : 0;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border bg-muted/20 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.address.neighborhood}
                    </p>
                  </div>
                  <span
                    className={
                      "shrink-0 font-semibold " +
                      (profit > 0 ? "text-success" : "text-muted-foreground")
                    }
                  >
                    {formatBRL(profit)}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
