import { useState } from "react";
import { Download, Eye, FileText, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Property, PropertyDocument } from "@/data/properties";
import { formatDate } from "@/lib/format";

const typeLabels: Record<PropertyDocument["type"], string> = {
  contrato: "Contrato",
  vistoria: "Vistoria",
  iptu: "IPTU",
  comprovante: "Comprovante",
  outro: "Outro",
};

interface Props {
  property: Property;
}

export function PropertyDocuments({ property }: Props) {
  const [documents, setDocuments] = useState<PropertyDocument[]>(property.documents);

  const handleRemove = (id: string, name: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    toast.success(`"${name}" removido.`);
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle>Documentos</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Contrato, vistoria, comprovantes e demais arquivos.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => toast.info("Upload de documentos em breve.")}
          className="gap-1.5 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95"
        >
          <Upload className="h-4 w-4" />
          Enviar arquivo
        </Button>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="grid place-items-center rounded-xl border border-dashed bg-muted/30 py-10 text-center text-sm text-muted-foreground">
            <FileText className="mb-2 h-8 w-8 text-primary/60" />
            Nenhum documento por aqui ainda.
          </div>
        ) : (
          <ul className="divide-y rounded-xl border">
            {documents.map((doc) => (
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
                    {(doc.sizeKb / 1024).toFixed(2)} MB · Enviado em {formatDate(doc.uploadedAt)}
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
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Excluir"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemove(doc.id, doc.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
