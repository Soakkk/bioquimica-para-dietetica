/**
 * Genera una versión estática del curso en `dist-static/`.
 *
 * La app es una sola ruta de cliente y navega por hash (#tema-3, #carbono),
 * así que un único index.html cubre el curso entero. Eso permite publicarla
 * en cualquier hosting de ficheros —GitHub Pages, Netlify, un pendrive— sin
 * servidor, sin Cloudflare y sin base de datos.
 */
import { spawn } from "node:child_process";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "dist-static");
const PORT = 4173;
const ORIGIN = `http://localhost:${PORT}`;

async function waitForServer(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(ORIGIN, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return;
    } catch {
      /* todavía arrancando */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`El servidor de producción no respondió en ${ORIGIN}`);
}

const server = spawn("npx", ["vinext", "start", "-p", String(PORT)], {
  cwd: root,
  stdio: "ignore",
  env: { ...process.env, WRANGLER_LOG_PATH: ".wrangler/wrangler.log" },
});

try {
  await waitForServer();

  const html = await (await fetch(ORIGIN)).text();
  if (!html.includes("Bioquímica")) {
    throw new Error("La página capturada no contiene el curso: revisa el build");
  }

  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  await cp(resolve(root, "dist/client"), out, { recursive: true });

  await writeFile(resolve(out, "index.html"), html, "utf8");
  // Cualquier ruta desconocida devuelve la misma app; el hash hace el resto.
  await writeFile(resolve(out, "404.html"), html, "utf8");
  // GitHub Pages sirve _next/ solo si se desactiva Jekyll.
  await writeFile(resolve(out, ".nojekyll"), "", "utf8");

  const size = Buffer.byteLength(html);
  console.log(`dist-static listo · index.html ${(size / 1024).toFixed(1)} kB + assets de dist/client`);
} finally {
  server.kill("SIGTERM");
}
