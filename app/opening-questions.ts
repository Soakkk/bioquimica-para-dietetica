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
};
