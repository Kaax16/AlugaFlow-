# AlugaFlow

Plataforma de gestão de imóveis para proprietários no Nordeste do Brasil. Proptech SaaS focada em simplificar a administração de aluguéis, financeiro, contratos e relacionamento proprietário-inquilino.

**Link apresentação:** https://www.canva.com/design/DAHPsIyMlWo/rhm5Ko_33yVnYZuLABi6-g/edit

## Contexto de Mercado

O segmento de Proptechs no Brasil cresce rapidamente: cerca de 1.200 startups operam em gestão e comercialização imobiliária, com captação estimada em R$ 4,1 bilhões entre 2022-2025. Entretanto, nenhuma solução relevante atende a região Norte/Nordeste. A AlugaFlow nasce para preencher essa lacuna, com foco inicial em Fortaleza — a capital mais rica do Nordeste.

O modelo de receita segue o SaaS B2B por assinatura (mensalidade por usuário), com unit economics que visam LTV/CAC >= 4:1 e payback em 12-24 meses. Margens brutas típicas do segmento ficam acima de 70-80%, com churn mensal abaixo de 2%.

## Funcionalidades

- **Visão geral** — Dashboard com KPIs (receita do mês, aluguéis atrasados, lucro líquido, taxa de ocupação), gráficos de evolução de receita (Highcharts) e alertas.
- **Mapa dos imóveis** — Visualização geográfica do portfólio com MapLibre GL e OpenStreetMap, filtros por status e seleção interativa.
- **Financeiro** — Acompanhamento de aluguel, condomínio e IPTU por imóvel, com filtros por status de pagamento (em dia, pendente, atrasado).
- **Imóveis** — Detalhe completo de cada imóvel: galeria de fotos, informações, histórico, documentos e chat.
- **Chat proprietário-inquilino** — Canal de mensagens exclusivo por imóvel, com status de leitura.
- **Contratos** — Visualização de contratos ativos com datas, valores e inquilinos vinculados.
- **Documentos** — Repositório centralizado de contratos, vistorias, IPTU e comprovantes, com filtros por tipo.
- **Manutenção** — Registro de chamados abertos e histórico de manutenções por imóvel.
- **Gestão de unidades** — Suporte a edifícios com múltiplas unidades (apartamentos), cada uma com contrato e status próprio.

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (SSR + file-based routing) |
| UI | React 19, [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind CSS v4) |
| Gráficos | [Highcharts](https://www.highcharts.com/) |
| Mapas | [MapLibre GL JS](https://maplibre.org/) + OpenStreetMap |
| Formulários | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Estado | [TanStack React Query](https://tanstack.com/query) |
| Build | [Vite 8](https://vite.dev/), TypeScript 5.8 |
| Estilo | [Tailwind CSS v4](https://tailwindcss.com/), [tw-animate-css](https://github.com/7ulabs/tw-animate-css) |
| Deploy | [Lovable](https://lovable.dev) |

## Estrutura do Projeto

```
src/
├── components/
│   ├── property/        # Componentes de detalhe do imóvel
│   │   ├── property-card.tsx
│   │   ├── property-chat.tsx
│   │   ├── property-contract.tsx
│   │   ├── property-documents.tsx
│   │   ├── property-financial.tsx
│   │   ├── property-gallery.tsx
│   │   ├── property-header.tsx
│   │   ├── property-history.tsx
│   │   ├── property-image.tsx
│   │   ├── property-info.tsx
│   │   ├── property-map.tsx
│   │   └── property-sidebar.tsx
│   ├── ui/              # Componentes shadcn/ui
│   ├── analytics-chart.tsx
│   ├── app-header.tsx
│   ├── app-sidebar.tsx
│   ├── brand-logo.tsx
│   ├── chart.tsx
│   ├── kpi-card.tsx
│   ├── section-header.tsx
│   └── status-badge.tsx
├── data/
│   └── properties.ts    # Mock data e tipos do domínio
├── hooks/               # Hooks customizados
├── lib/                 # Utilitários (format, address, utils)
├── routes/              # Páginas (file-based routing)
│   ├── dono.tsx         # Layout principal do painel
│   ├── dono.visao-geral.tsx
│   ├── dono.mapa.tsx
│   ├── dono.imoveis.tsx
│   ├── dono.imoveis.$id.tsx
│   ├── dono.financeiro.tsx
│   ├── dono.contratos.tsx
│   ├── dono.conversas.tsx
│   ├── dono.documentos.tsx
│   └── dono.manutencao.tsx
└── styles.css           # Estilos globais (Tailwind v4)
```

## Como Rodar

```bash
# Instalar dependências
bun install

# Desenvolvimento
bun run dev

# Build de produção
bun run build

# Preview do build
bun run preview
```

## KPIs Relevantes ao Negócio

| Métrica | Benchmark do Segmento | Meta AlugaFlow |
|---|---|---|
| LTV/CAC | >= 4:1 | >= 4:1 |
| Churn mensal | < 2% | < 2% |
| Payback CAC | 12-24 meses | <= 12 meses |
| Margem bruta | 70-80% | >= 75% |

## Licença

Projeto privado. Todos os direitos reservados.
