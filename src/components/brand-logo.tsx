import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

/**
 * Marca do AlugaFlow — uma chave estilizada ("Purple Key") sobre um ladrilho
 * com o gradiente roxo. Sem largura/altura fixas: o tamanho vem das classes
 * (ex.: `h-10 w-10`), então escala em qualquer contexto sem distorcer.
 */
export function BrandLogo({ className }: Props) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="AlugaFlow"
      preserveAspectRatio="xMidYMid meet"
      className={cn("h-10 w-10 shrink-0", className)}
    >
      <defs>
        <linearGradient id="pk-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.6 0.22 295)" />
          <stop offset="0.55" stopColor="oklch(0.66 0.2 312)" />
          <stop offset="1" stopColor="oklch(0.74 0.18 322)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="40" height="40" rx="11" fill="url(#pk-grad)" />
      <g fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="5" />
        <path d="M19.7 19.7 L28 28" />
        <path d="M24.4 24.4 L27 21.8" />
        <path d="M28 28 L30.6 25.4" />
      </g>
    </svg>
  );
}
