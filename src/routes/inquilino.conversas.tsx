import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/section-header";
import { PropertyChat } from "@/components/property/property-chat";
import { getTenantSession } from "@/data/session";

export const Route = createFileRoute("/inquilino/conversas")({
  head: () => ({ meta: [{ title: "Conversas · Aluga+" }] }),
  component: InquilinoConversas,
});

function InquilinoConversas() {
  const { property } = getTenantSession();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Conversa com o proprietário"
        description={`Canal exclusivo do imóvel ${property.name}.`}
      />
      <PropertyChat property={property} role="tenant" />
    </div>
  );
}
