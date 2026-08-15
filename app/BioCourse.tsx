"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  bioThemes,
  integrationRoutes,
  type CourseTheme,
} from "./bio-course-data";
import ProgressBackup from "./ProgressBackup";
import Chapter from "./Chapter";
import { readLastTheme, readPlace, saveLastTheme } from "./reading-place";

type BioCourseProps = {
  completedThemes: number[];
  scores: Record<number, number>;
  onComplete: (themeId: number, score: number) => void;
  onEarn: (n: number, awardId?: string) => void;
  onOpenLab: () => void;
  onOpenReview: () => void;
  onOpenNomenclature: () => void;
};



function themeFromId(id: string): CourseTheme | undefined {
  return bioThemes.find((theme) => theme.id === id);
}




function firstUnfinishedTheme(completedThemes: number[]): CourseTheme | undefined {
  return bioThemes.find((theme) => !completedThemes.includes(theme.number));
}


function CourseDashboard({
  completedThemes,
  scores,
  onOpenTheme,
  onOpenLab,
  onOpenReview,
  onOpenNomenclature,
}: {
  completedThemes: number[];
  scores: Record<number, number>;
  onOpenTheme: (number: number) => void;
  onOpenLab: () => void;
  onOpenReview: () => void;
  onOpenNomenclature: () => void;
}) {
  // "Superado" y "por dónde ibas" son cosas distintas. El servidor no puede
  // saber lo segundo, así que se lee con useSyncExternalStore: durante la
  // hidratación devuelve el valor del servidor y solo después el del
  // navegador, sin desajuste.
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
  const done = bioThemes.filter((theme) => completedThemes.includes(theme.number)).length;
  const sections = bioThemes.reduce((total, theme) => total + theme.blocks.length, 0);
  const weak = Object.entries(scores).filter(([, score]) => score < 80).length;

  const openSection = (themeNumber: number, blockId: string) => {
    onOpenTheme(themeNumber);
    // El capítulo se monta en el mismo tick; el salto espera a que exista.
    window.setTimeout(() => {
      document.getElementById(blockId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <div className="tb-book tb-front" lang="es">
        <header className="tb-title">
          <p className="tb-imprint">Formación Profesional · Dietética</p>
          <h1>Bioquímica para Dietética</h1>
          <p className="tb-sub">
            Los doce temas del programa, escritos para entenderse y no para memorizarse.
            Cada sección abre con una pregunta y la responde al final.
          </p>

          {resume ? (
            <div className="tb-resume">
              <p className="tb-where">
                Ibas por el <b>capítulo {resume.theme.number}, {resume.theme.title}</b>
                {resume.blockTitle ? <>, en <b>{resume.blockTitle}</b></> : null}.
              </p>
              <button
                className="tb-btn tb-go"
                type="button"
                onClick={() => onOpenTheme(resume.theme.number)}
              >
                Seguir leyendo →
              </button>
            </div>
          ) : (
            <div className="tb-resume">
              <p className="tb-where">Aún no has abierto ningún capítulo.</p>
              <button
                className="tb-btn tb-go"
                type="button"
                onClick={() => onOpenTheme(nextTheme?.number ?? 1)}
              >
                Empezar por el capítulo 1 →
              </button>
            </div>
          )}

          <div className="tb-state">
            <div><b>{done}</b> de 12 capítulos superados</div>
            <div><b>{sections}</b> secciones en total</div>
            {weak > 0 ? <div><b>{weak}</b> por reforzar</div> : null}
          </div>
        </header>

        <section className="tb-howto" aria-labelledby="tb-howto-title">
          <h2 id="tb-howto-title">Cómo se usa este libro</h2>
          <p>
            No hay calendario ni orden obligatorio. Lo único que conviene respetar es el ciclo
            dentro de cada sección, porque de él depende que la teoría se quede.
          </p>
          <ol className="tb-steps">
            <li>
              <span className="tb-stepn">Primero</span>
              <b>Apuesta sin saber</b>
              <p>
                Cada sección abre con una pregunta. Respóndela antes de leer nada, aunque vayas a
                ciegas: no se te dirá si has acertado.
              </p>
            </li>
            <li>
              <span className="tb-stepn">Después</span>
              <b>Lee buscando la respuesta</b>
              <p>
                La teoría viene a continuación. Al haber apostado, la lees con una pregunta
                concreta en la cabeza en lugar de en piloto automático.
              </p>
            </li>
            <li>
              <span className="tb-stepn">Al cerrar</span>
              <b>Destapa la resolución</b>
              <p>
                Al final de la sección se compara con lo que apostaste y, si fallaste, se explica
                por qué falla esa opción concreta.
              </p>
            </li>
            <li>
              <span className="tb-stepn">Con el tiempo</span>
              <b>Deja que vuelva</b>
              <p>
                Los ejercicios del capítulo alimentan el repaso espaciado: lo que fallas reaparece
                pronto y lo que dominas tarda cada vez más.
              </p>
            </li>
          </ol>
        </section>

        <section className="tb-contents" aria-labelledby="tb-contents-title">
          <h2 id="tb-contents-title">Índice general</h2>
          <p className="tb-hint">
            Pulsa un capítulo para abrirlo por el principio, o una sección concreta para saltar
            directamente a ella.
          </p>

          {bioThemes.map((theme) => {
            const isDone = completedThemes.includes(theme.number);
            const isHere = resume?.theme.number === theme.number;
            const score = scores[theme.number];
            return (
              <article className="tb-chap" key={theme.id}>
                <span className="tb-cn">Cap. {theme.number}</span>
                <div>
                  <button className="tb-ctitle" type="button" onClick={() => onOpenTheme(theme.number)}>
                    {theme.title}
                  </button>
                  <p className="tb-cmeta">
                    {theme.blocks.length} secciones
                    {isDone ? <> · <span className="tb-done">superado</span></> : null}
                    {isHere && !isDone ? <> · <span className="tb-here">ibas por aquí</span></> : null}
                    {!isDone && typeof score === "number" ? <> · última nota {score} %</> : null}
                  </p>
                </div>
                <ol className="tb-secs">
                  {theme.blocks.map((block, index) => (
                    <li key={block.id}>
                      <span className="tb-sn">
                        {theme.number}.{index + 1}
                      </span>
                      <button type="button" onClick={() => openSection(theme.number, block.id)}>
                        {block.title}
                      </button>
                    </li>
                  ))}
                </ol>
              </article>
            );
          })}
        </section>

        <section className="tb-appendix" aria-labelledby="tb-appendix-title">
          <h2 id="tb-appendix-title">Apéndices</h2>
          <ul className="tb-tools">
            <li>
              <button type="button" onClick={onOpenReview}>Repaso de hoy</button>
              <p>
                La cola de repetición espaciada con las preguntas de los doce capítulos. Devuelve
                cada una cuando toca volver a verla.
              </p>
            </li>
            <li>
              <button type="button" onClick={onOpenLab}>Laboratorio molecular</button>
              <p>
                Construye moléculas átomo a átomo y comprueba la tetravalencia sobre el dibujo, no
                sobre el papel.
              </p>
            </li>
            <li>
              <button type="button" onClick={onOpenNomenclature}>Gimnasio de nomenclatura</button>
              <p>
                Práctica libre de nombrar y formular, con muchas variantes seguidas y filtros por
                familia.
              </p>
            </li>
          </ul>
        </section>

        <section className="tb-appendix" aria-labelledby="tb-routes-title">
          <h2 id="tb-routes-title">Itinerarios transversales</h2>
          <p className="tb-hint">
            Recorridos que atraviesan varios capítulos siguiendo una misma molécula. Útiles
            cuando ya has leído las partes y quieres ver cómo encajan.
          </p>
          <ol className="tb-plist">
            {integrationRoutes.map((route) => (
              <li key={route.id}>
                <span className="tb-pnum">{route.title}</span>
                <p className="tb-ptext">{route.description}</p>
                <p className="tb-cmeta">
                  {route.themeIds
                    .map((id) => themeFromId(id)?.number)
                    .filter((number): number is number => typeof number === "number")
                    .map((number) => `Cap. ${number}`)
                    .join(" · ")}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <ProgressBackup />
    </div>
  );
}

export default function BioCourse({
  completedThemes,
  scores,
  onOpenLab,
  onOpenReview,
  onOpenNomenclature,
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
      onOpenNomenclature={onOpenNomenclature}
      onOpenReview={onOpenReview}
      onOpenTheme={openTheme}
      scores={scores}
    />
  );
}
