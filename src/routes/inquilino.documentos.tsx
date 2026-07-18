import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTenantSession } from "@/data/session";
import type { PropertyDocument } from "@/data/properties";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inquilino/documentos")({
  head: () => ({ meta: [{ title: "Meus documentos · Aluga+" }] }),
  component: InquilinoDocumentos,
});

const typeLabels: Record<PropertyDocument["type"], string> = {
  contrato: "Contrato",
  vistoria: "Vistoria",
  iptu: "IPTU",
  comprovante: "Comprovante",
  outro: "Outro",
};

type Filter = "todos" | PropertyDocument["type"];
const filters: Filter[] = ["todos", "contrato", "vistoria", "iptu", "comprovante", "outro"];

function InquilinoDocumentos() {
  const { property } = getTenantSession();
  const [filter, setFilter] = useState<Filter>("todos");

  const docs = useMemo(() => {
    const sorted = [...property.documents].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
    return filter === "todos" ? sorted : sorted.filter((d) => d.type === filter);
  }, [filter, property.documents]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Meus documentos"
        description="Contrato, vistoria, boletos e comprovantes do seu imóvel."
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filter === f
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted/60",
            )}
          >
            {f === "todos" ? "Todos" : typeLabels[f]}
          </button>
        ))}
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {docs.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              Nenhum documento neste filtro.
            </p>
          ) : (
            <ul className="divide-y">
              {docs.map((doc) => (
                <li
                  key={doc.id}
                  className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-muted/40"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(doc.sizeKb / 1024).toFixed(2)} MB · {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="border border-primary/20 bg-primary/10 text-primary"
                  >
                    {typeLabels[doc.type]}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Visualizar"
                      onClick={() => toast.info(`Abrindo "${doc.name}"...`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Baixar"
                      onClick={() => toast.success(`Download de "${doc.name}" iniciado.`)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
