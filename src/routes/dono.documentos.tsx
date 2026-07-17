import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { properties, type PropertyDocument } from "@/data/properties";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dono/documentos")({
  head: () => ({ meta: [{ title: "Documentos · AlugaFlow" }] }),
  component: Documentos,
});

const typeLabels: Record<PropertyDocument["type"], string> = {
  contrato: "Contrato",
  vistoria: "Vistoria",
  iptu: "IPTU",
  comprovante: "Comprovante",
  outro: "Outro",
};

// Junta os documentos de todos os imóveis em uma lista só.
const allDocs = properties
  .flatMap((p) => p.documents.map((doc) => ({ ...doc, propertyId: p.id, propertyName: p.name })))
  .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

type Filter = "todos" | PropertyDocument["type"];
const filters: Filter[] = ["todos", "contrato", "vistoria", "iptu", "comprovante", "outro"];

function Documentos() {
  const [filter, setFilter] = useState<Filter>("todos");
  const docs = useMemo(
    () => (filter === "todos" ? allDocs : allDocs.filter((d) => d.type === filter)),
    [filter],
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Documentos"
        description="Contratos, laudos e comprovantes de todos os imóveis."
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
          <ul className="divide-y">
            {docs.map((doc) => (
              <li
                key={`${doc.propertyId}-${doc.id}`}
                className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-muted/40"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    <Link
                      to="/dono/imoveis/$id"
                      params={{ id: doc.propertyId }}
                      className="hover:text-primary hover:underline"
                    >
                      {doc.propertyName}
                    </Link>{" "}
                    · {(doc.sizeKb / 1024).toFixed(2)} MB · {formatDate(doc.uploadedAt)}
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
        </CardContent>
      </Card>
    </div>
  );
}
