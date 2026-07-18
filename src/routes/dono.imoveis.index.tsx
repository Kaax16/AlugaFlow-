import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PropertyCard } from "@/components/property/property-card";
import { addProperty, statusLabel, type Property, type PropertyStatus } from "@/data/properties";
import { usePropertiesList } from "@/hooks/use-properties";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dono/imoveis/")({
  head: () => ({
    meta: [
      { title: "Imóveis · Aluga+" },
      { name: "description", content: "Todos os imóveis sob sua gestão em Fortaleza." },
    ],
  }),
  component: ImoveisList,
});

type Filter = "todos" | PropertyStatus;
const filters: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "ocupado", label: "Ocupados" },
  { value: "disponivel", label: "Disponíveis" },
  { value: "manutencao", label: "Em manutenção" },
];

const OWNER_FALLBACK = {
  id: "owner-1",
  name: "Ricardo Albuquerque",
  email: "ricardo@alugaflow.app",
  phone: "(85) 99876-1122",
  avatarHue: 295,
} as const;

const HUES = [265, 285, 300, 315, 195, 155, 45];

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

interface DraftState {
  name: string;
  type: string;
  street: string;
  number: string;
  neighborhood: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  area: string;
  rent: string;
  description: string;
}

const emptyDraft: DraftState = {
  name: "",
  type: "Apartamento · 2 quartos",
  street: "",
  number: "",
  neighborhood: "",
  bedrooms: "2",
  bathrooms: "1",
  parking: "1",
  area: "60",
  rent: "2000",
  description: "",
};

function ImoveisList() {
  const properties = usePropertiesList();
  const [status, setStatus] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<DraftState>(emptyDraft);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return properties.filter((p) => {
      const matchStatus = status === "todos" || p.status === status;
      const matchQuery =
        !q ||
        [p.name, p.address.neighborhood, p.address.street].join(" ").toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [status, query, properties]);

  const update = (patch: Partial<DraftState>) => setDraft((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const now = new Date().toISOString();
    const rent = Number(draft.rent) || 0;
    const idSeed = slugify(draft.name) || `imovel-${Date.now()}`;
    const hue = HUES[Math.floor(Math.random() * HUES.length)];

    const owner = properties[0]?.owner ?? OWNER_FALLBACK;

    const property: Property = {
      id: `${idSeed}-${Date.now().toString(36)}`,
      name: draft.name.trim(),
      type: draft.type.trim(),
      status: "disponivel",
      address: {
        street: draft.street.trim(),
        number: draft.number.trim(),
        neighborhood: draft.neighborhood.trim() || "Fortaleza",
        city: "Fortaleza",
        state: "CE",
        zip: "60000-000",
      },
      // Um ponto genérico no centro de Fortaleza — o mapa vai mostrar o novo pin.
      coordinates: { lat: -3.7319, lng: -38.5267 },
      description:
        draft.description.trim() ||
        "Imóvel recém-cadastrado no Aluga+. Complete as informações no detalhamento.",
      area: Number(draft.area) || 0,
      bedrooms: Number(draft.bedrooms) || 0,
      bathrooms: Number(draft.bathrooms) || 0,
      parking: Number(draft.parking) || 0,
      createdAt: now,
      updatedAt: now,
      gallery: [
        {
          id: "g1",
          label: "Fachada",
          src: "",
          hue,
        },
      ],
      financial: {
        rent,
        condo: 0,
        iptu: 0,
        status: "pendente",
        lastPayment: now,
        nextDueDate: now,
      },
      history: [
        {
          id: `h-${Date.now()}`,
          type: "created",
          title: "Imóvel cadastrado",
          description: "Cadastro inicial pelo painel do proprietário.",
          date: now,
        },
      ],
      documents: [],
      chat: [],
      owner,
    };

    addProperty(property);
    toast.success(`"${property.name}" cadastrado no portfólio.`);
    setDraft(emptyDraft);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Meus imóveis"
        description="Todos os imóveis sob sua gestão em Fortaleza."
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95">
                <Plus className="h-4 w-4" />
                Novo imóvel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Cadastrar novo imóvel</DialogTitle>
                <DialogDescription>
                  Preencha as informações essenciais — você pode complementar depois na página do
                  imóvel.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nome" htmlFor="name">
                    <Input
                      id="name"
                      value={draft.name}
                      onChange={(e) => update({ name: e.target.value })}
                      placeholder="Ex.: Apto Jardim"
                      required
                    />
                  </Field>
                  <Field label="Tipo" htmlFor="type">
                    <Input
                      id="type"
                      value={draft.type}
                      onChange={(e) => update({ type: e.target.value })}
                      placeholder="Apartamento · 2 quartos"
                      required
                    />
                  </Field>
                  <Field label="Logradouro" htmlFor="street">
                    <Input
                      id="street"
                      value={draft.street}
                      onChange={(e) => update({ street: e.target.value })}
                      required
                    />
                  </Field>
                  <Field label="Número" htmlFor="number">
                    <Input
                      id="number"
                      value={draft.number}
                      onChange={(e) => update({ number: e.target.value })}
                      required
                    />
                  </Field>
                  <Field label="Bairro" htmlFor="neighborhood">
                    <Input
                      id="neighborhood"
                      value={draft.neighborhood}
                      onChange={(e) => update({ neighborhood: e.target.value })}
                      placeholder="Aldeota"
                    />
                  </Field>
                  <Field label="Aluguel mensal (R$)" htmlFor="rent">
                    <Input
                      id="rent"
                      type="number"
                      min={0}
                      value={draft.rent}
                      onChange={(e) => update({ rent: e.target.value })}
                      required
                    />
                  </Field>
                  <Field label="Área (m²)" htmlFor="area">
                    <Input
                      id="area"
                      type="number"
                      min={0}
                      value={draft.area}
                      onChange={(e) => update({ area: e.target.value })}
                    />
                  </Field>
                  <Field label="Quartos" htmlFor="bedrooms">
                    <Input
                      id="bedrooms"
                      type="number"
                      min={0}
                      value={draft.bedrooms}
                      onChange={(e) => update({ bedrooms: e.target.value })}
                    />
                  </Field>
                  <Field label="Banheiros" htmlFor="bathrooms">
                    <Input
                      id="bathrooms"
                      type="number"
                      min={0}
                      value={draft.bathrooms}
                      onChange={(e) => update({ bathrooms: e.target.value })}
                    />
                  </Field>
                  <Field label="Vagas" htmlFor="parking">
                    <Input
                      id="parking"
                      type="number"
                      min={0}
                      value={draft.parking}
                      onChange={(e) => update({ parking: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Descrição (opcional)" htmlFor="description">
                  <Textarea
                    id="description"
                    rows={3}
                    value={draft.description}
                    onChange={(e) => update({ description: e.target.value })}
                    placeholder="Detalhes do imóvel, diferenciais, entorno..."
                  />
                </Field>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95"
                  >
                    Cadastrar imóvel
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou bairro..."
            className="h-9 w-full rounded-lg border bg-muted/40 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:bg-background focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                status === f.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted/60",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="grid place-items-center rounded-2xl border border-dashed bg-muted/20 py-16 text-center text-sm text-muted-foreground">
          Nenhum imóvel encontrado
          {status !== "todos" ? ` com status "${statusLabel(status)}"` : ""}.
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="space-y-1.5">
      <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
