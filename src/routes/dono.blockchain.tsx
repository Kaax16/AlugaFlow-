import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Blocks,
  CircleCheck,
  Copy,
  FileSignature,
  Landmark,
  Link2,
  Lock,
  Rocket,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  chainStatusLabel,
  onchainEventLabel,
  onchainEvents,
  platformWallet,
  shortHash,
  smartContracts,
  type ChainContractStatus,
  type OnchainEventType,
} from "@/data/blockchain";
import { getPropertyById } from "@/data/properties";
import { formatBRL, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dono/blockchain")({
  head: () => ({ meta: [{ title: "Blockchain · Aluga+" }] }),
  component: Blockchain,
});

const chainStatusStyles: Record<ChainContractStatus, string> = {
  ativo: "bg-success/15 text-success border border-success/25",
  escrow: "bg-info/15 text-info border border-info/25",
  aguardando_assinatura:
    "bg-warning/20 text-warning-foreground border border-warning/40 dark:text-warning",
  encerrado: "bg-muted text-muted-foreground border border-border",
};

const eventIcons: Record<OnchainEventType, typeof Rocket> = {
  deploy: Rocket,
  assinatura: FileSignature,
  caucao: Lock,
  pagamento: Landmark,
  liberacao: CircleCheck,
  encerramento: Blocks,
};

const steps = [
  {
    icon: Rocket,
    title: "1. Registro on-chain",
    text: "O contrato de locação vira um smart contract com hash público e imutável.",
  },
  {
    icon: Lock,
    title: "2. Caução em escrow",
    text: "O depósito do inquilino fica travado no contrato — ninguém movimenta sozinho.",
  },
  {
    icon: CircleCheck,
    title: "3. Liberação automática",
    text: "Com a vistoria aprovada, o próprio contrato devolve a caução sem burocracia.",
  },
];

function copyToClipboard(value: string, label: string) {
  navigator.clipboard
    .writeText(value)
    .then(() => toast.success(`${label} copiado`, { description: shortHash(value, 8) }))
    .catch(() => toast.error("Não foi possível copiar."));
}

function Blockchain() {
  const [walletConnected, setWalletConnected] = useState(true);

  const onchainCount = smartContracts.filter((c) => c.status !== "aguardando_assinatura").length;
  const escrowTotal = smartContracts.reduce((sum, c) => sum + c.escrowBRL, 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Blockchain"
        description="Contratos de locação como smart contracts: registro imutável, caução em escrow e liberação automática."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Contratos on-chain"
          value={String(onchainCount)}
          hint={`de ${smartContracts.length} registrados`}
          icon={Blocks}
          tone="success"
        />
        <KpiCard
          label="Caução em escrow"
          value={formatBRL(escrowTotal)}
          hint="Travada nos smart contracts"
          icon={Lock}
          tone="info"
        />
        <KpiCard
          label="Eventos registrados"
          value={String(onchainEvents.length)}
          hint="Últimos 90 dias"
          icon={Link2}
        />
        <KpiCard
          label="Custo médio por registro"
          value="R$ 0,04"
          hint="Gás na Polygon"
          icon={Landmark}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Carteira da plataforma</CardTitle>
            <p className="text-sm text-muted-foreground">
              Usada para publicar os contratos e pagar o gás das transações.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={cn(
                "rounded-xl border p-4",
                walletConnected ? "border-primary/30 bg-primary/5" : "border-dashed",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl",
                    walletConnected
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Wallet className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  {walletConnected ? (
                    <>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(platformWallet.address, "Endereço")}
                        className="inline-flex max-w-full items-center gap-1.5 font-mono text-sm font-medium hover:text-primary"
                        title="Copiar endereço"
                      >
                        <span className="truncate">{shortHash(platformWallet.address, 6)}</span>
                        <Copy className="h-3.5 w-3.5 shrink-0" />
                      </button>
                      <p className="text-xs text-muted-foreground">
                        {platformWallet.network} · {platformWallet.balancePol} POL
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma carteira conectada.</p>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant={walletConnected ? "outline" : "default"}
              className="w-full"
              onClick={() => {
                setWalletConnected((v) => !v);
                toast.success(walletConnected ? "Carteira desconectada" : "Carteira conectada", {
                  description: walletConnected ? undefined : platformWallet.network,
                });
              }}
            >
              {walletConnected ? "Desconectar carteira" : "Conectar carteira"}
            </Button>

            <div className="space-y-3 pt-2">
              {steps.map((s) => (
                <div key={s.title} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <s.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Eventos on-chain</CardTitle>
            <p className="text-sm text-muted-foreground">
              Toda movimentação relevante dos contratos gera uma transação auditável.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {onchainEvents.map((e) => {
                const Icon = eventIcons[e.type];
                return (
                  <li key={e.id} className="flex items-start gap-3 px-5 py-3.5">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{onchainEventLabel(e.type)}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {e.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(e.txHash, "Hash da transação")}
                        className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-primary"
                        title="Copiar hash da transação"
                      >
                        {shortHash(e.txHash, 8)}
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDateTime(e.at)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Smart contracts</CardTitle>
          <p className="text-sm text-muted-foreground">
            Um contrato por locação — clique no endereço para copiar.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Endereço do contrato</TableHead>
                  <TableHead>Rede</TableHead>
                  <TableHead className="text-right">Bloco</TableHead>
                  <TableHead className="text-right">Caução</TableHead>
                  <TableHead>Assinaturas</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {smartContracts.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      {getPropertyById(c.propertyId)?.name ?? c.propertyId}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(c.hash, "Endereço do contrato")}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary"
                        title="Copiar endereço"
                      >
                        {shortHash(c.hash, 5)}
                        <Copy className="h-3 w-3" />
                      </button>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.network}</TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      #{c.block.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {c.escrowBRL > 0 ? formatBRL(c.escrowBRL) : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.signers}/{c.totalSigners}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          chainStatusStyles[c.status],
                        )}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {chainStatusLabel(c.status)}
                      </span>
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
