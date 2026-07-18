import type { Options } from "highcharts";

export type ThemeMode = "light" | "dark";

// Paleta da marca (roxo). O modo daltônico é aplicado por um filtro global no
// <body> (ver AccessibilityMenu), então os gráficos são recoloridos junto.
const brandPalette = ["#8b5cf6", "#38bdf8", "#22c55e", "#f59e0b", "#f43f5e", "#c4a7fb"];

/** Cores de texto/grade/tooltip conforme o tema atual. */
export function chartTokens(mode: ThemeMode) {
  return mode === "dark"
    ? {
        text: "#f2f0f7",
        muted: "#a39fb0",
        grid: "rgba(255,255,255,0.09)",
        card: "#1c1a24",
        border: "rgba(255,255,255,0.12)",
      }
    : {
        text: "#2a2540",
        muted: "#6b6580",
        grid: "rgba(20,10,40,0.09)",
        card: "#ffffff",
        border: "rgba(20,10,40,0.12)",
      };
}

/** Tema base do Highcharts, mesclado às opções de cada gráfico. */
export function buildChartTheme(mode: ThemeMode): Options {
  const t = chartTokens(mode);
  return {
    colors: brandPalette,
    chart: {
      backgroundColor: "transparent",
      style: { fontFamily: "inherit" },
      spacing: [16, 8, 12, 8],
    },
    title: { text: "" },
    subtitle: { text: "" },
    xAxis: {
      lineColor: t.grid,
      tickColor: t.grid,
      gridLineColor: t.grid,
      labels: { style: { color: t.muted, fontSize: "12px" } },
    },
    yAxis: {
      gridLineColor: t.grid,
      lineColor: "transparent",
      labels: { style: { color: t.muted, fontSize: "12px" } },
      title: { style: { color: t.muted } },
    },
    legend: {
      itemStyle: { color: t.text, fontWeight: "500" },
      itemHoverStyle: { color: mode === "dark" ? "#ffffff" : "#000000" },
      itemHiddenStyle: { color: t.muted },
    },
    tooltip: {
      useHTML: true,
      backgroundColor: t.card,
      borderColor: t.border,
      borderRadius: 10,
      style: { color: t.text, fontSize: "12px" },
      shadow: false,
    },
    plotOptions: { series: { animation: { duration: 450 }, borderWidth: 0 } },
    credits: { enabled: false },
    accessibility: { enabled: false },
  };
}
