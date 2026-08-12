"use client";

import { useState } from "react";

type Priority = "diet" | "exam" | "extension";
type DepthSection = {
  id: string;
  title: string;
  priority: Priority;
  summary: string;
  theory: string[];
  examples: { formula: string; reading: string }[];
  checkpoint: string;
};

const priorityText: Record<Priority, string> = {
  diet: "Imprescindible · Dietética",
  exam: "Necesario · Tema y examen",
  extension: "Ampliación · Reconocer",
};

const namingSections: DepthSection[] = [
  {
    id: "grammar", title: "La gramática completa del nombre", priority: "diet",
    summary: "Aprende qué función cumple cada pieza antes de intentar formular.",
    theory: ["El nombre se desmonta en instrucciones: cadena principal, insaturaciones o grupo funcional, sustituyentes y localizadores.", "El prefijo de cantidad —di-, tri-, tetra-— cuenta elementos repetidos. Los números dicen dónde están. Por eso 2,3-dimetilbutano necesita dos números y el prefijo di-."],
    examples: [{ formula: "but-2-ino", reading: "but-: 4 C · 2: triple desde C2 · -ino: C≡C" }, { formula: "3-etil-2-metilhexano", reading: "hexano principal · etil en C3 · metil en C2" }],
    checkpoint: "Debes poder traducir cada fragmento del nombre en una orden de dibujo.",
  },
  {
    id: "chain", title: "Cadena principal antes que rama", priority: "diet",
    summary: "La cadena no es la línea horizontal: es el recorrido que cumplen las reglas.",
    theory: ["En los alcanos ramificados sencillos se busca primero la cadena continua más larga. Puede subir, bajar o girar; no puede bifurcarse ni pasar dos veces por el mismo carbono.", "Solo después de elegirla podemos llamar sustituyente a lo que queda fuera. Una parte que parecía etil puede incorporarse a la cadena y dejar otro CH₃ como metil."],
    examples: [{ formula: "5 C principales + —CH₃", reading: "pentano con sustituyente metil" }, { formula: "—CH₃ / —CH₂—CH₃", reading: "metil / etil cuando quedan fuera de la principal" }],
    checkpoint: "Debes justificar el recorrido carbono a carbono, no elegirlo por su orientación.",
  },
  {
    id: "number", title: "Numerar y ordenar sustituyentes", priority: "exam",
    summary: "El nombre debe dar el conjunto de localizadores más bajo posible.",
    theory: ["Se prueba la numeración desde ambos extremos y se compara el primer punto de diferencia. En un caso sencillo, la rama debe quedar en C2 y no en C4.", "Si aparecen sustituyentes diferentes, se citan por orden alfabético. Los prefijos di-, tri- y tetra- no deciden ese orden alfabético."],
    examples: [{ formula: "2,4-dimetilhexano", reading: "dos metilos: uno en C2 y otro en C4" }, { formula: "3-etil-2-metilhexano", reading: "etil se cita antes que metil por orden alfabético" }],
    checkpoint: "Debes explicar por qué numeras desde un extremo y escribir comas entre números y guiones entre números y palabras.",
  },
  {
    id: "multiple", title: "Dobles, triples y enlaces múltiples", priority: "exam",
    summary: "Los localizadores de las insaturaciones forman parte de la cadena principal.",
    theory: ["La cadena principal debe contener el mayor número posible de dobles y triples enlaces. Se numera para dar localizadores bajos a esas insaturaciones antes de considerar las ramas.", "Dos dobles enlaces usan -dieno; tres, -trieno. Dos triples usan -diino; tres, -triino. Después se completa cada carbono hasta cuatro enlaces."],
    examples: [{ formula: "hepta-2,5-dieno", reading: "7 C · dobles enlaces desde C2 y C5" }, { formula: "nona-2,4,6-triino", reading: "9 C · triples enlaces desde C2, C4 y C6" }],
    checkpoint: "Debes pasar del nombre a un esqueleto correcto y completar CH₃, CH₂, CH o C sin memorizarlo.",
  },
  {
    id: "audit", title: "Auditoría final de la fórmula", priority: "diet",
    summary: "Una formulación no termina hasta comprobar enlaces y átomos.",
    theory: ["Revisa cada carbono: la suma de órdenes de enlace debe ser cuatro. H forma uno; O, habitualmente dos; N, habitualmente tres en este nivel.", "Después cuenta todos los átomos para obtener la fórmula molecular. Esta doble comprobación detecta carbonos con cinco enlaces, H de más y cadenas mal contadas."],
    examples: [{ formula: "CH₃=CH₃ ✕", reading: "cada C sumaría 3 + 2 = 5" }, { formula: "CH₂=CH₂ ✓", reading: "cada C suma 2 + 2 = 4" }],
    checkpoint: "Debes detectar una estructura imposible aunque el nombre parezca razonable.",
  },
];

const hydrocarbonSections: DepthSection[] = [
  {
    id: "definition", title: "Qué es realmente un hidrocarburo", priority: "diet",
    summary: "Primero se decide la composición; después, la forma de la cadena y los enlaces.",
    theory: ["Un hidrocarburo contiene exclusivamente carbono e hidrógeno. Puede ser de cadena abierta o cíclico, y puede ser saturado o insaturado.", "Los heterociclos contienen N, O o S dentro del anillo. Son compuestos orgánicos cíclicos importantes, pero estrictamente no son hidrocarburos."],
    examples: [{ formula: "C₄H₁₀", reading: "solo C y H: hidrocarburo" }, { formula: "anillo con N", reading: "heterociclo, no hidrocarburo" }],
    checkpoint: "Debes clasificar primero por composición y luego por estructura.",
  },
  {
    id: "alkanes", title: "Alcanos lineales y ramificados", priority: "diet",
    summary: "Son la base para aprender esqueletos, sustituyentes y saturación.",
    theory: ["Los alcanos acíclicos tienen únicamente enlaces simples y siguen CₙH₂ₙ₊₂. Son saturados porque poseen el máximo número de H para una cadena abierta.", "Met-, et-, prop-, but-, pent-, hex-, hept-, oct-, non- y dec- cubren de 1 a 10 carbonos. Para Dietética conviene automatizar al menos hasta 10; las cadenas de 16 y 18 C aparecerán como ácidos grasos."],
    examples: [{ formula: "CH₃—(CH₂)₆—CH₃", reading: "octano: 8 C" }, { formula: "3-metiloctano", reading: "cadena principal de 8 C + metil en C3" }],
    checkpoint: "Debes contar fórmulas condensadas y reconocer ramificaciones sin perder carbonos.",
  },
  {
    id: "alkenes", title: "Alquenos, dienos y geometría", priority: "diet",
    summary: "Los dobles enlaces explican insaturación y parte de la química de las grasas.",
    theory: ["Un alqueno acíclico con un solo doble enlace sigue CₙH₂ₙ. Si hay varios, se indican todos sus localizadores y se usan -dieno, -trieno…", "Los dobles enlaces pueden ser aislados, conjugados o acumulados. En nutrición, muchos ácidos grasos poliinsaturados comunes son metileno-interrumpidos, no conjugados; el ácido linoleico conjugado es un caso particular.", "La rotación está restringida en C=C, lo que permite isomería geométrica cis/trans. Esta diferencia es relevante al estudiar grasas cis y trans."],
    examples: [{ formula: "CH₃—CH=CH—CH₂—CH₃", reading: "pent-2-eno" }, { formula: "—CH=CH—CH=CH—", reading: "dobles conjugados" }],
    checkpoint: "Debes localizar cada C=C, completar H y distinguir la cadena saturada de la insaturada.",
  },
  {
    id: "alkynes", title: "Alquinos y coexistencia de enlaces", priority: "exam",
    summary: "Profundiza la misma lógica de localizadores y tetravalencia.",
    theory: ["Un alquino acíclico con un triple enlace sigue CₙH₂ₙ₋₂. El triple enlace utiliza tres valencias de cada carbono; un carbono terminal C≡ conserva sitio para un H.", "Con varios triples se emplean -diino y -triino. Si coexisten dobles y triples hay que localizar todos; es una extensión de nomenclatura útil para los ejercicios del libro, pero menos importante en Dietética cotidiana."],
    examples: [{ formula: "CH₃—C≡C—CH₂—CH₃", reading: "pent-2-ino" }, { formula: "nona-2,5-diino", reading: "dos triples en una cadena de 9 C" }],
    checkpoint: "Debes usar la cuenta hasta cuatro para colocar correctamente los hidrógenos.",
  },
  {
    id: "cycles", title: "Cicloalcanos", priority: "exam",
    summary: "Cerrar una cadena cambia la fórmula aunque todos los enlaces sean simples.",
    theory: ["Un cicloalcano monocíclico saturado sigue CₙH₂ₙ: al formar el anillo, los dos carbonos extremos crean un enlace y se pierden dos H respecto al alcano abierto.", "Se usa ciclo- seguido del nombre del alcano. Si hay sustituyentes, se numera el anillo para obtener el conjunto de localizadores más bajo."],
    examples: [{ formula: "C₅H₁₀", reading: "ciclopentano" }, { formula: "1-etil-3-metilciclopentano", reading: "anillo de 5 C con dos sustituyentes" }],
    checkpoint: "Debes distinguir CₙH₂ₙ de un ciclo y CₙH₂ₙ de un alqueno mirando la estructura.",
  },
  {
    id: "aromatic", title: "Aromáticos y benceno", priority: "diet",
    summary: "El anillo bencénico aparece en nutrientes, fármacos y compuestos bioactivos.",
    theory: ["El benceno es C₆H₆ y posee electrones deslocalizados; el círculo dentro del hexágono representa esa deslocalización. No debe entenderse como tres dobles enlaces fijos e independientes.", "Aromático describe una estructura electrónica, no que el compuesto tenga aroma. Fenol, tolueno y anillos presentes en aminoácidos como fenilalanina son ejemplos relevantes."],
    examples: [{ formula: "C₆H₆", reading: "benceno" }, { formula: "C₆H₅—OH", reading: "fenol: aromático con grupo OH" }],
    checkpoint: "Para Dietética necesitas reconocer el anillo y sus grupos, no dominar todavía mecanismos aromáticos.",
  },
  {
    id: "heterocycles", title: "Heterociclos: reconocer, no formular aún", priority: "extension",
    summary: "Son esenciales en bioquímica, pero su nomenclatura completa puede esperar.",
    theory: ["Un heterociclo incorpora uno o más heteroátomos en el anillo. Pirrol, pirimidina y purina ayudan a reconocer estructuras de porfirinas, bases nitrogenadas, vitaminas y coenzimas.", "En esta fase basta con localizar el heteroátomo y relacionar el anillo con biomoléculas. La nomenclatura sistemática detallada no es prioritaria para la FP de Dietética."],
    examples: [{ formula: "anillo de pirimidina", reading: "base de citosina, timina y uracilo" }, { formula: "anillo de purina", reading: "base de adenina y guanina" }],
    checkpoint: "Debes reconocer N u O dentro del anillo y explicar por qué no es un hidrocarburo.",
  },
];

function PriorityBadge({ value }: { value: Priority }) {
  return <span className={`depth-priority ${value}`}>{priorityText[value]}</span>;
}

export default function CourseDepth({ moduleId, onPractice, onBranches, onAsk }: { moduleId: 2 | 3; onPractice: () => void; onBranches: () => void; onAsk: (text: string) => void }) {
  const sections = moduleId === 2 ? namingSections : hydrocarbonSections;
  const [active, setActive] = useState(sections[0].id);
  const current = sections.find((section) => section.id === active) ?? sections[0];

  return <section className="course-depth">
    <header className="depth-header"><div><span>PROFUNDIDAD AJUSTADA AL LIBRO</span><h3>{moduleId === 2 ? "Formular y nombrar, sin saltos" : "Mapa completo de los hidrocarburos"}</h3><p>{moduleId === 2 ? "Esta ruta incorpora cadena principal, sustituyentes y enlaces múltiples antes de pedirte nombres completos." : "Verás toda la clasificación del libro, pero con una señal clara de cuánto necesitas dominar para Dietética."}</p></div><div className="depth-legend"><PriorityBadge value="diet"/><PriorityBadge value="exam"/><PriorityBadge value="extension"/></div></header>

    {moduleId === 3 && <div className="hydrocarbon-tree" aria-label="Clasificación de los hidrocarburos"><div className="tree-root"><b>HIDROCARBUROS</b><small>solo C + H</small></div><i/><div className="tree-branches"><div><b>CADENA ABIERTA</b><span>Alcanos</span><span>Alquenos</span><span>Alquinos</span></div><div><b>CADENA CERRADA</b><span>Cicloalcanos</span><span>Aromáticos</span><span className="tree-warning">Heterociclos* <small>se estudian junto a ellos, pero contienen N/O/S</small></span></div></div></div>}

    <div className="depth-workspace"><nav>{sections.map((section, i) => <button key={section.id} className={active === section.id ? "active" : ""} onClick={() => setActive(section.id)}><span>{String(i + 1).padStart(2,"0")}</span><div><b>{section.title}</b><small>{section.summary}</small></div><em>→</em></button>)}</nav><article className="depth-content"><PriorityBadge value={current.priority}/><h4>{current.title}</h4><p className="depth-summary">{current.summary}</p>{current.theory.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="depth-examples">{current.examples.map((example) => <div key={example.formula}><code>{example.formula}</code><span>{example.reading}</span></div>)}</div><div className="depth-checkpoint"><span>✓</span><div><b>Objetivo de dominio</b><p>{current.checkpoint}</p></div></div></article></div>

    {moduleId === 2 ? <div className="book-translation"><div><span>TRADUCTOR DEL LIBRO</span><h4>Nomenclatura antigua, moderna y erratas</h4><p>Aprenderás la forma moderna, pero reconocerás la que aparece en las capturas.</p></div><div className="translation-table"><div><b>En el libro</b><b>Forma que usaremos</b><b>Qué ocurre</b></div><div><code>2 hexeno</code><code>hex-2-eno</code><span>Mismo compuesto; cambia la colocación moderna del localizador.</span></div><div><code>2,4,6 nonatriino</code><code>nona-2,4,6-triino</code><span>Tres triples enlaces en una cadena de 9 carbonos.</span></div><div><code>2-dimetilbutano</code><code>nombre incompleto</code><span>“di-” exige dos localizadores: por ejemplo, 2,2-dimetilbutano.</span></div><div><code>metil, propano</code><code>2-metilpropano</code><span>Falta el localizador y la puntuación correcta.</span></div></div></div> : <div className="book-corrections"><span>LECTURA CRÍTICA DEL LIBRO</span><div><article><b>Heterociclos</b><p>Se agrupan cerca de los ciclos, pero no son hidrocarburos porque contienen N, O o S.</p></article><article><b>“Aromático”</b><p>Describe estabilidad y deslocalización electrónica; no significa necesariamente que huela.</p></article><article><b>Grasas poliinsaturadas</b><p>Las más comunes no suelen ser conjugadas; los dobles enlaces conjugados son un caso específico.</p></article><article><b>Fórmulas generales</b><p>CₙH₂ₙ o CₙH₂ₙ₋₂ solo identifican una familia cuando conocemos también la estructura y el número de ciclos o insaturaciones.</p></article></div></div>}

    <div className="depth-actions"><button onClick={() => onAsk(moduleId === 2 ? "Explícame la ruta completa para pasar de un nombre orgánico a la fórmula, incluyendo cadena principal, localizadores, sustituyentes e insaturaciones." : "Explícame el mapa completo de hidrocarburos y qué partes debo dominar especialmente para Dietética.")}>Preguntar sobre este bloque</button>{moduleId === 2 && <button onClick={onBranches}>Practicar cadena y ramas</button>}<button className="primary" onClick={onPractice}>Hacer los ejercicios de esta lección →</button></div>
  </section>;
}
