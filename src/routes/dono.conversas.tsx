import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { properties } from "@/data/properties";
import { formatDateTime, initialsFromName } from "@/lib/format";

export const Route = createFileRoute("/dono/conversas")({
  head: () => ({ meta: [{ title: "Conversas · AlugaFlow" }] }),
  component: Conversas,
});

function Conversas() {
  const conversations = properties
    .filter((p) => p.tenant)
    .map((p) => ({
      property: p,
      last: p.chat[p.chat.length - 1],
      unread: p.chat.filter((m) => m.authorRole === "tenant" && !m.read).length,
    }))
    .sort((a, b) => {
      const ta = a.last ? new Date(a.last.sentAt).getTime() : 0;
      const tb = b.last ? new Date(b.last.sentAt).getTime() : 0;
      return tb - ta;
    });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Conversas"
        description="Cada imóvel tem seu próprio canal de mensagens com o inquilino."
      />
      <Card className="shadow-card">
        <CardContent className="p-0">
          <ul className="divide-y">
            {conversations.map(({ property, last, unread }) => (
              <li key={property.id}>
                <Link
                  to="/dono/imoveis/$id"
                  params={{ id: property.id }}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
                >
                  <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                    <AvatarFallback
                      className="text-xs font-semibold text-primary-foreground"
                      style={{ background: `oklch(0.6 0.2 ${property.tenant!.avatarHue})` }}
                    >
                      {initialsFromName(property.tenant!.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate font-medium">
                        {property.tenant!.name}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          · {property.name}
                        </span>
                      </p>
                      {last ? (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDateTime(last.sentAt)}
                        </span>
                      ) : null}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {last?.text ?? "Sem mensagens ainda."}
                    </p>
                  </div>
                  {unread > 0 ? (
                    <span className="grid h-6 min-w-6 place-items-center rounded-full bg-gradient-primary px-2 text-[11px] font-semibold text-primary-foreground shadow-elegant">
                      {unread}
                    </span>
                  ) : (
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
