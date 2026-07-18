import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, Wrench } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getTenantSession } from "@/data/session";
import { formatDate } from "@/lib/format";

interface TicketDraft {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: "aberto";
}

export const Route = createFileRoute("/inquilino/manutencao")({
  head: () => ({ meta: [{ title: "Manutenção · Aluga+" }] }),
  component: InquilinoManutencao,
});

function InquilinoManutencao() {
  const { property } = getTenantSession();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tickets, setTickets] = useState<TicketDraft[]>([]);

  const historico = property.history
    .filter((h) => h.type === "maintenance")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle || !trimmedDescription) return;
    setTickets((prev) => [
      {
        id: `t-${Date.now()}`,
        title: trimmedTitle,
        description: trimmedDescription,
        createdAt: new Date().toISOString(),
        status: "aberto",
      },
      ...prev,
    ]);
    toast.success("Chamado enviado ao proprietário.");
    setTitle("");
    setDescription("");
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Manutenção"
        description="Abra chamados e acompanhe o histórico de reparos do seu imóvel."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95">
                <Plus className="h-4 w-4" />
                Novo chamado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Abrir chamado de manutenção</DialogTitle>
                <DialogDescription>
                  Descreva o problema para {property.owner.name} tomar as providências.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="titulo" className="text-sm font-medium">
                    Título
                  </label>
                  <Input
                    id="titulo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex.: Torneira da cozinha vazando"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="descricao" className="text-sm font-medium">
                    Descrição
                  </label>
                  <Textarea
                    id="descricao"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explique com o máximo de detalhes possível..."
                    rows={4}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95"
                  >
                    Enviar chamado
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wrench className="h-4 w-4 text-primary" />
            Meus chamados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Você ainda não abriu chamados. Clique em <b>Novo chamado</b> para começar.
            </p>
          ) : (
            <ul className="space-y-3">
              {tickets.map((t) => (
                <li key={t.id} className="rounded-xl border bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{t.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Enviado em {formatDate(t.createdAt)}
                      </p>
                    </div>
                    <Badge className="border border-info/30 bg-info/15 text-info">Em análise</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Histórico de manutenções</CardTitle>
          <p className="text-sm text-muted-foreground">
            Reparos e revisões já executados no imóvel.
          </p>
        </CardHeader>
        <CardContent>
          {historico.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Sem manutenções registradas por aqui.
            </p>
          ) : (
            <ol className="relative space-y-6 border-l pl-6">
              {historico.map((event) => (
                <li key={event.id} className="relative">
                  <span className="absolute -left-[35px] grid h-7 w-7 place-items-center rounded-full bg-warning/20 text-warning-foreground ring-4 ring-background dark:text-warning">
                    <Wrench className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{event.title}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(event.date)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
