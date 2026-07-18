import type { GeoPoint } from "./properties";

export type ProximityCategory =
  | "escola"
  | "shopping"
  | "supermercado"
  | "farmacia"
  | "hospital"
  | "parque"
  | "restaurante"
  | "academia"
  | "transporte";

export interface Proximity {
  id: string;
  name: string;
  category: ProximityCategory;
  coordinates: GeoPoint;
  address: string;
  /** Nota de 0 a 5 (mockada). */
  rating?: number;
  /** Uma linha curta para o card lateral. */
  hint?: string;
}

export const proximityLabels: Record<ProximityCategory, string> = {
  escola: "Escolas",
  shopping: "Shoppings",
  supermercado: "Supermercados",
  farmacia: "Farmácias",
  hospital: "Hospitais",
  parque: "Parques e praias",
  restaurante: "Restaurantes",
  academia: "Academias",
  transporte: "Transporte",
};

export const proximityIcons: Record<ProximityCategory, string> = {
  escola: "🎓",
  shopping: "🛍️",
  supermercado: "🛒",
  farmacia: "💊",
  hospital: "🏥",
  parque: "🌳",
  restaurante: "🍽️",
  academia: "🏋️",
  transporte: "🚏",
};

/** Cores dos marcadores por categoria (mesma paleta OKLCH do resto do app). */
export const proximityColors: Record<ProximityCategory, string> = {
  escola: "#f97316",
  shopping: "#a855f7",
  supermercado: "#22c55e",
  farmacia: "#ef4444",
  hospital: "#dc2626",
  parque: "#16a34a",
  restaurante: "#eab308",
  academia: "#0ea5e9",
  transporte: "#64748b",
};

/**
 * POIs mockados no entorno do Apto Beira-Mar (Meireles / Fortaleza).
 * Coordenadas aproximadas — o objetivo é apresentar a experiência do
 * inquilino ao explorar o bairro.
 */
export const proximities: Proximity[] = [
  {
    id: "poi-escola-7set",
    name: "Colégio 7 de Setembro",
    category: "escola",
    coordinates: { lat: -3.735, lng: -38.498 },
    address: "R. Osvaldo Cruz, 01 · Meireles",
    rating: 4.7,
    hint: "Ensino fundamental e médio",
  },
  {
    id: "poi-escola-christus",
    name: "Escola Christus Aldeota",
    category: "escola",
    coordinates: { lat: -3.7355, lng: -38.49 },
    address: "R. Nogueira Acioli, 891 · Aldeota",
    rating: 4.6,
    hint: "Educação infantil ao ensino médio",
  },
  {
    id: "poi-escola-idioma",
    name: "Cultura Inglesa Meireles",
    category: "escola",
    coordinates: { lat: -3.7269, lng: -38.4922 },
    address: "Av. Barão de Studart, 1250",
    rating: 4.5,
    hint: "Curso de idiomas",
  },

  {
    id: "poi-shopping-delpaseo",
    name: "Shopping Del Paseo",
    category: "shopping",
    coordinates: { lat: -3.7381, lng: -38.4924 },
    address: "Av. Santos Dumont, 3131 · Aldeota",
    rating: 4.4,
    hint: "Cinema, praça de alimentação e lojas",
  },
  {
    id: "poi-shopping-riomar",
    name: "RioMar Kennedy",
    category: "shopping",
    coordinates: { lat: -3.7229, lng: -38.5019 },
    address: "Av. Pdte. Kennedy, 850",
    rating: 4.5,
    hint: "Compras e gastronomia",
  },

  {
    id: "poi-super-paodeacucar",
    name: "Pão de Açúcar Meireles",
    category: "supermercado",
    coordinates: { lat: -3.722, lng: -38.4931 },
    address: "Av. Beira Mar, 3080",
    rating: 4.5,
    hint: "Aberto todos os dias",
  },
  {
    id: "poi-super-mercantil",
    name: "Mercantil Nova Era",
    category: "supermercado",
    coordinates: { lat: -3.7273, lng: -38.4907 },
    address: "R. Ana Bilhar, 1122 · Meireles",
    rating: 4.2,
    hint: "Hortifruti e mercearia",
  },
  {
    id: "poi-super-extra",
    name: "Extra Beira-Mar",
    category: "supermercado",
    coordinates: { lat: -3.7226, lng: -38.4869 },
    address: "Av. Abolição, 2233",
    rating: 4.0,
    hint: "Compra rápida 24h",
  },

  {
    id: "poi-farma-pague",
    name: "Pague Menos Meireles",
    category: "farmacia",
    coordinates: { lat: -3.7238, lng: -38.4901 },
    address: "Av. Abolição, 2450",
    rating: 4.3,
    hint: "Drogaria 24h",
  },
  {
    id: "poi-farma-drogasil",
    name: "Drogasil Aldeota",
    category: "farmacia",
    coordinates: { lat: -3.7341, lng: -38.4948 },
    address: "Av. Dom Luís, 800",
    rating: 4.5,
  },

  {
    id: "poi-hosp-sao-carlos",
    name: "Hospital São Carlos",
    category: "hospital",
    coordinates: { lat: -3.7314, lng: -38.494 },
    address: "R. Silva Jatahy, 161 · Meireles",
    rating: 4.6,
    hint: "Pronto atendimento 24h",
  },
  {
    id: "poi-hosp-antonio-prudente",
    name: "Hospital Antônio Prudente",
    category: "hospital",
    coordinates: { lat: -3.7385, lng: -38.4842 },
    address: "Av. José Bastos, 2551",
    rating: 4.4,
  },

  {
    id: "poi-parque-meireles",
    name: "Calçadão da Beira-Mar",
    category: "parque",
    coordinates: { lat: -3.72, lng: -38.4915 },
    address: "Av. Beira Mar · Meireles",
    rating: 4.9,
    hint: "Feirinha à noite e vista para o mar",
  },
  {
    id: "poi-parque-coco",
    name: "Parque do Cocó",
    category: "parque",
    coordinates: { lat: -3.7466, lng: -38.4869 },
    address: "Av. Padre Antônio Tomás",
    rating: 4.8,
    hint: "Trilhas e mata nativa",
  },
  {
    id: "poi-praia-iracema",
    name: "Praia de Iracema",
    category: "parque",
    coordinates: { lat: -3.7186, lng: -38.5121 },
    address: "Av. Beira Mar",
    rating: 4.7,
    hint: "Boemia e Dragão do Mar",
  },

  {
    id: "poi-rest-coco-bambu",
    name: "Coco Bambu Meireles",
    category: "restaurante",
    coordinates: { lat: -3.7245, lng: -38.487 },
    address: "Av. Beira Mar, 3222",
    rating: 4.6,
    hint: "Frutos do mar contemporâneos",
  },
  {
    id: "poi-rest-vojnilo",
    name: "Vojnilô",
    category: "restaurante",
    coordinates: { lat: -3.7248, lng: -38.4909 },
    address: "R. Frederico Borges, 409 · Varjota",
    rating: 4.7,
    hint: "Cozinha autoral",
  },
  {
    id: "poi-rest-santa-grelha",
    name: "Santa Grelha",
    category: "restaurante",
    coordinates: { lat: -3.7267, lng: -38.4922 },
    address: "R. Frederico Borges, 465 · Varjota",
    rating: 4.5,
    hint: "Carnes e cortes premium",
  },

  {
    id: "poi-academia-smartfit",
    name: "SmartFit Meireles",
    category: "academia",
    coordinates: { lat: -3.7237, lng: -38.4934 },
    address: "Av. Barão de Studart, 505",
    rating: 4.3,
    hint: "Aberta 24h para alunos Black",
  },
  {
    id: "poi-academia-bodytech",
    name: "Bodytech Aldeota",
    category: "academia",
    coordinates: { lat: -3.7355, lng: -38.4925 },
    address: "Av. Dom Luís, 500",
    rating: 4.6,
  },

  {
    id: "poi-transporte-papicu",
    name: "Estação Papicu (Metrofor)",
    category: "transporte",
    coordinates: { lat: -3.7377, lng: -38.5031 },
    address: "Av. Eng. Santana Júnior",
    hint: "Linha Sul do metrô",
  },
  {
    id: "poi-transporte-terminal-beiramar",
    name: "Terminal do Meireles",
    category: "transporte",
    coordinates: { lat: -3.7226, lng: -38.4954 },
    address: "Av. Beira Mar",
    hint: "Ônibus para todos os bairros",
  },
];

/**
 * Distância em km entre dois pontos (Haversine). Boa o suficiente para
 * ordenar POIs por proximidade ao imóvel.
 */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const h = s1 * s1 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
