import { properties, type Property, type Tenant } from "./properties";

/**
 * Sessão demo: como o app não tem autenticação real, a "sessão do inquilino"
 * é fixada em Marina Nogueira (contrato do Apto Beira-Mar). A escolha do papel
 * (dono vs. inquilino) acontece na tela inicial (`/`).
 */
const TENANT_PROPERTY_ID = "apto-beira-mar";

export function getTenantSession(): { tenant: Tenant; property: Property } {
  const property = properties.find((p) => p.id === TENANT_PROPERTY_ID);
  if (!property || !property.tenant) {
    throw new Error("Sessão de inquilino indisponível: imóvel demo sem inquilino vinculado.");
  }
  return { tenant: property.tenant, property };
}
