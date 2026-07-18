import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bot, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatbotNodes, type BotOption } from "@/data/chatbot";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
}

/**
 * Assistente guiado sem IA: um fluxo de opções clicáveis (árvore de decisão).
 * Flutua em todas as telas do painel do proprietário.
 */
export function ChatbotWidget() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [nodeId, setNodeId] = useState("inicio");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const nextId = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const node = chatbotNodes[nodeId] ?? chatbotNodes.inicio;

  const pushBotMessages = (texts: string[]) => {
    setTyping(true);
    texts.forEach((text, i) => {
      const timer = window.setTimeout(
        () => {
          setMessages((prev) => [...prev, { id: nextId.current++, from: "bot", text }]);
          if (i === texts.length - 1) setTyping(false);
        },
        450 * (i + 1),
      );
      timers.current.push(timer);
    });
  };

  // Mensagem de boas-vindas na primeira abertura.
  useEffect(() => {
    if (open && messages.length === 0) {
      pushBotMessages(chatbotNodes.inicio.messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Limpa os timers pendentes ao desmontar.
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  // Rola para a última mensagem.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const choose = (option: BotOption) => {
    if (typing) return;
    setMessages((prev) => [...prev, { id: nextId.current++, from: "user", text: option.label }]);
    setNodeId(option.next);
    const target = chatbotNodes[option.next];
    if (target) pushBotMessages(target.messages);
    if (option.to) navigate({ to: option.to });
  };

  const restart = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setMessages([]);
    setTyping(false);
    setNodeId("inicio");
    pushBotMessages(chatbotNodes.inicio.messages);
  };

  return (
    <>
      {open ? (
        <div
          role="dialog"
          aria-label="Assistente Aluga+"
          className="fixed bottom-24 right-4 z-50 flex max-h-[min(34rem,calc(100dvh-8rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border bg-card shadow-elegant"
        >
          <div className="flex items-center gap-3 border-b bg-gradient-primary px-4 py-3 text-primary-foreground">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
              <Bot className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-sm font-semibold">Assistente Aluga+</p>
              <p className="text-[11px] opacity-85">Respostas guiadas · sem IA, sem espera</p>
            </div>
            <button
              type="button"
              onClick={restart}
              aria-label="Recomeçar conversa"
              className="grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-white/15"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar assistente"
              className="grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-white/15"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                  m.from === "bot"
                    ? "rounded-bl-sm bg-muted text-foreground"
                    : "ml-auto rounded-br-sm bg-primary text-primary-foreground",
                )}
              >
                {m.text}
              </div>
            ))}
            {typing ? (
              <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
              </div>
            ) : null}
          </div>

          {!typing ? (
            <div className="flex flex-wrap gap-2 border-t p-3">
              {node.options.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => choose(o)}
                  className="rounded-full border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  {o.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <Button
        size="icon"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar assistente" : "Abrir assistente"}
        className="fixed bottom-6 right-4 z-50 h-13 w-13 rounded-full shadow-elegant transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>
    </>
  );
}
