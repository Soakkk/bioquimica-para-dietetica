"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Phase = "Recordar" | "Aplicar" | "Conectar";
type ReviewQuestion = {
  id: string;
  phase: Phase;
  concept: string;
  title: string;
  prompt: string;
  formula: string;
  options: string[];
  answer: number;
  hint: string;
  explain: string;
  connection: string;
};
type ReviewRoute = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  time: string;
  theory: { title: string; body: string; example: string }[];
  method: string[];
  questions: ReviewQuestion[];
};

const routes: ReviewRoute[] = [
  {
    id: "carbono",
    number: "01",
    title: "Todo sobre el carbono",
    subtitle: "Del átomo al nombre",
    description: "Relaciona electrones, tetravalencia, hidrógenos, grado, cadenas, sustituyentes e hidrocarburos.",
    time: "18–25 min",
    theory: [
      { title: "1. El punto de partida", body: "El carbono tiene 6 electrones totales y 4 electrones de valencia. Como necesita completar su segunda capa, suele compartir electrones formando cuatro enlaces. Tener 4 electrones de valencia y formar 4 enlaces son ideas relacionadas, pero no significan lo mismo.", example: "C: 2 e⁻ internos + 4 e⁻ de valencia → tetravalencia habitual" },
      { title: "2. La cuenta que controla los H", body: "Cada carbono debe sumar normalmente 4: un enlace simple vale 1, uno doble 2 y uno triple 3. Los enlaces que ya tiene el carbono determinan cuántos hidrógenos caben. Por eso aparecen CH₃, CH₂, CH o C según el entorno.", example: "CH₂=CH₂: cada C suma 2 con H + 2 del doble = 4" },
      { title: "3. Valencia no es grado", body: "Para comprobar la tetravalencia contamos todos los enlaces. Para decir que un carbono es primario, secundario, terciario o cuaternario contamos únicamente cuántos carbonos están unidos directamente a él.", example: "CH₃—CH₂—CH₃: el C central suma 4 enlaces, pero es secundario porque toca a 2 C" },
      { title: "4. Del esqueleto al nombre", body: "Primero buscamos la cadena continua más larga. Después, los grupos carbonados que quedan fuera son ramas o sustituyentes. Numeramos desde el extremo que les dé los localizadores menores y, por último, comprobamos que cada C sume cuatro.", example: "5 C principales + CH₃ en C3 → 3-metilpentano" },
    ],
    method: ["Cuenta enlaces", "Completa H", "Cuenta vecinos C", "Busca la cadena", "Nombra y comprueba"],
    questions: [
      { id:"c1", phase:"Recordar", concept:"Electrones y valencia", title:"No confundas dos números iguales", prompt:"¿Qué afirmación distingue correctamente los electrones de valencia de los enlaces?", formula:"Carbono · Z = 6", options:["Tiene 4 electrones de valencia y suele formar 4 enlaces","Tiene 6 electrones de valencia y forma 4 enlaces","Sus 4 enlaces son electrones que ya tenía"], answer:0, hint:"El número atómico 6 cuenta todos sus electrones; solo 4 están en la capa externa.", explain:"El C tiene 6 electrones totales, 4 de ellos de valencia, y habitualmente forma 4 enlaces covalentes.", connection:"Los electrones externos explican por qué el carbono puede construir tantos esqueletos moleculares." },
      { id:"c2", phase:"Recordar", concept:"Tetravalencia", title:"Cuenta órdenes de enlace", prompt:"¿Cuántos enlaces suma el carbono central?", formula:"CH₃—CH=CH₂", options:["3","4","5"], answer:1, hint:"Suma 1 con H, 1 del enlace simple izquierdo y 2 del doble derecho.", explain:"1 + 1 + 2 = 4. El doble enlace cuenta como dos, aunque conecte con un solo átomo.", connection:"Esta cuenta permite comprobar estructuras y deducir los hidrógenos que faltan." },
      { id:"c3", phase:"Aplicar", concept:"Completar hidrógenos", title:"De enlaces a hidrógenos", prompt:"¿Qué grupo debe aparecer en el extremo derecho para completar la tetravalencia?", formula:"HC≡C—C ?", options:["CH","CH₂","CH₃"], answer:2, hint:"El último carbono solo utiliza un enlace para unirse a la cadena.", explain:"Usa 1 de sus 4 enlaces con el carbono vecino y conserva 3 para H: debe ser CH₃.", connection:"La fórmula semidesarrollada no se memoriza: se obtiene restando a cuatro." },
      { id:"c4", phase:"Aplicar", concept:"Grado del carbono", title:"Cambia la pregunta", prompt:"En esta molécula, ¿qué grado tiene el carbono central CH₂?", formula:"CH₃—CH₂—CH₃", options:["Primario","Secundario","Cuaternario"], answer:1, hint:"Ahora no cuentes H ni rayas: cuenta únicamente carbonos vecinos.", explain:"El CH₂ está unido directamente a dos carbonos, por lo que es secundario.", connection:"Un carbono siempre puede sumar 4 enlaces, pero su grado depende solo de sus vecinos C." },
      { id:"c5", phase:"Aplicar", concept:"Grado del carbono", title:"Reconoce un carbono terciario", prompt:"¿Qué grado tiene el CH señalado entre paréntesis?", formula:"CH₃—CH(CH₃)—CH₂—CH₃", options:["Primario","Secundario","Terciario"], answer:2, hint:"Ese CH toca al CH₃ izquierdo, al CH₃ de la rama y al CH₂ derecho.", explain:"Tiene tres carbonos vecinos: es un carbono terciario.", connection:"La ramificación cambia el grado del carbono aunque no cambie su tetravalencia." },
      { id:"c6", phase:"Conectar", concept:"Cadena principal", title:"La horizontal puede engañarte", prompt:"En el dibujo, la fila inferior tiene 4 C y el camino superior→centro→derecha tiene 5 C. ¿Cuál es la cadena principal?", formula:"       CH₂—CH₃\n        |\nCH₃—CH—CH₂—CH₃", options:["La horizontal de 4 C","El recorrido continuo de 5 C","Los 6 C a la vez, bifurcando la cadena"], answer:1, hint:"Una cadena puede girar, pero no puede dividirse ni pasar dos veces por el mismo carbono.", explain:"La cadena principal es el recorrido continuo más largo: contiene 5 carbonos, aunque una parte esté dibujada en vertical.", connection:"Solo después de elegir el recorrido podemos decidir qué grupo es la rama." },
      { id:"c7", phase:"Conectar", concept:"Sustituyentes", title:"De rama a término químico", prompt:"Tras elegir la cadena de 5 C anterior, queda fuera un único —CH₃. ¿Cómo se llama?", formula:"cadena principal + —CH₃", options:["Etil","Metil","Propil"], answer:1, hint:"El nombre de la rama depende de cuántos carbonos contiene.", explain:"Una rama de un carbono, —CH₃, es un sustituyente metil.", connection:"“Rama” describe lo que ves; “sustituyente” es el término químico que usarás al nombrar." },
      { id:"c8", phase:"Conectar", concept:"Nomenclatura", title:"Une todas las decisiones", prompt:"La cadena más larga tiene 5 C y un metil está unido al C3. ¿Cuál es el nombre?", formula:"5 C principales · —CH₃ en C3", options:["2-etilbutano","3-metilpentano","3-etilpentano"], answer:1, hint:"5 C = pentano; una rama CH₃ = metil.", explain:"El nombre se construye como localizador + sustituyente + cadena: 3-metilpentano.", connection:"Aquí convergen cadena principal, tamaño del sustituyente y numeración." },
      { id:"c9", phase:"Conectar", concept:"Hidrocarburos", title:"El enlace cambia la familia", prompt:"¿Qué relación es correcta?", formula:"etano → eteno → etino", options:["Simple → doble → triple","Triple → doble → simple","Todos tienen los mismos H"], answer:0, hint:"Relaciona -ano, -eno e -ino con —, = y ≡.", explain:"Etano tiene C—C, eteno C=C y etino C≡C. Al aumentar el orden del enlace disminuyen los H.", connection:"La tetravalencia explica a la vez la familia del hidrocarburo y su cantidad de hidrógeno." },
      { id:"c10", phase:"Conectar", concept:"Auditoría final", title:"Detecta una estructura imposible", prompt:"¿Por qué CH₃=CH₃ no representa el alqueno neutro habitual?", formula:"CH₃=CH₃", options:["Cada C sumaría 5 enlaces","El doble enlace solo vale 1","Un carbono nunca puede unirse a H"], answer:0, hint:"Suma 3 enlaces C—H y los 2 del doble.", explain:"Cada carbono sumaría 3 + 2 = 5. La estructura correcta con dos C y doble enlace es CH₂=CH₂.", connection:"La auditoría de tetravalencia es el último control después de formular o nombrar." },
    ],
  },
  {
    id: "representaciones",
    number: "02",
    title: "Leer una molécula",
    subtitle: "Fórmulas e isomería",
    description: "Conecta fórmula molecular, empírica, semidesarrollada, desarrollada e isómeros.",
    time: "14–20 min",
    theory: [
      { title:"1. Dos fórmulas que cuentan", body:"La fórmula molecular indica la cantidad real de cada átomo en una molécula. La empírica expresa únicamente la proporción entera más sencilla; se obtiene dividiendo todos los subíndices por un divisor común.", example:"Etano: molecular C₂H₆ → empírica CH₃" },
      { title:"2. Fórmulas que muestran conexiones", body:"La semidesarrollada agrupa los H alrededor de cada carbono, pero enseña cómo se conectan los grupos. La desarrollada muestra todos los átomos y todos los enlaces. Ambas pertenecen a las representaciones estructurales.", example:"C₂H₆ → CH₃—CH₃ → dibujo con los seis enlaces C—H" },
      { title:"3. La fórmula molecular no basta", body:"Dos sustancias pueden compartir exactamente la misma fórmula molecular y tener distinta estructura. Son isómeros. Pueden cambiar el esqueleto, la posición de un grupo o incluso la familia química.", example:"C₄H₁₀: butano y 2-metilpropano son isómeros de cadena" },
    ],
    method:["Cuenta todos los átomos","Decide qué información muestra","Simplifica si es empírica","Compara conexiones","Clasifica la isomería"],
    questions:[
      { id:"r1", phase:"Recordar", concept:"Fórmula molecular", title:"Cantidad real", prompt:"¿Qué informa la fórmula molecular C₂H₆?", formula:"C₂H₆", options:["2 C y 6 H reales","La conexión C—C","La proporción mínima CH₃ únicamente"], answer:0, hint:"La fórmula molecular cuenta átomos, pero no dibuja enlaces.", explain:"C₂H₆ informa de la cantidad real de C y H en una molécula de etano.", connection:"Será la comprobación obligatoria antes de comparar posibles isómeros." },
      { id:"r2", phase:"Aplicar", concept:"Fórmula empírica", title:"Simplifica la proporción", prompt:"¿Cuál es la fórmula empírica de C₄H₈?", formula:"C₄H₈", options:["C₂H₄","CH₂","C₄H₈"], answer:1, hint:"Divide ambos subíndices por su máximo divisor común: 4.", explain:"4:8 se simplifica a 1:2, por lo que la fórmula empírica es CH₂.", connection:"La empírica puede ser igual para sustancias con tamaños y estructuras diferentes." },
      { id:"r3", phase:"Aplicar", concept:"Semidesarrollada", title:"Muestra la conexión", prompt:"¿Qué tipo de representación es CH₃—CH₂—OH?", formula:"CH₃—CH₂—OH", options:["Molecular","Semidesarrollada","Empírica"], answer:1, hint:"Agrupa H, pero conserva los enlaces entre los grupos principales.", explain:"Es semidesarrollada: permite ver C—C—O—H sin dibujar cada enlace C—H.", connection:"Da más información estructural que C₂H₆O, pero ocupa menos que la desarrollada." },
      { id:"r4", phase:"Aplicar", concept:"Traducción de fórmulas", title:"Pasa a fórmula molecular", prompt:"¿Cuál es la fórmula molecular de esta estructura?", formula:"CH₃—CH=CH—CH₃", options:["C₄H₁₀","C₄H₈","C₄H₆"], answer:1, hint:"Suma los H escritos: 3 + 1 + 1 + 3.", explain:"Hay 4 carbonos y 8 hidrógenos: C₄H₈.", connection:"Traducir representaciones permite comprobar si dos estructuras pueden ser isómeras." },
      { id:"r5", phase:"Conectar", concept:"Condición de isomería", title:"Primera comprobación", prompt:"¿Qué debe cumplirse antes de afirmar que dos compuestos son isómeros?", formula:"estructura A ↔ estructura B", options:["Mismo nombre","Misma fórmula molecular","Misma fórmula semidesarrollada"], answer:1, hint:"Los átomos deben ser los mismos en número, aunque se conecten de otra forma.", explain:"Los isómeros tienen exactamente la misma fórmula molecular y una estructura o disposición diferente.", connection:"La fórmula molecular conserva el inventario; la estructural revela la diferencia." },
      { id:"r6", phase:"Conectar", concept:"Isomería de cadena", title:"Mismos átomos, otro esqueleto", prompt:"Butano y 2-metilpropano, ambos C₄H₁₀, son isómeros de…", formula:"CH₃—CH₂—CH₂—CH₃  /  CH₃—CH(CH₃)—CH₃", options:["Cadena","Posición","Función"], answer:0, hint:"Cambia si el esqueleto es lineal o ramificado.", explain:"La conectividad del esqueleto carbonado cambia: es isomería de cadena.", connection:"La ramificación estudiada en nomenclatura también permite comprender la isomería." },
      { id:"r7", phase:"Conectar", concept:"Isomería de posición", title:"Misma familia, otra posición", prompt:"¿Qué cambia entre propan-1-ol y propan-2-ol?", formula:"CH₃—CH₂—CH₂OH  /  CH₃—CH(OH)—CH₃", options:["La fórmula molecular","La posición del OH","El número de carbonos"], answer:1, hint:"Ambos contienen 3 C y un grupo alcohol.", explain:"Comparten C₃H₈O y la familia alcohol; cambia el carbono al que se une el OH.", connection:"Los localizadores no son decoración: distinguen estructuras diferentes." },
      { id:"r8", phase:"Conectar", concept:"Isomería de función", title:"Misma fórmula, distinta familia", prompt:"Etanol y dimetil éter comparten C₂H₆O. ¿Qué tipo de isomería presentan?", formula:"CH₃—CH₂—OH  /  CH₃—O—CH₃", options:["Cadena","Posición","Función"], answer:2, hint:"Uno tiene R—OH y el otro R—O—R′.", explain:"Son un alcohol y un éter con la misma fórmula: isomería de función.", connection:"Reconocer grupos funcionales permite detectar diferencias que la fórmula molecular oculta." },
    ],
  },
  {
    id: "bioquimica",
    number: "03",
    title: "Química para Dietética",
    subtitle: "De grupos a biomoléculas",
    description: "Relaciona alcoholes, ácidos, ésteres, aminas y amidas con lípidos, glúcidos y proteínas.",
    time: "16–22 min",
    theory: [
      { title:"1. Lee por zonas", body:"En bioquímica no conviene memorizar toda una molécula de golpe. Recorre primero su esqueleto de carbono y marca patrones: —OH, —COOH, —COO—, —NH₂ y —C(=O)—N—.", example:"Aminoácido: H₂N—CH(R)—COOH → grupo amino + grupo carboxilo" },
      { title:"2. Lípidos", body:"Un ácido graso combina una cadena hidrocarbonada con un extremo carboxilo. Cuando sus ácidos reaccionan con los grupos OH del glicerol se forman enlaces éster; tres enlaces de este tipo construyen un triglicérido.", example:"glicerol + 3 ácidos grasos → triglicérido + 3 H₂O" },
      { title:"3. Proteínas y glúcidos", body:"Los aminoácidos poseen grupo amino y carboxilo, pero al unirse forman una amida llamada enlace peptídico. En los glúcidos abundan los grupos OH y puede aparecer un aldehído o una cetona.", example:"Enlace peptídico: —C(=O)—NH—" },
    ],
    method:["Busca el esqueleto C","Marca O y N","Identifica patrones","Relaciona la función","Interpreta la biomolécula"],
    questions:[
      { id:"b1", phase:"Recordar", concept:"Alcoholes", title:"Reconoce el hidroxilo", prompt:"¿Qué grupo permite identificar un alcohol?", formula:"R—OH", options:["—OH","—COOH","—NH₂"], answer:0, hint:"Contiene un oxígeno unido a un H.", explain:"El grupo hidroxilo —OH unido a un carbono caracteriza a los alcoholes.", connection:"El glicerol y muchos azúcares contienen varios grupos OH." },
      { id:"b2", phase:"Recordar", concept:"Ácidos carboxílicos", title:"El extremo de un ácido graso", prompt:"¿Qué grupo funcional aparece al final de un ácido graso?", formula:"CH₃—(CH₂)ₙ—COOH", options:["Amino","Carboxilo","Éter"], answer:1, hint:"Es la parte —COOH.", explain:"El grupo carboxilo —COOH aporta el carácter ácido.", connection:"Permite reconocer un ácido graso aunque su cadena tenga distinta longitud." },
      { id:"b3", phase:"Aplicar", concept:"Insaturación", title:"Lee la cadena lipídica", prompt:"¿Qué muestra que este ácido graso es insaturado?", formula:"—CH₂—CH=CH—CH₂—", options:["El doble enlace C=C","Los grupos CH₂","Un grupo amino oculto"], answer:0, hint:"Insaturado significa que no contiene el máximo número posible de H.", explain:"El C=C ocupa más valencias entre carbonos y reduce el número de H.", connection:"La tetravalencia del carbono explica la diferencia estructural entre grasas saturadas e insaturadas." },
      { id:"b4", phase:"Aplicar", concept:"Ésteres", title:"No lo confundas con un éter", prompt:"¿Qué patrón identifica un enlace éster?", formula:"R—C(=O)—O—R′", options:["R—O—R′","—C(=O)—O—","—C(=O)—NH—"], answer:1, hint:"Busca un carbonilo C=O inmediatamente unido a otro O.", explain:"El patrón —C(=O)—O—, abreviado —COO—, corresponde a un éster.", connection:"Es el enlace que conecta glicerol y ácidos grasos en los triglicéridos." },
      { id:"b5", phase:"Conectar", concept:"Triglicéridos", title:"De grupos funcionales a lípidos", prompt:"¿Cuántos enlaces éster contiene un triglicérido?", formula:"glicerol + 3 ácidos grasos", options:["1","2","3"], answer:2, hint:"Cada uno de los tres OH del glicerol reacciona con un ácido graso.", explain:"Se forman tres enlaces éster, uno con cada ácido graso.", connection:"Las lipasas rompen precisamente esos enlaces durante la digestión." },
      { id:"b6", phase:"Aplicar", concept:"Aminoácidos", title:"Lee un aminoácido", prompt:"¿Qué dos grupos funcionales reconoces?", formula:"H₂N—CH(R)—COOH", options:["Amino y carboxilo","Alcohol y éter","Aldehído y cetona"], answer:0, hint:"Mira los dos extremos: H₂N— y —COOH.", explain:"Un aminoácido típico contiene un grupo amino y un grupo carboxilo.", connection:"La misma molécula puede reunir varios grupos funcionales con papeles diferentes." },
      { id:"b7", phase:"Conectar", concept:"Amidas", title:"Del aminoácido a la proteína", prompt:"El enlace peptídico que une aminoácidos es químicamente una…", formula:"—C(=O)—NH—", options:["Amina","Amida","Cetona"], answer:1, hint:"El nitrógeno está unido directamente a un carbonilo.", explain:"—C(=O)—N— es el patrón de una amida; en proteínas se llama enlace peptídico.", connection:"Un grupo amino libre no es lo mismo que el N integrado en el enlace peptídico." },
      { id:"b8", phase:"Conectar", concept:"Glúcidos e isomería", title:"Conecta función e isomería", prompt:"Glucosa y fructosa comparten C₆H₁₂O₆, pero una presenta aldehído y otra cetona. Son…", formula:"misma fórmula · distinta función", options:["La misma sustancia","Isómeros de función","Isómeros de cadena únicamente"], answer:1, hint:"La fórmula coincide, pero cambia la familia del grupo carbonilo.", explain:"Son isómeros de función: mismo inventario de átomos, distinto grupo funcional.", connection:"Este caso reúne representación molecular, grupos funcionales e isomería en un ejemplo de Dietética." },
      { id:"b9", phase:"Conectar", concept:"Digestión", title:"Aplica la estructura", prompt:"¿Qué enlace rompen las lipasas al digerir triglicéridos?", formula:"glicerol—COO—ácido graso", options:["Peptídico","Éster","C≡C"], answer:1, hint:"Es el enlace que unió el alcohol glicerol con los ácidos grasos.", explain:"Las lipasas hidrolizan los enlaces éster y liberan productos derivados del glicerol y ácidos grasos.", connection:"Reconocer una estructura permite anticipar qué reacción digestiva puede sufrir." },
    ],
  },
];

type SavedProgress = Record<string, { best: number; completed: boolean }>;

export default function IntegratedReview({ onEarn, onAsk }: { onEarn: (amount: number) => void; onAsk: (text: string) => void }) {
  const [routeId, setRouteId] = useState<string | null>(null);
  const [stage, setStage] = useState<"theory" | "quiz" | "results">("theory");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [hint, setHint] = useState(false);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState<Record<string, boolean>>({});
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const [mastered, setMastered] = useState<string[]>([]);
  const [progress, setProgress] = useState<SavedProgress>({});
  const [autoNext, setAutoNext] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const route = routes.find((item) => item.id === routeId) ?? null;
  const question = route?.questions[index];

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem("carbon-integrated-review-v1");
        if (raw) {
          const data = JSON.parse(raw);
          setProgress(data.progress ?? {}); setMastered(data.mastered ?? []); setAutoNext(data.autoNext ?? true);
        }
      } catch { /* El repaso funciona aunque el navegador no conserve progreso. */ }
      finally { setHydrated(true); }
    });
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("carbon-integrated-review-v1", JSON.stringify({ progress, mastered, autoNext }));
  }, [progress, mastered, autoNext, hydrated]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const weakConcepts = useMemo(() => Object.entries(mistakes).sort((a,b) => b[1] - a[1]).map(([concept]) => concept), [mistakes]);

  function openRoute(id: string) {
    if (timer.current) clearTimeout(timer.current);
    setRouteId(id); setStage("theory"); setIndex(0); setPicked(null); setFeedback(null); setHint(false); setScore(0); setAttempted({}); setMistakes({});
    window.scrollTo({ top: 230, behavior: "smooth" });
  }

  function startQuiz() {
    setStage("quiz"); setIndex(0); setPicked(null); setFeedback(null); setHint(false); setScore(0); setAttempted({}); setMistakes({});
  }

  function finish(finalScore: number) {
    if (!route) return;
    const best = Math.max(progress[route.id]?.best ?? 0, finalScore);
    setProgress((old) => ({ ...old, [route.id]: { best, completed: true } }));
    setStage("results");
  }

  function go(next: number) {
    if (!route) return;
    if (timer.current) clearTimeout(timer.current);
    if (next >= route.questions.length) {
      finish(score); return;
    }
    setIndex(Math.max(0, next)); setPicked(null); setFeedback(null); setHint(false);
  }

  function check() {
    if (picked === null || !question || feedback) return;
    const right = picked === question.answer;
    const firstAttempt = !attempted[question.id];
    const nextScore = score + (right && firstAttempt ? 1 : 0);
    setFeedback(right ? "correct" : "wrong");
    if (firstAttempt) {
      setAttempted((old) => ({ ...old, [question.id]: true }));
      if (right) setScore(nextScore);
    }
    if (right && !mastered.includes(question.id)) {
      setMastered((old) => [...old, question.id]); onEarn(10);
    }
    if (!right) setMistakes((old) => ({ ...old, [question.concept]: (old[question.concept] ?? 0) + 1 }));
    if (right && autoNext) timer.current = setTimeout(() => index === (route?.questions.length ?? 0) - 1 ? finish(nextScore) : go(index + 1), 3000);
  }

  if (!route) return <div className="review-hub">
    <div className="review-hub-intro"><span>REPASO EN CONJUNTO</span><h2>Comprueba si las ideas se conectan</h2><p>Cada ruta empieza con una explicación continua, pasa a ejercicios por pasos y termina mezclando conceptos. Así no practicas cada tema de forma aislada.</p><div className="review-cycle"><b>1 · Comprender</b><i>→</i><b>2 · Recordar</b><i>→</i><b>3 · Aplicar</b><i>→</i><b>4 · Conectar</b><i>→</i><b>5 · Corregir</b></div></div>
    <div className="review-route-list">{routes.map((item) => { const saved = progress[item.id]; return <article key={item.id} className="review-route-card"><div className="review-route-number">{item.number}</div><div className="review-route-main"><span>{item.subtitle}</span><h3>{item.title}</h3><p>{item.description}</p><div className="review-route-links">{item.theory.map((part, i) => <span key={part.title}>{i ? "→" : ""} {part.title.replace(/^\d+\. /, "")}</span>)}</div></div><aside><small>{item.time}</small><b>{item.questions.length} ejercicios</b>{saved ? <em>{saved.completed ? "Completado" : "En curso"} · mejor {saved.best}/{item.questions.length}</em> : <em>Sin empezar</em>}<button onClick={() => openRoute(item.id)}>{saved?.completed ? "Repetir ruta" : "Empezar ruta"} →</button></aside></article>; })}</div>
  </div>;

  if (stage === "theory") return <div className="review-theory-sheet">
    <button className="review-back" onClick={() => setRouteId(null)}>← Todas las rutas</button>
    <header><span>{route.number} · {route.subtitle}</span><h2>{route.title}</h2><p>{route.description}</p></header>
    <div className="review-theory-flow">{route.theory.map((part, i) => <section key={part.title}><div className="review-flow-line"><span>{i + 1}</span>{i < route.theory.length - 1 && <i/>}</div><div><h3>{part.title}</h3><p>{part.body}</p><code>{part.example}</code></div></section>)}</div>
    <div className="review-method"><span>MÉTODO DE ESTA RUTA</span><div>{route.method.map((step, i) => <span key={step}><b>{i + 1}</b>{step}{i < route.method.length - 1 && <i>→</i>}</span>)}</div></div>
    <div className="review-theory-footer"><button onClick={() => onAsk(`Estoy repasando “${route.title}”. Explícame cómo se conectan estos pasos: ${route.method.join(", ")}.`)}>Preguntar sobre esta ruta</button><button className="primary" onClick={startQuiz}>Empezar los {route.questions.length} ejercicios →</button></div>
  </div>;

  if (stage === "results") {
    const pct = Math.round(score / route.questions.length * 100);
    return <div className="review-results"><button className="review-back" onClick={() => setRouteId(null)}>← Todas las rutas</button><span className="result-symbol">{pct >= 80 ? "✓" : "↺"}</span><h2>{pct >= 80 ? "Las ideas ya están conectando" : "Ya sabemos qué reforzar"}</h2><p>Resultado de <b>{route.title}</b></p><strong>{score}/{route.questions.length}</strong><div className="result-bar"><i style={{ width: `${pct}%` }}/></div><div className="result-diagnosis"><span>DIAGNÓSTICO</span>{weakConcepts.length ? <><b>Conviene repasar:</b><p>{weakConcepts.join(" · ")}</p></> : <><b>Sin errores registrados</b><p>Has aplicado correctamente todos los conceptos de la ruta.</p></>}</div><div className="result-actions"><button onClick={() => setStage("theory")}>Volver a la teoría</button><button className="primary" onClick={startQuiz}>Repetir ejercicios →</button></div></div>;
  }

  return question && <div className="review-session">
    <div className="review-session-top"><button className="review-back" onClick={() => setStage("theory")}>← Teoría de la ruta</button><div><span>{route.title}</span><b>{index + 1}/{route.questions.length}</b></div><label><input type="checkbox" checked={autoNext} onChange={(e) => setAutoNext(e.target.checked)}/> Avance automático</label></div>
    <div className="review-phase-map">{(["Recordar","Aplicar","Conectar"] as Phase[]).map((phase) => { const phaseQuestions=route.questions.filter((q)=>q.phase===phase); const start=route.questions.findIndex((q)=>q.phase===phase); const done=phaseQuestions.filter((q)=>attempted[q.id]).length; return <button key={phase} className={question.phase === phase ? "active" : ""} onClick={() => go(start)}><span>{phase}</span><b>{done}/{phaseQuestions.length}</b></button>; })}</div>
    <article className="review-question-card"><div className="review-question-meta"><span>{question.phase} · {question.concept}</span><small>EJERCICIO {index + 1}</small></div><h2>{question.title}</h2><p>{question.prompt}</p><div className="review-formula">{question.formula}</div><div className="review-options">{question.options.map((option, i) => <button key={option} onClick={() => { setPicked(i); setFeedback(null); }} className={`${picked === i ? "picked" : ""} ${feedback && i === question.answer ? "right" : ""} ${feedback === "wrong" && picked === i ? "wrong" : ""}`}><span>{String.fromCharCode(65 + i)}</span><b>{option}</b></button>)}</div>{hint && !feedback && <div className="review-hint"><b>PISTA</b>{question.hint}</div>}{feedback && <div className={`review-feedback ${feedback}`}><span>{feedback === "correct" ? "✓" : "↺"}</span><div><b>{feedback === "correct" ? "Correcto" : "Revisa el razonamiento"}</b><p>{question.explain}</p><small><strong>CONEXIÓN:</strong> {question.connection}</small>{feedback === "correct" && autoNext && <em>{index === route.questions.length - 1 ? "Preparando tu resultado…" : "Siguiente ejercicio automáticamente…"}</em>}</div></div>}<div className="review-actions"><button disabled={index === 0} onClick={() => go(index - 1)}>← Anterior</button><button onClick={() => setHint(true)}>✦ Pista</button><button onClick={() => onAsk(`Ayúdame a razonar este ejercicio de ${question.concept} sin decirme primero la respuesta: ${question.prompt} ${question.formula}`)}>Preguntar al tutor</button>{feedback === "correct" ? <button className="primary" onClick={() => go(index + 1)}>{index === route.questions.length - 1 ? "Ver resultado" : "Siguiente"} →</button> : <button className="primary" disabled={picked === null} onClick={check}>Comprobar</button>}</div></article>
  </div>;
}
