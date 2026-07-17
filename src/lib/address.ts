import type { Address } from "@/data/properties";

/**
 * Formata o CEP no padrão brasileiro 00000-000, aceitando entradas
 * só com dígitos ou já formatadas.
 */
export function formatZip(zip: string): string {
  const digits = zip.replace(/\D/g, "").slice(0, 8);
  if (digits.length !== 8) return zip;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/**
 * Primeira linha do endereço: logradouro, número e complemento
 * (apto/casa/cobertura). Ex.: "Av. Beira Mar, 2450 — Apto 1302".
 */
export function formatStreetLine(address: Address): string {
  const base = `${address.street}, ${address.number}`;
  return address.complement ? `${base} — ${address.complement}` : base;
}

/**
 * Segunda linha: bairro, cidade e estado.
 * Ex.: "Meireles · Fortaleza/CE".
 */
export function formatCityLine(address: Address): string {
  return `${address.neighborhood} · ${address.city}/${address.state}`;
}

/** Endereço completo em uma linha, com CEP. */
export function formatFullAddress(address: Address): string {
  return `${formatStreetLine(address)}, ${formatCityLine(address)} · CEP ${formatZip(address.zip)}`;
}
