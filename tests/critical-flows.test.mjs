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

test("comprobar una respuesta correcta del quiz no cambia de pregunta automáticamente", () => {
  const themeQuiz = findFunction(bioCourse.ast, "ThemeQuiz");
  const checkAnswer = findFunction(themeQuiz, "checkAnswer");

  assert.equal(
    visit(checkAnswer, (node) => callNamed(node, "setCurrentIndex")).length,
    0,
    "Comprobar no debe modificar el índice actual",
  );
  assert.equal(
    visit(checkAnswer, (node) => callNamed(node, "setTimeout") || callNamed(node, "queueMicrotask")).length,
    0,
    "Comprobar no debe programar un avance diferido",
  );

  const automaticEffects = visit(themeQuiz, (node) => callNamed(node, "useEffect")).filter(
    (effect) => visit(effect, (node) => callNamed(node, "setCurrentIndex")).length > 0,
  );
  assert.equal(automaticEffects.length, 0, "El quiz no debe avanzar mediante un efecto reactivo");

  const manualNextButtons = visit(
    themeQuiz,
    (node) =>
      ts.isJsxElement(node) &&
      node.openingElement.tagName.getText(bioCourse.ast) === "button" &&
      /Siguiente pregunta/.test(node.getText(bioCourse.ast)) &&
      visit(node, (child) => callNamed(child, "setCurrentIndex")).length === 1,
  );
  assert.equal(manualNextButtons.length, 1, "Tras acertar debe aparecer un único avance manual");
});
