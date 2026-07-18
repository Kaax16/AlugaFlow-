import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, KeyRound, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { login, useSession, type Role } from "@/data/auth";
import { getTenantSession } from "@/data/session";
import { properties } from "@/data/properties";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entrar · Aluga+" },
      {
        name: "description",
        content:
          "Faça login no Aluga+ como proprietário para gerir imóveis ou como inquilino para acompanhar sua locação.",
      },
    ],
  }),
  component: LoginPage,
});

const DEMO = {
  owner: {
    email: "ricardo@alugaflow.app",
    displayName: () => properties[0]?.owner.name ?? "Proprietário",
  },
  tenant: {
    email: "marina.nogueira@email.com",
    displayName: () => safeTenantName(),
  },
} as const;

function LoginPage() {
  const navigate = useNavigate();
  const session = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState<Role | null>(null);

  useEffect(() => {
    if (session) {
      navigate({
        to: session.role === "owner" ? "/dono/visao-geral" : "/inquilino/visao-geral",
        replace: true,
      });
    }
  }, [session, navigate]);

  const doLogin = (role: Role) => {
    const cleanEmail = email.trim() || DEMO[role].email;
    const displayName = DEMO[role].displayName();
    login({ role, email: cleanEmail, displayName });
    toast.success(`Bem-vindo(a), ${displayName.split(" ")[0]}!`);
    navigate({
      to: role === "owner" ? "/dono/visao-geral" : "/inquilino/visao-geral",
      replace: true,
    });
  };

  const submitAs = (role: Role) => {
    if (submitting) return;
    setSubmitting(role);
    setTimeout(() => {
      doLogin(role);
      setSubmitting(null);
    }, 200);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitAs("owner");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-70" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-info/25 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:py-16">
        <section className="flex flex-col justify-center gap-8">
          <div className="flex items-center gap-3">
            <img src="/logo-trim.png" alt="Aluga+" className="h-9 w-auto object-contain" />
            <span className="rounded-full border bg-card/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur">
              Beta demo
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Gestão de aluguel,{" "}
              <span className="text-gradient-primary">simples para os dois lados</span>.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground">
              Um painel para o proprietário organizar contratos, financeiro e conversas — e outro
              para o inquilino acompanhar a locação, boletos e o bairro em tempo real.
            </p>
          </div>
        </section>

        <section className="relative">
          <div className="relative overflow-hidden rounded-3xl border bg-card/95 p-6 shadow-elegant backdrop-blur sm:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-primary" />

            <div className="mb-6 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Entrar no Aluga+
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">Bem-vindo(a) de volta</h2>
              <p className="text-sm text-muted-foreground">
                Informe seus dados e escolha por qual painel entrar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="E-mail (opcional)" htmlFor="email" icon={<Mail className="h-4 w-4" />}>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                />
              </Field>
              <Field
                label="Senha (opcional)"
                htmlFor="password"
                icon={<Lock className="h-4 w-4" />}
              >
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </Field>

              <p className="text-[11px] text-muted-foreground">
                É uma demonstração: os botões abaixo entram direto, sem precisar preencher os
                campos.
              </p>

              <div className="grid gap-2 pt-1 sm:grid-cols-2">
                <Button
                  type="submit"
                  disabled={submitting !== null}
                  className="h-11 gap-2 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95"
                >
                  <Building2 className="h-4 w-4" />
                  {submitting === "owner" ? "Entrando..." : "Entrar como proprietário"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={submitting !== null}
                  onClick={() => submitAs("tenant")}
                  className="h-11 gap-2 border-info/40 bg-info/5 text-info hover:bg-info/10 hover:text-info"
                >
                  <KeyRound className="h-4 w-4" />
                  {submitting === "tenant" ? "Entrando..." : "Entrar como inquilino"}
                </Button>
              </div>
            </form>

            <p className="mt-6 border-t pt-4 text-center text-[11px] text-muted-foreground">
              Sem cadastro — nenhum dado é enviado para servidores externos.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  icon,
  children,
}: {
  label: string;
  htmlFor: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function safeTenantName(): string {
  try {
    return getTenantSession().tenant.name;
  } catch {
    return "Inquilino";
  }
}
