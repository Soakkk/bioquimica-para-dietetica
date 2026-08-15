"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  bioThemes,
  courseSources,
  integrationRoutes,
  type CourseTheme,
  type IntegrationRoute,
} from "./bio-course-data";
import ProgressBackup from "./ProgressBackup";
import Chapter from "./Chapter";
import { readLastTheme, readPlace, saveLastTheme } from "./reading-place";

type BioCourseProps = {
  completedThemes: number[];
  scores: Record<number, number>;
  onComplete: (themeId: number, score: number) => void;
  onEarn: (n: number, awardId?: string) => void;
  onOpenCarbon: () => void;
  onOpenLab: () => void;
  onOpenReview: () => void;
};



function themeFromId(id: string): CourseTheme | undefined {
  return bioThemes.find((theme) => theme.id === id);
}




function firstUnfinishedTheme(completedThemes: number[]): CourseTheme | undefined {
  return bioThemes.find((theme) => !completedThemes.includes(theme.number));
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
  // "Superado" (prueba ≥80 %) y "por dónde ibas" son cosas distintas, y antes
  // el panel solo conocía la primera. El servidor no puede saber lo segundo,
  // así que se lee con useSyncExternalStore: durante la hidratación devuelve
  // el valor del servidor y solo después el del navegador, sin desajuste.
  const lastThemeNumber = useSyncExternalStore(
    () => () => {},
    () => readLastTheme(),
    () => null,
  );
  const resume = useMemo(() => {
    if (lastThemeNumber === null) return null;
    const theme = bioThemes.find((item) => item.number === lastThemeNumber);
    if (!theme) return null;
    const place = readPlace(theme.id);
    return { theme, blockIndex: place?.blockIndex ?? 0, blockTitle: place?.blockTitle ?? "" };
  }, [lastThemeNumber]);

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
            {resume ? (
              <button
                className="bio-button bio-button--primary"
                onClick={() => onOpenTheme(resume.theme.number)}
                type="button"
              >
                Seguir donde lo dejaste →
              </button>
            ) : (
              <button
                className="bio-button bio-button--primary"
                onClick={nextTheme ? () => onOpenTheme(nextTheme.number) : onOpenReview}
                type="button"
              >
                {nextTheme ? `Empezar por el Tema ${nextTheme.number} →` : "Ruta principal completada · repasar →"}
              </button>
            )}
            <button className="bio-button bio-button--secondary" onClick={onOpenReview} type="button">
              Repaso de hoy
            </button>
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
            <p>
              {resume
                ? `Ibas por Tema ${resume.theme.number}${resume.blockTitle ? ` · ${resume.blockTitle}` : ""}`
                : nextTheme
                  ? `Siguiente: ${nextTheme.title}`
                  : "Ruta principal completada"}
            </p>
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

export default function BioCourse({
  completedThemes,
  scores,
  onOpenLab,
  onOpenReview,
}: BioCourseProps) {
  const [activeThemeNumber, setActiveThemeNumber] = useState<number | null>(null);
  // El conmutador solo aparece dentro de una lección, que nunca se renderiza en
  // el servidor, así que se puede leer la preferencia guardada de entrada.

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
  }, []);

  const openTheme = (number: number) => {
    saveLastTheme(number);
    setActiveThemeNumber(number);
    window.history.pushState({ bioTheme: number }, "", `#tema-${number}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToPlan = () => {
    setActiveThemeNumber(null);
    window.history.pushState({ bioPlan: true }, "", "#plan");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (activeTheme) {
    return (
      <Chapter
        key={activeTheme.id}
        onBack={backToPlan}
        onOpenTheme={openTheme}
        onOpenTools={onOpenLab}
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
