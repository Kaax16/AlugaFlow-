import { Bath, BedDouble, Calendar, Car, MapPin, Ruler } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientOnly } from "@/components/client-only";
import { PropertyMap } from "@/components/property/property-map";
import { formatDate } from "@/lib/format";
import { formatCityLine, formatZip } from "@/lib/address";
import type { Property } from "@/data/properties";

interface Props {
  property: Property;
}

export function PropertyInfo({ property }: Props) {
  const { address } = property;

  const specs = [
    { icon: Ruler, label: "Área", value: `${property.area} m²` },
    { icon: BedDouble, label: "Quartos", value: String(property.bedrooms) },
    { icon: Bath, label: "Banheiros", value: String(property.bathrooms) },
    { icon: Car, label: "Vagas", value: String(property.parking) },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Informações gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm leading-relaxed text-muted-foreground">{property.description}</p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.label} className="rounded-xl border bg-muted/30 p-3 text-center">
                <spec.icon className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-1 text-lg font-semibold">{spec.value}</p>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {spec.label}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <InfoRow label="Logradouro" value={address.street} />
            <InfoRow label="Número" value={address.number} />
            <InfoRow label="Complemento" value={address.complement ?? "—"} />
            <InfoRow label="Bairro" value={address.neighborhood} />
            <InfoRow label="Cidade" value={`${address.city} / ${address.state}`} />
            <InfoRow label="CEP" value={formatZip(address.zip)} />
            <InfoRow
              label="Cadastrado em"
              value={formatDate(property.createdAt)}
              icon={<Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
            />
            <InfoRow
              label="Última atualização"
              value={formatDate(property.updatedAt)}
              icon={<Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4 text-primary" />
            Localização
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatCityLine(address)} · CEP {formatZip(address.zip)}
          </p>
        </CardHeader>
        <CardContent>
          <ClientOnly fallback={<MapSkeleton />}>
            <PropertyMap
              points={[
                {
                  id: property.id,
                  name: property.name,
                  lat: property.coordinates.lat,
                  lng: property.coordinates.lng,
                  status: property.status,
                  subtitle: property.address.neighborhood,
                },
              ]}
              center={property.coordinates}
              zoom={15}
              className="h-64 sm:h-72"
            />
          </ClientOnly>
        </CardContent>
      </Card>
    </div>
  );
}

function MapSkeleton() {
  return <div className="h-64 w-full animate-pulse rounded-2xl border bg-muted/40 sm:h-72" />;
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
