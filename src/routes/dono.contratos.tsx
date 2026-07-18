import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { properties } from "@/data/properties";
import { formatBRL, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dono/contratos")({
  head: () => ({ meta: [{ title: "Contratos · Aluga+" }] }),
  component: Contratos,
});

function Contratos() {
  const withContract = properties.filter((p) => p.contract);
  return (
    <div className="space-y-6">
      <SectionHeader title="Contratos" description="Todos os contratos ativos e histórico." />
      <div className="grid gap-4 md:grid-cols-2">
        {withContract.map((p) => (
          <Card key={p.id} className="shadow-card">
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle>{p.name}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Inquilino: {p.tenant?.name}</p>
              </div>
              <Badge className="border border-success/30 bg-success/15 text-success">Ativo</Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[11px] uppercase text-muted-foreground">Início</p>
                <p className="font-medium">{formatDate(p.contract!.startDate)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-muted-foreground">Término</p>
                <p className="font-medium">{formatDate(p.contract!.endDate)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] uppercase text-muted-foreground">Valor mensal</p>
                <p className="text-lg font-semibold text-primary">
                  {formatBRL(p.contract!.monthlyValue)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
