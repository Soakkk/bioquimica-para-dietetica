# Bioquímica para Dietética

Curso web interactivo en español para estudiar los 12 temas de Bioquímica de la FP de Dietética. Sin calendario impuesto: se avanza al ritmo de cada persona y la app recuerda por dónde iba.

## Qué incluye

- Los 12 temas del temario: química del carbono, hidratos, lípidos, proteínas, ácidos nucleicos, agua y minerales, vitaminas, metabolismo, digestión y las rutas metabólicas principales.
- **Teoría explicada, no resumida**: 187 secciones y más de 400 párrafos escritos para entenderse de una lectura, con ejemplos resueltos paso a paso.
- **Dos formas de leer la misma lección**, con un conmutador en cada tema:
  - *Lectura continua*: todo seguido, para leer del tirón.
  - *Paso a paso*: una idea por pantalla, con progreso guardado por tema.
- **Repaso con repetición espaciada**: 153 preguntas en una sola cola. Lo que fallas vuelve al día siguiente; lo que dominas tarda cada vez más en aparecer. Sin calendario que cumplir.
- **Explicación por opción**: no solo por qué la correcta lo es, sino por qué falla el distractor que elegiste.
- Recuerdo activo, casos aplicados a Dietética, evaluación inmediata y seguimiento del progreso.
- **Copia de seguridad**: el progreso vive en el navegador, y se puede exportar e importar como fichero para cambiar de dispositivo.
- Valores y terminología actuales, con una nota breve cuando el libro de referencia usa datos históricos (NADH ≈ 2,5 ATP, cetogénesis hepática sin SCOT, lipasa y 2-monoacilglicéridos, 7 clases EC...).
- Laboratorio molecular y gimnasio de nomenclatura para el Tema 1.

## Cómo está organizado el contenido

La teoría se escribe una sola vez, en `app/bio-course-sections.ts`, dividida en secciones. De esa única fuente salen las dos vistas: la lectura continua las encadena y el modo paso a paso las sirve de una en una. Añadir contenido no obliga a mantener dos versiones.

Un bloque sin secciones escritas sigue funcionando: el lector reconstruye la lectura a partir de las frases de `app/bio-course-data.ts`.

Las preguntas viven en dos sitios que se repasan juntos: las del temario en `app/bio-course-data.ts` y el banco ampliado en `app/bio-question-bank.ts`, este último con explicación para cada distractor. La programación de repasos está en `app/spaced-repetition.ts` (SM-2 simplificado).

## Publicación

`npm run build:static` genera `dist-static/`, que es la web completa sin servidor. GitHub Pages la publica en cada push desde `.github/workflows/deploy.yml`.

## Desarrollo local

```bash
npm install
npm run dev
npm test
```

Requiere Node.js 22.13 o posterior. El progreso se guarda localmente en el navegador.
