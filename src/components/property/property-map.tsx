import { useEffect, useRef } from "react";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { PropertyStatus } from "@/data/properties";
import { statusLabel } from "@/data/properties";
import { cn } from "@/lib/utils";

export interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: PropertyStatus;
  subtitle?: string;
  /** Unidades do edifício (quando o ponto agrupa vários apartamentos). */
  units?: { label: string; status: PropertyStatus }[];
}

interface Props {
  points: MapPoint[];
  center?: { lat: number; lng: number };
  zoom?: number;
  pitch?: number;
  interactive?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}

// Fortaleza — centro aproximado (região Meireles/Aldeota).
const FORTALEZA: [number, number] = [-38.4889, -3.7364];

// Estilo vetorial escuro e modular (sem estética "realista"), sem chave de API.
const MAP_STYLE = "https://tiles.openfreemap.org/styles/dark";

// Cores dos marcadores por status (fixas — o mapa é sempre escuro).
const STATUS_COLOR: Record<PropertyStatus, string> = {
  ocupado: "#34d399",
  disponivel: "#fbbf24",
  manutencao: "#38bdf8",
};

function buildMarkerElement(point: MapPoint, active: boolean): HTMLElement {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "map-marker" + (active ? " map-marker--active" : "");

  // Edifício com várias unidades → marcador de "pasta" com a contagem.
  if (point.units && point.units.length > 0) {
    el.classList.add("map-marker--folder");
    el.setAttribute("aria-label", `${point.name} — ${point.units.length} unidades`);
    el.innerHTML = `<span class="map-folder">🗂️<span class="map-folder__count">${point.units.length}</span></span>`;
    return el;
  }

  el.setAttribute("aria-label", `${point.name} — ${statusLabel(point.status)}`);
  el.style.setProperty("--marker-color", STATUS_COLOR[point.status]);
  el.innerHTML = '<span class="map-marker__dot"></span>';
  return el;
}

// HTML do popup: unidades listadas quando é edifício; senão, o subtítulo.
function buildPopupHtml(point: MapPoint): string {
  if (point.units && point.units.length > 0) {
    const items = point.units
      .map(
        (u) =>
          `<div style="display:flex;align-items:center;gap:6px;margin-top:3px">
            <span style="width:8px;height:8px;border-radius:9999px;background:${STATUS_COLOR[u.status]}"></span>
            <span>${u.label}</span>
            <span style="margin-left:auto;opacity:.7">${statusLabel(u.status)}</span>
          </div>`,
      )
      .join("");
    return `<strong>${point.name}</strong><br><span>${point.units.length} unidades</span>${items}`;
  }
  return `<strong>${point.name}</strong>${point.subtitle ? `<br><span>${point.subtitle}</span>` : ""}`;
}

// Adiciona a camada de prédios 3D (extrusão), colorida pela altura — visual modular.
function add3dBuildings(map: MapLibreMap) {
  if (map.getLayer("predios-3d") || !map.getSource("openmaptiles")) return;
  const firstSymbol = map.getStyle().layers?.find((l) => l.type === "symbol")?.id;
  map.addLayer(
    {
      id: "predios-3d",
      source: "openmaptiles",
      "source-layer": "building",
      type: "fill-extrusion",
      minzoom: 13,
      paint: {
        "fill-extrusion-color": [
          "interpolate",
          ["linear"],
          ["get", "render_height"],
          0,
          "#2a2540",
          40,
          "#4c3f73",
          120,
          "#6d5aa6",
        ],
        "fill-extrusion-height": ["get", "render_height"],
        "fill-extrusion-base": ["get", "render_min_height"],
        "fill-extrusion-opacity": 0.85,
      },
    },
    firstSymbol,
  );
}

export function PropertyMap({
  points,
  center,
  zoom = 12.6,
  pitch = 45,
  interactive = true,
  selectedId,
  onSelect,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Cria o mapa uma única vez (import dinâmico evita quebrar o SSR).
  useEffect(() => {
    let cancelled = false;
    const markers = markersRef.current;

    void import("maplibre-gl").then(({ Map, Marker, Popup, NavigationControl }) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = new Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: center ? [center.lng, center.lat] : FORTALEZA,
        zoom,
        pitch,
        bearing: -18,
        interactive,
        attributionControl: { compact: true },
      });
      mapRef.current = map;

      if (interactive) map.addControl(new NavigationControl({ visualizePitch: true }), "top-right");
      map.on("load", () => add3dBuildings(map));

      for (const point of points) {
        const el = buildMarkerElement(point, point.id === selectedId);
        const marker = new Marker({ element: el })
          .setLngLat([point.lng, point.lat])
          .setPopup(new Popup({ offset: 18, closeButton: false }).setHTML(buildPopupHtml(point)))
          .addTo(map);
        el.addEventListener("click", () => onSelectRef.current?.(point.id));
        markers.set(point.id, marker);
      }
    });

    return () => {
      cancelled = true;
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // Recria os marcadores apenas quando muda a lista de pontos.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  // Destaca e centraliza o imóvel selecionado.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    markersRef.current.forEach((marker, id) => {
      marker.getElement().classList.toggle("map-marker--active", id === selectedId);
    });
    const target = points.find((p) => p.id === selectedId);
    if (target)
      map.flyTo({
        center: [target.lng, target.lat],
        zoom: Math.max(map.getZoom(), 15),
        speed: 0.8,
      });
  }, [selectedId, points]);

  return (
    <div
      ref={containerRef}
      className={cn("map-shell relative w-full overflow-hidden rounded-2xl border", className)}
      role="region"
      aria-label="Mapa dos imóveis em Fortaleza"
    />
  );
}
