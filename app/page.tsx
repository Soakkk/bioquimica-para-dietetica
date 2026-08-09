"use client";

import { DragEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";

type ElementKey = "C" | "H" | "O" | "N";
type Atom = { id: number; element: ElementKey; x: number; y: number };
type Bond = { id: number; a: number; b: number; order: 1 | 2 | 3 };
type Mode = "learn" | "practice" | "lab";

const valence: Record<ElementKey, number> = { C: 4, H: 1, O: 2, N: 3 };

const modules = [
  {
    id: 0,
    eyebrow: "Punto de partida",
    title: "El lenguaje de las moléculas",
    time: "18 min",
    intro: "Aprende qué significan los electrones de valencia, las rayas y las distintas formas de escribir una molécula.",
    principle: "Los electrones de valencia son los que el átomo sí tiene en su capa externa. La valencia es su capacidad habitual para formar enlaces.",
    topics: ["Capas y electrones de valencia", "Regla del octeto", "Enlace covalente", "Fórmulas molecular, semidesarrollada y desarrollada"],
    examples: [
      ["CH₄", "4 enlaces simples alrededor del C", "4 × 1 = 4"],
      ["H—O—H", "El O forma dos enlaces", "2 × 1 = 2"],
      ["NH₃", "El N forma tres enlaces", "3 × 1 = 3"],
    ],
    tip: "No digas que al carbono ‘le dan’ cuatro electrones: los comparte en enlaces covalentes.",
  },
  {
    id: 1,
    eyebrow: "Base del tema",
    title: "El átomo de carbono",
    time: "20 min",
    intro: "Domina la cuenta hasta cuatro y distingue el número de enlaces del grado de un carbono.",
    principle: "Cada raya vale uno. Un doble enlace vale dos y uno triple vale tres. El carbono neutro típico debe sumar cuatro.",
    topics: ["Tetravalencia", "Cadenas y ramificaciones", "Carbonos 1º, 2º, 3º y 4º", "Hidrógenos que faltan"],
    examples: [
      ["CH₃—CH₃", "Simple: 3 H + 1 C", "4 enlaces por C"],
      ["CH₂=CH₂", "Doble: 2 H + 2 C", "4 enlaces por C"],
      ["HC≡CH", "Triple: 1 H + 3 C", "4 enlaces por C"],
    ],
    tip: "Para saber si es primario o secundario, cuenta carbonos vecinos, no rayas ni hidrógenos.",
  },
  {
    id: 2,
    eyebrow: "Caja de herramientas",
    title: "Cómo formular y nombrar",
    time: "25 min",
    intro: "Aprende un método fijo para pasar de un nombre a una estructura y volver sin adivinar.",
    principle: "Busca la cadena principal, numérala desde el extremo que dé los números más bajos y comprueba todas las valencias al final.",
    topics: ["met-, et-, prop-, but-…", "Cadena principal", "Sustituyentes metil y etil", "Prefijos di-, tri- y tetra-"],
    examples: [
      ["propano", "prop- = 3 carbonos; -ano = simples", "CH₃—CH₂—CH₃"],
      ["propeno", "3 carbonos y un doble enlace", "CH₂=CH—CH₃"],
      ["2-metilpropano", "Cadena de 3 + metilo en C2", "CH₃—CH(CH₃)—CH₃"],
    ],
    tip: "El número indica dónde ocurre algo; el prefijo indica cuántos carbonos hay y el sufijo, la familia.",
  },
  {
    id: 3,
    eyebrow: "Familias de C e H",
    title: "Hidrocarburos",
    time: "35 min",
    intro: "Compara alcanos, alquenos, alquinos, ciclos y aromáticos a partir de su estructura.",
    principle: "Más insaturaciones significa menos hidrógenos: cada doble enlace o anillo resta H₂; cada triple enlace resta dos H₂.",
    topics: ["Alcanos", "Alquenos", "Alquinos", "Cicloalcanos", "Aromáticos y heterociclos"],
    examples: [
      ["CₙH₂ₙ₊₂", "Alcano abierto", "etano: C₂H₆"],
      ["CₙH₂ₙ", "Un doble enlace o un ciclo", "eteno: C₂H₄"],
      ["CₙH₂ₙ₋₂", "Un triple enlace", "etino: C₂H₂"],
    ],
    tip: "Un heterociclo contiene N, O o S; por eso no es estrictamente un hidrocarburo.",
  },
  {
    id: 4,
    eyebrow: "El mapa de la orgánica",
    title: "Grupos funcionales",
    time: "45 min",
    intro: "Reconoce la zona reactiva de una molécula antes de intentar nombrarla.",
    principle: "El grupo funcional manda: localízalo primero, después elige la cadena principal y finalmente numera.",
    topics: ["Alcoholes, fenoles y éteres", "Aldehídos y cetonas", "Ácidos, sales y ésteres", "Aminas y amidas", "Tioles y halogenados"],
    examples: [
      ["R—OH", "Alcohol", "etanol"],
      ["R—C(=O)—R′", "Cetona", "propanona"],
      ["R—C(=O)—OH", "Ácido carboxílico", "ácido etanoico"],
    ],
    tip: "Amina es R—NH₂; amida es R—C(=O)—NH₂. Ese carbonilo cambia la familia.",
  },
  {
    id: 5,
    eyebrow: "Misma fórmula, otra molécula",
    title: "Isomería",
    time: "25 min",
    intro: "Descubre cómo una misma fórmula molecular puede esconder estructuras y propiedades diferentes.",
    principle: "Los isómeros comparten fórmula molecular, pero difieren en la conexión o disposición espacial de sus átomos.",
    topics: ["Isomería de cadena", "De posición", "De función", "Geométrica cis/trans"],
    examples: [
      ["C₄H₁₀", "Cadena", "butano / 2-metilpropano"],
      ["C₃H₈O", "Posición", "propan-1-ol / propan-2-ol"],
      ["C₂H₆O", "Función", "etanol / dimetil éter"],
    ],
    tip: "Antes de declarar isomería, comprueba que la fórmula molecular sea exactamente la misma.",
  },
  {
    id: 6,
    eyebrow: "Conexión con la vida",
    title: "Bioquímica aplicada",
    time: "30 min",
    intro: "Usa los grupos funcionales como un código de lectura para glúcidos, lípidos y aminoácidos.",
    principle: "No memorices toda la biomolécula de golpe: recorre su esqueleto de carbono y marca cada grupo funcional.",
    topics: ["Glicerol y glucosa", "Ácidos grasos", "Aminoácidos", "Ésteres y enlace peptídico"],
    examples: [
      ["glicerol", "3 grupos —OH", "alcohol"],
      ["ácido graso", "cadena + —COOH", "ácido carboxílico"],
      ["aminoácido", "—NH₂ y —COOH", "amina + ácido"],
    ],
    tip: "El enlace peptídico es una amida y el de los triglicéridos es un éster.",
  },
];

const functionalGroups = [
  ["Alcohol", "R—OH", "etanol"], ["Fenol", "Ar—OH", "fenol"], ["Éter", "R—O—R′", "dimetil éter"],
  ["Aldehído", "R—CHO", "etanal"], ["Cetona", "R—CO—R′", "propanona"], ["Ácido", "R—COOH", "ácido etanoico"],
  ["Éster", "R—COO—R′", "etanoato de metilo"], ["Amina", "R—NH₂", "metilamina"], ["Amida", "R—CONH₂", "etanamida"],
  ["Tiol", "R—SH", "etanotiol"], ["Halogenado", "R—X", "cloroetano"], ["Sal orgánica", "R—COO⁻ M⁺", "etanoato de sodio"],
];

const questions = [
  { level: 1, title: "Detective de enlaces", prompt: "En CH₂=CH₂, ¿cuántos pares de electrones comparten los dos carbonos?", formula: "CH₂ = CH₂", options: ["1 par", "2 pares", "4 pares"], answer: 1, explain: "El signo = representa dos enlaces: son 2 pares, es decir, 4 electrones compartidos." },
  { level: 1, title: "Detective de enlaces", prompt: "¿Cuántos enlaces suma el carbono central de CH₃—CH=CH₂?", formula: "CH₃ — CH = CH₂", options: ["3", "4", "5"], answer: 1, explain: "Suma 1 con H + 1 con el C izquierdo + 2 con el C derecho = 4." },
  { level: 2, title: "Completa los hidrógenos", prompt: "Dos carbonos están unidos por un triple enlace. ¿Cuántos H lleva cada uno?", formula: "C ≡ C", options: ["1", "2", "3"], answer: 0, explain: "El triple enlace ya ocupa 3 de los 4 enlaces de cada carbono: solo queda sitio para 1 H." },
  { level: 2, title: "Completa los hidrógenos", prompt: "Completa el extremo: CH₃—CH₂—C___", formula: "CH₃ — CH₂ — C ?", options: ["H", "H₂", "H₃"], answer: 2, explain: "El carbono final solo usa un enlace con la cadena; necesita tres enlaces C—H." },
  { level: 3, title: "Constructor molecular", prompt: "Construye metano: un C unido mediante enlaces simples a cuatro H.", formula: "CH₄", options: ["Abrir el laboratorio"], answer: 0, explain: "En el laboratorio, elige el reto CH₄, coloca los cinco átomos y une cada H al C." },
  { level: 3, title: "Constructor molecular", prompt: "¿Qué estructura corresponde al eteno?", formula: "C₂H₄", options: ["CH₃—CH₃", "CH₂=CH₂", "HC≡CH"], answer: 1, explain: "El sufijo -eno indica doble enlace; cada C conserva dos enlaces para H." },
  { level: 4, title: "Traductor de fórmulas", prompt: "¿Cuál es la fórmula molecular de CH₃—CH₂—OH?", formula: "CH₃ — CH₂ — OH", options: ["C₂H₅O", "C₂H₆O", "CH₃O"], answer: 1, explain: "Cuenta todos los átomos: 2 C, 6 H y 1 O. Resultado: C₂H₆O." },
  { level: 4, title: "Traductor de fórmulas", prompt: "¿Qué tipo de representación es CH₃—CH₃?", formula: "CH₃ — CH₃", options: ["Molecular", "Semidesarrollada", "Empírica"], answer: 1, explain: "Agrupa los H con cada carbono pero muestra el enlace C—C: es semidesarrollada." },
  { level: 5, title: "Detective de carbonos", prompt: "En CH₃—CH₂—CH₃, ¿qué tipo de carbono es el central?", formula: "CH₃ — CH₂ — CH₃", options: ["Primario", "Secundario", "Terciario"], answer: 1, explain: "Está unido directamente a dos carbonos; por eso es secundario." },
  { level: 5, title: "Detective de carbonos", prompt: "Un carbono unido directamente a cuatro carbonos se llama…", formula: "       CH₃\n        |\nCH₃ — C — CH₃\n        |\n       CH₃", options: ["Tetravalente", "Cuaternario", "Carbono 4"], answer: 1, explain: "Cuaternario describe cuatro vecinos carbono. Tetravalente describe una capacidad total de cuatro enlaces." },
  { level: 6, title: "Bioquímica", prompt: "¿Qué grupo funcional caracteriza a un ácido graso?", formula: "cadena larga — COOH", options: ["Amina", "Carboxilo", "Éter"], answer: 1, explain: "Los ácidos grasos poseen una cadena hidrocarbonada y un grupo carboxilo —COOH." },
  { level: 6, title: "Bioquímica", prompt: "El enlace que une aminoácidos es químicamente una…", formula: "—C(=O)—NH—", options: ["Amida", "Cetona", "Amina"], answer: 0, explain: "El enlace peptídico contiene —C(=O)—N—, la estructura característica de una amida." },
];

const labTargets = [
  { name: "Metano", formula: "CH₄", counts: { C: 1, H: 4, O: 0, N: 0 }, orders: [1, 1, 1, 1], hint: "Pon un C en el centro y cuatro H alrededor. Todos los enlaces son simples." },
  { name: "Agua", formula: "H₂O", counts: { C: 0, H: 2, O: 1, N: 0 }, orders: [1, 1], hint: "El oxígeno necesita dos enlaces y cada hidrógeno solo uno." },
  { name: "Amoniaco", formula: "NH₃", counts: { C: 0, H: 3, O: 0, N: 1 }, orders: [1, 1, 1], hint: "El nitrógeno central forma tres enlaces simples." },
  { name: "Etano", formula: "C₂H₆", counts: { C: 2, H: 6, O: 0, N: 0 }, orders: [1, 1, 1, 1, 1, 1, 1], hint: "Une los C con un enlace simple; a cada uno le quedan tres H." },
  { name: "Eteno", formula: "C₂H₄", counts: { C: 2, H: 4, O: 0, N: 0 }, orders: [2, 1, 1, 1, 1], hint: "Usa C=C; el doble enlace deja dos H disponibles en cada C." },
  { name: "Etino", formula: "C₂H₂", counts: { C: 2, H: 2, O: 0, N: 0 }, orders: [3, 1, 1], hint: "Usa C≡C; cada C solo conserva un enlace para H." },
];

const levelNames = ["Reconocer enlaces", "Completar H", "Construir", "Traducir fórmulas", "Clasificar C", "Bioquímica"];

function Formula({ text }: { text: string }) {
  return <div className="formula" aria-label={`Fórmula ${text}`}>{text}</div>;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("learn");
  const [moduleId, setModuleId] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [questionAt, setQuestionAt] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [atoms, setAtoms] = useState<Atom[]>([]);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [bondOrder, setBondOrder] = useState<1 | 2 | 3>(1);
  const [tool, setTool] = useState<"move" | "bond" | "delete">("move");
  const [firstAtom, setFirstAtom] = useState<number | null>(null);
  const [targetAt, setTargetAt] = useState(0);
  const [labFeedback, setLabFeedback] = useState<string>("Arrastra un átomo o toca uno de la paleta para empezar.");
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorInput, setTutorInput] = useState("");
  const [tutorMessages, setTutorMessages] = useState<{ role: "user" | "tutor"; text: string }[]>([
    { role: "tutor", text: "¡Hola! Soy tu tutor del carbono. Pregúntame qué parte no te cuadra y la razonamos paso a paso." },
  ]);
  const [hydrated, setHydrated] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ id: number; dx: number; dy: number } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("carbon-lab-progress");
      if (raw) {
        const data = JSON.parse(raw);
        setCompleted(data.completed ?? []);
        setSolved(data.solved ?? []);
        setXp(data.xp ?? 0);
      }
    } finally { setHydrated(true); }
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("carbon-lab-progress", JSON.stringify({ completed, solved, xp }));
  }, [completed, solved, xp, hydrated]);

  const courseProgress = Math.round(((completed.length + solved.length) / (modules.length + questions.length)) * 100);
  const currentModule = modules[moduleId];
  const levelQuestions = questions.map((q, i) => ({ ...q, globalIndex: i })).filter((q) => q.level === level);
  const question = levelQuestions[Math.min(questionAt, levelQuestions.length - 1)];
  const currentTarget = labTargets[targetAt];

  const bondTotals = useMemo(() => {
    const totals: Record<number, number> = {};
    atoms.forEach((a) => { totals[a.id] = 0; });
    bonds.forEach((b) => { totals[b.a] = (totals[b.a] ?? 0) + b.order; totals[b.b] = (totals[b.b] ?? 0) + b.order; });
    return totals;
  }, [atoms, bonds]);

  function earn(amount: number) { setXp((v) => v + amount); }

  function markModule() {
    if (!completed.includes(moduleId)) { setCompleted((v) => [...v, moduleId]); earn(15); }
    if (moduleId < modules.length - 1) setModuleId(moduleId + 1);
  }

  function checkAnswer() {
    if (picked === null) return;
    if (picked === question.answer) {
      setFeedback("correct");
      if (!solved.includes(question.globalIndex)) { setSolved((v) => [...v, question.globalIndex]); earn(20); }
      if (question.level === 3 && question.options.length === 1) setTimeout(() => setMode("lab"), 650);
    } else setFeedback("wrong");
  }

  function nextQuestion() {
    setQuestionAt((v) => (v + 1) % levelQuestions.length);
    setPicked(null); setFeedback(null); setShowHint(false);
  }

  function addAtom(element: ElementKey, x?: number, y?: number) {
    const box = canvasRef.current?.getBoundingClientRect();
    const px = x ?? (box ? box.width / 2 + (Math.random() - .5) * 150 : 250);
    const py = y ?? (box ? box.height / 2 + (Math.random() - .5) * 100 : 180);
    setAtoms((v) => [...v, { id: Date.now() + Math.random(), element, x: Math.max(34, px), y: Math.max(34, py) }]);
    setLabFeedback(`${element} colocado. Ahora puedes moverlo o cambiar a la herramienta de enlace.`);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const element = e.dataTransfer.getData("element") as ElementKey;
    const box = e.currentTarget.getBoundingClientRect();
    if (valence[element]) addAtom(element, e.clientX - box.left, e.clientY - box.top);
  }

  function atomPointerDown(e: PointerEvent<HTMLButtonElement>, atom: Atom) {
    e.stopPropagation();
    if (tool === "delete") {
      setAtoms((v) => v.filter((a) => a.id !== atom.id));
      setBonds((v) => v.filter((b) => b.a !== atom.id && b.b !== atom.id));
      setFirstAtom(null); setLabFeedback("Átomo y sus enlaces eliminados."); return;
    }
    if (tool === "bond") {
      if (firstAtom === null) { setFirstAtom(atom.id); setLabFeedback(`Primer átomo: ${atom.element}. Elige el segundo.`); }
      else if (firstAtom !== atom.id) {
        const existing = bonds.find((b) => (b.a === firstAtom && b.b === atom.id) || (b.b === firstAtom && b.a === atom.id));
        if (existing) setBonds((v) => v.map((b) => b.id === existing.id ? { ...b, order: bondOrder } : b));
        else setBonds((v) => [...v, { id: Date.now() + Math.random(), a: firstAtom, b: atom.id, order: bondOrder }]);
        setFirstAtom(null); setLabFeedback(`Enlace ${bondOrder === 1 ? "simple" : bondOrder === 2 ? "doble" : "triple"} creado.`);
      }
      return;
    }
    const box = canvasRef.current?.getBoundingClientRect();
    if (!box) return;
    dragging.current = { id: atom.id, dx: e.clientX - box.left - atom.x, dy: e.clientY - box.top - atom.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function atomPointerMove(e: PointerEvent<HTMLButtonElement>) {
    if (!dragging.current || !canvasRef.current) return;
    const box = canvasRef.current.getBoundingClientRect();
    const x = Math.max(30, Math.min(box.width - 30, e.clientX - box.left - dragging.current.dx));
    const y = Math.max(30, Math.min(box.height - 30, e.clientY - box.top - dragging.current.dy));
    const id = dragging.current.id;
    setAtoms((v) => v.map((a) => a.id === id ? { ...a, x, y } : a));
  }

  function atomPointerUp() { dragging.current = null; }

  function removeBond(id: number) {
    if (tool === "delete") { setBonds((v) => v.filter((b) => b.id !== id)); setLabFeedback("Enlace eliminado."); }
  }

  function clearLab() { setAtoms([]); setBonds([]); setFirstAtom(null); setLabFeedback("Pizarra limpia. Construye desde cero."); }

  function checkLab() {
    if (!atoms.length) { setLabFeedback("Todavía no hay una molécula que comprobar."); return; }
    const over = atoms.find((a) => (bondTotals[a.id] ?? 0) > valence[a.element]);
    if (over) { setLabFeedback(`⚠ El ${over.element} marcado supera su valencia: tiene ${bondTotals[over.id]} y admite ${valence[over.element]}.`); return; }
    const open = atoms.find((a) => (bondTotals[a.id] ?? 0) < valence[a.element]);
    const counts = { C: 0, H: 0, O: 0, N: 0 };
    atoms.forEach((a) => counts[a.element]++);
    const sameCounts = (Object.keys(counts) as ElementKey[]).every((k) => counts[k] === currentTarget.counts[k]);
    const orders = bonds.map((b) => b.order).sort().join(",");
    const targetOrders = [...currentTarget.orders].sort().join(",");
    if (!sameCounts) { setLabFeedback(`La estructura es válida hasta aquí, pero el reto pide ${currentTarget.formula}. Revisa la cantidad de cada átomo.`); return; }
    if (open) { setLabFeedback(`Al ${open.element} seleccionado todavía le faltan ${valence[open.element] - (bondTotals[open.id] ?? 0)} enlace(s).`); return; }
    if (orders !== targetOrders) { setLabFeedback("Los átomos están, pero revisa si el enlace entre carbonos debe ser simple, doble o triple."); return; }
    setLabFeedback(`✓ ¡${currentTarget.name} correcto! Todas las valencias y enlaces encajan.`);
    earn(25);
  }

  function switchMode(next: Mode) { setMode(next); window.scrollTo({ top: 0, behavior: "smooth" }); }

  function tutorReply(raw: string) {
    const q = raw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (/electrones? de valencia|que es valencia|valencia y/.test(q)) return "Son conceptos distintos: los electrones de valencia son los electrones que el átomo SÍ tiene en su capa externa; la valencia indica cuántos enlaces suele formar. En el carbono ambos números suelen ser 4, y por eso se confunden.";
    if (/octeto|ocho electrones|8 electrones/.test(q)) return "La regla del octeto dice que muchos átomos de C, N y O son especialmente estables cuando cuentan 8 electrones a su alrededor. No significa que siempre se queden con electrones ajenos: en un enlace covalente los comparten.";
    if (/simple|doble|triple|rayas?/.test(q)) return "Cuenta rayas: — vale 1, = vale 2 y ≡ vale 3. En CH₂=CH₂, cada C suma 2 enlaces C—H y 2 del C=C: total 4. En HC≡CH suma 1 + 3: también 4.";
    if (/ch3|metilo/.test(q)) return "CH₃ tiene tres enlaces C—H, pero puede tener un cuarto enlace que aparece fuera del grupo. En CH₃—CH₃, la raya entre ambos carbonos completa la cuenta: 3 + 1 = 4. CH₃ aislado no representa el etano completo.";
    if (/primario|secundario|terciario|cuaternario|grado del carbono/.test(q)) return "Aquí no cuentas todas las rayas: cuentas únicamente cuántos carbonos tocan directamente al carbono estudiado. 1 vecino C = primario; 2 = secundario; 3 = terciario; 4 = cuaternario.";
    if (/alcano|alqueno|alquino/.test(q)) return "Mira el enlace entre carbonos: alcano solo tiene simples (-ano), alqueno contiene al menos un doble (-eno) y alquino al menos un triple (-ino). Para 2 carbonos: etano CH₃—CH₃, eteno CH₂=CH₂ y etino HC≡CH.";
    if (/alcohol|fenol|eter/.test(q)) return "Los tres contienen O, pero conectado de forma diferente: alcohol R—OH; fenol, un —OH unido directamente a un anillo aromático; éter R—O—R′. Busca primero qué hay a cada lado del oxígeno.";
    if (/aldehido|cetona/.test(q)) return "Ambos contienen C=O. Si el carbonilo está al final y aparece como —CHO, es aldehído. Si está entre dos carbonos, R—CO—R′, es cetona.";
    if (/acido|ester|carbox/.test(q)) return "El ácido carboxílico contiene —C(=O)—OH. En un éster, el H del —OH se sustituye por otro grupo carbonado: —C(=O)—O—R′. Esa pequeña diferencia cambia la familia.";
    if (/amina|amida|peptid/.test(q)) return "Una amina sencilla contiene R—NH₂. Una amida tiene un carbonilo junto al N: R—C(=O)—NH₂. El enlace peptídico de las proteínas es precisamente una amida.";
    if (/isomer/.test(q)) return "Dos isómeros tienen exactamente la misma fórmula molecular, pero distinta estructura o disposición espacial. Primer paso: cuenta C, H, O… Si las cantidades no coinciden, no son isómeros.";
    if (/formula molecular|semidesarrollada|desarrollada|empirica/.test(q)) return "La molecular solo cuenta átomos (C₂H₆); la semidesarrollada muestra grupos y enlaces importantes (CH₃—CH₃); la desarrollada dibuja todos los enlaces. La empírica reduce la proporción al mínimo: para C₂H₆ sería CH₃.";
    return "Vamos a usar el método universal: 1) identifica cada átomo, 2) cuenta las rayas que salen de él, 3) compara con C=4, H=1, O=2 y N=3, y 4) localiza el grupo funcional. Si me escribes la fórmula o el nombre concreto que te confunde, podré guiarte mejor.";
  }

  function askTutor(text = tutorInput) {
    const clean = text.trim();
    if (!clean) return;
    setTutorMessages((v) => [...v, { role: "user", text: clean }, { role: "tutor", text: tutorReply(clean) }]);
    setTutorInput("");
    setTutorOpen(true);
  }

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => switchMode("learn")} aria-label="Ir a la guía">
          <span className="brand-mark">C</span><span>Laboratorio<br/><b>del Carbono</b></span>
        </button>
        <nav aria-label="Secciones principales">
          <button className={mode === "learn" ? "active" : ""} onClick={() => switchMode("learn")}><span>01</span> Aprender</button>
          <button className={mode === "practice" ? "active" : ""} onClick={() => switchMode("practice")}><span>02</span> Practicar</button>
          <button className={mode === "lab" ? "active" : ""} onClick={() => switchMode("lab")}><span>03</span> Laboratorio</button>
        </nav>
        <div className="xp"><span>✦</span><b>{xp} XP</b><small>{courseProgress}% completado</small></div>
      </header>

      {mode === "learn" && <>
        <section className="hero">
          <div className="hero-copy">
            <span className="kicker"><i/> TEMA 1 · QUÍMICA ORGÁNICA DESDE CERO</span>
            <h1>No memorices<br/><em>moléculas.</em><br/>Aprende a leerlas.</h1>
            <p>Una ruta visual para comprender el carbono, formular compuestos y reconocer la química que hay dentro de la vida.</p>
            <div className="hero-actions">
              <button className="primary" onClick={() => document.getElementById("guide")?.scrollIntoView({ behavior: "smooth" })}>Empezar la guía <span>→</span></button>
              <button className="secondary" onClick={() => switchMode("lab")}>Abrir la pizarra</button>
            </div>
          </div>
          <div className="hero-visual" aria-label="Comparación de enlaces del carbono">
            <div className="lab-label">REGLA MAESTRA <span>EN VIVO</span></div>
            <div className="carbon-orbit"><span className="h h1">H</span><span className="h h2">H</span><span className="h h3">H</span><span className="h h4">H</span><span className="carbon">C<small>4</small></span><i className="line l1"/><i className="line l2"/><i className="line l3"/><i className="line l4"/></div>
            <div className="equation"><b>1 + 1 + 1 + 1</b><span>=</span><strong>4 enlaces</strong></div>
            <p>El carbono neutro típico siempre busca completar su cuenta.</p>
          </div>
        </section>

        <section className="quick-theory">
          <div className="section-heading"><span>ANTES DE EMPEZAR</span><h2>Cuatro ideas que desbloquean todo</h2><p>Si estas piezas encajan, el resto del tema deja de parecer una lista de nombres.</p></div>
          <div className="valence-grid">
            {(["C", "H", "O", "N"] as ElementKey[]).map((e, i) => <article className={`valence-card atom-${e.toLowerCase()}`} key={e}><span className="atom-dot">{e}<small>{valence[e]}</small></span><div><b>{["Carbono", "Hidrógeno", "Oxígeno", "Nitrógeno"][i]}</b><p>{valence[e]} enlace{valence[e] > 1 ? "s" : ""} habitual{valence[e] > 1 ? "es" : ""}</p></div></article>)}
          </div>
          <div className="bond-explainer">
            <article><span className="bond-icon">C—C</span><div><b>Simple</b><p>1 raya · 1 par · 2 e⁻</p></div></article>
            <article><span className="bond-icon">C=C</span><div><b>Doble</b><p>2 rayas · 2 pares · 4 e⁻</p></div></article>
            <article><span className="bond-icon">C≡C</span><div><b>Triple</b><p>3 rayas · 3 pares · 6 e⁻</p></div></article>
            <aside><b>La cuenta hasta 4</b><p>Cada raya ocupa una parte de la valencia. Cuantas más rayas unen los carbonos, menos sitio queda para H.</p></aside>
          </div>
        </section>

        <section className="guide" id="guide">
          <div className="guide-sidebar">
            <div className="mini-progress"><div><span>Tu ruta</span><b>{completed.length}/{modules.length} lecciones</b></div><i><u style={{ width: `${completed.length / modules.length * 100}%` }}/></i></div>
            <div className="module-list">
              {modules.map((m) => <button key={m.id} onClick={() => setModuleId(m.id)} className={moduleId === m.id ? "selected" : ""}><span>{completed.includes(m.id) ? "✓" : String(m.id + 1).padStart(2, "0")}</span><div><small>{m.eyebrow}</small><b>{m.title}</b></div><em>›</em></button>)}
            </div>
          </div>
          <div className="lesson">
            <div className="lesson-top"><div><span>{currentModule.eyebrow}</span><h2>{currentModule.title}</h2></div><small>◷ {currentModule.time}</small></div>
            <p className="lesson-intro">{currentModule.intro}</p>
            <div className="principle"><span>IDEA CLAVE</span><p>{currentModule.principle}</p></div>
            <div className="lesson-columns">
              <div><h3>Lo que vas a dominar</h3><ol>{currentModule.topics.map((t, i) => <li key={t}><span>{i + 1}</span>{t}</li>)}</ol></div>
              <div><h3>Ejemplos que debes leer</h3>{currentModule.examples.map((e) => <div className="example-row" key={e[0]}><Formula text={e[0]}/><div><b>{e[1]}</b><small>{e[2]}</small></div></div>)}</div>
            </div>
            {moduleId === 4 && <div className="group-map">{functionalGroups.map((g) => <div key={g[0]}><span>{g[0]}</span><b>{g[1]}</b><small>{g[2]}</small></div>)}</div>}
            {moduleId === 1 && <div className="degree-compare"><div><b>¿Cuántos enlaces suma?</b><strong>Valencia</strong><p>Cuenta rayas: — vale 1, = vale 2 y ≡ vale 3.</p></div><span>≠</span><div><b>¿A cuántos C toca?</b><strong>Grado</strong><p>1 C = primario; 2 = secundario; 3 = terciario; 4 = cuaternario.</p></div></div>}
            <div className="coach-tip"><span>!</span><div><b>Error frecuente</b><p>{currentModule.tip}</p></div></div>
            <div className="lesson-footer"><button className="secondary" onClick={() => switchMode("practice")}>Practicar esta idea</button><button className="primary" onClick={markModule}>{completed.includes(moduleId) ? "Siguiente lección" : "Lo he entendido · +15 XP"} <span>→</span></button></div>
          </div>
        </section>
      </>}

      {mode === "practice" && <section className="practice-page">
        <div className="page-intro"><span className="kicker"><i/> ENTRENAMIENTO ADAPTATIVO</span><h1>Piensa como un químico.</h1><p>No basta con acertar: después de cada respuesta verás la regla que permite deducirla.</p></div>
        <div className="level-tabs">{levelNames.map((name, i) => <button key={name} className={level === i + 1 ? "active" : ""} onClick={() => { setLevel(i + 1); setQuestionAt(0); setPicked(null); setFeedback(null); }}><span>{i + 1}</span><b>{name}</b><small>{questions.filter((q) => q.level === i + 1).length} retos</small></button>)}</div>
        <div className="practice-shell">
          <div className="challenge-card">
            <div className="challenge-meta"><span>NIVEL {level}</span><small>RETO {questionAt + 1} DE {levelQuestions.length}</small></div>
            <h2>{question.title}</h2><p>{question.prompt}</p><Formula text={question.formula}/>
            <div className="answers">{question.options.map((option, i) => <button key={option} onClick={() => { setPicked(i); setFeedback(null); }} className={`${picked === i ? "picked" : ""} ${feedback && i === question.answer ? "right" : ""} ${feedback === "wrong" && picked === i ? "wrong" : ""}`}><span>{String.fromCharCode(65 + i)}</span>{option}</button>)}</div>
            {feedback && <div className={`feedback ${feedback}`}><span>{feedback === "correct" ? "✓" : "↺"}</span><div><b>{feedback === "correct" ? "Exacto. +20 XP" : "Todavía no. Revisa la cuenta."}</b><p>{question.explain}</p></div></div>}
            {showHint && !feedback && <div className="hint-box">Pista: separa la estructura átomo por átomo y cuenta las rayas que salen de cada uno.</div>}
            <div className="challenge-actions"><button className="hint" onClick={() => setShowHint(true)}>✦ Dame una pista</button>{feedback === "correct" ? <button className="primary" onClick={nextQuestion}>Siguiente reto →</button> : <button className="primary" disabled={picked === null} onClick={checkAnswer}>Comprobar</button>}</div>
          </div>
          <aside className="score-card"><span>PROGRESO DEL NIVEL</span><div className="score-ring" style={{ "--score": `${solved.filter((s) => questions[s].level === level).length / levelQuestions.length * 360}deg` } as React.CSSProperties}><b>{solved.filter((s) => questions[s].level === level).length}/{levelQuestions.length}</b></div><h3>{solved.filter((s) => questions[s].level === level).length === levelQuestions.length ? "¡Nivel dominado!" : "Sigue razonando"}</h3><p>Cada error es una pista sobre qué regla debes revisar.</p><button onClick={() => switchMode("learn")}>Volver a la teoría</button></aside>
        </div>
      </section>}

      {mode === "lab" && <section className="lab-page">
        <div className="page-intro lab-intro"><span className="kicker"><i/> PIZARRA MOLECULAR</span><h1>Construye. Une. Comprueba.</h1><p>Arrastra átomos, crea enlaces y deja que el detector de valencias revise tu razonamiento.</p></div>
        <div className="target-bar"><div><span>RETO ACTUAL</span><b>{currentTarget.name} <em>{currentTarget.formula}</em></b></div><div className="target-options">{labTargets.map((t, i) => <button className={targetAt === i ? "active" : ""} onClick={() => { setTargetAt(i); clearLab(); }} key={t.name}>{t.formula}</button>)}</div><button className="target-hint" onClick={() => setLabFeedback(`Pista: ${currentTarget.hint}`)}>✦ Pista</button></div>
        <div className="lab-shell">
          <aside className="atom-palette"><span>ÁTOMOS</span>{(["C", "H", "O", "N"] as ElementKey[]).map((e) => <button key={e} draggable onDragStart={(ev) => ev.dataTransfer.setData("element", e)} onClick={() => addAtom(e)} className={`palette-atom atom-${e.toLowerCase()}`}><i>{e}</i><div><b>{e === "C" ? "Carbono" : e === "H" ? "Hidrógeno" : e === "O" ? "Oxígeno" : "Nitrógeno"}</b><small>valencia {valence[e]}</small></div><em>＋</em></button>)}<div className="palette-note"><b>Consejo</b><p>En móvil, toca para añadir. En ordenador, también puedes arrastrar.</p></div></aside>
          <div className="board-wrap">
            <div className="board-tools">
              <button className={tool === "move" ? "active" : ""} onClick={() => { setTool("move"); setFirstAtom(null); }}>✥ Mover</button>
              <div className="bond-tools"><span>ENLACE</span>{([1, 2, 3] as const).map((o) => <button key={o} className={tool === "bond" && bondOrder === o ? "active" : ""} onClick={() => { setTool("bond"); setBondOrder(o); setFirstAtom(null); }}>{o === 1 ? "—" : o === 2 ? "=" : "≡"}</button>)}</div>
              <button className={tool === "delete" ? "active danger" : ""} onClick={() => { setTool("delete"); setFirstAtom(null); }}>⌫ Borrar</button><button onClick={clearLab}>Limpiar todo</button>
            </div>
            <div className="molecule-board" ref={canvasRef} onDragOver={(e) => e.preventDefault()} onDrop={onDrop} onClick={() => setFirstAtom(null)}>
              <div className="board-watermark"><span>LAB // 01</span><b>{atoms.length ? "ANALIZANDO ESTRUCTURA" : "ARRASTRA ÁTOMOS AQUÍ"}</b></div>
              {bonds.map((bond) => {
                const a = atoms.find((x) => x.id === bond.a); const b = atoms.find((x) => x.id === bond.b); if (!a || !b) return null;
                const dx = b.x - a.x, dy = b.y - a.y, length = Math.sqrt(dx * dx + dy * dy), angle = Math.atan2(dy, dx) * 180 / Math.PI;
                return <button aria-label={`Enlace de orden ${bond.order}`} className={`drawn-bond order-${bond.order}`} key={bond.id} onClick={(e) => { e.stopPropagation(); removeBond(bond.id); }} style={{ width: length, left: a.x, top: a.y, transform: `rotate(${angle}deg)` }}><i/><i/><i/></button>;
              })}
              {atoms.map((atom) => { const used = bondTotals[atom.id] ?? 0; const status = used > valence[atom.element] ? "over" : used === valence[atom.element] ? "full" : "open"; return <button key={atom.id} aria-label={`${atom.element}, ${used} de ${valence[atom.element]} enlaces`} className={`board-atom atom-${atom.element.toLowerCase()} ${status} ${firstAtom === atom.id ? "chosen" : ""}`} style={{ left: atom.x, top: atom.y }} onPointerDown={(e) => atomPointerDown(e, atom)} onPointerMove={atomPointerMove} onPointerUp={atomPointerUp}><b>{atom.element}</b><small>{used}/{valence[atom.element]}</small></button>; })}
            </div>
            <div className="lab-status"><div className="status-key"><span><i className="open"/> Incompleto</span><span><i className="full"/> Valencia completa</span><span><i className="over"/> Exceso</span></div><button className="primary" onClick={checkLab}>Comprobar molécula</button></div>
          </div>
          <aside className="inspector"><span>ANALIZADOR</span><div className="formula-readout"><small>FÓRMULA ACTUAL</small><b>{atoms.length ? (["C", "H", "N", "O"] as ElementKey[]).map((e) => { const n = atoms.filter((a) => a.element === e).length; return n ? `${e}${n > 1 ? n : ""}` : ""; }).join("") : "—"}</b></div><div className="inspection-list">{atoms.length ? atoms.map((a, i) => <div key={a.id}><span>{a.element}{i + 1}</span><i><u style={{ width: `${Math.min(100, bondTotals[a.id] / valence[a.element] * 100)}%` }}/></i><b>{bondTotals[a.id]}/{valence[a.element]}</b></div>) : <p>Aquí verás la cuenta de enlaces de cada átomo.</p>}</div><div className="lab-message">{labFeedback}</div></aside>
        </div>
      </section>}

      <button className="tutor-launch" onClick={() => setTutorOpen((v) => !v)} aria-label="Abrir tutor de química"><span>?</span><div><b>Pregunta al tutor</b><small>Te lo explico paso a paso</small></div></button>
      {tutorOpen && <aside className="tutor-panel" aria-label="Tutor de química">
        <div className="tutor-head"><div><span>?</span><div><b>Tutor del carbono</b><small>Guía socrática · en español</small></div></div><button onClick={() => setTutorOpen(false)} aria-label="Cerrar tutor">×</button></div>
        <div className="tutor-context">Ahora estás en: <b>{mode === "learn" ? currentModule.title : mode === "practice" ? `Nivel ${level}: ${levelNames[level - 1]}` : `Laboratorio · ${currentTarget.name}`}</b></div>
        <div className="tutor-chat">{tutorMessages.map((m, i) => <div className={`tutor-message ${m.role}`} key={i}><span>{m.role === "tutor" ? "C" : "Tú"}</span><p>{m.text}</p></div>)}</div>
        <div className="tutor-chips"><button onClick={() => askTutor("¿Por qué el carbono hace 4 enlaces?")}>¿Por qué C hace 4?</button><button onClick={() => askTutor("Diferencia entre amina y amida")}>Amina vs. amida</button></div>
        <form className="tutor-form" onSubmit={(e) => { e.preventDefault(); askTutor(); }}><input value={tutorInput} onChange={(e) => setTutorInput(e.target.value)} placeholder="Escribe tu duda o una fórmula…" aria-label="Pregunta para el tutor"/><button type="submit">→</button></form>
      </aside>}

      <footer><div><span className="brand-mark">C</span><b>Laboratorio del Carbono</b></div><p>Comprender · dibujar · comprobar</p><button onClick={() => { localStorage.removeItem("carbon-lab-progress"); setCompleted([]); setSolved([]); setXp(0); }}>Reiniciar progreso</button></footer>
    </main>
  );
}
