import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/status-badge";
import { removeProperty, type Property } from "@/data/properties";
import { formatBRL } from "@/lib/format";
import { formatStreetLine, formatCityLine, formatZip } from "@/lib/address";

interface Props {
  property: Property;
}

export function PropertyHeader({ property }: Props) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const onEdit = () => toast.info(`Edição de "${property.name}" em breve.`);

  const handleDelete = () => {
    const removed = removeProperty(property.id);
    if (removed) {
      toast.success(`"${property.name}" foi removido do portfólio.`);
      navigate({ to: "/dono/imoveis" });
    } else {
      toast.error("Não foi possível remover o imóvel.");
    }
  };

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
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <DeleteConfirmContent name={property.name} onConfirm={handleDelete} />
            </AlertDialog>
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <DeleteConfirmContent name={property.name} onConfirm={handleDelete} />
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmContent({ name, onConfirm }: { name: string; onConfirm: () => void }) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir "{name}"?</AlertDialogTitle>
        <AlertDialogDescription>
          Este imóvel será removido do seu portfólio nesta demonstração. Você pode cadastrar
          novamente pelo botão "Novo imóvel".
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Sim, excluir
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
