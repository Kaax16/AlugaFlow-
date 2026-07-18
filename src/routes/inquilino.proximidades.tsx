import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { ClientOnly } from "@/components/client-only";
import { TenantAreaMap } from "@/components/tenant-area-map";
import { getTenantSession } from "@/data/session";
import {
  distanceKm,
  proximities,
  proximityIcons,
  proximityLabels,
  type ProximityCategory,
} from "@/data/proximities";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inquilino/proximidades")({
  head: () => ({
    meta: [
      { title: "Proximidades · Aluga+" },
      {
        name: "description",
        content: "Escolas, shoppings, hospitais e mais no entorno do seu imóvel.",
      },
    ],
  }),
  component: InquilinoProximidades,
});

type Filter = "todos" | ProximityCategory;

const CATEGORIES: ProximityCategory[] = [
  "escola",
  "shopping",
  "supermercado",
  "farmacia",
  "hospital",
  "parque",
  "restaurante",
  "academia",
  "transporte",
];

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace(".", ",")} km`;
}

function InquilinoProximidades() {
  const { property } = getTenantSession();
  const [filter, setFilter] = useState<Filter>("todos");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const enriched = useMemo(
    () =>
      proximities
        .map((p) => ({ ...p, distance: distanceKm(property.coordinates, p.coordinates) }))
        .sort((a, b) => a.distance - b.distance),
    [property.coordinates],
  );

  const visible = useMemo(
    () => (filter === "todos" ? enriched : enriched.filter((p) => p.category === filter)),
    [filter, enriched],
  );

  const counts = useMemo(() => {
    const acc: Record<Filter, number> = { todos: enriched.length } as Record<Filter, number>;
    for (const cat of CATEGORIES) acc[cat] = 0;
    for (const p of enriched) acc[p.category] += 1;
    return acc;
  }, [enriched]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Proximidades"
        description={`O que tem por perto de ${property.name} em ${property.address.neighborhood}.`}
      />

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={filter === "todos"}
          onClick={() => setFilter("todos")}
          label={`Todos · ${counts.todos}`}
        />
        {CATEGORIES.map((cat) => (
          <FilterChip
            key={cat}
            active={filter === cat}
            onClick={() => setFilter(cat)}
            label={`${proximityIcons[cat]} ${proximityLabels[cat]} · ${counts[cat] ?? 0}`}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ClientOnly
          fallback={
            <div className="h-[420px] animate-pulse rounded-2xl border bg-muted/40 lg:h-[620px]" />
          }
        >
          <TenantAreaMap
            home={{ name: property.name, coordinates: property.coordinates }}
            pois={visible}
            selectedId={selectedId}
            onSelect={setSelectedId}
            className="h-[420px] lg:h-[620px]"
          />
        </ClientOnly>

        <Card className="shadow-card lg:max-h-[620px] lg:overflow-hidden">
          <CardContent className="p-0 lg:flex lg:h-full lg:flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3 text-sm">
              <span className="font-medium">
                {visible.length} local{visible.length !== 1 ? "s" : ""} nas proximidades
              </span>
              <span className="text-muted-foreground">{property.address.neighborhood}</span>
            </div>
            <ul className="divide-y lg:flex-1 lg:overflow-y-auto">
              {visible.map((poi) => {
                const active = poi.id === selectedId;
                return (
                  <li key={poi.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(poi.id)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                        active && "bg-primary/5",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-base",
                          active ? "ring-2 ring-primary" : "ring-1 ring-border",
                        )}
                      >
                        {proximityIcons[poi.category]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium">{poi.name}</p>
                          <span className="shrink-0 text-xs font-semibold text-primary">
                            {formatDistance(poi.distance)}
                          </span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {proximityLabels[poi.category]}
                        </p>
                        <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{poi.address}</span>
                        </p>
                        {poi.rating ? (
                          <p className="mt-1 flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 fill-warning text-warning" />
                            <span className="font-medium">{poi.rating.toFixed(1)}</span>
                            {poi.hint ? (
                              <span className="truncate text-muted-foreground"> · {poi.hint}</span>
                            ) : null}
                          </p>
                        ) : poi.hint ? (
                          <p className="mt-1 truncate text-xs text-muted-foreground">{poi.hint}</p>
                        ) : null}
                      </div>
                    </button>
                  </li>
                );
              })}
              {visible.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-muted-foreground">
                  Nenhum local nesta categoria.
                </li>
              ) : null}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-muted/60",
      )}
    >
      {label}
    </button>
  );
}
