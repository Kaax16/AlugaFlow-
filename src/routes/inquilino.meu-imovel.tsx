import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/section-header";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyInfo } from "@/components/property/property-info";
import { StatusBadge } from "@/components/status-badge";
import { getTenantSession } from "@/data/session";

export const Route = createFileRoute("/inquilino/meu-imovel")({
  head: () => ({ meta: [{ title: "Meu imóvel · Aluga+" }] }),
  component: MeuImovel,
});

function MeuImovel() {
  const { property } = getTenantSession();

  return (
    <div className="space-y-6">
      <SectionHeader
        title={property.name}
        description={`${property.type} · ${property.address.neighborhood}, ${property.address.city}/${property.address.state}`}
        actions={<StatusBadge status={property.status} />}
      />

      <PropertyGallery gallery={property.gallery} />
      <PropertyInfo property={property} />
    </div>
  );
}
