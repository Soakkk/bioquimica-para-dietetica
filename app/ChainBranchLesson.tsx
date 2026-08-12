"use client";

import { useEffect, useRef, useState } from "react";

type Exercise = {
  title: string;
  prompt: string;
  diagram: "five-methyl" | "six-methyl" | "six-ethyl" | "dimethyl";
  options: string[];
  answer: number;
  hint: string;
  explain: string;
};

const exercises: Exercise[] = [
  {
    title: "Nivel 1 · Solo encuentra la longitud",
    prompt: "¿Cuántos carbonos tiene la cadena continua más larga?",
    diagram: "five-methyl",
    options: ["4 carbonos", "5 carbonos", "6 carbonos"],
    answer: 1,
    hint: "Empieza en el CH₃ superior, baja por CH₂, atraviesa el punto de unión y continúa hacia la derecha.",
    explain: "El recorrido más largo contiene 5 carbonos. El CH₃ izquierdo no desaparece: queda fuera como sustituyente.",
  },
  {
    title: "Nivel 1 · Sigue los carbonos",
    prompt: "Al redibujar la cadena principal, ¿qué CH₃ queda como rama?",
    diagram: "five-methyl",
    options: ["A, el CH₃ izquierdo", "F, el CH₃ superior", "D, el CH₃ derecho"],
    answer: 0,
    hint: "El recorrido elegido es F—E—B—C—D. Busca qué letra no aparece en él.",
    explain: "A sigue unido a B, pero no forma parte del recorrido F—E—B—C—D. Por eso A queda como rama metil.",
  },
  {
    title: "Nivel 2 · Nombra el primer caso",
    prompt: "¿Cuál es el nombre correcto de la molécula?",
    diagram: "five-methyl",
    options: ["2-etilbutano", "3-metilpentano", "3-etilpentano"],
    answer: 1,
    hint: "La cadena tiene 5 C, no 4. La única rama contiene un carbono y está en el centro.",
    explain: "Cinco carbonos forman pentano; A es un metil unido al C3. El nombre es 3-metilpentano.",
  },
  {
    title: "Nivel 2 · Identifica la rama",
    prompt: "Después de elegir la cadena de 6 carbonos, ¿qué queda como sustituyente?",
    diagram: "six-methyl",
    options: ["Una rama metil", "Una rama etil", "No queda ninguna rama"],
    answer: 0,
    hint: "El camino principal utiliza la parte superior y la derecha. Mira cuántos carbonos quedan a la izquierda del punto de unión.",
    explain: "Fuera de la cadena queda un solo CH₃. Una rama de un carbono se llama metil.",
  },
  {
    title: "Nivel 2 · Completa el nombre",
    prompt: "Cadena de 6 C, una rama CH₃ en C3: ¿qué nombre construyes?",
    diagram: "six-methyl",
    options: ["3-metilhexano", "4-metilhexano", "3-etilpentano"],
    answer: 0,
    hint: "6 C = hexano; CH₃ = metil. Escoge el extremo que deja la rama en 3 y no en 4.",
    explain: "La cadena es hexano y se numera para dar a la rama el localizador 3: 3-metilhexano.",
  },
  {
    title: "Nivel 3 · Cuenta los brazos",
    prompt: "Los brazos desde el CH central miden 3, 2 y 2 C. ¿Cuántos C tendrá la cadena principal?",
    diagram: "six-ethyl",
    options: ["5 carbonos", "6 carbonos", "8 carbonos"],
    answer: 1,
    hint: "Usa dos brazos, no los tres: 3 + carbono central + 2.",
    explain: "Un camino no puede bifurcarse. Elegimos dos brazos: 3 + 1 central + 2 = 6 carbonos.",
  },
  {
    title: "Nivel 3 · Construye el nombre",
    prompt: "¿Cuál es el nombre correcto de esta molécula?",
    diagram: "six-ethyl",
    options: ["3-propilpentano", "3-etilhexano", "3-metilheptano"],
    answer: 1,
    hint: "Desde el punto de unión, los brazos miden 3, 2 y 2 carbonos. Elige los dos más largos para la cadena.",
    explain: "La cadena principal tiene 6 carbonos: hexano. El brazo de 2 carbonos que queda fuera es etil y se une al C3: 3-etilhexano.",
  },
  {
    title: "Nivel 4 · Detecta el error",
    prompt: "¿Por qué «3-propilpentano» no es correcto para este dibujo?",
    diagram: "six-ethyl",
    options: ["Porque propil no existe", "Porque hay una cadena continua más larga de 6 C", "Porque siempre debe elegirse la línea horizontal"],
    answer: 1,
    hint: "Antes de nombrar una rama, comprueba si alguno de sus carbonos puede pertenecer al recorrido más largo.",
    explain: "Llamarla propil obliga a usar una cadena de solo 5 C. Existe un recorrido continuo de 6 C, que debe elegirse primero.",
  },
  {
    title: "Nivel 4 · Varias ramas",
    prompt: "¿Cómo se nombra la estructura ya orientada sobre su cadena principal?",
    diagram: "dimethyl",
    options: ["2,4-dimetilhexano", "2,4-metilhexano", "3,5-dimetilhexano"],
    answer: 0,
    hint: "Hay dos ramas iguales, por eso necesitas di-. Numera desde el extremo que da 2 y 4, no 3 y 5.",
    explain: "La base es hexano. Hay dos metilos en C2 y C4, así que se escribe un localizador por cada rama: 2,4-dimetilhexano.",
  },
];

function Molecule({ kind, reveal = false }: { kind: Exercise["diagram"]; reveal?: boolean }) {
  if (kind === "five-methyl") return <div className={`branch-molecule bm-five ${reveal ? "revealed" : ""}`} aria-label="Molécula ramificada de seis carbonos">
    <div className="bm-row bm-top"><span data-id="F">CH₃</span><i/><span data-id="E">CH₂</span></div>
    <div className="bm-vertical"/>
    <div className="bm-row bm-bottom"><span data-id="A">CH₃</span><i/><span data-id="B" className="junction">CH</span><i/><span data-id="C">CH₂</span><i/><span data-id="D">CH₃</span></div>
  </div>;

  if (kind === "six-methyl") return <div className={`branch-molecule bm-six-methyl ${reveal ? "revealed" : ""}`} aria-label="Molécula ramificada con cadena principal de seis carbonos">
    <div className="bm-row bm-top"><span>CH₂</span><i/><span>CH₃</span></div>
    <div className="bm-vertical"/>
    <div className="bm-row bm-bottom"><span className="branch-left">CH₃</span><i/><span className="junction">CH</span><i/><span>CH₂</span><i/><span>CH₂</span><i/><span>CH₃</span></div>
  </div>;

  if (kind === "six-ethyl") return <div className={`branch-molecule bm-six-ethyl ${reveal ? "revealed" : ""}`} aria-label="Molécula con tres brazos unidos a un carbono central">
    <div className="bm-row bm-top"><span>CH₂</span><i/><span>CH₂</span><i/><span>CH₃</span></div>
    <div className="bm-vertical"/>
    <div className="bm-row bm-bottom"><span className="branch-left">CH₃</span><i/><span className="branch-left">CH₂</span><i/><span className="junction">CH</span><i/><span>CH₂</span><i/><span>CH₃</span></div>
  </div>;

  return <div className={`branch-molecule bm-dimethyl ${reveal ? "revealed" : ""}`} aria-label="Cadena de seis carbonos con dos ramas metil">
    <div className="bm-row bm-bottom"><span>CH₃</span><i/><span className="junction">CH</span><i/><span>CH₂</span><i/><span className="junction">CH</span><i/><span>CH₂</span><i/><span>CH₃</span></div>
    <div className="bm-down bm-down-one"><i/><span className="branch-left">CH₃</span></div>
    <div className="bm-down bm-down-two"><i/><span className="branch-left">CH₃</span></div>
  </div>;
}

export default function ChainBranchLesson({ onEarn, onAsk, embedded = false }: { onEarn: (amount: number) => void; onAsk: (text: string) => void; embedded?: boolean }) {
  const [view, setView] = useState<"theory" | "practice">("theory");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [hint, setHint] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [completed, setCompleted] = useState<number[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = exercises[index];

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem("carbon-chain-branch-v1");
        if (raw) {
          const data = JSON.parse(raw);
          setCompleted(data.completed ?? []);
          setAutoNext(data.autoNext ?? true);
        }
      } catch { /* El entrenamiento sigue funcionando sin progreso guardado. */ }
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    localStorage.setItem("carbon-chain-branch-v1", JSON.stringify({ completed, autoNext }));
  }, [completed, autoNext]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function go(next: number) {
    if (timer.current) clearTimeout(timer.current);
    setIndex(Math.max(0, Math.min(exercises.length - 1, next)));
    setPicked(null); setFeedback(null); setHint(false);
  }

  function check() {
    if (picked === null) return;
    const right = picked === current.answer;
    setFeedback(right ? "correct" : "wrong");
    if (right && !completed.includes(index)) {
      setCompleted((old) => [...old, index]);
      onEarn(12);
    }
    if (right && autoNext && index < exercises.length - 1) timer.current = setTimeout(() => go(index + 1), 2200);
  }

  return <section className="branch-course">
    {embedded && <div className="embedded-activity-title"><span>PASO 4 · TALLER GUIADO</span><h3>Cadena principal y sustituyentes</h3><p>La explicación visual y los ejercicios de la parte más difícil están reunidos aquí.</p></div>}
    <div className="branch-course-tabs">
      <button className={view === "theory" ? "active" : ""} onClick={() => setView("theory")}><span>1</span><b>Explicación visual</b><small>Rama, sustituyente y cadena</small></button>
      <button className={view === "practice" ? "active" : ""} onClick={() => setView("practice")}><span>2</span><b>Ejercicios aplicados</b><small>{completed.length}/{exercises.length} dominados</small></button>
    </div>

    {view === "theory" ? <div className="branch-theory">
      <header><span>LECCIÓN VISUAL · CADENA Y RAMAS</span><h2>“Rama” y “sustituyente” son la misma idea</h2><p><b>Rama</b> es la palabra visual. <b>Sustituyente</b> es el nombre químico del grupo que queda fuera de la cadena principal y ocupa el lugar que podría tener un H.</p></header>

      <div className="branch-vocabulary">
        <article><span className="term-number">01</span><b>Cadena principal</b><p>El recorrido continuo que elegimos como base del nombre. En estos alcanos sencillos, buscamos primero el más largo.</p></article>
        <article><span className="term-number">02</span><b>Rama o sustituyente</b><p>El grupo carbonado que queda fuera de ese recorrido pero sigue conectado a él: —CH₃ es metil y —CH₂—CH₃ es etil.</p></article>
        <article><span className="term-number">03</span><b>Localizador</b><p>El número del carbono de la cadena principal donde se engancha el sustituyente.</p></article>
      </div>

      <article className="same-molecule-lesson">
        <div className="lesson-copy"><span>PASO CLAVE</span><h3>No movemos átomos: cambiamos el recorrido</h3><p>Las letras permiten seguir cada carbono. En ambos dibujos existen exactamente los mismos enlaces: <b>A—B, B—C, C—D, B—E y E—F</b>.</p><div className="not-bond"><b>A no está unido a E</b><small>El primer CH₃ de la cadena redibujada es F, no A.</small></div></div>
        <div className="same-molecule-diagrams">
          <div><small>DIBUJO ORIGINAL</small><Molecule kind="five-methyl"/></div>
          <span className="redraw-arrow">↓ <b>redibujar</b></span>
          <div><small>RECORRIDO MÁS LARGO</small><div className="redrawn-chain"><span data-id="F">CH₃</span><i/><span data-id="E">CH₂</span><i/><span data-id="B">CH</span><i/><span data-id="C">CH₂</span><i/><span data-id="D">CH₃</span><div className="redrawn-branch"><i/><span data-id="A">CH₃</span></div></div><p>F—E—B—C—D = 5 C; A queda como metil.</p></div>
        </div>
      </article>

      <div className="branch-rules">
        <h3>El método que debes repetir siempre</h3>
        <ol>
          <li><span>1</span><div><b>Busca los puntos de unión</b><p>Son carbonos desde los que salen tres o más direcciones.</p></div></li>
          <li><span>2</span><div><b>Prueba caminos completos</b><p>Puedes girar, subir o bajar. No puedes saltar, bifurcarte ni pasar dos veces por el mismo C.</p></div></li>
          <li><span>3</span><div><b>Elige el recorrido más largo</b><p>La orientación del dibujo no importa: horizontal no significa “principal”.</p></div></li>
          <li><span>4</span><div><b>Marca lo que queda fuera</b><p>Eso será el sustituyente: 1 C = metil; 2 C = etil.</p></div></li>
          <li><span>5</span><div><b>Numera y nombra</b><p>Da a la rama el localizador más bajo y combina: 3 + metil + pentano.</p></div></li>
        </ol>
      </div>

      <div className="arm-trick"><div><span>TRUCO PARA UNA INTERSECCIÓN</span><h3>Cuenta los tres brazos</h3><p>En un único punto de unión, un camino continuo puede entrar por un brazo y salir por otro. Elige los <b>dos brazos más largos</b> y suma también el carbono central. El tercer brazo queda como sustituyente.</p></div><div className="arm-equation"><span>brazo largo</span><b>+</b><span>CH central</span><b>+</b><span>brazo largo</span><strong>= cadena principal</strong></div></div>

      <div className="branch-theory-actions"><button className="ask-theory" onClick={() => onAsk("Explícame con letras por qué al redibujar una molécula ramificada no se crean enlaces nuevos y cómo elijo los dos brazos de la cadena principal.")}>¿Todavía tienes dudas? Preguntar al tutor</button><button className="primary" onClick={() => { setView("practice"); go(0); }}>Empezar ejercicios →</button></div>
    </div> : <div className="branch-practice">
      <header className="branch-practice-head"><div><span>ENTRENAMIENTO GUIADO</span><h2>Cadena principal y sustituyentes</h2></div><label><input type="checkbox" checked={autoNext} onChange={(e) => setAutoNext(e.target.checked)}/> Continuar automáticamente</label></header>
      <div className="branch-exercise-map">{exercises.map((exercise, i) => <button key={`${exercise.title}-${i}`} onClick={() => go(i)} className={`${i === index ? "current" : ""} ${completed.includes(i) ? "done" : ""}`}><span>{completed.includes(i) ? "✓" : i + 1}</span><b>{["Longitud","Seguimiento","Nombre","Rama","Numeración","Brazos","Nombre","Error típico","Varias ramas"][i]}</b></button>)}</div>
      <article className={`branch-exercise-card ${feedback ?? ""}`}>
        <div className="branch-exercise-meta"><span>{current.title}</span><small>{index + 1} / {exercises.length}</small></div>
        <h3>{current.prompt}</h3>
        <Molecule kind={current.diagram} reveal={feedback === "correct"}/>
        <div className="branch-answer-grid">{current.options.map((option, i) => <button key={option} onClick={() => { setPicked(i); setFeedback(null); }} className={`${picked === i ? "picked" : ""} ${feedback && i === current.answer ? "right" : ""} ${feedback === "wrong" && picked === i ? "wrong" : ""}`}><span>{String.fromCharCode(65 + i)}</span><b>{option}</b></button>)}</div>
        {hint && !feedback && <div className="branch-hint"><b>PISTA</b>{current.hint}</div>}
        {feedback && <div className={`branch-feedback ${feedback}`}><span>{feedback === "correct" ? "✓" : "↺"}</span><div><b>{feedback === "correct" ? "Correcto · +12 XP" : "Todavía no: sigue los enlaces"}</b><p>{current.explain}</p>{feedback === "correct" && autoNext && index < exercises.length - 1 && <small>Siguiente ejercicio automáticamente…</small>}</div></div>}
        <div className="branch-actions"><button disabled={index === 0} onClick={() => go(index - 1)}>← Anterior</button><button onClick={() => setHint(true)}>✦ Pista</button><button onClick={() => onAsk(`Ayúdame con este ejercicio de cadena principal sin darme la respuesta directamente: ${current.prompt}`)}>Preguntar al tutor</button>{feedback === "correct" ? <button className="primary" onClick={() => index < exercises.length - 1 ? go(index + 1) : setView("theory")}>{index < exercises.length - 1 ? "Siguiente →" : "Repasar teoría"}</button> : <button className="primary" disabled={picked === null} onClick={check}>Comprobar</button>}</div>
      </article>
    </div>}
  </section>;
}
