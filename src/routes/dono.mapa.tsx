import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, FolderOpen, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { ClientOnly } from "@/components/client-only";
import { PropertyMap, type MapPoint } from "@/components/property/property-map";
import { properties, statusLabel, type PropertyStatus } from "@/data/properties";
import { formatStreetLine } from "@/lib/address";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dono/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa · AlugaFlow" },
      { name: "description", content: "Seus imóveis em Fortaleza no mapa, por bairro e status." },
    ],
  }),
  component: Mapa,
});

type Filter = "todos" | PropertyStatus;

const filters: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "ocupado", label: "Ocupados" },
  { value: "disponivel", label: "Disponíveis" },
  { value: "manutencao", label: "Em manutenção" },
];

function Mapa() {
  const [filter, setFilter] = useState<Filter>("todos");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === "todos" ? properties : properties.filter((p) => p.status === filter)),
    [filter],
  );

  const points = useMemo<MapPoint[]>(
    () =>
      visible.map((p) => ({
        id: p.id,
        name: p.name,
        lat: p.coordinates.lat,
        lng: p.coordinates.lng,
        status: p.status,
        subtitle: `${p.address.neighborhood} · ${formatBRL(p.financial.rent)}/mês`,
        units: p.units?.map((u) => ({ label: u.label, status: u.status })),
      })),
    [visible],
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Mapa dos imóveis"
        description="Todos os seus imóveis em Fortaleza, distribuídos por bairro e status."
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted/60",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ClientOnly
          fallback={
            <div className="h-[420px] animate-pulse rounded-2xl border bg-muted/40 lg:h-[640px]" />
          }
        >
          <PropertyMap
            points={points}
            selectedId={selectedId}
            onSelect={setSelectedId}
            className="h-[420px] lg:h-[640px]"
          />
        </ClientOnly>

        <Card className="shadow-card lg:max-h-[640px] lg:overflow-hidden">
          <CardContent className="p-0 lg:flex lg:h-full lg:flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3 text-sm">
              <span className="font-medium">
                {visible.length} imóvel{visible.length !== 1 ? "s" : ""}
              </span>
              <span className="text-muted-foreground">Fortaleza / CE</span>
            </div>
            <ul className="divide-y lg:flex-1 lg:overflow-y-auto">
              {visible.map((p) => {
                const active = p.id === selectedId;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                        active && "bg-primary/5",
                      )}
                    >
                      <MapPin
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          active ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <StatusBadge status={p.status} />
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {formatStreetLine(p.address)}
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-primary">
                          {formatBRL(p.financial.rent)}
                          <span className="font-normal text-muted-foreground">/mês</span>
                        </p>
                      </div>
                    </button>

                    {active ? (
                      <div className="px-4 pb-3">
                        <Button asChild size="sm" variant="outline" className="w-full gap-1.5">
                          <Link to="/dono/imoveis/$id" params={{ id: p.id }}>
                            Ver detalhes
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    ) : null}
                  </li>
                );
              })}

              {visible.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-muted-foreground">
                  Nenhum imóvel com o status “{statusLabel(filter as PropertyStatus)}”.
                </li>
              ) : null}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
