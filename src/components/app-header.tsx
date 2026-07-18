import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, ChevronLeft, Moon, Search, Sun } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/status-badge";
import { AccessibilityMenu } from "@/components/accessibility-menu";
import { useTheme } from "@/components/theme-provider";
import { properties } from "@/data/properties";
import { formatStreetLine } from "@/lib/address";
import { cn } from "@/lib/utils";

// Alertas derivados dos dados: aluguéis fora de "em dia".
const alerts = properties.filter((p) => p.financial.status !== "em_dia");

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar, state } = useSidebar();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return properties
      .filter((p) =>
        [p.name, p.address.neighborhood, p.address.street, p.tenant?.name ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 6);
  }, [query]);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background px-3 sm:px-6">
      {/* Gatilho da sidebar com seta (aponta para o lado que vai abrir/fechar). */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={toggleSidebar}
        aria-label={state === "collapsed" ? "Expandir menu" : "Recolher menu"}
      >
        <ChevronLeft
          className={cn("h-4 w-4 transition-transform", state === "collapsed" && "rotate-180")}
        />
      </Button>
      <Separator orientation="vertical" className="mx-1 h-5" />

      {/* Busca funcional: filtra imóveis e leva ao detalhe. */}
      <div className="relative flex-1">
        <div className="relative hidden max-w-md items-center md:flex">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar imóveis, bairros ou inquilinos..."
            className="h-9 w-full rounded-lg border bg-muted/40 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:bg-background focus:ring-2 focus:ring-ring/30"
          />
        </div>
        {results.length > 0 ? (
          <ul className="absolute left-0 top-11 z-30 hidden w-full max-w-md overflow-hidden rounded-xl border bg-popover shadow-elegant md:block">
            {results.map((p) => (
              <li key={p.id}>
                <Link
                  to="/dono/imoveis/$id"
                  params={{ id: p.id }}
                  onClick={() => setQuery("")}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{p.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {formatStreetLine(p.address)}
                    </span>
                  </span>
                  <StatusBadge status={p.status} />
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <AccessibilityMenu />

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
        title="Alternar tema"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
            <Bell className="h-4 w-4" />
            {alerts.length > 0 ? (
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-semibold text-destructive-foreground">
                {alerts.length}
              </span>
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notificações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {alerts.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              Tudo em dia por aqui 🎉
            </p>
          ) : (
            alerts.map((p) => (
              <DropdownMenuItem key={p.id} asChild>
                <Link
                  to="/dono/imoveis/$id"
                  params={{ id: p.id }}
                  className="flex items-start gap-2"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{p.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      Aluguel {p.financial.status === "atrasado" ? "atrasado" : "pendente"} ·{" "}
                      {p.tenant?.name ?? "sem inquilino"}
                    </span>
                  </span>
                  <StatusBadge status={p.financial.status} />
                </Link>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
