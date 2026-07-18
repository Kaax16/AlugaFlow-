import { Link } from "@tanstack/react-router";
import { Bell, ChevronLeft, Moon, Sun } from "lucide-react";
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
import { getTenantSession } from "@/data/session";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function InquilinoHeader() {
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar, state } = useSidebar();
  const { property } = getTenantSession();

  const financialAlert = property.financial.status !== "em_dia";
  const chatUnread = property.chat.filter((m) => m.authorRole === "owner" && !m.read).length;
  const notifications = financialAlert ? 1 : 0;
  const totalAlerts = notifications + chatUnread;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background px-3 sm:px-6">
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

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{property.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {property.address.neighborhood} · {property.address.city}/{property.address.state}
          </p>
        </div>
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
            {totalAlerts > 0 ? (
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-semibold text-destructive-foreground">
                {totalAlerts}
              </span>
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notificações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {totalAlerts === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              Sem novidades — está tudo em dia 🎉
            </p>
          ) : (
            <>
              {financialAlert ? (
                <DropdownMenuItem asChild>
                  <Link to="/inquilino/financeiro" className="flex items-start gap-2">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {property.financial.status === "atrasado"
                          ? "Aluguel em atraso"
                          : "Aluguel pendente"}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        Venc. {formatDate(property.financial.nextDueDate)}
                      </span>
                    </span>
                    <StatusBadge status={property.financial.status} />
                  </Link>
                </DropdownMenuItem>
              ) : null}
              {chatUnread > 0 ? (
                <DropdownMenuItem asChild>
                  <Link to="/inquilino/conversas" className="flex items-start gap-2">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {chatUnread} nova{chatUnread > 1 ? "s" : ""} mensage
                        {chatUnread > 1 ? "ns" : "m"}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        De {property.owner.name}
                      </span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              ) : null}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
