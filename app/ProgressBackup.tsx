"use client";

import { useRef, useState } from "react";

/**
 * Copia de seguridad del progreso.
 *
 * El curso es una web estática: no hay servidor donde guardar nada, así que
 * todo vive en el navegador. Eso significa que se pierde si borras los datos
 * de navegación, y que no se comparte entre el móvil y el ordenador. Este
 * fichero es la forma de moverlo o recuperarlo.
 */

const KEYS = [
  "bioquimica-dietetica-progress-v1",
  "bio-srs-v1",
  "bio-reading-mode-v1",
  "bio-reading-step-v1",
  "carbon-lab-progress",
  "carbon-chain-branch-v1",
  "carbon-integrated-review-v1",
  "carbon-nomenclature-progress-v1",
  "carbon-nomenclature-puzzle-v1",
] as const;

type Backup = { formato: string; fecha: string; datos: Record<string, string> };

const FORMAT = "bioquimica-para-dietetica/progreso@1";

function collect(): Backup {
  const datos: Record<string, string> = {};
  for (const key of KEYS) {
    const value = localStorage.getItem(key);
    if (value !== null) datos[key] = value;
  }
  return { formato: FORMAT, fecha: new Date().toISOString(), datos };
}

export default function ProgressBackup() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const exportar = () => {
    try {
      const blob = new Blob([JSON.stringify(collect(), null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `progreso-bioquimica-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage({ tone: "ok", text: "Progreso descargado. Guarda ese fichero donde no lo pierdas." });
    } catch {
      setMessage({ tone: "error", text: "No se ha podido generar el fichero en este navegador." });
    }
  };

  const importar = async (file: File) => {
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (
        !parsed ||
        typeof parsed !== "object" ||
        (parsed as Backup).formato !== FORMAT ||
        typeof (parsed as Backup).datos !== "object"
      ) {
        setMessage({ tone: "error", text: "Ese fichero no es una copia de progreso de este curso." });
        return;
      }
      const datos = (parsed as Backup).datos;
      let restauradas = 0;
      for (const key of KEYS) {
        const value = datos[key];
        if (typeof value === "string") {
          localStorage.setItem(key, value);
          restauradas += 1;
        }
      }
      setMessage({
        tone: "ok",
        text: `Restauradas ${restauradas} secciones de progreso. Recarga la página para verlo aplicado.`,
      });
    } catch {
      setMessage({ tone: "error", text: "El fichero está dañado o no se ha podido leer." });
    }
  };

  return (
    <section className="backup" aria-labelledby="backup-title">
      <div>
        <h3 id="backup-title">Copia de seguridad del progreso</h3>
        <p>
          Tu progreso se guarda solo en este navegador. Descárgalo si vas a limpiar datos de navegación
          o si quieres seguir estudiando en otro dispositivo.
        </p>
      </div>
      <div className="backup__actions">
        <button className="lr-btn" type="button" onClick={exportar}>
          Descargar progreso
        </button>
        <button className="lr-btn" type="button" onClick={() => inputRef.current?.click()}>
          Restaurar desde fichero
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importar(file);
            event.target.value = "";
          }}
        />
      </div>
      {message ? (
        <p className={`backup__msg backup__msg--${message.tone}`} role="status" aria-live="polite">
          {message.text}
        </p>
      ) : null}
    </section>
  );
}
