"use client";

import { useMemo, useState } from "react";
import { bioThemes } from "./bio-course-data";
import { questionBank, type BankQuestion } from "./bio-question-bank";
import { legacyTema1Questions } from "./bio-question-bank-legacy";
import {
  dueQueue,
  loadSchedule,
  newCard,
  review,
  saveSchedule,
  summarize,
  today,
  type Grade,
  type ScheduleMap,
} from "./spaced-repetition";

/** Las preguntas del temario y las del banco ampliado se repasan juntas. */
function allQuestions(): BankQuestion[] {
  const fromThemes: BankQuestion[] = bioThemes.flatMap((theme) =>
    theme.questions.map((question) => ({
      id: question.id,
      themeId: theme.id,
      type: question.type === "multi-select" ? "multi-select" : question.type === "short" ? "short" : "choice",
      prompt: question.prompt,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      hint: question.hint,
      difficulty: question.difficulty,
      tags: question.tags,
    })),
  );
  return [...fromThemes, ...questionBank, ...legacyTema1Questions];
}

function normalize(value: string): string {
  const subs: Record<string, string> = { "₀":"0","₁":"1","₂":"2","₃":"3","₄":"4","₅":"5","₆":"6","₇":"7","₈":"8","₉":"9" };
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[₀-₉]/g, (c) => subs[c] ?? c)
    .toLocaleLowerCase("es")
    .replace(/[—–−]/g, "-")
    .replace(/[\s.,;:()]/g, "")
    .trim();
}

function isCorrect(question: BankQuestion, answer: string[]): boolean {
  const expected = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
  const got = answer.map(normalize).sort();
  const want = expected.map(normalize).sort();
  return got.length === want.length && got.every((value, index) => value === want[index]);
}

function themeTitle(themeId: string): string {
  const theme = bioThemes.find((item) => item.id === themeId);
  return theme ? `Tema ${theme.number} · ${theme.title}` : "Repaso";
}

export default function ReviewQueue({ onEarn }: { onEarn: (n: number, awardId?: string) => void }) {
  const questions = useMemo(() => allQuestions(), []);
  const byId = useMemo(
    () => Object.fromEntries(questions.map((question) => [question.id, question])),
    [questions],
  );

  const [schedule, setSchedule] = useState<ScheduleMap>(loadSchedule);
  const [answer, setAnswer] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [done, setDone] = useState(0);

  const now = today();
  const ids = useMemo(() => questions.map((question) => question.id), [questions]);
  const queue = useMemo(() => dueQueue(ids, schedule, now), [ids, schedule, now]);
  const stats = useMemo(() => summarize(ids, schedule, now), [ids, schedule, now]);

  const current = queue.length ? byId[queue[0]] : undefined;
  const correct = current ? isCorrect(current, current.type === "short" ? [text] : answer) : false;

  const reset = () => {
    setAnswer([]);
    setText("");
    setChecked(false);
    setHintOpen(false);
  };

  const grade = (value: Grade) => {
    if (!current) return;
    const next = { ...schedule, [current.id]: review(schedule[current.id] ?? newCard(now), value, now) };
    setSchedule(next);
    saveSchedule(next);
    setDone((count) => count + 1);
    if (value !== "fallo") onEarn(2, `srs:${current.id}:${now}`);
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggle = (option: string) => {
    if (checked) return;
    if (current?.type === "multi-select") {
      setAnswer((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]));
    } else {
      setAnswer([option]);
    }
  };

  if (!current) {
    return (
      <div className="srs srs--empty">
        <span aria-hidden="true">✓</span>
        <h2>{done ? "Repaso terminado por hoy" : "Nada pendiente ahora mismo"}</h2>
        <p>
          {done
            ? `Has repasado ${done} ${done === 1 ? "pregunta" : "preguntas"}. Las que fallaste volverán mañana; las que dominas tardarán más en aparecer.`
            : "Cuando estudies un tema o falles una pregunta, aparecerá aquí en el momento adecuado para volver a verla."}
        </p>
        <dl className="srs-stats">
          <div><dt>Aprendidas</dt><dd>{stats.aprendidas}</dd></div>
          <div><dt>Flojas</dt><dd>{stats.flojas}</dd></div>
          <div><dt>Total</dt><dd>{stats.total}</dd></div>
        </dl>
      </div>
    );
  }

  const wrongPicked = checked && current.options
    ? current.options.filter((option) => answer.includes(option) && !(
        Array.isArray(current.correctAnswer) ? current.correctAnswer : [current.correctAnswer]
      ).includes(option))
    : [];

  return (
    <div className="srs">
      <div className="srs-rail">
        <span className="srs-rail__label">Pendientes hoy</span>
        <b>{queue.length}</b>
        <span className="srs-rail__sep" aria-hidden="true">·</span>
        <span className="srs-rail__label">Repasadas</span>
        <b>{done}</b>
        <span className="srs-rail__theme">{themeTitle(current.themeId)}</span>
      </div>

      <div className="srs-card">
        <p className="srs-card__prompt">{current.prompt}</p>

        {current.type === "short" ? (
          <input
            className="srs-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Escribe tu respuesta"
            disabled={checked}
            aria-label="Tu respuesta"
          />
        ) : (
          <div className="srs-options">
            {current.options?.map((option) => {
              const expected = Array.isArray(current.correctAnswer) ? current.correctAnswer : [current.correctAnswer];
              const right = checked && expected.includes(option);
              const wrong = checked && answer.includes(option) && !expected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  className={`srs-option${answer.includes(option) ? " is-picked" : ""}${right ? " is-right" : ""}${wrong ? " is-wrong" : ""}`}
                  onClick={() => toggle(option)}
                  disabled={checked}
                >
                  <span aria-hidden="true">{right ? "✓" : wrong ? "✕" : ""}</span>
                  {option}
                </button>
              );
            })}
            {current.type === "multi-select" ? (
              <p className="srs-multi-hint">Puede haber más de una correcta.</p>
            ) : null}
          </div>
        )}

        {hintOpen && !checked ? <p className="srs-hint">{current.hint}</p> : null}

        {checked ? (
          <div className={`srs-feedback${correct ? " is-ok" : " is-no"}`}>
            <strong>{correct ? "Correcto" : "No era esa"}</strong>
            <p>{current.explanation}</p>
            {wrongPicked.map((option) => {
              const note = current.optionNotes?.[option];
              return note ? (
                <p className="srs-why" key={option}>
                  <b>Por qué «{option}» no:</b> {note}
                </p>
              ) : null;
            })}
            {current.type === "short" && !correct ? (
              <p className="srs-why">
                <b>Respuesta:</b> {Array.isArray(current.correctAnswer) ? current.correctAnswer.join(" · ") : current.correctAnswer}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="srs-actions">
          {!checked ? (
            <>
              <button className="lr-btn" type="button" onClick={() => setHintOpen(true)} disabled={hintOpen}>
                Pista
              </button>
              <button
                className="lr-btn lr-btn--primary"
                type="button"
                onClick={() => setChecked(true)}
                disabled={current.type === "short" ? !text.trim() : answer.length === 0}
              >
                Comprobar
              </button>
            </>
          ) : (
            <>
              <span className="srs-ask">¿Cómo te ha ido?</span>
              <button className="lr-btn srs-grade srs-grade--fallo" type="button" onClick={() => grade("fallo")}>
                Lo fallé · mañana
              </button>
              <button className="lr-btn srs-grade" type="button" onClick={() => grade("duda")}>
                Con dudas
              </button>
              <button className="lr-btn lr-btn--primary" type="button" onClick={() => grade("bien")}>
                Claro · espaciar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
