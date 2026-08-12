"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NomenclaturePuzzle from "./NomenclaturePuzzle";

type Family = "Alcanos" | "Alquenos" | "Alquinos" | "Alcoholes" | "Aldehídos" | "Cetonas" | "Ácidos" | "Ramificados";
type Direction = "name-formula" | "formula-name";
type Difficulty = 1 | 2 | 3;
type TrainerTask = {
  id: string;
  family: Family;
  difficulty: Difficulty;
  direction: Direction;
  name: string;
  formula: string;
  options: string[];
  answer: number;
  hint: string;
  explain: string;
  parts: string[];
};

const families: Family[] = ["Alcanos", "Alquenos", "Alquinos", "Alcoholes", "Aldehídos", "Cetonas", "Ácidos", "Ramificados"];

const tasks: TrainerTask[] = [
  { id:"a-etano", family:"Alcanos", difficulty:1, direction:"name-formula", name:"etano", formula:"CH₃—CH₃", options:["CH₃—CH₃","CH₂=CH₂","CH₃—CH₂—CH₃","CH₄"], answer:0, parts:["et- = 2 C","-ano = simples"], hint:"Dibuja dos carbonos con un enlace simple y completa cada C hasta cuatro.", explain:"et- indica 2 carbonos y -ano, enlaces simples: CH₃—CH₃." },
  { id:"a-propano", family:"Alcanos", difficulty:1, direction:"formula-name", name:"propano", formula:"CH₃—CH₂—CH₃", options:["etano","propano","propeno","butano"], answer:1, parts:["3 C = prop-","simples = -ano"], hint:"Cuenta tres carbonos y comprueba que no hay = ni ≡.", explain:"Tres carbonos dan prop- y los enlaces simples dan -ano: propano." },
  { id:"a-butano", family:"Alcanos", difficulty:1, direction:"name-formula", name:"butano", formula:"CH₃—CH₂—CH₂—CH₃", options:["CH₃—CH₂—CH₃","CH₃—CH₂—CH₂—CH₃","CH₂=CH—CH₂—CH₃","CH₃—CH(CH₃)—CH₃"], answer:1, parts:["but- = 4 C","-ano = simples"], hint:"Necesitas una cadena lineal de cuatro carbonos.", explain:"but- indica 4 carbonos; al ser alcano, los extremos son CH₃ y los interiores CH₂." },
  { id:"a-pentano", family:"Alcanos", difficulty:2, direction:"formula-name", name:"pentano", formula:"CH₃—CH₂—CH₂—CH₂—CH₃", options:["butano","pentano","pent-1-eno","hexano"], answer:1, parts:["5 C = pent-","simples = -ano"], hint:"Cuenta todos los grupos que contienen C: hay cinco.", explain:"Cinco carbonos y solo enlaces simples forman el pentano." },
  { id:"a-hexano", family:"Alcanos", difficulty:3, direction:"name-formula", name:"hexano", formula:"CH₃—CH₂—CH₂—CH₂—CH₂—CH₃", options:["CH₃—(CH₂)₃—CH₃","CH₃—(CH₂)₄—CH₃","CH₃—(CH₂)₅—CH₃","CH₂=CH—(CH₂)₃—CH₃"], answer:1, parts:["hex- = 6 C","-ano = simples"], hint:"En CH₃—(CH₂)ₙ—CH₃, suma también los dos CH₃ terminales.", explain:"CH₃—(CH₂)₄—CH₃ contiene 1 + 4 + 1 = 6 carbonos." },

  { id:"e-eteno", family:"Alquenos", difficulty:1, direction:"name-formula", name:"eteno", formula:"CH₂=CH₂", options:["CH₃—CH₃","CH₂=CH₂","HC≡CH","CH₂=CH—CH₃"], answer:1, parts:["et- = 2 C","-eno = C=C"], hint:"Dos carbonos unidos por un doble enlace dejan dos H en cada carbono.", explain:"et- aporta 2 carbonos y -eno exige C=C: CH₂=CH₂." },
  { id:"e-propeno", family:"Alquenos", difficulty:1, direction:"formula-name", name:"propeno", formula:"CH₂=CH—CH₃", options:["propano","propeno","propino","but-1-eno"], answer:1, parts:["3 C = prop-","C=C = -eno"], hint:"Hay tres carbonos y un signo =.", explain:"Tres carbonos y un doble enlace forman el propeno." },
  { id:"e-but1", family:"Alquenos", difficulty:2, direction:"name-formula", name:"but-1-eno", formula:"CH₂=CH—CH₂—CH₃", options:["CH₂=CH—CH₂—CH₃","CH₃—CH=CH—CH₃","HC≡C—CH₂—CH₃","CH₃—CH₂—CH₂—CH₃"], answer:0, parts:["but- = 4 C","1 = empieza en C1","-eno = C=C"], hint:"El doble enlace debe tocar el carbono del extremo.", explain:"En but-1-eno, el doble enlace empieza en C1: CH₂=CH—CH₂—CH₃." },
  { id:"e-but2", family:"Alquenos", difficulty:2, direction:"formula-name", name:"but-2-eno", formula:"CH₃—CH=CH—CH₃", options:["but-1-eno","but-2-eno","but-2-ino","butano"], answer:1, parts:["4 C = but-","C=C empieza en 2","-eno"], hint:"Numera desde cualquiera de los extremos: el doble enlace comienza en C2.", explain:"La cadena tiene 4 C y C=C está entre C2 y C3: but-2-eno." },
  { id:"e-pent2", family:"Alquenos", difficulty:3, direction:"name-formula", name:"pent-2-eno", formula:"CH₃—CH=CH—CH₂—CH₃", options:["CH₂=CH—CH₂—CH₂—CH₃","CH₃—CH=CH—CH₂—CH₃","CH₃—CH₂—CH=CH—CH₃","CH₃—C≡C—CH₂—CH₃"], answer:1, parts:["pent- = 5 C","2 = empieza en C2","-eno = C=C"], hint:"Numera desde el extremo más próximo a C=C y busca el localizador 2.", explain:"La fórmula correcta tiene 5 carbonos y el doble enlace entre C2 y C3." },

  { id:"i-etino", family:"Alquinos", difficulty:1, direction:"name-formula", name:"etino", formula:"HC≡CH", options:["CH₃—CH₃","CH₂=CH₂","HC≡CH","HC≡C—CH₃"], answer:2, parts:["et- = 2 C","-ino = C≡C"], hint:"El triple enlace usa tres valencias; queda un H para cada C.", explain:"Dos carbonos con enlace triple forman HC≡CH, el etino." },
  { id:"i-propino", family:"Alquinos", difficulty:1, direction:"formula-name", name:"propino", formula:"HC≡C—CH₃", options:["propano","propeno","propino","but-1-ino"], answer:2, parts:["3 C = prop-","C≡C = -ino"], hint:"Hay tres carbonos y un enlace triple.", explain:"prop- indica 3 carbonos y -ino identifica C≡C: propino." },
  { id:"i-but1", family:"Alquinos", difficulty:2, direction:"name-formula", name:"but-1-ino", formula:"HC≡C—CH₂—CH₃", options:["HC≡C—CH₂—CH₃","CH₃—C≡C—CH₃","CH₂=CH—CH₂—CH₃","CH₃—CH₂—CH₂—CH₃"], answer:0, parts:["but- = 4 C","1 = empieza en C1","-ino = C≡C"], hint:"El triple enlace debe comenzar en un extremo.", explain:"C≡C empieza en C1 y la cadena contiene 4 carbonos: but-1-ino." },
  { id:"i-but2", family:"Alquinos", difficulty:2, direction:"formula-name", name:"but-2-ino", formula:"CH₃—C≡C—CH₃", options:["but-1-ino","but-2-ino","but-2-eno","propino"], answer:1, parts:["4 C = but-","C≡C empieza en 2","-ino"], hint:"El triple enlace ocupa el centro de la cadena.", explain:"C≡C está entre C2 y C3: but-2-ino." },
  { id:"i-pent2", family:"Alquinos", difficulty:3, direction:"name-formula", name:"pent-2-ino", formula:"CH₃—C≡C—CH₂—CH₃", options:["HC≡C—CH₂—CH₂—CH₃","CH₃—C≡C—CH₂—CH₃","CH₃—CH₂—C≡C—CH₃","CH₃—CH=CH—CH₂—CH₃"], answer:1, parts:["pent- = 5 C","2 = empieza en C2","-ino = C≡C"], hint:"Busca cinco carbonos y C≡C entre los carbonos 2 y 3.", explain:"La estructura correcta es CH₃—C≡C—CH₂—CH₃." },

  { id:"o-metanol", family:"Alcoholes", difficulty:1, direction:"name-formula", name:"metanol", formula:"CH₃—OH", options:["CH₃—OH","CH₃—CH₂—OH","H—CHO","CH₃—O—CH₃"], answer:0, parts:["met- = 1 C","-ol = —OH"], hint:"Un solo carbono y un grupo hidroxilo —OH.", explain:"met- indica 1 carbono y -ol, alcohol: CH₃—OH." },
  { id:"o-etanol", family:"Alcoholes", difficulty:1, direction:"formula-name", name:"etanol", formula:"CH₃—CH₂—OH", options:["metanol","etanol","etanal","ácido etanoico"], answer:1, parts:["2 C = et-","—OH = -ol"], hint:"Tiene dos carbonos y termina en —OH.", explain:"Dos carbonos y un grupo alcohol producen etanol." },
  { id:"o-prop1", family:"Alcoholes", difficulty:2, direction:"name-formula", name:"propan-1-ol", formula:"CH₃—CH₂—CH₂—OH", options:["CH₃—CH₂—CH₂—OH","CH₃—CH(OH)—CH₃","CH₃—CH₂—CHO","CH₃—CO—CH₃"], answer:0, parts:["propan- = 3 C","1 = OH en C1","-ol"], hint:"El —OH debe estar en un carbono terminal.", explain:"En propan-1-ol, el OH ocupa C1: CH₃—CH₂—CH₂—OH." },
  { id:"o-prop2", family:"Alcoholes", difficulty:2, direction:"formula-name", name:"propan-2-ol", formula:"CH₃—CH(OH)—CH₃", options:["propan-1-ol","propan-2-ol","propanona","propanal"], answer:1, parts:["3 C = propan-","OH en C2","-ol"], hint:"El OH está unido al carbono central.", explain:"Tres carbonos con el OH en C2 dan propan-2-ol." },
  { id:"o-but2", family:"Alcoholes", difficulty:3, direction:"name-formula", name:"butan-2-ol", formula:"CH₃—CH(OH)—CH₂—CH₃", options:["CH₃—CH₂—CH₂—CH₂—OH","CH₃—CH(OH)—CH₂—CH₃","CH₃—CO—CH₂—CH₃","CH₃—CH₂—CH₂—CHO"], answer:1, parts:["butan- = 4 C","2 = OH en C2","-ol"], hint:"El carbono 2 debe escribirse como CH(OH).", explain:"Cuatro carbonos y OH en C2 forman CH₃—CH(OH)—CH₂—CH₃." },

  { id:"al-metanal", family:"Aldehídos", difficulty:1, direction:"name-formula", name:"metanal", formula:"H—CHO", options:["CH₃—OH","H—CHO","CH₃—CHO","H—COOH"], answer:1, parts:["met- = 1 C","-al = —CHO"], hint:"El carbono del grupo —CHO cuenta dentro de la cadena.", explain:"Un aldehído de un carbono es H—CHO: metanal." },
  { id:"al-etanal", family:"Aldehídos", difficulty:1, direction:"formula-name", name:"etanal", formula:"CH₃—CHO", options:["etanol","etanal","propanal","etanona"], answer:1, parts:["2 C = et-","—CHO = -al"], hint:"—CHO al final identifica un aldehído.", explain:"Dos carbonos y grupo terminal —CHO dan etanal." },
  { id:"al-propanal", family:"Aldehídos", difficulty:2, direction:"name-formula", name:"propanal", formula:"CH₃—CH₂—CHO", options:["CH₃—CH₂—CHO","CH₃—CO—CH₃","CH₃—CH₂—COOH","CH₃—CH(OH)—CH₃"], answer:0, parts:["prop- = 3 C","-al = —CHO"], hint:"La fórmula debe terminar en —CHO, no en —COOH.", explain:"Tres carbonos, incluyendo el de CHO, forman propanal." },
  { id:"al-butanal", family:"Aldehídos", difficulty:3, direction:"formula-name", name:"butanal", formula:"CH₃—CH₂—CH₂—CHO", options:["butan-1-ol","butan-2-ona","butanal","ácido butanoico"], answer:2, parts:["4 C = but-","—CHO = -al"], hint:"El grupo terminal es —CHO.", explain:"Cuatro carbonos y aldehído terminal forman butanal." },

  { id:"k-propanona", family:"Cetonas", difficulty:1, direction:"formula-name", name:"propanona", formula:"CH₃—CO—CH₃", options:["propanal","propanona","propan-2-ol","ácido propanoico"], answer:1, parts:["3 C = propan-","C=O interior = -ona"], hint:"El carbonilo está entre dos carbonos.", explain:"Una cetona de tres carbonos se llama propanona." },
  { id:"k-but2", family:"Cetonas", difficulty:2, direction:"name-formula", name:"butan-2-ona", formula:"CH₃—CO—CH₂—CH₃", options:["CH₃—CH₂—CH₂—CHO","CH₃—CO—CH₂—CH₃","CH₃—CH(OH)—CH₂—CH₃","CH₃—CH₂—CH₂—COOH"], answer:1, parts:["butan- = 4 C","2 = C=O en C2","-ona"], hint:"La abreviatura —CO— representa un carbonilo interior.", explain:"El carbonilo de la cetona está en C2: CH₃—CO—CH₂—CH₃." },
  { id:"k-pent2", family:"Cetonas", difficulty:3, direction:"formula-name", name:"pentan-2-ona", formula:"CH₃—CO—CH₂—CH₂—CH₃", options:["pentanal","pentan-2-ona","pentan-3-ona","pentan-2-ol"], answer:1, parts:["5 C = pentan-","C=O en C2","-ona"], hint:"Numera desde el extremo más próximo al carbonilo.", explain:"El carbonilo obtiene el localizador 2: pentan-2-ona." },

  { id:"ac-metanoico", family:"Ácidos", difficulty:1, direction:"name-formula", name:"ácido metanoico", formula:"H—COOH", options:["H—COOH","CH₃—COOH","H—CHO","CH₃—OH"], answer:0, parts:["met- = 1 C","ácido ...-oico = —COOH"], hint:"El carbono de —COOH es el único carbono.", explain:"El ácido carboxílico de un carbono es H—COOH." },
  { id:"ac-etanoico", family:"Ácidos", difficulty:1, direction:"formula-name", name:"ácido etanoico", formula:"CH₃—COOH", options:["etanal","etanol","ácido metanoico","ácido etanoico"], answer:3, parts:["2 C = etan-","—COOH = ácido ...-oico"], hint:"Cuenta también el carbono de COOH.", explain:"Dos carbonos y grupo —COOH forman el ácido etanoico." },
  { id:"ac-propanoico", family:"Ácidos", difficulty:2, direction:"name-formula", name:"ácido propanoico", formula:"CH₃—CH₂—COOH", options:["CH₃—CH₂—CHO","CH₃—CO—CH₃","CH₃—CH₂—COOH","CH₃—CH₂—CH₂—OH"], answer:2, parts:["prop- = 3 C","ácido ...-oico = —COOH"], hint:"La estructura termina en —COOH y contiene tres carbonos en total.", explain:"CH₃—CH₂—COOH contiene 3 carbonos y es ácido propanoico." },
  { id:"ac-butanoico", family:"Ácidos", difficulty:3, direction:"formula-name", name:"ácido butanoico", formula:"CH₃—CH₂—CH₂—COOH", options:["butanal","butan-1-ol","ácido propanoico","ácido butanoico"], answer:3, parts:["4 C = butan-","—COOH = ácido ...-oico"], hint:"Cuenta cuatro carbonos, incluido el del carboxilo.", explain:"Cuatro carbonos con —COOH forman el ácido butanoico." },

  { id:"r-metilprop", family:"Ramificados", difficulty:2, direction:"name-formula", name:"2-metilpropano", formula:"CH₃—CH(CH₃)—CH₃", options:["CH₃—CH₂—CH₂—CH₃","CH₃—CH(CH₃)—CH₃","CH₃—CH(CH₃)—CH₂—CH₃","CH₃—C(CH₃)₂—CH₃"], answer:1, parts:["propano = cadena de 3","2-metil = CH₃ en C2"], hint:"La cadena principal es de tres carbonos y tiene una rama CH₃ en el central.", explain:"Propano con una rama metil en C2 se escribe CH₃—CH(CH₃)—CH₃." },
  { id:"r-metilbut", family:"Ramificados", difficulty:2, direction:"formula-name", name:"2-metilbutano", formula:"CH₃—CH(CH₃)—CH₂—CH₃", options:["pentano","2-metilpropano","2-metilbutano","3-metilbutano"], answer:2, parts:["cadena de 4 = butano","rama metil en C2"], hint:"Busca la cadena continua más larga y numera desde la rama más cercana.", explain:"La cadena principal tiene 4 C y el metil está en C2: 2-metilbutano." },
  { id:"r-dimetilprop", family:"Ramificados", difficulty:3, direction:"name-formula", name:"2,2-dimetilpropano", formula:"CH₃—C(CH₃)₂—CH₃", options:["CH₃—CH(CH₃)—CH₂—CH₃","CH₃—C(CH₃)₂—CH₃","CH₃—CH(CH₃)—CH(CH₃)—CH₃","CH₃—CH₂—CH₂—CH₂—CH₃"], answer:1, parts:["propano = cadena de 3","di- = dos metilos","2,2 = ambos en C2"], hint:"El carbono central está unido a cuatro grupos CH₃ y no tiene H.", explain:"Dos ramas metil en C2 producen CH₃—C(CH₃)₂—CH₃." },
  { id:"r-dimetilbut", family:"Ramificados", difficulty:3, direction:"formula-name", name:"2,3-dimetilbutano", formula:"CH₃—CH(CH₃)—CH(CH₃)—CH₃", options:["2-metilpentano","2,2-dimetilbutano","2,3-dimetilbutano","hexano"], answer:2, parts:["cadena de 4 = butano","dos metilos = dimetil","en C2 y C3"], hint:"La cadena principal tiene cuatro carbonos y hay dos ramas CH₃.", explain:"Los metilos se encuentran en C2 y C3: 2,3-dimetilbutano." },
];

type Stats = Record<Family, { right: number; wrong: number }>;
const emptyStats = () => Object.fromEntries(families.map((f) => [f, { right: 0, wrong: 0 }])) as Stats;

export default function NomenclatureTrainer({ onEarn, onAsk }: { onEarn: (amount: number) => void; onAsk: (text: string) => void }) {
  const [activity, setActivity] = useState<"trainer" | "puzzle">("trainer");
  const [difficulty, setDifficulty] = useState<"all" | Difficulty>(1);
  const [family, setFamily] = useState<"Todas" | Family>("Todas");
  const [direction, setDirection] = useState<"mixed" | Direction>("mixed");
  const [reviewOnly, setReviewOnly] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [hint, setHint] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [mastered, setMastered] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [sessionDone, setSessionDone] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("carbon-nomenclature-progress-v1");
      if (raw) {
        const data = JSON.parse(raw);
        setMastered(data.mastered ?? []); setFailed(data.failed ?? []); setStats(data.stats ?? emptyStats());
        setAutoNext(data.autoNext ?? true);
      }
    } finally { setHydrated(true); }
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("carbon-nomenclature-progress-v1", JSON.stringify({ mastered, failed, stats, autoNext }));
  }, [mastered, failed, stats, autoNext, hydrated]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const pool = useMemo(() => tasks.filter((t) =>
    (difficulty === "all" || t.difficulty === difficulty) &&
    (family === "Todas" || t.family === family) &&
    (direction === "mixed" || t.direction === direction) &&
    (!reviewOnly || failed.includes(t.id))
  ), [difficulty, family, direction, reviewOnly, failed]);

  const current = pool[Math.min(index, Math.max(0, pool.length - 1))];
  const weakest = useMemo(() => families
    .map((f) => ({ family: f, ...stats[f], accuracy: stats[f].right + stats[f].wrong ? stats[f].right / (stats[f].right + stats[f].wrong) : 2 }))
    .filter((x) => x.accuracy <= 1)
    .sort((a, b) => a.accuracy - b.accuracy || b.wrong - a.wrong)[0], [stats]);

  function resetQuestion(nextIndex = 0) {
    if (timer.current) clearTimeout(timer.current);
    setIndex(nextIndex); setPicked(null); setFeedback(null); setHint(false); setSessionDone(false);
  }
  function changeFilters(action: () => void) { action(); resetQuestion(0); }
  function go(delta: number) {
    const next = index + delta;
    if (next < 0) return;
    if (next >= pool.length) { setSessionDone(true); return; }
    resetQuestion(next);
  }
  function check() {
    if (picked === null || !current || feedback === "correct") return;
    const correct = picked === current.answer;
    setFeedback(correct ? "correct" : "wrong");
    setStats((old) => ({ ...old, [current.family]: { ...old[current.family], [correct ? "right" : "wrong"]: old[current.family][correct ? "right" : "wrong"] + 1 } }));
    if (correct) {
      if (!mastered.includes(current.id)) { setMastered((old) => [...old, current.id]); onEarn(10); }
      if (autoNext) timer.current = setTimeout(() => go(1), 1500);
    } else if (!failed.includes(current.id)) setFailed((old) => [...old, current.id]);
  }
  function choose(value: number) { if (feedback === "correct") return; setPicked(value); setFeedback(null); }
  function practiceWeakest() {
    if (!weakest) return;
    changeFilters(() => { setFamily(weakest.family); setDifficulty("all"); setDirection("mixed"); setReviewOnly(false); });
  }

  return <section className="nomenclature-page">
    <div className="page-intro nomenclature-intro">
      <span className="kicker"><i/> GIMNASIO DE NOMENCLATURA</span>
      <h1>Lee el nombre.<br/><em>Ve la molécula.</em></h1>
      <p>Entrena en las dos direcciones, vuelve a cualquier ejercicio y concentra la práctica en las familias que más te cuestan.</p>
    </div>

    <div className="nomenclature-activity-tabs" aria-label="Actividades de nomenclatura">
      <button className={activity === "trainer" ? "active" : ""} onClick={() => setActivity("trainer")}><span>01</span><div><b>Entrenador guiado</b><small>Elegir la respuesta y analizar errores</small></div></button>
      <button className={activity === "puzzle" ? "active" : ""} onClick={() => setActivity("puzzle")}><span>02</span><div><b>Puzle de piezas</b><small>Construir fórmulas paso a paso</small></div></button>
    </div>

    {activity === "trainer" ? <div className="trainer-shell">
      <aside className="trainer-controls">
        <div className="trainer-filter">
          <span>DIFICULTAD</span>
          <div className="segmented difficulty-picker">
            {([1,2,3] as Difficulty[]).map((d) => <button key={d} className={difficulty === d ? "active" : ""} onClick={() => changeFilters(() => setDifficulty(d))}><b>{d}</b>{d === 1 ? "Inicial" : d === 2 ? "Intermedia" : "Avanzada"}</button>)}
            <button className={difficulty === "all" ? "active" : ""} onClick={() => changeFilters(() => setDifficulty("all"))}><b>∞</b>Todas</button>
          </div>
        </div>
        <div className="trainer-filter">
          <span>DIRECCIÓN</span>
          <div className="direction-picker">
            <button className={direction === "mixed" ? "active" : ""} onClick={() => changeFilters(() => setDirection("mixed"))}>Mezclada</button>
            <button className={direction === "name-formula" ? "active" : ""} onClick={() => changeFilters(() => setDirection("name-formula"))}>Nombre → fórmula</button>
            <button className={direction === "formula-name" ? "active" : ""} onClick={() => changeFilters(() => setDirection("formula-name"))}>Fórmula → nombre</button>
          </div>
        </div>
        <div className="trainer-filter">
          <span>FAMILIAS</span>
          <div className="family-picker">
            <button className={family === "Todas" ? "active" : ""} onClick={() => changeFilters(() => setFamily("Todas"))}>Todas</button>
            {families.map((f) => <button key={f} className={family === f ? "active" : ""} onClick={() => changeFilters(() => setFamily(f))}>{f}<small>{tasks.filter((t) => t.family === f && (difficulty === "all" || t.difficulty === difficulty)).length}</small></button>)}
          </div>
        </div>
        <button className={`review-button ${reviewOnly ? "active" : ""}`} onClick={() => changeFilters(() => setReviewOnly((v) => !v))}><span>↺</span><div><b>{reviewOnly ? "Mostrando mis fallos" : "Repasar mis fallos"}</b><small>{failed.length} ejercicios registrados</small></div></button>
      </aside>

      <div className="trainer-stage">
        <div className="trainer-summary">
          <div><span>SELECCIÓN ACTUAL</span><b>{pool.length} ejercicios</b></div>
          <div><span>DOMINADOS</span><b>{mastered.length}/{tasks.length}</b></div>
          <label><input type="checkbox" checked={autoNext} onChange={(e) => setAutoNext(e.target.checked)}/> Continuar automáticamente</label>
        </div>

        {!pool.length ? <div className="trainer-empty"><span>✓</span><h2>{reviewOnly ? "No hay fallos con estos filtros" : "No hay ejercicios en esta combinación"}</h2><p>Cambia la familia, la dificultad o vuelve a la práctica completa.</p><button className="primary" onClick={() => changeFilters(() => { setReviewOnly(false); setFamily("Todas"); setDifficulty("all"); setDirection("mixed"); })}>Ver todos los ejercicios</button></div> : sessionDone ? <div className="trainer-empty"><span>★</span><h2>Selección completada</h2><p>Has recorrido los {pool.length} ejercicios. Puedes repetirlos o concentrarte en otra familia.</p><div><button className="secondary" onClick={() => resetQuestion(0)}>Repetir selección</button>{weakest && <button className="primary" onClick={practiceWeakest}>Practicar {weakest.family}</button>}</div></div> : current && <>
          <div className="trainer-map" aria-label="Mapa de ejercicios">
            {pool.map((t, i) => <button key={t.id} aria-label={`Ir al ejercicio ${i + 1}`} onClick={() => resetQuestion(i)} className={`${i === index ? "current" : ""} ${mastered.includes(t.id) ? "mastered" : ""} ${failed.includes(t.id) ? "failed" : ""}`}>{i + 1}</button>)}
          </div>
          <article className="trainer-card">
            <div className="trainer-card-meta"><span>NIVEL {current.difficulty} · {current.family}</span><small>{index + 1} / {pool.length}</small></div>
            <div className="name-parts">{current.parts.map((part) => <span key={part}>{part}</span>)}</div>
            <p className="trainer-instruction">{current.direction === "name-formula" ? "Elige la fórmula semidesarrollada correcta" : "Construye el nombre correcto"}</p>
            <h2 className={current.direction === "formula-name" ? "chemical-prompt" : ""}>{current.direction === "name-formula" ? current.name : current.formula}</h2>
            <div className={`trainer-answers ${current.direction === "name-formula" ? "chemical-options" : ""}`}>
              {current.options.map((option, i) => <button key={option} onClick={() => choose(i)} className={`${picked === i ? "picked" : ""} ${feedback && i === current.answer ? "right" : ""} ${feedback === "wrong" && picked === i ? "wrong" : ""}`}><span>{String.fromCharCode(65 + i)}</span><b>{option}</b></button>)}
            </div>
            {hint && !feedback && <div className="trainer-hint"><b>Pista</b>{current.hint}</div>}
            {feedback && <div className={`trainer-feedback ${feedback}`}><span>{feedback === "correct" ? "✓" : "↺"}</span><div><b>{feedback === "correct" ? `Correcto${mastered.includes(current.id) ? "" : " · +10 XP"}` : "Revisa las piezas del nombre"}</b><p>{current.explain}</p>{feedback === "correct" && autoNext && index < pool.length - 1 && <small>Siguiente ejercicio automáticamente…</small>}</div></div>}
            <div className="trainer-actions">
              <button className="back" disabled={index === 0} onClick={() => go(-1)}>← Anterior</button>
              <button className="hint" onClick={() => setHint(true)}>✦ Pista</button>
              <button className="ask" onClick={() => onAsk(`Explícame paso a paso cómo pasar entre ${current.name} y ${current.formula}. Quiero entender el prefijo, la posición y el sufijo sin memorizar.`)}>Preguntar al tutor</button>
              {feedback === "correct" ? <button className="primary" onClick={() => go(1)}>{index === pool.length - 1 ? "Terminar" : "Siguiente"} →</button> : <button className="primary" disabled={picked === null} onClick={check}>Comprobar</button>}
            </div>
          </article>
        </>}
      </div>

      <aside className="trainer-performance">
        <span>MAPA DE DOMINIO</span>
        <h3>{weakest ? <>Conviene reforzar<br/><em>{weakest.family}</em></> : "Empieza a practicar"}</h3>
        <div className="family-scores">{families.map((f) => { const total=stats[f].right+stats[f].wrong; const pct=total?Math.round(stats[f].right/total*100):0; return <div key={f}><div><b>{f}</b><small>{total ? `${pct}%` : "sin datos"}</small></div><i><u style={{width:`${pct}%`}}/></i></div>; })}</div>
        {weakest && <button onClick={practiceWeakest}>Practicar mi punto débil →</button>}
        <p><i className="score-dot failed"/> Error registrado <i className="score-dot mastered"/> Dominado</p>
      </aside>
    </div> : <NomenclaturePuzzle onEarn={onEarn} onAsk={onAsk}/>}
  </section>;
}
