import { useEffect } from "react";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { useSession } from "@/data/auth";

export const Route = createFileRoute("/dono")({
  component: DonoLayout,
});

function DonoLayout() {
  const session = useSession();
  const navigate = useNavigate();

  // Guard client-side: sem sessão de proprietário, volta para o login.
  useEffect(() => {
    if (!session || session.role !== "owner") {
      navigate({ to: "/", replace: true });
    }
  }, [session, navigate]);

  if (!session || session.role !== "owner") return null;

  // Estrutura canônica do shadcn: o SidebarProvider é o flex-row; a sidebar e o
  // conteúdo são irmãos diretos, então o conteúdo reflui ao recolher o menu.
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* min-w-0 deixa o conteúdo encolher junto com a área (sem forçar scroll
          horizontal quando a sidebar recolhe/expande). */}
      <SidebarInset className="min-w-0">
        <AppHeader />
        <main className="min-w-0 flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
