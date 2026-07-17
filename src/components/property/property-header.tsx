import { Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import type { Property } from "@/data/properties";
import { formatBRL } from "@/lib/format";
import { formatStreetLine, formatCityLine, formatZip } from "@/lib/address";

interface Props {
  property: Property;
}

export function PropertyHeader({ property }: Props) {
  const onEdit = () => toast.info(`Edição de "${property.name}" em breve.`);
  const onDelete = () =>
    toast.warning(`Excluir "${property.name}"? Ação indisponível nesta demonstração.`);

  return (
    <div className="relative overflow-hidden rounded-3xl border bg-card shadow-card">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-80" />
      <div className="relative flex flex-col gap-6 p-5 sm:p-6 md:p-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="-ml-2 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Link to="/dono/imoveis">
              <ArrowLeft className="h-4 w-4" />
              Voltar para imóveis
            </Link>
          </Button>
          <div className="hidden gap-2 sm:flex">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-3">
            <StatusBadge status={property.status} />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                {property.name}
              </h1>
              <p className="mt-1.5 flex items-start gap-1.5 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="min-w-0">
                  {formatStreetLine(property.address)} · {formatCityLine(property.address)}
                  <span className="block text-xs">CEP {formatZip(property.address.zip)}</span>
                </span>
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {property.type} · {property.area} m²
            </p>
          </div>
          <div className="shrink-0 sm:text-right">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Aluguel mensal
            </p>
            <p className="text-2xl font-semibold text-gradient-primary sm:text-3xl md:text-4xl">
              {formatBRL(property.financial.rent)}
            </p>
          </div>
        </div>

        <div className="flex gap-2 sm:hidden">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
