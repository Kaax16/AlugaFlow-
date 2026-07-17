import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/property/property-card";
import { properties, statusLabel, type PropertyStatus } from "@/data/properties";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dono/imoveis/")({
  head: () => ({
    meta: [
      { title: "Imóveis · AlugaFlow" },
      { name: "description", content: "Todos os imóveis sob sua gestão em Fortaleza." },
    ],
  }),
  component: ImoveisList,
});

type Filter = "todos" | PropertyStatus;
const filters: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "ocupado", label: "Ocupados" },
  { value: "disponivel", label: "Disponíveis" },
  { value: "manutencao", label: "Em manutenção" },
];

function ImoveisList() {
  const [status, setStatus] = useState<Filter>("todos");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return properties.filter((p) => {
      const matchStatus = status === "todos" || p.status === status;
      const matchQuery =
        !q ||
        [p.name, p.address.neighborhood, p.address.street].join(" ").toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [status, query]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Meus imóveis"
        description="Todos os imóveis sob sua gestão em Fortaleza."
        actions={
          <Button
            onClick={() => toast.info("Cadastro de imóvel em breve por aqui.")}
            className="gap-1.5 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Novo imóvel
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou bairro..."
            className="h-9 w-full rounded-lg border bg-muted/40 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:bg-background focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                status === f.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted/60",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="grid place-items-center rounded-2xl border border-dashed bg-muted/20 py-16 text-center text-sm text-muted-foreground">
          Nenhum imóvel encontrado
          {status !== "todos" ? ` com status “${statusLabel(status)}”` : ""}.
        </div>
      )}
    </div>
  );
}
