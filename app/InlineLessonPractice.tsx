"use client";

import { useMemo, useState } from "react";

export type LessonQuestion = {
  globalIndex: number;
  level: number;
  title: string;
  prompt: string;
  formula: string;
  options: string[];
  answer: number;
  explain: string;
};

export default function InlineLessonPractice({
  moduleId,
  moduleTitle,
  questions,
  solved,
  initialGlobalIndex,
  onSolve,
  onOpenLab,
}: {
  moduleId: number;
  moduleTitle: string;
  questions: LessonQuestion[];
  solved: number[];
  initialGlobalIndex: number | null;
  onSolve: (globalIndex: number) => void;
  onOpenLab: (globalIndex: number) => void;
}) {
  const returnedIndex = initialGlobalIndex === null ? -1 : questions.findIndex((question) => question.globalIndex === initialGlobalIndex);
  const [index, setIndex] = useState(returnedIndex >= 0 ? returnedIndex : 0);
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [hint, setHint] = useState(false);
  const [revealed, setRevealed] = useState(moduleId !== 2 && moduleId !== 3);
  const current = questions[Math.min(index, Math.max(0, questions.length - 1))];
  const solvedHere = useMemo(() => questions.filter((question) => solved.includes(question.globalIndex)).length, [questions, solved]);

  function go(next: number) {
    setIndex(Math.max(0, Math.min(questions.length - 1, next)));
    setPicked(null); setFeedback(null); setHint(false);
    setRevealed(moduleId !== 2 && moduleId !== 3);
  }

  function check() {
    if (picked === null || !current) return;
    const correct = picked === current.answer;
    setFeedback(correct ? "correct" : "wrong");
    if (correct && !solved.includes(current.globalIndex)) onSolve(current.globalIndex);
  }

  if (!current) return null;

  return <section className="inline-practice" id="lesson-practice">
    <header className="inline-practice-head"><div><span>PASO 3 · PRACTICAR SIN SALIR DEL TEMA</span><h3>Ejercicios de «{moduleTitle}»</h3><p>Todos los ejercicios de este bloque corresponden únicamente a la teoría que acabas de estudiar.</p></div><div className="inline-score"><b>{solvedHere}/{questions.length}</b><small>dominados</small></div></header>
    <div className="inline-question-map">{questions.map((question, i) => <button key={question.globalIndex} aria-label={`Ir al ejercicio ${i + 1}`} onClick={() => go(i)} className={`${i === index ? "current" : ""} ${solved.includes(question.globalIndex) ? "done" : ""}`}>{solved.includes(question.globalIndex) ? "✓" : i + 1}</button>)}</div>
    <article className="inline-question">
      <div className="inline-meta"><span>NIVEL {current.level} · EJERCICIO {index + 1}</span><small>{current.title}</small></div>
      <h4>{current.prompt}</h4>
      <div className="inline-formula">{current.formula}</div>

      {current.options.length === 1 ? <div className="inline-lab-task"><span>⚗</span><div><b>Este ejercicio se resuelve construyendo</b><p>La pizarra se abrirá con el reto correcto y, al terminar, volverás a esta lección.</p></div><button onClick={() => onOpenLab(current.globalIndex)}>Abrir actividad guiada →</button></div> : !revealed ? <div className="inline-active-recall"><span>✎</span><div><b>Producción antes que reconocimiento</b><p>Resuélvelo en papel. Después muestra las opciones para comprobar tu razonamiento.</p></div><button onClick={() => setRevealed(true)}>Ya lo he intentado · mostrar opciones</button></div> : <div className="inline-options">{current.options.map((option, i) => <button key={option} onClick={() => { setPicked(i); setFeedback(null); }} className={`${picked === i ? "picked" : ""} ${feedback && i === current.answer ? "right" : ""} ${feedback === "wrong" && picked === i ? "wrong" : ""}`}><span>{String.fromCharCode(65 + i)}</span><b>{option}</b></button>)}</div>}

      {hint && !feedback && <div className="inline-hint"><b>PISTA</b>{moduleId === 2 ? "Desmonta el nombre o la fórmula en este orden: cadena principal → insaturaciones → sustituyentes → localizadores → valencias." : moduleId === 3 ? "Clasifica en este orden: solo C/H → cadena abierta o cerrada → simple, doble o triple → familia." : "Vuelve a la idea clave y analiza la fórmula átomo por átomo."}</div>}
      {feedback && <div className={`inline-feedback ${feedback}`} role="status" aria-live="polite"><span>{feedback === "correct" ? "✓" : "↺"}</span><div><b>{feedback === "correct" ? "Correcto · concepto afianzado" : "Revisa el paso que has aplicado"}</b><p>{current.explain}</p></div></div>}

      <footer><button disabled={index === 0} onClick={() => go(index - 1)}>← Anterior</button><button onClick={() => setHint(true)}>✦ Pista</button>{current.options.length > 1 && revealed && (feedback === "correct" ? <button className="primary" onClick={() => go(index === questions.length - 1 ? 0 : index + 1)}>{index === questions.length - 1 ? "Repetir bloque" : "Siguiente"} →</button> : <button className="primary" disabled={picked === null} onClick={check}>Comprobar</button>)}</footer>
    </article>
  </section>;
}
