// Por dónde ibas.
//
// El modo paso a paso ya guardaba su posición, pero la lectura continua no
// guardaba nada: cada vez que volvías a un tema empezabas arriba. Esto lo
// arregla y, de paso, permite que el panel ofrezca "seguir donde lo dejaste"
// en lugar de mandarte siempre al primer tema no superado.

export type Place = {
  /** Índice del bloque por el que ibas dentro del tema (0 = el primero). */
  blockIndex: number;
  /** Título del bloque, para poder decírtelo sin recalcularlo. */
  blockTitle: string;
  /** ISO de la última vez que se tocó ese tema. */
  updatedAt: string;
};

export type PlaceMap = Record<string, Place>;

export const PLACE_KEY = "bio-reading-place-v1";
export const LAST_THEME_KEY = "bio-last-theme-v1";

/**
 * Qué bloque estás leyendo, dado dónde empieza cada uno y dónde está el scroll.
 *
 * El criterio es "el último bloque cuyo comienzo ya has dejado atrás", medido
 * contra una línea situada al 30 % de la ventana: así el bloque cambia cuando
 * su título sube por encima de esa línea, no cuando asoma por abajo.
 *
 * Función pura y aparte porque es la única parte con aritmética, y así se
 * puede comprobar sin depender de un navegador.
 */
export function blockIndexAt(tops: number[], scrollY: number, viewportHeight: number): number {
  const line = scrollY + viewportHeight * 0.3;
  let index = 0;
  for (let i = 0; i < tops.length; i += 1) {
    if (tops[i] <= line) index = i;
    else break;
  }
  return index;
}

export function loadPlaces(): PlaceMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PLACE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as PlaceMap) : {};
  } catch {
    return {};
  }
}

export function savePlace(themeId: string, place: Place): void {
  if (typeof window === "undefined") return;
  try {
    const places = loadPlaces();
    places[themeId] = place;
    localStorage.setItem(PLACE_KEY, JSON.stringify(places));
  } catch {
    /* la lectura funciona igual, solo que sin recordar la posición */
  }
}

export function readPlace(themeId: string): Place | undefined {
  return loadPlaces()[themeId];
}

/** Último tema abierto, aunque no se haya superado su prueba. */
export function saveLastTheme(themeNumber: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_THEME_KEY, JSON.stringify({ themeNumber, at: new Date().toISOString() }));
  } catch {
    /* sin memoria, el panel simplemente no ofrecerá retomar */
  }
}

export function readLastTheme(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_THEME_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    const value = (parsed as { themeNumber?: unknown })?.themeNumber;
    return typeof value === "number" && value >= 1 && value <= 12 ? value : null;
  } catch {
    return null;
  }
}
