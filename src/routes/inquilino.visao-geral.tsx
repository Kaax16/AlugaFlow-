import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  FileSignature,
  Mail,
  MessageSquare,
  Phone,
  Wallet,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getTenantSession } from "@/data/session";
import { daysBetween, formatBRL, formatDate, initialsFromName } from "@/lib/format";

export const Route = createFileRoute("/inquilino/visao-geral")({
  head: () => ({
    meta: [
      { title: "Painel do inquilino · Aluga+" },
      {
        name: "description",
        content: "Acompanhe seu aluguel, contrato e comunicação com o proprietário.",
      },
    ],
  }),
  component: InquilinoVisaoGeral,
});

function InquilinoVisaoGeral() {
  const { tenant, property } = getTenantSession();
  const { financial, contract, owner } = property;
  const totalMensal = financial.rent + financial.condo + financial.iptu;
  const now = new Date().toISOString();
  const daysLeftContract = contract ? daysBetween(now, contract.endDate) : null;
  const daysToDue = daysBetween(now, financial.nextDueDate);
  const chatUnread = property.chat.filter((m) => m.authorRole === "owner" && !m.read).length;

  const paymentTone: React.ComponentProps<typeof KpiCard>["tone"] =
    financial.status === "em_dia"
      ? "success"
      : financial.status === "atrasado"
        ? "destructive"
        : "warning";

  return (
    <div className="space-y-6">
      <SectionHeader
        title={`Olá, ${tenant.name.split(" ")[0]} 👋`}
        description={`Este é o resumo da sua locação em ${property.name}.`}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Aluguel do mês"
          value={formatBRL(financial.rent)}
          hint={`Total com encargos: ${formatBRL(totalMensal)}`}
          icon={Wallet}
          tone="default"
        />
        <KpiCard
          label="Próximo vencimento"
          value={formatDate(financial.nextDueDate)}
          hint={
            daysToDue >= 0
              ? `Em ${daysToDue} dia${daysToDue === 1 ? "" : "s"}`
              : `${Math.abs(daysToDue)} dia${Math.abs(daysToDue) === 1 ? "" : "s"} de atraso`
          }
          icon={CalendarClock}
          tone={paymentTone}
        />
        <KpiCard
          label="Contrato vigente"
          value={daysLeftContract !== null ? `${daysLeftContract} dias` : "Sem contrato"}
          hint={contract ? `Encerra em ${formatDate(contract.endDate)}` : undefined}
          icon={FileSignature}
          tone="info"
        />
        <KpiCard
          label="Mensagens não lidas"
          value={String(chatUnread)}
          hint={chatUnread > 0 ? "Do proprietário" : "Nenhuma pendente"}
          icon={MessageSquare}
          tone={chatUnread > 0 ? "warning" : "success"}
        />
      </div>

      {financial.status !== "em_dia" ? (
        <Card className="border-destructive/40 bg-destructive/5 shadow-card">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">
              {financial.status === "atrasado" ? "Aluguel em atraso" : "Aluguel pendente"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div>
              <p className="font-medium text-foreground">
                {formatBRL(financial.rent)} vence em {formatDate(financial.nextDueDate)}.
              </p>
              <p className="text-muted-foreground">
                Regularize pelo painel ou fale com o proprietário para combinar novo prazo.
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95"
            >
              <Link to="/inquilino/financeiro">Ver financeiro</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle>Meu imóvel</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {property.type} · {property.address.neighborhood}
              </p>
            </div>
            <StatusBadge status={property.status} />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-muted/20 p-4 text-sm">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Endereço
              </p>
              <p className="mt-1 font-medium">
                {property.address.street}, {property.address.number}
                {property.address.complement ? ` — ${property.address.complement}` : ""}
              </p>
              <p className="text-muted-foreground">
                {property.address.neighborhood}, {property.address.city}/{property.address.state}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <StatCell label="Área" value={`${property.area} m²`} />
              <StatCell label="Quartos" value={String(property.bedrooms)} />
              <StatCell label="Vagas" value={String(property.parking)} />
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/inquilino/meu-imovel">Ver detalhes do imóvel</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Proprietário</CardTitle>
            <p className="text-sm text-muted-foreground">Fale diretamente pelo canal do imóvel.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarFallback
                  className="text-sm font-semibold text-primary-foreground"
                  style={{ background: `oklch(0.6 0.2 ${owner.avatarHue})` }}
                >
                  {initialsFromName(owner.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-semibold">{owner.name}</p>
                <p className="text-xs text-muted-foreground">Proprietário</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <a
                className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2 transition-colors hover:bg-muted"
                href={`tel:${owner.phone.replace(/\D/g, "")}`}
              >
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{owner.phone}</span>
              </a>
              <a
                className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2 transition-colors hover:bg-muted"
                href={`mailto:${owner.email}`}
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{owner.email}</span>
              </a>
            </div>
            <Button
              asChild
              className="w-full gap-2 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95"
            >
              <Link to="/inquilino/conversas">
                <MessageSquare className="h-4 w-4" />
                Abrir conversa
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Últimas movimentações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {property.history
            .slice(-4)
            .reverse()
            .map((event) => (
              <div
                key={event.id}
                className="flex items-start justify-between gap-3 border-b pb-3 last:border-b-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(event.date)}
                </span>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-muted/20 p-3">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
