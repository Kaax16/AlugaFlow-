import type { GeoPoint } from "@/data/properties";

/** Distância aproximada entre dois pontos, em km (fórmula de Haversine). */
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// No trecho Iracema–Meireles–Mucuripe a orla corre quase leste–oeste, então a
// distância até o mar é bem aproximada pela distância à latitude da costa.
const COAST_LAT = -3.7155;

/** Distância aproximada do imóvel até a orla, em km (~111 km por grau de latitude). */
export function distanceToSeaKm(coords: GeoPoint): number {
  return Math.max(0, COAST_LAT - coords.lat) * 111;
}

/** Considera "perto do mar" imóveis a até ~1,2 km da orla. */
export function isNearSea(coords: GeoPoint): boolean {
  return distanceToSeaKm(coords) <= 1.2;
}
