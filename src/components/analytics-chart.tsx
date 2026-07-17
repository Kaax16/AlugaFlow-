import { useState } from "react";
import type { Options } from "highcharts";
import { AreaChart, BarChart3, LineChart, PieChart } from "lucide-react";
import { Chart } from "@/components/chart";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";

export type ChartType = "column" | "bar" | "line" | "area" | "pie";

interface Serie {
  name: string;
  data: number[];
}

interface Props {
  categories: string[];
  series: Serie[];
  /** Tipos que o usuário pode alternar (o primeiro é o inicial). */
  types?: ChartType[];
  stacked?: boolean;
  height?: number;
  /** Formatação dos valores no tooltip (padrão: R$). */
  format?: (n: number) => string;
  /** Formatação compacta para os rótulos do eixo (padrão: igual ao tooltip). */
  axisFormat?: (n: number) => string;
  /** Chamado ao clicar em uma barra/fatia (índice da categoria). */
  onSelectIndex?: (index: number) => void;
  className?: string;
}

const typeMeta: Record<ChartType, { label: string; icon: typeof BarChart3 }> = {
  column: { label: "Colunas", icon: BarChart3 },
  bar: { label: "Barras", icon: BarChart3 },
  line: { label: "Linha", icon: LineChart },
  area: { label: "Área", icon: AreaChart },
  pie: { label: "Pizza", icon: PieChart },
};

// Contexto enxuto do tooltip (subconjunto do Point do Highcharts).
interface TooltipCtx {
  x?: string | number;
  y?: number | null;
  color?: unknown;
  series?: { name: string };
  point?: { name?: string };
  points?: { series: { name: string }; color?: unknown; y?: number | null }[];
}

export function AnalyticsChart({
  categories,
  series,
  types = ["column", "line", "area"],
  stacked,
  height = 320,
  format = formatBRL,
  axisFormat,
  onSelectIndex,
  className,
}: Props) {
  const [type, setType] = useState<ChartType>(types[0]);
  const axisFmt = axisFormat ?? format;

  const tooltipFormatter = function (this: TooltipCtx): string {
    const rows = this.points ?? [
      {
        series: { name: this.point?.name ?? this.series?.name ?? "" },
        color: this.color,
        y: this.y,
      },
    ];
    const header = this.points
      ? `<div style="font-size:11px;opacity:.7;margin-bottom:2px">${this.x ?? ""}</div>`
      : "";
    const body = rows
      .map(
        (p) =>
          `<div style="display:flex;align-items:center;gap:6px;margin-top:3px">
            <span style="width:8px;height:8px;border-radius:9999px;background:${p.color}"></span>
            <span>${p.series.name}</span>
            <b style="margin-left:auto">${format(p.y ?? 0)}</b>
          </div>`,
      )
      .join("");
    return header + body;
  };

  const clickEvents = onSelectIndex
    ? {
        point: {
          events: {
            click: function (this: { index: number }) {
              onSelectIndex(this.index);
            },
          },
        },
      }
    : undefined;

  const options: Options =
    type === "pie"
      ? {
          chart: { type: "pie", height },
          tooltip: { formatter: tooltipFormatter },
          plotOptions: {
            pie: {
              innerSize: "62%",
              dataLabels: {
                enabled: true,
                format: "{point.name}",
                style: { textOutline: "none", fontWeight: "500" },
              },
              point: clickEvents?.point,
            },
          },
          series: [
            {
              type: "pie",
              name: series[0]?.name ?? "",
              data: categories.map((name, i) => ({ name, y: series[0]?.data[i] ?? 0 })),
            },
          ],
        }
      : {
          chart: { type: type === "bar" ? "bar" : type, height },
          xAxis: { categories, tickLength: 0 },
          yAxis: {
            title: { text: undefined },
            labels: {
              formatter: function () {
                return axisFmt(Number(this.value));
              },
            },
          },
          legend: { align: "left", verticalAlign: "top", margin: 16, symbolRadius: 6 },
          tooltip: { shared: true, formatter: tooltipFormatter },
          plotOptions: {
            series: { cursor: onSelectIndex ? "pointer" : undefined, ...clickEvents },
            column: {
              borderRadius: 5,
              stacking: stacked ? "normal" : undefined,
              pointPadding: 0.06,
            },
            bar: { borderRadius: 5, stacking: stacked ? "normal" : undefined },
            area: { fillOpacity: 0.16, lineWidth: 2.5, marker: { enabled: false } },
            areaspline: { fillOpacity: 0.16, lineWidth: 2.5, marker: { enabled: false } },
            line: { lineWidth: 2.5, marker: { enabled: false } },
          },
          series: series.map((s) => ({
            type: type === "bar" ? "bar" : type,
            name: s.name,
            data: s.data,
          })),
        };

  return (
    <div className={className}>
      {types.length > 1 ? (
        <div className="mb-3 flex justify-end gap-1">
          {types.map((t) => {
            const Icon = typeMeta[t].icon;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                aria-pressed={type === t}
                aria-label={`Ver como ${typeMeta[t].label}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                  type === t
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{typeMeta[t].label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
      <Chart options={options} className="w-full" />
    </div>
  );
}
