import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

// Aplica o tema salvo antes da primeira pintura, evitando "flash" de cor.
const themeInit = `(function(){try{var t=localStorage.getItem("alugaflow-theme")||"light";var c=localStorage.getItem("alugaflow-colorblind")==="true";document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.dataset.colorblind=c;}catch(e){}})();`;

function NotFoundComponent() {
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-hero px-4">
      <div className="max-w-md text-center">
        <p className="text-6xl font-bold text-gradient-primary">404</p>
        <h1 className="mt-4 text-xl font-semibold">Página não encontrada</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O endereço que você tentou acessar não existe ou foi movido.
        </p>
        <div className="mt-6">
          <Link
            to="/dono/visao-geral"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition-opacity hover:opacity-95"
          >
            Voltar ao painel
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Não foi possível carregar esta página. Tente novamente.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-95"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Ir para o início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AlugaFlow — Gestão premium de imóveis alugados" },
      {
        name: "description",
        content:
          "AlugaFlow é a plataforma SaaS que centraliza contratos, financeiro, manutenção e comunicação dos seus imóveis alugados.",
      },
      { name: "author", content: "AlugaFlow" },
      { property: "og:title", content: "AlugaFlow — Gestão premium de imóveis alugados" },
      {
        property: "og:description",
        content:
          "Centralize contratos, financeiro e conversas com inquilinos em uma experiência moderna e sofisticada.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Outlet />
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
