'use client'
import Sidebar from '@/src/components/Sidebar'

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar fixa na esquerda */}
      <Sidebar />

      {/* O 'children' é a página (Dashboard ou Usuários) que vai preencher o resto da tela */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}