import assert from "node:assert/strict";
import test from "node:test";

const expectedThemes = [
  "Química del carbono",
  "Hidratos de carbono",
  "Lípidos o grasas",
  "Proteínas",
  "Ácidos nucleicos",
  "Agua y sales minerales",
  "Vitaminas",
  "Introducción al metabolismo",
  "Digestión y absorción",
  "Metabolismo de los hidratos de carbono",
  "Metabolismo lipídico",
  "Metabolismo proteico",
];

const starterMarkers = [
  /Your site is taking shape/i,
  /Building your site/i,
  /Your first version will appear here/i,
  /react-loading-skeleton/i,
  /codex-preview/i,
  /_sites-preview/i,
];

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([\da-f]+);/gi, (_, value) =>
      String.fromCodePoint(Number.parseInt(value, 16)),
    )
    .replace(/&#(\d+);/g, (_, value) =>
      String.fromCodePoint(Number.parseInt(value, 10)),
    )
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

test("renderiza la identidad del curso de Bioquímica para Dietética", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  const text = visibleText(html);

  assert.match(html, /<html[^>]+lang=["']es["']/i);
  assert.match(
    html,
    /<title>\s*Bioquímica para Dietética\s+—\s+Curso interactivo\s*<\/title>/i,
  );
  assert.match(text, /Bioquímica para Dietética/i);
  assert.match(text, /Índice general/i);
});

test("la página inicial expone la ruta completa de doce temas", async () => {
  const response = await render();
  const text = visibleText(await response.text());

  for (const [index, theme] of expectedThemes.entries()) {
    assert.ok(
      text.includes(theme),
      `Falta el tema ${index + 1} en el HTML renderizado: ${theme}`,
    );
  }

  assert.match(text, /12 capítulos/i);
});

test("no vuelve a mostrar ni cargar la plantilla provisional", async () => {
  const response = await render();
  const html = await response.text();

  for (const marker of starterMarkers) {
    assert.doesNotMatch(html, marker);
  }
});
