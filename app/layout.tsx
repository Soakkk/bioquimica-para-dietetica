import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://laboratorio-del-carbono.soakk.chatgpt.site"),
  title: "Bioquímica para Dietética — Curso interactivo",
  description: "Aprende bioquímica de forma visual y práctica: 12 temas, ruta de 3 semanas, ejercicios razonados y laboratorio molecular.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "Bioquímica para Dietética", description: "Comprende · Relaciona · Aplica", images: [{ url: "/og-bioquimica.png", width: 1536, height: 1024 }] },
  twitter: { card: "summary_large_image", title: "Bioquímica para Dietética", description: "Comprende · Relaciona · Aplica", images: ["/og-bioquimica.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
