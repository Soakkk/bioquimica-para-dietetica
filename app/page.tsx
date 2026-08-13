"use client";

import { DragEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import NomenclatureTrainer from "./NomenclatureTrainer";
import IntegratedReview from "./IntegratedReview";
import CourseDepth from "./CourseDepth";
import InlineLessonPractice from "./InlineLessonPractice";
import ChainBranchLesson from "./ChainBranchLesson";

type ElementKey = "C" | "H" | "O" | "N";
type Atom = { id: number; element: ElementKey; x: number; y: number };
type Bond = { id: number; a: number; b: number; order: 1 | 2 | 3 };
type Mode = "learn" | "practice" | "nomenclature" | "lab";

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
    time: "45–60 min",
    intro: "Aprende un método acumulativo para pasar de nombres sencillos y ramificados a estructuras con varias insaturaciones.",
    principle: "Interpreta el nombre como instrucciones: elige la cadena correcta, coloca localizadores e insaturaciones, añade sustituyentes y audita todas las valencias.",
    topics: ["Gramática y puntuación IUPAC", "Cadena principal y sustituyentes", "Numeración y orden alfabético", "Dobles y triples múltiples", "Auditoría de la fórmula"],
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
    time: "60–75 min",
    intro: "Clasifica y compara cadenas abiertas, ciclos, alcanos, alquenos, alquinos y aromáticos, con la profundidad útil para Dietética.",
    principle: "Primero decide composición y forma de la cadena; después analiza saturación, número de insaturaciones, fórmula general y nomenclatura.",
    topics: ["Cadena abierta y cerrada", "Alcanos lineales y ramificados", "Alquenos, dienos y cis/trans", "Alquinos y enlaces múltiples", "Cicloalcanos y aromáticos", "Reconocimiento de heterociclos"],
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

const studySections: Record<number, { heading: string; paragraphs: string[]; worked?: { title: string; formula: string; steps: string[] } }[]> = {
  0: [
    { heading: "1. Del átomo a los electrones de valencia", paragraphs: ["Un átomo tiene un núcleo y electrones distribuidos en capas. Para comprender los enlaces orgánicos no necesitamos seguir todos sus electrones: observamos sobre todo los de la capa externa, llamados electrones de valencia.", "El carbono tiene 6 electrones en total: 2 ocupan la primera capa y 4 quedan en la segunda. Por tanto, tiene cuatro electrones de valencia. El oxígeno tiene seis electrones de valencia; el nitrógeno, cinco; y el hidrógeno, uno."] },
    { heading: "2. Compartir para alcanzar una situación estable", paragraphs: ["Muchos átomos de la segunda fila son especialmente estables cuando pueden contar ocho electrones a su alrededor. Es la regla del octeto. El hidrógeno es la excepción más importante: su primera capa se completa con dos.", "En un enlace covalente, dos átomos comparten electrones. Una raya representa un par compartido. Los electrones no pasan a pertenecer por completo al otro átomo: ambos los cuentan a su alrededor."], worked: { title: "Ejemplo resuelto: metano", formula: "CH₄", steps: ["El C necesita completar cuatro enlaces.", "Cada H solo puede formar un enlace.", "El C comparte un par con cada uno de los cuatro H.", "Resultado: cuatro enlaces C—H y octeto completo alrededor del C."] } },
    { heading: "3. Distintas formas de escribir la misma molécula", paragraphs: ["La fórmula molecular indica cuántos átomos hay, pero no cómo se conectan: C₂H₆. La semidesarrollada agrupa los hidrógenos y muestra las conexiones principales: CH₃—CH₃. La desarrollada dibuja todos los enlaces.", "La fórmula empírica reduce los subíndices a la proporción mínima. Para el etano C₂H₆ es CH₃. Esto no significa que CH₃ aislado sea la molécula de etano."] },
  ],
  1: [
    { heading: "1. La cuenta hasta cuatro", paragraphs: ["El carbono neutro que usaremos habitualmente en química orgánica debe sumar cuatro enlaces. No tiene que estar unido a cuatro átomos diferentes: importa la suma del orden de los enlaces.", "Un enlace simple suma 1, uno doble suma 2 y uno triple suma 3. Después añadimos los enlaces C—H necesarios hasta llegar a cuatro."], worked: { title: "Ejemplo resuelto: propeno", formula: "CH₃—CH=CH₂", steps: ["C izquierdo: 3 enlaces con H + 1 con C = 4.", "C central: 1 con H + 1 simple + 2 del doble = 4.", "C derecho: 2 con H + 2 del doble = 4.", "Los tres carbonos cumplen su tetravalencia."] } },
    { heading: "2. Cómo descubrir los hidrógenos que faltan", paragraphs: ["Dibuja primero el esqueleto de carbonos y sus enlaces múltiples. Después analiza cada carbono por separado. Resta a cuatro la suma de los enlaces que ya tiene: el resultado suele ser el número de hidrógenos que debes añadir.", "Por ejemplo, un carbono terminal unido mediante un enlace simple a otro carbono usa 1 enlace y conserva 3 para H: será CH₃. Si está unido mediante un doble enlace, conserva 2: será CH₂."] },
    { heading: "3. Valencia y grado no son lo mismo", paragraphs: ["Para comprobar la valencia se cuentan todas las rayas, incluidas las que unen H, O o N. Para clasificar un carbono como primario, secundario, terciario o cuaternario solo se cuentan sus vecinos carbono.", "Un carbono cuaternario no se llama así por tener cuatro enlaces —eso es habitual—, sino porque está unido directamente a cuatro carbonos distintos."] },
  ],
  2: [
    { heading: "1. La gramática de un nombre orgánico", paragraphs: ["Un nombre orgánico funciona como una frase corta. El prefijo indica cuántos carbonos tiene la cadena principal: met- (1), et- (2), prop- (3), but- (4), pent- (5) y hex- (6). El sufijo explica qué característica manda: -ano para enlaces simples, -eno para C=C, -ino para C≡C, -ol para un alcohol, -al para un aldehído, -ona para una cetona y -oico para un ácido carboxílico.", "Entre esas dos piezas puede aparecer un número. Ese número se llama localizador porque localiza algo dentro de la cadena: puede señalar dónde empieza un enlace doble o triple, qué carbono lleva el grupo OH o a qué carbono está unida una rama."], worked: { title: "Un número, tres usos diferentes", formula: "but-2-eno · butan-2-ol · 2-metilbutano", steps: ["En but-2-eno, el 2 indica que C=C comienza en C2.", "En butan-2-ol, el 2 indica que el grupo OH está unido a C2.", "En 2-metilbutano, el 2 indica que una rama metil está unida a C2.", "El número no cuenta átomos: funciona como una dirección dentro de la cadena."] } },
    { heading: "2. Qué es un localizador y cuándo se escribe", paragraphs: ["Para obtener los localizadores, numeramos los carbonos de la cadena principal desde el extremo más cercano a la característica importante. Elegimos la dirección que produzca el número más bajo. Por eso CH₂=CH—CH₂—CH₃ se llama but-1-eno y no but-3-eno.", "Si una molécula solo permite una posición distinta, el número puede omitirse. En propino, el triple enlace solo puede ocupar una posición diferente. En butino existen dos posibilidades, por lo que escribimos but-1-ino o but-2-ino.", "Los números se separan entre sí con comas y se separan de las palabras mediante guiones: 2,3-dimetilbutano. Esta puntuación permite leer el nombre sin confundir cuántas ramas hay con el lugar que ocupa cada una."], worked: { title: "Elige siempre el número menor", formula: "CH₃—CH₂—CH=CH₂", steps: ["Si numeramos desde la izquierda, C=C empieza en C3.", "Si numeramos desde la derecha, C=C empieza en C1.", "Elegimos el localizador menor: 1.", "Nombre correcto: but-1-eno."] } },
    { heading: "3. Qué es un sustituyente", paragraphs: ["Primero buscamos la cadena continua de carbonos más larga: esa será la cadena principal. A veces queda fuera un grupo de carbonos unido lateralmente. Esa rama se llama sustituyente porque puede imaginarse como un grupo que ha sustituido a un H de la cadena principal.", "La rama —CH₃ se llama metil y la rama —CH₂—CH₃ se llama etil. El número colocado delante indica a qué carbono de la cadena principal se une la rama. En 2-metilbutano, la cadena principal tiene cuatro carbonos y una rama CH₃ está unida al carbono 2.", "Un sustituyente no aumenta el número expresado por el prefijo de la cadena principal. 2-metilbutano contiene cinco carbonos en total, pero su cadena continua principal tiene cuatro; por eso el nombre base es butano y no pentano."], worked: { title: "Separa cadena principal y rama", formula: "CH₃—CH(CH₃)—CH₂—CH₃", steps: ["Marca la cadena continua más larga: tiene 4 C, por tanto es butano.", "El CH₃ entre paréntesis queda como rama: se llama metil.", "Numera desde el extremo más próximo a la rama: queda en C2.", "Une las piezas: 2 + metil + butano = 2-metilbutano."] } },
    { heading: "4. Qué significan di-, tri- y tetra-", paragraphs: ["Si una misma clase de sustituyente aparece varias veces, utilizamos un prefijo multiplicador. di- significa dos ramas iguales, tri- significa tres y tetra- significa cuatro. Debemos escribir un localizador por cada rama.", "En 2,3-dimetilbutano existen dos ramas metil: una está en C2 y otra en C3. En 2,2-dimetilpropano también hay dos metilos, pero ambos están unidos al mismo carbono 2. El prefijo di- cuenta ramas; los números explican dónde se encuentran."], worked: { title: "Lee 2,3-dimetilbutano como una instrucción", formula: "CH₃—CH(CH₃)—CH(CH₃)—CH₃", steps: ["butano: dibuja una cadena principal de 4 carbonos.", "dimetil: añade dos ramas CH₃.", "2,3: coloca una rama en C2 y la otra en C3.", "Completa los H y comprueba que cada carbono sume cuatro enlaces."] } },
    { heading: "5. Método para pasar del nombre a la fórmula", paragraphs: ["Lee el nombre desde el final hacia el principio si te resulta más fácil: identifica primero la cadena principal, coloca después el enlace o grupo funcional, añade las ramas en sus localizadores y deja los hidrógenos para el final.", "Termina siempre con una auditoría: C debe sumar 4 enlaces, H 1, O 2 y N normalmente 3. Esta comprobación detecta la mayoría de los errores de formulación."] },
  ],
  3: [
    { heading: "1. Saturación e insaturación", paragraphs: ["Los alcanos abiertos solo contienen enlaces simples y siguen CₙH₂ₙ₊₂. Se llaman saturados porque tienen el máximo número posible de hidrógenos.", "Un alqueno contiene al menos un C=C y un alquino, al menos un C≡C. Cada doble enlace reduce dos H respecto al alcano correspondiente; un triple reduce cuatro."], worked: { title: "Comparación con dos carbonos", formula: "etano → eteno → etino", steps: ["Etano: C₂H₆, enlace C—C.", "Eteno: C₂H₄, enlace C=C.", "Etino: C₂H₂, enlace C≡C.", "Más enlaces entre C significa menos espacio para H."] } },
    { heading: "2. Cadenas cerradas y aromaticidad", paragraphs: ["Un cicloalcanos forma un anillo con enlaces simples. Al cerrar la cadena se pierden dos H, por eso un ciclo con un solo anillo suele seguir CₙH₂ₙ.", "Los compuestos aromáticos, como el benceno, poseen un sistema electrónico especial que no debe entenderse simplemente como tres dobles enlaces aislados. Al principio aprenderemos a reconocer el anillo y sus sustituyentes."] },
    { heading: "3. Heterociclos", paragraphs: ["Un heterociclo es un anillo en el que al menos una posición está ocupada por N, O o S. Como ya no contiene exclusivamente C e H, no es estrictamente un hidrocarburo.", "Los heterociclos son esenciales en bioquímica: aparecen, por ejemplo, en las bases nitrogenadas del ADN y en numerosas vitaminas y coenzimas."] },
  ],
  4: [
    { heading: "1. El grupo funcional decide la familia", paragraphs: ["Un grupo funcional es una disposición concreta de átomos que aporta propiedades y reactividad características. Para leer una molécula, localiza primero ese grupo y solo después estudia el resto de la cadena.", "R representa una cadena carbonada cualquiera. No es un elemento: es una abreviatura que significa ‘el resto de la cadena’. Así, R—OH representa cualquier alcohol y R—COOH cualquier ácido carboxílico."] },
    { heading: "2. Alcoholes: el grupo —OH", paragraphs: ["Un alcohol contiene un grupo hidroxilo —OH unido a un carbono. El oxígeno forma dos enlaces simples: uno con el carbono y otro con el hidrógeno. En el nombre utilizamos el sufijo -ol y numeramos la cadena desde el extremo más próximo al OH.", "CH₃—CH₂—CH₂—OH es propan-1-ol, mientras que CH₃—CH(OH)—CH₃ es propan-2-ol. En Dietética aparecen alcoholes importantes como el etanol, el glicerol y algunos polialcoholes utilizados como edulcorantes."], worked: { title: "Ejemplo: glicerol", formula: "HO—CH₂—CH(OH)—CH₂—OH", steps: ["La cadena contiene 3 carbonos.", "Presenta tres grupos —OH: es un triol.", "Es la estructura alcohólica central de los triglicéridos.", "Sus grupos OH explican su afinidad por el agua."] } },
    { heading: "3. Ácidos carboxílicos: el grupo —COOH", paragraphs: ["El grupo carboxilo —COOH reúne un carbonilo C=O y un grupo OH en el mismo carbono. Ese carbono forma parte de la cadena principal y normalmente recibe el número 1. Los nombres sistemáticos terminan en -oico y comienzan con la palabra ácido.", "Los ácidos grasos combinan una cadena hidrocarbonada larga con un extremo —COOH. El ácido etanoico aparece en el vinagre; otros ácidos orgánicos participan en fermentaciones, conservación y metabolismo."], worked: { title: "Lee un ácido graso por zonas", formula: "CH₃—(CH₂)ₙ—COOH", steps: ["La cadena CH₃—(CH₂)ₙ es mayoritariamente apolar.", "El extremo COOH es el grupo ácido.", "El carbono del COOH también se cuenta.", "Los dobles enlaces de la cadena permiten clasificarlo como saturado o insaturado."] } },
    { heading: "4. Ésteres y triglicéridos", paragraphs: ["Un éster contiene el patrón —C(=O)—O—, que suele abreviarse como —COO—. Puede formarse al reaccionar un ácido carboxílico con un alcohol. No lo confundas con un éter R—O—R: el éster posee un carbonilo C=O junto al oxígeno.", "En un triglicérido, los tres grupos OH del glicerol forman tres enlaces éster con tres ácidos grasos. Reconocer —COO— permite localizar los puntos que las lipasas rompen durante la digestión."], worked: { title: "De alcohol y ácido a éster", formula: "R—COOH + HO—R′ → R—COO—R′ + H₂O", steps: ["R—COOH aporta el grupo carboxilo.", "HO—R′ aporta el grupo alcohol.", "Se forma el enlace —COO— característico del éster.", "También se libera una molécula de agua."] } },
    { heading: "5. Aminas, amidas y proteínas", paragraphs: ["Una amina sencilla contiene nitrógeno sin un carbonilo directamente unido, por ejemplo R—NH₂. El nitrógeno suele formar tres enlaces y conserva un par de electrones libre.", "Una amida contiene el patrón —C(=O)—N—. Esta diferencia es esencial en Dietética: los aminoácidos tienen un grupo amino, pero el enlace que los une dentro de una proteína es una amida llamada enlace peptídico."], worked: { title: "No confundas amino con peptídico", formula: "H₂N—CHR—COOH · —C(=O)—NH—", steps: ["—NH₂ libre: grupo amino del aminoácido.", "—COOH: grupo ácido del aminoácido.", "—C(=O)—NH—: enlace peptídico.", "El enlace peptídico pertenece a la familia de las amidas."] } },
    { heading: "6. Aldehídos, cetonas y otros grupos", paragraphs: ["El grupo C=O se llama carbonilo. Si aparece al final como —CHO, tenemos un aldehído; si está entre dos carbonos como R—CO—R′, tenemos una cetona. La glucosa abierta contiene un aldehído y la fructosa abierta una cetona.", "Los tioles contienen —SH, los éteres R—O—R′ y los derivados halogenados incorporan F, Cl, Br o I. Primero reconoce el dibujo característico; después aprende el nombre."], worked: { title: "Compara antes de memorizar", formula: "—CHO · —CO— · —COOH · —COO—", steps: ["—CHO al final: aldehído.", "—CO— entre carbonos: cetona.", "—COOH: ácido carboxílico.", "—COO— entre dos cadenas: éster."] } },
  ],
  5: [
    { heading: "1. Una fórmula puede esconder varias estructuras", paragraphs: ["Los isómeros tienen la misma fórmula molecular, pero no son la misma sustancia. Antes de comparar dibujos, cuenta todos los átomos: si no coinciden exactamente, no existe isomería.", "En la isomería estructural cambia la manera en que los átomos están conectados. Puede cambiar la cadena, la posición de un grupo o incluso el grupo funcional."], worked: { title: "Ejemplo: C₄H₁₀", formula: "butano / 2-metilpropano", steps: ["Ambos contienen 4 C y 10 H.", "El butano presenta una cadena lineal de cuatro C.", "El 2-metilpropano tiene una cadena ramificada.", "Son isómeros de cadena."] } },
    { heading: "2. Cadena, posición y función", paragraphs: ["En la isomería de cadena cambia el esqueleto carbonado. En la de posición se mantiene la familia, pero cambia el lugar del enlace múltiple, sustituyente o grupo funcional.", "En la isomería de función cambia la familia química. C₂H₆O puede corresponder a etanol, un alcohol, o a dimetil éter, un éter."] },
    { heading: "3. Isomería espacial", paragraphs: ["Algunas moléculas mantienen las mismas conexiones, pero difieren en la orientación espacial. En ciertos alquenos aparece la isomería geométrica cis/trans porque el doble enlace impide el giro libre.", "La isomería óptica se estudiará cuando aparezcan carbonos con cuatro sustituyentes diferentes. No hace falta introducirla antes de dominar la representación tridimensional básica."] },
  ],
  6: [
    { heading: "1. Leer biomoléculas por fragmentos", paragraphs: ["Las biomoléculas pueden parecer enormes, pero están construidas con los mismos enlaces y grupos funcionales. Recorre primero el esqueleto de carbonos y rodea cada —OH, C=O, —COOH, —NH₂, —COO— o —C(=O)—NH—.", "Después pregunta qué aporta cada zona: polaridad, posibilidad de formar enlaces de hidrógeno, acidez o reactividad. Este método permite interpretar una molécula nueva sin memorizar todo su dibujo."] },
    { heading: "2. Glúcidos: muchos —OH y un carbonilo", paragraphs: ["Los monosacáridos suelen contener varios grupos alcohol y un carbonilo. En su forma abierta, la glucosa posee un aldehído y la fructosa una cetona. Ambas tienen fórmula C₆H₁₂O₆, pero distinta estructura: son isómeros de función.", "Los numerosos grupos OH aumentan su interacción con el agua. Cuando los monosacáridos se unen forman enlaces glucosídicos; la digestión rompe estos enlaces para obtener unidades más pequeñas."], worked: { title: "Glucosa y fructosa", formula: "C₆H₁₂O₆ → aldehído / cetona", steps: ["Primero comprueba que ambas tienen la misma fórmula molecular.", "Glucosa abierta: localiza —CHO.", "Fructosa abierta: localiza —CO—.", "Misma fórmula y distinta función: isomería de función."] } },
    { heading: "3. Lípidos: ácidos grasos y triglicéridos", paragraphs: ["Un ácido graso combina una cadena hidrocarbonada con un grupo —COOH. Si la cadena solo contiene enlaces simples es saturado; si contiene uno o más C=C es insaturado. Los dobles enlaces cambian la forma y el empaquetamiento de las cadenas.", "Un triglicérido se forma cuando el glicerol se une a tres ácidos grasos mediante tres enlaces éster. Durante la digestión, las lipasas hidrolizan esos enlaces y liberan componentes más pequeños."], worked: { title: "Método de lectura de una grasa", formula: "glicerol + 3 ácidos grasos → triglicérido", steps: ["Busca el esqueleto de tres carbonos del glicerol.", "Localiza tres patrones —COO—: son enlaces éster.", "Examina las cadenas para encontrar C=C.", "Clasifica sus ácidos grasos como saturados o insaturados."] } },
    { heading: "4. Aminoácidos y proteínas", paragraphs: ["Un aminoácido típico contiene un grupo amino —NH₂ y un grupo carboxilo —COOH unidos al carbono central, además de H y una cadena lateral R. La parte R cambia de un aminoácido a otro y determina muchas de sus propiedades.", "Al unirse dos aminoácidos, el carboxilo de uno y el amino del otro forman el enlace peptídico —C(=O)—NH—. Químicamente es una amida. La digestión de proteínas hidroliza esos enlaces."], worked: { title: "Anatomía de un aminoácido", formula: "H₂N—CH(R)—COOH", steps: ["H₂N—: grupo amino.", "—COOH: grupo carboxilo.", "R: cadena lateral variable.", "Al formar proteínas aparece —C(=O)—NH— entre aminoácidos."] } },
    { heading: "5. Aplicación directa en Dietética", paragraphs: ["Estas estructuras ayudan a interpretar grasas saturadas e insaturadas, azúcares con la misma fórmula, aminoácidos, alcoholes alimentarios y ácidos orgánicos presentes en fermentaciones y conservación.", "No necesitas memorizar de inmediato moléculas enormes. El objetivo práctico es poder señalar el esqueleto de carbono, reconocer los grupos funcionales y explicar qué enlaces deben romperse o formarse durante la digestión y el metabolismo."], worked: { title: "Lista de comprobación", formula: "cadena → enlaces → grupos → función", steps: ["Cuenta los carbonos y observa si hay ramificaciones.", "Marca enlaces dobles o triples.", "Rodea OH, C=O, COOH, NH₂, COO y CONH.", "Relaciona cada grupo con glúcidos, lípidos o proteínas."] } },
  ],
};

const questionTheory = [1, 1, 1, 1, 1, 3, 2, 0, 1, 1, 4, 4, 2, 2, 2, 4, 4, 4, 4, 6, 6, 6, 6, 0, 0, 0, 3, 3, 3, 5, 5, 5, 5,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
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
  { level: 4, title: "Lee el localizador", prompt: "En but-2-eno, ¿qué señala el número 2?", formula: "CH₃ — CH = CH — CH₃", options: ["Que hay dos carbonos", "Que C=C comienza en C2", "Que existen dos dobles enlaces"], answer: 1, explain: "El localizador no cuenta elementos: indica que el doble enlace comienza en el carbono 2." },
  { level: 4, title: "Encuentra la rama", prompt: "En 2-metilbutano, ¿qué significa metil?", formula: "CH₃ — CH(CH₃) — CH₂ — CH₃", options: ["La cadena principal", "Una rama —CH₃", "Un enlace doble"], answer: 1, explain: "Metil es el sustituyente —CH₃ que queda como rama de la cadena principal de cuatro carbonos." },
  { level: 4, title: "Multiplicadores", prompt: "¿Qué informa el nombre 2,3-dimetilbutano?", formula: "CH₃ — CH(CH₃) — CH(CH₃) — CH₃", options: ["Dos metilos en C2 y C3", "Tres metilos en C2", "Un metilo y dos dobles enlaces"], answer: 0, explain: "di- indica dos ramas metil; los localizadores 2,3 señalan la posición de cada una." },
  { level: 6, title: "Alcoholes en nutrición", prompt: "¿Qué grupo permite reconocer el glicerol como alcohol?", formula: "HO—CH₂—CH(OH)—CH₂—OH", options: ["—OH", "—COOH", "—NH₂"], answer: 0, explain: "El glicerol posee tres grupos hidroxilo —OH; por eso es un triol." },
  { level: 6, title: "Ácidos grasos", prompt: "¿Qué dos zonas distingues en un ácido graso?", formula: "CH₃—(CH₂)ₙ—COOH", options: ["Amina y alcohol", "Cadena hidrocarbonada y carboxilo", "Cetona y éter"], answer: 1, explain: "La cadena es principalmente apolar y el extremo —COOH es el grupo carboxilo ácido." },
  { level: 6, title: "Triglicéridos", prompt: "¿Qué patrón representa el enlace éster de un triglicérido?", formula: "R—C(=O)—O—R′", options: ["—COO—", "—NH₂", "—CHO"], answer: 0, explain: "El patrón —C(=O)—O—, abreviado —COO—, identifica un éster." },
  { level: 6, title: "Amina o amida", prompt: "¿Cuál de estas estructuras corresponde a una amida?", formula: "Busca un carbonilo unido al N", options: ["R—NH₂", "R—C(=O)—NH₂", "R—OH"], answer: 1, explain: "Una amida tiene el nitrógeno unido directamente a un carbonilo: —C(=O)—N—." },
  { level: 6, title: "Glúcidos", prompt: "Glucosa y fructosa tienen C₆H₁₂O₆, pero una presenta aldehído y la otra cetona. Son…", formula: "misma fórmula · distinta función", options: ["El mismo compuesto", "Isómeros de función", "Dos aminoácidos"], answer: 1, explain: "Comparten fórmula molecular, pero difieren en el grupo funcional: aldehído frente a cetona." },
  { level: 6, title: "Grasas insaturadas", prompt: "¿Qué característica muestra que una cadena de ácido graso es insaturada?", formula: "—CH₂—CH=CH—CH₂—", options: ["Un grupo OH", "Un enlace C=C", "Un grupo NH₂"], answer: 1, explain: "La presencia de uno o más dobles enlaces C=C indica insaturación." },
  { level: 6, title: "Digestión de grasas", prompt: "¿Qué enlace rompen las lipasas en los triglicéridos?", formula: "glicerol — COO — ácido graso", options: ["Enlace éster", "Enlace peptídico", "Enlace triple"], answer: 0, explain: "Las lipasas hidrolizan los enlaces éster que unen el glicerol con los ácidos grasos." },
  { level: 6, title: "Anatomía de un aminoácido", prompt: "¿Qué dos grupos aparecen en un aminoácido típico?", formula: "H₂N—CH(R)—COOH", options: ["Amino y carboxilo", "Alcohol y cetona", "Éter y aldehído"], answer: 0, explain: "Un aminoácido típico contiene un grupo amino —NH₂ y un grupo carboxilo —COOH." },
  { level: 1, title: "Electrones y enlaces", prompt: "El oxígeno tiene 6 electrones de valencia. ¿Cuántos enlaces forma habitualmente?", formula: "O · 6 electrones de valencia", options: ["1", "2", "6"], answer: 1, explain: "Le faltan dos electrones para completar el octeto, por lo que normalmente forma dos enlaces." },
  { level: 1, title: "CHON", prompt: "¿Cuál es la secuencia correcta de enlaces habituales para H, O, N y C?", formula: "H · O · N · C", options: ["1 · 2 · 3 · 4", "4 · 3 · 2 · 1", "1 · 6 · 5 · 4"], answer: 0, explain: "La regla práctica es H=1, O=2, N=3 y C=4 enlaces habituales." },
  { level: 4, title: "Formas de representar", prompt: "Para el etano C₂H₆, ¿cuál es su fórmula empírica?", formula: "C₂H₆", options: ["C₂H₆", "CH₃", "CH₃—CH₃"], answer: 1, explain: "La fórmula empírica expresa la proporción mínima: dividimos los subíndices entre 2 y obtenemos CH₃." },
  { level: 1, title: "Familias de hidrocarburos", prompt: "¿Qué familia contiene al menos un enlace triple C≡C?", formula: "C ≡ C", options: ["Alcano", "Alqueno", "Alquino"], answer: 2, explain: "Los alquinos contienen al menos un triple enlace y utilizan el sufijo -ino." },
  { level: 1, title: "Saturación", prompt: "¿Cuál de estas moléculas es un hidrocarburo saturado?", formula: "Busca solamente enlaces simples", options: ["CH₃—CH₃", "CH₂=CH₂", "HC≡CH"], answer: 0, explain: "El etano solo contiene enlaces simples, por lo que es un alcano saturado." },
  { level: 6, title: "Heterociclos", prompt: "¿Qué convierte a un anillo en heterociclo?", formula: "anillo con C, N u O", options: ["Tener únicamente carbonos", "Contener un átomo como N u O en el anillo", "Tener siempre un grupo COOH"], answer: 1, explain: "Un heterociclo contiene al menos un átomo distinto del carbono dentro del propio anillo." },
  { level: 4, title: "Isomería de cadena", prompt: "Butano y 2-metilpropano tienen C₄H₁₀, pero distinta ramificación. Son isómeros de…", formula: "CH₃—CH₂—CH₂—CH₃ / CH₃—CH(CH₃)—CH₃", options: ["Cadena", "Posición", "Función"], answer: 0, explain: "Conservan la fórmula molecular, pero cambia el esqueleto carbonado: isomería de cadena." },
  { level: 4, title: "Isomería de posición", prompt: "Propan-1-ol y propan-2-ol se diferencian en…", formula: "CH₃—CH₂—CH₂OH / CH₃—CH(OH)—CH₃", options: ["El número de carbonos", "La posición del OH", "La familia química"], answer: 1, explain: "Ambos son alcoholes C₃H₈O; cambia únicamente la posición del grupo OH." },
  { level: 4, title: "Isomería de función", prompt: "Etanol y dimetil éter comparten C₂H₆O, pero pertenecen a familias diferentes. Son isómeros de…", formula: "CH₃—CH₂—OH / CH₃—O—CH₃", options: ["Cadena", "Posición", "Función"], answer: 2, explain: "La misma fórmula corresponde a un alcohol y un éter: isomería de función." },
  { level: 4, title: "Comprobación de isómeros", prompt: "¿Cuál es el primer paso antes de afirmar que dos estructuras son isómeras?", formula: "¿misma fórmula molecular?", options: ["Comparar sus nombres", "Contar todos los átomos", "Buscar siempre un doble enlace"], answer: 1, explain: "Los isómeros deben tener exactamente la misma cantidad de cada elemento; primero se comprueba la fórmula molecular." },

  { level: 4, title: "Desmonta el nombre", prompt: "¿Qué información contiene 3-etil-2-metilhexano?", formula: "localizadores + sustituyentes + cadena", options: ["Hexano con etil en C3 y metil en C2", "Pentano con dos ramas etil", "Hexeno con un doble enlace en C3"], answer: 0, explain: "Hexano indica una cadena principal de 6 C; 3-etil y 2-metil indican qué ramas hay y dónde se conectan." },
  { level: 4, title: "Cadena principal", prompt: "La fila inferior parece tener 4 C, pero existe un camino continuo superior→centro→derecha con 5 C. ¿Cuál eliges?", formula: "       CH₂—CH₃\n        |\nCH₃—CH—CH₂—CH₃", options: ["La horizontal de 4 C", "El recorrido continuo de 5 C", "Los 6 C formando una bifurcación"], answer: 1, explain: "La cadena puede girar, pero no bifurcarse. El recorrido de 5 C es la cadena principal; el CH₃ restante será sustituyente." },
  { level: 4, title: "Rama o sustituyente", prompt: "¿Cómo se llama una rama formada por —CH₂—CH₃?", formula: "cadena principal—CH₂—CH₃", options: ["Metil", "Etil", "Propil"], answer: 1, explain: "Una rama de dos carbonos procede del etano al perder un H y se llama etil." },
  { level: 4, title: "Número más bajo", prompt: "Una rama puede quedar en C2 numerando desde la derecha o en C5 desde la izquierda. ¿Qué localizador se usa?", formula: "2 ↔ 5", options: ["2", "5", "Se elige cualquiera"], answer: 0, explain: "Se numera desde el extremo que proporcione el localizador más bajo: C2." },
  { level: 4, title: "Puntuación del nombre", prompt: "¿Cuál está escrito correctamente?", formula: "dos metilos en C2 y C4", options: ["2 4 dimetil hexano", "2,4-dimetilhexano", "2-4, dimetil-hexano"], answer: 1, explain: "Los números se separan con comas; números y palabras, con guiones; el nombre se escribe sin espacios." },
  { level: 4, title: "Detecta una errata", prompt: "¿Qué problema tiene el nombre «2-dimetilbutano» del listado?", formula: "di- = dos ramas", options: ["Butano no existe", "Falta un localizador para la segunda rama", "El prefijo di- significa doble enlace"], answer: 1, explain: "Si hay dos metilos deben aparecer dos localizadores, incluso si coinciden: por ejemplo, 2,2-dimetilbutano." },
  { level: 4, title: "Formula un alquino", prompt: "¿Qué fórmula corresponde a pent-2-ino?", formula: "5 C · C≡C desde C2", options: ["CH₃—C≡C—CH₂—CH₃", "HC≡C—CH₂—CH₂—CH₃", "CH₃—CH=CH—CH₂—CH₃"], answer: 0, explain: "La cadena tiene 5 C y el triple enlace está entre C2 y C3: CH₃—C≡C—CH₂—CH₃." },
  { level: 4, title: "Dos dobles enlaces", prompt: "¿Qué fórmula corresponde a hepta-2,5-dieno?", formula: "7 C · C2=C3 · C5=C6", options: ["CH₃—CH=CH—CH₂—CH=CH—CH₃", "CH₂=CH—CH₂—CH₂—CH₂—CH=CH₂", "CH₃—C≡C—CH₂—C≡C—CH₃"], answer: 0, explain: "Los dobles enlaces comienzan en C2 y C5 dentro de una cadena de 7 carbonos." },
  { level: 4, title: "Tres triples enlaces", prompt: "¿Qué estructura representa nona-2,4,6-triino?", formula: "9 C · triples en 2, 4 y 6", options: ["CH₃—C≡C—C≡C—C≡C—CH₂—CH₃", "HC≡C—CH₂—C≡C—CH₂—C≡CH", "CH₃—CH=CH—CH=CH—CH=CH—CH₂—CH₃"], answer: 0, explain: "La cadena tiene 9 C; los triples se sitúan entre C2–C3, C4–C5 y C6–C7." },
  { level: 4, title: "Cadena más larga", prompt: "¿Por qué 2-etilbutano no es el nombre correcto de esa conectividad?", formula: "una cadena aparente de 4 C + etil", options: ["Porque etil no existe", "Porque se puede trazar una cadena continua de 5 C", "Porque las ramas siempre deben ser metil"], answer: 1, explain: "La parte del supuesto etil entra en el recorrido más largo. La estructura se nombra como 3-metilpentano." },
  { level: 4, title: "Orden alfabético", prompt: "¿Cuál es el orden correcto al citar una rama etil y otra metil?", formula: "C3: etil · C2: metil · cadena: hexano", options: ["2-metil-3-etilhexano", "3-etil-2-metilhexano", "3-etil-2-dimetilhexano"], answer: 1, explain: "Etil se cita antes que metil por orden alfabético: 3-etil-2-metilhexano." },
  { level: 4, title: "Auditoría de valencias", prompt: "¿Por qué CH₃=CH₃ es imposible para el alqueno neutro habitual?", formula: "CH₃=CH₃", options: ["Cada C sumaría 5 enlaces", "Cada C solo sumaría 3", "El H puede formar dos enlaces"], answer: 0, explain: "Cada C tendría 3 enlaces C—H más 2 del C=C: total 5. La estructura correcta es CH₂=CH₂." },

  { level: 1, title: "Definición de hidrocarburo", prompt: "¿Cuál de estas sustancias es un hidrocarburo?", formula: "composición", options: ["C₂H₆", "C₂H₆O", "CH₃NH₂"], answer: 0, explain: "Un hidrocarburo contiene exclusivamente C e H; C₂H₆ es etano." },
  { level: 1, title: "Mapa de clasificación", prompt: "¿Qué grupo pertenece a los hidrocarburos de cadena abierta?", formula: "cadena abierta", options: ["Alcanos, alquenos y alquinos", "Solo cicloalcanos", "Heterociclos con N"], answer: 0, explain: "Los alcanos, alquenos y alquinos pueden formar cadenas abiertas; se distinguen por sus enlaces C—C." },
  { level: 1, title: "Fórmula de alcanos", prompt: "¿Qué fórmula general corresponde a un alcano acíclico?", formula: "cadena abierta · enlaces simples", options: ["CₙH₂ₙ₊₂", "CₙH₂ₙ", "CₙH₂ₙ₋₂"], answer: 0, explain: "Un alcano abierto y saturado sigue CₙH₂ₙ₊₂." },
  { level: 4, title: "Cuenta una fórmula condensada", prompt: "¿Cuántos carbonos contiene CH₃—(CH₂)₆—CH₃?", formula: "CH₃—(CH₂)₆—CH₃", options: ["6", "8", "10"], answer: 1, explain: "Cuenta los dos CH₃ terminales y los seis CH₂: 1 + 6 + 1 = 8, octano." },
  { level: 1, title: "Alqueno sencillo", prompt: "Un alqueno acíclico con un solo doble enlace suele seguir…", formula: "un C=C · sin anillos", options: ["CₙH₂ₙ₊₂", "CₙH₂ₙ", "CₙH₂ₙ₋₄"], answer: 1, explain: "Un doble enlace resta H₂ respecto al alcano: CₙH₂ₙ." },
  { level: 4, title: "Varios dobles enlaces", prompt: "¿Qué indica el sufijo -dieno?", formula: "hexa-2,4-dieno", options: ["Dos dobles enlaces", "Dos triples enlaces", "Un anillo de seis C"], answer: 0, explain: "di- cuenta dos y -eno identifica dobles enlaces; deben aparecer dos localizadores." },
  { level: 4, title: "Dobles conjugados", prompt: "¿Cuál muestra dos dobles enlaces conjugados?", formula: "alternancia doble–simple–doble", options: ["C=C—C=C", "C=C—C—C=C", "C=C=C"], answer: 0, explain: "En un sistema conjugado los dobles enlaces están separados por un único enlace simple." },
  { level: 6, title: "Poliinsaturadas en nutrición", prompt: "¿Qué afirmación es más correcta sobre muchos ácidos grasos poliinsaturados habituales?", formula: "linoleico · α-linolénico", options: ["Todos sus dobles enlaces son conjugados", "Con frecuencia están separados por un CH₂", "Siempre contienen un triple enlace"], answer: 1, explain: "En muchos PUFA naturales los dobles enlaces están separados por un grupo metileno; los conjugados son casos específicos." },
  { level: 2, title: "Hidrógeno en un alquino terminal", prompt: "En HC≡C—CH₃, ¿por qué el primer carbono solo lleva un H?", formula: "H—C≡C—", options: ["El triple ya aporta 3 enlaces", "El carbono solo admite 2 enlaces", "El H forma un triple enlace"], answer: 0, explain: "El C≡C ocupa tres valencias; solo queda una para enlazarse con H." },
  { level: 1, title: "Cicloalcano", prompt: "¿Qué fórmula molecular tiene el ciclopentano?", formula: "anillo saturado de 5 C", options: ["C₅H₁₂", "C₅H₁₀", "C₅H₈"], answer: 1, explain: "Un cicloalcano monocíclico saturado sigue CₙH₂ₙ: C₅H₁₀." },
  { level: 4, title: "Una fórmula, dos posibilidades", prompt: "C₅H₁₀ podría corresponder a…", formula: "CₙH₂ₙ", options: ["Solo penteno", "Un penteno o un ciclopentano", "Solo pentano"], answer: 1, explain: "La fórmula CₙH₂ₙ puede deberse a un doble enlace o a un anillo; necesitamos conocer la estructura." },
  { level: 1, title: "Benceno", prompt: "¿Qué fórmula corresponde al benceno?", formula: "anillo aromático", options: ["C₆H₆", "C₆H₁₂", "C₆H₁₄"], answer: 0, explain: "El benceno tiene fórmula C₆H₆ y electrones π deslocalizados." },
  { level: 1, title: "Qué significa aromático", prompt: "En química, que un compuesto sea aromático significa principalmente que…", formula: "anillo aromático", options: ["Siempre tiene olor agradable", "Posee un sistema electrónico cíclico deslocalizado", "Contiene obligatoriamente oxígeno"], answer: 1, explain: "Aromático es una categoría estructural y electrónica; no es una descripción del olor." },
  { level: 6, title: "Heterociclos", prompt: "¿Por qué la pirimidina no es un hidrocarburo?", formula: "anillo con C y N", options: ["Porque es cíclica", "Porque contiene N además de C y H", "Porque todos sus enlaces son simples"], answer: 1, explain: "Un hidrocarburo solo contiene C e H. La pirimidina es un heterociclo nitrogenado." },
  { level: 6, title: "Cis y trans", prompt: "¿Qué característica del C=C permite la isomería cis/trans?", formula: "grupos alrededor de C=C", options: ["La libre rotación completa", "La rotación restringida del doble enlace", "La presencia obligatoria de N"], answer: 1, explain: "El doble enlace restringe la rotación; grupos adecuados pueden quedar al mismo lado o en lados opuestos." },
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
  const [practiceModuleFilter, setPracticeModuleFilter] = useState<number | null>(null);
  const [practiceView, setPracticeView] = useState<"routes" | "free">("routes");
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [courseMapOpen, setCourseMapOpen] = useState(false);
  const [atoms, setAtoms] = useState<Atom[]>([]);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [bondOrder, setBondOrder] = useState<1 | 2 | 3>(1);
  const [tool, setTool] = useState<"move" | "bond" | "delete">("bond");
  const [firstAtom, setFirstAtom] = useState<number | null>(null);
  const [targetAt, setTargetAt] = useState(0);
  const [labReturnQuestion, setLabReturnQuestion] = useState<number | null>(null);
  const [labReturnModule, setLabReturnModule] = useState<number | null>(null);
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
  const indexedQuestions = questions.map((q, i) => ({ ...q, globalIndex: i }));
  const lessonQuestions = indexedQuestions.filter((q) => questionTheory[q.globalIndex] === moduleId);
  const levelQuestions = indexedQuestions.filter((q) => practiceModuleFilter !== null ? questionTheory[q.globalIndex] === practiceModuleFilter : q.level === level);
  const question = levelQuestions[Math.min(questionAt, levelQuestions.length - 1)];
  const currentTarget = labTargets[targetAt];
  const relatedModule = modules[questionTheory[question.globalIndex]];
  const solvedInCurrentPractice = solved.filter((id) => levelQuestions.some((q) => q.globalIndex === id)).length;
  const labStep = atoms.length < 2 ? 1 : tool !== "bond" ? 2 : firstAtom === null ? 3 : 4;

  const bondTotals = useMemo(() => {
    const totals: Record<number, number> = {};
    atoms.forEach((a) => { totals[a.id] = 0; });
    bonds.forEach((b) => { totals[b.a] = (totals[b.a] ?? 0) + b.order; totals[b.b] = (totals[b.b] ?? 0) + b.order; });
    return totals;
  }, [atoms, bonds]);

  function earn(amount: number) { setXp((v) => v + amount); }

  function markModule() {
    if (!completed.includes(moduleId)) { setCompleted((v) => [...v, moduleId]); earn(15); }
    if (moduleId < modules.length - 1) {
      setModuleId(moduleId + 1);
      setTimeout(() => document.getElementById("guide")?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  function selectModule(nextModule: number) {
    setModuleId(Math.max(0, Math.min(modules.length - 1, nextModule)));
    setCourseMapOpen(false);
    setTimeout(() => document.getElementById("guide")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function checkAnswer() {
    if (picked === null) return;
    if (picked === question.answer) {
      setFeedback("correct");
      if (!solved.includes(question.globalIndex)) { setSolved((v) => [...v, question.globalIndex]); earn(20); }
    } else setFeedback("wrong");
  }

  function nextQuestion() {
    if (questionAt < levelQuestions.length - 1) setQuestionAt((v) => v + 1);
    else if (practiceModuleFilter !== null) setQuestionAt(0);
    else if (level < levelNames.length) { setLevel((v) => v + 1); setQuestionAt(0); }
    else setQuestionAt(0);
    setPicked(null); setFeedback(null); setShowHint(false); setShowChoices(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openRelatedTheory() {
    setModuleId(questionTheory[question.globalIndex]);
    setMode("learn");
    setTimeout(() => document.getElementById("guide")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function startLabActivity() {
    setTargetAt(0);
    clearLab();
    setLabReturnQuestion(question.globalIndex);
    setLabReturnModule(null);
    setMode("lab");
    setTool("bond");
    setLabFeedback("Paso 1: añade un carbono y cuatro hidrógenos. Después toca dos átomos para unirlos.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startLessonLab(targetIndex: number) {
    setTargetAt(targetIndex);
    clearLab();
    setLabReturnQuestion(null);
    setLabReturnModule(moduleId);
    setMode("lab");
    setTool("bond");
    setLabFeedback(`Actividad de la lección ${moduleId + 1}: construye ${labTargets[targetIndex].formula}. Añade los átomos y únelos respetando sus valencias.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startLessonQuestionLab(globalIndex: number) {
    const formula = questions[globalIndex]?.formula ?? "CH₄";
    const targetIndex = formula.includes("C₂H₄") ? 4 : formula.includes("C₂H₂") ? 5 : formula.includes("C₂H₆") ? 3 : formula.includes("H₂O") ? 1 : formula.includes("NH₃") ? 2 : 0;
    startLessonLab(targetIndex);
  }

  function solveInline(globalIndex: number) {
    if (!solved.includes(globalIndex)) { setSolved((value) => [...value, globalIndex]); earn(20); }
  }

  function addAtom(element: ElementKey, x?: number, y?: number) {
    const box = canvasRef.current?.getBoundingClientRect();
    const placements = [[.5, .5], [.22, .25], [.78, .25], [.22, .75], [.78, .75], [.5, .16], [.5, .84], [.12, .5], [.88, .5]];
    const place = placements[atoms.length % placements.length];
    const px = x ?? (box ? box.width * place[0] : 250);
    const py = y ?? (box ? box.height * place[1] : 180);
    setAtoms((v) => [...v, { id: Date.now() + Math.random(), element, x: Math.max(34, px), y: Math.max(34, py) }]);
    setTool("bond");
    setFirstAtom(null);
    setLabFeedback(`${element} colocado. Enlace ${bondOrder === 1 ? "simple" : bondOrder === 2 ? "doble" : "triple"} activo: toca el primer átomo y después el segundo.`);
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
      if (firstAtom === null) { setFirstAtom(atom.id); setLabFeedback(`Primer átomo elegido: ${atom.element}. Ahora toca el segundo átomo para crear el enlace.`); }
      else if (firstAtom !== atom.id) {
        const existing = bonds.find((b) => (b.a === firstAtom && b.b === atom.id) || (b.b === firstAtom && b.a === atom.id));
        if (existing) setBonds((v) => v.map((b) => b.id === existing.id ? { ...b, order: bondOrder } : b));
        else setBonds((v) => [...v, { id: Date.now() + Math.random(), a: firstAtom, b: atom.id, order: bondOrder }]);
        setFirstAtom(null); setLabFeedback(`Enlace ${bondOrder === 1 ? "simple" : bondOrder === 2 ? "doble" : "triple"} creado.`);
      } else { setFirstAtom(null); setLabFeedback("Selección cancelada. Toca un átomo para empezar de nuevo."); }
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

  function clearLab() { setAtoms([]); setBonds([]); setFirstAtom(null); setTool("bond"); setLabFeedback("Paso 1: añade los átomos. El enlace simple ya está seleccionado."); }

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
    if (labReturnQuestion !== null) {
      if (!solved.includes(labReturnQuestion)) { setSolved((v) => [...v, labReturnQuestion]); earn(25); }
      setTimeout(() => { setLabReturnQuestion(null); setMode("practice"); nextQuestion(); }, 1600);
    } else if (labReturnModule !== null) {
      earn(25);
      const returnTo = labReturnModule;
      setTimeout(() => { setLabReturnModule(null); setModuleId(returnTo); setMode("learn"); setTimeout(() => document.getElementById("lesson-practice")?.scrollIntoView({ behavior: "smooth" }), 50); }, 1600);
    } else earn(25);
  }

  function switchMode(next: Mode) { setMode(next); window.scrollTo({ top: 0, behavior: "smooth" }); }

  function tutorReply(raw: string) {
    const q = raw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (/electrones? de valencia|que es valencia|valencia y/.test(q)) return "Son conceptos distintos: los electrones de valencia son los electrones que el átomo SÍ tiene en su capa externa; la valencia indica cuántos enlaces suele formar. En el carbono ambos números suelen ser 4, y por eso se confunden.";
    if (/octeto|ocho electrones|8 electrones/.test(q)) return "La regla del octeto dice que muchos átomos de C, N y O son especialmente estables cuando cuentan 8 electrones a su alrededor. No significa que siempre se queden con electrones ajenos: en un enlace covalente los comparten.";
    if (/simple|doble|triple|rayas?/.test(q)) return "Cuenta rayas: — vale 1, = vale 2 y ≡ vale 3. En CH₂=CH₂, cada C suma 2 enlaces C—H y 2 del C=C: total 4. En HC≡CH suma 1 + 3: también 4.";
    if (/localizador|sustituyente|rama|di-|tri-|tetra-/.test(q)) return "Un localizador es un número que funciona como una dirección dentro de la cadena: señala dónde comienza C=C o C≡C, qué carbono lleva OH o dónde se conecta una rama. Un sustituyente es una rama que queda fuera de la cadena principal: —CH₃ se llama metil y —CH₂—CH₃, etil. En 2-metilbutano, el 2 localiza la rama metil sobre el carbono 2 de una cadena principal de cuatro carbonos.";
    if (/ch3|metilo/.test(q)) return "CH₃ tiene tres enlaces C—H, pero puede tener un cuarto enlace que aparece fuera del grupo. En CH₃—CH₃, la raya entre ambos carbonos completa la cuenta: 3 + 1 = 4. CH₃ aislado no representa el etano completo.";
    if (/primario|secundario|terciario|cuaternario|grado del carbono/.test(q)) return "Aquí no cuentas todas las rayas: cuentas únicamente cuántos carbonos tocan directamente al carbono estudiado. 1 vecino C = primario; 2 = secundario; 3 = terciario; 4 = cuaternario.";
    if (/alcano|alqueno|alquino/.test(q)) return "Mira el enlace entre carbonos: alcano solo tiene simples (-ano), alqueno contiene al menos un doble (-eno) y alquino al menos un triple (-ino). Para 2 carbonos: etano CH₃—CH₃, eteno CH₂=CH₂ y etino HC≡CH.";
    if (/nomenclatura|prefijo|sufijo|localizador|como se nombra|nombre de/.test(q)) return "Separa el nombre en piezas: 1) el prefijo indica la longitud de la cadena (met-, et-, prop-, but-, pent-), 2) el número localiza el enlace o grupo y 3) el sufijo identifica la familia (-ano, -eno, -ino, -ol, -al, -ona, -oico). Después dibuja el esqueleto y completa la tetravalencia del carbono.";
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
          <button className={mode === "learn" ? "active" : ""} onClick={() => switchMode("learn")}><span>01</span> Ruta de estudio</button>
          <button className={mode === "practice" ? "active" : ""} onClick={() => { setPracticeModuleFilter(null); setPracticeView("routes"); setQuestionAt(0); switchMode("practice"); }}><span>02</span> Repaso final</button>
          <button className={mode === "lab" && labReturnModule === null && labReturnQuestion === null ? "active" : ""} onClick={() => { setLabReturnModule(null); setLabReturnQuestion(null); switchMode("lab"); }}><span>03</span> Pizarra libre</button>
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

        <section className="guide" id="guide">
          <div className="guide-sidebar">
            <div className="course-dock">
              <div className="course-dock-current"><span>ESTÁS ESTUDIANDO</span><b><i>{String(moduleId + 1).padStart(2, "0")}</i>{currentModule.title}</b><small>{currentModule.eyebrow}</small></div>
              <div className="mini-progress"><div><span>Progreso del temario</span><b>{completed.length}/{modules.length} lecciones</b></div><i><u style={{ width: `${completed.length / modules.length * 100}%` }}/></i></div>
              <div className="course-dock-actions">
                <button aria-label="Ir a la lección anterior" disabled={moduleId === 0} onClick={() => selectModule(moduleId - 1)}>←</button>
                <button className="course-map-toggle" aria-expanded={courseMapOpen} aria-controls="course-module-list" onClick={() => setCourseMapOpen((open) => !open)}><span>{courseMapOpen ? "Cerrar" : "Ver"} temario</span><i>{courseMapOpen ? "−" : "+"}</i></button>
                <button aria-label="Ir a la lección siguiente" disabled={moduleId === modules.length - 1} onClick={() => selectModule(moduleId + 1)}>→</button>
              </div>
            </div>
            {courseMapOpen && <div className="module-list" id="course-module-list">
              {modules.map((m) => <button key={m.id} onClick={() => selectModule(m.id)} className={moduleId === m.id ? "selected" : ""}><span>{completed.includes(m.id) ? "✓" : String(m.id + 1).padStart(2, "0")}</span><div><small>{m.eyebrow}</small><b>{m.title}</b></div><em>›</em></button>)}
            </div>}
          </div>
          <div className="lesson">
            <div className="lesson-top"><div><span>{currentModule.eyebrow}</span><h2>{currentModule.title}</h2></div><small>◷ {currentModule.time}</small></div>
            <p className="lesson-intro">{currentModule.intro}</p>
            <div className="principle"><span>IDEA CLAVE</span><p>{currentModule.principle}</p></div>
            <div className="unified-lesson-route"><span className="active"><b>1</b>Estudiar</span><i>→</i><span><b>2</b>Ver ejemplos</span><i>→</i><span><b>3</b>Practicar</span><i>→</i><span><b>4</b>Actividad aplicada</span><i>→</i><span><b>5</b>Completar tema</span></div>
            <div className="study-body">
              <div className="study-label"><span>PASO 1 · LECCIÓN {moduleId + 1}</span><b>Teoría completa en un solo lugar</b><small>Empieza aquí y continúa hacia abajo; no necesitas buscar explicaciones en otra sección.</small></div>
              {studySections[moduleId].map((section) => <section className="study-section" key={section.heading}>
                <h3>{section.heading}</h3>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.worked && <div className="worked-example"><div><span>EJEMPLO RESUELTO</span><b>{section.worked.title}</b></div><Formula text={section.worked.formula}/><ol>{section.worked.steps.map((step, i) => <li key={step}><span>{i + 1}</span><p>{step}</p></li>)}</ol></div>}
              </section>)}
              {(moduleId === 2 || moduleId === 3) && <CourseDepth key={moduleId} moduleId={moduleId} onPractice={() => document.getElementById("lesson-practice")?.scrollIntoView({ behavior: "smooth" })} onBranches={() => document.getElementById("branch-embedded")?.scrollIntoView({ behavior: "smooth" })} onAsk={askTutor}/>}
            </div>
            <h3 className="visual-summary-title">Paso 2 · Resumen y ejemplos antes de practicar</h3>
            <div className="lesson-columns">
              <div><h3>Lo que vas a dominar</h3><ol>{currentModule.topics.map((t, i) => <li key={t}><span>{i + 1}</span>{t}</li>)}</ol></div>
              <div><h3>Ejemplos que debes leer</h3>{currentModule.examples.map((e) => <div className="example-row" key={e[0]}><Formula text={e[0]}/><div><b>{e[1]}</b><small>{e[2]}</small></div></div>)}</div>
            </div>
            {moduleId === 4 && <div className="group-map">{functionalGroups.map((g) => <div key={g[0]}><span>{g[0]}</span><b>{g[1]}</b><small>{g[2]}</small></div>)}</div>}
            {moduleId === 1 && <div className="degree-compare"><div><b>¿Cuántos enlaces suma?</b><strong>Valencia</strong><p>Cuenta rayas: — vale 1, = vale 2 y ≡ vale 3.</p></div><span>≠</span><div><b>¿A cuántos C toca?</b><strong>Grado</strong><p>1 C = primario; 2 = secundario; 3 = terciario; 4 = cuaternario.</p></div></div>}
            <InlineLessonPractice key={moduleId} moduleId={moduleId} moduleTitle={currentModule.title} questions={lessonQuestions} solved={solved} onSolve={solveInline} onAsk={askTutor} onOpenLab={startLessonQuestionLab}/>
            {moduleId === 2 && <div id="branch-embedded"><ChainBranchLesson embedded onEarn={earn} onAsk={askTutor}/></div>}
            {(moduleId === 0 || moduleId === 1 || moduleId === 3) && <section className="lesson-lab-activity"><div><span>PASO 4 · ACTIVIDAD APLICADA</span><h3>Compruébalo construyendo</h3><p>La pizarra se abre con moléculas relacionadas con esta lección y vuelve aquí cuando la estructura sea correcta.</p></div><div>{(moduleId === 0 ? [0,1,2] : moduleId === 1 ? [0,3,4,5] : [3,4,5]).map((targetIndex) => <button key={targetIndex} onClick={() => startLessonLab(targetIndex)}><b>{labTargets[targetIndex].formula}</b><small>{labTargets[targetIndex].name}</small></button>)}</div></section>}
            {(moduleId === 2 || moduleId === 3) && <div className="optional-free-tool"><div><span>PRÁCTICA EXTRA OPCIONAL</span><b>Gimnasio de nomenclatura</b><p>Úsalo después de completar los ejercicios de esta lección si quieres practicar muchas variantes.</p></div><button onClick={() => switchMode("nomenclature")}>Abrir práctica libre →</button></div>}
            <div className="coach-tip"><span>!</span><div><b>Error frecuente</b><p>{currentModule.tip}</p></div></div>
            <div className="lesson-footer unified-finish"><div><span>PASO 5</span><b>{lessonQuestions.filter((q) => solved.includes(q.globalIndex)).length}/{lessonQuestions.length} ejercicios dominados</b></div><button className="primary" onClick={markModule}>{completed.includes(moduleId) ? "Ir a la siguiente lección" : "Completar tema · +15 XP"} <span>→</span></button></div>
          </div>
        </section>
      </>}

      {mode === "practice" && <section className="practice-page">
        <div className="page-intro"><span className="kicker"><i/> {practiceModuleFilter !== null ? "PRÁCTICA RELACIONADA CON LA TEORÍA" : practiceView === "routes" ? "REPASO TEÓRICO Y PRÁCTICO" : "ENTRENAMIENTO ADAPTATIVO"}</span><h1>{practiceModuleFilter !== null ? <>Afianza la<br/><em>lección {practiceModuleFilter + 1}.</em></> : practiceView === "routes" ? <>Relaciona.<br/><em>Aplica. Recuerda.</em></> : "Piensa como un químico."}</h1><p>{practiceModuleFilter !== null ? `Estos ejercicios trabajan únicamente “${modules[practiceModuleFilter].title}”, siguiendo el mismo orden de ideas y ejemplos.` : practiceView === "routes" ? "Repasa grupos de temas que dependen unos de otros y descubre exactamente qué conexión necesitas reforzar." : "No basta con acertar: después de cada respuesta verás la regla que permite deducirla."}</p></div>
        {practiceModuleFilter === null && <div className="practice-view-tabs"><button className={practiceView === "routes" ? "active" : ""} onClick={() => setPracticeView("routes")}><span>01</span><div><b>Repaso por bloques</b><small>Teoría conectada + diagnóstico</small></div></button><button className={practiceView === "free" ? "active" : ""} onClick={() => setPracticeView("free")}><span>02</span><div><b>Ejercicios por nivel</b><small>Práctica rápida y libre</small></div></button></div>}
        {practiceModuleFilter === null && practiceView === "routes" ? <IntegratedReview onEarn={earn} onAsk={askTutor}/> : <>
        {practiceModuleFilter !== null && <div className="lesson-practice-route"><span>1 · TEORÍA LEÍDA</span><i>→</i><span>2 · EJEMPLOS RESUELTOS</span><i>→</i><b>3 · PRÁCTICA DE LA LECCIÓN</b><button onClick={() => { setModuleId(practiceModuleFilter); setMode("learn"); setTimeout(() => document.getElementById("guide")?.scrollIntoView({ behavior: "smooth" }), 50); }}>← Volver a la teoría</button></div>}
        <div className="level-tabs">{levelNames.map((name, i) => <button key={name} className={practiceModuleFilter === null && level === i + 1 ? "active" : ""} onClick={() => { setPracticeModuleFilter(null); setLevel(i + 1); setQuestionAt(0); setPicked(null); setFeedback(null); setShowHint(false); }}><span>{i + 1}</span><b>{name}</b><small>{questions.filter((q) => q.level === i + 1).length} retos</small></button>)}</div>
        <div className="practice-shell">
          <div className="challenge-card">
            <div className="challenge-meta"><span>{practiceModuleFilter !== null ? `LECCIÓN ${practiceModuleFilter + 1}` : `NIVEL ${level}`}</span><small>RETO {questionAt + 1} DE {levelQuestions.length}</small></div>
            <div className="theory-link"><div><span>ESTÁS PRACTICANDO</span><b>Lección {relatedModule.id + 1} · {relatedModule.title}</b></div><button onClick={openRelatedTheory}>Repasar teoría →</button></div>
            <h2>{question.title}</h2><p>{question.prompt}</p><Formula text={question.formula}/>
            {question.options.length === 1 ? <button className="start-lab-activity" onClick={startLabActivity}><span>🧪</span><div><b>Construir en el laboratorio</b><small>Volverás automáticamente al siguiente reto cuando la molécula sea correcta.</small></div><em>→</em></button> : (practiceModuleFilter === 2 || practiceModuleFilter === 3) && !showChoices ? <div className="active-recall"><span>✎</span><div><b>Primero resuélvelo sin mirar opciones</b><p>{practiceModuleFilter === 2 ? "Escribe el nombre o dibuja la fórmula en papel. La corrección será más útil si produces la respuesta antes de reconocerla." : "Clasifica la estructura y justifica qué enlace o forma de cadena has observado."}</p></div><button onClick={() => setShowChoices(true)}>Ya lo he intentado · ver opciones</button></div> : <div className="answers">{question.options.map((option, i) => <button key={option} onClick={() => { setPicked(i); setFeedback(null); }} className={`${picked === i ? "picked" : ""} ${feedback && i === question.answer ? "right" : ""} ${feedback === "wrong" && picked === i ? "wrong" : ""}`}><span>{String.fromCharCode(65 + i)}</span>{option}</button>)}</div>}
            {feedback && <div className={`feedback ${feedback}`}><span>{feedback === "correct" ? "✓" : "↺"}</span><div><b>{feedback === "correct" ? "Exacto. +20 XP" : "Todavía no. Revisa la cuenta."}</b><p>{question.explain}</p></div></div>}
            {showHint && !feedback && <div className="hint-box">Pista: separa la estructura átomo por átomo y cuenta las rayas que salen de cada uno.</div>}
            {question.options.length > 1 && (!(practiceModuleFilter === 2 || practiceModuleFilter === 3) || showChoices) && <div className="challenge-actions"><button className="hint" onClick={() => setShowHint(true)}>✦ Dame una pista</button>{feedback === "correct" ? <button className="primary" onClick={nextQuestion}>{questionAt === levelQuestions.length - 1 ? practiceModuleFilter !== null ? "Repetir práctica" : level < levelNames.length ? `Continuar al nivel ${level + 1}` : "Volver al inicio" : "Siguiente reto"} →</button> : <button className="primary" disabled={picked === null} onClick={checkAnswer}>Comprobar</button>}</div>}
          </div>
          <aside className="score-card"><span>{practiceModuleFilter !== null ? "PROGRESO DE LA LECCIÓN" : "PROGRESO DEL NIVEL"}</span><div className="score-ring" style={{ "--score": `${solvedInCurrentPractice / levelQuestions.length * 360}deg` } as React.CSSProperties}><b>{solvedInCurrentPractice}/{levelQuestions.length}</b></div><h3>{solvedInCurrentPractice === levelQuestions.length ? "¡Contenido afianzado!" : "Sigue razonando"}</h3><p>Este ejercicio corresponde a:</p><strong>{relatedModule.title}</strong><button onClick={openRelatedTheory}>Ver la explicación relacionada</button></aside>
        </div>
        </>}
      </section>}

      {mode === "nomenclature" && <><div className="context-return"><span>PRÁCTICA EXTRA · LECCIÓN {moduleId + 1}</span><b>Has abierto el gimnasio desde «{currentModule.title}».</b><button onClick={() => { switchMode("learn"); setTimeout(() => document.getElementById("lesson-practice")?.scrollIntoView({ behavior: "smooth" }), 50); }}>← Volver a esta lección</button></div><NomenclatureTrainer onEarn={earn} onAsk={askTutor}/></>}

      {mode === "lab" && <section className="lab-page">
        <div className="page-intro lab-intro"><span className="kicker"><i/> PIZARRA MOLECULAR</span><h1>Construye. Une. Comprueba.</h1><p>Añade los átomos y únelos tocando primero uno y después otro. La guía te indica siempre el siguiente paso.</p></div>
        {labReturnQuestion !== null && <div className="lab-return-banner"><span>ACTIVIDAD DE LA LECCIÓN {questionTheory[labReturnQuestion] + 1}</span><b>Completa {currentTarget.formula}; volverás al siguiente ejercicio automáticamente.</b></div>}
        {labReturnModule !== null && <div className="lab-return-banner"><span>ACTIVIDAD DE LA LECCIÓN {labReturnModule + 1}</span><b>Completa {currentTarget.formula}; volverás al mismo punto de la teoría automáticamente.</b></div>}
        <div className="target-bar"><div><span>RETO ACTUAL</span><b>{currentTarget.name} <em>{currentTarget.formula}</em></b></div><div className="target-options">{labTargets.map((t, i) => <button disabled={labReturnQuestion !== null || labReturnModule !== null} className={targetAt === i ? "active" : ""} onClick={() => { setTargetAt(i); clearLab(); }} key={t.name}>{t.formula}</button>)}</div><button className="target-hint" onClick={() => setLabFeedback(`Pista: ${currentTarget.hint}`)}>✦ Pista</button></div>
        <div className="lab-shell">
          <aside className="atom-palette"><span>PASO 1 · AÑADE ÁTOMOS</span>{(["C", "H", "O", "N"] as ElementKey[]).map((e) => <button key={e} draggable onDragStart={(ev) => ev.dataTransfer.setData("element", e)} onClick={() => addAtom(e)} className={`palette-atom atom-${e.toLowerCase()}`}><i>{e}</i><div><b>{e === "C" ? "Carbono" : e === "H" ? "Hidrógeno" : e === "O" ? "Oxígeno" : "Nitrógeno"}</b><small>toca para añadir · valencia {valence[e]}</small></div><em>＋</em></button>)}<div className="palette-note"><b>No hace falta arrastrar</b><p>Toca C, H, O o N y aparecerá en la pizarra. Después podrás moverlo.</p></div></aside>
          <div className="board-wrap">
            <div className="lab-steps" aria-label="Pasos para construir una molécula">
              <div className={labStep >= 1 ? "done" : ""}><span>1</span><p><b>Añade</b><small>los átomos</small></p></div><i>→</i>
              <div className={labStep >= 2 ? "done" : ""}><span>2</span><p><b>Elige</b><small>tipo de enlace</small></p></div><i>→</i>
              <div className={labStep >= 3 ? "done current" : ""}><span>3</span><p><b>Toca 2 átomos</b><small>{firstAtom === null ? "primero uno, luego otro" : "ahora toca el segundo"}</small></p></div><i>→</i>
              <div className={bonds.length ? "done" : ""}><span>4</span><p><b>Comprueba</b><small>la molécula</small></p></div>
            </div>
            <div className="board-tools">
              <div className="bond-tools"><span>PASO 2 · ELIGE EL ENLACE</span>{([1, 2, 3] as const).map((o) => <button key={o} aria-label={`Crear enlace ${o === 1 ? "simple" : o === 2 ? "doble" : "triple"}`} className={tool === "bond" && bondOrder === o ? "active" : ""} onClick={() => { setTool("bond"); setBondOrder(o); setFirstAtom(null); setLabFeedback(`Enlace ${o === 1 ? "simple" : o === 2 ? "doble" : "triple"} activo. Toca el primer átomo y después el segundo.`); }}><b>{o === 1 ? "Simple" : o === 2 ? "Doble" : "Triple"}</b><em>{o === 1 ? "—" : o === 2 ? "=" : "≡"}</em></button>)}</div>
              <button className={tool === "move" ? "active" : ""} onClick={() => { setTool("move"); setFirstAtom(null); setLabFeedback("Modo mover activo. Arrastra un átomo; después vuelve a elegir un enlace."); }}>✥ Mover</button>
              <button className={tool === "delete" ? "active danger" : ""} onClick={() => { setTool("delete"); setFirstAtom(null); }}>⌫ Borrar</button><button onClick={clearLab}>Limpiar todo</button>
            </div>
            <div className="molecule-board" ref={canvasRef} onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
              <div className="board-watermark"><span>LAB // 01</span><b>{atoms.length ? firstAtom !== null ? "PRIMER ÁTOMO ELEGIDO · TOCA EL SEGUNDO" : "TOCA DOS ÁTOMOS PARA UNIRLOS" : "TOCA UN ÁTOMO DE LA PALETA"}</b></div>
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
        <div className="tutor-context">Ahora estás en: <b>{mode === "learn" ? currentModule.title : mode === "practice" ? `Nivel ${level}: ${levelNames[level - 1]}` : mode === "nomenclature" ? "Gimnasio de nomenclatura" : `Laboratorio · ${currentTarget.name}`}</b></div>
        <div className="tutor-chat">{tutorMessages.map((m, i) => <div className={`tutor-message ${m.role}`} key={i}><span>{m.role === "tutor" ? "C" : "Tú"}</span><p>{m.text}</p></div>)}</div>
        <div className="tutor-chips"><button onClick={() => askTutor("¿Por qué el carbono hace 4 enlaces?")}>¿Por qué C hace 4?</button><button onClick={() => askTutor("Diferencia entre amina y amida")}>Amina vs. amida</button></div>
        <form className="tutor-form" onSubmit={(e) => { e.preventDefault(); askTutor(); }}><input value={tutorInput} onChange={(e) => setTutorInput(e.target.value)} placeholder="Escribe tu duda o una fórmula…" aria-label="Pregunta para el tutor"/><button type="submit">→</button></form>
      </aside>}

      <footer><div><span className="brand-mark">C</span><b>Laboratorio del Carbono</b></div><p>Comprender · dibujar · comprobar</p><button onClick={() => { localStorage.removeItem("carbon-lab-progress"); setCompleted([]); setSolved([]); setXp(0); }}>Reiniciar progreso</button></footer>
    </main>
  );
}
