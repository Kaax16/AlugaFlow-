import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, CheckCheck, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ChatMessage, Property } from "@/data/properties";
import { formatTime, initialsFromName } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  property: Property;
}

export function PropertyChat({ property }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(property.chat);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const newMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      authorId: property.owner.id,
      authorRole: "owner",
      text,
      sentAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, newMessage]);
    setDraft("");
  };

  const tenantName = property.tenant?.name ?? "Inquilino não vinculado";

  return (
    <Card className="flex h-[560px] flex-col shadow-card">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarFallback
              className="text-xs font-semibold text-primary-foreground"
              style={{
                background: `oklch(0.6 0.2 ${property.tenant?.avatarHue ?? 295})`,
              }}
            >
              {property.tenant ? initialsFromName(property.tenant.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">{tenantName}</CardTitle>
            <p className="text-xs text-muted-foreground">
              Conversa exclusiva deste imóvel · {property.name}
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Online
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-0">
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gradient-subtle p-4">
          {messages.length === 0 ? (
            <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
              Nenhuma mensagem ainda.
              <br />
              Envie a primeira mensagem para começar a conversa.
            </div>
          ) : (
            messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t bg-card p-3">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Escreva para ${property.tenant?.name.split(" ")[0] ?? "o inquilino"}...`}
            className="min-h-11 resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as FormEvent);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!draft.trim() || !property.tenant}
            className="h-11 w-11 shrink-0 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95"
            aria-label="Enviar mensagem"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isOwner = message.authorRole === "owner";
  return (
    <div className={cn("flex", isOwner ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
          isOwner
            ? "rounded-br-sm bg-gradient-primary text-primary-foreground"
            : "rounded-bl-sm border bg-card text-card-foreground",
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        <div
          className={cn(
            "mt-1 flex items-center justify-end gap-1 text-[10px]",
            isOwner ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          <span>{formatTime(message.sentAt)}</span>
          {isOwner ? (
            message.read ? (
              <CheckCheck className="h-3 w-3" />
            ) : (
              <Check className="h-3 w-3" />
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
