import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Filter, FolderOpen, MapPin, Waves } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/status-badge";
import { ClientOnly } from "@/components/client-only";
import { PropertyMap, type MapPoint } from "@/components/property/property-map";
import { properties, type PropertyStatus } from "@/data/properties";
import { formatStreetLine } from "@/lib/address";
import { formatBRL } from "@/lib/format";
import { distanceToSeaKm, isNearSea } from "@/lib/geo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dono/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa · Aluga+" },
      { name: "description", content: "Seus imóveis em Fortaleza no mapa, por bairro e status." },
    ],
  }),
  component: Mapa,
});

type Status = "todos" | PropertyStatus;
type SortBy = "relevancia" | "aluguel-desc" | "aluguel-asc";

const statusChips: { value: Status; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "ocupado", label: "Ocupados" },
  { value: "disponivel", label: "Disponíveis" },
  { value: "manutencao", label: "Em manutenção" },
];

const neighborhoods = Array.from(new Set(properties.map((p) => p.address.neighborhood))).sort();

const kmSea = (km: number) =>
  km < 1 ? `${Math.round(km * 1000)} m do mar` : `${km.toFixed(1).replace(".", ",")} km do mar`;

function Mapa() {
  const [status, setStatus] = useState<Status>("todos");
  const [nearSea, setNearSea] = useState(false);
  const [neighborhood, setNeighborhood] = useState<string>("todos");
  const [sortBy, setSortBy] = useState<SortBy>("relevancia");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeCount =
    (nearSea ? 1 : 0) + (neighborhood !== "todos" ? 1 : 0) + (sortBy !== "relevancia" ? 1 : 0);

  const visible = useMemo(() => {
    const list = properties.filter((p) => {
      if (status !== "todos" && p.status !== status) return false;
      if (nearSea && !isNearSea(p.coordinates)) return false;
      if (neighborhood !== "todos" && p.address.neighborhood !== neighborhood) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      if (sortBy === "aluguel-desc") return b.financial.rent - a.financial.rent;
      if (sortBy === "aluguel-asc") return a.financial.rent - b.financial.rent;
      return distanceToSeaKm(a.coordinates) - distanceToSeaKm(b.coordinates);
    });
  }, [status, nearSea, neighborhood, sortBy]);

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

  const clearFilters = () => {
    setNearSea(false);
    setNeighborhood("todos");
    setSortBy("relevancia");
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Mapa dos imóveis"
        description="Todos os seus imóveis em Fortaleza, distribuídos por bairro e status."
      />

      <div className="flex flex-wrap items-center gap-2">
        {statusChips.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatus(f.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              status === f.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted/60",
            )}
          >
            {f.label}
          </button>
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto gap-1.5">
              <Filter className="h-4 w-4" />
              Filtros
              {activeCount > 0 ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {activeCount}
                </span>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 space-y-4">
            <label className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Waves className="h-4 w-4 text-primary" />
                Perto do mar
              </span>
              <Switch checked={nearSea} onCheckedChange={setNearSea} />
            </label>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Bairro</p>
              <div className="flex flex-wrap gap-1.5">
                {["todos", ...neighborhoods].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setNeighborhood(b)}
                    className={cn(
                      "rounded-md border px-2 py-1 text-xs transition-colors",
                      neighborhood === b
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {b === "todos" ? "Todos" : b}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Ordenar por</p>
              <div className="flex flex-col gap-1">
                {(
                  [
                    ["relevancia", "Relevância (perto do mar)"],
                    ["aluguel-desc", "Maior aluguel"],
                    ["aluguel-asc", "Menor aluguel"],
                  ] as [SortBy, string][]
                ).map(([v, l]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSortBy(v)}
                    className={cn(
                      "rounded-md px-2 py-1 text-left text-xs transition-colors",
                      sortBy === v
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {activeCount > 0 ? (
              <Button variant="ghost" size="sm" className="w-full" onClick={clearFilters}>
                Limpar filtros
              </Button>
            ) : null}
          </PopoverContent>
        </Popover>
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
                      {p.units ? (
                        <FolderOpen
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            active ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                      ) : (
                        <MapPin
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            active ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <StatusBadge status={p.status} />
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {formatStreetLine(p.address)}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs">
                          <span className="font-semibold text-primary">
                            {p.units ? (
                              <>
                                {p.units.length} unidades
                                <span className="font-normal text-muted-foreground">
                                  {" "}
                                  · {p.units.filter((u) => u.status === "ocupado").length} ocupadas
                                </span>
                              </>
                            ) : (
                              <>
                                {formatBRL(p.financial.rent)}
                                <span className="font-normal text-muted-foreground">/mês</span>
                              </>
                            )}
                          </span>
                          <span className="flex items-center gap-0.5 text-muted-foreground">
                            <Waves className="h-3 w-3" />
                            {kmSea(distanceToSeaKm(p.coordinates))}
                          </span>
                        </p>
                      </div>
                    </button>

                    {active ? (
                      <div className="space-y-3 px-4 pb-3">
                        {p.units ? (
                          <ul className="space-y-1 rounded-lg border bg-muted/30 p-2">
                            {p.units.map((u) => (
                              <li
                                key={u.id}
                                className="flex items-center justify-between gap-2 text-xs"
                              >
                                <span className="font-medium">{u.label}</span>
                                <StatusBadge status={u.status} />
                              </li>
                            ))}
                          </ul>
                        ) : null}
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
                  Nenhum imóvel com esses filtros.
                </li>
              ) : null}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
