import { useEffect } from "react";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { InquilinoSidebar } from "@/components/inquilino-sidebar";
import { InquilinoHeader } from "@/components/inquilino-header";
import { useSession } from "@/data/auth";

export const Route = createFileRoute("/inquilino")({
  component: InquilinoLayout,
});

function InquilinoLayout() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || session.role !== "tenant") {
      navigate({ to: "/", replace: true });
    }
  }, [session, navigate]);

  if (!session || session.role !== "tenant") return null;

  return (
    <SidebarProvider>
      <InquilinoSidebar />
      <SidebarInset className="min-w-0">
        <InquilinoHeader />
        <main className="min-w-0 flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
