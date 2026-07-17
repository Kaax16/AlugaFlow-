import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyImage } from "@/components/property/property-image";
import type { Property } from "@/data/properties";

interface Props {
  gallery: Property["gallery"];
}

export function PropertyGallery({ gallery }: Props) {
  const [index, setIndex] = useState(0);
  const total = gallery.length;
  const current = gallery[index];

  if (total === 0) {
    return (
      <Card className="grid aspect-[16/9] place-items-center border-dashed bg-muted/40 text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="h-8 w-8" />
          <p className="text-sm">Nenhuma foto cadastrada</p>
        </div>
      </Card>
    );
  }

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border shadow-card">
        <PropertyImage
          src={current.src}
          alt={current.label}
          hue={current.hue}
          eager={index === 0}
          className="aspect-[16/10] w-full sm:aspect-[16/9]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/80">
              Foto {index + 1} de {total}
            </p>
            <p className="text-lg font-semibold text-white drop-shadow">{current.label}</p>
          </div>
        </div>
        {total > 1 ? (
          <>
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full shadow-elegant"
              onClick={prev}
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full shadow-elegant"
              onClick={next}
              aria-label="Próxima foto"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
          {gallery.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver ${item.label}`}
              className={cn(
                "group relative aspect-[4/3] overflow-hidden rounded-lg ring-offset-2 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                i === index ? "ring-2 ring-primary" : "opacity-80 hover:opacity-100",
              )}
            >
              <PropertyImage
                src={item.src}
                alt={item.label}
                hue={item.hue}
                className="h-full w-full"
              />
              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent px-1.5 py-1 text-[10px] font-medium text-white">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
