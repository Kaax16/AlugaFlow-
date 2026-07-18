import { useEffect, useRef } from "react";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { GeoPoint } from "@/data/properties";
import {
  proximityColors,
  proximityIcons,
  proximityLabels,
  type Proximity,
} from "@/data/proximities";
import { cn } from "@/lib/utils";

interface Props {
  /** Ponto central: o imóvel do inquilino. */
  home: { name: string; coordinates: GeoPoint };
  /** Lista de POIs próximos filtrados. */
  pois: Proximity[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}

const MAP_STYLE = "https://tiles.openfreemap.org/styles/dark";

function homeMarkerElement(name: string): HTMLElement {
  const el = document.createElement("div");
  el.className = "map-marker map-marker--home";
  el.setAttribute("aria-label", `${name} — meu imóvel`);
  el.innerHTML = '<span class="map-marker__home">🏠</span>';
  return el;
}

function poiMarkerElement(poi: Proximity, active: boolean): HTMLElement {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "map-marker map-marker--poi" + (active ? " map-marker--active" : "");
  el.setAttribute("aria-label", `${poi.name} — ${proximityLabels[poi.category]}`);
  el.style.setProperty("--marker-color", proximityColors[poi.category]);
  el.innerHTML = `<span class="map-marker__poi">${proximityIcons[poi.category]}</span>`;
  return el;
}

function buildPopupHtml(poi: Proximity): string {
  const rating = poi.rating ? `<div style="margin-top:2px">⭐ ${poi.rating.toFixed(1)}</div>` : "";
  const hint = poi.hint ? `<div style="margin-top:2px;opacity:.75">${poi.hint}</div>` : "";
  return `<strong>${poi.name}</strong><br><span>${proximityLabels[poi.category]}</span>${rating}${hint}`;
}

export function TenantAreaMap({ home, pois, selectedId, onSelect, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    let cancelled = false;
    const markers = markersRef.current;

    void import("maplibre-gl").then(({ Map, Marker, Popup, NavigationControl }) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = new Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: [home.coordinates.lng, home.coordinates.lat],
        zoom: 14.5,
        pitch: 40,
        bearing: -18,
        attributionControl: { compact: true },
      });
      mapRef.current = map;
      map.addControl(new NavigationControl({ visualizePitch: true }), "top-right");

      const homeEl = homeMarkerElement(home.name);
      new Marker({ element: homeEl })
        .setLngLat([home.coordinates.lng, home.coordinates.lat])
        .setPopup(
          new Popup({ offset: 22, closeButton: false }).setHTML(
            `<strong>${home.name}</strong><br><span>Meu imóvel</span>`,
          ),
        )
        .addTo(map);

      for (const poi of pois) {
        const el = poiMarkerElement(poi, poi.id === selectedId);
        const marker = new Marker({ element: el })
          .setLngLat([poi.coordinates.lng, poi.coordinates.lat])
          .setPopup(new Popup({ offset: 18, closeButton: false }).setHTML(buildPopupHtml(poi)))
          .addTo(map);
        el.addEventListener("click", () => onSelectRef.current?.(poi.id));
        markers.set(poi.id, marker);
      }
    });

    return () => {
      cancelled = true;
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pois, home.coordinates.lat, home.coordinates.lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    markersRef.current.forEach((marker, id) => {
      marker.getElement().classList.toggle("map-marker--active", id === selectedId);
    });
    const target = pois.find((p) => p.id === selectedId);
    if (target)
      map.flyTo({
        center: [target.coordinates.lng, target.coordinates.lat],
        zoom: Math.max(map.getZoom(), 16),
        speed: 0.8,
      });
  }, [selectedId, pois]);

  return (
    <div
      ref={containerRef}
      className={cn("map-shell relative w-full overflow-hidden rounded-2xl border", className)}
      role="region"
      aria-label="Mapa das proximidades do imóvel"
    />
  );
}
