import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ChevronsUpDown,
  FileText,
  FolderOpen,
  Home,
  LayoutDashboard,
  LogOut,
  MapPinned,
  MessageSquare,
  Receipt,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { logout as signOut, useSession } from "@/data/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrandLogo } from "@/components/brand-logo";
import { getTenantSession } from "@/data/session";

type NavItem = {
  title: string;
  url: string;
  icon: typeof Home;
  badge?: number;
};

export function InquilinoSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const session = useSession();
  const { tenant, property } = getTenantSession();
  const displayName = session?.displayName ?? tenant.name;
  const displayEmail = session?.email ?? tenant.email;

  const handleLogout = () => {
    signOut();
    toast.success("Você saiu do painel.");
    navigate({ to: "/", replace: true });
  };

  const unread = property.chat.filter((m) => m.authorRole === "owner" && !m.read).length;
  const paymentAlert =
    property.financial.status === "atrasado" || property.financial.status === "pendente" ? 1 : 0;

  const items: NavItem[] = [
    { title: "Visão geral", url: "/inquilino/visao-geral", icon: LayoutDashboard },
    { title: "Meu imóvel", url: "/inquilino/meu-imovel", icon: Home },
    { title: "Proximidades", url: "/inquilino/proximidades", icon: MapPinned },
    {
      title: "Financeiro",
      url: "/inquilino/financeiro",
      icon: Receipt,
      badge: paymentAlert || undefined,
    },
    { title: "Contrato", url: "/inquilino/contrato", icon: FileText },
    { title: "Manutenção", url: "/inquilino/manutencao", icon: Wrench },
    { title: "Documentos", url: "/inquilino/documentos", icon: FolderOpen },
    {
      title: "Conversas",
      url: "/inquilino/conversas",
      icon: MessageSquare,
      badge: unread || undefined,
    },
  ];

  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/inquilino/visao-geral" className="flex items-center gap-2.5 px-1 py-2">
          {collapsed ? (
            <BrandLogo className="h-9 w-9" />
          ) : (
            <div className="flex min-w-0 flex-col gap-0.5">
              <img
                src="/logo-trim.png"
                alt="Aluga+"
                className="h-7 w-auto max-w-[150px] object-contain object-left"
              />
              <span className="pl-0.5 text-[11px] text-muted-foreground">Painel do inquilino</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Minha locação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="sidebar-nav-link">
                      <item.icon />
                      <span>{item.title}</span>
                      {item.badge && !collapsed ? (
                        <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-destructive-foreground">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Menu do usuário"
            >
              <Avatar className="h-9 w-9 shrink-0 ring-2 ring-primary/20">
                <AvatarFallback
                  className="text-xs font-semibold text-primary-foreground"
                  style={{ background: `oklch(0.6 0.2 ${tenant.avatarHue})` }}
                >
                  {displayName
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate text-sm font-medium">{displayName}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{displayEmail}</p>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Sessão de inquilino
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
