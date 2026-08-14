// Repetición espaciada (SM-2 simplificado).
//
// El curso ya no impone calendario, así que esto tampoco lo hace: no reparte
// temas por días. Solo recuerda qué preguntas fallaste y cuándo conviene
// volver a verlas. Si un día no estudias, la cola te espera.

export type Grade = "fallo" | "duda" | "bien";

export type CardState = {
  /** Días hasta la próxima revisión. */
  interval: number;
  /** Factor de facilidad SM-2: cuánto se estira el intervalo al acertar. */
  ease: number;
  /** Repasos acertados seguidos. */
  streak: number;
  /** Fecha de la próxima revisión, ISO yyyy-mm-dd. */
  due: string;
  /** Veces vistas en total. */
  seen: number;
  /** Veces falladas en total. */
  lapses: number;
};

export type ScheduleMap = Record<string, CardState>;

export const SRS_KEY = "bio-srs-v1";

const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;

export function today(now: Date = new Date()): string {
  // Fecha local, no UTC: si estudias a las 23:50 no debe contar como mañana.
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(from: string, days: number): string {
  const [y, m, d] = from.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + Math.max(0, Math.round(days)));
  return today(date);
}

export function newCard(now = today()): CardState {
  return { interval: 0, ease: DEFAULT_EASE, streak: 0, due: now, seen: 0, lapses: 0 };
}

/**
 * Calcula el siguiente estado de una tarjeta.
 *
 * Fallar la devuelve al día siguiente y baja la facilidad: volverá pronto y
 * seguirá volviendo hasta que deje de fallarse. Acertar con dudas estira poco;
 * acertar con soltura estira mucho.
 */
export function review(card: CardState, grade: Grade, now = today()): CardState {
  const seen = card.seen + 1;

  if (grade === "fallo") {
    return {
      interval: 1,
      ease: Math.max(MIN_EASE, card.ease - 0.2),
      streak: 0,
      due: addDays(now, 1),
      seen,
      lapses: card.lapses + 1,
    };
  }

  const ease = grade === "duda"
    ? Math.max(MIN_EASE, card.ease - 0.15)
    : Math.min(2.8, card.ease + 0.1);

  const streak = card.streak + 1;
  let interval: number;
  if (streak === 1) interval = grade === "duda" ? 1 : 2;
  else if (streak === 2) interval = grade === "duda" ? 3 : 6;
  else interval = Math.max(1, card.interval * ease);

  return { interval, ease, streak, due: addDays(now, interval), seen, lapses: card.lapses };
}

export function isDue(card: CardState | undefined, now = today()): boolean {
  if (!card) return true; // nunca vista: entra en la cola
  return card.due <= now;
}

/** Preguntas pendientes hoy, las más falladas primero. */
export function dueQueue(ids: string[], schedule: ScheduleMap, now = today()): string[] {
  return ids
    .filter((id) => isDue(schedule[id], now))
    .sort((a, b) => {
      const ca = schedule[a];
      const cb = schedule[b];
      // Las ya falladas antes que las nuevas; entre ellas, las más falladas primero.
      const la = ca?.lapses ?? -1;
      const lb = cb?.lapses ?? -1;
      if (la !== lb) return lb - la;
      return (ca?.due ?? "").localeCompare(cb?.due ?? "");
    });
}

export type SrsSummary = {
  pendientes: number;
  aprendidas: number;
  flojas: number;
  total: number;
};

export function summarize(ids: string[], schedule: ScheduleMap, now = today()): SrsSummary {
  let pendientes = 0;
  let aprendidas = 0;
  let flojas = 0;
  for (const id of ids) {
    const card = schedule[id];
    if (isDue(card, now)) pendientes += 1;
    if (card && card.streak >= 3 && card.interval >= 6) aprendidas += 1;
    if (card && card.lapses >= 2 && card.streak < 2) flojas += 1;
  }
  return { pendientes, aprendidas, flojas, total: ids.length };
}

export function loadSchedule(): ScheduleMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SRS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as ScheduleMap) : {};
  } catch {
    return {};
  }
}

export function saveSchedule(schedule: ScheduleMap): void {
  try {
    localStorage.setItem(SRS_KEY, JSON.stringify(schedule));
  } catch {
    /* el repaso funciona igual, pero sin recordar la programación */
  }
}
