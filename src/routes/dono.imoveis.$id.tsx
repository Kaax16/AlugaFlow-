import { createFileRoute, notFound } from "@tanstack/react-router";
import { getPropertyById } from "@/data/properties";
import { PropertyHeader } from "@/components/property/property-header";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyInfo } from "@/components/property/property-info";
import { PropertyFinancial } from "@/components/property/property-financial";
import { PropertyContract } from "@/components/property/property-contract";
import { PropertyHistory } from "@/components/property/property-history";
import { PropertyDocuments } from "@/components/property/property-documents";
import { PropertyChat } from "@/components/property/property-chat";
import { PropertySidebar } from "@/components/property/property-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dono/imoveis/$id")({
  loader: ({ params }) => {
    const property = getPropertyById(params.id);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.property.name} · Aluga+`
          : "Imóvel não encontrado · Aluga+",
      },
      {
        name: "description",
        content: loaderData?.property.description ?? "Detalhes do imóvel gerenciado no Aluga+.",
      },
      ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
    ],
  }),
  component: PropertyDetails,
  errorComponent: ({ error, reset }) => (
    <Card className="mx-auto max-w-xl shadow-card">
      <CardContent className="space-y-4 p-8 text-center">
        <h1 className="text-xl font-semibold">Não foi possível carregar o imóvel</h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button onClick={reset} className="bg-gradient-primary text-primary-foreground">
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  ),
  notFoundComponent: () => (
    <Card className="mx-auto max-w-xl shadow-card">
      <CardContent className="space-y-4 p-8 text-center">
        <h1 className="text-xl font-semibold">Imóvel não encontrado</h1>
        <p className="text-sm text-muted-foreground">
          O imóvel que você procura pode ter sido removido ou nunca existiu.
        </p>
        <Button asChild className="bg-gradient-primary text-primary-foreground">
          <Link to="/dono/imoveis">Voltar para imóveis</Link>
        </Button>
      </CardContent>
    </Card>
  ),
});

function PropertyDetails() {
  const { property } = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <PropertyHeader property={property} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <PropertyGallery gallery={property.gallery} />

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="flex w-full justify-start gap-1 overflow-x-auto bg-muted/60 p-1">
              <TabsTrigger value="overview" className="shrink-0">
                Visão geral
              </TabsTrigger>
              <TabsTrigger value="financial" className="shrink-0">
                Financeiro
              </TabsTrigger>
              <TabsTrigger value="contract" className="shrink-0">
                Contrato
              </TabsTrigger>
              <TabsTrigger value="history" className="shrink-0">
                Histórico
              </TabsTrigger>
              <TabsTrigger value="documents" className="shrink-0">
                Documentos
              </TabsTrigger>
              <TabsTrigger value="chat" className="shrink-0">
                Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <PropertyInfo property={property} />
            </TabsContent>
            <TabsContent value="financial">
              <PropertyFinancial property={property} />
            </TabsContent>
            <TabsContent value="contract">
              <PropertyContract property={property} />
            </TabsContent>
            <TabsContent value="history">
              <PropertyHistory property={property} />
            </TabsContent>
            <TabsContent value="documents">
              <PropertyDocuments property={property} />
            </TabsContent>
            <TabsContent value="chat">
              <PropertyChat property={property} />
            </TabsContent>
          </Tabs>
        </div>

        <aside className="xl:sticky xl:top-20 xl:h-fit">
          <PropertySidebar property={property} />
        </aside>
      </div>
    </div>
  );
}
