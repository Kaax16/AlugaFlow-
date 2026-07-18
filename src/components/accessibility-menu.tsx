import { useEffect, useState } from "react";
import { Accessibility, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Tipos de daltonismo + ajustes de visão. Cada modo vira uma classe no <html>
// e o efeito é aplicado no <body> inteiro (via filtro SVG) — reflete em TODA tela.
export type A11yMode =
  | "default"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "high-contrast"
  | "reduced-motion";

const modes: { value: A11yMode; label: string; description: string }[] = [
  { value: "default", label: "Padrão", description: "Sem ajustes" },
  { value: "protanopia", label: "Protanopia", description: "Daltonismo (deficiência de vermelho)" },
  {
    value: "deuteranopia",
    label: "Deuteranopia",
    description: "Daltonismo (deficiência de verde)",
  },
  { value: "tritanopia", label: "Tritanopia", description: "Daltonismo (azul-amarelo)" },
  {
    value: "high-contrast",
    label: "Alto contraste",
    description: "Para baixa visão / astigmatismo",
  },
  { value: "reduced-motion", label: "Movimento reduzido", description: "Reduz as animações" },
];

const MODE_KEY = "a11y-mode";
const FONT_KEY = "a11y-font";
const FONT_MIN = 14;
const FONT_MAX = 22;
const FONT_DEFAULT = 16;
const FONT_STEP = 1;

const a11yClasses = modes.filter((m) => m.value !== "default").map((m) => `a11y-${m.value}`);

function applyMode(mode: A11yMode) {
  const root = document.documentElement;
  root.classList.remove(...a11yClasses);
  if (mode !== "default") root.classList.add(`a11y-${mode}`);
}

function applyFont(px: number) {
  document.documentElement.style.fontSize = `${px}px`;
}

export function AccessibilityMenu() {
  const [mode, setMode] = useState<A11yMode>("default");
  const [font, setFont] = useState(FONT_DEFAULT);

  // Lê as preferências salvas ao montar.
  useEffect(() => {
    const savedMode = (localStorage.getItem(MODE_KEY) as A11yMode) ?? "default";
    const savedFont = Number(localStorage.getItem(FONT_KEY)) || FONT_DEFAULT;
    setMode(savedMode);
    setFont(savedFont);
    applyMode(savedMode);
    applyFont(savedFont);
  }, []);

  const changeMode = (next: A11yMode) => {
    setMode(next);
    localStorage.setItem(MODE_KEY, next);
    applyMode(next);
  };

  const changeFont = (delta: number) => {
    const next = Math.min(FONT_MAX, Math.max(FONT_MIN, font + delta));
    setFont(next);
    localStorage.setItem(FONT_KEY, String(next));
    applyFont(next);
  };

  const resetFont = () => changeFont(FONT_DEFAULT - font);

  return (
    <>
      {/* Filtros de daltonismo (referenciados via url(#..) no CSS). sRGB evita
          desvio de cor no Firefox, que usa linearRGB por padrão. */}
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
        <defs>
          <filter id="cb-protanopia" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="cb-deuteranopia" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="cb-tritanopia" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Acessibilidade visual"
            title="Acessibilidade visual"
            className={cn(mode !== "default" && "text-primary")}
          >
            <Accessibility className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Acessibilidade visual</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="px-2 py-2">
            <p className="mb-2 text-xs text-muted-foreground">Tamanho da fonte</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={font <= FONT_MIN}
                onClick={(e) => {
                  e.preventDefault();
                  changeFont(-FONT_STEP);
                }}
                aria-label="Diminuir fonte"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <div className="flex-1 text-center">
                <span className="text-sm font-medium">{font}px</span>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${((font - FONT_MIN) / (FONT_MAX - FONT_MIN)) * 100}%` }}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={font >= FONT_MAX}
                onClick={(e) => {
                  e.preventDefault();
                  changeFont(FONT_STEP);
                }}
                aria-label="Aumentar fonte"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.preventDefault();
                  resetFont();
                }}
                aria-label="Restaurar fonte"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Modo de visualização
          </DropdownMenuLabel>

          {modes.map((m) => (
            <DropdownMenuItem
              key={m.value}
              onSelect={(e) => {
                e.preventDefault();
                changeMode(m.value);
              }}
              className={cn(
                "cursor-pointer flex-col items-start gap-0.5",
                mode === m.value && "bg-accent",
              )}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    mode === m.value ? "bg-primary" : "bg-transparent",
                  )}
                />
                {m.label}
              </span>
              <span className="ml-4 text-xs text-muted-foreground">{m.description}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
