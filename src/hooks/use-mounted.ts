import { useEffect, useState } from "react";

/**
 * Indica se o componente já montou no navegador. Útil para bibliotecas
 * que dependem de `window`/DOM (MapLibre, Highcharts) e não podem rodar
 * durante o SSR do TanStack Start.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
