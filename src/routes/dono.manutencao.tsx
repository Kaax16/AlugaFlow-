import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Filter as FilterIcon, Plus, Wrench } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StatusBadge } from "@/components/status-badge";
import { properties } from "@/data/properties";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dono/manutencao")({
  head: () => ({ meta: [{ title: "Manutenção · Aluga+" }] }),
  component: Manutencao,
});

// Imóveis atualmente em manutenção e o histórico de manutenções de todos.
const emManutencao = properties.filter((p) => p.status === "manutencao");
const historico = properties
  .flatMap((p) =>
    p.history.filter((h) => h.type === "maintenance").map((h) => ({ ...h, property: p })),
  )
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const neighborhoods = Array.from(new Set(properties.map((p) => p.address.neighborhood))).sort();

type Period = "todos" | "90dias" | "ano";
const periods: { value: Period; label: string }[] = [
  { value: "todos", label: "Todo o período" },
  { value: "90dias", label: "Últimos 90 dias" },
  { value: "ano", label: "Este ano" },
];

const HOJE = new Date("2026-07-17T00:00:00Z");

function Manutencao() {
  const [period, setPeriod] = useState<Period>("todos");
  const [bairro, setBairro] = useState<string>("todos");
  const activeCount = (period !== "todos" ? 1 : 0) + (bairro !== "todos" ? 1 : 0);

  const eventos = useMemo(
    () =>
      historico.filter((e) => {
        if (bairro !== "todos" && e.property.address.neighborhood !== bairro) return false;
        if (period === "ano") return new Date(e.date).getUTCFullYear() === HOJE.getUTCFullYear();
        if (period === "90dias")
          return (HOJE.getTime() - new Date(e.date).getTime()) / 86400000 <= 90;
        return true;
      }),
    [period, bairro],
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Manutenção"
        description="Chamados abertos e histórico de manutenções dos imóveis."
        actions={
          <Button
            onClick={() => toast.info("Abertura de chamado em breve.")}
            className="gap-1.5 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Novo chamado
          </Button>
        }
      />

      {emManutencao.length > 0 ? (
        <Card className="border-info/40 bg-info/5 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="h-4 w-4 text-info" />
              Em manutenção agora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {emManutencao.map((p) => (
              <Link
                key={p.id}
                to="/dono/imoveis/$id"
                params={{ id: p.id }}
                className="flex items-center justify-between gap-3 rounded-xl border bg-card px-3 py-2.5 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.address.neighborhood}</p>
                </div>
                <StatusBadge status={p.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle>Histórico de manutenções</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <FilterIcon className="h-4 w-4" />
                Filtros
                {activeCount > 0 ? (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {activeCount}
                  </span>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60 space-y-3">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Período</p>
                <div className="flex flex-col gap-1">
                  {periods.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPeriod(p.value)}
                      className={cn(
                        "rounded-md px-2 py-1 text-left text-sm transition-colors",
                        period === p.value
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Bairro</p>
                <div className="flex flex-wrap gap-1.5">
                  {["todos", ...neighborhoods].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBairro(b)}
                      className={cn(
                        "rounded-md border px-2 py-1 text-xs transition-colors",
                        bairro === b
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {b === "todos" ? "Todos" : b}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          {eventos.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhuma manutenção nesse filtro.
            </p>
          ) : (
            <ol className="relative space-y-6 border-l pl-6">
              {eventos.map((event) => (
                <li key={`${event.property.id}-${event.id}`} className="relative">
                  <span className="absolute -left-[35px] grid h-7 w-7 place-items-center rounded-full bg-warning/20 text-warning-foreground ring-4 ring-background dark:text-warning">
                    <Wrench className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{event.title}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(event.date)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <Link
                    to="/dono/imoveis/$id"
                    params={{ id: event.property.id }}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {event.property.name}
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
