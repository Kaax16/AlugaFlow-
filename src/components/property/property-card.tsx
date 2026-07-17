import { Link } from "@tanstack/react-router";
import { MapPin, User } from "lucide-react";
import type { Property } from "@/data/properties";
import { StatusBadge } from "@/components/status-badge";
import { PropertyImage } from "@/components/property/property-image";
import { formatBRL } from "@/lib/format";
import { formatStreetLine, formatCityLine } from "@/lib/address";
import { Card } from "@/components/ui/card";

interface Props {
  property: Property;
}

export function PropertyCard({ property }: Props) {
  const cover = property.gallery[0];

  return (
    <Link
      to="/dono/imoveis/$id"
      params={{ id: property.id }}
      className="group block focus-visible:outline-none"
    >
      <Card className="overflow-hidden p-0 shadow-card transition-all group-hover:-translate-y-1 group-hover:shadow-elegant group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <div className="relative aspect-[16/10]">
          <PropertyImage
            src={cover?.src}
            alt={`Foto de ${property.name}`}
            hue={cover?.hue ?? 295}
            className="h-full w-full"
            imgClassName="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <span className="absolute bottom-3 left-4 text-xs font-medium text-white/90 drop-shadow">
            {cover?.label ?? "Sem foto"}
          </span>
          <div className="absolute right-3 top-3">
            <StatusBadge status={property.status} className="backdrop-blur-sm" />
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="min-w-0 space-y-1">
            <h3 className="truncate text-lg font-semibold tracking-tight">{property.name}</h3>
            <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="min-w-0">
                <span className="block truncate">{formatStreetLine(property.address)}</span>
                <span className="block truncate text-xs">{formatCityLine(property.address)}</span>
              </span>
            </p>
            <p className="text-xs text-muted-foreground">{property.type}</p>
          </div>

          <div className="flex items-end justify-between gap-3 border-t pt-4">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Aluguel</p>
              <p className="text-lg font-semibold text-primary">
                {formatBRL(property.financial.rent)}
              </p>
            </div>
            {property.tenant ? (
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Inquilino
                </p>
                <p className="flex items-center justify-end gap-1.5 text-sm font-medium">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate">{property.tenant.name}</span>
                </p>
              </div>
            ) : (
              <div className="text-right text-xs text-muted-foreground">Sem inquilino</div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
