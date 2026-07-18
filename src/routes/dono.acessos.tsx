import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DoorOpen, KeyRound, MoreHorizontal, Nfc, Radio, ShieldX, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  accessEvents as initialEvents,
  accessMethodLabel,
  holderRoleLabel,
  nfcTags as initialTags,
  tagStatusLabel,
  type AccessEvent,
  type NfcTag,
  type TagStatus,
} from "@/data/access";
import { getPropertyById, properties } from "@/data/properties";
import { formatDate, formatDateTime } from "@/lib/format";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dono/acessos")({
  head: () => ({ meta: [{ title: "Acessos NFC · Aluga+" }] }),
  component: Acessos,
});

const tagStatusStyles: Record<TagStatus, string> = {
  ativa: "bg-success/15 text-success border border-success/25",
  suspensa: "bg-warning/20 text-warning-foreground border border-warning/40 dark:text-warning",
  revogada: "bg-destructive/15 text-destructive border border-destructive/25",
};

/** Leitura mínima do Web NFC (Chrome Android) sem depender de tipos globais. */
type NDEFReaderLike = {
  scan(): Promise<void>;
  addEventListener(type: "reading", listener: (event: { serialNumber?: string }) => void): void;
};

function propertyName(id: string): string {
  return getPropertyById(id)?.name ?? id;
}

function Acessos() {
  const mounted = useMounted();
  const [tags, setTags] = useState<NfcTag[]>(initialTags);
  const [events, setEvents] = useState<AccessEvent[]>(initialEvents);
  const [scanning, setScanning] = useState(false);
  const [lastRead, setLastRead] = useState<AccessEvent | null>(null);

  const supportsWebNfc = mounted && typeof window !== "undefined" && "NDEFReader" in window;

  const activeTags = tags.filter((t) => t.status === "ativa").length;
  const granted = events.filter((e) => e.result === "liberado").length;
  const denied = events.filter((e) => e.result === "negado").length;

  const doors = useMemo(() => properties.map((p) => ({ id: p.id, name: p.name })), []);

  const registerRead = (tag: NfcTag | undefined, uid: string) => {
    const now = new Date().toISOString();
    let event: AccessEvent;
    if (!tag) {
      event = {
        id: `ev-${Date.now()}`,
        tagUid: uid,
        holderName: "Tag não cadastrada",
        propertyId: doors[0]?.id ?? "",
        door: "Leitor do simulador",
        method: "nfc",
        result: "negado",
        reason: "UID desconhecido — tag não pertence à plataforma",
        at: now,
      };
    } else {
      const allowed = tag.status === "ativa";
      event = {
        id: `ev-${Date.now()}`,
        tagUid: tag.uid,
        holderName: tag.holderName,
        propertyId: tag.propertyId,
        door: "Porta principal",
        method: "nfc",
        result: allowed ? "liberado" : "negado",
        reason: allowed ? undefined : `Tag ${tagStatusLabel(tag.status).toLowerCase()}`,
        at: now,
      };
    }
    setEvents((prev) => [event, ...prev]);
    setLastRead(event);
    if (event.result === "liberado") {
      toast.success(`Acesso liberado para ${event.holderName}`, {
        description: propertyName(event.propertyId),
      });
    } else {
      toast.error(`Acesso negado — ${event.holderName}`, { description: event.reason });
    }
  };

  const simulateTap = () => {
    if (scanning) return;
    setScanning(true);
    // Sorteia uma tag cadastrada para encenar a aproximação no leitor.
    const tag = tags[Math.floor(Math.random() * tags.length)];
    window.setTimeout(() => {
      setScanning(false);
      registerRead(tag, tag.uid);
    }, 1200);
  };

  const readRealTag = async () => {
    const Reader = (window as unknown as { NDEFReader?: new () => NDEFReaderLike }).NDEFReader;
    if (!Reader) return;
    try {
      const reader = new Reader();
      await reader.scan();
      setScanning(true);
      toast.info("Aproxime a tag NFC do aparelho…");
      reader.addEventListener("reading", ({ serialNumber }) => {
        setScanning(false);
        const uid = (serialNumber ?? "").toUpperCase();
        const tag = tags.find((t) => t.uid.toUpperCase() === uid);
        registerRead(tag, uid || "UID indisponível");
      });
    } catch {
      setScanning(false);
      toast.error("Não foi possível iniciar a leitura NFC", {
        description: "Verifique a permissão do navegador e tente novamente.",
      });
    }
  };

  const releaseRemotely = (door: { id: string; name: string }) => {
    const event: AccessEvent = {
      id: `ev-${Date.now()}`,
      holderName: "Ricardo Albuquerque",
      propertyId: door.id,
      door: "Porta principal",
      method: "remoto",
      result: "liberado",
      reason: "Liberação remota pelo painel",
      at: new Date().toISOString(),
    };
    setEvents((prev) => [event, ...prev]);
    toast.success("Porta liberada remotamente", { description: door.name });
  };

  const setTagStatus = (id: string, status: TagStatus) => {
    setTags((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    const tag = tags.find((t) => t.id === id);
    if (tag) toast.success(`Tag de ${tag.holderName} ${tagStatusLabel(status).toLowerCase()}`);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Acessos NFC"
        description="Fechaduras conectadas: tags de aproximação, liberação remota e histórico completo."
        actions={
          <Popover>
            <PopoverTrigger asChild>
              <Button className="gap-2">
                <DoorOpen className="h-4 w-4" />
                Liberar porta
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 space-y-1">
              <p className="px-1 pb-1 text-xs font-medium text-muted-foreground">
                Liberação remota — escolha o imóvel
              </p>
              {doors.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => releaseRemotely(d)}
                  className="w-full rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {d.name}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Tags ativas" value={String(activeTags)} icon={KeyRound} tone="success" />
        <KpiCard
          label="Portas conectadas"
          value={String(doors.length)}
          icon={DoorOpen}
          tone="info"
        />
        <KpiCard label="Acessos na semana" value={String(granted)} icon={Nfc} />
        <KpiCard
          label="Tentativas negadas"
          value={String(denied)}
          icon={ShieldX}
          tone="destructive"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Leitor NFC</CardTitle>
            <p className="text-sm text-muted-foreground">
              {supportsWebNfc
                ? "Seu navegador suporta Web NFC — leia uma tag física ou simule."
                : "Simule a aproximação de uma tag no leitor da fechadura."}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5">
            <div
              className={cn(
                "grid h-32 w-32 place-items-center rounded-full border-2 transition-colors",
                scanning
                  ? "animate-pulse border-primary bg-primary/10 text-primary"
                  : "border-dashed border-border text-muted-foreground",
              )}
            >
              <Nfc className="h-12 w-12" />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={simulateTap} disabled={scanning} className="gap-2">
                <Radio className="h-4 w-4" />
                {scanning ? "Lendo…" : "Aproximar tag (simular)"}
              </Button>
              {supportsWebNfc ? (
                <Button
                  variant="outline"
                  onClick={readRealTag}
                  disabled={scanning}
                  className="gap-2"
                >
                  <Smartphone className="h-4 w-4" />
                  Ler tag física
                </Button>
              ) : null}
            </div>

            {lastRead ? (
              <div
                className={cn(
                  "w-full rounded-lg border p-3 text-sm",
                  lastRead.result === "liberado"
                    ? "border-success/30 bg-success/10"
                    : "border-destructive/30 bg-destructive/10",
                )}
              >
                <p className="font-medium">
                  {lastRead.result === "liberado" ? "✓ Acesso liberado" : "✗ Acesso negado"} —{" "}
                  {lastRead.holderName}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {lastRead.tagUid ? `UID ${lastRead.tagUid} · ` : ""}
                  {propertyName(lastRead.propertyId)}
                  {lastRead.reason ? ` · ${lastRead.reason}` : ""}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Histórico de acionamentos</CardTitle>
            <p className="text-sm text-muted-foreground">
              Cada aproximação de tag ou liberação remota fica registrada aqui.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="max-h-105 divide-y overflow-y-auto">
              {events.map((e) => (
                <li key={e.id} className="flex items-start gap-3 px-5 py-3">
                  <span
                    className={cn(
                      "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full",
                      e.result === "liberado"
                        ? "bg-success/15 text-success"
                        : "bg-destructive/15 text-destructive",
                    )}
                  >
                    {e.method === "remoto" ? (
                      <DoorOpen className="h-4 w-4" />
                    ) : (
                      <Nfc className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {e.holderName}
                      <span
                        className={cn(
                          "ml-2 text-xs font-semibold",
                          e.result === "liberado" ? "text-success" : "text-destructive",
                        )}
                      >
                        {e.result === "liberado" ? "Liberado" : "Negado"}
                      </span>
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {propertyName(e.propertyId)} · {e.door} · {accessMethodLabel(e.method)}
                      {e.reason ? ` · ${e.reason}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDateTime(e.at)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Tags cadastradas</CardTitle>
          <p className="text-sm text-muted-foreground">
            Suspenda ou revogue uma tag e a fechadura recusa o acesso na hora.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Portador</TableHead>
                  <TableHead>UID da tag</TableHead>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <p className="font-medium">{t.holderName}</p>
                      <p className="text-xs text-muted-foreground">
                        {holderRoleLabel(t.holderRole)}
                      </p>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {t.uid}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {propertyName(t.propertyId)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {t.expiresAt ? formatDate(t.expiresAt) : "Sem validade"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          tagStatusStyles[t.status],
                        )}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {tagStatusLabel(t.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Ações da tag</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {t.status !== "ativa" ? (
                            <DropdownMenuItem onClick={() => setTagStatus(t.id, "ativa")}>
                              Reativar tag
                            </DropdownMenuItem>
                          ) : null}
                          {t.status === "ativa" ? (
                            <DropdownMenuItem onClick={() => setTagStatus(t.id, "suspensa")}>
                              Suspender temporariamente
                            </DropdownMenuItem>
                          ) : null}
                          {t.status !== "revogada" ? (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setTagStatus(t.id, "revogada")}
                            >
                              Revogar definitivamente
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
