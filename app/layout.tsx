import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kanban-pro-alisson.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kanban Pro | Gestão de Tarefas em Tempo Real",
    template: "%s | Kanban Pro",
  },
  description:
    "Aplicação Kanban com sincronização em tempo real via WebSocket, suporte offline-first com IndexedDB, drag and drop, gestão de projetos e equipe. Construída com Next.js, TypeScript e Socket.io.",
  keywords: [
    "Kanban",
    "Gestão de Tarefas",
    "Task Manager",
    "Next.js",
    "React",
    "TypeScript",
    "WebSocket",
    "Socket.io",
    "Offline First",
    "IndexedDB",
    "Dexie.js",
    "Drag and Drop",
    "Zustand",
    "Tailwind CSS",
    "Portfólio",
    "Desenvolvedor Front-end",
    "Full Stack",
    "Realtime",
    "PWA",
  ],
  authors: [{ name: "Alisson Aguiar", url: "https://github.com/Alisson-aguiar" }],
  creator: "Alisson Aguiar",
  publisher: "Alisson Aguiar",
  category: "Productivity",
  applicationName: "Kanban Pro",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Kanban Pro",
    title: "Kanban Pro | Gestão de Tarefas em Tempo Real",
    description:
      "Aplicação Kanban com sincronização em tempo real, suporte offline-first e arquitetura enterprise. Construída com Next.js, TypeScript e Socket.io.",
    images: [
      {
        url: "/images/tela_inicial.jpg",
        width: 1200,
        height: 630,
        alt: "Kanban Pro - Dashboard de Gestão de Tarefas",
        type: "image/jpeg",
      },
      {
        url: "/images/tela_com_projetos_membros_e_tarefas_a_fazer_em_progresso_e_concluido.jpg",
        width: 1200,
        height: 630,
        alt: "Kanban Pro - Board com Tarefas em Tempo Real",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kanban Pro | Gestão de Tarefas em Tempo Real",
    description:
      "Aplicação Kanban com sincronização em tempo real, offline-first e arquitetura enterprise.",
    images: ["/images/tela_inicial.jpg"],
    creator: "@alissonaguiar",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "SEU_CODIGO_GOOGLE_SEARCH_CONSOLE",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kanban Pro",
    description:
      "Aplicação Kanban com sincronização em tempo real, suporte offline-first e arquitetura enterprise.",
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Person",
      name: "Alisson Aguiar",
      url: "https://github.com/Alisson-aguiar",
      sameAs: [
        "https://github.com/Alisson-aguiar",
        "https://www.linkedin.com/in/alisson-aguiars2k/",
      ],
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
    },
  };

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/apple-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid #334155",
            },
          }}
        />
      </body>
    </html>
  );
}