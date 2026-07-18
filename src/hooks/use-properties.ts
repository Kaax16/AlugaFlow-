import { useMemo, useSyncExternalStore } from "react";
import {
  properties,
  getPropertiesVersion,
  subscribeProperties,
  type Property,
} from "@/data/properties";

/**
 * Retorna a lista atual do "store" mockado de imóveis. Ao usar o `version`
 * como base, garantimos que useMemo/useEffect que dependem do array recebam
 * uma referência nova toda vez que houver `addProperty`/`removeProperty`.
 */
export function usePropertiesList(): Property[] {
  const version = useSyncExternalStore(
    subscribeProperties,
    getPropertiesVersion,
    getPropertiesVersion,
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => [...properties], [version]);
}
