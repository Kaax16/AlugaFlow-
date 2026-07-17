import type { LucideIcon } from "lucide-react";
import {
  Building2,
  DollarSign,
  FileText,
  LogIn,
  LogOut,
  Pencil,
  RefreshCw,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HistoryEvent, Property } from "@/data/properties";
import { formatDateTime } from "@/lib/format";

const eventStyles: Record<HistoryEvent["type"], { icon: LucideIcon; tone: string }> = {
  created: { icon: Building2, tone: "bg-primary/15 text-primary" },
  updated: { icon: Pencil, tone: "bg-info/15 text-info" },
  status: { icon: RefreshCw, tone: "bg-accent text-accent-foreground" },
  tenant_in: { icon: LogIn, tone: "bg-success/15 text-success" },
  tenant_out: { icon: LogOut, tone: "bg-destructive/15 text-destructive" },
  maintenance: { icon: Wrench, tone: "bg-warning/20 text-warning-foreground dark:text-warning" },
  payment: { icon: DollarSign, tone: "bg-success/15 text-success" },
  document: { icon: FileText, tone: "bg-info/15 text-info" },
};

interface Props {
  property: Property;
}

export function PropertyHistory({ property }: Props) {
  const events = [...property.history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Histórico do imóvel</CardTitle>
        <p className="text-sm text-muted-foreground">Linha do tempo de eventos e movimentações.</p>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-6 border-l pl-6">
          {events.map((event) => {
            const style = eventStyles[event.type];
            const Icon = style.icon;
            return (
              <li key={event.id} className="relative">
                <span
                  className={`absolute -left-[35px] grid h-7 w-7 place-items-center rounded-full ring-4 ring-background ${style.tone}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{event.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(event.date)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
