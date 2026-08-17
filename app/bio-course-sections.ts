// Teoría expandida, escrita una sola vez y renderizada de dos maneras:
// - Lectura continua: todas las secciones seguidas, en prosa.
// - Paso a paso: una sección por pantalla.
//
// Un bloque sin entrada aquí sigue funcionando: el lector reconstruye
// secciones a partir de las frases de `theory` en bio-course-data.ts.

export type BlockSection = {
  /** Encabezado corto. En lectura continua es un subtítulo; en paso a paso, el rótulo del paso. */
  heading: string;
  /** Prosa explicada. Un elemento = un párrafo. */
  paragraphs: string[];
  /** Línea monoespaciada opcional: ecuación, notación o secuencia. */
  formula?: string;
  /** Precisión que no debe cortar el hilo: va al margen en continua, y aparte en pasos. */
  note?: string;
};

export const blockSections: Record<string, BlockSection[]> = {
  // ───────────────────────── TEMA 1 · Química del carbono ─────────────────────────
  "t1-b1": [
    {
      heading: "Tres números que se confunden entre sí",
      paragraphs: [
        "El número atómico dice cuántos protones tiene un átomo y, si es neutro, cuántos electrones tiene en total. Es una etiqueta de identidad: el carbono es carbono porque tiene 6 protones, y eso no cambia nunca.",
        "Los electrones de valencia son solo los de la capa externa, los únicos que participan en los enlaces. El carbono tiene 6 electrones en total, pero solo 4 de valencia.",
        "Y el número de enlaces es una tercera cosa: cuántas rayas salen del átomo en el dibujo. Aquí es donde casi todo el mundo mezcla conceptos, porque en el carbono los dos últimos números coinciden — 4 electrones de valencia, 4 enlaces — y eso hace pensar que son lo mismo. No lo son.",
      ],
      note: "En el oxígeno se ve que no coinciden: tiene 6 electrones de valencia pero forma 2 enlaces.",
    },
    {
      heading: "La pauta que usarás todo el curso",
      paragraphs: [
        "Para las moléculas neutras y sencillas de bioquímica hay una regla práctica que funciona casi siempre y que conviene tener automatizada.",
      ],
      formula: "C = 4 enlaces   ·   N = 3   ·   O = 2   ·   H = 1",
      note: "No es una ley universal — hay excepciones con cargas y con azufre o fósforo — pero para todo lo que verás este curso es fiable.",
    },
    {
      heading: "Cómo se audita una fórmula",
      paragraphs: [
        "Con esa pauta ya no necesitas memorizar dibujos: puedes comprobar si una estructura es válida contando. Toma el metano, CH₄.",
        "El carbono necesita sumar cuatro enlaces. Cada hidrógeno solo puede formar uno, así que hacen falta cuatro hidrógenos, y cuatro enlaces simples C—H completan la cuenta de todos los átomos a la vez. La fórmula es válida.",
        "Este gesto — contar antes de aceptar una estructura — es el que te va a salvar más adelante, cuando las moléculas tengan veinte carbonos y no puedas fiarte de la memoria visual.",
      ],
    },
  ],

  "t1-b2": [
    {
      heading: "La misma molécula, cuatro maneras de escribirla",
      paragraphs: [
        "Una molécula no tiene una única forma correcta de escribirse. Tiene varias, y cada una está diseñada para responder a una pregunta distinta. Confundirlas es una fuente clásica de errores en el examen.",
        "La fórmula molecular da el número real de átomos de cada tipo. El etano es C₂H₆: dos carbonos, seis hidrógenos, ni uno más.",
        "La fórmula empírica reduce esos subíndices a la proporción entera más simple. Para C₂H₆, dividiendo entre dos, queda CH₃. Ojo: no existe ninguna molécula que sea CH₃ — la empírica es una proporción, no una molécula.",
      ],
    },
    {
      heading: "Las que sí muestran la estructura",
      paragraphs: [
        "Las dos anteriores solo cuentan átomos. Ninguna dice cómo están unidos, y en química orgánica eso es justo lo que importa.",
        "La fórmula semidesarrollada muestra la conectividad principal agrupando los hidrógenos: CH₃—CH₃. Es la que más usarás, porque es rápida de escribir y ya dice lo esencial.",
        "La desarrollada dibuja todos los enlaces, uno por uno, incluidos los C—H. Es incómoda para moléculas grandes pero es la que no deja nada implícito.",
      ],
      formula: "C₂H₆   →   CH₃   →   CH₃—CH₃",
      note: "De izquierda a derecha: molecular, empírica, semidesarrollada. La información aumenta, no se repite.",
    },
    {
      heading: "Por qué esto importa para los isómeros",
      paragraphs: [
        "Aquí está el punto que hay que tener claro: dos isómeros comparten la fórmula molecular, no solo la empírica. Es una definición, y el libro a veces la enuncia mal.",
        "Traduce el eteno para verlo: cuentas 2 carbonos y 4 hidrógenos, así que la molecular es C₂H₄. Dividiendo entre dos, la empírica es CH₂. Y la semidesarrollada, CH₂=CH₂, es la única de las tres que te dice que hay un doble enlace.",
      ],
    },
  ],

  "t1-b3": [
    {
      heading: "El nombre de un compuesto es un mapa",
      paragraphs: [
        "Un nombre orgánico no es una etiqueta arbitraria que haya que memorizar. Es un conjunto de instrucciones para dibujar la molécula, y si aprendes a leerlo en orden, puedes reconstruir cualquier estructura sin haberla visto antes.",
        "Cada nombre responde a tres preguntas: cuántos carbonos tiene la cadena principal, dónde están las insaturaciones, y qué cuelga de ella y en qué punto.",
      ],
    },
    {
      heading: "Cadena principal: la más larga, no la más horizontal",
      paragraphs: [
        "La cadena principal es el recorrido continuo más largo de carbonos. Y aquí está la trampa que hace fallar a la mayoría: no tiene por qué coincidir con la línea horizontal del dibujo.",
        "Una molécula dibujada en forma de L puede tener su cadena más larga doblando la esquina. Antes de nombrar nada, traza con el dedo todos los recorridos posibles y quédate con el más largo.",
        "Lo que queda fuera de esa cadena es un sustituyente. Un —CH₃ suelto es un metil; un —CH₂—CH₃, un etil.",
      ],
      note: "Si dos recorridos empatan en longitud, se elige el que tenga más sustituyentes.",
    },
    {
      heading: "Localizadores: el número dice dónde",
      paragraphs: [
        "El localizador indica en qué carbono empieza un enlace múltiple o se une una rama. Se numera la cadena desde el extremo que dé los números más bajos posibles.",
        "Desmonta 3-metilhex-2-eno como si fueran instrucciones: «hex-» son 6 carbonos; «-2-eno» significa que hay un doble enlace que empieza en C2, es decir entre C2 y C3; «3-metil» es un CH₃ colgando del C3. Después completas hidrógenos hasta que cada carbono sume 4.",
      ],
      formula: "CH₃—CH=C(CH₃)—CH₂—CH₂—CH₃",
      note: "Fíjate en que el localizador de una insaturación señala el primero de los dos carbonos implicados, no los dos.",
    },
  ],

  "t1-b4": [
    {
      heading: "Saturado significa lleno de hidrógeno",
      paragraphs: [
        "Un hidrocarburo saturado es el que lleva el máximo número de hidrógenos que su cadena admite. Para conseguirlo, todos sus enlaces carbono-carbono tienen que ser simples: no queda ningún sitio libre.",
        "En cuanto aparece un doble o un triple enlace entre carbonos, la molécula pierde hidrógenos y deja de estar saturada. Por eso «insaturado» y «tiene C=C» describen la misma situación desde dos ángulos.",
      ],
    },
    {
      heading: "Las tres familias básicas",
      paragraphs: [
        "Un alcano solo tiene enlaces C—C simples. Un alqueno tiene al menos un C=C. Un alquino tiene al menos un C≡C. Los dos últimos son insaturados.",
        "Compara tres moléculas de dos carbonos para ver el patrón: etano es CH₃—CH₃, eteno es CH₂=CH₂ y etino es HC≡CH. Al subir el orden del enlace, bajan los hidrógenos.",
      ],
      formula: "C₂H₆   →   C₂H₄   →   C₂H₂",
      note: "Cada enlace adicional entre los mismos dos carbonos cuesta dos hidrógenos.",
    },
    {
      heading: "Otras arquitecturas que verás en bioquímica",
      paragraphs: [
        "Cíclico significa que la cadena se cierra sobre sí misma, como en la glucosa en disolución. Aromático describe anillos con electrones deslocalizados, como el benceno o el anillo del aminoácido fenilalanina.",
        "Heterocíclico significa que dentro del anillo hay un átomo que no es carbono — normalmente N, O o S. Las bases nitrogenadas del ADN son heterociclos, y por eso se llaman así.",
      ],
      note: "En el benceno los electrones π están deslocalizados por todo el anillo: los dobles enlaces no saltan de sitio, es una imagen del dibujo, no del comportamiento real.",
    },
  ],

  "t1-b5": [
    {
      heading: "El grupo funcional es el entorno completo",
      paragraphs: [
        "Un grupo funcional no es un átomo suelto: es una combinación característica de átomos y enlaces que aparece en muchas moléculas distintas y que decide cómo reacciona cada una.",
        "La regla que sostiene todo el tema es que el entorno importa. Un —OH unido a un carbono alifático es un alcohol y se comporta como tal. El mismo —OH unido a un anillo aromático es un fenol, y su química es otra. La pieza que colgamos parece la misma, pero el vecino cambia las propiedades.",
        "Por eso conviene mirar siempre el conjunto: qué átomo va con cuál, qué tipo de enlace los une y qué queda al otro lado. Con ese hábito, identificar un grupo funcional deja de ser memorizar y pasa a ser leer.",
      ],
      note: "Si tienes dudas, pregúntate primero qué átomos hay en el entorno inmediato y qué enlaces los conectan.",
    },
    {
      heading: "Alcoholes, fenoles y éteres: la familia del oxígeno con enlace simple",
      paragraphs: [
        "Los alcoholes tienen un —OH unido a un carbono alifático: R—OH. Metanol, etanol y glicerol son los ejemplos que reaparecerán, y la ramificación decide si el alcohol es primario, secundario o terciario.",
        "Los fenoles llevan ese mismo —OH sobre un carbono aromático: Ar—OH. Se distinguen de los alcoholes porque el anillo altera la acidez del hidrógeno, y por eso muchos compuestos bioactivos y fármacos son fenoles.",
        "Los éteres cambian el hidrógeno por otro carbono: R—O—R'. Son poco reactivos y aparecen en anestésicos y en algunos aromas naturales.",
      ],
      formula: "R—OH  ·  Ar—OH  ·  R—O—R'",
    },
    {
      heading: "Aldehídos y cetonas: el carbonilo cambia según dónde caiga",
      paragraphs: [
        "Los dos comparten el grupo C=O, el carbonilo, pero se diferencian por dónde queda dentro de la cadena.",
        "En un aldehído el carbonilo está en un extremo y lleva al menos un hidrógeno: R—CHO. En una cetona está entre dos carbonos: R—CO—R'. La reactividad de los aldehídos es notablemente mayor por ese H accesible, y ese matiz reaparecerá al hablar de azúcares reductores en el capítulo 2.",
      ],
      formula: "aldehído: R—CHO   ·   cetona: R—CO—R'",
      note: "Un truco de lectura: si el C=O está pegado al final de la fórmula (—CHO), es aldehído; si está encajado entre dos —C, es cetona.",
    },
    {
      heading: "Ácidos carboxílicos, ésteres y amidas: el carbonilo con vecino",
      paragraphs: [
        "El ácido carboxílico añade un —OH al carbonilo: R—COOH. Es el grupo de todos los ácidos grasos y de los aminoácidos, y es el responsable del carácter ácido de esos compuestos.",
        "Un éster nace al sustituir el —H del ácido por un —R': R—COO—R'. Se forma con pérdida de agua y aparece en aromas, en grasas —los triglicéridos son triésteres del glicerol— y en la propia acetilcolina.",
        "Una amida sustituye el —OH del ácido por un —NHR: R—CO—NHR'. Es el enlace peptídico que une aminoácidos en las proteínas.",
      ],
      formula: "R—COOH   ·   R—COO—R'   ·   R—CO—NH—R'",
    },
    {
      heading: "Aminas: el nitrógeno cambia el escenario",
      paragraphs: [
        "Un amina se define por un nitrógeno con enlaces simples a carbono e hidrógeno. Es primaria si tiene un solo carbono unido (R—NH₂), secundaria con dos, y terciaria con tres.",
        "El nitrógeno aporta un par de electrones libre, y por eso las aminas son básicas: en agua tienden a captar un protón y quedar cargadas. Esa carga condiciona su solubilidad y su comportamiento en el pH del organismo.",
        "El grupo amino aparece en los aminoácidos, en muchas hormonas y en la mayoría de fármacos que actúan sobre el sistema nervioso.",
      ],
      formula: "R—NH₂   ·   R—NHR'   ·   R—NR'R''",
      note: "No confundas amina con amida: la amina no tiene C=O al lado; la amida sí.",
    },
    {
      heading: "Cuatro parejas que se confunden todo el rato",
      paragraphs: [
        "Alcohol y fenol comparten el —OH. Lo que cambia es el vecino: alifático en el alcohol, aromático en el fenol.",
        "Aldehído y cetona comparten el carbonilo. Lo que cambia es la posición: en el extremo con un H en el aldehído, entre dos carbonos en la cetona.",
        "Éster y amida comparten estar formados a partir de un ácido carboxílico. Lo que cambia es qué reemplaza al —OH: un oxígeno unido a otro carbono en el éster, un nitrógeno en la amida.",
        "Amina y amida comparten el nitrógeno. Lo que cambia es el vecino: en la amina el N no está unido a un carbonilo, en la amida sí.",
      ],
      note: "Antes de nombrar, contesta a esas cuatro preguntas: casi todo lo que aparece en el curso encaja en una de las cuatro parejas.",
    },
    {
      heading: "Isomería: misma fórmula, distinta molécula",
      paragraphs: [
        "Dos compuestos son isómeros cuando comparten fórmula molecular pero difieren en la estructura o en la disposición espacial. Ni tienen las mismas propiedades ni son intercambiables.",
        "En este curso importan tres tipos. La isomería de cadena cambia la ramificación del esqueleto de carbonos. La de posición mueve el mismo grupo funcional por la cadena. La de función cambia el grupo entero, como pasa entre butanal y butanona, o entre glucosa y fructosa: misma fórmula, funciones químicas distintas.",
        "Añade la isomería cis-trans, que ya conoces del doble enlace, y la quiralidad, que aparecerá con los aminoácidos y los azúcares. Todas son razones distintas por las que la fórmula molecular sola no basta para identificar un compuesto.",
      ],
    },
  ],

  "t1-b6": [
    {
      heading: "Numerar es una comparación, no una costumbre",
      paragraphs: [
        "Una vez elegida la cadena principal hay que numerarla, y aquí casi todo el mundo comete el mismo error: empezar por la izquierda porque es como se lee. La numeración no se elige por comodidad, se gana comparando.",
        "El procedimiento es mecánico. Numera desde un extremo y anota dónde caen los sustituyentes. Numera desde el otro y anota lo mismo. Después compara las dos listas en el primer punto donde difieran: gana la que tenga el número más bajo en esa posición.",
        "Para una cadena de seis carbonos con dos metilos, una numeración da 2,4 y la otra da 3,5. En el primer punto de diferencia, 2 es menor que 3, así que el nombre correcto es 2,4-dimetilhexano.",
      ],
      note: "Si las dos numeraciones empatan en el primer sustituyente, se pasa al siguiente, y así hasta que una gane.",
    },
    {
      heading: "El orden alfabético y los prefijos de cantidad",
      paragraphs: [
        "Cuando los sustituyentes son distintos hay que decidir en qué orden se citan, y ahí manda el alfabeto: etil antes que metil, aunque el metil esté en un carbono anterior.",
        "Los prefijos di-, tri- y tetra- cuentan repeticiones, pero no participan en la ordenación alfabética. En 3-etil-2-metilhexano el etil va primero por la e, no por su posición.",
      ],
      formula: "3-etil-2-metilhexano   ·   comas entre números, guiones entre número y palabra",
      note: "La puntuación también se corrige en un examen: 2,4-dimetilhexano, nunca 2-4 dimetilhexano.",
    },
  ],

  "t1-b7": [
    {
      heading: "La familia más simple, y la que sostiene el resto",
      paragraphs: [
        "Un alcano acíclico solo tiene enlaces simples entre carbonos. Eso lo convierte en saturado: lleva el máximo número de hidrógenos que una cadena abierta puede sostener, y por eso responde a CₙH₂ₙ₊₂.",
        "Los dos hidrógenos de más respecto a CₙH₂ₙ salen de los extremos: cada carbono terminal usa una sola valencia para la cadena y le quedan tres libres.",
      ],
      formula: "CₙH₂ₙ₊₂   ·   octano: C₈H₁₈",
    },
    {
      heading: "Los prefijos que hay que automatizar",
      paragraphs: [
        "Met-, et-, prop-, but-, pent-, hex-, hept-, oct-, non- y dec- cubren de uno a diez carbonos, y conviene tenerlos tan automatizados como las tablas de multiplicar: aparecen en cada nombre del resto del curso.",
        "No es memorización estéril. Cuando llegues a los ácidos grasos verás cadenas de dieciséis y dieciocho carbonos, y el nombre te dirá la longitud sin tener que contar.",
        "Leer una fórmula condensada es contar paréntesis. En CH₃—(CH₂)₆—CH₃ hay un carbono al principio, seis dentro del paréntesis y uno al final: ocho en total, octano.",
      ],
      note: "El subíndice del paréntesis multiplica el grupo entero, no solo el último átomo.",
    },
  ],

  "t1-b8": [
    {
      heading: "Un doble enlace cuesta dos hidrógenos",
      paragraphs: [
        "Al introducir un C=C, los dos carbonos implicados gastan una valencia extra el uno con el otro, y esa valencia deja de estar disponible para un hidrógeno. Por eso un alqueno con un solo doble enlace responde a CₙH₂ₙ, dos hidrógenos por debajo del alcano equivalente.",
        "Si hay varios dobles enlaces se localizan todos y se usan las terminaciones -dieno, -trieno y siguientes, con un número por cada insaturación.",
      ],
      formula: "CₙH₂ₙ₊₂ → CₙH₂ₙ   ·   pent-2-eno: CH₃—CH=CH—CH₂—CH₃",
    },
    {
      heading: "Aislados, conjugados y acumulados",
      paragraphs: [
        "Cuando hay más de un doble enlace, importa cómo están colocados entre sí. Si se alternan con enlaces simples uno sí y uno no, están conjugados; si están separados por más carbonos, aislados; si comparten un carbono, acumulados.",
        "En nutrición esto tiene consecuencias concretas: la mayoría de los ácidos grasos poliinsaturados de la dieta son metileno-interrumpidos, es decir, con un CH₂ entre cada par de dobles enlaces, y no conjugados. El ácido linoleico conjugado es precisamente la excepción que se nombra aparte.",
      ],
      note: "Que un aceite sea poliinsaturado no significa que sus dobles enlaces estén conjugados.",
    },
    {
      heading: "El giro bloqueado y la geometría cis/trans",
      paragraphs: [
        "En un enlace simple los carbonos pueden girar libremente uno respecto al otro. En un doble enlace no: la rotación está restringida, y eso congela la posición de lo que cuelga a cada lado.",
        "Si los dos sustituyentes principales quedan del mismo lado, la configuración es cis y la cadena hace un codo. Si quedan en lados opuestos es trans, y la cadena sigue casi recta.",
        "Esa diferencia geométrica es exactamente la que separa una grasa cis de una grasa trans, y explica que unas sean líquidas a temperatura ambiente y otras se apilen como las saturadas. Lo verás desarrollado en el Tema 3.",
      ],
    },
  ],

  "t1-b9": [
    {
      heading: "Tres valencias comprometidas de golpe",
      paragraphs: [
        "Un triple enlace no es un doble reforzado: es un carbono gastando tres de sus cuatro valencias en un solo vecino. Le queda una, y solo una.",
        "De ahí se deduce todo lo demás sin memorizar nada. Un carbono terminal de alquino admite exactamente un hidrógeno, y por eso se escribe HC≡C— y nunca H₂C≡C—.",
        "También se deduce la fórmula general: cada insaturación cuesta dos hidrógenos, así que un alquino con un triple queda dos por debajo del alqueno y cuatro por debajo del alcano.",
      ],
      formula: "CₙH₂ₙ₊₂ → CₙH₂ₙ → CₙH₂ₙ₋₂",
      note: "El triple enlace es lineal: los dos carbonos y sus vecinos quedan alineados, y por eso los alquinos no tienen isomería cis/trans.",
    },
    {
      heading: "Cuando conviven varias insaturaciones",
      paragraphs: [
        "Con dos triples enlaces se usa la terminación -diino y con tres, -triino, siempre con un localizador por cada uno. Nona-2,5-diino son nueve carbonos con triples que arrancan en el segundo y en el quinto.",
        "Si en la misma cadena coexisten dobles y triples se nombran ambos y se numera buscando los localizadores más bajos para el conjunto, no para un tipo por separado.",
        "Es una extensión de lo que ya sabes y aparece en los ejercicios del libro, aunque en la práctica dietética te cruzarás mucho más con dobles enlaces —las grasas insaturadas— que con triples.",
      ],
    },
  ],

  "t1-b10": [
    {
      heading: "Cerrar el anillo también cuesta hidrógenos",
      paragraphs: [
        "Para unir los dos extremos de una cadena abierta, cada carbono terminal tiene que ceder un hidrógeno y usar esa valencia para enlazarse con el otro. Se gana un enlace C—C y se pierden dos C—H.",
        "El resultado es que un cicloalcano saturado responde a CₙH₂ₙ, la misma fórmula que un alqueno con el mismo número de carbonos. Y ahí está la trampa clásica.",
        "C₅H₁₀ puede ser ciclopentano o puede ser un penteno. La fórmula molecular sola no lo distingue: hace falta ver la estructura. Lo que ambos comparten es tener un grado de insaturación, que se puede gastar en un doble enlace o en cerrar un ciclo.",
      ],
      formula: "C₅H₁₀ = ciclopentano  ó  pent-1-eno",
      note: "Este es el motivo de que «grado de insaturación» sea más útil que «número de dobles enlaces».",
    },
    {
      heading: "Nombrar el anillo",
      paragraphs: [
        "El nombre se forma con el prefijo ciclo- seguido del alcano correspondiente: ciclopentano, ciclohexano.",
        "Si el anillo lleva sustituyentes, se numera para obtener el conjunto de localizadores más bajo, igual que en una cadena abierta. La diferencia es que en un anillo puedes empezar por cualquier carbono y girar en cualquier sentido, así que hay más numeraciones que comparar.",
      ],
    },
  ],

  "t1-b11": [
    {
      heading: "Qué significa realmente aromático",
      paragraphs: [
        "El benceno es C₆H₆: un anillo de seis carbonos que suele dibujarse con tres dobles enlaces alternos. Ese dibujo es una convención heredada y describe mal lo que ocurre.",
        "Los electrones π no están fijos en tres posiciones ni saltan de una a otra: están deslocalizados, repartidos de forma estable por los seis carbonos. Por eso todos los enlaces del anillo son equivalentes y miden lo mismo, cosa que no pasaría si hubiera simples y dobles alternándose.",
        "El círculo dentro del hexágono es la forma honesta de dibujarlo, y esa deslocalización es la que da al benceno su estabilidad característica.",
      ],
      note: "«Aromático» describe esa estructura electrónica, no que el compuesto huela a algo. El nombre viene de la historia de la química, no de la nariz.",
    },
    {
      heading: "Dónde te lo vas a encontrar",
      paragraphs: [
        "El anillo bencénico aparece por todas partes en bioquímica y en nutrición. Con un —OH unido directamente al anillo tienes un fenol, que no se comporta como un alcohol corriente.",
        "También lo llevan aminoácidos como la fenilalanina y la tirosina, muchos compuestos bioactivos de los alimentos y buena parte de los fármacos.",
        "Para Dietética el objetivo no es dominar los mecanismos de reacción aromáticos, sino reconocer el anillo cuando aparezca y saber qué grupos lleva colgando.",
      ],
    },
  ],

  "t1-b12": [
    {
      heading: "Un anillo con un intruso dentro",
      paragraphs: [
        "Un heterociclo es un anillo que incorpora uno o más átomos distintos del carbono —nitrógeno, oxígeno o azufre— formando parte del propio ciclo, no colgando de él.",
        "Esa diferencia basta para que deje de ser un hidrocarburo, porque un hidrocarburo contiene exclusivamente carbono e hidrógeno. Es un compuesto orgánico cíclico, pero no un hidrocarburo.",
      ],
      note: "El heteroátomo tiene que estar en el anillo. Un ciclohexano con un —OH colgando sigue siendo un derivado de hidrocarburo, no un heterociclo.",
    },
    {
      heading: "Los tres que conviene reconocer ya",
      paragraphs: [
        "Pirrol, pirimidina y purina son los esqueletos que más vas a reencontrar. El pirrol aparece en las porfirinas, y de ahí en el grupo hemo de la hemoglobina.",
        "La pirimidina es la base estructural de citosina, timina y uracilo; la purina, la de adenina y guanina. Cuando llegues al Tema 5 y hables de bases nitrogenadas, estarás hablando de estos dos anillos.",
        "En esta fase basta con localizar el heteroátomo y relacionar el anillo con la biomolécula donde aparece. La nomenclatura sistemática detallada de heterociclos no es prioritaria en la FP de Dietética, y aprenderla ahora restaría tiempo a lo que sí cae.",
      ],
    },
  ],

  "t1-b13": [
    {
      heading: "Formular no termina al escribir",
      paragraphs: [
        "Es tentador dar por buena una estructura en cuanto se parece a lo que pedía el enunciado. Ese es el momento exacto en que conviene desconfiar: una formulación no está terminada hasta que se ha auditado.",
        "La auditoría es mecánica y rápida. Recorre cada carbono y suma los órdenes de sus enlaces: un simple vale 1, un doble vale 2 y un triple vale 3. El total tiene que ser cuatro en todos y cada uno.",
        "Después haz lo mismo con el resto: el hidrógeno forma un enlace, el oxígeno habitualmente dos y el nitrógeno habitualmente tres en el nivel de este curso.",
      ],
      formula: "CH₃=CH₃  ✕  cada C sumaría 3 + 2 = 5      CH₂=CH₂  ✓  cada C suma 2 + 2 = 4",
    },
    {
      heading: "El segundo control: contar átomos",
      paragraphs: [
        "Cuando la tetravalencia cuadra, cuenta todos los átomos y escribe la fórmula molecular. Esta segunda pasada detecta lo que la primera deja escapar: cadenas con un carbono de más, hidrógenos olvidados en un extremo o ramas contadas dos veces.",
        "Las dos comprobaciones juntas atrapan casi cualquier error de formulación, incluidos los que producen un nombre de aspecto perfectamente razonable.",
      ],
      note: "Si un carbono te sale con cinco enlaces, no busques la excepción: busca el error.",
    },
  ],

  "t2-b1": [
    {
      heading: "Qué es realmente un carbohidrato",
      paragraphs: [
        "Un carbohidrato es un polihidroxialdehído, una polihidroxicetona, o un compuesto que produce uno de esos dos al hidrolizarse. Suena denso, pero se descompone en dos partes: «polihidroxi» significa que tiene muchos grupos —OH, y «aldehído o cetona» dice cuál es su grupo carbonilo.",
        "Es decir: es una molécula con un carbonilo y un montón de alcoholes colgando. Con lo que aprendiste en el Tema 1 ya puedes reconocer uno a la vista.",
      ],
    },
    {
      heading: "El nombre viene de un error histórico",
      paragraphs: [
        "«Hidrato de carbono» se acuñó cuando se observó que muchos de estos compuestos respondían a la proporción (CH₂O)ₙ, como si fueran carbono con agua añadida. La imagen es falsa: no hay moléculas de agua dentro, y muchos carbohidratos reales no cumplen esa proporción.",
        "Glúcido, carbohidrato e hidrato de carbono se usan hoy como sinónimos para el grupo. Ninguno describe bien la química, pero son los nombres establecidos.",
      ],
      note: "La fórmula (CH₂O)ₙ es una orientación histórica, no una definición. No la uses para decidir si algo es un carbohidrato.",
    },
    {
      heading: "Clasificar en dos decisiones",
      paragraphs: [
        "Para nombrar un monosacárido solo necesitas responder dos preguntas, en este orden. Primera: ¿cuántos carbonos tiene? Tres es triosa, cinco es pentosa, seis es hexosa. Segunda: ¿su carbonilo es un aldehído o una cetona? Aldosa o cetosa.",
        "Aplícalo a la glucosa: tiene seis carbonos, luego hexosa; su carbonilo está en un extremo, luego aldehído. Glucosa = aldohexosa. Y ya está — no hay que memorizarlo, se deduce.",
      ],
      note: "Funciones: energía inmediata, reserva, estructura y reconocimiento celular. No todos los glúcidos son combustible.",
    },
  ],

  "t2-b2": [
    {
      heading: "Tres hexosas con la misma fórmula",
      paragraphs: [
        "Glucosa, galactosa y fructosa comparten exactamente la misma fórmula molecular: C₆H₁₂O₆. Y sin embargo saben distinto, se absorben por vías distintas y se metabolizan distinto.",
        "Eso es posible porque son isómeros. Tienen los mismos átomos y distinta estructura, y ya viste en el Tema 1 que la estructura es la que manda.",
      ],
    },
    {
      heading: "Dónde está exactamente la diferencia",
      paragraphs: [
        "La fructosa es una cetohexosa: su carbonilo es una cetona, dentro de la cadena. Glucosa y galactosa son aldohexosas: su carbonilo es un aldehído, en el extremo. Entre glucosa y fructosa, por tanto, hay isomería de función.",
        "Glucosa y galactosa, en cambio, son las dos aldohexosas. Su diferencia es más fina: la orientación de un —OH en un único carbono. Basta eso para que hagan falta enzimas distintas para procesarlas.",
      ],
      note: "Una diferencia mínima en el espacio puede hacer que una enzima reconozca una molécula y no la otra. Es el principio de toda la especificidad enzimática.",
    },
    {
      heading: "Las pentosas de los ácidos nucleicos",
      paragraphs: [
        "Ribosa y desoxirribosa son pentosas, y las verás otra vez en el Tema 5. La ribosa está en el ARN; la desoxirribosa, en el ADN.",
        "El prefijo «desoxi-» dice literalmente lo que ocurre: le falta un oxígeno respecto a la ribosa. Un átomo de diferencia entre la molécula que guarda tu información genética y la que la transporta.",
      ],
    },
  ],

  "t2-b3": [
    {
      heading: "En agua, las cadenas se cierran",
      paragraphs: [
        "Las fórmulas lineales que has visto hasta ahora son útiles para clasificar, pero no son la forma en que estos azúcares existen realmente. En disolución acuosa, pentosas y hexosas están mayoritariamente en forma cíclica.",
        "El cierre ocurre porque la molécula es lo bastante flexible como para que uno de sus propios grupos —OH alcance al carbono del carbonilo y reaccione con él. El anillo se forma solo, sin ayuda externa.",
      ],
    },
    {
      heading: "El carbono anomérico",
      paragraphs: [
        "Al cerrarse el anillo, el carbono que era el carbonilo se convierte en algo nuevo: el carbono anomérico. Es el único carbono del anillo unido a dos oxígenos, y eso lo hace especial — es el punto por donde el azúcar se unirá a otros.",
        "Ese carbono puede quedar con su nuevo —OH orientado hacia un lado o hacia el otro. Esas dos versiones se llaman anómeros α y β, y se interconvierten espontáneamente en disolución.",
      ],
      note: "Localizar el carbono anomérico es el gesto clave del tema: es el que después formará el enlace glucosídico.",
    },
    {
      heading: "α/β no es lo mismo que D/L",
      paragraphs: [
        "Aquí se produce una confusión muy común que conviene cortar de raíz. Son dos etiquetas que describen cosas diferentes de la misma molécula.",
        "D y L describen la configuración general del azúcar, se decide en la forma lineal y no cambia: la glucosa natural es D-glucosa y punto. α y β describen solo la orientación del —OH del carbono anomérico, aparecen al ciclarse y sí pueden cambiar.",
        "Por eso existe α-D-glucosa y β-D-glucosa: las dos son D, y se diferencian únicamente en el anómero.",
      ],
    },
  ],

  "t2-b4": [
    {
      heading: "Cómo se unen dos azúcares",
      paragraphs: [
        "Dos monosacáridos se unen mediante un enlace O-glucosídico, que se forma por condensación: se pierde una molécula de agua y queda un puente de oxígeno entre los dos anillos.",
        "El proceso inverso es la hidrólisis, que rompe ese enlace añadiendo agua. Toda la digestión de los hidratos de carbono es exactamente eso, repetido muchas veces.",
      ],
    },
    {
      heading: "Los tres disacáridos que hay que saber",
      paragraphs: [
        "Maltosa es glucosa + glucosa. Lactosa es galactosa + glucosa. Sacarosa es glucosa + fructosa. Con esos tres cubres prácticamente toda la nutrición humana.",
      ],
      formula: "maltosa = Glc + Glc\nlactosa = Gal + Glc\nsacarosa = Glc + Fru",
    },
    {
      heading: "La enzima reconoce el enlace, no los azúcares",
      paragraphs: [
        "Este es el punto que de verdad importa para Dietética, y es contraintuitivo. Una enzima digestiva no busca «glucosa»: busca una arquitectura de enlace concreta.",
        "Por eso no basta con decir que la lactosa contiene glucosa. Contiene además galactosa, y sobre todo las une un enlace β(1→4) específico. La lactasa está hecha para reconocer y romper ese enlace concreto, y si falta, la lactosa sigue entera aunque la persona tenga todas las demás enzimas intactas.",
        "Esta idea es la que explicará después por qué la celulosa no se digiere pese a estar hecha solo de glucosa.",
      ],
    },
  ],

  "t2-b5": [
    {
      heading: "Muchos monómeros, dos destinos distintos",
      paragraphs: [
        "Un polisacárido es una cadena larga de monosacáridos unidos por enlaces glucosídicos. Los tres que importan aquí —almidón, glucógeno y celulosa— están hechos exclusivamente de glucosa.",
        "Y aun así, dos son alimento y uno es fibra. La diferencia no está en el ladrillo, está en cómo se colocan.",
      ],
    },
    {
      heading: "Almidón y glucógeno: reserva con enlaces α",
      paragraphs: [
        "El almidón es la reserva de las plantas y el glucógeno la de los animales. Los dos usan enlaces α(1→4) para la cadena principal y α(1→6) en los puntos de ramificación.",
        "El glucógeno está mucho más ramificado que el almidón, y eso tiene una lógica: cada rama termina en un extremo libre, y las enzimas trabajan por los extremos. Más ramas significa más puntos por donde movilizar glucosa deprisa cuando hace falta.",
      ],
      note: "Ramificar no es un capricho estructural: es una forma de aumentar la velocidad a la que puedes sacar o meter glucosa.",
    },
    {
      heading: "Celulosa: los mismos ladrillos, enlace β",
      paragraphs: [
        "La celulosa también es un polímero de glucosa, pero sus unidades se unen por enlaces β(1→4). Ese giro hace que las cadenas queden rectas y se empaqueten entre sí formando fibras muy resistentes.",
        "La amilasa humana está diseñada para hidrolizar enlaces α(1→4). No reconoce los β(1→4), así que la celulosa le pasa por delante sin que pueda hacer nada. No es cuestión de cantidad de enzima: es que no encaja.",
        "Resultado: el almidón te aporta glucosa y la celulosa te aporta fibra, siendo ambos cadenas de la misma molécula.",
      ],
    },
  ],

  "t2-b6": [
    {
      heading: "Qué cuenta como fibra",
      paragraphs: [
        "La fibra alimentaria reúne los carbohidratos que no se digieren en el intestino delgado, junto con otros componentes asociados como la lignina. Es una categoría definida por lo que el cuerpo no hace con ellos, no por una estructura química común.",
        "Eso explica que dentro de «fibra» quepan moléculas muy distintas, y que sus efectos también lo sean.",
      ],
    },
    {
      heading: "Soluble e insoluble no hacen lo mismo",
      paragraphs: [
        "La fibra soluble se dispersa en agua, puede formar geles viscosos y la microbiota del colon la fermenta con facilidad. La insoluble no forma geles y se fermenta poco: su efecto principal es aportar volumen al contenido intestinal y favorecer el tránsito.",
        "Compara avena y salvado de trigo. Los beta-glucanos de la avena son solubles: aumentan la viscosidad del contenido intestinal y son muy fermentables. El salvado de trigo aporta sobre todo fracción insoluble. Las dos son fibra y las dos son recomendables, pero por motivos fisiológicos distintos.",
      ],
      note: "Decir «fibra = tránsito» es quedarse con la mitad. La viscosidad y la fermentación explican efectos sobre glucemia, saciedad y microbiota que el tránsito no explica.",
    },
    {
      heading: "Cómo razonarlo en consulta",
      paragraphs: [
        "Cuando valores una fuente de fibra, pregúntate tres cosas: ¿es soluble o insoluble?, ¿forma gel?, ¿es fermentable? Las respuestas predicen el efecto mejor que la cifra de gramos totales de la etiqueta.",
        "Un producto puede declarar mucha fibra y tener un efecto fisiológico distinto del que la persona necesita. La estructura sigue mandando, igual que en todo el resto del tema.",
      ],
    },
  ],

  // ───────────────────────── TEMA 3 · Lípidos ─────────────────────────
  "t3-b1": [
    {
      heading: "Una familia definida por una propiedad, no por una estructura",
      paragraphs: [
        "Los lípidos son el grupo raro de las biomoléculas. Los glúcidos comparten un patrón químico, las proteínas comparten el enlace peptídico, pero los lípidos no comparten ningún grupo funcional común.",
        "Lo que los agrupa es una propiedad física: son poco solubles en agua. Es una definición por comportamiento, y por eso dentro caben moléculas que no se parecen entre sí.",
      ],
    },
    {
      heading: "Qué hay dentro del cajón",
      paragraphs: [
        "Triglicéridos, fosfolípidos, esteroles como el colesterol, y esfingolípidos. Almacenan energía, forman membranas, transportan vitaminas liposolubles y actúan como señales.",
        "Conviene no usar «grasa» y «lípido» como sinónimos en Dietética: la grasa alimentaria es sobre todo triglicéridos, pero los lípidos del cuerpo hacen muchas más cosas que almacenar energía.",
      ],
    },
    {
      heading: "Por qué unos forman gotas y otros membranas",
      paragraphs: [
        "Un triglicérido es prácticamente todo hidrófobo, así que en agua las moléculas se juntan entre sí y se separan del medio: se forma una gota de aceite.",
        "Un fosfolípido, en cambio, tiene una cabeza polar que se lleva bien con el agua y dos colas hidrófobas que no. Esa doble naturaleza se llama anfipatía, y obliga a la molécula a buscar una posición de compromiso: cabezas hacia fuera, colas escondidas hacia dentro. Eso es una bicapa.",
        "La membrana no se forma porque alguien la ordene: se forma sola, como la única solución estable para una molécula con dos caras.",
      ],
      note: "Anfipático es una de esas palabras que explican media asignatura. Sales biliares, fosfolípidos y lipoproteínas funcionan todos por lo mismo.",
    },
  ],

  "t3-b2": [
    {
      heading: "Anatomía de un ácido graso",
      paragraphs: [
        "Un ácido graso es una cadena hidrocarbonada larga con un grupo carboxilo (—COOH) en un extremo. Ese extremo es el ácido; el resto es una cola apolar.",
        "El otro extremo, el que no tiene el carboxilo, se llama extremo metilo u omega. Vas a necesitar los dos nombres, porque la notación nutricional cuenta desde uno y la química desde el otro.",
      ],
    },
    {
      heading: "Cómo se lee la notación",
      paragraphs: [
        "La notación tiene tres datos y conviene separarlos bien. El número antes de los dos puntos son los carbonos totales. El número después son los dobles enlaces. Y el «n-» final indica a qué distancia del extremo metilo está el primer doble enlace.",
        "Traduce el ácido oleico, 18:1 n-9: dieciocho carbonos, un doble enlace, y ese doble enlace empieza a nueve carbonos del extremo metilo. Es decir, un ácido graso monoinsaturado de la serie omega-9.",
      ],
      formula: "18:1 n-9   →   18 C · 1 doble enlace · omega-9",
      note: "Número de dobles enlaces y posición omega son datos independientes. Un 18:3 n-3 tiene tres dobles enlaces, y el n-3 solo localiza el primero.",
    },
    {
      heading: "Saturación y forma de la cadena",
      paragraphs: [
        "Saturado significa sin dobles enlaces C=C; monoinsaturado, uno; poliinsaturado, dos o más. Y esto tiene una consecuencia física directa.",
        "En las grasas naturales los dobles enlaces son mayoritariamente cis, y un doble enlace cis introduce un codo en la cadena. Las cadenas dobladas no se apilan bien entre sí, así que la grasa es líquida a temperatura ambiente. Las saturadas, rectas, se apilan bien y son sólidas.",
        "Por eso el aceite de oliva es líquido y la mantequilla no. Es geometría, no química exótica.",
      ],
      note: "Esenciales en humanos: linoleico (18:2 n-6) y α-linolénico (18:3 n-3). El araquidónico puede ser condicionalmente esencial.",
    },
  ],

  "t3-b3": [
    {
      heading: "Glicerol más tres ácidos grasos",
      paragraphs: [
        "Un triacilglicérido —o triglicérido— es lo que se forma cuando una molécula de glicerol se une a tres ácidos grasos. El glicerol es un alcohol de tres carbonos con un —OH en cada uno, y esos tres —OH son los puntos de anclaje.",
        "Cada —OH del glicerol reacciona con el —COOH de un ácido graso. Ya conoces esa reacción del Tema 1: alcohol más ácido da éster, liberando agua.",
      ],
      formula: "glicerol + 3 ácidos grasos → triacilglicérido + 3 H₂O",
    },
    {
      heading: "Tres enlaces éster, y la hidrólisis los deshace",
      paragraphs: [
        "El resultado tiene exactamente tres enlaces éster, uno por cada posición del glicerol. Es un dato que cae en examen y que además vas a necesitar en el Tema 9, cuando la lipasa venga a romperlos.",
        "La reacción inversa, la hidrólisis, rompe esos enlaces con agua y libera de nuevo glicerol y ácidos grasos. Es lo que ocurre tanto en la digestión como en la lipólisis del tejido adiposo.",
      ],
    },
    {
      heading: "Por qué la mezcla importa",
      paragraphs: [
        "Los tres ácidos grasos de un triglicérido no tienen por qué ser iguales, y de hecho casi nunca lo son. La mezcla concreta determina el punto de fusión y el comportamiento físico de la grasa.",
        "Una grasa rica en cadenas saturadas y largas será sólida; una con muchas insaturaciones cis será líquida. La composición no es un detalle analítico: es lo que hace que un alimento sea manteca o aceite.",
      ],
    },
  ],

  "t3-b4": [
    {
      heading: "Fosfolípidos: la molécula de las membranas",
      paragraphs: [
        "Un glicerofosfolípido se parece a un triglicérido al que le hubieran cambiado una pieza. Tiene glicerol y dos ácidos grasos, pero en la tercera posición, en lugar de un ácido graso, lleva un grupo fosfato con una cabeza polar unida.",
        "Ese cambio lo convierte en anfipático, y con ello en el material de construcción de todas las membranas celulares.",
      ],
    },
    {
      heading: "Colesterol: mala fama, muchas funciones",
      paragraphs: [
        "El colesterol es un esterol: cuatro anillos fusionados, nada que ver estructuralmente con un ácido graso. Se intercala entre las colas de los fosfolípidos y modula la fluidez de la membrana — la estabiliza, ni la endurece ni la disuelve.",
        "Además es el precursor de los ácidos biliares que emulsionan la grasa, de las hormonas esteroideas y de la vitamina D. Es decir, el cuerpo lo necesita, lo fabrica, y no es un contaminante que haya que eliminar.",
      ],
      note: "El colesterol de la dieta y la colesterolemia son cosas relacionadas pero no equivalentes. El hígado sintetiza colesterol y ajusta su producción.",
    },
    {
      heading: "Esfingolípidos y glucolípidos",
      paragraphs: [
        "Los esfingolípidos se construyen sobre esfingosina en lugar de glicerol, y son especialmente abundantes en el tejido nervioso, donde forman parte de las vainas de mielina.",
        "Los glucolípidos llevan azúcares en su cabeza y quedan expuestos en la cara externa de la membrana, participando en el reconocimiento celular. Es el mismo principio que viste en el Tema 2: los azúcares también sirven para identificar.",
      ],
    },
  ],

  "t3-b5": [
    {
      heading: "El problema: transportar grasa por un medio acuoso",
      paragraphs: [
        "La sangre es agua, y los lípidos no se disuelven en agua. El cuerpo tiene entonces un problema logístico: cómo llevar triglicéridos y colesterol desde el intestino o el hígado hasta los tejidos.",
        "La solución son las lipoproteínas: partículas con un núcleo hidrófobo donde va la carga lipídica, y una superficie compatible con el agua hecha de fosfolípidos, colesterol libre y proteínas. Un contenedor anfipático.",
      ],
    },
    {
      heading: "Quién lleva qué",
      paragraphs: [
        "Los quilomicrones transportan sobre todo los triglicéridos que vienen de la dieta. Las VLDL exportan los triglicéridos que fabrica el hígado. Las LDL distribuyen colesterol a los tejidos. Las HDL participan en el transporte de retorno del colesterol hacia el hígado, entre otras funciones.",
        "Fíjate en que la diferencia entre quilomicrón y VLDL no es lo que llevan —los dos llevan triglicéridos— sino de dónde vienen.",
      ],
      note: "LDL y HDL son partículas transportadoras, no dos tipos de colesterol. El colesterol que llevan dentro es la misma molécula.",
    },
    {
      heading: "El recorrido después de una comida grasa",
      paragraphs: [
        "Sigue un triglicérido de la dieta: se digiere, sus productos entran en el enterocito y allí se vuelven a ensamblar. Ese triglicérido reesterificado se empaqueta en un quilomicrón, que sale a la linfa y de ahí pasa a la sangre.",
        "Al llegar a los capilares del músculo o del tejido adiposo, la lipoproteína lipasa (LPL) hidroliza los triglicéridos del quilomicrón y libera ácidos grasos que el tejido capta.",
        "La LPL rompe triglicéridos. No separa la proteína de la grasa ni deshace la partícula entera: vacía su carga.",
      ],
    },
  ],

  "t3-b6": [
    {
      heading: "La pregunta que falta casi siempre",
      paragraphs: [
        "Cuando alguien dice «voy a comer menos grasa saturada», la frase está incompleta. Falta el otro lado de la ecuación: ¿y qué come en su lugar?",
        "Reducir un nutriente obliga a aumentar otro, porque la energía tiene que salir de alguna parte. Sustituir grasa saturada por aceite de oliva no es lo mismo que sustituirla por cereales refinados o por azúcar, aunque en las tres la cifra de saturadas baje igual.",
      ],
      note: "En nutrición, el efecto de un cambio depende del sustituto. Por eso los estudios se diseñan como sustituciones y no como reducciones a secas.",
    },
    {
      heading: "Qué se sostiene con la evidencia actual",
      paragraphs: [
        "Los ácidos grasos trans de origen industrial conviene minimizarlos: es de las recomendaciones más firmes que hay en nutrición de lípidos.",
        "Los mono y poliinsaturados suelen ocupar un lugar favorable cuando sustituyen parte de los saturados. Y el patrón alimentario completo predice mejor que cualquier nutriente aislado.",
      ],
    },
    {
      heading: "Estabilidad y cocinado",
      paragraphs: [
        "Cuanto más insaturado es un aceite, más fácilmente se oxida: los dobles enlaces son los puntos vulnerables. Luz, calor, oxígeno y tiempo aceleran el proceso y producen el enranciamiento.",
        "Por eso la elección de un aceite para freír no depende solo de su perfil de ácidos grasos sobre el papel, sino de cómo se comporta al calentarlo. Composición y uso culinario son dos criterios distintos y hay que valorar los dos.",
      ],
    },
  ],

  // ───────────────────────── TEMA 5 · Ácidos nucleicos ─────────────────────────
  "t5-b1": [
    {
      heading: "Tres piezas que encajan siempre igual",
      paragraphs: [
        "Un nucleótido se monta con tres componentes: una base nitrogenada, una pentosa y uno o más grupos fosfato. Siempre los tres, y siempre en la misma disposición.",
        "La base se une al carbono 1′ del azúcar y el fosfato al carbono 5′. Esa geometría fija es la que permite que los nucleótidos se encadenen en una dirección definida.",
      ],
    },
    {
      heading: "Nucleósido y nucleótido no son sinónimos",
      paragraphs: [
        "Si solo tienes base más azúcar, eso es un nucleósido. En cuanto añades al menos un fosfato, pasa a ser un nucleótido. Esa es toda la diferencia, y cae en examen con frecuencia.",
        "Las bases se agrupan en dos familias: las purinas, con doble anillo, son adenina y guanina; las pirimidinas, con un solo anillo, son citosina, timina y uracilo.",
      ],
      formula: "base + azúcar = nucleósido\nbase + azúcar + fosfato = nucleótido",
    },
    {
      heading: "El ATP también es un nucleótido",
      paragraphs: [
        "Esto sorprende, pero encaja perfectamente con la definición. Desmonta el ATP: su base es adenina, su azúcar es ribosa y lleva tres grupos fosfato. Adenosina trifosfato.",
        "Es decir, la molécula que usas para hablar de energía pertenece exactamente a la misma familia química que los ladrillos del ADN. Compartir estructura no significa compartir función, y esta es una de las conexiones más útiles del curso.",
      ],
      note: "Adenosina es el nucleósido; añadiendo fosfatos aparecen AMP, ADP y ATP.",
    },
  ],

  "t5-b2": [
    {
      heading: "Dos diferencias entre ADN y ARN",
      paragraphs: [
        "La primera está en el azúcar: el ADN lleva desoxirribosa y el ARN lleva ribosa. El prefijo «desoxi-» indica que le falta un oxígeno, y esa ausencia hace al ADN químicamente más estable — conveniente para algo que debe durar toda la vida de la célula.",
        "La segunda está en una base: donde el ADN usa timina, el ARN usa uracilo. Las otras tres —adenina, guanina y citosina— son comunes a ambos.",
      ],
    },
    {
      heading: "El emparejamiento es lo que permite copiar",
      paragraphs: [
        "En el ADN, la adenina siempre empareja con timina y la guanina con citosina. En una copia de ARN, la adenina del molde empareja con uracilo.",
        "Las dos hebras corren en sentidos opuestos: son antiparalelas. Por eso, al completar una hebra, no basta con escribir las bases complementarias — hay que indicar también que los extremos 5′ y 3′ quedan invertidos.",
        "Completa 5′-AGCT-3′: A con T, G con C, C con G, T con A. El resultado es 3′-TCGA-5′.",
      ],
      note: "El ADN no está solo en el núcleo: las mitocondrias tienen su propio ADN, y de ahí que la herencia mitocondrial siga reglas distintas.",
    },
  ],

  "t5-b3": [
    {
      heading: "Tres procesos, tres verbos distintos",
      paragraphs: [
        "La replicación fabrica ADN a partir de ADN: es copiar para repartir a las células hijas. La transcripción fabrica ARN usando ADN como molde: es pasar un fragmento a un formato portátil. La traducción fabrica un polipéptido a partir del ARN mensajero: es cambiar de idioma, de bases a aminoácidos.",
        "Confundirlos es el error más común del tema, y se evita fijándose en qué entra y qué sale de cada uno.",
      ],
      formula: "ADN → ADN (replicación)\nADN → ARN (transcripción)\nARN → proteína (traducción)",
    },
    {
      heading: "Cada ARN tiene un oficio",
      paragraphs: [
        "El ARN mensajero lleva la secuencia copiada desde el gen. El ARN de transferencia aporta los aminoácidos, cada uno con el suyo. Y el ARN ribosómico forma parte estructural y funcional del ribosoma, donde se ensambla todo.",
        "La lectura avanza en grupos de tres nucleótidos llamados codones. Tres bases equivalen a un aminoácido.",
      ],
    },
    {
      heading: "La información cambia de soporte, no de materia",
      paragraphs: [
        "Un matiz que conviene tener claro: el ADN no se convierte físicamente en proteína. Nada del ADN acaba dentro de la proteína.",
        "Lo que viaja es la información, copiada de un soporte a otro, igual que un texto puede pasar de un libro a una pantalla sin que el papel se transforme en píxeles.",
      ],
    },
  ],

  "t5-b4": [
    {
      heading: "Cómo funciona el código",
      paragraphs: [
        "Un codón son tres bases consecutivas del ARN mensajero, y especifica un aminoácido concreto o una señal de parada. Con cuatro bases posibles en tres posiciones salen 64 combinaciones para 20 aminoácidos.",
        "Sobran combinaciones, y por eso el código es degenerado: varios codones distintos pueden codificar el mismo aminoácido. No es un fallo de diseño — da margen de tolerancia frente a mutaciones.",
      ],
    },
    {
      heading: "Codón y anticodón están en moléculas distintas",
      paragraphs: [
        "El codón está en el ARN mensajero. El anticodón está en el ARN de transferencia, y lo reconoce por complementariedad de bases. Intercambiar los dos términos es un error clásico.",
        "Para traducir un codón necesitas una tabla del código genético; no se deduce. AUG codifica metionina y además suele funcionar como señal de inicio de la traducción.",
      ],
      note: "Las tablas de codones se leen siempre en ARNm, no en ADN. Si partes del ADN, transcribe primero.",
    },
  ],

  "t5-b5": [
    {
      heading: "Nucleótidos que no guardan información",
      paragraphs: [
        "No todos los nucleótidos forman parte del material genético. Muchos trabajan a diario en el metabolismo, y reconocerlos aquí te ahorrará trabajo en los temas 8 a 12.",
        "El ATP transfiere energía y grupos fosfato. El GTP participa en la síntesis proteica y en señalización. El NAD⁺ y el FAD transportan electrones. La coenzima A transporta grupos acilo.",
      ],
    },
    {
      heading: "Qué significa que NAD⁺ se reduzca",
      paragraphs: [
        "El NAD⁺ acepta electrones junto con el equivalente de un protón y se convierte en NADH. Más adelante puede ceder esos electrones a otra molécula y volver a NAD⁺.",
        "Es un transportador reutilizable, no un consumible: la célula tiene una cantidad limitada y la recicla continuamente entre su forma oxidada y su forma reducida.",
      ],
      formula: "NAD⁺ (oxidado)  ⇄  NADH (reducido)",
      note: "Varias de estas coenzimas derivan de vitaminas del grupo B. Es la conexión directa entre el Tema 7 y todo el bloque de metabolismo.",
    },
  ],

  // ───────────────────────── TEMA 6 · Agua y sales minerales ─────────────────────────
  "t6-b1": [
    {
      heading: "El agua del cuerpo está repartida, no suelta",
      paragraphs: [
        "El agua corporal se distribuye en dos grandes compartimentos separados por membranas. El líquido intracelular es el que está dentro de las células; el extracelular, fuera.",
        "El extracelular se subdivide a su vez en el líquido intersticial, que baña las células, y el plasma, que circula dentro de los vasos.",
      ],
      formula: "plasma + intersticio = extracelular\ncitosol = intracelular",
    },
    {
      heading: "Compartimento significa composición, no depósito",
      paragraphs: [
        "Un error frecuente es imaginar los compartimentos como bidones separados con agua distinta dentro. No es así: el agua se mueve constantemente entre ellos.",
        "Lo que distingue a un compartimento no es el agua sino su composición iónica. El sodio predomina fuera de las células y el potasio dentro, y esa diferencia es la que las membranas mantienen activamente.",
        "Las proporciones varían con la edad, el sexo, la composición corporal y el estado clínico. No hay una cifra única válida para todo el mundo.",
      ],
    },
  ],

  "t6-b2": [
    {
      heading: "Hacia dónde se mueve el agua",
      paragraphs: [
        "La ósmosis tiene una regla que resuelve casi todos los ejercicios: el agua se desplaza hacia el lado donde hay mayor concentración efectiva de partículas que no pueden atravesar la membrana.",
        "«Efectiva» es la palabra clave. Solo cuentan los solutos que quedan retenidos: los que cruzan libremente no generan gradiente osmótico porque se equilibran solos.",
      ],
    },
    {
      heading: "Los tres escenarios",
      paragraphs: [
        "Si el medio externo está más concentrado —hipertónico— el agua sale de la célula y esta se encoge. Si está más diluido —hipotónico— el agua entra y la célula se hincha. Si están igualados —isotónico— no hay flujo neto.",
        "Para predecirlo no memorices los tres casos: pregúntate simplemente dónde hay más solutos efectivos, y el agua irá hacia allí.",
      ],
    },
    {
      heading: "Balance hídrico y regulación",
      paragraphs: [
        "El balance hídrico compara lo que entra —bebida, alimentos, agua metabólica— con lo que sale por orina, heces, sudor y respiración. Es un balance a lo largo del día, no una operación instantánea.",
        "Lo regulan el riñón, la sensación de sed y hormonas como la ADH y la aldosterona, ajustando sobre todo la excreción renal.",
      ],
      note: "Las necesidades de agua son individuales. Las cifras fijas de los libros son ejemplos orientativos, no prescripciones universales.",
    },
  ],

  "t6-b3": [
    {
      heading: "Quién está dentro y quién fuera",
      paragraphs: [
        "El sodio es el catión predominante en el líquido extracelular. El potasio lo es en el intracelular. El cloruro es el principal anión extracelular.",
        "Esa separación no es casual ni gratuita: mantenerla cuesta energía, y es la base del funcionamiento nervioso y muscular.",
      ],
    },
    {
      heading: "La bomba que sostiene el gradiente",
      paragraphs: [
        "La Na⁺/K⁺-ATPasa gasta ATP para sacar 3 Na⁺ de la célula e introducir 2 K⁺ en cada ciclo. Trabaja continuamente y consume una fracción notable del gasto energético basal.",
        "El resultado es un gradiente: mucho sodio fuera, poco dentro. Y un gradiente es energía almacenada, disponible para hacer trabajo.",
      ],
      formula: "3 Na⁺ fuera  ·  2 K⁺ dentro  ·  1 ATP",
    },
    {
      heading: "Transporte secundario: aprovechar la cuesta",
      paragraphs: [
        "El enterocito usa ese gradiente para absorber glucosa. Como dentro hay poco sodio, el sodio entra espontáneamente a favor de gradiente, y un cotransportador aprovecha ese flujo para arrastrar glucosa con él, incluso en contra de su propio gradiente.",
        "Fíjate en lo que ocurre: el ATP no se gasta en el transporte de glucosa, se gastó antes en la bomba. La energía se almacenó en forma de gradiente y se usa después. Es transporte activo secundario.",
      ],
    },
  ],

  "t6-b4": [
    {
      heading: "Calcio y fósforo hacen más que hueso",
      paragraphs: [
        "Es cierto que la mayor parte del calcio y el fósforo del cuerpo está en el esqueleto, pero reducirlos a eso deja fuera casi toda su fisiología.",
        "El calcio participa en la contracción muscular, la transmisión nerviosa, la coagulación y multitud de rutas de señalización. El fósforo forma parte del ATP, de los ácidos nucleicos y de los fosfolípidos de todas las membranas.",
      ],
    },
    {
      heading: "El magnesio, el olvidado",
      paragraphs: [
        "El magnesio estabiliza el ATP: en la célula el ATP funciona realmente como complejo Mg-ATP. Además actúa como cofactor de cientos de enzimas.",
        "Cuando en un examen aparezca una enzima que no funciona, el magnesio es una de las primeras piezas que conviene revisar.",
      ],
    },
    {
      heading: "La homeostasis del calcio es un trabajo en equipo",
      paragraphs: [
        "La concentración de calcio en sangre se mantiene en un margen estrecho porque una desviación importante afecta a músculo y nervio de inmediato.",
        "En ese control intervienen la vitamina D, la hormona paratiroidea, el intestino que lo absorbe, el riñón que lo retiene o elimina, y el hueso que actúa como reserva movilizable.",
      ],
      note: "Que el hueso sea reserva significa que una calcemia normal puede convivir con una pérdida ósea progresiva. El análisis de sangre no cuenta toda la historia.",
    },
  ],

  "t6-b5": [
    {
      heading: "Hierro: ingerido no es absorbido",
      paragraphs: [
        "El hierro forma parte de la hemoglobina, la mioglobina y numerosas proteínas de transferencia de electrones. Pero lo que determina tu estado de hierro no es cuánto comes, sino cuánto absorbes.",
        "El hierro hemo, de origen animal, se absorbe con más facilidad. El hierro no hemo, mayoritario en vegetales, depende mucho más de lo que le acompañe en esa comida.",
      ],
    },
    {
      heading: "Cómo mejorar la absorción del hierro no hemo",
      paragraphs: [
        "La vitamina C mejora su absorción de forma consistente: lo reduce y lo mantiene soluble. Por eso tiene sentido acompañar las legumbres con una fuente de vitamina C.",
        "En sentido contrario actúan los fitatos, los taninos del té y el café, y cantidades altas de calcio en la misma toma. El consejo práctico es separar esos inhibidores de la comida rica en hierro cuando hay riesgo real de déficit — no eliminarlos de la dieta.",
      ],
      note: "La absorción de hierro está además regulada por el propio organismo: quien tiene menos reservas absorbe proporcionalmente más.",
    },
    {
      heading: "Los otros oligoelementos",
      paragraphs: [
        "El cinc participa en enzimas, en la expresión génica y en la función inmunitaria. El yodo es imprescindible para las hormonas tiroideas. El selenio forma parte de selenoproteínas con papel antioxidante y tiroideo.",
        "Con todos ellos hay que valorar tres cosas por separado: si la ingesta es suficiente, si existe riesgo de exceso, y qué biodisponibilidad tiene la forma química presente en el alimento.",
      ],
    },
  ],

  // ───────────────────────── TEMA 7 · Vitaminas ─────────────────────────
  "t7-b1": [
    {
      heading: "La solubilidad predice el comportamiento",
      paragraphs: [
        "Las vitaminas se clasifican en hidrosolubles —el complejo B y la vitamina C— y liposolubles —A, D, E y K. No es una etiqueta descriptiva: de ella se deduce casi todo lo demás.",
        "Las hidrosolubles se absorben con el medio acuoso, circulan libremente y el exceso se elimina con relativa facilidad por orina. Las liposolubles necesitan grasa para absorberse, viajan con lipoproteínas y se almacenan en hígado y tejido adiposo.",
      ],
    },
    {
      heading: "Consecuencias prácticas",
      paragraphs: [
        "Como se almacenan, las liposolubles pueden acumularse, y por eso el riesgo de toxicidad por suplementación es mayor con ellas que con las hidrosolubles.",
        "Y como necesitan grasa para absorberse, cualquier problema que afecte a la digestión de grasas —insuficiencia pancreática, colestasis, cirugía— compromete antes que nada a las vitaminas A, D, E y K.",
      ],
      note: "Que una vitamina sea esencial no implica que más sea mejor. Dosis altas no equivalen a más función.",
    },
  ],

  "t7-b2": [
    {
      heading: "Las vitaminas B son piezas de coenzimas",
      paragraphs: [
        "Ninguna vitamina del grupo B aporta energía. Lo que hacen es convertirse en coenzimas, es decir, en las piezas que ciertas enzimas necesitan para poder trabajar.",
        "Por eso una carencia de vitamina B no se nota como «falta de calorías», sino como el bloqueo de reacciones concretas del metabolismo.",
      ],
    },
    {
      heading: "Quién se convierte en qué",
      paragraphs: [
        "La B1 (tiamina) da lugar al TPP, necesario para descarboxilaciones como la del piruvato. La B2 (riboflavina) origina el FMN y el FAD. La B3 (niacina) origina el NAD y el NADP. La B5 (ácido pantoténico) forma parte de la coenzima A. La B6 origina el PLP, clave en el metabolismo de aminoácidos. La biotina participa en las carboxilaciones.",
      ],
      formula: "B1→TPP · B2→FAD/FMN · B3→NAD/NADP\nB5→CoA · B6→PLP · B7→carboxilasas",
      note: "Nomenclatura actual: B7 para biotina y B9 para folato. Algunos textos antiguos usan otras numeraciones.",
    },
    {
      heading: "La conexión que hay que ver",
      paragraphs: [
        "Recorre el camino completo con la riboflavina: es la vitamina B2, el organismo la transforma en FAD, y el FAD acepta electrones convirtiéndose en FADH₂ dentro de la β-oxidación o del ciclo de Krebs.",
        "Cuando en el Tema 10 cuentes FADH₂ para calcular ATP, estarás contando moléculas que empezaron siendo una vitamina de la dieta. Esa es la razón de estudiar este tema antes del metabolismo.",
      ],
    },
  ],

  "t7-b3": [
    {
      heading: "Dos vitaminas, un mismo tipo de trabajo",
      paragraphs: [
        "El folato y la B12 participan en transferencias de grupos de un carbono, reacciones necesarias para sintetizar los nucleótidos con los que se fabrica ADN.",
        "Por eso sus deficiencias golpean primero a los tejidos que se dividen deprisa, como la médula ósea, y ambas pueden producir el mismo cuadro: una anemia megaloblástica.",
      ],
    },
    {
      heading: "Por qué no basta con dar folato",
      paragraphs: [
        "Aquí está el punto clínicamente importante. Ante una anemia megaloblástica, administrar folato puede corregir la alteración de la sangre aunque la causa real sea un déficit de B12.",
        "El problema es que la B12 tiene además funciones neurológicas que el folato no cubre. Corregir la anemia sin identificar la causa puede enmascarar el cuadro mientras el daño neurológico avanza.",
        "De ahí la regla: un síntoma compartido no garantiza la misma deficiencia. Hay que identificar cuál falta antes de tratar.",
      ],
      note: "El déficit de B12 puede dar hormigueos, alteraciones de la sensibilidad y problemas de marcha, además de la anemia.",
    },
    {
      heading: "La absorción de B12 es un recorrido largo",
      paragraphs: [
        "La B12 necesita varias etapas para absorberse: liberarse del alimento, unirse al factor intrínseco producido en el estómago, y ser captada en el íleon terminal.",
        "Cualquier eslabón que falle produce déficit aunque la ingesta sea correcta. Por eso hay riesgo en gastrectomías, en enfermedad ileal y en el uso prolongado de fármacos que reducen la acidez gástrica.",
      ],
    },
  ],

  "t7-b4": [
    {
      heading: "Un agente reductor con varios oficios",
      paragraphs: [
        "La vitamina C actúa como agente reductor: cede electrones. Esa única propiedad química explica funciones que parecen no tener relación entre sí.",
        "Es cofactor de las hidroxilaciones necesarias para madurar el colágeno, y mejora la absorción del hierro no hemo manteniéndolo en forma reducida y soluble.",
      ],
    },
    {
      heading: "Del déficit al escorbuto",
      paragraphs: [
        "Sin ascorbato suficiente, el colágeno no se hidroxila correctamente y pierde estabilidad. Como el colágeno es la proteína estructural de vasos, piel, encías y tejido de cicatrización, el déficit se manifiesta en todos esos sitios a la vez.",
        "Fragilidad capilar, sangrado de encías y mala cicatrización no son tres enfermedades: son una sola alteración bioquímica vista en tres tejidos.",
      ],
    },
    {
      heading: "Es frágil en la cocina",
      paragraphs: [
        "La vitamina C se degrada con el tiempo, el calor, la luz y el contacto con el oxígeno, y al ser hidrosoluble se pierde en el agua de cocción.",
        "Eso convierte la forma de conservar y cocinar en un factor real de la ingesta: la misma verdura puede aportar cantidades muy distintas según cómo se haya tratado.",
      ],
    },
  ],

  "t7-b5": [
    {
      heading: "Cada una con su mecanismo",
      paragraphs: [
        "La vitamina A participa en la visión y en la diferenciación celular. La D regula la homeostasis del calcio y del fósforo. La E protege los lípidos de las membranas frente a la oxidación. La K permite modificar determinadas proteínas de la coagulación y del hueso.",
        "Asociar cada vitamina a un mecanismo, y no a una lista de síntomas sueltos, es lo que permite razonar casos nuevos en lugar de reconocer los ya vistos.",
      ],
    },
    {
      heading: "La vitamina D es en realidad un precursor hormonal",
      paragraphs: [
        "La vitamina D puede sintetizarse en la piel con la radiación solar, y después necesita activarse en el hígado y en el riñón antes de ser funcional.",
        "Su estado depende de la latitud, la estación, la exposición solar, la pigmentación cutánea, la edad y la función renal y hepática. Por eso es la vitamina donde menos sentido tiene razonar solo desde la dieta.",
      ],
    },
    {
      heading: "Qué hace exactamente la vitamina K",
      paragraphs: [
        "La vitamina K no coagula la sangre ni forma coágulos. Es cofactor de una modificación química que ciertos factores de coagulación necesitan para volverse funcionales.",
        "Es decir: permite que las proteínas maduren; la cascada de coagulación viene después. Distinguir «hace posible» de «hace» es lo que separa entender de repetir.",
      ],
      note: "Por eso los anticoagulantes tipo dicumarínico interfieren con la vitamina K, y por eso importa la constancia en su ingesta cuando alguien los toma.",
    },
  ],

  "t7-b6": [
    {
      heading: "Una cifra sin contexto no significa nada",
      paragraphs: [
        "Cuando veas una recomendación de ingesta, necesita cuatro datos para ser interpretable: el nutriente con su unidad, a qué grupo de población se refiere, qué organismo la publica y de qué año es.",
        "Falta uno cualquiera y la cifra deja de ser utilizable. «Vitamina C: 80 mg» no dice si es para un adulto, una embarazada o un niño, ni si es una ingesta recomendada o un límite superior.",
      ],
    },
    {
      heading: "Las necesidades no son las mismas para todos",
      paragraphs: [
        "Edad, sexo, embarazo y lactancia, capacidad de absorción, medicación y situación clínica modifican los requerimientos reales de una persona concreta.",
        "Y las fuentes alimentarias hay que interpretarlas por ración habitual, frecuencia de consumo y biodisponibilidad, no por el contenido por 100 gramos de una tabla.",
      ],
      note: "Las tablas del libro pueden estar desactualizadas. Conviene consultar referencias EFSA o AESAN vigentes y anotar el año.",
    },
  ],

  // ───────────────────────── TEMA 8 · Introducción al metabolismo ─────────────────────────
  "t8-b1": [
    {
      heading: "Construir y degradar son procesos distintos",
      paragraphs: [
        "El catabolismo degrada moléculas grandes en pequeñas y conserva parte de la energía liberada en forma de ATP y de transportadores reducidos. El anabolismo hace lo contrario: construye moléculas complejas, y para ello necesita energía y poder reductor.",
        "Una ruta metabólica es una secuencia ordenada de reacciones, cada una con su enzima y sus puntos de control. No es una combustión: es una cadena de pasos regulados.",
      ],
    },
    {
      heading: "No son la misma ruta al revés",
      paragraphs: [
        "Compara la β-oxidación con la síntesis de ácidos grasos. La primera acorta la cadena de dos en dos carbonos y produce acetil-CoA, NADH y FADH₂. La segunda la alarga, consumiendo ATP y NADPH.",
        "Podría parecer que una es la otra en sentido inverso, pero no lo es: usan enzimas diferentes, ocurren en compartimentos distintos —mitocondria y citosol— y se regulan por separado.",
        "Esa separación es deliberada. Permite activar una y frenar la otra según convenga, en lugar de tener las dos funcionando a la vez y anulándose.",
      ],
      note: "Ante cualquier ruta, pregúntate tres cosas: ¿construye o degrada?, ¿dónde ocurre?, ¿qué consume y qué produce?",
    },
  ],

  "t8-b2": [
    {
      heading: "El ATP es una moneda, no una despensa",
      paragraphs: [
        "El ATP conecta los procesos que liberan energía con los que la necesitan. Al transferir un grupo fosfato, permite que una reacción desfavorable se acople a otra favorable y que el conjunto salga adelante.",
        "La célula mantiene una reserva sorprendentemente pequeña de ATP: lo que hace es reciclarlo continuamente entre ATP y ADP. Se estima que una persona recicla al día una masa de ATP comparable a su propio peso corporal.",
      ],
    },
    {
      heading: "Acoplamiento no es empujar",
      paragraphs: [
        "Una imagen frecuente y equivocada es la del ATP «empujando» la reacción. Lo que ocurre es distinto: la enzima coordina las dos transformaciones de modo que el balance energético global resulte favorable.",
        "La reacción sigue sin ser espontánea por sí sola. Lo que se vuelve espontáneo es el proceso conjunto.",
      ],
    },
    {
      heading: "Dos maneras de fabricar ATP",
      paragraphs: [
        "En la fosforilación a nivel de sustrato, un intermediario de la ruta cede directamente un fosfato al ADP. Ocurre en la glucólisis y en el ciclo de Krebs, y no necesita oxígeno.",
        "En la fosforilación oxidativa, el ATP se fabrica gracias a un gradiente de protones generado por la cadena respiratoria. Es la vía que produce la mayoría del ATP, y sí depende del oxígeno.",
      ],
    },
  ],

  "t8-b3": [
    {
      heading: "Oxidar y reducir",
      paragraphs: [
        "Oxidarse es perder electrones y reducirse es ganarlos. En metabolismo, esos electrones no viajan sueltos: los llevan transportadores especializados.",
        "El NAD⁺ y el FAD son las formas oxidadas, disponibles para aceptar electrones. Al recibirlos se convierten en NADH y FADH₂, sus formas reducidas.",
      ],
    },
    {
      heading: "Por qué NADH rinde más que FADH₂",
      paragraphs: [
        "El NADH entrega sus electrones en el complejo I de la cadena respiratoria, así que su recorrido atraviesa tres puntos de bombeo de protones.",
        "Los electrones ligados al FAD llegan más abajo, directamente a la ubiquinona: por el complejo II cuando vienen del succinato, y por ETF/ETFDH cuando vienen de la β-oxidación. Al saltarse el complejo I, impulsan menos bombeo de protones.",
        "Menos protones bombeados significa menos ATP fabricado. De ahí la diferencia de rendimiento.",
      ],
      formula: "NADH ≈ 2,5 ATP   ·   FADH₂ ≈ 1,5 ATP",
      note: "Los valores antiguos de 3 y 2 ATP son aproximaciones superadas. Usa 2,5 y 1,5.",
    },
    {
      heading: "El NADPH juega en otra liga",
      paragraphs: [
        "El NADPH se parece químicamente al NADH pero cumple una función distinta: no se usa para fabricar ATP, sino como poder reductor en las biosíntesis y en la defensa antioxidante.",
        "La célula mantiene ambos pares en estados diferentes precisamente para poder usarlos con propósitos distintos sin que se interfieran.",
      ],
    },
  ],

  "t8-b4": [
    {
      heading: "Todos los caminos pasan por aquí",
      paragraphs: [
        "El acetil-CoA es el punto donde convergen las tres grandes vías catabólicas. Los carbohidratos llegan por glucosa y piruvato; las grasas, por β-oxidación de los ácidos grasos; y algunos aminoácidos, por su propia degradación.",
        "Sigue tres moléculas distintas: la glucosa se convierte en piruvato y este en acetil-CoA; el palmitato se acorta por β-oxidación hasta acetil-CoA; la leucina catabolizada produce acetil-CoA o acetoacetato. Tres orígenes, un mismo destino.",
      ],
    },
    {
      heading: "Convergir no es ser intercambiable",
      paragraphs: [
        "Que todo desemboque en acetil-CoA no significa que los nutrientes sean equivalentes ni que se pueda ir en cualquier dirección desde ahí.",
        "El ejemplo decisivo: en humanos no se puede convertir acetil-CoA en glucosa de forma neta. Por eso las grasas de cadena par no sirven como fuente de glucosa por mucha que haya, y por eso el organismo recurre a los aminoácidos en el ayuno prolongado.",
        "El destino real del acetil-CoA depende del estado energético, de las hormonas, del compartimento donde esté y de la disponibilidad de oxalacetato para entrar en Krebs.",
      ],
      note: "Este es de los conceptos que más rendimiento dan: explica el ayuno, la cetogénesis y buena parte del Tema 11.",
    },
  ],

  "t8-b5": [
    {
      heading: "Después de comer",
      paragraphs: [
        "Tras una comida sube la insulina y baja el glucagón. Esa relación entre las dos hormonas, más que su valor por separado, es la señal que interpreta el cuerpo.",
        "Con la insulina alta, los tejidos captan glucosa, se favorece su oxidación inmediata y el excedente se almacena: glucógeno en hígado y músculo, triglicéridos en tejido adiposo.",
      ],
    },
    {
      heading: "En ayuno se invierte el sentido",
      paragraphs: [
        "Al bajar la insulina y subir el glucagón, el hígado moviliza su glucógeno y después empieza a fabricar glucosa nueva por gluconeogénesis. El tejido adiposo libera ácidos grasos.",
        "El objetivo prioritario es mantener la glucemia, porque hay tejidos que dependen de la glucosa de forma casi exclusiva.",
      ],
    },
    {
      heading: "Cada órgano hace lo suyo",
      paragraphs: [
        "Las hormonas son señales generales, pero cada tejido responde según las enzimas y transportadores que tiene. No todos activan las mismas rutas.",
        "El hígado sostiene la glucemia del conjunto. El músculo se abastece a sí mismo. El tejido adiposo almacena y libera grasa. El cerebro consume glucosa y, en ayuno prolongado, se adapta a usar cuerpos cetónicos. El eritrocito, sin mitocondrias, depende siempre de la glucólisis.",
      ],
      note: "Cuando un examen pregunta «qué pasa en ayuno», la respuesta completa siempre distingue órganos.",
    },
  ],

  // ───────────────────────── TEMA 9 · Digestión y absorción ─────────────────────────
  "t9-b1": [
    {
      heading: "Digerir y absorber son dos cosas",
      paragraphs: [
        "La digestión química rompe las macromoléculas del alimento en piezas pequeñas, casi siempre por hidrólisis enzimática. Cambia las moléculas.",
        "La absorción es el paso de esas piezas desde la luz intestinal al enterocito y de ahí al medio interno. Cambia su localización, no su estructura.",
        "Son consecutivas pero independientes, y un problema puede estar en cualquiera de las dos.",
      ],
    },
    {
      heading: "Y emulsionar es una tercera",
      paragraphs: [
        "Con las grasas aparece un paso previo que conviene no confundir con los otros dos. Las sales biliares emulsionan: dividen las gotas grandes de grasa en gotitas pequeñas, aumentando la superficie disponible.",
        "La bilis no contiene ninguna enzima que hidrolice triglicéridos. Prepara el terreno para que la lipasa trabaje, pero no digiere.",
        "El orden completo es: emulsionar, hidrolizar, absorber. Tres verbos, tres procesos, tres protagonistas distintos.",
      ],
      note: "Que la bilis no sea enzimática es una pregunta clásica. Emulsiona; la lipasa pancreática es la que rompe.",
    },
  ],

  "t9-b2": [
    {
      heading: "El almidón empieza a digerirse en la boca",
      paragraphs: [
        "La amilasa salival inicia la hidrólisis de los enlaces α(1→4) del almidón mientras masticas. Su acción se interrumpe en el estómago, donde el pH ácido la inactiva.",
        "La amilasa pancreática retoma el trabajo en el intestino delgado, y es la que hace la mayor parte del trabajo.",
      ],
    },
    {
      heading: "El remate lo hace el borde en cepillo",
      paragraphs: [
        "Las amilasas no llegan hasta el monosacárido: dejan oligosacáridos y disacáridos. El acabado corre a cargo de enzimas ancladas en la membrana de los enterocitos, en lo que se llama borde en cepillo.",
        "Allí están la maltasa, la sacarasa, la lactasa y la isomaltasa, que se ocupa de las ramificaciones α(1→6). Solo después de su acción quedan monosacáridos absorbibles.",
        "Esto explica por qué la intolerancia a la lactosa es un problema del borde en cepillo y no del páncreas.",
      ],
      note: "No se absorbe almidón intacto. La digestión de hidratos termina siempre en monosacáridos: glucosa, galactosa y fructosa.",
    },
  ],

  "t9-b3": [
    {
      heading: "El estómago prepara, no digiere del todo",
      paragraphs: [
        "El ácido gástrico desnaturaliza las proteínas del alimento: las despliega y expone sus enlaces peptídicos. Recuerda el Tema 4 — desnaturalizar no es romper la cadena.",
        "La pepsina, activa precisamente a pH ácido, inicia entonces la proteólisis cortando la cadena en fragmentos.",
      ],
    },
    {
      heading: "Por qué el páncreas secreta enzimas apagadas",
      paragraphs: [
        "Las proteasas pancreáticas se secretan como zimógenos, es decir, en forma inactiva: tripsinógeno, quimotripsinógeno, proelastasa.",
        "El motivo es evidente si se piensa un momento: una proteasa activa dentro del páncreas digeriría el propio páncreas. Manteniéndolas apagadas hasta llegar al intestino, el órgano se protege.",
        "Una vez allí, la enteropeptidasa activa la tripsina, y esta activa a las demás en cascada. La activación queda localizada exactamente donde debe ocurrir.",
      ],
      note: "Cuando esa protección falla y las enzimas se activan dentro del páncreas, se produce una pancreatitis.",
    },
    {
      heading: "Qué se absorbe al final",
      paragraphs: [
        "Las peptidasas del borde en cepillo terminan el trabajo. El enterocito absorbe aminoácidos libres, pero también dipéptidos y tripéptidos, que se rompen ya dentro de la célula.",
        "Lo que no ocurre de forma significativa es la absorción de proteína intacta. Es un dato relevante para valorar afirmaciones comerciales sobre proteínas «que pasan enteras».",
      ],
    },
  ],

  "t9-b4": [
    {
      heading: "Emulsión y micelas",
      paragraphs: [
        "Las sales biliares y los fosfolípidos rompen la grasa en gotas pequeñas y después forman micelas: agregados diminutos que llevan los productos de la digestión lipídica hasta la superficie del enterocito.",
        "Sin micelas, esos productos no alcanzarían la membrana en cantidad suficiente, por muy bien hidrolizados que estuvieran.",
      ],
    },
    {
      heading: "La lipasa corta en las posiciones 1 y 3",
      paragraphs: [
        "La lipasa pancreática, ayudada por la colipasa, no hidroliza las tres posiciones del triacilglicérido por igual: actúa preferentemente sobre la 1 y la 3.",
        "El resultado es que se liberan dos ácidos grasos libres y queda un 2-monoacilglicérido, con el tercer ácido graso todavía unido en la posición central.",
      ],
      formula: "triacilglicérido → 2-monoacilglicérido + 2 ácidos grasos",
      note: "La descripción de que un triglicérido se digiere hasta glicerol más tres ácidos grasos está demasiado simplificada. El producto principal es el 2-monoacilglicérido.",
    },
    {
      heading: "Dentro del enterocito se vuelve a montar",
      paragraphs: [
        "Una vez dentro, la célula reesterifica: vuelve a formar triglicéridos a partir del monoacilglicérido y los ácidos grasos absorbidos.",
        "Después los empaqueta junto con colesterol, fosfolípidos y apoproteínas en un quilomicrón, listo para salir. Es decir, la grasa se desmonta para cruzar y se vuelve a montar al otro lado.",
      ],
    },
  ],

  "t9-b5": [
    {
      heading: "Cuatro mecanismos de entrada",
      paragraphs: [
        "La difusión simple sigue el gradiente y no necesita proteína ni energía. La difusión facilitada también sigue el gradiente, pero requiere un transportador.",
        "El transporte activo primario usa ATP directamente. El secundario no gasta ATP en el momento: aprovecha un gradiente que otra proteína mantuvo antes gastándolo.",
      ],
    },
    {
      heading: "Cada azúcar entra a su manera",
      paragraphs: [
        "La glucosa y la galactosa entran por el SGLT1, un cotransportador que las arrastra junto con sodio: transporte activo secundario, exactamente el mecanismo del Tema 6.",
        "La fructosa entra por difusión facilitada mediante GLUT5, sin acoplarse al sodio. Esa diferencia explica que su absorción tenga un límite distinto y que un exceso pueda producir molestias digestivas.",
      ],
    },
    {
      heading: "Por qué el suero de rehidratación lleva sal y azúcar",
      paragraphs: [
        "Como el SGLT1 necesita sodio y glucosa a la vez, una solución que contenga ambos aprovecha ese cotransporte y absorbe más solutos.",
        "Y al absorber solutos, el agua sigue detrás por ósmosis. Ese es el fundamento del suero oral: no es que el azúcar «dé energía», es que abre la puerta al sodio y con él al agua.",
      ],
      note: "La proporción importa. Una bebida demasiado azucarada puede resultar hiperosmolar y empeorar la diarrea en lugar de mejorarla.",
    },
  ],

  "t9-b6": [
    {
      heading: "Dos salidas distintas del enterocito",
      paragraphs: [
        "Los monosacáridos y los aminoácidos son hidrosolubles: pasan directamente a los capilares de la vena porta y llegan al hígado antes que a ningún otro órgano.",
        "Los quilomicrones no pueden hacer eso: son demasiado grandes para entrar en un capilar sanguíneo. Salen a un vaso linfático del propio villi —el quilífero— y recorren la linfa hasta desembocar en la circulación general.",
      ],
      formula: "glucosa, aminoácidos → vena porta → hígado\nquilomicrón → linfa → sangre",
    },
    {
      heading: "La consecuencia: el hígado filtra unos nutrientes y otros no",
      paragraphs: [
        "Como los azúcares y aminoácidos pasan primero por el hígado, este puede regularlos antes de que lleguen al resto del cuerpo. Es el llamado efecto de primer paso.",
        "Las grasas de los quilomicrones, en cambio, entran en la circulación general antes de pasar por el hígado y son captadas por los tejidos por el camino. Una diferencia logística con consecuencias metabólicas reales.",
      ],
    },
    {
      heading: "Lo que llega al colon",
      paragraphs: [
        "Lo que no se digiere ni se absorbe en el intestino delgado llega al colon, donde la microbiota lo fermenta. De esa fermentación salen gases y ácidos grasos de cadena corta: acetato, propionato y butirato.",
        "El butirato es el combustible preferente de los colonocitos. Es decir, parte de la fibra que «no aprovechas» acaba alimentando literalmente a las células de tu intestino grueso.",
      ],
    },
  ],

  // ───────────────────────── TEMA 10 · Metabolismo de los hidratos ─────────────────────────
  "t10-b1": [
    {
      heading: "Todo empieza con un fosfato",
      paragraphs: [
        "Cuando la glucosa cruza la membrana, lo primero que ocurre no es que se degrade. Una enzima le transfiere un fosfato del ATP al carbono 6 y la convierte en glucosa-6-fosfato. La enzima es la hexoquinasa en casi todos los tejidos, y la glucoquinasa en el hígado.",
        "Ese cambio pequeño tiene dos consecuencias grandes. La primera: los transportadores GLUT reconocen glucosa, no glucosa-6-fosfato, así que la molécula fosforilada ya no puede salir por donde vino. Al gastar ese ATP, la célula ha decidido quedársela.",
        "La segunda es más sutil. Al fosforilar, la célula mantiene muy baja la concentración de glucosa libre en su interior, y mientras dentro haya poca y fuera mucha, la glucosa sigue entrando sola a favor de gradiente. Fosforilar retiene y además mantiene la puerta abierta.",
      ],
      note: "La glucoquinasa hepática solo trabaja en serio con concentraciones altas de glucosa. Por eso el hígado amortigua la subida posprandial.",
    },
    {
      heading: "Tres salidas desde el mismo cruce",
      paragraphs: [
        "La glucosa-6-fosfato no es un destino sino un cruce de caminos, y cuál se toma depende del tejido y del momento.",
        "Puede seguir a glucólisis si hace falta energía inmediata, almacenarse como glucógeno si sobra, o desviarse por la vía de las pentosas fosfato.",
        "Esa tercera ruta se olvida porque no produce ATP. Lo que produce es NADPH, el poder reductor con el que se sintetizan ácidos grasos y se neutraliza el estrés oxidativo, y ribosa-5-fosfato, el azúcar de los nucleótidos.",
      ],
      formula: "glucólisis  ·  glucógeno  ·  pentosas fosfato",
    },
    {
      heading: "El hígado reparte; el músculo no",
      paragraphs: [
        "Los dos almacenan glucógeno, pero hacen con él cosas distintas, y la razón cabe en una enzima.",
        "El hígado tiene glucosa-6-fosfatasa: puede retirar el fosfato y devolver glucosa libre a la sangre. Por eso sostiene tu glucemia mientras duermes.",
        "El músculo carece de esa enzima, así que su glucosa-6-fosfato no tiene salida hacia la sangre y solo puede gastarla él mismo. El glucógeno muscular es una despensa privada. Eso sí, el músculo puede aportar carbono a la glucemia por otra vía: enviando lactato o alanina al hígado.",
      ],
      note: "Misma molécula de reserva, función distinta según el órgano. Lo que cambia no es el glucógeno, son las enzimas que lo rodean.",
    },
  ],

  "t10-b2": [
    {
      heading: "Una glucosa, dos piruvatos",
      paragraphs: [
        "La glucólisis ocurre en el citosol y convierte una molécula de glucosa de seis carbonos en dos de piruvato de tres carbonos.",
        "Son diez reacciones, pero no hace falta memorizar las diez flechas para dominar el tema: basta con entender la contabilidad y los tres puntos de control.",
      ],
    },
    {
      heading: "La contabilidad, sin memorizar",
      paragraphs: [
        "La ruta tiene dos fases. En la fase de inversión la célula gasta 2 ATP para fosforilar y preparar la molécula. En la fase de beneficio recupera 4 ATP y produce 2 NADH.",
        "El balance neto es una resta: 4 menos 2 son 2 ATP netos, más 2 NADH citosólicos y 2 piruvatos.",
      ],
      formula: "gasto 2 ATP · ingreso 4 ATP · neto 2 ATP + 2 NADH + 2 piruvato",
    },
    {
      heading: "Lo que la glucólisis necesita de verdad",
      paragraphs: [
        "Suele decirse que la glucólisis es anaerobia, y conviene precisarlo: ninguna de sus reacciones usa oxígeno directamente.",
        "Lo que sí necesita imprescindiblemente es NAD⁺ disponible. Si todo el NAD⁺ está en forma de NADH y nada lo reoxida, la ruta se detiene. Ese es el problema que resuelve el paso siguiente.",
      ],
    },
  ],

  "t10-b3": [
    {
      heading: "El piruvato tiene dos salidas",
      paragraphs: [
        "En condiciones aerobias y con mitocondrias disponibles, el piruvato entra en la mitocondria y el complejo piruvato deshidrogenasa lo convierte en acetil-CoA, liberando CO₂ y produciendo NADH.",
        "Esa reacción es irreversible en humanos, y esa irreversibilidad es la que impide después convertir grasa en glucosa. Merece la pena subrayarla ahora porque explica media asignatura más adelante.",
      ],
    },
    {
      heading: "El lactato es una solución, no un residuo",
      paragraphs: [
        "La otra salida es reducir el piruvato a lactato. Y la clave está en para qué sirve: esa reacción reoxida NADH a NAD⁺, y con ello permite que la glucólisis siga funcionando.",
        "El eritrocito lo hace permanentemente, incluso rodeado de oxígeno en la sangre, simplemente porque no tiene mitocondrias y no puede oxidar el piruvato por otra vía.",
        "Por eso explicar el lactato solo como consecuencia de «falta de oxígeno» es incompleto. Se produce siempre que hace falta regenerar NAD⁺ deprisa, y además es un metabolito reutilizable que otros tejidos consumen.",
      ],
      note: "El lactato no causa las agujetas ni es un desecho tóxico. Es combustible que viaja entre tejidos.",
    },
  ],

  "t10-b4": [
    {
      heading: "Un ciclo que se regenera a sí mismo",
      paragraphs: [
        "El acetil-CoA se condensa con el oxalacetato para formar citrato, y a lo largo del ciclo la molécula se va oxidando hasta regenerar oxalacetato, listo para recibir el siguiente acetil-CoA.",
        "Por eso es un ciclo y no una cadena: el aceptor se recupera al final de cada vuelta.",
      ],
    },
    {
      heading: "Qué produce cada vuelta",
      paragraphs: [
        "Por cada acetil-CoA que entra, el ciclo produce 3 NADH, 1 FADH₂, 1 GTP y libera 2 CO₂.",
        "Como una glucosa da dos piruvatos y cada piruvato un acetil-CoA, una glucosa provoca dos vueltas completas: 6 NADH, 2 FADH₂, 2 GTP y 4 CO₂.",
      ],
      formula: "por acetil-CoA: 3 NADH + 1 FADH₂ + 1 GTP + 2 CO₂",
    },
    {
      heading: "Anfibólico: también sirve para construir",
      paragraphs: [
        "El ciclo de Krebs no solo oxida combustible. Varios de sus intermediarios se retiran para fabricar aminoácidos, hemo y otras moléculas, y por eso se le llama anfibólico.",
        "Eso tiene una consecuencia práctica: si se retiran intermediarios sin reponerlos, el ciclo se queda sin oxalacetato y se ralentiza. La disponibilidad de oxalacetato es un factor limitante real, y volverá a aparecer en la cetogénesis.",
      ],
      note: "Los carbonos que salen como CO₂ en una vuelta no son los que acaban de entrar con el acetilo. El acetilo acaba oxidándose, pero en vueltas posteriores.",
    },
  ],

  "t10-b5": [
    {
      heading: "Los electrones bajan una escalera",
      paragraphs: [
        "El NADH y el FADH₂ entregan sus electrones a los complejos de la membrana mitocondrial interna. Los electrones van pasando de un complejo a otro, cediendo energía en cada salto.",
        "Esa energía se usa para bombear protones desde la matriz hacia el espacio intermembrana, creando un gradiente. El oxígeno espera al final de la escalera como aceptor último, y al recibir los electrones se forma agua.",
      ],
    },
    {
      heading: "La ATP sintasa cobra el peaje",
      paragraphs: [
        "Los protones acumulados fuera tienden a volver a la matriz, y el único paso cómodo es a través de la ATP sintasa. Al atravesarla, la hacen girar, y ese giro es lo que fosforila ADP a ATP.",
        "Conviene tener clara la secuencia: los electrones crean el gradiente; el gradiente fabrica el ATP. No es que el NADH «contenga» ATP dentro.",
      ],
    },
    {
      heading: "Por qué se da un intervalo y no una cifra exacta",
      paragraphs: [
        "El rendimiento de la oxidación completa de una glucosa se estima en unas 30–32 ATP, y hay dos razones para el margen.",
        "La primera es que los NADH producidos en el citosol durante la glucólisis no cruzan la membrana interna: sus electrones entran mediante lanzaderas, y según cuál se use el rendimiento difiere.",
        "La segunda es que el acoplamiento real entre protones bombeados y ATP producido no da números enteros exactos. Por eso los valores modernos son aproximados.",
      ],
      formula: "glucosa ≈ 30–32 ATP  ·  NADH ≈ 2,5  ·  FADH₂ ≈ 1,5",
      note: "Las cifras de 36–38 ATP que aparecen en textos antiguos vienen de usar 3 y 2 ATP por transportador. Están superadas.",
    },
  ],

  "t10-b6": [
    {
      heading: "Fabricar glucosa desde cero",
      paragraphs: [
        "La gluconeogénesis produce glucosa nueva, principalmente en el hígado y, en ayuno prolongado, también en el riñón.",
        "No es la glucólisis funcionando al revés. Tres pasos de la glucólisis son irreversibles, y la gluconeogénesis los rodea con enzimas propias que consumen energía. Coincide en parte del recorrido, pero no es la misma ruta invertida.",
      ],
    },
    {
      heading: "De qué se puede fabricar glucosa",
      paragraphs: [
        "Sirven el lactato procedente del músculo y del eritrocito, el glicerol liberado al degradar triglicéridos, y los esqueletos carbonados de los aminoácidos glucogénicos.",
        "No sirve el acetil-CoA procedente de la β-oxidación de ácidos grasos de cadena par, por la irreversibilidad del paso piruvato → acetil-CoA. Esta es la razón bioquímica de que no se pueda convertir grasa en glucosa de forma neta.",
      ],
      note: "El glicerol del triglicérido sí es gluconeogénico. La parte de la grasa que puede dar glucosa es esa, no los ácidos grasos.",
    },
    {
      heading: "El ciclo de Cori",
      paragraphs: [
        "Sigue el recorrido: el músculo produce lactato, la sangre lo lleva al hígado, y el hígado lo reconvierte en glucosa gastando ATP. Esa glucosa vuelve al músculo.",
        "El carbono da la vuelta completa, pero el balance energético no es neutro: el hígado gasta más energía fabricando la glucosa de la que el músculo obtuvo degradándola. El ciclo desplaza la carga energética de un órgano a otro.",
        "Sobre todo esto, la insulina favorece almacenar y utilizar; el glucagón favorece la producción hepática de glucosa.",
      ],
    },
  ],

  // ───────────────────────── TEMA 11 · Metabolismo lipídico ─────────────────────────
  "t11-b1": [
    {
      heading: "Sacar la grasa del almacén",
      paragraphs: [
        "En ayuno, la lipólisis del tejido adiposo rompe los triglicéridos almacenados y libera ácidos grasos y glicerol a la sangre.",
        "La insulina frena este proceso y favorece el almacenamiento; las catecolaminas y el glucagón lo estimulan. Es el mismo interruptor hormonal del Tema 8, aplicado a la grasa.",
      ],
    },
    {
      heading: "Dos productos, dos destinos",
      paragraphs: [
        "Los ácidos grasos no esterificados son poco solubles, así que viajan unidos a la albúmina del plasma. Los tejidos oxidativos —músculo, corazón, hígado— los captan y los queman.",
        "El glicerol, en cambio, es hidrosoluble y viaja libre. Llega sobre todo al hígado, donde puede alimentar la gluconeogénesis o servir para volver a formar triglicéridos.",
        "No conviene confundir lipólisis con β-oxidación: la primera libera el combustible desde el almacén, la segunda lo degrada dentro de la célula que lo va a usar.",
      ],
      note: "Esa distinción explica por qué se puede movilizar grasa sin oxidarla, y por qué acaba reesterificándose si no se consume.",
    },
  ],

  "t11-b2": [
    {
      heading: "Activar cuesta dos ATP",
      paragraphs: [
        "Antes de poder oxidarse, un ácido graso debe activarse: se une a la coenzima A para formar acil-CoA. La reacción consume un ATP que se rompe hasta AMP, lo que equivale a gastar dos enlaces de alta energía.",
        "Ese coste hay que restarlo al final, cuando se calcule el rendimiento neto. Es el error más común en los ejercicios de β-oxidación.",
      ],
    },
    {
      heading: "La lanzadera de carnitina",
      paragraphs: [
        "La β-oxidación ocurre en la matriz mitocondrial, pero la membrana interna no deja pasar el acil-CoA de cadena larga. Hace falta un sistema de transporte.",
        "La CPT-I transfiere el grupo acilo desde la CoA a la carnitina; una translocasa mete el acil-carnitina en la matriz; y la CPT-II lo devuelve a una CoA del interior. Fíjate en el detalle: lo que cruza es el grupo acilo, no la coenzima A entera.",
      ],
      formula: "acil-CoA → CPT-I → translocasa → CPT-II → acil-CoA (matriz)",
    },
    {
      heading: "El control que impide el derroche",
      paragraphs: [
        "El malonil-CoA, que es el primer intermediario de la síntesis de ácidos grasos, inhibe la CPT-I.",
        "El razonamiento es elegante: si la célula está fabricando grasa, hay malonil-CoA; y si hay malonil-CoA, la puerta de entrada a la oxidación se cierra. Así se evita sintetizar y quemar grasa al mismo tiempo, un ciclo fútil que solo desperdiciaría energía.",
      ],
    },
  ],

  "t11-b3": [
    {
      heading: "Cortar de dos en dos",
      paragraphs: [
        "La β-oxidación acorta la cadena en dos carbonos por ciclo. Cada vuelta libera un acetil-CoA y produce un NADH y un FADH₂.",
        "El último corte es distinto: al quedar una cadena de cuatro carbonos, se parte en dos acetil-CoA de golpe. Por eso hay siempre un ciclo menos que acetil-CoA.",
      ],
    },
    {
      heading: "La fórmula que resuelve cualquier ejercicio",
      paragraphs: [
        "Para un ácido graso saturado de cadena par con n carbonos: el número de acetil-CoA es n/2, y el número de ciclos es n/2 − 1. Se producen tantos NADH y tantos FADH₂ como ciclos.",
        "Aplícalo al palmitato, C16:0. Acetil-CoA: 16/2 = 8. Ciclos: 8 − 1 = 7. Por tanto 7 NADH y 7 FADH₂.",
      ],
      formula: "acetil-CoA = n/2   ·   ciclos = n/2 − 1",
    },
    {
      heading: "El cálculo completo del palmitato",
      paragraphs: [
        "Ahora suma con los valores modernos. Los 8 acetil-CoA entran en Krebs y rinden unos 10 ATP cada uno, es decir 80. Los 7 NADH aportan 7 × 2,5 = 17,5. Los 7 FADH₂ aportan 7 × 1,5 = 10,5. Total 108.",
        "Resta los 2 ATP equivalentes de la activación inicial y quedan aproximadamente 106 ATP netos por palmitato.",
      ],
      note: "Los rendimientos mayores de los libros antiguos vienen de usar 3 ATP/NADH y 2 ATP/FADH₂. Aquí se aplican 2,5 y 1,5.",
    },
  ],

  "t11-b4": [
    {
      heading: "Cuando sobra acetil-CoA en el hígado",
      paragraphs: [
        "En ayuno prolongado la β-oxidación hepática va a toda máquina y genera mucho acetil-CoA. Pero para entrar en Krebs el acetil-CoA necesita oxalacetato, y en esa situación el oxalacetato está siendo desviado hacia la gluconeogénesis.",
        "El acetil-CoA sobrante se reconduce entonces hacia otra vía: la cetogénesis, que produce acetoacetato y β-hidroxibutirato. La acetona aparece como producto secundario y es la que da el olor característico del aliento.",
      ],
    },
    {
      heading: "El hígado fabrica pero no consume",
      paragraphs: [
        "Los cuerpos cetónicos se exportan a la sangre y otros tejidos los reconvierten en acetil-CoA para quemarlos: músculo, corazón, riñón y, tras varios días de ayuno, también el cerebro.",
        "El hígado no puede usarlos, y la razón es concreta: carece de la enzima SCOT (OXCT1) necesaria para activar el acetoacetato. Fabrica combustible para los demás y no toca el suyo.",
      ],
      note: "El libro dice que cantidades bajas se metabolizan en el hígado. Es incorrecto: sin SCOT no hay cetólisis hepática.",
    },
    {
      heading: "Cetosis no es cetoacidosis",
      paragraphs: [
        "La cetosis fisiológica del ayuno o de una dieta muy baja en hidratos es un estado controlado: los cuerpos cetónicos suben, pero el sistema tampón del organismo mantiene el pH.",
        "La cetoacidosis es otra cosa. Requiere un déficit grave de insulina, la producción se dispara sin freno, se acompaña de deshidratación y la capacidad tampón se ve superada. El pH cae y la situación es una urgencia médica.",
        "Compartir el nombre no significa compartir la gravedad, y es una confusión que aparece con frecuencia en consulta.",
      ],
    },
  ],

  "t11-b5": [
    {
      heading: "Fabricar grasa cuando sobra energía",
      paragraphs: [
        "La síntesis de ácidos grasos ocurre en el citosol, pero el acetil-CoA se genera dentro de la mitocondria y no puede salir directamente.",
        "La solución es exportarlo disfrazado: el acetil-CoA se combina con oxalacetato formando citrato, el citrato sale al citosol, y allí se vuelve a romper liberando el acetil-CoA donde hacía falta.",
      ],
    },
    {
      heading: "El punto de control",
      paragraphs: [
        "La acetil-CoA carboxilasa convierte acetil-CoA en malonil-CoA, y es la enzima reguladora clave de la ruta. Ya la conoces por el otro lado: su producto es el que cierra la CPT-I.",
        "A partir de ahí, la cadena se va alargando de dos en dos carbonos, consumiendo ATP y NADPH. Ese NADPH viene en buena parte de la vía de las pentosas fosfato, que apareció en el Tema 10.",
      ],
    },
    {
      heading: "De glucosa a grasa almacenada",
      paragraphs: [
        "Con exceso energético e insulina alta, la glucosa aporta tanto el acetil-CoA para fabricar ácidos grasos como el glicerol-3-fosfato con el que esterificarlos.",
        "El hígado ensambla triglicéridos y los exporta en VLDL; el tejido adiposo los capta y los almacena. El carbono ha pasado de glucosa a grasa.",
        "Y conviene retener la asimetría: sintetizar grasa consume energía, oxidarla la produce. No son la misma operación con el signo cambiado.",
      ],
    },
  ],

  "t11-b6": [
    {
      heading: "El colesterol se fabrica, no solo se come",
      paragraphs: [
        "El organismo sintetiza colesterol principalmente en hígado e intestino, aunque también en otros tejidos. La enzima reguladora es la HMG-CoA reductasa, que es precisamente la diana de las estatinas.",
        "Como hay síntesis endógena regulada, la relación entre el colesterol de la dieta y el de la sangre no es directa ni proporcional.",
      ],
    },
    {
      heading: "Las partículas se remodelan por el camino",
      paragraphs: [
        "Una VLDL sale del hígado cargada de triglicéridos. A medida que la LPL se los va retirando en los tejidos, la partícula se empequeñece y se convierte en remanente o IDL.",
        "Parte de esos remanentes termina como LDL, ya relativamente rica en colesterol porque ha perdido casi todos sus triglicéridos. Es decir, la LDL no se secreta como tal: se forma en circulación.",
      ],
      formula: "VLDL → (acción de LPL) → IDL/remanentes → LDL",
    },
    {
      heading: "Más allá de bueno y malo",
      paragraphs: [
        "Etiquetar la LDL como «colesterol malo» y la HDL como «bueno» es una simplificación que impide razonar. Las dos transportan la misma molécula en direcciones distintas.",
        "Lo que se valora hoy incluye la concentración, el número de partículas, el contexto metabólico de la persona y el patrón dietético global. Ninguno de esos cuatro datos cabe en una etiqueta de dos palabras.",
      ],
    },
  ],

  // ───────────────────────── TEMA 12 · Metabolismo proteico ─────────────────────────
  "t12-b1": [
    {
      heading: "No hay almacén de proteína",
      paragraphs: [
        "Los hidratos tienen el glucógeno y las grasas el tejido adiposo. Las proteínas no tienen equivalente: no existe un depósito cuya función sea guardar aminoácidos por si acaso.",
        "Lo que hay es una reserva metabólica pequeña, alimentada por la dieta, por el recambio continuo de las proteínas del propio cuerpo y por la síntesis de los aminoácidos no esenciales.",
      ],
    },
    {
      heading: "Qué pasa con el exceso",
      paragraphs: [
        "Si comes más proteína de la que necesitas, una parte se usa para síntesis y recambio, y el resto se cataboliza. No se guarda en forma de más proteína disponible.",
        "Y catabolizar un aminoácido exige un paso previo que no tienen ni la glucosa ni las grasas: hay que retirarle el nitrógeno y eliminarlo. Solo después se puede hacer algo con su esqueleto carbonado.",
        "En sentido contrario, cuando falta energía el cuerpo degrada proteína funcional —músculo, entre otras— para obtener aminoácidos. Esos tejidos no son una reserva inocua: son estructura en uso.",
      ],
      note: "La regla de este tema: primero se gestiona el nitrógeno, después el carbono. Son dos historias separadas.",
    },
  ],

  "t12-b2": [
    {
      heading: "Transaminar es mover el grupo amino de sitio",
      paragraphs: [
        "En una transaminación, un aminoácido cede su grupo amino a un α-cetoácido. El aminoácido se convierte en cetoácido y el cetoácido en aminoácido: el nitrógeno cambia de portador sin liberarse.",
        "Sigue el ejemplo típico: la alanina cede su amino al α-cetoglutarato. El resultado es piruvato —el esqueleto de la alanina, ya sin nitrógeno— y glutamato, que se lleva el amino.",
      ],
      formula: "alanina + α-cetoglutarato ⇄ piruvato + glutamato",
    },
    {
      heading: "El glutamato es el recolector",
      paragraphs: [
        "Estas reacciones convergen: el glutamato acaba recogiendo el nitrógeno de muchos aminoácidos distintos. Es el punto de reunión antes de la eliminación.",
        "El glutamato puede después sufrir una desaminación oxidativa, y ahí sí se libera nitrógeno en forma de amonio. Transaminar mueve el nitrógeno; desaminar lo suelta.",
      ],
    },
    {
      heading: "La vitamina que hace falta aquí",
      paragraphs: [
        "Todas las aminotransferasas necesitan piridoxal fosfato (PLP) como coenzima, y el PLP deriva de la vitamina B6.",
        "Es una conexión directa con el Tema 7: sin B6 suficiente, el metabolismo de los aminoácidos se resiente en bloque, no en una reacción concreta.",
      ],
    },
  ],

  "t12-b3": [
    {
      heading: "El amonio hay que transportarlo con cuidado",
      paragraphs: [
        "El amonio es tóxico, especialmente para el sistema nervioso central. No puede circular libremente por la sangre en cantidad apreciable.",
        "Por eso los tejidos lo empaquetan antes de enviarlo: como glutamina, que es la forma de transporte más usada, o como alanina, sobre todo desde el músculo.",
      ],
    },
    {
      heading: "El ciclo de la urea, en el hígado",
      paragraphs: [
        "En el hígado, el ciclo de la urea combina dos átomos de nitrógeno y los convierte en urea, una molécula mucho menos tóxica y muy soluble, que el riñón elimina por la orina.",
        "Los dos nitrógenos llegan por caminos distintos: uno entra como amonio, incorporado en forma de carbamoil fosfato, y el otro lo aporta el aspartato. El carbono procede del bicarbonato.",
        "El ciclo consume energía y se conecta con el de Krebs a través del fumarato y del aspartato, así que ambos funcionan acoplados.",
      ],
      formula: "NH₄⁺ (carbamoil fosfato) + aspartato → urea",
      note: "La urea se sintetiza en el hígado; el riñón la elimina. Confundir ambos órganos es un error frecuente.",
    },
  ],

  "t12-b4": [
    {
      heading: "Qué queda cuando se va el nitrógeno",
      paragraphs: [
        "Retirado el grupo amino, queda el esqueleto carbonado, y cada aminoácido entra al metabolismo por un punto distinto: como piruvato, como acetil-CoA, como acetoacetato o como algún intermediario del ciclo de Krebs.",
        "El punto de entrada es el que determina qué se puede hacer después con ese carbono.",
      ],
    },
    {
      heading: "Glucogénico o cetogénico",
      paragraphs: [
        "Un aminoácido es glucogénico si su esqueleto puede aportar carbono neto para fabricar glucosa —porque entra como piruvato o como intermediario de Krebs.",
        "Es cetogénico si entra como acetil-CoA o acetoacetato, que ya sabes del Tema 10 que no pueden dar glucosa de forma neta.",
        "La mayoría son glucogénicos, varios son mixtos, y solo dos son exclusivamente cetogénicos: la leucina y la lisina. Merece la pena memorizar ese par, porque es la excepción que se pregunta.",
      ],
      formula: "exclusivamente cetogénicos: leucina y lisina",
    },
    {
      heading: "Alanina en ayuno",
      paragraphs: [
        "La alanina transamina y da piruvato; el piruvato entra en la gluconeogénesis hepática; su carbono acaba en glucosa nueva. Por eso la alanina es glucogénica.",
        "Y fíjate en que la etiqueta glucogénico/cetogénico describe solo el destino del carbono. El nitrógeno de esa misma alanina sigue su propio camino hacia la urea, en paralelo.",
      ],
    },
  ],

  "t12-b5": [
    {
      heading: "Qué mide el balance nitrogenado",
      paragraphs: [
        "El balance nitrogenado compara el nitrógeno que entra con la dieta y el que sale, sobre todo como urea en la orina.",
        "Positivo significa que se retiene nitrógeno, y acompaña al crecimiento, al embarazo, a la recuperación de una enfermedad o al aumento de masa muscular. Negativo significa pérdida neta de proteína corporal.",
      ],
    },
    {
      heading: "Indica dirección, no causa",
      paragraphs: [
        "Un balance negativo dice que se está perdiendo proteína, pero no por qué. Puede deberse a ingesta insuficiente, a inflamación, a un traumatismo, a un problema de absorción o a falta de energía.",
        "Por eso es un dato de partida y no un diagnóstico: obliga a buscar la causa, no a concluirla.",
      ],
    },
    {
      heading: "Energía suficiente para ahorrar proteína",
      paragraphs: [
        "Hay un punto especialmente relevante en Dietética: si la ingesta energética es insuficiente, el organismo usa aminoácidos como combustible aunque se le esté aportando proteína.",
        "Es decir, dar proteína sin cubrir las necesidades energéticas no evita el catabolismo proteico. La energía tiene que llegar primero para que la proteína pueda dedicarse a construir en lugar de a arder.",
        "Sobre el balance influyen además el ejercicio, las hormonas, la enfermedad y la distribución de la proteína a lo largo del día.",
      ],
      note: "Este es el razonamiento que hay detrás del soporte nutricional en pacientes: primero energía, después proteína.",
    },
  ],

  // ───────────────────────── TEMA 4 · Proteínas ─────────────────────────
  "t4-b1": [
    {
      heading: "Todos los aminoácidos comparten un esqueleto",
      paragraphs: [
        "Un aminoácido proteico tiene un carbono central, llamado carbono α, del que salen cuatro cosas: un grupo amino (—NH₂), un grupo carboxilo (—COOH), un hidrógeno y una cadena lateral que se abrevia como R.",
        "Tres de esas cuatro son idénticas en los veinte aminoácidos. Esa parte común es la que permite que se encadenen unos con otros formando proteínas: todos tienen el mismo tipo de conector.",
      ],
      formula: "        R\n        |\nH₂N — Cα — COOH\n        |\n        H",
    },
    {
      heading: "La cadena R es donde está toda la variedad",
      paragraphs: [
        "Lo único que cambia de un aminoácido a otro es R. Y de ella dependen el tamaño, la carga, la polaridad y la reactividad química de esa posición de la proteína.",
        "Compara glicina y alanina: las dos conservan amino, carboxilo y carbono α. En la glicina R es simplemente un H; en la alanina, un CH₃. Un grupo metilo de diferencia, y ya se comportan distinto.",
        "Cuando más adelante veas que una proteína se pliega de determinada manera, la explicación estará casi siempre en las cadenas R: cuáles buscan el agua, cuáles la evitan, cuáles se atraen entre sí.",
      ],
    },
    {
      heading: "Esenciales quiere decir que los tiene que traer la dieta",
      paragraphs: [
        "Un aminoácido esencial no es más importante que los demás: es que el cuerpo humano no puede sintetizarlo en cantidad suficiente y tiene que llegar con los alimentos.",
        "Actualmente se consideran nueve esenciales en el adulto, incluida la histidina. Algunos textos antiguos hablan de ocho porque dejaban la histidina fuera.",
      ],
      note: "«Esencial» es una etiqueta nutricional, no bioquímica. Describe lo que tu metabolismo no sabe fabricar, no la función de la molécula.",
    },
  ],

  "t4-b2": [
    {
      heading: "Cómo se encadenan",
      paragraphs: [
        "Dos aminoácidos se unen por el grupo carboxilo de uno y el grupo amino del otro. Como balance estructural simplificado, se pierden los elementos de una molécula de agua y queda un enlace —CO—NH—.",
        "Ese enlace tiene nombre propio en biología —enlace peptídico— pero químicamente es una amida, del Tema 1. No es una categoría nueva: es un grupo funcional que ya conocías.",
      ],
      formula: "—COOH + H₂N— → —CO—NH— + H₂O",
    },
    {
      heading: "La cadena tiene dirección",
      paragraphs: [
        "Una cadena peptídica no es simétrica. En un extremo queda un grupo amino libre (extremo N-terminal) y en el otro un carboxilo libre (extremo C-terminal).",
        "Por convención, las secuencias se escriben y se leen siempre de N a C. Ala—Gly y Gly—Ala son péptidos distintos, igual que dos palabras con las mismas letras en distinto orden son palabras distintas.",
      ],
    },
    {
      heading: "Lo que realmente pasa en el ribosoma",
      paragraphs: [
        "La reacción tal como se acaba de describir sirve para entender la estructura, pero no es exactamente lo que ocurre en la célula.",
        "En el ribosoma no se encuentran dos aminoácidos libres y reaccionan. Los aminoácidos llegan activados y unidos a un ARNt, y lo que sucede es que la cadena peptídica en construcción se transfiere al siguiente aminoácido. El resultado es el mismo enlace, pero el mecanismo está controlado y consume energía.",
      ],
      note: "Distinguir el balance de la reacción del mecanismo real es un hábito que te ahorrará errores en todo el bloque de metabolismo.",
    },
  ],

  "t4-b3": [
    {
      heading: "Cuatro niveles, cada uno construido sobre el anterior",
      paragraphs: [
        "La estructura primaria es la secuencia: qué aminoácidos, en qué orden. Es la única que está escrita directamente en el gen.",
        "La secundaria son patrones locales que se repiten, sobre todo la hélice α y la lámina β, sostenidos por puentes de hidrógeno del esqueleto.",
        "La terciaria es la forma tridimensional completa de una cadena, y la cuaternaria aparece solo cuando varias cadenas se asocian para funcionar juntas.",
      ],
    },
    {
      heading: "Qué sostiene el plegamiento",
      paragraphs: [
        "El plegamiento no lo mantiene una sola fuerza, sino varias a la vez: puentes de hidrógeno, interacciones iónicas entre cadenas R con carga, interacciones hidrófobas que esconden las cadenas apolares del agua, y puentes disulfuro covalentes entre cisteínas.",
        "Las interacciones hidrófobas merecen atención especial: en un medio acuoso, las cadenas R apolares tienden a quedar hacia el interior de la proteína. Es el mismo principio que ordenaba los fosfolípidos en el Tema 3.",
      ],
    },
    {
      heading: "De la forma sale la función",
      paragraphs: [
        "Al plegarse, la proteína crea superficies con una forma y una química concretas: bolsillos donde encaja un sustrato, zonas de unión a otra molécula, centros activos. La función es consecuencia directa de la geometría.",
        "La hemoglobina es el ejemplo clásico de cuaternaria: cada cadena tiene su propia estructura terciaria, y solo cuando varias subunidades se asocian aparece el comportamiento cooperativo que hace útil a la molécula.",
      ],
      formula: "secuencia → plegamiento → función",
    },
  ],

  "t4-b4": [
    {
      heading: "Dos procesos que suenan parecido y no lo son",
      paragraphs: [
        "Desnaturalizar y digerir una proteína se confunden constantemente, y distinguirlos es de lo más rentable del tema.",
        "La desnaturalización altera el plegamiento: la proteína pierde su forma tridimensional. La hidrólisis rompe enlaces peptídicos: la cadena se corta en trozos más cortos.",
        "Son independientes. Puedes desnaturalizar sin hidrolizar nada, y de hecho es lo normal.",
      ],
    },
    {
      heading: "Cocer un huevo",
      paragraphs: [
        "El calor rompe las interacciones que mantenían plegadas las proteínas de la clara. Las cadenas se despliegan, se enredan entre sí y forman una red sólida: la clara se vuelve blanca y firme.",
        "Pero los enlaces peptídicos siguen ahí. La cocción no ha convertido la proteína en aminoácidos — eso es trabajo de las proteasas digestivas, más adelante.",
      ],
      note: "La estructura primaria se conserva durante la desnaturalización. Para romper la cadena hace falta hidrólisis.",
    },
    {
      heading: "Por qué desnaturalizar ayuda a digerir",
      paragraphs: [
        "Aunque no rompa enlaces, la desnaturalización sí facilita la digestión: al desplegarse, la cadena queda expuesta y las proteasas pueden acceder a puntos que antes estaban escondidos dentro del plegamiento.",
        "Ese es exactamente el papel del ácido gástrico en el Tema 9: no digiere la proteína, la prepara para que la digieran.",
      ],
    },
  ],

  "t4-b5": [
    {
      heading: "Qué hace realmente una enzima",
      paragraphs: [
        "Una enzima acelera una reacción disminuyendo su energía de activación: ofrece un camino más fácil entre reactivos y productos.",
        "Lo que no hace es igual de importante. No aporta energía a la reacción, no cambia la posición del equilibrio y no vuelve favorable una reacción que no lo era. Solo hace que se llegue antes a donde se iba a llegar de todos modos.",
      ],
      note: "Una enzima cambia la velocidad, no el destino. Si la reacción no era espontánea, seguirá sin serlo por mucha enzima que haya.",
    },
    {
      heading: "El centro activo y lo que lo altera",
      paragraphs: [
        "El centro activo es el hueco donde encaja el sustrato, formado por la disposición tridimensional de determinadas cadenas R. Su forma explica la especificidad: por qué la lactasa actúa sobre la lactosa y no sobre otra cosa.",
        "Como el centro activo depende del plegamiento, todo lo que afecte al plegamiento afecta a la actividad. Por eso hay un pH y una temperatura óptimos, y por eso pasado cierto punto la actividad cae en picado en vez de seguir subiendo.",
        "En la inhibición competitiva, otra molécula ocupa el mismo centro y compite con el sustrato. Aumentar la concentración de sustrato puede reducir el efecto relativo del inhibidor, porque compiten por el mismo sitio.",
      ],
    },
    {
      heading: "Cofactores y coenzimas",
      paragraphs: [
        "Muchas enzimas no funcionan solas. Necesitan un cofactor —a menudo un ion metálico como Mg²⁺, Zn²⁺ o Fe²⁺— o una coenzima, que suele derivar de una vitamina.",
        "Esa es la conexión que hace útil el Tema 7: cuando estudies las vitaminas del grupo B no estarás memorizando una lista, estarás viendo las piezas que faltan para que estas enzimas trabajen.",
      ],
      note: "La clasificación EC actual tiene siete clases: a las seis clásicas se añadieron las translocasas.",
    },
  ],

  "t4-b6": [
    {
      heading: "Qué significa calidad proteica",
      paragraphs: [
        "La calidad de una proteína alimentaria depende de dos cosas: cuánto se digiere y absorbe realmente, y si su patrón de aminoácidos indispensables cubre lo que la persona necesita.",
        "Una proteína puede tener una composición excelente y digerirse mal, o al revés. Por eso los índices modernos combinan ambos aspectos en lugar de mirar solo la composición.",
      ],
    },
    {
      heading: "Complementariedad, sin el mito del mismo plato",
      paragraphs: [
        "Una fuente vegetal puede ser relativamente limitada en algún aminoácido indispensable — las legumbres en metionina, los cereales en lisina. Al combinar fuentes variadas, lo que a una le falta lo aporta la otra y el patrón conjunto mejora.",
        "Lo que ya no se sostiene es la idea de que esa combinación tenga que ocurrir en la misma comida. El organismo maneja una reserva de aminoácidos que permite integrar los aportes a lo largo del día.",
      ],
      note: "Legumbre y cereal se complementan bien, pero no hace falta que coincidan en el mismo bocado.",
    },
    {
      heading: "La proteína no es un combustible de primera elección",
      paragraphs: [
        "Las proteínas tienen función estructural, catalítica, transportadora, defensiva y reguladora. Usar sus aminoácidos como fuente de energía es posible, pero es el destino menos rentable.",
        "Y tiene un coste añadido: para quemar un aminoácido hay que retirarle antes el nitrógeno y eliminarlo como urea, un proceso que consume energía. Lo verás con detalle en el Tema 12.",
      ],
    },
  ],
};
