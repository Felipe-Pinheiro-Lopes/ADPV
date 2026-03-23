'use client'
import "@/src/app/globals.css";
import Sidebar from "@/src/components/Sidebar"; 
import { Toaster } from 'sonner' 
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function InternalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
      <div className="flex min-h-screen bg-slate-50">
        
        {/* Sidebar fixa à esquerda */}
        <aside className="w-64 fixed inset-y-0 z-50">
          <Sidebar />
        </aside>

        {/* Área de conteúdo ajustada:
          1. ml-64 empurra o conteúdo para fora da área da sidebar.
          2. p-8 adiciona respiro nas bordas.
          3. overflow-x-hidden evita quebras de layout horizontais.
        */}
        <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">
          <div className="p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>

      </div>

      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}