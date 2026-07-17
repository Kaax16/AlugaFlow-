import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Wrench } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { properties } from "@/data/properties";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/dono/manutencao")({
  head: () => ({ meta: [{ title: "Manutenção · AlugaFlow" }] }),
  component: Manutencao,
});

// Imóveis atualmente em manutenção e o histórico de manutenções de todos.
const emManutencao = properties.filter((p) => p.status === "manutencao");
const historico = properties
  .flatMap((p) =>
    p.history.filter((h) => h.type === "maintenance").map((h) => ({ ...h, property: p })),
  )
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

function Manutencao() {
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
        <CardHeader>
          <CardTitle>Histórico de manutenções</CardTitle>
        </CardHeader>
        <CardContent>
          {historico.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhuma manutenção registrada.
            </p>
          ) : (
            <ol className="relative space-y-6 border-l pl-6">
              {historico.map((event) => (
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
