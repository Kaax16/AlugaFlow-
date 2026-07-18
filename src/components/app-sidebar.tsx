import { Link, useRouterState } from "@tanstack/react-router";
import {
  FileText,
  LayoutDashboard,
  MapPinned,
  MessageSquare,
  Home,
  Wallet,
  Wrench,
  FolderOpen,
} from "lucide-react";
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
import { BrandLogo } from "@/components/brand-logo";
import { properties } from "@/data/properties";

type NavItem = {
  title: string;
  url: string;
  icon: typeof Home;
  badge?: number;
};

const items: NavItem[] = [
  { title: "Visão geral", url: "/dono/visao-geral", icon: LayoutDashboard },
  { title: "Imóveis", url: "/dono/imoveis", icon: Home },
  { title: "Mapa", url: "/dono/mapa", icon: MapPinned },
  { title: "Financeiro", url: "/dono/financeiro", icon: Wallet, badge: 1 },
  { title: "Contratos", url: "/dono/contratos", icon: FileText },
  { title: "Manutenção", url: "/dono/manutencao", icon: Wrench, badge: 2 },
  { title: "Documentos", url: "/dono/documentos", icon: FolderOpen },
  { title: "Conversas", url: "/dono/conversas", icon: MessageSquare },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const owner = properties[0]?.owner;

  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dono/visao-geral" className="flex items-center gap-2.5 px-1 py-2">
          {collapsed ? (
            <BrandLogo className="h-9 w-9" />
          ) : (
            <div className="flex min-w-0 flex-col gap-0.5">
              <img
                src="/logo-trim.png"
                alt="Aluga+"
                className="h-7 w-auto max-w-[150px] object-contain object-left"
              />
              <span className="pl-0.5 text-[11px] text-muted-foreground">Gestão de imóveis</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Painel do proprietário</SidebarGroupLabel>
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
        {owner ? (
          <div className="flex items-center gap-3 px-1 py-2">
            <Avatar className="h-9 w-9 shrink-0 ring-2 ring-primary/20">
              <AvatarFallback
                className="text-xs font-semibold text-primary-foreground"
                style={{ background: `oklch(0.6 0.2 ${owner.avatarHue})` }}
              >
                {owner.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium">{owner.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">Proprietário</p>
              </div>
            )}
          </div>
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
