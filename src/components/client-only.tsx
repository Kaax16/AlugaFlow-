import type { ReactNode } from "react";
import { useMounted } from "@/hooks/use-mounted";

interface Props {
  children: ReactNode;
  /** Placeholder exibido no servidor e até o primeiro render no cliente. */
  fallback?: ReactNode;
}

/** Renderiza os filhos apenas no cliente, evitando erros de hidratação. */
export function ClientOnly({ children, fallback = null }: Props) {
  const mounted = useMounted();
  return <>{mounted ? children : fallback}</>;
}
