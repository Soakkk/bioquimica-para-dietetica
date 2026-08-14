"use client";

import { useEffect, useMemo, useState } from "react";
import {
  bioThemes,
  courseSources,
  integrationRoutes,
  type CoursePriority,
  type CourseQuestion,
  type CourseTheme,
  type IntegrationRoute,
} from "./bio-course-data";
import LessonReader, { ModeToggle, readStoredMode, type ReadingMode } from "./LessonReader";
import ProgressBackup from "./ProgressBackup";

type BioCourseProps = {
  completedThemes: number[];
  scores: Record<number, number>;
  onComplete: (themeId: number, score: number) => void;
  onEarn: (n: number, awardId?: string) => void;
  onOpenCarbon: () => void;
  onOpenLab: () => void;
  onOpenReview: () => void;
};

type AnswerMap = Record<string, string[]>;
type BooleanMap = Record<string, boolean>;

const priorityCopy: Record<CoursePriority, { label: string; detail: string }> = {
  imprescindible: { label: "Imprescindible", detail: "Debes dominarlo" },
  examen: { label: "Tema y examen", detail: "Comprender y reconocer" },
  ampliacion: { label: "Ampliación", detail: "Útil para profundizar" },
};

function themeFromId(id: string): CourseTheme | undefined {
  return bioThemes.find((theme) => theme.id === id);
}

function normalizeAnswer(value: string): string {
  const subscripts: Record<string, string> = {
    "₀": "0",
    "₁": "1",
    "₂": "2",
    "₃": "3",
    "₄": "4",
    "₅": "5",
    "₆": "6",
    "₇": "7",
    "₈": "8",
    "₉": "9",
  };

  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[₀-₉]/g, (character) => subscripts[character] ?? character)
    .toLocaleLowerCase("es")
    .replace(/[—–−]/g, "-")
    .replace(/[\s.,;:()]/g, "")
    .trim();
}

function answerIsCorrect(question: CourseQuestion, answer: string[]): boolean {
  const expected = Array.isArray(question.correctAnswer)
    ? question.correctAnswer
    : [question.correctAnswer];
  const normalizedAnswer = answer.map(normalizeAnswer);
  const normalizedExpected = expected.map(normalizeAnswer);

  if (question.type === "multi-select") {
    return (
      [...normalizedAnswer].sort().join("|") ===
      [...normalizedExpected].sort().join("|")
    );
  }

  return normalizedAnswer.join("|") === normalizedExpected.join("|");
}

function displayAnswer(answer: CourseQuestion["correctAnswer"]): string {
  return Array.isArray(answer) ? answer.join(" · ") : answer;
}

function firstUnfinishedTheme(completedThemes: number[]): CourseTheme | undefined {
  return bioThemes.find((theme) => !completedThemes.includes(theme.number));
}

function PriorityBadge({ priority }: { priority: CoursePriority }) {
  const copy = priorityCopy[priority];
  return (
    <span className={`bio-priority bio-priority--${priority}`} title={copy.detail}>
      <span className="bio-priority__dot" aria-hidden="true" />
      {copy.label}
    </span>
  );
}

function IntegrationCard({
  route,
  onOpenTheme,
}: {
  route: IntegrationRoute;
  onOpenTheme: (number: number) => void;
}) {
  const firstTheme = route.themeIds.map(themeFromId).find(Boolean);
  return (
    <article className="bio-integration-card">
      <p className="bio-kicker">Ruta de integración</p>
      <h3>{route.title}</h3>
      <p>{route.description}</p>
      <div className="bio-integration-card__flow" aria-label={`Hitos de ${route.title}`}>
        {route.milestones.slice(0, 5).map((milestone, index) => (
          <span key={milestone}>
            <b>{index + 1}</b>
            {milestone}
          </span>
        ))}
      </div>
      <p className="bio-integration-card__challenge">
        <strong>Reto final:</strong> {route.finalChallenge}
      </p>
      {firstTheme ? (
        <button className="bio-text-button" onClick={() => onOpenTheme(firstTheme.number)} type="button">
          Empezar por el primer tema →
        </button>
      ) : null}
    </article>
  );
}

function CourseDashboard({
  completedThemes,
  scores,
  onOpenTheme,
  onOpenLab,
  onOpenReview,
}: {
  completedThemes: number[];
  scores: Record<number, number>;
  onOpenTheme: (number: number) => void;
  onOpenLab: () => void;
  onOpenReview: () => void;
}) {
  const nextTheme = firstUnfinishedTheme(completedThemes);
  const requiredThemes = bioThemes.filter((theme) => theme.number <= 12);
  const completedRequired = requiredThemes.filter((theme) => completedThemes.includes(theme.number)).length;
  const overallProgress = Math.round((completedRequired / requiredThemes.length) * 100);
  const weakAreas = Object.entries(scores)
    .map(([number, score]) => ({ theme: bioThemes.find((item) => item.number === Number(number)), score }))
    .filter((item): item is { theme: CourseTheme; score: number } => Boolean(item.theme) && item.score < 80)
    .sort((a, b) => a.score - b.score)
    .slice(0, 4);

  return (
    <main className="bio-course bio-course--dashboard">
      <section className="bio-dashboard-hero">
        <div className="bio-dashboard-hero__copy">
          <p className="bio-kicker">BIOQUÍMICA PARA DIETÉTICA</p>
          <h1>Mi temario</h1>
          <p className="bio-dashboard-hero__lead">
            Los doce temas con la teoría explicada, ejemplos resueltos y preguntas para comprobar que
            se ha quedado. Sin calendario: avanzas cuando puedes y la app recuerda por dónde ibas.
          </p>
          <div className="bio-dashboard-hero__actions">
            <button
              className="bio-button bio-button--primary"
              onClick={nextTheme ? () => onOpenTheme(nextTheme.number) : onOpenReview}
              type="button"
            >
              {nextTheme ? `Continuar con Tema ${nextTheme.number} →` : "Ruta principal completada · repasar →"}
            </button>
            {nextTheme ? (
              <button className="bio-button bio-button--secondary" onClick={onOpenReview} type="button">
                Abrir repaso adaptativo
              </button>
            ) : null}
            <button className="bio-button bio-button--ghost" onClick={onOpenLab} type="button">
              Ir al laboratorio
            </button>
          </div>
        </div>

        <aside className="bio-dashboard-hero__progress" aria-label="Progreso general del curso">
          <div className="bio-progress-ring" style={{ "--bio-progress": `${overallProgress * 3.6}deg` } as React.CSSProperties}>
            <span>{overallProgress}%</span>
          </div>
          <div>
            <strong>{completedRequired} de {requiredThemes.length} temas</strong>
            <p>{nextTheme ? `Siguiente: ${nextTheme.title}` : "Ruta principal completada"}</p>
          </div>
        </aside>
      </section>

      <section className="bio-dashboard-section" aria-labelledby="bio-weeks-title">
        <div className="bio-section-heading">
          <div>
            <p className="bio-kicker">EL TEMARIO</p>
            <h2 id="bio-weeks-title">Doce temas, y tú decides el ritmo</h2>
          </div>
          <p>Están en orden de dependencia: cada uno se apoya en los anteriores. Puedes ir seguido o saltar al que necesites.</p>
        </div>
        <ol className="bio-theme-list">
          {bioThemes.map((theme) => {
            const done = completedThemes.includes(theme.number);
            const score = scores[theme.number];
            return (
              <li key={theme.id}>
                <button
                  className={`bio-theme-row${done ? " bio-theme-row--done" : ""}`}
                  onClick={() => onOpenTheme(theme.number)}
                  type="button"
                >
                  <span className="bio-theme-row__n" aria-hidden="true">
                    {done ? "✓" : String(theme.number).padStart(2, "0")}
                  </span>
                  <span className="bio-theme-row__text">
                    <strong>{theme.title}</strong>
                    <small>{theme.eyebrow}</small>
                  </span>
                  <span className="bio-theme-row__meta">
                    {typeof score === "number" ? <b>{score}%</b> : null}
                    <em>{theme.blocks.length} bloques</em>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="bio-dashboard-section bio-dashboard-section--split" aria-labelledby="bio-reinforce-title">
        <div className="bio-reinforce-panel">
          <p className="bio-kicker">REPASO ADAPTATIVO</p>
          <h2 id="bio-reinforce-title">Lo que conviene reforzar ahora</h2>
          {weakAreas.length ? (
            <div className="bio-weak-list">
              {weakAreas.map(({ theme, score }) => (
                <button key={theme.id} onClick={() => onOpenTheme(theme.number)} type="button">
                  <span>Tema {theme.number}</span>
                  <strong>{theme.title}</strong>
                  <b>{score}%</b>
                </button>
              ))}
            </div>
          ) : (
            <div className="bio-empty-state">
              <span aria-hidden="true">◎</span>
              <p>Cuando hagas una prueba, aquí aparecerán automáticamente los temas por debajo del 80%.</p>
            </div>
          )}
          <button className="bio-button bio-button--secondary" onClick={onOpenReview} type="button">
            Entrenar mis fallos →
          </button>
        </div>

        <div className="bio-tool-panel">
          <p className="bio-kicker">DOS ESPACIOS, DOS OBJETIVOS</p>
          <h2>Practica con intención</h2>
          <div className="bio-tool-panel__cards">
            <button onClick={onOpenLab} type="button">
              <span aria-hidden="true">⌁</span>
              <strong>Laboratorio molecular</strong>
              <p>Construye, enlaza y comprueba estructuras.</p>
            </button>
            <button onClick={onOpenReview} type="button">
              <span aria-hidden="true">↻</span>
              <strong>Repaso acumulativo</strong>
              <p>Mezcla contenidos ya estudiados y recupera lo débil.</p>
            </button>
          </div>
        </div>
      </section>

      <section className="bio-dashboard-section" aria-labelledby="bio-routes-title">
        <div className="bio-section-heading">
          <div>
            <p className="bio-kicker">TRANSFERENCIA REAL</p>
            <h2 id="bio-routes-title">Rutas que conectan los temas</h2>
          </div>
          <p>Úsalas al final de cada semana para explicar procesos completos, no definiciones aisladas.</p>
        </div>
        <div className="bio-integration-grid">
          {integrationRoutes.map((route) => (
            <IntegrationCard key={route.id} onOpenTheme={onOpenTheme} route={route} />
          ))}
        </div>
      </section>

      <ProgressBackup />

      <section className="bio-sources" aria-labelledby="bio-sources-title">
        <details>
          <summary id="bio-sources-title">Fuentes y criterios de actualización</summary>
          <div className="bio-sources__grid">
            {courseSources.map((source) => (
              <article key={source.id}>
                <strong>{source.label}</strong>
                <p>{source.role}</p>
                {source.url ? (
                  <a href={source.url} rel="noreferrer" target="_blank">
                    Consultar fuente ↗
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </details>
      </section>
    </main>
  );
}

function RecallCards({
  theme,
  revealed,
  onToggle,
}: {
  theme: CourseTheme;
  revealed: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <section className="bio-lesson-section" aria-labelledby="bio-recall-title">
      <div className="bio-section-heading bio-section-heading--lesson">
        <div>
          <p className="bio-kicker">RECUERDO ACTIVO</p>
          <h2 id="bio-recall-title">Intenta responder antes de revelar</h2>
        </div>
        <p>Estas tarjetas recuperan las ideas que necesitarás en el quiz.</p>
      </div>
      <div className="bio-recall-grid">
        {theme.blocks.map((block, index) => {
          const isOpen = revealed.includes(block.id);
          return (
            <button
              aria-expanded={isOpen}
              className={`bio-recall-card${isOpen ? " bio-recall-card--open" : ""}`}
              key={block.id}
              onClick={() => onToggle(block.id)}
              type="button"
            >
              <span className="bio-recall-card__number">{String(index + 1).padStart(2, "0")}</span>
              <strong>¿Cuál es la idea central de «{block.title}»?</strong>
              <span className="bio-recall-card__action">{isOpen ? "Ocultar respuesta" : "Revelar respuesta"}</span>
              {isOpen ? <p>{block.keyIdea}</p> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function QuestionAnswer({
  question,
  answer,
  locked,
  onChange,
}: {
  question: CourseQuestion;
  answer: string[];
  locked: boolean;
  onChange: (value: string[]) => void;
}) {
  if (question.type === "choice") {
    return (
      <div className="bio-answer-options" role="radiogroup" aria-label="Opciones de respuesta">
        {(question.options ?? []).map((option, index) => {
          const selected = answer[0] === option;
          const options = question.options ?? [];
          return (
            <button
              aria-checked={selected}
              className={`bio-answer-option${selected ? " bio-answer-option--selected" : ""}`}
              disabled={locked}
              key={option}
              onClick={() => onChange([option])}
              onKeyDown={(event) => {
                const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
                const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
                if (!forward && !backward && event.key !== "Home" && event.key !== "End") return;
                event.preventDefault();
                const nextIndex = event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? options.length - 1
                    : (index + (forward ? 1 : -1) + options.length) % options.length;
                onChange([options[nextIndex]]);
                (event.currentTarget.parentElement?.children[nextIndex] as HTMLElement | undefined)?.focus();
              }}
              role="radio"
              tabIndex={selected || (!answer.length && index === 0) ? 0 : -1}
              type="button"
            >
              <span>{String.fromCharCode(65 + index)}</span>
              {option}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "multi-select") {
    return (
      <div className="bio-answer-options" aria-label="Selecciona todas las respuestas correctas">
        {(question.options ?? []).map((option) => {
          const selected = answer.includes(option);
          return (
            <button
              aria-pressed={selected}
              className={`bio-answer-option${selected ? " bio-answer-option--selected" : ""}`}
              disabled={locked}
              key={option}
              onClick={() => onChange(selected ? answer.filter((item) => item !== option) : [...answer, option])}
              type="button"
            >
              <span>{selected ? "✓" : "□"}</span>
              {option}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "order") {
    return (
      <div className="bio-order-answer">
        <p>Selecciona las piezas en el orden correcto:</p>
        <div className="bio-order-answer__options">
          {(question.options ?? []).map((option) => {
            const position = answer.indexOf(option);
            return (
              <button
                aria-pressed={position >= 0}
                disabled={locked}
                key={option}
                onClick={() => onChange(position >= 0 ? answer.filter((item) => item !== option) : [...answer, option])}
                type="button"
              >
                {position >= 0 ? <b>{position + 1}</b> : <b>+</b>}
                {option}
              </button>
            );
          })}
        </div>
        {answer.length ? (
          <button className="bio-text-button" disabled={locked} onClick={() => onChange([])} type="button">
            Borrar orden
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <label className="bio-short-answer">
      <span>{question.type === "case" ? "Escribe tu razonamiento" : "Tu respuesta"}</span>
      {question.type === "case" ? (
        <textarea
          disabled={locked}
          onChange={(event) => onChange([event.target.value])}
          placeholder="Explícalo con tus palabras…"
          value={answer[0] ?? ""}
        />
      ) : (
        <input
          disabled={locked}
          onChange={(event) => onChange([event.target.value])}
          placeholder="Escribe aquí…"
          type="text"
          value={answer[0] ?? ""}
        />
      )}
    </label>
  );
}

function ThemeQuiz({
  theme,
  onComplete,
  onEarn,
  onContinue,
  rewardsEnabled,
}: {
  theme: CourseTheme;
  onComplete: (score: number) => void;
  onEarn: (n: number, awardId?: string) => void;
  onContinue: () => void;
  rewardsEnabled: boolean;
}) {
  const questions = theme.questions.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [checked, setChecked] = useState<BooleanMap>({});
  const [correct, setCorrect] = useState<BooleanMap>({});
  const [hints, setHints] = useState<BooleanMap>({});
  const [earned, setEarned] = useState<BooleanMap>({});
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const question = questions[currentIndex];

  if (!question) return null;

  const answer = answers[question.id] ?? [];
  const wasChecked = Boolean(checked[question.id]);
  const isCorrect = Boolean(correct[question.id]);
  const attemptedCount = questions.filter((item) => checked[item.id]).length;
  const correctCount = questions.filter((item) => correct[item.id]).length;
  const score = Math.round((correctCount / Math.max(questions.length, 1)) * 100);

  const updateAnswer = (value: string[]) => {
    if (isCorrect) return;
    setAnswers((previous) => ({ ...previous, [question.id]: value }));
    if (wasChecked) {
      setChecked((previous) => ({ ...previous, [question.id]: false }));
      setCorrect((previous) => ({ ...previous, [question.id]: false }));
    }
    setSubmittedScore(null);
  };

  const checkAnswer = () => {
    if (!answer.length || (answer.length === 1 && !answer[0].trim())) return;
    const result = answerIsCorrect(question, answer);
    setChecked((previous) => ({ ...previous, [question.id]: true }));
    setCorrect((previous) => ({ ...previous, [question.id]: result }));
    if (result && rewardsEnabled && !earned[question.id]) {
      onEarn(5, `quiz:${theme.id}:${question.id}`);
      setEarned((previous) => ({ ...previous, [question.id]: true }));
    }
  };

  const submitQuiz = () => {
    setSubmittedScore(score);
    onComplete(score);
    if (score < 80) {
      const firstWrong = questions.findIndex((item) => !correct[item.id]);
      if (firstWrong >= 0) setCurrentIndex(firstWrong);
    }
  };

  return (
    <section className="bio-quiz" aria-labelledby="bio-quiz-title">
      <div className="bio-quiz__intro">
        <div>
          <p className="bio-kicker">PRUEBA DE DOMINIO</p>
          <h2 id="bio-quiz-title">Cinco preguntas para comprobar que puedes usarlo</h2>
        </div>
        <div className="bio-quiz__score" aria-label={`${correctCount} respuestas correctas de ${questions.length}`}>
          <span>{correctCount}/{questions.length}</span>
          <small>{score}%</small>
        </div>
      </div>

      <nav className="bio-quiz__nav" aria-label="Preguntas del quiz">
        {questions.map((item, index) => (
          <button
            aria-current={index === currentIndex ? "step" : undefined}
            className={`${index === currentIndex ? "bio-quiz__nav-current" : ""}${correct[item.id] ? " bio-quiz__nav-correct" : ""}${checked[item.id] && !correct[item.id] ? " bio-quiz__nav-wrong" : ""}`}
            key={item.id}
            onClick={() => setCurrentIndex(index)}
            type="button"
          >
            {correct[item.id] ? "✓" : index + 1}
          </button>
        ))}
      </nav>

      <div className="bio-question-card">
        <div className="bio-question-card__meta">
          <span>Pregunta {currentIndex + 1} de {questions.length}</span>
          <span>Dificultad {"●".repeat(question.difficulty)}{"○".repeat(3 - question.difficulty)}</span>
        </div>
        <h3>{question.prompt}</h3>
        <QuestionAnswer answer={answer} locked={isCorrect} onChange={updateAnswer} question={question} />

        {hints[question.id] && !wasChecked ? (
          <div className="bio-hint" role="note">
            <strong>Pista:</strong> {question.hint}
          </div>
        ) : null}

        {wasChecked ? (
          <div className={`bio-feedback bio-feedback--${isCorrect ? "correct" : "wrong"}`} role="status">
            <strong>{isCorrect ? "Correcto. Has razonado bien." : "Todavía no. Ajusta una pieza y vuelve a comprobar."}</strong>
            <p>{question.explanation}</p>
            {!isCorrect ? <p><b>Respuesta esperada:</b> {displayAnswer(question.correctAnswer)}</p> : null}
          </div>
        ) : null}

        <div className="bio-question-card__actions">
          <button
            className="bio-button bio-button--ghost"
            onClick={() => setHints((previous) => ({ ...previous, [question.id]: !previous[question.id] }))}
            type="button"
          >
            {hints[question.id] ? "Ocultar pista" : "Ver una pista"}
          </button>
          {!isCorrect ? (
            <button
              className="bio-button bio-button--primary"
              disabled={!answer.length || (answer.length === 1 && !answer[0].trim())}
              onClick={checkAnswer}
              type="button"
            >
              Comprobar respuesta
            </button>
          ) : currentIndex < questions.length - 1 ? (
            <button className="bio-button bio-button--primary" onClick={() => setCurrentIndex(currentIndex + 1)} type="button">
              Siguiente pregunta →
            </button>
          ) : null}
        </div>
      </div>

      <div className="bio-quiz__finish">
        <div>
          <strong>{attemptedCount < questions.length ? `Has comprobado ${attemptedCount} de ${questions.length}` : score >= 80 ? "Objetivo alcanzado" : "Ya sabes exactamente qué reforzar"}</strong>
          <p>{attemptedCount < questions.length ? "Completa las cinco preguntas para guardar el resultado." : score >= 80 ? "Con un 80% o más puedes avanzar al siguiente tema." : "Revisa las preguntas marcadas y vuelve a intentarlo."}</p>
        </div>
        <button
          className="bio-button bio-button--primary"
          disabled={attemptedCount < questions.length}
          onClick={submitQuiz}
          type="button"
        >
          {score >= 80 ? "Guardar resultado" : "Guardar y repetir fallos"}
        </button>
      </div>
      {submittedScore !== null ? (
        <div className="bio-quiz__submitted">
          <p role="status">{submittedScore >= 80 ? `Resultado guardado: ${submittedScore}%. Revisa la lista de dominio antes de avanzar.` : `Resultado guardado: ${submittedScore}%. Empieza por la pregunta marcada.`}</p>
          {submittedScore >= 80 ? <div className="bio-quiz__submitted-actions">
            <button className="bio-button bio-button--ghost" onClick={() => document.getElementById("bio-mastery-title")?.scrollIntoView({ behavior: "smooth", block: "start" })} type="button">Revisar lo que debo dominar ↓</button>
            <button className="bio-button bio-button--primary" onClick={onContinue} type="button">Ir al siguiente tema →</button>
          </div> : null}
        </div>
      ) : null}
    </section>
  );
}

function DieteticsCase({
  theme,
  revealed,
  onReveal,
}: {
  theme: CourseTheme;
  revealed: boolean;
  onReveal: () => void;
}) {
  return (
    <section className="bio-case" aria-labelledby="bio-case-title">
      <div className="bio-case__badge">CASO DIETÉTICA</div>
      <h2 id="bio-case-title">Transfiere la teoría a una situación real</h2>
      <p className="bio-case__prompt">{theme.dieteticsCase.prompt}</p>
      <div className="bio-case__actions">
        <button aria-expanded={revealed} className="bio-button bio-button--primary" onClick={onReveal} type="button">
          {revealed ? "Ocultar razonamiento" : "He razonado · ver solución"}
        </button>
      </div>
      {revealed ? (
        <div className="bio-case__solution" role="status">
          <strong>Respuesta modelo</strong>
          <p>{displayAnswer(theme.dieteticsCase.correctAnswer)}</p>
          <p>{theme.dieteticsCase.explanation}</p>
        </div>
      ) : null}
    </section>
  );
}

function ThemeLesson({
  theme,
  completedThemes,
  readingMode,
  onReadingModeChange,
  onBack,
  onOpenTheme,
  onComplete,
  onEarn,
  onOpenLab,
}: {
  theme: CourseTheme;
  completedThemes: number[];
  readingMode: ReadingMode;
  onReadingModeChange: (mode: ReadingMode) => void;
  onBack: () => void;
  onOpenTheme: (number: number) => void;
  onComplete: (themeId: number, score: number) => void;
  onEarn: (n: number, awardId?: string) => void;
  onOpenLab: () => void;
}) {
  const [revealedRecall, setRevealedRecall] = useState<string[]>([]);
  const [caseRevealed, setCaseRevealed] = useState(false);
  const prerequisiteThemes = theme.prerequisites.map(themeFromId).filter((item): item is CourseTheme => Boolean(item));
  const connectionThemes = theme.connections.map(themeFromId).filter((item): item is CourseTheme => Boolean(item));

  const continueAfterQuiz = () => {
    const next = bioThemes.find((item) => item.number > theme.number && !completedThemes.includes(item.number));
    if (next) onOpenTheme(next.number);
    else onBack();
  };

  return (
    <main className="bio-course bio-course--lesson">
      <div className="bio-lesson-toolbar">
        <button className="bio-back-button" onClick={onBack} type="button">
          ← Volver a mi ruta
        </button>
        <div className="bio-lesson-toolbar__actions">
          <button onClick={onOpenLab} type="button">Abrir laboratorio</button>
        </div>
      </div>

      <header className="bio-lesson-hero">
        <nav className="bio-breadcrumb" aria-label="Migas de pan">
          <button onClick={onBack} type="button">Mi ruta</button>
          <span aria-hidden="true">/</span>
          <span>Tema {theme.number}</span>
        </nav>
        <div className="bio-lesson-hero__layout">
          <div>
            <PriorityBadge priority={theme.priority} />
            <p className="bio-kicker">{theme.eyebrow}</p>
            <h1>{theme.title}</h1>
            <p className="bio-lesson-hero__book">{theme.bookTheme}</p>
          </div>
        </div>

        <details className="bio-objectives">
          <summary>Qué podrás hacer al terminar ({theme.objectives.length} objetivos)</summary>
          <ul>
            {theme.objectives.map((objective) => <li key={objective}>{objective}</li>)}
          </ul>
        </details>

        {prerequisiteThemes.length ? (
          <div className="bio-prerequisites">
            <span>Se apoya en:</span>
            {prerequisiteThemes.map((item) => (
              <button key={item.id} onClick={() => onOpenTheme(item.number)} type="button">
                Tema {item.number} · {item.title}
              </button>
            ))}
          </div>
        ) : null}
      </header>

      <article className="bio-reading">
        <ModeToggle mode={readingMode} onChange={onReadingModeChange} />
        <LessonReader mode={readingMode} theme={theme} />
      </article>

      <RecallCards
        onToggle={(id) => setRevealedRecall((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id])}
        revealed={revealedRecall}
        theme={theme}
      />

      <DieteticsCase
        onReveal={() => setCaseRevealed((value) => !value)}
        revealed={caseRevealed}
        theme={theme}
      />

      <ThemeQuiz
        onComplete={(score) => onComplete(theme.number, score)}
        onContinue={continueAfterQuiz}
        onEarn={onEarn}
        rewardsEnabled={!completedThemes.includes(theme.number)}
        theme={theme}
      />

      <section className="bio-mastery" aria-labelledby="bio-mastery-title">
        <div>
          <p className="bio-kicker">LISTA DE DOMINIO</p>
          <h2 id="bio-mastery-title">Antes de cerrar el tema</h2>
        </div>
        <ul>
          {theme.mastery.map((item) => <li key={item}><span aria-hidden="true">□</span>{item}</li>)}
        </ul>
      </section>

      {connectionThemes.length ? (
        <section className="bio-connections" aria-labelledby="bio-connections-title">
          <div className="bio-section-heading bio-section-heading--lesson">
            <div>
              <p className="bio-kicker">LO QUE VIENE DESPUÉS</p>
              <h2 id="bio-connections-title">Este tema se conecta con…</h2>
            </div>
          </div>
          <div className="bio-connections__grid">
            {connectionThemes.map((item) => (
              <button key={item.id} onClick={() => onOpenTheme(item.number)} type="button">
                <span>Tema {item.number}</span>
                <strong>{item.title}</strong>
                <p>{item.eyebrow}</p>
                <b aria-hidden="true">→</b>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="bio-lesson-footer">
        <button className="bio-back-button" onClick={onBack} type="button">← Volver a mi ruta</button>
      </footer>
    </main>
  );
}

export default function BioCourse({
  completedThemes,
  scores,
  onComplete,
  onEarn,
  onOpenCarbon,
  onOpenLab,
  onOpenReview,
}: BioCourseProps) {
  const [activeThemeNumber, setActiveThemeNumber] = useState<number | null>(null);
  // El conmutador solo aparece dentro de una lección, que nunca se renderiza en
  // el servidor, así que se puede leer la preferencia guardada de entrada.
  const [readingMode, setReadingMode] = useState<ReadingMode>(readStoredMode);

  const changeReadingMode = (mode: ReadingMode) => {
    setReadingMode(mode);
    try {
      localStorage.setItem("bio-reading-mode-v1", mode);
    } catch {
      /* la preferencia dura solo esta sesión si no hay almacenamiento */
    }
  };
  const activeTheme = useMemo(
    () => bioThemes.find((theme) => theme.number === activeThemeNumber),
    [activeThemeNumber],
  );

  useEffect(() => {
    const readHash = () => {
      const match = window.location.hash.match(/^#tema-(\d+)$/);
      if (!match) {
        setActiveThemeNumber(null);
        return;
      }
      const number = Number(match[1]);
      if (number === 1) {
        onOpenCarbon();
        return;
      }
      if (bioThemes.some((theme) => theme.number === number)) setActiveThemeNumber(number);
    };

    readHash();
    window.addEventListener("hashchange", readHash);
    window.addEventListener("popstate", readHash);
    return () => {
      window.removeEventListener("hashchange", readHash);
      window.removeEventListener("popstate", readHash);
    };
    // The route is intentionally read once on mount and again on browser navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openTheme = (number: number) => {
    if (number === 1) {
      onOpenCarbon();
      return;
    }
    setActiveThemeNumber(number);
    window.history.pushState({ bioTheme: number }, "", `#tema-${number}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToPlan = () => {
    setActiveThemeNumber(null);
    window.history.pushState({ bioPlan: true }, "", "#plan");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (activeTheme && activeTheme.number >= 2) {
    return (
      <ThemeLesson
        key={activeTheme.id}
        completedThemes={completedThemes}
        onBack={backToPlan}
        onComplete={onComplete}
        onEarn={onEarn}
        onOpenLab={onOpenLab}
        onOpenTheme={openTheme}
        onReadingModeChange={changeReadingMode}
        readingMode={readingMode}
        theme={activeTheme}
      />
    );
  }

  return (
    <CourseDashboard
      completedThemes={completedThemes}
      onOpenLab={onOpenLab}
      onOpenReview={onOpenReview}
      onOpenTheme={openTheme}
      scores={scores}
    />
  );
}
