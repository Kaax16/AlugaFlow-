import { useEffect, useRef, useState } from "react";
import type { Options } from "highcharts";
import { buildChartTheme } from "@/lib/highcharts-theme";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface Props {
  options: Options;
  className?: string;
}

type ChartInstance = { reflow: () => void };

// Tipos mínimos das libs carregadas dinamicamente (evita rodar no SSR).
type Highcharts = { setOptions: (o: Options) => void; merge: (...o: Options[]) => Options };
type HighchartsReactComponent = (props: {
  highcharts: unknown;
  options: Options;
  containerProps?: Record<string, unknown>;
  callback?: (chart: ChartInstance) => void;
}) => React.ReactElement;

// Desembrulha camadas de `default` deixadas pelo interop CJS/ESM.
function resolveHighcharts(mod: unknown): Highcharts {
  let h = mod as { setOptions?: unknown; default?: unknown };
  while (h && typeof h.setOptions !== "function" && h.default) h = h.default as typeof h;
  return h as unknown as Highcharts;
}

function resolveComponent(mod: unknown): HighchartsReactComponent {
  let c = mod as { $$typeof?: unknown; default?: unknown };
  while (c && typeof c === "object" && !c.$$typeof && c.default) c = c.default as typeof c;
  return c as unknown as HighchartsReactComponent;
}

/** Wrapper client-only do Highcharts, com o tema atual e reflow responsivo. */
export function Chart({ options, className }: Props) {
  const { theme } = useTheme();
  const [mods, setMods] = useState<{
    hc: Highcharts;
    HighchartsReact: HighchartsReactComponent;
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartInstance | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    void Promise.all([import("highcharts"), import("highcharts-react-official")]).then(
      ([hcMod, reactMod]) => {
        if (!alive.current) return;
        setMods({ hc: resolveHighcharts(hcMod), HighchartsReact: resolveComponent(reactMod) });
      },
    );
    return () => {
      alive.current = false;
    };
  }, []);

  // Highcharts só reage a resize da janela; observamos o container para refazer o
  // layout quando ele muda de largura (recolher a sidebar, mobile, troca de tipo).
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || !mods) return;
    let frame = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => chartRef.current?.reflow());
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [mods]);

  if (!mods) {
    return (
      <div
        className={cn("animate-pulse rounded-xl bg-muted/40", className)}
        style={{ minHeight: 240 }}
      />
    );
  }

  const { hc, HighchartsReact } = mods;
  const merged = hc.merge(buildChartTheme(theme), options);
  return (
    <div ref={wrapperRef} className={cn("w-full", className)}>
      {/* key força recriar o gráfico ao alternar o tema */}
      <HighchartsReact
        key={theme}
        highcharts={hc}
        options={merged}
        containerProps={{ style: { height: "100%" } }}
        callback={(chart) => {
          chartRef.current = chart;
        }}
      />
    </div>
  );
}
