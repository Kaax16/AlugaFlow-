import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsChart } from "@/components/analytics-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { properties, paymentStatusLabel, type PaymentStatus } from "@/data/properties";
import { formatBRL, formatBRLShort, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dono/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro · AlugaFlow" }] }),
  component: Financeiro,
});

const shortName = (name: string) => name.replace(/^(Apto|Casa|Studio|Cobertura|Flat)\s?/, "");

type Filter = "todos" | PaymentStatus;
const filters: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "em_dia", label: "Em dia" },
  { value: "pendente", label: "Pendentes" },
  { value: "atrasado", label: "Atrasados" },
];

function Financeiro() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("todos");

  const rows = useMemo(
    () =>
      filter === "todos" ? properties : properties.filter((p) => p.financial.status === filter),
    [filter],
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Financeiro"
        description="Acompanhe recebimentos, pagamentos e situação de cada imóvel."
      />

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Composição mensal por imóvel</CardTitle>
          <p className="text-sm text-muted-foreground">
            Aluguel, condomínio e IPTU somados — clique para abrir o imóvel.
          </p>
        </CardHeader>
        <CardContent>
          <AnalyticsChart
            categories={properties.map((p) => shortName(p.name))}
            series={[
              { name: "Aluguel", data: properties.map((p) => p.financial.rent) },
              { name: "Condomínio", data: properties.map((p) => p.financial.condo) },
              { name: "IPTU", data: properties.map((p) => p.financial.iptu) },
            ]}
            types={["column", "bar"]}
            stacked
            axisFormat={formatBRLShort}
            onSelectIndex={(i) =>
              navigate({ to: "/dono/imoveis/$id", params: { id: properties[i].id } })
            }
          />
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="gap-3">
          <CardTitle>Pagamentos por imóvel</CardTitle>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filter === f.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted/60",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </CardHeader>

        {/* Desktop: tabela. Mobile: lista de cards (melhor leitura no celular). */}
        <CardContent className="p-0">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Inquilino</TableHead>
                  <TableHead className="text-right">Aluguel</TableHead>
                  <TableHead className="text-right">Total mensal</TableHead>
                  <TableHead>Próx. vencimento</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer"
                    onClick={() => navigate({ to: "/dono/imoveis/$id", params: { id: p.id } })}
                  >
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.tenant?.name ?? "—"}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {formatBRL(p.financial.rent)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatBRL(p.financial.rent + p.financial.condo + p.financial.iptu)}
                    </TableCell>
                    <TableCell>{formatDate(p.financial.nextDueDate)}</TableCell>
                    <TableCell>
                      <StatusBadge status={p.financial.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <ul className="divide-y md:hidden">
            {rows.map((p) => (
              <li
                key={p.id}
                className="space-y-3 p-4"
                onClick={() => navigate({ to: "/dono/imoveis/$id", params: { id: p.id } })}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.tenant?.name ?? "Sem inquilino"}
                    </p>
                  </div>
                  <StatusBadge status={p.financial.status} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Aluguel
                    </p>
                    <p className="font-semibold text-primary">{formatBRL(p.financial.rent)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Total mensal
                    </p>
                    <p className="font-medium">
                      {formatBRL(p.financial.rent + p.financial.condo + p.financial.iptu)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Próx. vencimento
                    </p>
                    <p className="font-medium">{formatDate(p.financial.nextDueDate)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {rows.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              Nenhum imóvel com status “{paymentStatusLabel(filter as PaymentStatus)}”.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
