import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  src?: string;
  alt: string;
  /** Matiz (oklch) usada no gradiente de fallback quando não há/falha a imagem. */
  hue: number;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}

/**
 * Exibe a foto do imóvel sobre um gradiente na identidade da marca.
 * Se a imagem falhar (URL fora do ar), o gradiente continua ali como fallback,
 * então o layout nunca fica quebrado.
 */
export function PropertyImage({ src, alt, hue, className, imgClassName, eager }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div
      className={cn("relative overflow-hidden bg-cover bg-center", className)}
      style={{
        backgroundImage: `linear-gradient(135deg, oklch(0.45 0.22 ${hue}) 0%, oklch(0.7 0.2 ${hue + 30}) 100%)`,
      }}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      ) : null}
    </div>
  );
}
