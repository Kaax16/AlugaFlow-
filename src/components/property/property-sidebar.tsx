import { CalendarDays, FileText, Mail, MessageSquare, Phone, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import type { Property } from "@/data/properties";
import { formatDate, initialsFromName } from "@/lib/format";

interface Props {
  property: Property;
}

export function PropertySidebar({ property }: Props) {
  const paymentsCount = property.history.filter((h) => h.type === "payment").length;
  const maintenanceCount = property.history.filter((h) => h.type === "maintenance").length;

  return (
    <div className="space-y-6">
      <PersonCard
        title="Proprietário"
        name={property.owner.name}
        email={property.owner.email}
        phone={property.owner.phone}
        hue={property.owner.avatarHue}
      />

      {property.tenant ? (
        <PersonCard
          title="Inquilino"
          name={property.tenant.name}
          email={property.tenant.email}
          phone={property.tenant.phone}
          hue={property.tenant.avatarHue}
        />
      ) : (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm">Inquilino</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Este imóvel está disponível para locação.
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm">Estatísticas do imóvel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <StatusBadge status={property.status} />
          </div>
          <Separator />
          <StatRow icon={FileText} label="Documentos" value={property.documents.length} />
          <StatRow icon={MessageSquare} label="Mensagens" value={property.chat.length} />
          <StatRow icon={Wrench} label="Manutenções" value={maintenanceCount} />
          <StatRow icon={CalendarDays} label="Pagamentos" value={paymentsCount} />
          <Separator />
          <div className="grid gap-1 text-xs text-muted-foreground">
            <span>Criado em {formatDate(property.createdAt)}</span>
            <span>Atualizado em {formatDate(property.updatedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PersonCard({
  title,
  name,
  email,
  phone,
  hue,
}: {
  title: string;
  name: string;
  email: string;
  phone: string;
  hue: number;
}) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
            <AvatarFallback
              className="text-sm font-semibold text-primary-foreground"
              style={{ background: `oklch(0.6 0.2 ${hue})` }}
            >
              {initialsFromName(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{email}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="flex-1 gap-1.5">
            <a href={`tel:${phone.replace(/\D/g, "")}`}>
              <Phone className="h-3.5 w-3.5" />
              Ligar
            </a>
          </Button>
          <Button asChild size="sm" variant="outline" className="flex-1 gap-1.5">
            <a href={`mailto:${email}`}>
              <Mail className="h-3.5 w-3.5" />
              E-mail
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
