"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CourseBlock, CourseTheme } from "./bio-course-data";
import { blockSections, type BlockSection } from "./bio-course-sections";
import { blockIndexAt, readPlace, savePlace } from "./reading-place";

export type ReadingMode = "continuo" | "pasos";

const MODE_KEY = "bio-reading-mode-v1";
const STEP_KEY = "bio-reading-step-v1";

/** Los bloques sin teoría expandida siguen siendo legibles: cada frase se convierte en una sección. */
function sectionsFor(block: CourseBlock): BlockSection[] {
  const written = blockSections[block.id];
  if (written?.length) return written;
  return [{ heading: block.title, paragraphs: block.theory }];
}

export function readStoredMode(): ReadingMode {
  if (typeof window === "undefined") return "continuo";
  try {
    return localStorage.getItem(MODE_KEY) === "pasos" ? "pasos" : "continuo";
  } catch {
    return "continuo";
  }
}

export function ModeToggle({
  mode,
  onChange,
}: {
  mode: ReadingMode;
  onChange: (mode: ReadingMode) => void;
}) {
  return (
    <div className="read-mode" role="group" aria-label="Forma de leer la lección">
      <span className="read-mode__label">Cómo quieres leer</span>
      <div className="read-mode__options">
        <button
          type="button"
          className={mode === "continuo" ? "is-active" : ""}
          aria-pressed={mode === "continuo"}
          onClick={() => onChange("continuo")}
        >
          <b>Lectura continua</b>
          <small>Todo seguido, para leer del tirón</small>
        </button>
        <button
          type="button"
          className={mode === "pasos" ? "is-active" : ""}
          aria-pressed={mode === "pasos"}
          onClick={() => onChange("pasos")}
        >
          <b>Paso a paso</b>
          <small>Una idea por pantalla, a tu ritmo</small>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── piezas compartidas ─────────────────────────── */

function Formula({ text }: { text: string }) {
  return (
    <div className="lr-formula">
      {text.split("\n").map((line, index) => (
        <span key={`${index}-${line}`}>{line}</span>
      ))}
    </div>
  );
}

function WorkedExample({ block }: { block: CourseBlock }) {
  return (
    <div className="lr-example">
      <div className="lr-example__head">
        <span>Ejemplo resuelto</span>
        <b>{block.example.title}</b>
        <p>{block.example.prompt}</p>
      </div>
      <ol>
        {block.example.steps.map((step, index) => (
          <li key={`${index}-${step.slice(0, 24)}`}>
            <span aria-hidden="true">{index + 1}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
      <div className="lr-example__answer">
        <span>Resultado</span>
        <p>{block.example.answer}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────── A · lectura continua ─────────────────────────── */

function ContinuousReader({ theme }: { theme: CourseTheme }) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Se lee una sola vez al montar: si volvemos al tema, ofrecemos retomar.
  const [resume, setResume] = useState(() => {
    const place = readPlace(theme.id);
    return place && place.blockIndex > 0 ? place : null;
  });

  // Guardar por bloque, no por píxeles: el scroll exacto se rompe en cuanto
  // cambia el tamaño de la ventana o el contenido. Se usa un listener de
  // scroll y no IntersectionObserver porque los bloques son mucho más altos
  // que la ventana, y así el cálculo es explícito y comprobable.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const blocks = Array.from(root.querySelectorAll<HTMLElement>(".lr-block"));
    if (!blocks.length) return;

    let timer: number | null = null;

    const record = () => {
      const tops = blocks.map((block) => block.getBoundingClientRect().top + window.scrollY);
      const blockIndex = blockIndexAt(tops, window.scrollY, window.innerHeight);
      savePlace(theme.id, {
        blockIndex,
        blockTitle: theme.blocks[blockIndex]?.title ?? "",
        updatedAt: new Date().toISOString(),
      });
    };

    const onScroll = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(record, 400);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (timer !== null) window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [theme]);

  const jumpToResume = () => {
    const target = resume ? theme.blocks[resume.blockIndex] : undefined;
    if (target) document.getElementById(target.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setResume(null);
  };

  return (
    <div className="lr-continuous" ref={rootRef}>
      {resume ? (
        <div className="lr-resume" role="status">
          <div>
            <span>Seguías por aquí</span>
            <b>Bloque {resume.blockIndex + 1} · {resume.blockTitle}</b>
          </div>
          <div className="lr-resume__actions">
            <button className="lr-btn" type="button" onClick={() => setResume(null)}>
              Empezar de nuevo
            </button>
            <button className="lr-btn lr-btn--primary" type="button" onClick={jumpToResume}>
              Continuar ahí →
            </button>
          </div>
        </div>
      ) : null}

      {theme.blocks.map((block, blockIndex) => (
        <section className="lr-block" id={block.id} key={block.id}>
          <header className="lr-block__head">
            <span className="lr-block__n">{String(blockIndex + 1).padStart(2, "0")}</span>
            <h3>{block.title}</h3>
          </header>

          {sectionsFor(block).map((section, sectionIndex) => (
            <div className="lr-section" key={`${sectionIndex}-${section.heading}`}>
              <h4>{section.heading}</h4>
              <div className="lr-prose">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
                {section.formula ? <Formula text={section.formula} /> : null}
                {section.note ? (
                  <aside className="lr-note">
                    <b>Precisión</b>
                    {section.note}
                  </aside>
                ) : null}
              </div>
            </div>
          ))}

          <div className="lr-key">
            <span>Idea que debes conservar</span>
            <p>{block.keyIdea}</p>
          </div>

          {block.updatedNote ? (
            <div className="lr-updated">
              <span>Dato actualizado</span>
              <p>{block.updatedNote}</p>
            </div>
          ) : null}

          <WorkedExample block={block} />

          <p className="lr-practice">
            <span>Para comprobarlo</span>
            {block.practice}
          </p>
        </section>
      ))}
    </div>
  );
}

/* ─────────────────────────── B · paso a paso ─────────────────────────── */

type Step =
  | { kind: "section"; blockIndex: number; blockTitle: string; section: BlockSection }
  | { kind: "key"; blockIndex: number; blockTitle: string; block: CourseBlock }
  | { kind: "example"; blockIndex: number; blockTitle: string; block: CourseBlock };

function buildSteps(theme: CourseTheme): Step[] {
  const steps: Step[] = [];
  theme.blocks.forEach((block, blockIndex) => {
    sectionsFor(block).forEach((section) => {
      steps.push({ kind: "section", blockIndex, blockTitle: block.title, section });
    });
    steps.push({ kind: "key", blockIndex, blockTitle: block.title, block });
    steps.push({ kind: "example", blockIndex, blockTitle: block.title, block });
  });
  return steps;
}

function StepReader({ theme }: { theme: CourseTheme }) {
  const steps = useMemo(() => buildSteps(theme), [theme]);

  // Cada tema recuerda por dónde ibas, para poder parar y volver.
  // El lector solo se monta tras navegar a un tema en el cliente, así que
  // leer el almacenamiento aquí no puede desajustar la hidratación.
  const [at, setAt] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      const raw = localStorage.getItem(STEP_KEY);
      const saved = raw ? (JSON.parse(raw) as Record<string, number>) : {};
      const value = saved[theme.id];
      return typeof value === "number" && value >= 0 && value < steps.length ? value : 0;
    } catch {
      return 0;
    }
  });

  const go = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), steps.length - 1);
    setAt(clamped);
    try {
      const raw = localStorage.getItem(STEP_KEY);
      const saved = raw ? (JSON.parse(raw) as Record<string, number>) : {};
      saved[theme.id] = clamped;
      localStorage.setItem(STEP_KEY, JSON.stringify(saved));
    } catch {
      /* el paso a paso funciona igual sin memoria */
    }
    // Los dos modos comparten la misma noción de "por dónde ibas".
    const step = steps[clamped];
    if (step) {
      savePlace(theme.id, {
        blockIndex: step.blockIndex,
        blockTitle: step.blockTitle,
        updatedAt: new Date().toISOString(),
      });
    }
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const step = steps[at];
  if (!step) return null;

  const blockCount = theme.blocks.length;
  const isLast = at === steps.length - 1;

  return (
    <div className="lr-steps">
      <div className="lr-steps__rail">
        <div className="lr-dots" aria-hidden="true">
          {steps.map((item, index) => (
            <span
              key={`${item.kind}-${index}`}
              className={`lr-dot${index < at ? " is-done" : ""}${index === at ? " is-now" : ""}`}
            />
          ))}
        </div>
        <span className="lr-steps__count">
          Paso {at + 1} / {steps.length}
        </span>
      </div>

      <div className="lr-steps__body">
        <p className="lr-steps__where">
          Bloque {step.blockIndex + 1} de {blockCount} · {step.blockTitle}
        </p>

        {step.kind === "section" ? (
          <div className="lr-step">
            <h3>{step.section.heading}</h3>
            <div className="lr-prose">
              {step.section.paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
            </div>
            {step.section.formula ? <Formula text={step.section.formula} /> : null}
            {step.section.note ? (
              <aside className="lr-note lr-note--inline">
                <b>Precisión</b>
                {step.section.note}
              </aside>
            ) : null}
          </div>
        ) : null}

        {step.kind === "key" ? (
          <div className="lr-step">
            <div className="lr-key lr-key--step">
              <span>Idea que debes conservar</span>
              <p>{step.block.keyIdea}</p>
            </div>
            {step.block.updatedNote ? (
              <div className="lr-updated">
                <span>Dato actualizado</span>
                <p>{step.block.updatedNote}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        {step.kind === "example" ? (
          <div className="lr-step">
            <WorkedExample block={step.block} />
            <p className="lr-practice">
              <span>Para comprobarlo</span>
              {step.block.practice}
            </p>
          </div>
        ) : null}
      </div>

      <div className="lr-steps__nav">
        <button className="lr-btn" type="button" onClick={() => go(at - 1)} disabled={at === 0}>
          ← Anterior
        </button>
        <span className="lr-steps__hint">
          {isLast ? "Teoría terminada. Abajo tienes las preguntas." : "Sin prisa. Puedes volver atrás cuando quieras."}
        </span>
        <button
          className="lr-btn lr-btn--primary"
          type="button"
          onClick={() => go(at + 1)}
          disabled={isLast}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── entrada ─────────────────────────── */

export default function LessonReader({ theme, mode }: { theme: CourseTheme; mode: ReadingMode }) {
  return mode === "pasos" ? <StepReader theme={theme} /> : <ContinuousReader theme={theme} />;
}
