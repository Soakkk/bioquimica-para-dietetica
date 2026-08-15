// Cuestiones de apertura.
//
// Cada sección abre con una pregunta que se responde ANTES de leer y cuya
// respuesta no se revela hasta el final. Esa espera es todo el mecanismo: si
// el veredicto llega al instante, la curiosidad se apaga y se lee en piloto
// automático; si se retrasa, se lee buscando.
//
// Por eso la pregunta no puede ser de comprobación: tiene que ser algo que un
// principiante responda mal por una intuición razonable. Se apuesta contra una
// creencia previa, no contra un hueco de memoria.
//
// Una sección sin entrada aquí se renderiza igual, solo que sin apertura.

export type OpeningQuestion = {
  /** Enunciado. Debe poder responderse a ciegas, jugándosela. */
  prompt: string;
  options: string[];
  /** Índice de la correcta dentro de `options`. */
  answer: number;
  /** Por qué falla cada opción incorrecta, indexado igual que `options`. */
  why: Record<number, string>;
  /** Explicación al destapar, común a todos los casos. */
  resolution: string;
  /** Remate opcional: el matiz que conviene retener. */
  aside?: string;
};

export const openingQuestions: Record<string, OpeningQuestion> = {
  // ─────────────── TEMA 1 · Química del carbono ───────────────
  "t1-b1": {
    prompt: "El carbono tiene 4 electrones de valencia y forma 4 enlaces. ¿Es casualidad que coincidan?",
    options: [
      "No: los enlaces son literalmente esos mismos electrones",
      "Sí, en buena medida: son dos cosas distintas que aquí dan el mismo número",
      "No: todos los átomos forman tantos enlaces como electrones de valencia",
    ],
    answer: 1,
    why: {
      0: "Es la intuición más extendida, y falla en cuanto sales del carbono: el oxígeno tiene 6 electrones de valencia y forma 2 enlaces.",
      2: "El nitrógeno tiene 5 electrones de valencia y forma 3 enlaces; el oxígeno, 6 y 2. La regla no se sostiene.",
    },
    resolution: "Son dos números que responden a preguntas distintas. Los electrones de valencia dicen con cuánto cuenta el átomo; los enlaces, cuántos necesita para completar su capa. En el carbono coinciden en 4 y por eso se confunden, pero en el oxígeno son 6 y 2.",
    aside: "Si arrastras esta confusión, el resto del tema se vuelve memorización. Si la separas, todo se deduce contando.",
  },

  "t1-b2": {
    prompt: "¿Puede existir una molécula cuya fórmula sea exactamente CH₂O?",
    options: [
      "Sí: el formaldehído es CH₂O",
      "No: CH₂O es solo una proporción, no una molécula",
      "No: esa fórmula incumple la tetravalencia del carbono",
    ],
    answer: 0,
    why: {
      1: "Esa es la respuesta correcta si CH₂O aparece como fórmula empírica de la glucosa, pero la pregunta es si puede existir: el formaldehído tiene justo esa fórmula molecular.",
      2: "La cumple perfectamente: el carbono forma dos enlaces con los hidrógenos y un doble enlace con el oxígeno, sumando cuatro.",
    },
    resolution: "Sí puede: el formaldehído es CH₂O. La trampa es que CH₂O es también la fórmula empírica de la glucosa (C₆H₁₂O₆), y ahí funciona como proporción, no como molécula. La misma escritura significa cosas distintas según qué tipo de fórmula sea.",
    aside: "Moraleja: antes de interpretar una fórmula, pregunta de qué tipo es.",
  },

  "t1-b3": {
    prompt: "En un dibujo, la fila horizontal tiene 4 carbonos y hay un recorrido en diagonal de 5. ¿Cuál es la cadena principal?",
    options: [
      "La horizontal, porque es como se dibuja convencionalmente",
      "La de 5 carbonos, aunque esté en diagonal",
      "Los 6 carbonos juntos, bifurcando la cadena",
    ],
    answer: 1,
    why: {
      0: "El dibujo es solo una representación en el papel: la cadena principal es la más larga, no la que quedó en horizontal.",
      2: "Una cadena es un recorrido continuo; no puede dividirse en dos ramas ni pasar dos veces por el mismo carbono.",
    },
    resolution: "La cadena principal es el recorrido continuo más largo, gire por donde gire en el dibujo. Aquí son 5 carbonos, y lo que quede fuera pasa a ser sustituyente.",
    aside: "Elegir mal la cadena arrastra el error a todo el nombre: primero el recorrido, después los localizadores.",
  },

  "t1-b4": {
    prompt: "En el benceno se dibujan tres dobles enlaces alternos. ¿Qué están haciendo esos electrones?",
    options: [
      "Saltar continuamente de una posición a otra",
      "Están repartidos por todo el anillo, sin posiciones fijas",
      "Están quietos, exactamente donde los dibuja la fórmula",
    ],
    answer: 1,
    why: {
      0: "Es la imagen que sugiere el dibujo y la que dan muchos libros antiguos, pero no ocurre: no hay nada oscilando.",
      2: "Si estuvieran fijos, los enlaces del anillo tendrían longitudes distintas —unos simples y otros dobles—, y midiéndolos se comprueba que son todos iguales.",
    },
    resolution: "Los electrones π están deslocalizados: repartidos de forma estable por los seis carbonos. Todos los enlaces del anillo son equivalentes, y esa deslocalización es la que da al benceno su estabilidad característica.",
    aside: "El dibujo con dobles alternos es una convención heredada, no un retrato de la molécula.",
  },

  "t1-b5": {
    prompt: "Butanal y butanona comparten fórmula C₄H₈O. ¿Cómo de parecidas son sus propiedades?",
    options: [
      "Casi idénticas: misma fórmula, mismos átomos",
      "Distintas: cambia el grupo funcional y con él su química",
      "Distintas solo en el punto de ebullición",
    ],
    answer: 1,
    why: {
      0: "Tener los mismos átomos no basta: lo que determina el comportamiento químico es cómo están conectados.",
      2: "El punto de ebullición también cambia, pero es un síntoma. Lo de fondo es que uno es aldehído y otra cetona, y reaccionan de forma distinta.",
    },
    resolution: "Son isómeros de función. En el butanal el carbonilo está en un extremo de la cadena (aldehído) y en la butanona está dentro (cetona). Misma fórmula molecular, funciones químicas distintas.",
    aside: "Esta idea reaparece entera en el Tema 2 con glucosa y fructosa, que también comparten fórmula.",
  },

  "t1-b6": {
    prompt: "Tienes una cadena con dos metilos. ¿Desde qué extremo se numera?",
    options: [
      "Desde la izquierda, como se lee",
      "Desde el extremo que dé los localizadores más bajos",
      "Desde el extremo más cercano al primer metilo",
    ],
    answer: 1,
    why: {
      0: "La orientación del dibujo no manda: el mismo compuesto girado sobre el papel tendría otro nombre, y eso no puede ser.",
      2: "Se acerca, pero falla cuando hay varios sustituyentes: hay que comparar el conjunto entero, no solo el primero.",
    },
    resolution: "Se numera desde ambos extremos, se anotan las dos listas de localizadores y se comparan en el primer punto donde difieran. Gana la más baja. Para dos metilos en una cadena de seis carbonos, 2,4 gana a 3,5.",
    aside: "Si empatan en el primer sustituyente se pasa al siguiente, y así hasta que una gane.",
  },

  "t1-b7": {
    prompt: "¿Por qué los alcanos tienen dos hidrógenos más que la fórmula CₙH₂ₙ?",
    options: [
      "Porque los extremos de la cadena tienen una valencia libre de más cada uno",
      "Porque el carbono puede formar cinco enlaces en los extremos",
      "Porque llevan una molécula de hidrógeno suelta",
    ],
    answer: 0,
    why: {
      1: "El carbono no forma cinco enlaces nunca: esa es justamente la comprobación que delata una estructura mal escrita.",
      2: "No hay hidrógeno suelto: todos están enlazados a un carbono.",
    },
    resolution: "Un carbono interior gasta dos valencias en sus vecinos y le quedan dos para hidrógenos. Uno terminal gasta solo una y le quedan tres. Esos dos hidrógenos extra —uno por cada extremo— son los que convierten CₙH₂ₙ en CₙH₂ₙ₊₂.",
  },

  "t1-b8": {
    prompt: "Un aceite es poliinsaturado. ¿Sus dobles enlaces están conjugados?",
    options: [
      "Sí: poliinsaturado significa dobles enlaces alternos",
      "Normalmente no: suelen estar separados por un CH₂",
      "Solo si el aceite es de origen vegetal",
    ],
    answer: 1,
    why: {
      0: "Poliinsaturado solo dice cuántos dobles enlaces hay, no cómo están colocados entre sí.",
      2: "El origen del aceite no determina la disposición de sus dobles enlaces.",
    },
    resolution: "La mayoría de los ácidos grasos poliinsaturados de la dieta son metileno-interrumpidos: entre cada par de dobles enlaces hay un CH₂. No están conjugados. El ácido linoleico conjugado se nombra aparte precisamente porque es la excepción.",
    aside: "Conjugado, aislado y acumulado describen la colocación; poliinsaturado solo cuenta.",
  },

  "t1-b9": {
    prompt: "¿Puede un alquino presentar isomería cis-trans?",
    options: [
      "Sí, igual que un alqueno: tiene un enlace múltiple",
      "No: el triple enlace es lineal y no hay dos lados que distinguir",
      "Solo si la cadena tiene más de seis carbonos",
    ],
    answer: 1,
    why: {
      0: "Tener un enlace múltiple no basta. La isomería cis-trans necesita además que haya dos lados distinguibles, y el triple no los tiene.",
      2: "La longitud de la cadena no interviene en esto.",
    },
    resolution: "En un triple enlace los dos carbonos y sus vecinos quedan alineados: la geometría es lineal. No hay un «arriba» y un «abajo» que puedan intercambiarse, así que no cabe la isomería geométrica que sí tienen los dobles enlaces.",
  },

  "t1-b10": {
    prompt: "Te dan la fórmula C₅H₁₀. ¿Qué compuesto es?",
    options: [
      "Un alqueno, seguro",
      "Un ciclopentano, seguro",
      "Puede ser cualquiera de los dos: la fórmula no basta",
    ],
    answer: 2,
    why: {
      0: "Es la lectura más habitual, pero cerrar un anillo cuesta exactamente los mismos dos hidrógenos que añadir un doble enlace.",
      1: "Mismo problema al revés: la fórmula es compatible con las dos estructuras.",
    },
    resolution: "Tanto un doble enlace como un ciclo consumen un grado de insaturación, y ambos cuestan dos hidrógenos. C₅H₁₀ es compatible con ciclopentano y con cualquier penteno: hace falta ver la estructura para decidir.",
    aside: "Por eso se habla de «grados de insaturación» y no solo de «número de dobles enlaces».",
  },

  "t1-b11": {
    prompt: "¿Todos los enlaces del anillo del benceno miden lo mismo?",
    options: [
      "No: los dobles son más cortos que los simples",
      "Sí: todos son equivalentes",
      "No: depende de qué sustituyentes lleve",
    ],
    answer: 1,
    why: {
      0: "Sería cierto si hubiera dobles y simples fijos alternándose, que es lo que sugiere el dibujo. Midiéndolos se comprueba que no es así.",
      2: "Los sustituyentes modifican la reactividad, pero no rompen la equivalencia de los enlaces del anillo.",
    },
    resolution: "Todos los enlaces del anillo son iguales, y esa es la prueba experimental de la deslocalización: los electrones π están repartidos de forma estable por los seis carbonos, no fijos en tres posiciones. El dibujo con dobles alternos es una convención heredada.",
  },

  "t1-b12": {
    prompt: "Un anillo de seis carbonos lleva un —OH colgando. ¿Es un heterociclo?",
    options: [
      "Sí: tiene un oxígeno",
      "No: el oxígeno tiene que estar dentro del anillo",
      "Sí, porque el oxígeno cambia sus propiedades",
    ],
    answer: 1,
    why: {
      0: "Lo decisivo no es que haya un heteroátomo en la molécula, sino dónde está.",
      2: "Cambia sus propiedades, cierto, pero eso no lo convierte en heterociclo.",
    },
    resolution: "Un heterociclo lleva el heteroátomo formando parte del anillo. Si el oxígeno cuelga como sustituyente, el ciclo sigue siendo de carbonos y el compuesto es un derivado, no un heterociclo.",
    aside: "Pirrol, pirimidina y purina sí lo son, y por eso reaparecen en el capítulo 5 como bases nitrogenadas.",
  },

  "t1-b13": {
    prompt: "Has formulado una molécula y el nombre encaja con el enunciado. ¿Ya está?",
    options: [
      "Sí: si el nombre encaja, la estructura es correcta",
      "No: falta comprobar que cada carbono suma cuatro y contar los átomos",
      "No: falta pasarla a fórmula empírica",
    ],
    answer: 1,
    why: {
      0: "Un nombre correcto puede acompañar a un dibujo con un carbono de cinco enlaces o con hidrógenos olvidados. El nombre no audita la estructura.",
      2: "La fórmula empírica no comprueba nada de la estructura: es solo una proporción.",
    },
    resolution: "Formular termina al auditar. Primero se recorre cada carbono sumando órdenes de enlace, que deben dar cuatro. Después se cuentan todos los átomos para obtener la fórmula molecular. Las dos pasadas juntas atrapan casi cualquier error.",
    aside: "Si un carbono te sale con cinco enlaces, no busques la excepción: busca el error.",
  },

  // ─────────────── TEMA 2 · Hidratos de carbono ───────────────
  "t2-b1": {
    prompt: "¿Por qué se llaman «hidratos de carbono»?",
    options: [
      "Porque son carbono con moléculas de agua unidas",
      "Por una fórmula general antigua, (CH₂O)ₙ, que hoy no define bien al grupo",
      "Porque necesitan agua para digerirse",
    ],
    answer: 1,
    why: {
      0: "No hay agua unida a nada: el nombre viene de que la proporción de H y O coincidía con la del agua, no de que la contengan.",
      2: "La hidrólisis sí usa agua, pero eso ocurre en todos los macronutrientes y no explica el nombre.",
    },
    resolution: "El nombre es un fósil histórico. La proporción (CH₂O)ₙ sugería carbono hidratado, pero muchos carbohidratos no la cumplen. La definición actual es funcional: polihidroxialdehídos, polihidroxicetonas, o compuestos que los liberan al hidrolizarse.",
    aside: "Glúcido, carbohidrato e hidrato de carbono nombran lo mismo; el primero es el más neutro.",
  },

  "t2-b2": {
    prompt: "Glucosa, galactosa y fructosa comparten fórmula C₆H₁₂O₆. ¿Qué las diferencia?",
    options: [
      "El número de átomos de cada tipo",
      "La posición y el tipo de su grupo carbonilo, y la orientación de sus —OH",
      "Nada estructural: solo su origen alimentario",
    ],
    answer: 1,
    why: {
      0: "Si difirieran en eso no compartirían fórmula molecular: por definición tienen los mismos átomos.",
      2: "La diferencia es estructural y muy concreta, y explica que el cuerpo las metabolice por rutas distintas.",
    },
    resolution: "La fructosa es una cetohexosa: su carbonilo es una cetona en el carbono 2. Glucosa y galactosa son aldohexosas, con el carbonilo terminal, y se diferencian entre sí en la orientación del —OH de un carbono. Basta ese detalle para que sus rutas metabólicas no coincidan.",
  },

  "t2-b3": {
    prompt: "¿Qué diferencia hay entre la D-glucosa y la α-glucosa?",
    options: [
      "Ninguna: son dos nombres del mismo azúcar",
      "Son cosas distintas: D/L es configuración y α/β es anomería",
      "D es la forma lineal y α la cíclica",
    ],
    answer: 1,
    why: {
      0: "Se confunden mucho porque ambas etiquetas acompañan al mismo azúcar, pero describen dos propiedades independientes.",
      2: "La ciclación es lo que crea la distinción α/β, pero D/L existe también en la forma lineal.",
    },
    resolution: "Son dos etiquetas que responden a preguntas distintas. D/L describe la configuración de la molécula y no cambia al ciclarse. α/β describe hacia dónde apunta el —OH del carbono anomérico, y solo tiene sentido una vez formado el anillo. Por eso existe la α-D-glucosa: lleva las dos.",
  },

  "t2-b4": {
    prompt: "Una persona no digiere la lactosa. ¿Qué le falta exactamente?",
    options: [
      "La capacidad de absorber glucosa",
      "La enzima que rompe un enlace concreto, el β(1→4) de ese disacárido",
      "Las enzimas para digerir los lácteos en general",
    ],
    answer: 1,
    why: {
      0: "La glucosa se absorbe con normalidad; el problema está antes, en separar el disacárido.",
      2: "Los lácteos llevan además proteínas y grasa, que se digieren sin problema. Lo que falla es una enzima muy específica.",
    },
    resolution: "Falta lactasa, la enzima del borde en cepillo que hidroliza el enlace β(1→4) entre galactosa y glucosa. Sin ella la lactosa llega intacta al colon, donde la microbiota la fermenta y produce los síntomas.",
    aside: "Por eso el queso curado suele tolerarse: durante la curación la lactosa casi desaparece.",
  },

  "t2-b5": {
    prompt: "Almidón y celulosa son ambos polímeros de glucosa. ¿Por qué uno alimenta y el otro no?",
    options: [
      "Porque la celulosa no es realmente glucosa",
      "Por la orientación del enlace: α en el almidón, β en la celulosa",
      "Porque la celulosa tiene cadenas demasiado largas",
    ],
    answer: 1,
    why: {
      0: "La celulosa es glucosa pura, exactamente la misma molécula que hay en el almidón.",
      2: "La longitud no es el problema: el almidón también forma cadenas enormes y se digiere sin dificultad.",
    },
    resolution: "La amilasa humana reconoce enlaces α(1→4) y no toca los β(1→4). Los monómeros son idénticos; lo que decide si un polisacárido es alimento o fibra es cómo están orientados los enlaces que los unen.",
    aside: "Los rumiantes tampoco digieren celulosa por sí mismos: lo hace la microbiota de su rumen.",
  },

  "t2-b6": {
    prompt: "«La fibra ayuda al tránsito.» ¿Es una buena descripción de lo que hace la fibra?",
    options: [
      "Sí: es su función principal",
      "Se queda muy corta: según su tipo forma geles, se fermenta o aporta volumen",
      "No: la fibra no tiene ningún efecto sobre el tránsito",
    ],
    answer: 1,
    why: {
      0: "Es el efecto más conocido, pero corresponde sobre todo a la fracción insoluble, y deja fuera casi todo lo demás.",
      2: "Sí lo tiene: la fracción insoluble aumenta el volumen fecal. El error es reducir toda la fibra a eso.",
    },
    resolution: "La fibra soluble forma geles viscosos y es fermentada por la microbiota, que produce ácidos grasos de cadena corta. La insoluble aporta volumen y acelera el tránsito. Son efectos fisiológicos distintos, y por eso recomendar «más fibra» sin especificar cuál es una recomendación incompleta.",
  },

  // ─────────────── TEMA 3 · Lípidos ───────────────
  "t3-b1": {
    prompt: "¿Qué tienen en común todos los lípidos, químicamente hablando?",
    options: [
      "Un grupo funcional compartido, como los azúcares",
      "Nada estructural: se agrupan por ser poco solubles en agua",
      "Todos son ésteres de glicerol",
    ],
    answer: 1,
    why: {
      0: "Los glúcidos y las proteínas sí se definen por su estructura. Los lípidos no: es la única familia que se define por una propiedad física.",
      2: "Eso describe a los triglicéridos, pero el colesterol no lleva glicerol y sigue siendo un lípido.",
    },
    resolution: "«Lípido» es una categoría de solubilidad, no de estructura. Reúne triglicéridos, fosfolípidos, esteroles y esfingolípidos, que apenas se parecen entre sí. Por eso hay que clasificarlos por estructura y función, no por el hecho de no disolverse en agua.",
  },

  "t3-b2": {
    prompt: "En el ácido oleico, 18:1 n-9, ¿qué te dice el «n-9»?",
    options: [
      "Que tiene nueve dobles enlaces",
      "Que el primer doble enlace está a nueve carbonos del extremo metilo",
      "Que el doble enlace está en el carbono 9 contando desde el carboxilo",
    ],
    answer: 1,
    why: {
      0: "El número de dobles enlaces es el que va después de los dos puntos: aquí, uno.",
      2: "El sentido de la cuenta es justo el contrario. Omega se cuenta desde el extremo metilo, el opuesto al carboxilo.",
    },
    resolution: "La notación omega localiza el primer doble enlace contando desde el extremo metilo. En el ácido oleico son 18 carbonos, un doble enlace, y ese doble empieza a nueve carbonos del metilo.",
    aside: "En el ácido α-linolénico, 18:3 n-3, el 3 final y el 3 de en medio coinciden por casualidad: uno cuenta dobles y otro localiza el primero.",
  },

  "t3-b3": {
    prompt: "Un triglicérido se forma uniendo glicerol y tres ácidos grasos. ¿Qué se libera?",
    options: [
      "Nada: solo se unen",
      "Tres moléculas de agua",
      "Tres moléculas de CO₂",
    ],
    answer: 1,
    why: {
      0: "Cada unión es una esterificación, y toda esterificación libera agua.",
      2: "No se pierde carbono en el proceso: los tres ácidos grasos entran enteros.",
    },
    resolution: "Cada —OH del glicerol reacciona con el —COOH de un ácido graso formando un enlace éster y liberando una molécula de agua. Tres enlaces, tres aguas. La hidrólisis hace exactamente lo contrario: rompe los ésteres consumiendo agua.",
  },

  "t3-b4": {
    prompt: "¿Por qué un fosfolípido forma una bicapa y un triglicérido una gota?",
    options: [
      "Porque el fosfolípido tiene una cabeza polar y colas apolares",
      "Porque el fosfolípido es más pequeño",
      "Porque una proteína los coloca en su sitio",
    ],
    answer: 0,
    why: {
      1: "El tamaño no interviene: lo decisivo es tener dos regiones con afinidades opuestas por el agua.",
      2: "No hace falta que nadie los coloque. La bicapa se forma sola porque es la disposición más estable en agua.",
    },
    resolution: "El fosfolípido es anfipático: su cabeza busca el agua y sus colas la evitan. En medio acuoso, la disposición que satisface a ambas partes es una bicapa con las cabezas hacia fuera y las colas enfrentadas. El triglicérido es hidrófobo entero, así que solo puede agruparse en gota.",
    aside: "La membrana no está diseñada ni ensamblada: emerge de la anfipaticidad.",
  },

  "t3-b5": {
    prompt: "Se habla de «colesterol bueno» y «colesterol malo». ¿Son dos colesteroles distintos?",
    options: [
      "Sí: tienen estructuras químicas diferentes",
      "No: el colesterol es uno solo; HDL y LDL son partículas que lo transportan",
      "Sí: uno es de origen animal y otro vegetal",
    ],
    answer: 1,
    why: {
      0: "La molécula de colesterol es exactamente la misma vaya donde vaya.",
      2: "Los vegetales tienen fitoesteroles, que son otra cosa; y esa distinción no tiene nada que ver con HDL y LDL.",
    },
    resolution: "Hay un solo colesterol. HDL y LDL son lipoproteínas, es decir, vehículos que lo transportan en distintas direcciones y contextos. Hablar de dos colesteroles confunde la carga con el camión.",
    aside: "Por eso en un análisis se mide «colesterol asociado a LDL», no «colesterol malo».",
  },

  "t3-b6": {
    prompt: "Alguien decide reducir la grasa saturada de su dieta. ¿Basta con eso para mejorar su perfil lipídico?",
    options: [
      "Sí: menos saturada siempre es mejor",
      "No: depende de qué nutriente ocupe su lugar",
      "No: lo único que importa es la cantidad total de grasa",
    ],
    answer: 1,
    why: {
      0: "Reducir un nutriente obliga a aumentar otro, y el efecto final depende de cuál.",
      2: "La cantidad total importa menos que la calidad y el patrón: sustituir grasa por azúcar no mejora nada.",
    },
    resolution: "El efecto de quitar grasa saturada depende enteramente del sustituto. Reemplazarla por insaturados o por cereal integral se asocia a mejoras; reemplazarla por azúcares refinados, no. En nutrición, sustituir importa tanto como reducir.",
  },

  // ─────────────── TEMA 4 · Proteínas ───────────────
  "t4-b1": {
    prompt: "¿Qué parte de un aminoácido lo distingue de los otros diecinueve?",
    options: [
      "Su grupo amino",
      "Su cadena lateral R",
      "Su carbono α",
    ],
    answer: 1,
    why: {
      0: "El grupo amino es idéntico en todos: si fuera lo que los distingue, no habría veinte aminoácidos distintos.",
      2: "El carbono α es el esqueleto común. Precisamente por ser común no puede diferenciarlos.",
    },
    resolution: "Todos los aminoácidos proteicos comparten carbono α, grupo amino, grupo carboxilo e hidrógeno. La única parte variable es la cadena lateral R, y de ella salen el tamaño, la carga, la polaridad y la reactividad de cada uno.",
    aside: "Esa estructura común es lo que permite encadenarlos; la R es lo que da variedad al resultado.",
  },

  "t4-b2": {
    prompt: "El enlace peptídico une dos aminoácidos. ¿A qué tipo de enlace corresponde químicamente?",
    options: [
      "Éster",
      "Amida",
      "Glucosídico",
    ],
    answer: 1,
    why: {
      0: "Un éster surge de un ácido y un alcohol. Aquí interviene un grupo amino, no un —OH.",
      2: "El enlace glucosídico une azúcares y no aparece en las proteínas.",
    },
    resolution: "El carboxilo de un aminoácido reacciona con el amino del siguiente perdiendo los elementos de una molécula de agua, y el resultado —CO—NH— es exactamente una amida. Reconocerlo ayuda: lo que rompe una amida es la hidrólisis, y de ahí que las proteasas necesiten agua.",
  },

  "t4-b3": {
    prompt: "Si conoces la secuencia de aminoácidos de una proteína, ¿sabes ya su forma?",
    options: [
      "Sí: la secuencia determina el plegamiento",
      "No: el plegamiento es independiente de la secuencia",
      "Solo si además conoces su función",
    ],
    answer: 0,
    why: {
      1: "Es justo al revés: la información para plegarse está en la propia cadena, en las interacciones entre sus cadenas laterales.",
      2: "La función es consecuencia de la forma, no un dato que haga falta para deducirla.",
    },
    resolution: "La estructura primaria determina las demás: las cadenas laterales interaccionan entre sí —puentes de hidrógeno, fuerzas hidrófobas, puentes disulfuro— y el plegamiento resultante es consecuencia de la secuencia. De ahí la cadena secuencia → plegamiento → función.",
    aside: "Predecirlo en la práctica es otro asunto, y es un problema que costó décadas resolver computacionalmente.",
  },

  "t4-b4": {
    prompt: "Cueces un huevo y la clara se vuelve blanca y sólida. ¿Qué les ha pasado a sus proteínas?",
    options: [
      "Se han roto en aminoácidos",
      "Han perdido su forma pero la cadena sigue entera",
      "Se han convertido en otro tipo de molécula",
    ],
    answer: 1,
    why: {
      0: "Romper la cadena requiere hidrólisis de los enlaces peptídicos, y el calor de la cocina no la produce de forma masiva.",
      2: "Siguen siendo las mismas proteínas: lo que ha cambiado es su plegamiento, no su identidad.",
    },
    resolution: "El calor destruye las interacciones que sostenían la estructura tridimensional: las proteínas se despliegan y se agregan entre sí, y eso es lo que vuelve la clara blanca y firme. Es desnaturalización. Los enlaces peptídicos siguen intactos y la estructura primaria se conserva.",
    aside: "Desnaturalizar cambia la forma; hidrolizar cambia la longitud de la cadena. Cocinar hace lo primero y facilita lo segundo.",
  },

  "t4-b5": {
    prompt: "Una reacción no ocurre espontáneamente. ¿Puede una enzima hacerla ocurrir?",
    options: [
      "Sí: para eso están las enzimas",
      "No: solo acelera reacciones que ya eran favorables",
      "Sí, si se aporta la enzima en cantidad suficiente",
    ],
    answer: 1,
    why: {
      0: "Una enzima acelera el camino, no cambia el destino. No puede volver favorable lo que no lo era.",
      2: "Añadir más enzima acelera más, pero no altera el equilibrio de la reacción.",
    },
    resolution: "Una enzima reduce la energía de activación: ofrece una ruta más fácil hacia el mismo equilibrio, y lo acelera en ambos sentidos por igual. Lo que no hace es aportar energía ni desplazar el equilibrio. Para que una reacción desfavorable avance hay que acoplarla a otra que libere energía, y ahí entra el ATP.",
  },

  "t4-b6": {
    prompt: "¿Hay que combinar legumbre y cereal en la misma comida para cubrir los aminoácidos esenciales?",
    options: [
      "Sí: si no coinciden en el plato, no sirve",
      "No: basta con variar las fuentes a lo largo de la dieta",
      "No hace falta combinar nada: cualquier fuente vegetal es completa",
    ],
    answer: 1,
    why: {
      0: "Es la recomendación clásica de los años setenta y hoy está superada: el organismo mantiene una reserva de aminoácidos que permite integrar aportes a lo largo del día.",
      2: "Sí conviene variar. Las fuentes vegetales tienen aminoácidos limitantes distintos, y la variedad es lo que compensa unas con otras.",
    },
    resolution: "La complementariedad funciona a escala de dieta, no de plato. Combinando fuentes variadas a lo largo del día se cubre el patrón de aminoácidos indispensables sin necesidad de que coincidan en el mismo bocado.",
    aside: "Lo que sí es imprescindible es energía suficiente: sin ella, los aminoácidos se queman en lugar de construir.",
  },

  // ─────────────── TEMA 5 · Ácidos nucleicos ───────────────
  "t5-b1": {
    prompt: "El ATP, ¿qué relación tiene con el ADN?",
    options: [
      "Ninguna: uno es energía y otro información",
      "Comparten arquitectura: el ATP es un nucleótido",
      "El ATP se fabrica a partir del ADN",
    ],
    answer: 1,
    why: {
      0: "Es la intuición razonable, y por eso sorprende: sus funciones no tienen nada que ver, pero su estructura sí.",
      2: "El ADN no es materia prima de nada: guarda información, no se consume para fabricar moléculas.",
    },
    resolution: "El ATP es adenosina trifosfato: base adenina, azúcar ribosa y tres fosfatos. Es decir, un ribonucleótido, la misma arquitectura que las unidades del ARN. Compartir piezas no implica compartir función.",
    aside: "Lo mismo ocurre con NAD⁺, FAD y la coenzima A: todos llevan nucleótido dentro.",
  },

  "t5-b2": {
    prompt: "¿Dónde está el ADN de una célula humana?",
    options: [
      "Solo en el núcleo",
      "En el núcleo y también en las mitocondrias",
      "Repartido por todo el citoplasma",
    ],
    answer: 1,
    why: {
      0: "Es lo que dicen muchos esquemas escolares, y deja fuera un ADN propio que además se hereda solo por vía materna.",
      2: "En las células eucariotas el ADN no está suelto por el citoplasma: eso describiría a una bacteria.",
    },
    resolution: "Además del ADN nuclear organizado en cromosomas, las mitocondrias tienen su propio ADN circular, que codifica parte de la maquinaria de la respiración celular. Se hereda por vía materna, y sus alteraciones producen enfermedades con patrón de herencia peculiar.",
  },

  "t5-b3": {
    prompt: "En la traducción, ¿qué se convierte en proteína?",
    options: [
      "El ADN se transforma físicamente en proteína",
      "Nada se transforma: la información cambia de soporte",
      "El ARN mensajero se consume y pasa a ser la cadena de aminoácidos",
    ],
    answer: 1,
    why: {
      0: "El ADN no se toca durante la traducción: ni siquiera sale del núcleo.",
      2: "El ARN mensajero se lee, no se incorpora. Los aminoácidos los aporta el ARN de transferencia.",
    },
    resolution: "En ningún paso hay transformación material. El ADN se copia a ARN mensajero, el ribosoma lo lee de tres en tres y el ARN de transferencia aporta el aminoácido que corresponde a cada codón. Lo que viaja es información, no materia.",
    aside: "Por eso el mismo ARN mensajero puede traducirse muchas veces: no se gasta al leerlo.",
  },

  "t5-b4": {
    prompt: "Hay 64 codones posibles y solo 20 aminoácidos. ¿Qué pasa con los que sobran?",
    options: [
      "No se usan",
      "Varios codones codifican el mismo aminoácido",
      "Algunos codones codifican dos aminoácidos a la vez",
    ],
    answer: 1,
    why: {
      0: "Prácticamente todos se usan: tres señalan el final de la traducción y el resto codifican aminoácidos.",
      2: "Eso haría el código ambiguo e inservible: cada codón especifica una sola cosa.",
    },
    resolution: "El código es degenerado: varios codones distintos pueden significar el mismo aminoácido, sobre todo variando la tercera base. Eso da tolerancia frente a mutaciones, porque un cambio en esa posición a menudo no altera la proteína resultante.",
  },

  "t5-b5": {
    prompt: "¿Qué hace el NAD⁺ en el metabolismo?",
    options: [
      "Aporta energía directamente, como el ATP",
      "Transporta electrones de unas reacciones a otras",
      "Forma parte del material genético",
    ],
    answer: 1,
    why: {
      0: "El NAD⁺ no transfiere fosfato ni energía directa: lleva electrones, y el ATP se fabrica después gracias a ellos.",
      2: "Contiene un nucleótido en su estructura, pero no forma parte del ADN ni del ARN.",
    },
    resolution: "El NAD⁺ acepta electrones y se convierte en NADH; después los cede en la cadena respiratoria, donde impulsan el bombeo de protones que acaba produciendo ATP. Es un transportador, no una moneda energética.",
    aside: "El NADPH es su primo casi idéntico, pero la célula lo reserva para biosíntesis y defensa antioxidante.",
  },

  // ─────────────── TEMA 6 · Agua y sales minerales ───────────────
  "t6-b1": {
    prompt: "¿El agua del plasma es distinta del agua del interior de una célula?",
    options: [
      "Sí: son tipos de agua con propiedades diferentes",
      "No: el agua es la misma; lo que cambia es lo que lleva disuelto",
      "Sí: el agua intracelular está unida a proteínas y no fluye",
    ],
    answer: 1,
    why: {
      0: "No existen «tipos» de agua en el cuerpo: la molécula es idéntica en todos los compartimentos.",
      2: "Parte del agua sí interacciona con macromoléculas, pero eso no define al compartimento ni la vuelve otra sustancia.",
    },
    resolution: "Compartimento indica localización y composición, no una clase distinta de agua. Lo que separa al plasma del citosol es su contenido de solutos —sodio fuera, potasio dentro— y las membranas que mantienen esa diferencia.",
  },

  "t6-b2": {
    prompt: "Metes una célula en agua destilada. ¿Qué ocurre?",
    options: [
      "Sale agua y se encoge",
      "Entra agua y se hincha",
      "No pasa nada: el agua pura no tiene solutos",
    ],
    answer: 1,
    why: {
      0: "Eso ocurriría en un medio más concentrado que el interior, no en uno más diluido.",
      2: "Justo porque no tiene solutos, la diferencia con el interior es máxima y el agua entra con fuerza.",
    },
    resolution: "El agua se desplaza hacia donde hay mayor concentración efectiva de solutos. El agua destilada es hipotónica respecto al interior celular, así que el agua entra y la célula se hincha, pudiendo llegar a romperse.",
    aside: "Por eso los sueros se preparan isotónicos y no con agua sola.",
  },

  "t6-b3": {
    prompt: "La bomba Na⁺/K⁺ gasta ATP sin parar. ¿Para qué tanto gasto?",
    options: [
      "Para eliminar el sodio sobrante de la dieta",
      "Para mantener un gradiente que después mueve otras cosas sin gasto adicional",
      "Para producir energía a partir del sodio",
    ],
    answer: 1,
    why: {
      0: "Del sodio sobrante se encarga el riñón. La bomba está en todas las células, coman lo que coman.",
      2: "La bomba consume energía, no la produce.",
    },
    resolution: "El gradiente de sodio es energía almacenada. Una vez mantenido, otros transportadores lo aprovechan para meter moléculas a contracorriente sin gastar ATP propio: así entra la glucosa en el enterocito mediante SGLT1. La célula paga una vez y cobra muchas.",
  },

  "t6-b4": {
    prompt: "¿Para qué sirve el calcio en el cuerpo?",
    options: [
      "Sobre todo para dar dureza al hueso",
      "Para el hueso y, además, como señal en músculo y nervio",
      "Solo para la contracción muscular",
    ],
    answer: 1,
    why: {
      0: "Es su papel más visible en masa, pero deja fuera funciones cuya alteración es mucho más urgente clínicamente.",
      2: "La contracción es una de sus funciones señalizadoras, pero no la única, y omite el hueso.",
    },
    resolution: "El calcio es estructural y señalizador a la vez. En el hueso da resistencia; en el citosol actúa como mensajero: dispara la contracción muscular y participa en la transmisión nerviosa y en la coagulación. Por eso su concentración en sangre está regulada de forma muy estrecha y el hueso funciona además como reserva.",
  },

  "t6-b5": {
    prompt: "Dos comidas aportan la misma cantidad de hierro. ¿Absorberás lo mismo de las dos?",
    options: [
      "Sí: la cantidad ingerida determina la absorbida",
      "No: depende de la forma química del hierro y de qué lo acompañe",
      "No: solo depende de si tienes déficit o no",
    ],
    answer: 1,
    why: {
      0: "Ingerir y absorber son cosas distintas, y en el hierro la diferencia puede ser enorme.",
      2: "El estado de hierro sí regula la absorción, pero la forma química y los acompañantes pesan tanto o más.",
    },
    resolution: "El hierro hemo de origen animal se absorbe bastante mejor que el no hemo. Y sobre el no hemo influye mucho la compañía: la vitamina C lo favorece, mientras que fitatos, taninos del té o el café y cantidades altas de calcio en la misma toma lo dificultan.",
    aside: "Cantidad ingerida no equivale a cantidad absorbida. Vale para el hierro, el calcio y el cinc.",
  },

  // ─────────────── TEMA 7 · Vitaminas ───────────────
  "t7-b1": {
    prompt: "Alguien toma dosis muy altas de un complejo vitamínico. ¿Cuáles preocupan más?",
    options: [
      "Las hidrosolubles, porque se absorben más rápido",
      "Las liposolubles, porque se almacenan en el organismo",
      "Ninguna: el exceso siempre se elimina por la orina",
    ],
    answer: 1,
    why: {
      0: "El exceso de hidrosolubles se elimina con relativa facilidad por vía renal, aunque no sea inocuo en todos los casos.",
      2: "Eso solo vale para las hidrosolubles. Las liposolubles se acumulan en hígado y tejido graso.",
    },
    resolution: "A, D, E y K viajan con los lípidos y se almacenan, así que un aporte muy superior a las necesidades puede acumularse hasta niveles tóxicos. Que una vitamina sea esencial no significa que más sea mejor.",
    aside: "La solubilidad predice cómo entra, cómo viaja, dónde se guarda y qué riesgo tiene el exceso.",
  },

  "t7-b2": {
    prompt: "Se dice que las vitaminas del grupo B «dan energía». ¿Es exacto?",
    options: [
      "Sí: aportan calorías de rápida disponibilidad",
      "No: no aportan energía, permiten que las enzimas la extraigan de los nutrientes",
      "Sí: se transforman en ATP",
    ],
    answer: 1,
    why: {
      0: "Las vitaminas no aportan calorías. Solo aportan energía los macronutrientes y el alcohol.",
      2: "Ninguna vitamina se convierte en ATP: forman parte de las coenzimas que participan en su producción.",
    },
    resolution: "Las vitaminas B son piezas de coenzimas: la B1 origina el TPP, la B2 el FAD, la B3 el NAD, la B5 la coenzima A. Sin ellas las rutas que extraen energía se atascan, pero la energía sigue viniendo de los nutrientes, no de la vitamina.",
  },

  "t7-b3": {
    prompt: "Un paciente con anemia megaloblástica mejora al darle folato. ¿Problema resuelto?",
    options: [
      "Sí: la anemia era por falta de folato",
      "No necesariamente: si la causa era la B12, la sangre mejora pero el daño neurológico avanza",
      "Sí, siempre que la mejoría sea rápida",
    ],
    answer: 1,
    why: {
      0: "Puede ser, pero la mejoría hematológica no lo demuestra: el folato corrige la anemia venga de donde venga.",
      2: "La rapidez de la respuesta no distingue una causa de otra.",
    },
    resolution: "Folato y B12 comparten el efecto sobre la hematopoyesis, así que el folato corrige la anemia en ambos casos. Lo que no corrige es la afectación neurológica propia del déficit de B12, que puede seguir progresando mientras el análisis parece normalizarse.",
    aside: "De ahí la regla clínica: identificar la causa antes de tratar, no al revés.",
  },

  "t7-b4": {
    prompt: "El escorbuto produce sangrado de encías y mala cicatrización. ¿Son dos problemas distintos?",
    options: [
      "Sí: son dos cuadros que coinciden en el déficit",
      "No: los dos vienen de un colágeno mal formado",
      "Sí: uno es por falta de hierro y otro por falta de vitamina C",
    ],
    answer: 1,
    why: {
      0: "Es un solo mecanismo bioquímico manifestándose en varios tejidos, no una coincidencia.",
      2: "La vitamina C ayuda a absorber hierro, pero estos signos concretos vienen del colágeno.",
    },
    resolution: "La vitamina C es cofactor de las hidroxilaciones que estabilizan el colágeno. Sin ella el colágeno se forma defectuoso y fallan a la vez todos los tejidos que dependen de él: vasos frágiles, encías que sangran, heridas que no cierran.",
    aside: "Una función bioquímica explica varios signos clínicos que parecían inconexos.",
  },

  "t7-b5": {
    prompt: "¿Qué hace la vitamina K en el momento en que te cortas?",
    options: [
      "Forma el coágulo directamente",
      "Nada en ese momento: su papel fue antes, madurando los factores de coagulación",
      "Cierra la herida contrayendo el vaso",
    ],
    answer: 1,
    why: {
      0: "El coágulo lo forma la red de fibrina, al final de la cascada de coagulación.",
      2: "La vasoconstricción es un mecanismo aparte en el que la vitamina K no interviene.",
    },
    resolution: "La vitamina K es cofactor de una modificación química que vuelve funcionales a ciertos factores de coagulación. Ese trabajo ocurre antes, en el hígado. Cuando te cortas, lo que actúa son esos factores ya maduros.",
    aside: "Los anticoagulantes clásicos actúan interfiriendo justo en ese paso, no en el coágulo.",
  },

  "t7-b6": {
    prompt: "Un libro dice que la ingesta recomendada de vitamina C es 60 mg. ¿Basta con ese dato?",
    options: [
      "Sí: es una cifra concreta y con unidad",
      "No: falta saber para qué población, de qué organismo y de qué año",
      "No: falta convertirla a gramos",
    ],
    answer: 1,
    why: {
      0: "Una cifra sin contexto no es interpretable: no sabes si aplica a un adulto, a una embarazada o a un niño.",
      2: "Las unidades están: el problema no es de conversión, sino de contexto.",
    },
    resolution: "Una recomendación necesita cuatro datos para poder usarse: a qué grupo de población se refiere, en qué unidad, qué organismo la publica y de qué año es. Además hay que saber si es una ingesta recomendada, una ingesta adecuada o un límite superior, porque no significan lo mismo.",
    aside: "Los valores del libro de referencia pueden estar desfasados; conviene contrastarlos con EFSA o AESAN vigentes.",
  },

  // ─────────────── TEMA 8 · Introducción al metabolismo ───────────────
  "t8-b1": {
    prompt: "La β-oxidación degrada ácidos grasos y la lipogénesis los fabrica. ¿Son la misma ruta al revés?",
    options: [
      "Sí: las mismas enzimas funcionando en sentido contrario",
      "No: enzimas distintas, compartimentos distintos y regulación separada",
      "Sí, salvo por el primer paso",
    ],
    answer: 1,
    why: {
      0: "Si lo fueran, activar una activaría la otra y se anularían en un ciclo inútil.",
      2: "La diferencia no está en un paso: son rutas independientes de principio a fin.",
    },
    resolution: "La β-oxidación ocurre en la matriz mitocondrial y produce NADH y FADH₂; la síntesis ocurre en el citosol y consume ATP y NADPH. Al estar separadas, la célula puede activar una y frenar la otra en lugar de tenerlas peleándose.",
    aside: "Por eso existe el malonil-CoA como freno: bloquea la entrada de grasa a la mitocondria mientras se está sintetizando.",
  },

  "t8-b2": {
    prompt: "¿Cuánto ATP tienes almacenado ahora mismo para el resto del día?",
    options: [
      "Suficiente para varias horas",
      "Muy poco: se recicla continuamente entre ATP y ADP",
      "El equivalente a una comida completa",
    ],
    answer: 1,
    why: {
      0: "La reserva total de ATP se agotaría en segundos si no se regenerase sin parar.",
      2: "Lo que almacena el equivalente a comidas es el glucógeno y sobre todo la grasa, no el ATP.",
    },
    resolution: "El ATP es moneda de transferencia inmediata, no almacén. La célula mantiene una reserva pequeñísima y la recicla sin parar: a lo largo de un día se regenera una cantidad comparable al propio peso corporal. Lo que se guarda a largo plazo es glucógeno y triglicéridos.",
  },

  "t8-b3": {
    prompt: "NADH y FADH₂ transportan electrones. ¿Rinden el mismo ATP?",
    options: [
      "Sí: los dos llevan dos electrones",
      "No: los del FAD entran más abajo en la cadena y bombean menos protones",
      "No: el FADH₂ rinde más porque está más reducido",
    ],
    answer: 1,
    why: {
      0: "Ambos llevan dos electrones, cierto, pero lo decisivo es por dónde entran a la cadena respiratoria.",
      2: "Rinde menos, no más, precisamente por dónde entra.",
    },
    resolution: "El NADH cede sus electrones al complejo I, que bombea protones. Los electrones ligados a FAD llegan a la ubiquinona más abajo —por el complejo II en el succinato, o por ETF/ETFDH en la β-oxidación—, saltándose ese punto de bombeo. Menos protones, menos ATP: aproximadamente 2,5 frente a 1,5.",
    aside: "Las cifras antiguas de 3 y 2 ATP están superadas.",
  },

  "t8-b4": {
    prompt: "Glucosa, ácidos grasos y algunos aminoácidos acaban en acetil-CoA. ¿Significa que son intercambiables?",
    options: [
      "Sí: si convergen, dan lo mismo",
      "No: convergen hacia delante, pero desde acetil-CoA no se vuelve a glucosa",
      "Sí, salvo los aminoácidos",
    ],
    answer: 1,
    why: {
      0: "Convergir no es ser equivalentes: el camino de vuelta no siempre existe.",
      2: "Algunos aminoácidos sí pueden dar glucosa; los ácidos grasos de cadena par, no.",
    },
    resolution: "El paso de piruvato a acetil-CoA es irreversible en humanos. Por eso la glucosa puede convertirse en grasa, pero la grasa de cadena par no puede dar glucosa de forma neta. La convergencia metabólica es real y es de sentido único.",
    aside: "De ahí que en ayuno prolongado el cuerpo recurra a aminoácidos y glicerol para fabricar glucosa, y no a los ácidos grasos.",
  },

  "t8-b5": {
    prompt: "Después de comer sube la insulina. ¿Hace lo mismo en todos los tejidos?",
    options: [
      "Sí: es una señal general de almacenamiento",
      "No: cada tejido responde según las enzimas y transportadores que tiene",
      "No: solo actúa sobre el hígado",
    ],
    answer: 1,
    why: {
      0: "La dirección general es esa, pero lo que hace cada tejido con la señal es distinto.",
      2: "Actúa sobre hígado, músculo y tejido adiposo, entre otros.",
    },
    resolution: "La hormona es la misma, pero la respuesta depende del equipamiento de cada célula. El hígado guarda glucógeno y fabrica grasa; el músculo capta glucosa y la guarda para sí; el adipocito almacena triglicéridos y frena la lipólisis. Y el cerebro y el eritrocito captan glucosa al margen de la insulina.",
  },

  // ─────────────── TEMA 9 · Digestión y absorción ───────────────
  "t9-b1": {
    prompt: "La bilis se encarga de las grasas. ¿Qué enlace rompe exactamente?",
    options: [
      "Los enlaces éster del triglicérido",
      "Ninguno: no contiene enzimas, solo emulsiona",
      "Los enlaces entre el glicerol y el fosfato",
    ],
    answer: 1,
    why: {
      0: "Eso lo hace la lipasa pancreática. La bilis prepara el terreno, no corta.",
      2: "La bilis no rompe ningún enlace covalente.",
    },
    resolution: "Las sales biliares son detergentes, no enzimas: dividen las gotas grandes de grasa en gotitas y multiplican la superficie disponible. La hidrólisis la hace después la lipasa pancreática. Emulsionar, hidrolizar y absorber son tres verbos distintos y en ese orden.",
  },

  "t9-b2": {
    prompt: "¿Puede absorberse el almidón sin llegar a digerirse del todo?",
    options: [
      "Sí, si la cadena es corta",
      "No: la absorción exige llegar a monosacáridos",
      "Sí: el enterocito absorbe oligosacáridos y los rompe dentro",
    ],
    answer: 1,
    why: {
      0: "La longitud no es el criterio: ni siquiera un disacárido se absorbe entero.",
      2: "Las enzimas del borde en cepillo actúan en la membrana, del lado de la luz intestinal, no dentro de la célula.",
    },
    resolution: "La digestión del almidón termina obligatoriamente en monosacáridos. Las amilasas lo cortan en oligosacáridos en la luz intestinal y las enzimas del borde en cepillo rematan el trabajo antes del transporte. Solo glucosa, galactosa y fructosa cruzan.",
  },

  "t9-b3": {
    prompt: "¿Por qué el páncreas no se digiere a sí mismo si fabrica proteasas?",
    options: [
      "Porque sus proteínas son resistentes",
      "Porque las secreta apagadas y se activan en el intestino",
      "Porque produce un antídoto al mismo tiempo",
    ],
    answer: 1,
    why: {
      0: "Sus proteínas no tienen nada especial: una tripsina activa las digeriría igual que a las demás.",
      2: "Existen inhibidores de protección, pero el mecanismo principal es otro.",
    },
    resolution: "Las proteasas se secretan como zimógenos, es decir, inactivas. El tripsinógeno se convierte en tripsina ya en el intestino, por acción de la enteropeptidasa, y la tripsina activa entonces al resto en cascada. La activación ocurre donde debe trabajar, no donde se fabrica.",
    aside: "Cuando ese control falla y las enzimas se activan dentro, aparece la pancreatitis.",
  },

  "t9-b4": {
    prompt: "La lipasa actúa sobre un triglicérido. ¿Qué queda al final?",
    options: [
      "Glicerol y tres ácidos grasos libres",
      "Un 2-monoacilglicérido y dos ácidos grasos libres",
      "Colesterol y ácidos grasos",
    ],
    answer: 1,
    why: {
      0: "Es la versión simplificada de muchos libros, y no describe lo que ocurre de verdad.",
      2: "El colesterol no procede de la hidrólisis de un triglicérido: es otra molécula distinta.",
    },
    resolution: "La lipasa pancreática actúa preferentemente sobre las posiciones 1 y 3 del glicerol, dejando intacto el ácido graso de la posición central. El producto principal es un 2-monoacilglicérido más dos ácidos grasos libres, y así se incorporan a las micelas.",
  },

  "t9-b5": {
    prompt: "El SGLT1 mete glucosa en el enterocito contra su gradiente. ¿De dónde saca la energía?",
    options: [
      "Gasta ATP directamente",
      "Del gradiente de sodio que mantiene otra bomba",
      "No necesita energía: la glucosa entra a favor de gradiente",
    ],
    answer: 1,
    why: {
      0: "El transportador no hidroliza ATP: el gasto lo hizo antes la Na⁺/K⁺-ATPasa.",
      2: "Tras una comida la glucosa puede tener que entrar contra gradiente, y entonces sí hace falta energía.",
    },
    resolution: "Es transporte activo secundario: el sodio entra a favor de su gradiente y arrastra consigo la glucosa. Ese gradiente lo mantiene la bomba Na⁺/K⁺ gastando ATP en la membrana basolateral. La energía es de origen ATP, pero llega de forma indirecta.",
    aside: "En eso se basa el suero de rehidratación oral: sodio y glucosa juntos, y el agua sigue a los solutos.",
  },

  "t9-b6": {
    prompt: "Absorbes glucosa y grasa en la misma comida. ¿Van por el mismo camino?",
    options: [
      "Sí: todo pasa a la sangre portal y llega al hígado",
      "No: la glucosa va por la porta y los quilomicrones por la linfa",
      "No: la grasa se queda en el intestino hasta la siguiente comida",
    ],
    answer: 1,
    why: {
      0: "Es lo que uno supondría, y explica mal por qué una comida grasa tarda tanto en aparecer en sangre.",
      2: "La grasa se absorbe en esa misma comida; lo que cambia es la vía por la que viaja.",
    },
    resolution: "Monosacáridos y aminoácidos son hidrosolubles y pasan al capilar portal, llegando al hígado antes que a nadie. Los quilomicrones son demasiado grandes y entran en los vasos linfáticos, alcanzando la sangre general por el conducto torácico. Es decir: la grasa dietética se salta el primer paso hepático.",
  },

  // ─────────────── TEMA 10 · Metabolismo de los hidratos ───────────────
  "t10-b1": {
    prompt: "La glucosa entra en una célula. ¿Qué es lo primero que le ocurre?",
    options: [
      "Se degrada para dar energía",
      "Se le añade un fosfato y queda atrapada dentro",
      "Se une a otras glucosas para formar glucógeno",
    ],
    answer: 1,
    why: {
      0: "La degradación viene después, y solo si la célula necesita energía en ese momento.",
      2: "Almacenarla es una de las salidas posibles, pero antes hay un paso obligatorio para todas.",
    },
    resolution: "Lo primero es la fosforilación a glucosa-6-fosfato. Los transportadores GLUT reconocen glucosa, no glucosa-6-fosfato, así que una vez fosforilada ya no puede salir por donde vino. Y al mantener baja la glucosa libre dentro, la de fuera sigue entrando sola.",
    aside: "Fosforilar no solo retiene: también mantiene abierta la puerta de entrada.",
  },

  "t10-b2": {
    prompt: "La glucólisis produce 4 ATP. ¿Cuántos gana la célula?",
    options: [
      "4: los que produce",
      "2: gasta 2 al principio para invertir",
      "6: 4 más los del NADH",
    ],
    answer: 1,
    why: {
      0: "Se olvida la fase de inversión: hay que gastar antes de ganar.",
      2: "Los NADH rinden ATP después, en la cadena respiratoria, no en la glucólisis.",
    },
    resolution: "La glucólisis tiene dos fases. En la de inversión gasta 2 ATP para activar la glucosa; en la de beneficio produce 4. El balance neto es 2 ATP, más 2 NADH y 2 piruvatos por cada glucosa.",
  },

  "t10-b3": {
    prompt: "Un glóbulo rojo produce lactato aunque viaja lleno de oxígeno. ¿Por qué?",
    options: [
      "Porque el oxígeno que lleva es para otros tejidos, no para él",
      "Porque no tiene mitocondrias y necesita regenerar NAD⁺",
      "Porque el lactato es un residuo que hay que eliminar",
    ],
    answer: 1,
    why: {
      0: "Es cierto que lo transporta para otros, pero podría usarlo si tuviera con qué. El problema es que no tiene mitocondrias.",
      2: "El lactato no es un residuo: otros tejidos lo captan y lo reutilizan como combustible.",
    },
    resolution: "El eritrocito carece de mitocondrias, así que depende por completo de la glucólisis. Para que la glucólisis siga funcionando hace falta NAD⁺, y reducir el piruvato a lactato es justo lo que lo regenera. Producir lactato no indica falta de oxígeno: indica necesidad de reoxidar NADH.",
    aside: "Por eso el ciclo de Cori existe: el lactato viaja al hígado y vuelve convertido en glucosa.",
  },

  "t10-b4": {
    prompt: "El ciclo de Krebs empieza con acetil-CoA y oxalacetato. ¿Qué pasa con el oxalacetato al final?",
    options: [
      "Se consume: por eso hay que reponerlo con la dieta",
      "Se regenera: por eso es un ciclo",
      "Se convierte en acetil-CoA para la siguiente vuelta",
    ],
    answer: 1,
    why: {
      0: "Si se consumiera, el ciclo se pararía en cuanto se agotara. No hace falta reponerlo desde la dieta.",
      2: "El paso de piruvato a acetil-CoA es irreversible, y el oxalacetato no toma ese camino.",
    },
    resolution: "El oxalacetato se regenera en cada vuelta: entra, recibe el acetilo, recorre el ciclo y vuelve a aparecer listo para la siguiente. Por eso una sola molécula puede procesar muchos acetil-CoA. El balance por vuelta es 3 NADH, 1 FADH₂, 1 GTP y 2 CO₂.",
    aside: "Si el oxalacetato escasea —como en ayuno prolongado—, el acetil-CoA se desvía a cuerpos cetónicos.",
  },

  "t10-b5": {
    prompt: "¿Por qué el rendimiento de una glucosa se da como 30–32 ATP y no con una cifra exacta?",
    options: [
      "Porque los libros no se ponen de acuerdo",
      "Porque depende de la lanzadera que usen los NADH del citosol",
      "Porque depende de cuánto oxígeno haya disponible",
    ],
    answer: 1,
    why: {
      0: "El intervalo tiene una razón bioquímica concreta, no editorial.",
      2: "El aceptor final es el mismo en todos los casos; el margen no viene de ahí.",
    },
    resolution: "Los 2 NADH producidos en el citosol durante la glucólisis no cruzan la membrana mitocondrial interna. Sus electrones entran mediante lanzaderas, y según cuál se use llegan como NADH o como electrones ligados a FAD, con rendimientos distintos. De ahí el intervalo.",
    aside: "Las cifras de 36–38 ATP que dan los libros antiguos usaban 3 y 2 ATP por transportador, valores ya superados.",
  },

  "t10-b6": {
    prompt: "En ayuno, el hígado fabrica glucosa. ¿Es la glucólisis funcionando al revés?",
    options: [
      "Sí: las mismas enzimas en sentido contrario",
      "No: tres pasos son irreversibles y hay que rodearlos con otras enzimas",
      "No: la glucosa nueva sale del glucógeno, no se fabrica",
    ],
    answer: 1,
    why: {
      0: "La mayoría de los pasos sí son reversibles, pero tres no lo son, y ahí está la diferencia.",
      2: "El glucógeno se agota en horas. Después el hígado fabrica glucosa de verdad, a partir de otros sustratos.",
    },
    resolution: "La gluconeogénesis comparte muchos pasos con la glucólisis, pero rodea los tres irreversibles con enzimas propias y consumiendo energía. Usa lactato, glicerol y esqueletos de aminoácidos glucogénicos. No es glucólisis invertida, y por eso puede regularse de forma independiente.",
  },

  // ─────────────── TEMA 11 · Metabolismo lipídico ───────────────
  "t11-b1": {
    prompt: "El adipocito libera ácidos grasos a la sangre. ¿Cómo viajan si no se disuelven en agua?",
    options: [
      "Dentro de quilomicrones",
      "Unidos a la albúmina del plasma",
      "Emulsionados por sales biliares",
    ],
    answer: 1,
    why: {
      0: "Los quilomicrones transportan grasa procedente de la dieta desde el intestino, no la que sale del adipocito.",
      2: "Las sales biliares actúan en el intestino, no en la sangre.",
    },
    resolution: "Los ácidos grasos no esterificados viajan unidos a la albúmina, la proteína más abundante del plasma, que les hace de vehículo. El glicerol, en cambio, sí es hidrosoluble y viaja libre, sobre todo hacia el hígado.",
  },

  "t11-b2": {
    prompt: "Un ácido graso de cadena larga tiene que entrar en la mitocondria. ¿Puede pasar directamente?",
    options: [
      "Sí: es pequeño y liposoluble, atraviesa la membrana",
      "No: necesita activarse y usar la lanzadera de carnitina",
      "No: entra solo si hay suficiente oxígeno",
    ],
    answer: 1,
    why: {
      0: "Ser liposoluble no basta: la membrana interna es muy selectiva y no lo deja pasar.",
      2: "El oxígeno hace falta al final de la cadena respiratoria, no para cruzar esta membrana.",
    },
    resolution: "Primero se activa a acil-CoA, con un coste equivalente a 2 ATP. Después, la CPT-I transfiere el grupo acilo a la carnitina, la translocasa lo pasa al interior y la CPT-II regenera el acil-CoA dentro. Lo que cruza es el acilo, no el CoA entero.",
    aside: "Ese punto de entrada es el que bloquea el malonil-CoA cuando la célula está sintetizando grasa.",
  },

  "t11-b3": {
    prompt: "El palmitato tiene 16 carbonos. ¿Cuántos ciclos de β-oxidación hacen falta?",
    options: [
      "8, uno por cada acetil-CoA",
      "7: el último corte libera dos acetil-CoA de golpe",
      "16, uno por carbono",
    ],
    answer: 1,
    why: {
      0: "Se obtienen 8 acetil-CoA, pero no hacen falta 8 cortes: el último produce dos a la vez.",
      2: "Cada ciclo retira dos carbonos, no uno.",
    },
    resolution: "Cada ciclo acorta la cadena en dos carbonos y libera un acetil-CoA, un NADH y un FADH₂. Pero cuando queda una cadena de cuatro carbonos, el corte final la parte en dos acetil-CoA de una vez. De ahí la regla: acetil-CoA = n/2, ciclos = n/2 − 1.",
    aside: "Con los valores actuales, la oxidación completa del palmitato da unos 106 ATP netos.",
  },

  "t11-b4": {
    prompt: "El hígado fabrica cuerpos cetónicos en ayuno. ¿Los usa él mismo?",
    options: [
      "Sí: son su combustible preferente en ayuno",
      "No: le falta la enzima SCOT para poder utilizarlos",
      "Sí, pero solo si escasea la glucosa",
    ],
    answer: 1,
    why: {
      0: "En ayuno el hígado oxida ácidos grasos, no los cuerpos cetónicos que produce.",
      2: "No es cuestión de circunstancias: le falta una enzima concreta y por tanto no puede en ningún caso.",
    },
    resolution: "El hígado tiene la maquinaria para fabricarlos pero carece de SCOT (OXCT1), la enzima necesaria para reactivar el acetoacetato. Los produce para otros: músculo, corazón, riñón y, tras adaptación, el cerebro. Fabrica combustible que no consume.",
    aside: "Muchos libros de FP afirman lo contrario. Es uno de los errores más repetidos del temario.",
  },

  "t11-b5": {
    prompt: "Comes muchos hidratos de carbono. ¿Pueden acabar almacenados como grasa?",
    options: [
      "No: la glucosa y la grasa son rutas separadas",
      "Sí: la glucosa aporta acetil-CoA y glicerol-3-fosfato para fabricar triglicéridos",
      "Solo si además comes grasa en la misma comida",
    ],
    answer: 1,
    why: {
      0: "Están conectadas por el acetil-CoA, que es el cruce metabólico central.",
      2: "No hace falta grasa dietética: el carbono de la glucosa basta para construir ácidos grasos.",
    },
    resolution: "Con energía abundante e insulina alta, el citrato exporta unidades de acetilo al citosol, la acetil-CoA carboxilasa forma malonil-CoA y se sintetizan ácidos grasos usando ATP y NADPH. La propia glucosa aporta además el glicerol-3-fosfato para esterificarlos. El hígado los exporta en VLDL.",
    aside: "El camino inverso no existe: la grasa de cadena par no puede dar glucosa de forma neta.",
  },

  "t11-b6": {
    prompt: "¿De dónde sale la LDL que aparece en un análisis?",
    options: [
      "El hígado la secreta directamente como LDL",
      "Se forma en circulación, cuando una VLDL va perdiendo triglicéridos",
      "Viene de la grasa de la dieta, en los quilomicrones",
    ],
    answer: 1,
    why: {
      0: "El hígado secreta VLDL, no LDL. La LDL aparece después.",
      2: "Los quilomicrones transportan grasa dietética y dejan remanentes, pero no se convierten en LDL.",
    },
    resolution: "El hígado exporta triglicéridos en VLDL. La LPL los va retirando en los tejidos, y la partícula se encoge y se enriquece relativamente en colesterol: pasa por remanente o IDL y acaba como LDL. Las lipoproteínas se remodelan mientras circulan.",
  },

  // ─────────────── TEMA 12 · Metabolismo proteico ───────────────
  "t12-b1": {
    prompt: "Comes más proteína de la que necesitas. ¿Dónde se guarda el exceso?",
    options: [
      "En el músculo, como reserva de aminoácidos",
      "En ningún sitio: no existe un depósito de proteína equivalente al glucógeno",
      "En el hígado, junto al glucógeno",
    ],
    answer: 1,
    why: {
      0: "El músculo es tejido funcional en uso, no un almacén al que se pueda recurrir sin coste.",
      2: "El hígado almacena glucógeno y grasa, pero no mantiene una reserva de proteína como tal.",
    },
    resolution: "No hay almacén proteico dedicado. Existe una reserva metabólica pequeña de aminoácidos libres, y poco más. El exceso se cataboliza: el nitrógeno se elimina como urea y el esqueleto carbonado se oxida o se convierte en glucosa o grasa.",
    aside: "Por eso, cuando falta energía, el cuerpo degrada tejido en uso: no tiene otra cosa que degradar.",
  },

  "t12-b2": {
    prompt: "En una transaminación, ¿se libera amoniaco?",
    options: [
      "Sí: es la forma de quitar el nitrógeno del aminoácido",
      "No: el grupo amino se transfiere a otra molécula sin soltarse",
      "Sí, pero solo en el hígado",
    ],
    answer: 1,
    why: {
      0: "Transferir no es liberar. Eso ocurre en la desaminación, que es otra reacción.",
      2: "La localización no cambia la naturaleza de la reacción.",
    },
    resolution: "La transaminación traslada el grupo amino de un aminoácido a un α-cetoácido, normalmente el α-cetoglutarato, que se convierte en glutamato. El nitrógeno cambia de portador pero no queda libre. Es la desaminación oxidativa del glutamato la que sí libera amonio.",
    aside: "La coenzima de las aminotransferasas es el PLP, derivado de la vitamina B6.",
  },

  "t12-b3": {
    prompt: "¿Qué órgano fabrica la urea?",
    options: [
      "El riñón, que es quien la elimina",
      "El hígado; el riñón solo la excreta",
      "Los dos por igual",
    ],
    answer: 1,
    why: {
      0: "Es la confusión más frecuente del tema: quien la elimina no es quien la fabrica.",
      2: "El ciclo de la urea es hepático; el riñón no lo tiene completo.",
    },
    resolution: "El ciclo de la urea ocurre en el hígado. Allí se combinan dos nitrógenos —uno del amonio vía carbamoil fosfato y otro del aspartato— con carbono procedente del bicarbonato. El riñón se limita a filtrarla y excretarla.",
    aside: "Por eso una insuficiencia hepática grave provoca acumulación de amonio y afectación neurológica.",
  },

  "t12-b4": {
    prompt: "Al catabolizar un aminoácido, ¿qué determina si puede dar glucosa?",
    options: [
      "Si es esencial o no",
      "En qué punto del metabolismo entra su esqueleto carbonado",
      "Su tamaño",
    ],
    answer: 1,
    why: {
      0: "Ser esencial es una etiqueta nutricional y no dice nada sobre el destino de su carbono.",
      2: "El tamaño no interviene: lo decisivo es a qué metabolito da lugar.",
    },
    resolution: "Si el esqueleto entra como piruvato o como intermediario del ciclo de Krebs, puede aportar carbono neto para glucosa: es glucogénico. Si solo produce acetil-CoA o acetoacetato, no puede, porque ese paso es irreversible: es cetogénico. Leucina y lisina son los únicos exclusivamente cetogénicos.",
  },

  "t12-b5": {
    prompt: "Un paciente recibe proteína suficiente pero poca energía. ¿Mejora su balance nitrogenado?",
    options: [
      "Sí: la proteína aportada cubre sus necesidades",
      "No: sin energía suficiente, los aminoácidos se queman en vez de construir",
      "Sí, siempre que la proteína sea de alta calidad",
    ],
    answer: 1,
    why: {
      0: "Aportar proteína no basta si el organismo la desvía a producir energía.",
      2: "La calidad ayuda, pero no resuelve el problema de fondo, que es el déficit energético.",
    },
    resolution: "Cuando falta energía, el organismo usa los aminoácidos como combustible: pierde su nitrógeno y oxida su esqueleto. El balance nitrogenado empeora aunque la ingesta proteica parezca adecuada. Por eso el soporte nutricional cubre primero las necesidades energéticas.",
    aside: "Es el principio del «ahorro proteico»: la energía suficiente protege la proteína corporal.",
  },

};
