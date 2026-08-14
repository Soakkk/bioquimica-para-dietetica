"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Piece = { id: string; value: string };
type Puzzle = {
  id: string;
  level: 1 | 2 | 3;
  family: string;
  name: string;
  answer: string[];
  extras: string[];
  hint: string;
  explain: string;
};

const puzzles: Puzzle[] = [
  { id:"pz-etano", level:1, family:"Alcano", name:"etano", answer:["CH₃","—","CH₃"], extras:["=","CH₂"], hint:"et- significa 2 carbonos y -ano pide un enlace simple.", explain:"Dos carbonos unidos mediante un enlace simple: CH₃—CH₃." },
  { id:"pz-propano", level:1, family:"Alcano", name:"propano", answer:["CH₃","—","CH₂","—","CH₃"], extras:["=","CH"], hint:"Forma primero una cadena de tres carbonos con enlaces simples.", explain:"Los extremos son CH₃ y el carbono interior es CH₂." },
  { id:"pz-butano", level:1, family:"Alcano", name:"butano", answer:["CH₃","—","CH₂","—","CH₂","—","CH₃"], extras:["≡","CH"], hint:"but- significa una cadena de cuatro carbonos.", explain:"Una cadena lineal de cuatro carbonos forma CH₃—CH₂—CH₂—CH₃." },
  { id:"pz-eteno", level:1, family:"Alqueno", name:"eteno", answer:["CH₂","=","CH₂"], extras:["—","CH₃"], hint:"-eno indica un enlace doble C=C.", explain:"El doble enlace deja dos hidrógenos en cada carbono: CH₂=CH₂." },
  { id:"pz-etino", level:1, family:"Alquino", name:"etino", answer:["HC","≡","CH"], extras:["=","CH₂"], hint:"-ino indica un enlace triple C≡C.", explain:"El triple enlace deja un hidrógeno en cada carbono: HC≡CH." },
  { id:"pz-etanol", level:1, family:"Alcohol", name:"etanol", answer:["CH₃","—","CH₂","—","OH"], extras:["CHO","COOH"], hint:"et- son 2 carbonos y -ol exige el grupo —OH.", explain:"La cadena de dos carbonos termina en OH: CH₃—CH₂—OH." },

  { id:"pz-but1eno", level:2, family:"Alqueno", name:"but-1-eno", answer:["CH₂","=","CH","—","CH₂","—","CH₃"], extras:["≡","CH"], hint:"El doble enlace debe comenzar en el carbono 1, en un extremo.", explain:"Cuatro carbonos con C=C en C1: CH₂=CH—CH₂—CH₃." },
  { id:"pz-but2eno", level:2, family:"Alqueno", name:"but-2-eno", answer:["CH₃","—","CH","=","CH","—","CH₃"], extras:["CH₂","≡"], hint:"El doble enlace queda entre los carbonos 2 y 3.", explain:"El doble enlace central produce CH₃—CH=CH—CH₃." },
  { id:"pz-but1ino", level:2, family:"Alquino", name:"but-1-ino", answer:["HC","≡","C","—","CH₂","—","CH₃"], extras:["=","CH"], hint:"Coloca C≡C tocando el extremo de la cadena.", explain:"Cuatro carbonos con el triple en C1: HC≡C—CH₂—CH₃." },
  { id:"pz-prop2ol", level:2, family:"Alcohol", name:"propan-2-ol", answer:["CH₃","—","CH(OH)","—","CH₃"], extras:["CH₂","CHO"], hint:"El grupo OH debe ir en el carbono central.", explain:"Tres carbonos y OH en C2: CH₃—CH(OH)—CH₃." },
  { id:"pz-propanal", level:2, family:"Aldehído", name:"propanal", answer:["CH₃","—","CH₂","—","CHO"], extras:["CO","COOH"], hint:"-al exige que la cadena termine en —CHO.", explain:"Tres carbonos, incluido el de CHO: CH₃—CH₂—CHO." },
  { id:"pz-butanona", level:2, family:"Cetona", name:"butan-2-ona", answer:["CH₃","—","CO","—","CH₂","—","CH₃"], extras:["CHO","OH"], hint:"-ona indica un C=O interior; el localizador es 2.", explain:"La cetona en C2 se escribe CH₃—CO—CH₂—CH₃." },
  { id:"pz-propanoico", level:2, family:"Ácido", name:"ácido propanoico", answer:["CH₃","—","CH₂","—","COOH"], extras:["CHO","OH"], hint:"El grupo —COOH contiene uno de los tres carbonos.", explain:"La cadena termina en carboxilo: CH₃—CH₂—COOH." },

  { id:"pz-pent2eno", level:3, family:"Alqueno", name:"pent-2-eno", answer:["CH₃","—","CH","=","CH","—","CH₂","—","CH₃"], extras:["≡","CH₂"], hint:"Cinco carbonos; C=C debe comenzar en C2.", explain:"La fórmula correcta es CH₃—CH=CH—CH₂—CH₃." },
  { id:"pz-pent2ino", level:3, family:"Alquino", name:"pent-2-ino", answer:["CH₃","—","C","≡","C","—","CH₂","—","CH₃"], extras:["=","CH"], hint:"El triple enlace queda entre C2 y C3.", explain:"Cinco carbonos con C≡C en C2: CH₃—C≡C—CH₂—CH₃." },
  { id:"pz-metilbutano", level:3, family:"Ramificado", name:"2-metilbutano", answer:["CH₃","—","CH(CH₃)","—","CH₂","—","CH₃"], extras:["CH","C(CH₃)₂"], hint:"La cadena principal es butano y la rama CH₃ está en C2.", explain:"La rama metil se incluye como CH(CH₃): CH₃—CH(CH₃)—CH₂—CH₃." },
  { id:"pz-dimetilpropano", level:3, family:"Ramificado", name:"2,2-dimetilpropano", answer:["CH₃","—","C(CH₃)₂","—","CH₃"], extras:["CH(CH₃)","CH₂"], hint:"El carbono central se une a cuatro CH₃, por lo que no tiene H.", explain:"Dos metilos en C2 producen CH₃—C(CH₃)₂—CH₃." },
  { id:"pz-but2ol", level:3, family:"Alcohol", name:"butan-2-ol", answer:["CH₃","—","CH(OH)","—","CH₂","—","CH₃"], extras:["CO","CHO"], hint:"Cuatro carbonos y OH en el segundo carbono.", explain:"El C2 se representa como CH(OH): CH₃—CH(OH)—CH₂—CH₃." },
  { id:"pz-butanal", level:3, family:"Aldehído", name:"butanal", answer:["CH₃","—","CH₂","—","CH₂","—","CHO"], extras:["CO","COOH"], hint:"El grupo —CHO es terminal y cuenta como el cuarto carbono.", explain:"La estructura es CH₃—CH₂—CH₂—CHO." },
  { id:"pz-butanoico", level:3, family:"Ácido", name:"ácido butanoico", answer:["CH₃","—","CH₂","—","CH₂","—","COOH"], extras:["CHO","OH"], hint:"Cuenta el carbono del COOH dentro de los cuatro carbonos.", explain:"La estructura es CH₃—CH₂—CH₂—COOH." },
];

const puzzleStorageKey = "carbon-nomenclature-puzzle-v1";
const puzzleIds = new Set(puzzles.map((puzzle) => puzzle.id));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validPuzzleIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((id): id is string => typeof id === "string" && puzzleIds.has(id))));
}

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function NomenclaturePuzzle({ onEarn }: { onEarn: (amount: number) => void }) {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [index, setIndex] = useState(0);
  const [bank, setBank] = useState<Piece[]>([]);
  const [answer, setAnswer] = useState<Piece[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [completed, setCompleted] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const levelPuzzles = useMemo(() => puzzles.filter((p) => p.level === level), [level]);
  const current = levelPuzzles[Math.min(index, levelPuzzles.length - 1)];

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(puzzleStorageKey);
        if (raw) {
          const data: unknown = JSON.parse(raw);
          if (!isRecord(data)) throw new Error("Progreso del puzle no válido");
          setCompleted(validPuzzleIds(data.completed));
          setAutoNext(typeof data.autoNext === "boolean" ? data.autoNext : true);
        }
      } catch {
        try { localStorage.removeItem(puzzleStorageKey); } catch { /* El puzle seguirá funcionando sin almacenamiento. */ }
      } finally { setHydrated(true); }
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(puzzleStorageKey, JSON.stringify({ completed, autoNext })); }
    catch { /* El puzle sigue disponible aunque el navegador no permita guardar. */ }
  }, [completed, autoNext, hydrated]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  useEffect(() => { prepare(current); }, [current]);

  function prepare(puzzle: Puzzle) {
    if (timer.current) clearTimeout(timer.current);
    const pieces = [...puzzle.answer, ...puzzle.extras].map((value, i) => ({ id: `${puzzle.id}-${i}-${value}`, value }));
    setBank(shuffle(pieces)); setAnswer([]); setFeedback(null); setShowHint(false);
  }
  function moveToAnswer(piece: Piece) {
    if (feedback === "correct") return;
    setBank((old) => old.filter((p) => p.id !== piece.id)); setAnswer((old) => [...old, piece]); setFeedback(null);
  }
  function moveToBank(piece: Piece) {
    if (feedback === "correct") return;
    setAnswer((old) => old.filter((p) => p.id !== piece.id)); setBank((old) => [...old, piece]); setFeedback(null);
  }
  function undo() {
    const last = answer[answer.length - 1]; if (last) moveToBank(last);
  }
  function go(next: number) {
    if (timer.current) clearTimeout(timer.current);
    if (next < 0) return;
    if (next >= levelPuzzles.length) {
      if (level < 3) { setLevel((level + 1) as 1 | 2 | 3); setIndex(0); }
      else setIndex(0);
    } else setIndex(next);
  }
  function check() {
    if (!answer.length || feedback === "correct") return;
    const correct = answer.map((p) => p.value).join("|") === current.answer.join("|");
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      if (!completed.includes(current.id)) { setCompleted((old) => [...old, current.id]); onEarn(12); }
      if (autoNext) timer.current = setTimeout(() => go(index + 1), 1700);
    }
  }
  function chooseLevel(next: 1 | 2 | 3) { setLevel(next); setIndex(0); }

  const levelDone = levelPuzzles.filter((p) => completed.includes(p.id)).length;
  return <div className="puzzle-shell">
    <div className="puzzle-head">
      <div><span>PUZLE DE PIEZAS</span><h2>Construye la molécula</h2><p>Pulsa las piezas en el orden correcto. Toca una pieza colocada para devolverla.</p></div>
      <label><input type="checkbox" checked={autoNext} onChange={(e) => setAutoNext(e.target.checked)}/> Avance automático</label>
    </div>
    <div className="puzzle-levels">
      {([1,2,3] as const).map((value) => { const all=puzzles.filter((p) => p.level === value); const done=all.filter((p) => completed.includes(p.id)).length; return <button key={value} className={level === value ? "active" : ""} onClick={() => chooseLevel(value)}><span>{value}</span><div><b>{value === 1 ? "Fundamentos" : value === 2 ? "Posiciones y funciones" : "Reto avanzado"}</b><small>{done}/{all.length} completados</small></div></button>; })}
    </div>
    <div className="puzzle-progress"><i style={{ width: `${levelDone / levelPuzzles.length * 100}%` }}/></div>
    <article className={`puzzle-card ${feedback ?? ""}`}>
      <div className="puzzle-meta"><span>NIVEL {level} · {current.family}</span><small>PUZLE {index + 1} DE {levelPuzzles.length}</small></div>
      <p>Construye la fórmula semidesarrollada de:</p>
      <h2>{current.name}</h2>
      <div className={`puzzle-answer ${answer.length ? "" : "empty"}`} aria-label="Fórmula construida">
        {answer.map((piece) => <button key={piece.id} onClick={() => moveToBank(piece)}>{piece.value}</button>)}
      </div>
      <div className="puzzle-bank" aria-label="Piezas disponibles">
        {bank.map((piece) => <button key={piece.id} onClick={() => moveToAnswer(piece)}>{piece.value}</button>)}
      </div>
      {showHint && !feedback && <div className="puzzle-hint"><b>Pista</b>{current.hint}</div>}
      {feedback && <div className={`puzzle-feedback ${feedback}`}><span>{feedback === "correct" ? "✓" : "↺"}</span><div><b>{feedback === "correct" ? "¡Molécula construida!" : "Las piezas aún no encajan"}</b><p>{feedback === "correct" ? current.explain : current.hint}</p>{feedback === "correct" && autoNext && <small>Siguiente puzle automáticamente…</small>}</div></div>}
      <div className="puzzle-actions">
        <button disabled={index === 0} onClick={() => go(index - 1)}>← Anterior</button>
        <button disabled={!answer.length || feedback === "correct"} onClick={undo}>↶ Deshacer</button>
        <button onClick={() => prepare(current)}>Limpiar</button>
        <button className="hint" onClick={() => setShowHint(true)}>✦ Pista</button>
        {feedback === "correct" ? <button className="primary" onClick={() => go(index + 1)}>Siguiente →</button> : <button className="primary" disabled={!answer.length} onClick={check}>Comprobar</button>}
      </div>
    </article>
  </div>;
}
