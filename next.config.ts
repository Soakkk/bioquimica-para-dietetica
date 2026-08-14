import type { NextConfig } from "next";

// GitHub Pages sirve el proyecto bajo /bioquimica-para-dietetica/, no en la raíz.
// El prefijo se pasa por entorno para que `npm run dev` siga funcionando en /.
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
