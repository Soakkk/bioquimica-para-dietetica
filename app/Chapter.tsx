"use client";

import { useMemo, useState } from "react";
import { bioThemes, type CourseBlock, type CourseTheme } from "./bio-course-data";
import { blockSections, type BlockSection } from "./bio-course-sections";
import { openingQuestions, type OpeningQuestion } from "./opening-questions";
import { questionBank } from "./bio-question-bank";

/**
 * Un tema renderizado como capítulo de libro de texto.
 *
 * Sustituye al lector anterior de dos modos. Aquí solo hay una forma de leer,
 * la del libro: secciones numeradas, notas al margen y ejercicios al final.
 * Lo que cambia respecto a leer un PDF es la cuestión de apertura, que se
 * responde antes de leer y no se resuelve hasta el cierre de la sección.
 */

const LETTERS = ["a", "b", "c", "d", "e"];

/** Si un bloque no tiene secciones escritas, se reconstruyen desde su teoría. */
function sectionsFor(block: CourseBlock): BlockSection[] {
  const written = blockSections[block.id];
  if (written?.length) return written;
  return [{ heading: block.title, paragraphs: block.theory }];
}

function Opening({ blockId, question }: { blockId: string; question: OpeningQuestion }) {
  const [bet, setBet] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const correct = bet === question.answer;

  return (
    <>
      <div className="tb-opening">
        <p className="tb-cap">Cuestión de apertura</p>
        <p className="tb-q">{question.prompt}</p>
        <p className="tb-invite">
          Arriésgate antes de leer. No sabrás si has acertado hasta el final de la sección:
          la idea es que leas buscando la respuesta.
        </p>
        <div className="tb-opts">
          {question.options.map((option, index) => (
            <button
              key={option}
              type="button"
              className={
                "tb-opt" +
                (bet === index && !revealed ? " is-pick" : "") +
                (revealed && index === question.answer ? " is-right" : "") +
                (revealed && bet === index && index !== question.answer ? " is-wrong" : "")
              }
              onClick={() => setBet(index)}
              disabled={revealed}
            >
              <span className="tb-k">{LETTERS[index]})</span>
              <span>{option}</span>
            </button>
          ))}
        </div>
        {bet !== null && !revealed ? (
          <p className="tb-bet">
            Has apostado por <b>{LETTERS[bet]})</b>. Lo sabrás al terminar la sección — puedes
            cambiarla mientras tanto.
          </p>
        ) : null}
      </div>

      <div className="tb-resolution" id={`res-${blockId}`}>
        <p className="tb-cap">Resolución de la cuestión de apertura</p>
        {!revealed ? (
          <p className="tb-locked">
            Ya tienes todo lo necesario para resolverla.{" "}
            <button className="tb-link" type="button" onClick={() => setRevealed(true)}>
              Destapar la respuesta
            </button>
          </p>
        ) : (
          <div className="tb-out">
            {bet === null ? (
              <p className="tb-head">No llegaste a apostar</p>
            ) : correct ? (
              <p className="tb-head is-ok">Acertaste antes de leer</p>
            ) : (
              <p className="tb-head is-no">
                Apostaste por {LETTERS[bet]}) y era {LETTERS[question.answer]})
              </p>
            )}
            <p>{question.resolution}</p>
            {bet !== null && !correct && question.why[bet] ? (
              <p className="tb-why">Por qué falla la que elegiste: {question.why[bet]}</p>
            ) : null}
            {question.aside ? <p className="tb-why">{question.aside}</p> : null}
          </div>
        )}
      </div>
    </>
  );
}

function Section({
  block,
  chapter,
  index,
}: {
  block: CourseBlock;
  chapter: number;
  index: number;
}) {
  const sections = sectionsFor(block);
  const opening = openingQuestions[block.id];
  const number = `${chapter}.${index + 1}`;

  return (
    <section className="tb-section" id={block.id}>
      <h2>
        <span className="tb-s">{number}</span>
        {block.title}
      </h2>

      {opening ? <Opening blockId={block.id} question={opening} /> : null}

      {sections.map((section, sectionIndex) => (
        <Fragmentish key={section.heading + sectionIndex}>
          {sectionIndex > 0 ? <h3>{section.heading}</h3> : null}

          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <p
              className={"tb-p" + (sectionIndex === 0 && paragraphIndex === 0 ? " tb-lead" : "")}
              key={paragraph.slice(0, 40)}
            >
              {paragraph}
            </p>
          ))}

          {section.formula ? (
            <div className="tb-eq">
              <div className="tb-f">{section.formula}</div>
              <div className="tb-n">
                ({number}.{sectionIndex + 1})
              </div>
            </div>
          ) : null}

          {section.note ? (
            <aside className="tb-margin">
              <b>Nota</b>
              {section.note}
            </aside>
          ) : null}
        </Fragmentish>
      ))}

      <div className="tb-worked">
        <p className="tb-cap">Ejemplo resuelto {number}</p>
        <p>{block.example.prompt}</p>
        <ol>
          {block.example.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="tb-sol">{block.example.answer}</p>
      </div>

      {block.updatedNote ? (
        <p className="tb-updated">
          <b>Dato actualizado. </b>
          {block.updatedNote}
        </p>
      ) : null}
    </section>
  );
}

/** Evita anidar un div que rompería la rejilla de texto y margen. */
function Fragmentish({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function Problems({ theme, chapter }: { theme: CourseTheme; chapter: number }) {
  const [open, setOpen] = useState<string[]>([]);

  // Los ejercicios del capítulo reúnen las preguntas del temario y las del
  // banco ampliado: el mismo material que después alimenta el repaso espaciado.
  const problems = useMemo(() => {
    const fromTheme = theme.questions.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      answer: Array.isArray(question.correctAnswer)
        ? question.correctAnswer.join(" · ")
        : question.correctAnswer,
      explanation: question.explanation,
      spaced: true,
    }));
    const fromBank = questionBank
      .filter((question) => question.themeId === theme.id)
      .map((question) => ({
        id: question.id,
        prompt: question.prompt,
        answer: Array.isArray(question.correctAnswer)
          ? question.correctAnswer.join(" · ")
          : question.correctAnswer,
        explanation: question.explanation,
        spaced: true,
      }));
    return [...fromTheme, ...fromBank];
  }, [theme]);

  const toggle = (id: string) =>
    setOpen((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
    );

  return (
    <section className="tb-problems" id="ejercicios">
      <h2>Ejercicios del capítulo {chapter}</h2>
      <p className="tb-intro">
        Resuélvelos antes de destapar la solución. Todos reaparecen después en el repaso
        espaciado, así que fallar aquí no es un problema: es lo que hace que vuelvan.
      </p>
      <ol className="tb-plist">
        {problems.map((problem, index) => {
          const isOpen = open.includes(problem.id);
          return (
            <li key={problem.id}>
              <span className="tb-pnum">
                {chapter}.{index + 1}
                {problem.spaced ? " ▸" : ""}
              </span>
              <p className="tb-ptext">{problem.prompt}</p>
              <button className="tb-link" type="button" onClick={() => toggle(problem.id)}>
                {isOpen ? "Ocultar solución" : "Ver solución"}
              </button>
              {isOpen ? (
                <p className="tb-answer">
                  <b>{problem.answer}.</b> {problem.explanation}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function Chapter({
  theme,
  onBack,
  onOpenTheme,
  onOpenTools,
}: {
  theme: CourseTheme;
  onBack: () => void;
  onOpenTheme: (number: number) => void;
  onOpenTools?: () => void;
}) {
  const chapter = theme.number;
  const next = bioThemes.find((item) => item.number === chapter + 1);

  return (
    <div className="tb">
      <div className="tb-runhead">
        <div>
          <button className="tb-back" type="button" onClick={onBack}>
            ← Índice del curso
          </button>
          <span>
            <b>Capítulo {chapter}</b> · {theme.title}
          </span>
          <span className="tb-right">{theme.blocks.length} secciones</span>
        </div>
      </div>

      <div className="tb-book" lang="es">
        <header className="tb-opener">
          <p className="tb-chapnum">Capítulo {chapter}</p>
          <h1>{theme.title}</h1>
          <p className="tb-abstract">{theme.eyebrow}</p>

          <ul className="tb-objectives">
            {theme.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>

          <ol className="tb-toc">
            {theme.blocks.map((block, index) => (
              <li key={block.id}>
                <span className="tb-s">
                  {chapter}.{index + 1}
                </span>
                <a href={`#${block.id}`}>{block.title}</a>
                <span className={`tb-mark${openingQuestions[block.id] ? " is-open" : ""}`}>
                  {openingQuestions[block.id] ? "con apertura" : "—"}
                </span>
              </li>
            ))}
            <li>
              <span className="tb-s">—</span>
              <a href="#ejercicios">Ejercicios del capítulo</a>
              <span className="tb-mark">
                {theme.questions.length +
                  questionBank.filter((question) => question.themeId === theme.id).length}
              </span>
            </li>
          </ol>
        </header>

        {theme.blocks.map((block, index) => (
          <Section key={block.id} block={block} chapter={chapter} index={index} />
        ))}

        <Problems theme={theme} chapter={chapter} />

        <div className="tb-endnav">
          <button className="tb-btn" type="button" onClick={onBack}>
            ← Índice del curso
          </button>
          {onOpenTools ? (
            <button className="tb-btn" type="button" onClick={onOpenTools}>
              Laboratorio molecular
            </button>
          ) : null}
          {next ? (
            <button
              className="tb-btn tb-next"
              type="button"
              onClick={() => onOpenTheme(next.number)}
            >
              Capítulo {next.number} · {next.title} →
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
