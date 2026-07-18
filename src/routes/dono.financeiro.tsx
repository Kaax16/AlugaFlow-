import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Filter as FilterIcon } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { properties, type PaymentStatus } from "@/data/properties";
import { formatBRL, formatBRLShort, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dono/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro · Aluga+" }] }),
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

type DueFilter = "todos" | "mes" | "30dias";
const dueFilters: { value: DueFilter; label: string }[] = [
  { value: "todos", label: "Qualquer data" },
  { value: "mes", label: "Vence este mês" },
  { value: "30dias", label: "Próximos 30 dias" },
];

// Referência de "hoje" no mundo dos dados de exemplo (julho/2026).
const HOJE = new Date("2026-07-17T00:00:00Z");

function matchDue(dateIso: string, due: DueFilter): boolean {
  if (due === "todos") return true;
  const d = new Date(dateIso);
  if (due === "mes")
    return d.getUTCFullYear() === HOJE.getUTCFullYear() && d.getUTCMonth() === HOJE.getUTCMonth();
  const diffDias = (d.getTime() - HOJE.getTime()) / 86400000;
  return diffDias >= 0 && diffDias <= 30;
}

function Financeiro() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("todos");
  const [due, setDue] = useState<DueFilter>("todos");

  const rows = useMemo(
    () =>
      properties.filter(
        (p) =>
          (filter === "todos" || p.financial.status === filter) &&
          matchDue(p.financial.nextDueDate, due),
      ),
    [filter, due],
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
          <div className="flex flex-wrap items-center gap-2">
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

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto h-7 gap-1.5">
                  <FilterIcon className="h-3.5 w-3.5" />
                  Vencimento
                  {due !== "todos" ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  ) : null}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 space-y-1">
                <p className="px-1 pb-1 text-xs font-medium text-muted-foreground">
                  Filtrar por vencimento
                </p>
                {dueFilters.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDue(d.value)}
                    className={cn(
                      "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                      due === d.value
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
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
              Nenhum imóvel com esses filtros.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
