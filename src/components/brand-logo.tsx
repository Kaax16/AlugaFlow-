import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

/** Ícone da marca (o balão "+" do Aluga+). Tamanho controlado por classes. */
export function BrandLogo({ className }: Props) {
  return (
    <img
      src="/favicon-mark.png"
      alt="Aluga+"
      className={cn("h-10 w-10 shrink-0 object-contain", className)}
    />
  );
}
