import { useSyncExternalStore } from "react";

export type Role = "owner" | "tenant";

export interface Session {
  role: Role;
  email: string;
  displayName: string;
}

const STORAGE_KEY = "alugaflow-session";
const listeners = new Set<() => void>();
let session: Session | null = null;
let hydrated = false;

function loadFromStorage(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Session>;
    if ((parsed?.role === "owner" || parsed?.role === "tenant") && parsed?.email) {
      return {
        role: parsed.role,
        email: parsed.email,
        displayName: parsed.displayName ?? parsed.email,
      };
    }
  } catch {
    // localStorage bloqueado ou JSON inválido: seguimos deslogados.
  }
  return null;
}

/**
 * Chamado uma vez no cliente para carregar a sessão persistida sem
 * quebrar a hidratação SSR (o primeiro render sempre começa "deslogado").
 */
export function hydrateSession(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const persisted = loadFromStorage();
  if (persisted) {
    session = persisted;
    notify();
  }
}

function persist(): void {
  if (typeof window === "undefined") return;
  try {
    if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignora falhas de persistência (modo privado etc.).
  }
}

function notify(): void {
  listeners.forEach((cb) => cb());
}

export function getSession(): Session | null {
  return session;
}

export function login(next: Session): void {
  session = next;
  persist();
  notify();
}

export function logout(): void {
  session = null;
  persist();
  notify();
}

export function subscribeSession(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Snapshot estável usado no SSR (evita mismatch com o valor do cliente). */
function serverSnapshot(): Session | null {
  return null;
}

export function useSession(): Session | null {
  return useSyncExternalStore(subscribeSession, getSession, serverSnapshot);
}
