import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readSource(relativePath) {
  const fileName = resolve(root, relativePath);
  const source = readFileSync(fileName, "utf8");
  const ast = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    relativePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  return { ast, source };
}

const page = readSource("app/page.tsx");
const inlinePractice = readSource("app/InlineLessonPractice.tsx");
const bioCourse = readSource("app/BioCourse.tsx");
const bioData = readSource("app/bio-course-data.ts");

function executeDataModule(source) {
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loaded = { exports: {} };
  new Function("exports", "module", compiled)(loaded.exports, loaded);
  return loaded.exports;
}

const { bioThemes } = executeDataModule(bioData.source);

function visit(node, predicate, matches = []) {
  if (predicate(node)) matches.push(node);
  ts.forEachChild(node, (child) => {
    visit(child, predicate, matches);
  });
  return matches;
}

function identifierText(name) {
  return ts.isIdentifier(name) ? name.text : name?.getText();
}

function findVariable(rootNode, name) {
  const declaration = visit(
    rootNode,
    (node) => ts.isVariableDeclaration(node) && identifierText(node.name) === name,
  )[0];
  assert.ok(declaration, `No se encontró la variable ${name}`);
  return declaration;
}

function findFunction(rootNode, name) {
  const declaration = visit(
    rootNode,
    (node) =>
      (ts.isFunctionDeclaration(node) && identifierText(node.name) === name) ||
      (ts.isVariableDeclaration(node) &&
        identifierText(node.name) === name &&
        node.initializer &&
        (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))),
  )[0];
  assert.ok(declaration, `No se encontró la función ${name}`);
  return ts.isVariableDeclaration(declaration) ? declaration.initializer : declaration;
}

function unwrapExpression(node) {
  let current = node;
  while (
    current &&
    (ts.isAsExpression(current) ||
      ts.isParenthesizedExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isTypeAssertionExpression(current))
  ) {
    current = current.expression;
  }
  return current;
}

function callNamed(node, name) {
  return (
    ts.isCallExpression(node) &&
    ((ts.isIdentifier(node.expression) && node.expression.text === name) ||
      (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === name))
  );
}

function propertyValue(object, name) {
  const property = object.properties.find(
    (item) => ts.isPropertyAssignment(item) && identifierText(item.name) === name,
  );
  assert.ok(property && ts.isPropertyAssignment(property), `Falta la propiedad ${name}`);
  return unwrapExpression(property.initializer);
}

function hasAncestor(node, stopAt, predicate) {
  let current = node.parent;
  while (current && current !== stopAt) {
    if (predicate(current)) return true;
    current = current.parent;
  }
  return false;
}

test("el ejercicio inline de CH₄ conserva su globalIndex hasta guardar el resultado del laboratorio", () => {
  const questions = unwrapExpression(findVariable(page.ast, "questions").initializer);
  assert.ok(ts.isArrayLiteralExpression(questions), "questions debe seguir siendo una lista explícita");

  const methaneExerciseIndex = questions.elements.findIndex((element) => {
    if (!ts.isObjectLiteralExpression(element)) return false;
    const formula = propertyValue(element, "formula");
    const options = propertyValue(element, "options");
    return (
      ts.isStringLiteralLike(formula) &&
      formula.text === "CH₄" &&
      ts.isArrayLiteralExpression(options) &&
      options.elements.length === 1
    );
  });
  assert.ok(methaneExerciseIndex >= 0, "Debe existir el reto guiado de CH₄");

  const indexedQuestions = findVariable(page.ast, "indexedQuestions").initializer;
  assert.ok(indexedQuestions, "Las preguntas deben indexarse antes de filtrarlas por lección");
  assert.match(
    indexedQuestions.getText(page.ast),
    /questions\.map\(\(q, i\) => \(\{ \.\.\.q, globalIndex: i \}\)\)/,
    "El índice original debe añadirse antes de crear subconjuntos",
  );

  const lessonQuestions = findVariable(page.ast, "lessonQuestions").initializer;
  assert.match(
    lessonQuestions.getText(page.ast),
    /questionTheory\[q\.globalIndex\]/,
    "El filtro de lección debe consultar el índice global, no la posición filtrada",
  );

  const inlineCheck = findFunction(inlinePractice.ast, "check").getText(inlinePractice.ast);
  assert.match(inlineCheck, /onSolve\(current\.globalIndex\)/);
  assert.match(inlinePractice.source, /onOpenLab\(current\.globalIndex\)/);

  const labCheck = findFunction(page.ast, "checkLab");
  const labCheckText = labCheck.getText(page.ast);
  assert.match(labCheckText, /const returnQuestion = labReturnQuestion/);
  assert.match(labCheckText, /setSolved\(\(v\) => \[\.\.\.v, returnQuestion\]\)/);
  assert.match(labCheckText, /`lab:question:\$\{returnQuestion\}`/);
});

test("el retorno del laboratorio reabre el ejercicio inline exacto y muestra un solo banner", () => {
  const inlineInvocation = visit(
    page.ast,
    (node) =>
      ts.isJsxSelfClosingElement(node) &&
      node.tagName.getText(page.ast) === "InlineLessonPractice",
  )[0];
  assert.ok(inlineInvocation, "La lección debe seguir renderizando la práctica inline");

  const initialIndexAttribute = inlineInvocation.attributes.properties.find(
    (attribute) =>
      ts.isJsxAttribute(attribute) && identifierText(attribute.name) === "initialGlobalIndex",
  );
  assert.ok(
    initialIndexAttribute &&
      ts.isJsxAttribute(initialIndexAttribute) &&
      initialIndexAttribute.initializer &&
      ts.isJsxExpression(initialIndexAttribute.initializer) &&
      initialIndexAttribute.initializer.expression,
    "InlineLessonPractice debe recibir el índice al que hay que volver",
  );
  assert.equal(
    initialIndexAttribute.initializer.expression.getText(page.ast),
    "lessonReturnQuestion",
  );

  const returnedIndex = findVariable(inlinePractice.ast, "returnedIndex").initializer;
  assert.match(
    returnedIndex.getText(inlinePractice.ast),
    /questions\.findIndex\(\(question\) => question\.globalIndex === initialGlobalIndex\)/,
    "El índice de retorno debe localizarse por globalIndex",
  );
  const returnedInitializers = visit(
    inlinePractice.ast,
    (node) =>
      callNamed(node, "useState") &&
      node.arguments[0]?.getText(inlinePractice.ast) ===
        "returnedIndex >= 0 ? returnedIndex : 0",
  );
  assert.equal(returnedInitializers.length, 1, "La práctica debe abrirse en el ejercicio devuelto");

  const startLessonQuestionLab = findFunction(page.ast, "startLessonQuestionLab");
  for (const setter of ["setLabReturnQuestion", "setLessonReturnQuestion"]) {
    const calls = visit(
      startLessonQuestionLab,
      (node) => callNamed(node, setter) && node.arguments[0]?.getText(page.ast) === "globalIndex",
    );
    assert.equal(calls.length, 1, `${setter} debe conservar el mismo globalIndex`);
  }

  const bannerConditional = visit(
    page.ast,
    (node) =>
      ts.isConditionalExpression(node) &&
      node.condition.getText(page.ast) === "labReturnQuestion !== null" &&
      node.getText(page.ast).includes("lab-return-banner"),
  )[0];
  assert.ok(bannerConditional, "El banner de retorno debe depender de la actividad de origen");
  assert.ok(
    ts.isConditionalExpression(bannerConditional.whenFalse),
    "El aviso de módulo debe ser la alternativa del aviso de pregunta",
  );
  assert.equal(
    bannerConditional.whenFalse.condition.getText(page.ast),
    "labReturnModule !== null",
  );
  assert.equal(bannerConditional.whenFalse.whenFalse.kind, ts.SyntaxKind.NullKeyword);

  const isReturnBanner = (node) =>
    ts.isJsxElement(node) &&
    node.openingElement.attributes.properties.some(
      (attribute) =>
        ts.isJsxAttribute(attribute) &&
        identifierText(attribute.name) === "className" &&
        attribute.initializer &&
        ts.isStringLiteral(attribute.initializer) &&
        attribute.initializer.text === "lab-return-banner",
    );
  const allReturnBanners = visit(page.ast, isReturnBanner);
  const exclusiveReturnBanners = visit(bannerConditional, isReturnBanner);
  assert.equal(allReturnBanners.length, 2, "Solo deben existir las dos variantes del mismo aviso");
  assert.equal(
    exclusiveReturnBanners.length,
    allReturnBanners.length,
    "Ambas variantes deben pertenecer a una única rama condicional y no mostrarse a la vez",
  );
});

test("Tema 1 solo se considera completo al reunir sus siete módulos", () => {
  const modules = unwrapExpression(findVariable(page.ast, "modules").initializer);
  assert.ok(ts.isArrayLiteralExpression(modules), "modules debe ser una lista explícita");
  assert.equal(modules.elements.length, 7, "Tema 1 debe conservar sus siete módulos");

  const moduleIds = modules.elements.map((element) => {
    assert.ok(ts.isObjectLiteralExpression(element));
    const id = propertyValue(element, "id");
    assert.ok(ts.isNumericLiteral(id));
    return Number(id.text);
  });
  assert.deepEqual(moduleIds, [0, 1, 2, 3, 4, 5, 6]);

  const carbonThemeDone = findVariable(page.ast, "carbonThemeDone").initializer;
  assert.equal(carbonThemeDone.getText(page.ast), "completed.length === modules.length");

  const markModule = findFunction(page.ast, "markModule");
  const completionCalls = visit(markModule, (node) => callNamed(node, "setCompletedThemes"));
  assert.equal(completionCalls.length, 1, "Tema 1 debe registrarse como completado en un único punto controlado");
  assert.ok(
    hasAncestor(
      completionCalls[0],
      markModule,
      (node) => ts.isIfStatement(node) && /nextCompleted\.size === modules\.length/.test(node.expression.getText(page.ast)),
    ),
    "El registro de Tema 1 debe estar protegido por la comprobación de los siete módulos",
  );
});

test("la migración elimina Tema 1 global cuando el progreso local no tiene siete módulos", () => {
  const carbonCompleted = findVariable(page.ast, "carbonCompleted").initializer;
  assert.match(
    carbonCompleted.getText(page.ast),
    /numberList\(carbonData\.completed, modules\.length - 1\)/,
    "La migración debe validar los identificadores contra los módulos vigentes",
  );

  const migrationCall = visit(
    page.ast,
    (node) =>
      callNamed(node, "setCompletedThemes") &&
      node.arguments[0]?.getText(page.ast).includes("savedThemes.filter"),
  )[0];
  assert.ok(migrationCall, "Debe existir una migración del progreso global de Tema 1");

  const migrate = new Function(
    "savedThemes",
    "carbonCompleted",
    "modules",
    `return ${migrationCall.arguments[0].getText(page.ast)};`,
  );
  const modules = Array.from({ length: 7 }, (_, id) => ({ id }));

  assert.deepEqual(
    migrate([1, 2, 7], [0, 1, 2, 3, 4, 5], modules),
    [2, 7],
    "Un progreso antiguo de seis módulos no puede mantener Tema 1 como completado",
  );
  assert.deepEqual(
    migrate([1, 2, 7], [0, 1, 2, 3, 4, 5, 6], modules),
    [1, 2, 7],
    "Tema 1 debe conservarse cuando están los siete módulos",
  );
});

test("el temario conserva los doce temas y práctica evaluable en cada uno", () => {
  assert.equal(bioThemes.length, 12);
  assert.deepEqual(bioThemes.map((theme) => theme.number), Array.from({ length: 12 }, (_, index) => index + 1));
  for (const theme of bioThemes) {
    assert.ok(theme.blocks.length >= 5, `Tema ${theme.number} necesita al menos cinco bloques de teoría`);
    assert.equal(theme.questions.length, 5, `Tema ${theme.number} necesita cinco preguntas`);
    assert.ok(theme.dieteticsCase.prompt && theme.dieteticsCase.explanation, `Tema ${theme.number} necesita caso de Dietética`);
  }
});

test("apostar en la cuestión de apertura no revela el veredicto", () => {
  // El mecanismo entero depende de esta espera: si al elegir opción se dijera
  // ya si es correcta, se lee en piloto automático en vez de leer buscando.
  const { source } = readSource("app/Chapter.tsx");

  const rightClass = source.match(/is-right[\s\S]{0,40}?:/);
  assert.ok(rightClass, "Debe existir la clase que marca la opción correcta");

  for (const marker of ["is-right", "is-wrong"]) {
    const index = source.indexOf(marker);
    const around = source.slice(Math.max(0, index - 220), index);
    assert.ok(
      around.includes("revealed"),
      `La clase ${marker} debe estar condicionada a haber destapado la resolución`,
    );
  }

  const betHandler = source.slice(source.indexOf("onClick={() => setBet("), source.indexOf("onClick={() => setBet(") + 120);
  assert.equal(
    /setRevealed\s*\(\s*true/.test(betHandler),
    false,
    "Elegir una opción no debe destapar la resolución",
  );
});

test("cada cuestión de apertura es coherente y explica los distractores", () => {
  const opening = executeDataModule(readSource("app/opening-questions.ts").source);
  const entries = Object.entries(opening.openingQuestions);

  assert.ok(entries.length > 0, "Debe haber cuestiones de apertura escritas");

  const blockIds = new Set(bioThemes.flatMap((theme) => theme.blocks.map((block) => block.id)));

  for (const [blockId, question] of entries) {
    assert.ok(blockIds.has(blockId), `${blockId} no corresponde a ningún bloque del temario`);
    assert.ok(
      question.answer >= 0 && question.answer < question.options.length,
      `${blockId}: el índice de la respuesta correcta se sale de las opciones`,
    );
    assert.ok(question.resolution.length > 40, `${blockId}: la resolución debe explicar, no sentenciar`);

    question.options.forEach((_option, index) => {
      if (index === question.answer) return;
      assert.ok(
        question.why[index],
        `${blockId}: falta explicar por qué falla la opción ${index}`,
      );
    });
  }
});

const { blockSections } = executeDataModule(readSource("app/bio-course-sections.ts").source);

test("cada bloque del temario tiene teoría expandida y ninguna clave sobra", () => {
  const blockIds = bioThemes.flatMap((theme) => theme.blocks.map((block) => block.id));
  const written = Object.keys(blockSections);

  const missing = blockIds.filter((id) => !blockSections[id]?.length);
  assert.deepEqual(missing, [], "Todos los bloques deben tener secciones escritas");

  const orphan = written.filter((id) => !blockIds.includes(id));
  assert.deepEqual(orphan, [], "No debe haber secciones huérfanas apuntando a bloques inexistentes");
});

test("la teoría expandida explica, no resume: cada bloque supera sus frases originales", () => {
  for (const theme of bioThemes) {
    for (const block of theme.blocks) {
      const sections = blockSections[block.id];
      const paragraphs = sections.flatMap((section) => section.paragraphs);

      assert.ok(
        paragraphs.length > block.theory.length,
        `${block.id} debe tener más párrafos que las frases telegráficas originales`,
      );
      for (const section of sections) {
        assert.ok(section.heading?.trim().length > 0, `${block.id} tiene una sección sin encabezado`);
        assert.ok(section.paragraphs.length > 0, `${block.id} tiene una sección vacía`);
      }
    }
  }
});

test("el temario ya no impone calendario", () => {
  assert.equal(
    /studySchedule|ScheduleDay/.test(bioData.source),
    false,
    "El plan por semanas debe estar eliminado del modelo de datos",
  );
  assert.equal(
    /WeekCard|studySchedule/.test(bioCourse.source),
    false,
    "El panel no debe volver a renderizar tarjetas de semana",
  );
});

test("las dos vistas de lectura salen de la misma fuente de secciones", () => {
  const reader = readSource("app/LessonReader.tsx");

  for (const component of ["ContinuousReader", "StepReader"]) {
    assert.ok(findFunction(reader.ast, component), `Debe existir ${component}`);
  }

  const buildSteps = findFunction(reader.ast, "buildSteps");
  assert.ok(
    visit(buildSteps, (node) => callNamed(node, "sectionsFor")).length > 0,
    "El modo paso a paso debe construirse desde las mismas secciones, no desde un contenido paralelo",
  );

  const continuous = findFunction(reader.ast, "ContinuousReader");
  assert.ok(
    visit(continuous, (node) => callNamed(node, "sectionsFor")).length > 0,
    "La lectura continua debe leer las mismas secciones",
  );
});

const srs = executeDataModule(readSource("app/spaced-repetition.ts").source);
const bank = executeDataModule(readSource("app/bio-question-bank.ts").source);

test("fallar una pregunta la devuelve al día siguiente y baja la facilidad", () => {
  const card = srs.newCard("2026-08-15");
  const after = srs.review(card, "fallo", "2026-08-15");

  assert.equal(after.due, "2026-08-16", "Lo fallado vuelve mañana");
  assert.equal(after.streak, 0, "La racha se reinicia");
  assert.equal(after.lapses, 1);
  assert.ok(after.ease < card.ease, "Fallar debe reducir el factor de facilidad");
});

test("acertar repetidamente espacia los repasos cada vez más", () => {
  let card = srs.newCard("2026-08-15");
  const intervals = [];
  let day = "2026-08-15";

  for (let i = 0; i < 4; i += 1) {
    card = srs.review(card, "bien", day);
    intervals.push(card.interval);
    day = card.due;
  }

  for (let i = 1; i < intervals.length; i += 1) {
    assert.ok(
      intervals[i] > intervals[i - 1],
      `El intervalo debe crecer: ${intervals[i - 1]} -> ${intervals[i]}`,
    );
  }
});

test("la facilidad nunca cae por debajo del mínimo por muchos fallos que haya", () => {
  let card = srs.newCard("2026-08-15");
  for (let i = 0; i < 30; i += 1) card = srs.review(card, "fallo", "2026-08-15");
  assert.ok(card.ease >= 1.3, "El factor de facilidad tiene suelo");
  assert.equal(card.interval, 1, "Un fallo siempre devuelve la tarjeta a un día");
});

test("la cola prioriza lo más fallado y excluye lo que aún no toca", () => {
  const schedule = {
    facil: { interval: 10, ease: 2.5, streak: 3, due: "2026-09-01", seen: 3, lapses: 0 },
    dificil: { interval: 1, ease: 1.4, streak: 0, due: "2026-08-15", seen: 6, lapses: 4 },
    media: { interval: 2, ease: 2.2, streak: 1, due: "2026-08-15", seen: 2, lapses: 1 },
  };
  const queue = srs.dueQueue(["facil", "dificil", "media", "nueva"], schedule, "2026-08-15");

  assert.equal(queue.includes("facil"), false, "Lo programado para más adelante no aparece hoy");
  assert.equal(queue[0], "dificil", "Lo más fallado va primero");
  assert.ok(queue.includes("nueva"), "Una pregunta nunca vista entra en la cola");
});

test("el banco ampliado explica por qué falla cada distractor", () => {
  const conOpciones = bank.questionBank.filter((question) => Array.isArray(question.options));
  assert.ok(conOpciones.length > 60, "El banco debe aportar un volumen real de preguntas");

  for (const question of conOpciones) {
    const correctas = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];

    for (const correcta of correctas) {
      assert.ok(
        question.options.includes(correcta),
        `${question.id}: la respuesta correcta debe estar entre las opciones`,
      );
    }

    const distractores = question.options.filter((option) => !correctas.includes(option));
    for (const distractor of distractores) {
      assert.ok(
        question.optionNotes?.[distractor],
        `${question.id}: falta explicar por qué "${distractor}" no es correcta`,
      );
    }
  }
});

test("cada pregunta del banco apunta a un tema que existe y tiene id único", () => {
  const themeIds = new Set(bioThemes.map((theme) => theme.id));
  const seen = new Set();

  for (const question of bank.questionBank) {
    assert.ok(themeIds.has(question.themeId), `${question.id} apunta a un tema inexistente`);
    assert.equal(seen.has(question.id), false, `id duplicado: ${question.id}`);
    seen.add(question.id);
  }
});

const place = executeDataModule(readSource("app/reading-place.ts").source);

test("el bloque en curso es el último cuyo comienzo ya has pasado", () => {
  // Cuatro bloques altos, como los reales del curso.
  const tops = [0, 6000, 12000, 18000];
  const vh = 900; // la línea de corte cae 270 px por debajo del scroll

  assert.equal(place.blockIndexAt(tops, 0, vh), 0, "Arriba del todo, primer bloque");
  assert.equal(place.blockIndexAt(tops, 3000, vh), 0, "A medio primer bloque sigue siendo el primero");
  assert.equal(place.blockIndexAt(tops, 5800, vh), 1, "El segundo empieza al cruzar la línea, no al asomar");
  assert.equal(place.blockIndexAt(tops, 17800, vh), 3, "Último bloque");
  assert.equal(place.blockIndexAt(tops, 99999, vh), 3, "Más allá del final no se sale del rango");
});

test("la posición de lectura nunca devuelve un índice fuera de los bloques", () => {
  assert.equal(place.blockIndexAt([], 500, 900), 0, "Sin bloques, índice neutro");
  assert.equal(place.blockIndexAt([0], -500, 900), 0, "Scroll negativo no rompe el cálculo");
});

test("los ejercicios rescatados del Tema 1 vuelven al circuito de repaso", () => {
  const legacy = executeDataModule(readSource("app/bio-question-bank-legacy.ts").source);
  const rescatadas = legacy.legacyTema1Questions;

  assert.ok(rescatadas.length > 50, "Deben seguir rescatadas las preguntas de la guía antigua");

  for (const question of rescatadas) {
    assert.equal(question.themeId, "tema-1-carbono", `${question.id} debe apuntar al capítulo 1`);
    assert.ok(
      question.options.includes(question.correctAnswer),
      `${question.id}: la respuesta correcta debe estar entre las opciones`,
    );
    assert.ok(question.explanation.length > 20, `${question.id} necesita explicación`);
  }

  // Y siguen sin explicación por opción: es deuda conocida, no un descuido.
  const conNotas = rescatadas.filter((question) => question.optionNotes).length;
  assert.equal(
    conNotas,
    0,
    "Si ya llevan notas por opción, muévelas al banco curado y quita esta excepción",
  );
});
